import twilio from 'twilio'

let twilioClient: twilio.Twilio | null = null

function getTwilioClient(): twilio.Twilio {
  if (!twilioClient) {
    const accountSid = process.env.TWILIO_ACCOUNT_SID
    const authToken = process.env.TWILIO_AUTH_TOKEN

    if (!accountSid || !authToken) {
      throw new Error('Missing Twilio credentials')
    }

    twilioClient = twilio(accountSid, authToken)
  }
  return twilioClient
}

export interface SendMessageParams {
  to: string
  message: string
  mediaUrl?: string
}

export interface IncomingMessage {
  from: string
  to: string
  body: string
  numMedia: number
  mediaUrls: string[]
  profileName?: string
  messageSid: string
}

// Format phone number for WhatsApp
function formatWhatsAppNumber(phone: string): string {
  // Remove non-digits
  let cleaned = phone.replace(/\D/g, '')

  // Add Brazil country code if not present
  if (!cleaned.startsWith('55')) {
    cleaned = '55' + cleaned
  }

  return `whatsapp:+${cleaned}`
}

// Get the Twilio WhatsApp number
function getWhatsAppNumber(): string {
  const number = process.env.TWILIO_WHATSAPP_NUMBER
  if (!number) {
    throw new Error('Missing TWILIO_WHATSAPP_NUMBER environment variable')
  }
  return number.startsWith('whatsapp:') ? number : `whatsapp:${number}`
}

// Send a WhatsApp message
export async function sendWhatsAppMessage(
  params: SendMessageParams
): Promise<{ success: boolean; messageSid?: string; error?: string }> {
  try {
    const client = getTwilioClient()
    const from = getWhatsAppNumber()
    const to = formatWhatsAppNumber(params.to)

    const messageOptions: {
      from: string
      to: string
      body: string
      mediaUrl?: string[]
    } = {
      from,
      to,
      body: params.message,
    }

    // Add media if provided
    if (params.mediaUrl) {
      messageOptions.mediaUrl = [params.mediaUrl]
    }

    const message = await client.messages.create(messageOptions)

    console.log(`WhatsApp message sent: ${message.sid}`)

    return {
      success: true,
      messageSid: message.sid,
    }
  } catch (error) {
    console.error('Error sending WhatsApp message:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

// Send a template message (for notifications)
export async function sendTemplateMessage(
  to: string,
  templateName: string,
  variables: Record<string, string>
): Promise<{ success: boolean; messageSid?: string; error?: string }> {
  // For now, we'll send a regular message
  // In production, you'd use Twilio's Content API for templates

  let message = ''

  switch (templateName) {
    case 'quote_sent':
      message = `📋 *Orcamento Enviado!*

Ola ${variables.customerName}!

Seu orcamento #${variables.quoteNumber} foi enviado.
Valor: R$ ${variables.total}
Valido ate: ${variables.validUntil}

Acesse seu portal para ver os detalhes:
${variables.portalUrl}

Duvidas? Responda esta mensagem!`
      break

    case 'order_approved':
      message = `✅ *Pedido Aprovado!*

Ola ${variables.customerName}!

Seu pedido #${variables.orderNumber} foi aprovado!
Previsao de entrega: ${variables.estimatedDelivery}

Acompanhe o status pelo portal:
${variables.portalUrl}`
      break

    case 'appointment_reminder':
      message = `📅 *Lembrete de Agendamento*

Ola ${variables.customerName}!

Amanha, ${variables.date} as ${variables.time}, nossa equipe estara em seu endereco para ${variables.type}.

Endereco: ${variables.address}

Precisa reagendar? Responda esta mensagem!`
      break

    case 'installation_complete':
      message = `🎉 *Instalacao Concluida!*

Ola ${variables.customerName}!

A instalacao do seu pedido #${variables.orderNumber} foi finalizada!

Sua garantia e valida ate: ${variables.warrantyUntil}

Ficou alguma duvida? Estamos a disposicao!`
      break

    default:
      return {
        success: false,
        error: `Unknown template: ${templateName}`,
      }
  }

  return sendWhatsAppMessage({ to, message })
}

// Parse incoming Twilio webhook
export function parseIncomingMessage(body: Record<string, string>): IncomingMessage {
  const numMedia = parseInt(body.NumMedia || '0', 10)
  const mediaUrls: string[] = []

  for (let i = 0; i < numMedia; i++) {
    const mediaUrl = body[`MediaUrl${i}`]
    if (mediaUrl) {
      mediaUrls.push(mediaUrl)
    }
  }

  return {
    from: body.From?.replace('whatsapp:', '') || '',
    to: body.To?.replace('whatsapp:', '') || '',
    body: body.Body || '',
    numMedia,
    mediaUrls,
    profileName: body.ProfileName,
    messageSid: body.MessageSid || '',
  }
}

// Validate Twilio webhook signature
export function validateTwilioSignature(
  signature: string,
  url: string,
  params: Record<string, string>
): boolean {
  const authToken = process.env.TWILIO_AUTH_TOKEN
  if (!authToken) {
    console.error('Missing TWILIO_AUTH_TOKEN for signature validation')
    return false
  }

  return twilio.validateRequest(authToken, signature, url, params)
}

// Generate TwiML response (for webhook)
export function generateTwiMLResponse(message?: string): string {
  const twiml = new twilio.twiml.MessagingResponse()

  if (message) {
    twiml.message(message)
  }

  return twiml.toString()
}
