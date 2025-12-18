import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { logger } from '@/lib/logger'

// Get all conversations (for admin dashboard)
export async function GET(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!['ADMIN', 'STAFF'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')

    // Build filter
    const where: Record<string, unknown> = {}

    if (status === 'active') {
      where.status = { in: ['ACTIVE', 'WAITING_HUMAN'] }
    } else if (status === 'waiting') {
      where.status = 'WAITING_HUMAN'
    } else if (status === 'closed') {
      where.status = 'CLOSED'
    }

    // Get conversations with pagination
    const [conversations, total] = await Promise.all([
      prisma.conversation.findMany({
        where,
        include: {
          messages: {
            orderBy: { createdAt: 'desc' },
            take: 1,
          },
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          assignedTo: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: { lastMessageAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.conversation.count({ where }),
    ])

    // Count by status
    const [activeCount, waitingCount, closedCount] = await Promise.all([
      prisma.conversation.count({ where: { status: 'ACTIVE' } }),
      prisma.conversation.count({ where: { status: 'WAITING_HUMAN' } }),
      prisma.conversation.count({ where: { status: 'CLOSED' } }),
    ])

    return NextResponse.json({
      conversations,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      stats: {
        active: activeCount,
        waiting: waitingCount,
        closed: closedCount,
      },
    })
  } catch (error) {
    logger.error('Get conversations error:', error)
    return NextResponse.json({ error: 'Failed to get conversations' }, { status: 500 })
  }
}
