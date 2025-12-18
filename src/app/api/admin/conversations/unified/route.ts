import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { logger } from '@/lib/logger'
import { getUnifiedCustomerContext } from '@/services/unified-context'

/**
 * OMNICHANNEL Sprint 1 - Task 3: Unified Timeline API
 *
 * GET /api/admin/conversations/unified
 * Retorna timeline unificada de conversas web + WhatsApp
 *
 * Query params:
 * - userId: ID do usuário
 * - phoneNumber: Telefone do cliente
 */
export async function GET(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const phoneNumber = searchParams.get('phoneNumber')

    if (!userId && !phoneNumber) {
      return NextResponse.json(
        { error: 'userId ou phoneNumber é obrigatório' },
        { status: 400 }
      )
    }

    logger.debug('[UNIFIED TIMELINE] Fetching for:', { userId, phoneNumber })

    // 1. Buscar contexto unificado
    const unifiedContext = await getUnifiedCustomerContext({
      userId: userId || undefined,
      phoneNumber: phoneNumber || undefined
    })

    if (!unifiedContext) {
      return NextResponse.json({
        messages: [],
        context: null
      })
    }

    // 2. Buscar mensagens do Web Chat
    const webMessages = await prisma.aiMessage.findMany({
      where: {
        conversationId: {
          in: unifiedContext.webConversations.map(c => c.id)
        }
      },
      orderBy: { createdAt: 'asc' },
      select: {
        id: true,
        role: true,
        content: true,
        createdAt: true,
        imageUrl: true,
        conversationId: true
      }
    })

    // 3. Buscar mensagens do WhatsApp
    const whatsappMessages = await prisma.message.findMany({
      where: {
        conversationId: {
          in: unifiedContext.whatsappConversations.map(c => c.id)
        }
      },
      orderBy: { createdAt: 'asc' },
      select: {
        id: true,
        senderType: true,
        content: true,
        createdAt: true,
        mediaUrl: true,
        status: true,
        conversationId: true
      }
    })

    // 4. Mesclar e ordenar mensagens
    const unifiedMessages = [
      // Web messages
      ...webMessages.map(msg => ({
        id: `web-${msg.id}`,
        channel: 'WEB' as const,
        role: msg.role as 'USER' | 'ASSISTANT' | 'SYSTEM',
        content: msg.content,
        timestamp: msg.createdAt,
        imageUrl: msg.imageUrl,
        conversationId: msg.conversationId
      })),
      // WhatsApp messages
      ...whatsappMessages.map(msg => ({
        id: `wa-${msg.id}`,
        channel: 'WHATSAPP' as const,
        role: (msg.senderType === 'CUSTOMER' ? 'USER' :
               msg.senderType === 'AI' ? 'ASSISTANT' : 'SYSTEM') as 'USER' | 'ASSISTANT' | 'SYSTEM',
        content: msg.content,
        timestamp: msg.createdAt,
        imageUrl: msg.mediaUrl,
        status: msg.status || undefined,
        conversationId: msg.conversationId
      }))
    ].sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())

    // 5. Preparar contexto para frontend
    const context = {
      customerName: unifiedContext.customerName,
      phone: unifiedContext.phoneNumber,
      email: unifiedContext.mergedContext.preferences?.email,
      totalInteractions: unifiedContext.mergedContext.totalInteractions,
      lastChannel: unifiedContext.mergedContext.lastChannel,
      items: unifiedContext.mergedContext.products?.map(product => ({
        category: product
      })),
      quotes: unifiedContext.quotes.map(quote => ({
        id: quote.id,
        number: quote.number,
        total: quote.total,
        status: quote.status
      }))
    }

    logger.info('[UNIFIED TIMELINE] Returned data:', {
      messagesCount: unifiedMessages.length,
      webCount: webMessages.length,
      whatsappCount: whatsappMessages.length,
      quotesCount: context.quotes.length
    })

    return NextResponse.json({
      messages: unifiedMessages,
      context
    })
  } catch (error) {
    logger.error('[UNIFIED TIMELINE] Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
