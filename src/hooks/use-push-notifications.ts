'use client'

import { useState, useEffect, useCallback } from 'react'
import { logger } from '@/lib/logger'

interface UsePushNotificationsReturn {
  isSupported: boolean
  isSubscribed: boolean
  isLoading: boolean
  permission: NotificationPermission
  subscribe: () => Promise<void>
  unsubscribe: () => Promise<void>
  requestPermission: () => Promise<NotificationPermission>
}

/**
 * Hook for managing push notification subscriptions
 */
export function usePushNotifications(): UsePushNotificationsReturn {
  const [isSupported, setIsSupported] = useState(false)
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [permission, setPermission] = useState<NotificationPermission>('default')
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null)

  // Check if push notifications are supported
  useEffect(() => {
    if (typeof window === 'undefined') return

    const supported =
      'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window

    setIsSupported(supported)
    setPermission(supported ? Notification.permission : 'denied')

    if (!supported) {
      setIsLoading(false)
      return
    }

    // Register service worker
    const registerServiceWorker = async () => {
      try {
        const reg = await navigator.serviceWorker.register('/sw.js')
        setRegistration(reg)

        // Check if already subscribed
        const subscription = await reg.pushManager.getSubscription()
        setIsSubscribed(!!subscription)

        logger.debug('Service Worker registered for push notifications', {
          subscribed: !!subscription,
        })
      } catch (error) {
        logger.error('Error registering Service Worker:', error)
      } finally {
        setIsLoading(false)
      }
    }

    registerServiceWorker()
  }, [])

  /**
   * Request notification permission from user
   */
  const requestPermission = useCallback(async (): Promise<NotificationPermission> => {
    if (!isSupported) {
      return 'denied'
    }

    try {
      const result = await Notification.requestPermission()
      setPermission(result)
      return result
    } catch (error) {
      logger.error('Error requesting notification permission:', error)
      return 'denied'
    }
  }, [isSupported])

  /**
   * Subscribe to push notifications
   */
  const subscribe = useCallback(async () => {
    if (!isSupported || !registration) {
      throw new Error('Push notifications not supported')
    }

    setIsLoading(true)

    try {
      // Request permission if not granted
      if (permission !== 'granted') {
        const result = await requestPermission()
        if (result !== 'granted') {
          throw new Error('Notification permission denied')
        }
      }

      // Get VAPID public key from server
      const response = await fetch('/api/push/vapid-public-key')
      if (!response.ok) {
        throw new Error('Failed to get VAPID public key')
      }

      const { publicKey } = await response.json()

      // Convert VAPID key to Uint8Array
      const convertedVapidKey = urlBase64ToUint8Array(publicKey)

      // Subscribe to push notifications
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: convertedVapidKey as BufferSource,
      })

      // Send subscription to server
      const subscribeResponse = await fetch('/api/push/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subscription: subscription.toJSON(),
        }),
      })

      if (!subscribeResponse.ok) {
        throw new Error('Failed to save subscription')
      }

      setIsSubscribed(true)
      logger.info('Push notification subscription successful')
    } catch (error) {
      logger.error('Error subscribing to push notifications:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [isSupported, registration, permission, requestPermission])

  /**
   * Unsubscribe from push notifications
   */
  const unsubscribe = useCallback(async () => {
    if (!isSupported || !registration) {
      throw new Error('Push notifications not supported')
    }

    setIsLoading(true)

    try {
      const subscription = await registration.pushManager.getSubscription()

      if (!subscription) {
        setIsSubscribed(false)
        return
      }

      // Unsubscribe from push manager
      await subscription.unsubscribe()

      // Remove from server
      await fetch('/api/push/unsubscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          endpoint: subscription.endpoint,
        }),
      })

      setIsSubscribed(false)
      logger.info('Push notification unsubscription successful')
    } catch (error) {
      logger.error('Error unsubscribing from push notifications:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [isSupported, registration])

  return {
    isSupported,
    isSubscribed,
    isLoading,
    permission,
    subscribe,
    unsubscribe,
    requestPermission,
  }
}

/**
 * Convert VAPID public key from base64 to Uint8Array
 */
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')

  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }

  return outputArray
}
