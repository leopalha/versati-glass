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

    // NOTIF.2: Log mensagem recebida
    logger.info('[WEBHOOK] WhatsApp message received', {
      messageId: body.MessageSid || `msg_${Date.now()}`,
      from: incomingMessage.from,
      to: body.To?.replace('whatsapp:', '') || process.env.TWILIO_WHATSAPP_NUMBER || '',
      body: incomingMessage.body,
      mediaUrl: incomingMessage.mediaUrls[0] || null,
    })

    // Save incoming WhatsApp message to dedicated table
    const twilioMessageId = body.MessageSid || `msg_${Date.now()}`
    const messageTimestamp = body.DateCreated ? new Date(body.DateCreated) : new Date()

    // Tentar vincular com usuário existente
    const user = await prisma.user.findFirst({
      where: {
        phone: {
          contains: incomingMessage.from.replace('+55', '').replace(/\D/g, ''),
        },
      },
    })

    // OMNICHANNEL: Detectar conversa web existente para link reverso
    const normalizedPhone = incomingMessage.from.replace(/\D/g, '')
    const last10Digits = normalizedPhone.slice(-10) // Últimos 10 dígitos

    logger.debug('[WEBHOOK] Checking for existing web chat:', {
      normalizedPhone,
      last10Digits,
    })

    const existingWebChat = await prisma.aiConversation.findFirst({
      where: {
        customerPhone: {
          contains: last10Digits,
        },
        status: { in: ['ACTIVE', 'QUOTE_GENERATED'] },
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

    // Save WhatsApp message to dedicated table after conversation is created
    try {
      await prisma.$executeRaw`
        INSERT INTO whatsapp_messages (
          id, "conversationId", "messageId", "from", "to", body, "mediaUrl",
          status, direction, timestamp, "createdAt"
        )
        VALUES (
          ${crypto.randomUUID()},
          ${result.conversation.id},
          ${twilioMessageId},
          ${incomingMessage.from},
          ${body.To?.replace('whatsapp:', '') || process.env.TWILIO_WHATSAPP_NUMBER || ''},
          ${incomingMessage.body || ''},
          ${incomingMessage.mediaUrls[0] || null},
          ${'received'},
          ${'inbound'},
          ${messageTimestamp},
          ${new Date()}
        )
        ON CONFLICT ("messageId") DO NOTHING
      `

      logger.debug('WhatsApp message saved to dedicated table', {
        messageId: twilioMessageId,
        conversationId: result.conversation.id,
      })
    } catch (saveError) {
      logger.error('Error saving WhatsApp message to dedicated table:', saveError)
      // Don't fail the webhook if saving to dedicated table fails
    }

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
