/**
 * AI-CHAT Sprint P1.5: Export Quote from AI Conversation
 *
 * POST /api/ai/chat/export-quote
 *
 * Extracts and validates quote data from an AI conversation,
 * transforms it to QuoteItem[] format, and returns it for
 * import into the quote wizard.
 */

import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { transformAiContextToQuoteData, isQuoteContextComplete } from '@/lib/ai-quote-transformer'
import { validateAiQuoteContext } from '@/lib/validations/ai-quote'
import { logger } from '@/lib/logger'

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    const body = await request.json()
    const { conversationId, sessionId } = body

    // Require either conversationId or sessionId
    if (!conversationId && !sessionId) {
      return NextResponse.json(
        { error: 'conversationId or sessionId is required' },
        { status: 400 }
      )
    }

    // Fetch conversation
    const whereClause = conversationId
      ? { id: conversationId }
      : {
          sessionId: sessionId || '',
          userId: session?.user?.id || undefined,
        }

    const conversation = await prisma.aiConversation.findFirst({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' },
          take: 50, // Last 50 messages for context
        },
      },
    })

    if (!conversation) {
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 })
    }

    // Extract quoteContext
    const quoteContext = conversation.quoteContext as any

    if (!quoteContext) {
      return NextResponse.json({ error: 'No quote data found in conversation' }, { status: 400 })
    }

    // Validate quote context
    const validation = validateAiQuoteContext(quoteContext)
    if (!validation.success) {
      logger.error('Quote context validation failed', {
        conversationId: conversation.id,
        errors: validation.errors,
      })

      return NextResponse.json(
        {
          error: 'Quote data is incomplete or invalid',
          details: validation.errors,
        },
        { status: 400 }
      )
    }

    // Check if quote is complete enough
    if (!isQuoteContextComplete(quoteContext)) {
      return NextResponse.json(
        {
          error: 'Quote data is incomplete',
          message: 'Need at least: product category and dimensions',
        },
        { status: 400 }
      )
    }

    // Transform to QuoteData format
    const quoteData = transformAiContextToQuoteData(quoteContext)

    if (!quoteData) {
      return NextResponse.json({ error: 'Failed to transform quote data' }, { status: 500 })
    }

    // Update conversation status
    await prisma.aiConversation.update({
      where: { id: conversation.id },
      data: {
        status: 'QUOTE_GENERATED',
      },
    })

    logger.info('Quote exported from AI conversation', {
      conversationId: conversation.id,
      itemCount: quoteData.items.length,
      hasCustomerData: !!quoteData.customerData,
      hasScheduleData: !!quoteData.scheduleData,
    })

    return NextResponse.json({
      success: true,
      data: quoteData,
      conversationId: conversation.id,
      message: 'Quote data ready for import',
    })
  } catch (error) {
    logger.error('Error exporting quote from AI conversation', { error })

    return NextResponse.json(
      {
        error: 'Failed to export quote',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

/**
 * GET /api/ai/chat/export-quote?conversationId=xxx
 *
 * Check if a conversation has exportable quote data
 * (useful for showing/hiding the "Finalize Quote" button)
 */
export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    const { searchParams } = new URL(request.url)
    const conversationId = searchParams.get('conversationId')
    const sessionId = searchParams.get('sessionId')

    if (!conversationId && !sessionId) {
      return NextResponse.json(
        { error: 'conversationId or sessionId is required' },
        { status: 400 }
      )
    }

    // Fetch conversation
    const whereClause = conversationId
      ? { id: conversationId }
      : {
          sessionId: sessionId || '',
          userId: session?.user?.id || undefined,
        }

    const conversation = await prisma.aiConversation.findFirst({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        quoteContext: true,
        status: true,
      },
    })

    if (!conversation) {
      return NextResponse.json(
        { canExport: false, reason: 'Conversation not found' },
        { status: 404 }
      )
    }

    const quoteContext = conversation.quoteContext as any
    const canExport = isQuoteContextComplete(quoteContext)

    // AI-CHAT Sprint P3.2: Include quoteContext for progress tracking
    return NextResponse.json({
      canExport,
      conversationId: conversation.id,
      status: conversation.status,
      itemCount: quoteContext?.items?.length || 0,
      quoteContext, // Include full context for progress calculation
    })
  } catch (error) {
    logger.error('Error checking quote export status', { error })

    return NextResponse.json(
      { canExport: false, error: 'Failed to check export status' },
      { status: 500 }
    )
  }
}
