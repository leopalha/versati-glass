import { NextRequest, NextResponse } from 'next/server'
import {
  parseIncomingMessage,
  validateTwilioSignature,
  generateTwiMLResponse,
} from '@/services/whatsapp'
import { processIncomingMessage } from '@/services/conversation'

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
        console.error('Invalid Twilio signature')
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }
    }

    // Parse the incoming message
    const incomingMessage = parseIncomingMessage(body)

    console.log('Incoming WhatsApp message:', {
      from: incomingMessage.from,
      body: incomingMessage.body,
      profileName: incomingMessage.profileName,
      numMedia: incomingMessage.numMedia,
    })

    // Process the message and generate AI response
    const result = await processIncomingMessage(
      incomingMessage.from,
      incomingMessage.body,
      incomingMessage.profileName,
      incomingMessage.mediaUrls[0]
    )

    console.log('AI Response:', {
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
    console.error('WhatsApp webhook error:', error)

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
