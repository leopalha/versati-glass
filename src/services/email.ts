import { Resend } from 'resend'

let resendInstance: Resend | null = null

function getResend(): Resend {
  if (!resendInstance) {
    if (!process.env.RESEND_API_KEY) {
      throw new Error('Missing RESEND_API_KEY environment variable')
    }
    resendInstance = new Resend(process.env.RESEND_API_KEY)
  }
  return resendInstance
}

const FROM_EMAIL = process.env.EMAIL_FROM || 'Versati Glass <noreply@versatiglass.com.br>'

export interface SendEmailParams {
  to: string
  subject: string
  html: string
  text?: string
}

export async function sendEmail(params: SendEmailParams) {
  const resend = getResend()

  try {
    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to: params.to,
      subject: params.subject,
      html: params.html,
      text: params.text,
    })

    console.log('Email sent:', result)
    return { success: true, id: result.data?.id }
  } catch (error) {
    console.error('Failed to send email:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

// Email Templates

export function generateQuoteEmailHtml(data: {
  customerName: string
  quoteNumber: string
  total: string
  validUntil: string
  portalUrl: string
  items: Array<{ description: string; quantity: number; price: string }>
}): string {
  const itemsHtml = data.items
    .map(
      (item) => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #2a2a2a;">${item.description}</td>
      <td style="padding: 12px; border-bottom: 1px solid #2a2a2a; text-align: center;">${item.quantity}</td>
      <td style="padding: 12px; border-bottom: 1px solid #2a2a2a; text-align: right;">${item.price}</td>
    </tr>
  `
    )
    .join('')

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #0a0a0a; font-family: Arial, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0a0a0a; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #1a1a1a; border-radius: 8px; overflow: hidden;">
          <!-- Header -->
          <tr>
            <td style="background-color: #d4af37; padding: 24px; text-align: center;">
              <h1 style="margin: 0; color: #000; font-size: 24px;">Versati Glass</h1>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 32px;">
              <h2 style="color: #fff; margin: 0 0 16px;">Ola, ${data.customerName}!</h2>
              <p style="color: #a0a0a0; line-height: 1.6; margin: 0 0 24px;">
                Seu orcamento foi gerado com sucesso. Confira os detalhes abaixo:
              </p>

              <!-- Quote info -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #252525; border-radius: 8px; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 16px;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="color: #a0a0a0;">Numero do Orcamento</td>
                        <td style="color: #fff; text-align: right; font-weight: bold;">#${data.quoteNumber}</td>
                      </tr>
                      <tr>
                        <td style="color: #a0a0a0; padding-top: 8px;">Valido ate</td>
                        <td style="color: #fff; text-align: right; padding-top: 8px;">${data.validUntil}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Items -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 24px;">
                <thead>
                  <tr style="background-color: #252525;">
                    <th style="padding: 12px; text-align: left; color: #a0a0a0; font-weight: normal;">Item</th>
                    <th style="padding: 12px; text-align: center; color: #a0a0a0; font-weight: normal;">Qtd</th>
                    <th style="padding: 12px; text-align: right; color: #a0a0a0; font-weight: normal;">Valor</th>
                  </tr>
                </thead>
                <tbody style="color: #fff;">
                  ${itemsHtml}
                </tbody>
              </table>

              <!-- Total -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: rgba(212, 175, 55, 0.1); border-radius: 8px; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 16px;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="color: #a0a0a0;">Total</td>
                        <td style="color: #d4af37; text-align: right; font-size: 24px; font-weight: bold;">${data.total}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- CTA Button -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <a href="${data.portalUrl}" style="display: inline-block; background-color: #d4af37; color: #000; text-decoration: none; padding: 14px 32px; border-radius: 6px; font-weight: bold;">
                      Ver Orcamento Completo
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #151515; padding: 24px; text-align: center;">
              <p style="color: #666; margin: 0 0 8px; font-size: 14px;">
                Versati Glass - Transparencia que transforma espacos
              </p>
              <p style="color: #666; margin: 0; font-size: 12px;">
                Rio de Janeiro, RJ | (21) 99999-9999
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `
}

export function generateOrderConfirmationHtml(data: {
  customerName: string
  orderNumber: string
  total: string
  portalUrl: string
}): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #0a0a0a; font-family: Arial, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0a0a0a; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #1a1a1a; border-radius: 8px; overflow: hidden;">
          <!-- Header -->
          <tr>
            <td style="background-color: #d4af37; padding: 24px; text-align: center;">
              <h1 style="margin: 0; color: #000; font-size: 24px;">Versati Glass</h1>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 32px; text-align: center;">
              <div style="width: 64px; height: 64px; background-color: rgba(34, 197, 94, 0.2); border-radius: 50%; margin: 0 auto 16px; line-height: 64px;">
                <span style="color: #22c55e; font-size: 32px;">✓</span>
              </div>

              <h2 style="color: #fff; margin: 0 0 16px;">Pedido Confirmado!</h2>

              <p style="color: #a0a0a0; line-height: 1.6; margin: 0 0 24px;">
                Ola, ${data.customerName}!<br>
                Seu pedido <strong style="color: #d4af37;">#${data.orderNumber}</strong> foi confirmado com sucesso.
              </p>

              <!-- Order info -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #252525; border-radius: 8px; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 24px;">
                    <p style="color: #a0a0a0; margin: 0 0 8px;">Valor Total</p>
                    <p style="color: #d4af37; font-size: 32px; font-weight: bold; margin: 0;">${data.total}</p>
                  </td>
                </tr>
              </table>

              <p style="color: #a0a0a0; line-height: 1.6; margin: 0 0 24px;">
                Voce pode acompanhar o status do seu pedido pelo portal do cliente.
              </p>

              <!-- CTA Button -->
              <a href="${data.portalUrl}" style="display: inline-block; background-color: #d4af37; color: #000; text-decoration: none; padding: 14px 32px; border-radius: 6px; font-weight: bold;">
                Acompanhar Pedido
              </a>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #151515; padding: 24px; text-align: center;">
              <p style="color: #666; margin: 0 0 8px; font-size: 14px;">
                Versati Glass - Transparencia que transforma espacos
              </p>
              <p style="color: #666; margin: 0; font-size: 12px;">
                Rio de Janeiro, RJ | (21) 99999-9999
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `
}

export function generateAppointmentReminderHtml(data: {
  customerName: string
  type: string
  date: string
  time: string
  address: string
  portalUrl: string
}): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #0a0a0a; font-family: Arial, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0a0a0a; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #1a1a1a; border-radius: 8px; overflow: hidden;">
          <!-- Header -->
          <tr>
            <td style="background-color: #d4af37; padding: 24px; text-align: center;">
              <h1 style="margin: 0; color: #000; font-size: 24px;">Versati Glass</h1>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 32px;">
              <h2 style="color: #fff; margin: 0 0 16px;">Lembrete de Agendamento</h2>

              <p style="color: #a0a0a0; line-height: 1.6; margin: 0 0 24px;">
                Ola, ${data.customerName}!<br>
                Passando para lembrar do seu agendamento de amanha:
              </p>

              <!-- Appointment info -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #252525; border-radius: 8px; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 24px;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding-bottom: 16px;">
                          <span style="color: #d4af37; font-size: 18px;">📅</span>
                          <span style="color: #a0a0a0; margin-left: 8px;">Tipo</span>
                          <p style="color: #fff; margin: 4px 0 0; font-weight: bold;">${data.type}</p>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding-bottom: 16px;">
                          <span style="color: #d4af37; font-size: 18px;">🕐</span>
                          <span style="color: #a0a0a0; margin-left: 8px;">Data e Horario</span>
                          <p style="color: #fff; margin: 4px 0 0; font-weight: bold;">${data.date} as ${data.time}</p>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <span style="color: #d4af37; font-size: 18px;">📍</span>
                          <span style="color: #a0a0a0; margin-left: 8px;">Endereco</span>
                          <p style="color: #fff; margin: 4px 0 0;">${data.address}</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <p style="color: #a0a0a0; line-height: 1.6; margin: 0 0 24px;">
                Precisa reagendar? Entre em contato conosco pelo WhatsApp ou pelo portal.
              </p>

              <!-- CTA Button -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <a href="${data.portalUrl}" style="display: inline-block; background-color: #d4af37; color: #000; text-decoration: none; padding: 14px 32px; border-radius: 6px; font-weight: bold;">
                      Ver Detalhes
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #151515; padding: 24px; text-align: center;">
              <p style="color: #666; margin: 0 0 8px; font-size: 14px;">
                Versati Glass - Transparencia que transforma espacos
              </p>
              <p style="color: #666; margin: 0; font-size: 12px;">
                Rio de Janeiro, RJ | (21) 99999-9999
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `
}

export function generatePasswordResetHtml(data: {
  resetUrl: string
}): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #0a0a0a; font-family: Arial, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0a0a0a; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #1a1a1a; border-radius: 8px; overflow: hidden;">
          <!-- Header -->
          <tr>
            <td style="background-color: #d4af37; padding: 24px; text-align: center;">
              <h1 style="margin: 0; color: #000; font-size: 24px;">Versati Glass</h1>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 32px; text-align: center;">
              <h2 style="color: #fff; margin: 0 0 16px;">Redefinir Senha</h2>

              <p style="color: #a0a0a0; line-height: 1.6; margin: 0 0 24px;">
                Voce solicitou a redefinicao de senha da sua conta.<br>
                Clique no botao abaixo para criar uma nova senha.
              </p>

              <!-- CTA Button -->
              <a href="${data.resetUrl}" style="display: inline-block; background-color: #d4af37; color: #000; text-decoration: none; padding: 14px 32px; border-radius: 6px; font-weight: bold; margin-bottom: 24px;">
                Redefinir Senha
              </a>

              <p style="color: #666; font-size: 14px; margin: 24px 0 0;">
                Se voce nao solicitou essa redefinicao, ignore este email.<br>
                Este link expira em 1 hora.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #151515; padding: 24px; text-align: center;">
              <p style="color: #666; margin: 0; font-size: 12px;">
                Versati Glass - Rio de Janeiro, RJ
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `
}
