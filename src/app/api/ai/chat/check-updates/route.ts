import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { logger } from '@/lib/logger'

/**
 * OMNICHANNEL Sprint 1 - Task 4: Cross-Channel Notifications
 *
 * GET /api/ai/chat/check-updates?conversationId=xxx
 * Verifica se há mensagens WhatsApp novas para conversa web linkada
 *
 * Usado pelo frontend para polling (10s) e notificar cliente web
 * de respostas que chegaram via WhatsApp
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const conversationId = searchParams.get('conversationId')
    const lastChecked = searchParams.get('lastChecked')

    if (!conversationId) {
      return NextResponse.json({ error: 'conversationId é obrigatório' }, { status: 400 })
    }

    logger.debug('[CHECK UPDATES] Checking for:', { conversationId, lastChecked })

    // 1. Buscar conversa web
    const aiConvo = await prisma.aiConversation.findUnique({
      where: { id: conversationId },
      select: {
        quoteId: true,
        updatedAt: true,
      },
    })

    if (!aiConvo || !aiConvo.quoteId) {
      // Sem link Quote/WhatsApp, não há atualizações
      return NextResponse.json({
        hasUpdate: false,
        hasWhatsAppUpdate: false,
      })
    }

    // 2. Buscar conversa WhatsApp vinculada pelo quoteId
    const whatsappConvo = await prisma.conversation.findFirst({
      where: { quoteId: aiConvo.quoteId },
      select: { id: true },
    })

    if (!whatsappConvo) {
      // Sem conversa WhatsApp vinculada
      return NextResponse.json({
        hasUpdate: false,
        hasWhatsAppUpdate: false,
      })
    }

    // 3. Buscar última mensagem WhatsApp
    const lastWhatsAppMessage = await prisma.message.findFirst({
      where: {
        conversationId: whatsappConvo.id,
        direction: 'OUTBOUND', // Mensagens enviadas (resposta do admin/IA)
        ...(lastChecked && {
          createdAt: {
            gt: new Date(lastChecked),
          },
        }),
      },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        content: true,
        createdAt: true,
        senderType: true,
      },
    })

    if (!lastWhatsAppMessage) {
      return NextResponse.json({
        hasUpdate: false,
        hasWhatsAppUpdate: false,
      })
    }

    // 3. Verificar se é nova (posterior ao lastChecked)
    const isNew = !lastChecked || lastWhatsAppMessage.createdAt > new Date(lastChecked)

    if (!isNew) {
      return NextResponse.json({
        hasUpdate: false,
        hasWhatsAppUpdate: false,
      })
    }

    logger.info('[CHECK UPDATES] New WhatsApp message found:', {
      messageId: lastWhatsAppMessage.id,
      conversationId,
    })

    // 4. Retornar atualização
    return NextResponse.json({
      hasUpdate: true,
      hasWhatsAppUpdate: true,
      latestMessage: {
        id: lastWhatsAppMessage.id,
        content: lastWhatsAppMessage.content,
        timestamp: lastWhatsAppMessage.createdAt,
        senderType: lastWhatsAppMessage.senderType,
      },
    })
  } catch (error) {
    logger.error('[CHECK UPDATES] Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
