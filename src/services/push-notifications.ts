import { prisma } from '@/lib/prisma'
import { logger } from '@/lib/logger'
import webpush from 'web-push'

// Configure VAPID keys (should be in env)
const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || ''
const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY || ''
const vapidEmail = process.env.VAPID_EMAIL || 'noreply@versatiglass.com.br'

if (vapidPublicKey && vapidPrivateKey) {
  webpush.setVapidDetails(`mailto:${vapidEmail}`, vapidPublicKey, vapidPrivateKey)
}

export interface PushSubscriptionData {
  endpoint: string
  keys: {
    p256dh: string
    auth: string
  }
}

export interface PushNotificationPayload {
  title: string
  body: string
  icon?: string
  badge?: string
  url?: string
  actions?: Array<{
    action: string
    title: string
  }>
}

/**
 * Subscribe a user to push notifications
 */
export async function subscribeToPush(
  userId: string,
  subscription: PushSubscriptionData,
  userAgent?: string
) {
  try {
    // Check if subscription already exists for this endpoint
    const existing = await prisma.pushSubscription.findUnique({
      where: { endpoint: subscription.endpoint },
    })

    if (existing) {
      // Update existing subscription
      await prisma.pushSubscription.update({
        where: { endpoint: subscription.endpoint },
        data: {
          userId,
          p256dh: subscription.keys.p256dh,
          auth: subscription.keys.auth,
          userAgent,
          updatedAt: new Date(),
        },
      })

      logger.info('Push subscription updated', { userId, endpoint: subscription.endpoint })
      return existing
    }

    // Create new subscription
    const newSubscription = await prisma.pushSubscription.create({
      data: {
        userId,
        endpoint: subscription.endpoint,
        p256dh: subscription.keys.p256dh,
        auth: subscription.keys.auth,
        userAgent,
      },
    })

    logger.info('Push subscription created', { userId, endpoint: subscription.endpoint })
    return newSubscription
  } catch (error) {
    logger.error('Error subscribing to push notifications:', error)
    throw error
  }
}

/**
 * Unsubscribe from push notifications
 */
export async function unsubscribeFromPush(endpoint: string) {
  try {
    await prisma.pushSubscription.delete({
      where: { endpoint },
    })

    logger.info('Push subscription deleted', { endpoint })
  } catch (error) {
    logger.error('Error unsubscribing from push notifications:', error)
    throw error
  }
}

/**
 * Send push notification to a specific user
 */
export async function sendPushToUser(userId: string, payload: PushNotificationPayload) {
  try {
    // Get all active subscriptions for this user
    const subscriptions = await prisma.pushSubscription.findMany({
      where: { userId },
    })

    if (subscriptions.length === 0) {
      logger.debug('No push subscriptions found for user', { userId })
      return
    }

    const notificationPayload = JSON.stringify({
      title: payload.title,
      body: payload.body,
      icon: payload.icon || '/icons/icon-192x192.png',
      badge: payload.badge || '/icons/badge-72x72.png',
      url: payload.url || '/',
      actions: payload.actions || [],
    })

    // Send to all user's subscriptions
    const results = await Promise.allSettled(
      subscriptions.map(async (sub) => {
        const pushSubscription = {
          endpoint: sub.endpoint,
          keys: {
            p256dh: sub.p256dh,
            auth: sub.auth,
          },
        }

        try {
          await webpush.sendNotification(pushSubscription, notificationPayload)
          logger.debug('Push notification sent', { userId, endpoint: sub.endpoint })
        } catch (error) {
          // If subscription is no longer valid (410 Gone), remove it
          if (error instanceof Error && 'statusCode' in error && error.statusCode === 410) {
            await prisma.pushSubscription.delete({
              where: { endpoint: sub.endpoint },
            })
            logger.info('Removed expired push subscription', { endpoint: sub.endpoint })
          } else {
            logger.error('Error sending push notification:', error)
          }
          throw error
        }
      })
    )

    const successful = results.filter((r) => r.status === 'fulfilled').length
    const failed = results.filter((r) => r.status === 'rejected').length

    logger.info('Push notifications sent', {
      userId,
      successful,
      failed,
      total: subscriptions.length,
    })
  } catch (error) {
    logger.error('Error sending push notifications to user:', error)
    throw error
  }
}

/**
 * Send push notification to multiple users
 */
export async function sendPushToUsers(userIds: string[], payload: PushNotificationPayload) {
  const results = await Promise.allSettled(userIds.map((userId) => sendPushToUser(userId, payload)))

  const successful = results.filter((r) => r.status === 'fulfilled').length
  const failed = results.filter((r) => r.status === 'rejected').length

  logger.info('Bulk push notifications sent', { successful, failed, total: userIds.length })

  return { successful, failed, total: userIds.length }
}

/**
 * Get user's active push subscriptions
 */
export async function getUserPushSubscriptions(userId: string) {
  return prisma.pushSubscription.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  })
}

/**
 * Check if user has push notifications enabled
 */
export async function hasPushSubscription(userId: string): Promise<boolean> {
  const count = await prisma.pushSubscription.count({
    where: { userId },
  })

  return count > 0
}
