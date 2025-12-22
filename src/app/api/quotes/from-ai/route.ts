/**
 * AI-CHAT Sprint P2.1: Auto-Generate Quote from AI Conversation
 *
 * POST /api/quotes/from-ai
 *
 * Creates a Quote record in the database directly from an AI conversation.
 * Links the Quote to the AiConversation.
 *
 * NOTE: This creates a DRAFT quote that requires admin review and pricing.
 * The AI estimates are not stored - admin will set final prices.
 */

import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { transformAiContextToQuoteData } from '@/lib/ai-quote-transformer'
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

    // Fetch conversation with quoteContext
    const whereClause = conversationId
      ? { id: conversationId }
      : {
          sessionId: sessionId || '',
          userId: session?.user?.id || undefined,
        }

    const conversation = await prisma.aiConversation.findFirst({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
    })

    if (!conversation) {
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 })
    }

    // Extract and validate quoteContext
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

    // Transform to QuoteData format
    const quoteData = transformAiContextToQuoteData(quoteContext)

    if (!quoteData || !quoteData.items || quoteData.items.length === 0) {
      return NextResponse.json({ error: 'Failed to transform quote data' }, { status: 500 })
    }

    // Check if Quote already exists for this conversation
    if (conversation.quoteId) {
      const existingQuote = await prisma.quote.findUnique({
        where: { id: conversation.quoteId },
      })

      if (existingQuote) {
        return NextResponse.json({
          success: true,
          quote: existingQuote,
          message: 'Quote already exists for this conversation',
          isExisting: true,
        })
      }
    }

    // Generate quote number
    const quoteCount = await prisma.quote.count()
    const quoteNumber = `VG-${String(quoteCount + 1).padStart(5, '0')}`

    // Prepare customer data
    const customerData = quoteData.customerData || {}
    const customerName = customerData.name || 'Cliente'
    const customerEmail = customerData.email || ''
    const customerPhone = customerData.phone || ''

    // Service address (where the product will be installed)
    const serviceStreet = customerData.street || ''
    const serviceNumber = customerData.number || 's/n'
    const serviceComplement = customerData.complement || undefined
    const serviceNeighborhood = customerData.neighborhood || ''
    const serviceCity = customerData.city || ''
    const serviceState = customerData.state || ''
    const serviceZipCode = customerData.zipCode || ''

    // Determine userId - use session if logged in, or find/create user by email
    let userId = session?.user?.id

    if (!userId && customerEmail) {
      // Try to find existing user by email
      const existingUser = await prisma.user.findUnique({
        where: { email: customerEmail.toLowerCase() },
      })

      if (existingUser) {
        userId = existingUser.id
      } else {
        // Create a new user without password (they can set it later)
        const newUser = await prisma.user.create({
          data: {
            email: customerEmail.toLowerCase(),
            name: customerName,
            phone: customerPhone || null,
            street: serviceStreet || null,
            number: serviceNumber || null,
            complement: serviceComplement || null,
            neighborhood: serviceNeighborhood || null,
            city: serviceCity || null,
            state: serviceState || null,
            zipCode: serviceZipCode || null,
          },
        })
        userId = newUser.id
        logger.info('Created new user for quote', { userId: newUser.id, email: customerEmail })
      }
    }

    // If still no userId, return error - we need a user to create a quote
    if (!userId) {
      return NextResponse.json(
        { error: 'Email do cliente é obrigatório para criar o orçamento' },
        { status: 400 }
      )
    }

    // Create Quote with items (transaction to ensure atomicity)
    const quote = await prisma.$transaction(async (tx) => {
      // Create the Quote
      const newQuote = await tx.quote.create({
        data: {
          number: quoteNumber,
          userId,
          customerName,
          customerEmail,
          customerPhone,
          serviceStreet,
          serviceNumber,
          serviceComplement,
          serviceNeighborhood,
          serviceCity,
          serviceState,
          serviceZipCode,
          subtotal: 0, // Will be calculated by admin
          total: 0, // Will be calculated by admin
          status: 'DRAFT',
          source: 'WEBSITE',
          customerNotes: `Gerado automaticamente via Chat IA\nID da Conversa: ${conversation.id}`,
          internalNotes: `Dados coletados pela IA:\n${JSON.stringify(quoteContext, null, 2)}`,
          validUntil: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days
        },
      })

      // Create QuoteItems
      await Promise.all(
        quoteData.items.map((item) => {
          // Build description from item details
          const desc = `${item.productName || 'Produto'} - ${item.category}`
          const specs = [
            item.glassType && `Vidro: ${item.glassType}`,
            item.glassColor && `Cor: ${item.glassColor}`,
            item.model && `Modelo: ${item.model}`,
            item.finishLine && `Linha: ${item.finishLine}`,
          ]
            .filter(Boolean)
            .join(', ')

          return tx.quoteItem.create({
            data: {
              quoteId: newQuote.id,
              productId: null, // Will be set by admin
              description: desc,
              specifications: specs || null,
              width: item.width || null,
              height: item.height || null,
              quantity: item.quantity || 1,
              color: item.color || null,
              thickness: item.thickness || null,
              finish: item.finish || null,
              unitPrice: 0, // To be set by admin
              totalPrice: 0, // To be calculated by admin
              customerImages: item.images || [],
            },
          })
        })
      )

      return newQuote
    })

    // Link Quote to AiConversation
    await prisma.aiConversation.update({
      where: { id: conversation.id },
      data: {
        quoteId: quote.id,
        status: 'QUOTE_GENERATED',
      },
    })

    logger.info('Quote auto-generated from AI conversation', {
      conversationId: conversation.id,
      quoteId: quote.id,
      quoteNumber: quote.number,
      itemCount: quoteData.items.length,
      hasEmail: !!customerEmail,
    })

    return NextResponse.json({
      success: true,
      quote: {
        id: quote.id,
        number: quote.number,
        status: quote.status,
        itemCount: quoteData.items.length,
      },
      message: 'Quote criado com sucesso - aguarda precificação do admin',
    })
  } catch (error) {
    logger.error('Error auto-generating quote from AI conversation', { error })

    return NextResponse.json(
      {
        error: 'Failed to create quote',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
