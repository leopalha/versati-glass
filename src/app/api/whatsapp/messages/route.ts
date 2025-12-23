import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { logger } from '@/lib/logger'

/**
 * GET /api/whatsapp/messages
 * Get unread WhatsApp messages count by conversation
 * Only accessible by admins and staff
 */
export async function GET() {
  try {
    const session = await auth()

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Only admin and staff can access WhatsApp messages
    if (!['ADMIN', 'STAFF'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Get all active conversations
    const conversations = await prisma.conversation.findMany({
      where: {
        status: 'ACTIVE',
      },
      select: {
        id: true,
        phoneNumber: true,
        customerName: true,
        lastMessageAt: true,
      },
      orderBy: {
        lastMessageAt: 'desc',
      },
    })

    // Get recent inbound messages for each conversation (from last 24h)
    const conversationsWithUnread = await Promise.all(
      conversations.map(async (conv) => {
        const messages = await prisma.message.findMany({
          where: {
            conversationId: conv.id,
            direction: 'INBOUND',
            // Consider messages from last 24 hours as "unread"
            createdAt: {
              gte: new Date(Date.now() - 24 * 60 * 60 * 1000),
            },
          },
          select: {
            id: true,
            createdAt: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
        })

        return {
          conversationId: conv.id,
          phoneNumber: conv.phoneNumber,
          customerName: conv.customerName,
          lastMessageAt: conv.lastMessageAt,
          unreadCount: messages.length,
          lastInboundMessage: messages[0]?.createdAt || null,
        }
      })
    )

    // Calculate total unread
    const totalUnread = conversationsWithUnread.reduce((sum, conv) => sum + conv.unreadCount, 0)

    return NextResponse.json({
      conversations: conversationsWithUnread,
      totalUnread,
    })
  } catch (error) {
    logger.error('Error fetching WhatsApp messages:', error)
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 })
  }
}
