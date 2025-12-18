/**
 * AI-CHAT Sprint P4.2: Conversation Export to CSV
 *
 * GET /api/ai/chat/export-csv?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD&status=ACTIVE&category=BOX
 *
 * Exports AI conversations to CSV format for analysis:
 * - Filter by date range, status, product category
 * - Include conversation metadata and message history
 * - Useful for AI model training and business insights
 */

import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { logger } from '@/lib/logger'

export async function GET(request: NextRequest) {
  try {
    // Require admin authentication
    const session = await auth()
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    const status = searchParams.get('status')
    const category = searchParams.get('category')

    // Build where clause
    const whereClause: any = {}

    // Date filters
    if (startDate || endDate) {
      whereClause.createdAt = {}
      if (startDate) {
        whereClause.createdAt.gte = new Date(startDate)
      }
      if (endDate) {
        const endDateTime = new Date(endDate)
        endDateTime.setHours(23, 59, 59, 999) // Include full day
        whereClause.createdAt.lte = endDateTime
      }
    }

    // Status filter
    if (status && ['ACTIVE', 'QUOTE_GENERATED', 'ABANDONED', 'CLOSED'].includes(status)) {
      whereClause.status = status
    }

    // Fetch conversations
    const conversations = await prisma.aiConversation.findMany({
      where: whereClause,
      include: {
        messages: {
          orderBy: { createdAt: 'asc' },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    // Filter by category if specified (requires checking quoteContext)
    let filteredConversations = conversations

    if (category) {
      filteredConversations = conversations.filter((conv) => {
        const quoteContext = conv.quoteContext as {
          items?: Array<{ category?: string }>
        } | null

        if (!quoteContext?.items) return false

        return quoteContext.items.some((item) => item.category === category)
      })
    }

    // Build CSV content
    const csvRows: string[] = []

    // Header
    csvRows.push(
      [
        'Conversation ID',
        'Session ID',
        'Status',
        'Customer Name',
        'Customer Email',
        'Customer Phone',
        'Created At',
        'Updated At',
        'Duration (minutes)',
        'Total Messages',
        'User Messages',
        'AI Messages',
        'Images Count',
        'Total Tokens',
        'Has Quote',
        'Quote ID',
        'Categories Requested',
        'First Message',
        'Last Message',
        'Full Conversation',
      ].join(',')
    )

    // Data rows
    for (const conv of filteredConversations) {
      const userMessages = conv.messages.filter((m) => m.role === 'USER')
      const aiMessages = conv.messages.filter((m) => m.role === 'ASSISTANT')
      const imagesCount = conv.messages.filter((m) => m.imageUrl).length

      // Calculate duration
      const duration =
        conv.messages.length > 1
          ? Math.round(
              (conv.messages[conv.messages.length - 1].createdAt.getTime() -
                conv.messages[0].createdAt.getTime()) /
                60000
            )
          : 0

      // Calculate total tokens
      const totalTokens = conv.messages.reduce((acc, msg) => {
        const metadata = msg.metadata as { tokensUsed?: number } | null
        return acc + (metadata?.tokensUsed || 0)
      }, 0)

      // Extract categories
      const quoteContext = conv.quoteContext as {
        items?: Array<{ category?: string }>
      } | null
      const categories =
        quoteContext?.items
          ?.map((item) => item.category)
          .filter(Boolean)
          .join('; ') || ''

      // Get first and last messages
      const firstMessage = conv.messages[0]?.content.replace(/[\r\n,]/g, ' ').slice(0, 100) || ''
      const lastMessage =
        conv.messages[conv.messages.length - 1]?.content.replace(/[\r\n,]/g, ' ').slice(0, 100) ||
        ''

      // Build full conversation (for training/analysis)
      const fullConversation = conv.messages
        .map((m) => {
          const role = m.role === 'USER' ? 'User' : 'AI'
          const content = m.content.replace(/[\r\n]/g, ' ')
          return `[${role}] ${content}`
        })
        .join(' | ')
        .replace(/,/g, ';') // Replace commas to avoid CSV issues

      csvRows.push(
        [
          conv.id,
          conv.sessionId,
          conv.status,
          csvEscape(conv.user?.name || 'Anonymous'),
          conv.user?.email || '',
          conv.user?.phone || '',
          conv.createdAt.toISOString(),
          conv.updatedAt.toISOString(),
          duration.toString(),
          conv.messages.length.toString(),
          userMessages.length.toString(),
          aiMessages.length.toString(),
          imagesCount.toString(),
          totalTokens.toString(),
          conv.quoteId ? 'Yes' : 'No',
          conv.quoteId || '',
          csvEscape(categories),
          csvEscape(firstMessage),
          csvEscape(lastMessage),
          csvEscape(fullConversation),
        ].join(',')
      )
    }

    const csvContent = csvRows.join('\n')

    // Generate filename with timestamp
    const timestamp = new Date().toISOString().split('T')[0]
    const filename = `ai-conversations-${timestamp}.csv`

    logger.info('CSV export generated', {
      conversationsCount: filteredConversations.length,
      filters: { startDate, endDate, status, category },
      exportedBy: session.user.email,
    })

    // Return CSV file
    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    })
  } catch (error) {
    logger.error('Error exporting conversations to CSV', { error })

    return NextResponse.json(
      {
        error: 'Failed to export conversations',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

/**
 * Helper function to escape CSV values
 */
function csvEscape(value: string): string {
  if (!value) return ''

  // If value contains comma, newline, or quotes, wrap in quotes and escape internal quotes
  if (value.includes(',') || value.includes('\n') || value.includes('"')) {
    return `"${value.replace(/"/g, '""')}"`
  }

  return value
}
