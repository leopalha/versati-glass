import { NextRequest, NextResponse } from 'next/server'
import {
  parseIncomingMessage,
  validateTwilioSignature,
  generateTwiMLResponse,
} from '@/services/whatsapp'
import { processIncomingMessage } from '@/services/conversation'
import { logger } from '@/lib/logger'
import { prisma } from '@/lib/prisma'
import { linkWebChatToWhatsApp } from '@/services/unified-context'

// Twilio sends webhooks as POST requests
export async function POST(request: NextRequest) {
  try {
    // Get the raw body for signature validation
    const formData = await request.formData()
    const body: Record<string, string> = {}

    formData.forEach((value, key) => {
      body[key] = value.toString()
    })

    // Validate Twilio signature in production
    if (process.env.NODE_ENV === 'production') {
      const signature = request.headers.get('x-twilio-signature')
      const url = request.url

      if (!signature || !validateTwilioSignature(signature, url, body)) {
        logger.error('Invalid Twilio signature')
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }
    }

    // Parse the incoming message
    const incomingMessage = parseIncomingMessage(body)

    logger.debug('Incoming WhatsApp message:', {
      from: incomingMessage.from,
      body: incomingMessage.body,
      profileName: incomingMessage.profileName,
      numMedia: incomingMessage.numMedia,
    })

    // NOTIF.2: Salvar mensagem recebida no banco
    const savedMessage = await prisma.whatsAppMessage.create({
      data: {
        messageId: body.MessageSid || `msg_${Date.now()}`,
        from: incomingMessage.from,
        to: body.To?.replace('whatsapp:', '') || process.env.TWILIO_WHATSAPP_NUMBER || '',
        body: incomingMessage.body,
        direction: 'INBOUND',
        status: 'DELIVERED',
        mediaUrl: incomingMessage.mediaUrls[0] || null,
      },
    })

    // Tentar vincular com usuário existente
    const user = await prisma.user.findFirst({
      where: {
        phone: {
          contains: incomingMessage.from.replace('+55', '').replace(/\D/g, ''),
        },
      },
    })

    if (user) {
      await prisma.whatsAppMessage.update({
        where: { id: savedMessage.id },
        data: { userId: user.id },
      })
    }

    // OMNICHANNEL: Detectar conversa web existente para link reverso
    const normalizedPhone = incomingMessage.from.replace(/\D/g, '')
    const last10Digits = normalizedPhone.slice(-10) // Últimos 10 dígitos

    logger.debug('[WEBHOOK] Checking for existing web chat:', {
      normalizedPhone,
      last10Digits,
    })

    const existingWebChat = await prisma.aiConversation.findFirst({
      where: {
        linkedPhone: {
          contains: last10Digits,
        },
        status: { in: ['ACTIVE', 'QUOTE_GENERATED'] },
        whatsappConversationId: null, // Ainda não linkado
      },
      orderBy: { createdAt: 'desc' },
    })

    if (existingWebChat) {
      logger.info('[WEBHOOK] Auto-linking web chat to WhatsApp', {
        aiConversationId: existingWebChat.id,
        phone: normalizedPhone,
      })

      await linkWebChatToWhatsApp(existingWebChat.id, normalizedPhone)
    }

    // Process the message and generate AI response
    // (processIncomingMessage já busca unified context internamente)
    const result = await processIncomingMessage(
      incomingMessage.from,
      incomingMessage.body,
      incomingMessage.profileName,
      incomingMessage.mediaUrls[0]
    )

    logger.debug('AI Response:', {
      conversationId: result.conversation.id,
      status: result.conversation.status,
      responseLength: result.response.length,
    })

    // Return TwiML response (empty because we send via API)
    return new NextResponse(generateTwiMLResponse(), {
      headers: {
        'Content-Type': 'text/xml',
      },
    })
  } catch (error) {
    logger.error('WhatsApp webhook error:', error)

    // Return empty TwiML to avoid Twilio retries
    return new NextResponse(generateTwiMLResponse(), {
      headers: {
        'Content-Type': 'text/xml',
      },
    })
  }
}

// Twilio also sends GET requests to verify the webhook
export async function GET() {
  return NextResponse.json({ status: 'ok', service: 'Versati Glass WhatsApp' })
}
