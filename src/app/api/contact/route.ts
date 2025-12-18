import { NextResponse } from 'next/server'
import { z } from 'zod'
import { sendEmail } from '@/services/email'
import { logger } from '@/lib/logger'
import { rateLimit } from '@/lib/rate-limit'
import { CONTACT, BRAND } from '@/lib/constants'

const contactSchema = z.object({
  name: z.string().min(2, 'Nome deve ter no mínimo 2 caracteres'),
  email: z.string().email('Email inválido'),
  phone: z.string().min(10, 'Telefone inválido'),
  subject: z.enum(['orcamento', 'duvida', 'manutencao', 'reclamacao', 'elogio', 'outro']),
  message: z.string().min(10, 'Mensagem deve ter no mínimo 10 caracteres'),
})

const subjectLabels: Record<string, string> = {
  orcamento: 'Solicitar Orçamento',
  duvida: 'Tirar Dúvida',
  manutencao: 'Manutenção',
  reclamacao: 'Reclamação',
  elogio: 'Elogio',
  outro: 'Outro',
}

export async function POST(request: Request) {
  try {
    // Rate limiting: 3 requests per 5 minutes per IP
    const rateLimitResult = await rateLimit(request, {
      maxRequests: 3,
      windowSeconds: 5 * 60, // 5 minutes
    })

    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Muitas solicitações. Tente novamente em alguns minutos.' },
        { status: 429 }
      )
    }

    const body = await request.json()
    const parsed = contactSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Dados inválidos', details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const { name, email, phone, subject, message } = parsed.data
    const subjectLabel = subjectLabels[subject] || subject

    // Send email to business
    const businessEmailResult = await sendEmail({
      to: CONTACT.email,
      subject: `[${BRAND.name}] ${subjectLabel} - ${name}`,
      html: generateContactEmailHtml({
        name,
        email,
        phone,
        subject: subjectLabel,
        message,
      }),
      text: `
Nome: ${name}
Email: ${email}
Telefone: ${phone}
Assunto: ${subjectLabel}

Mensagem:
${message}
      `.trim(),
    })

    if (!businessEmailResult.success) {
      logger.error('[CONTACT] Failed to send business email:', businessEmailResult.error)
      return NextResponse.json(
        { error: 'Erro ao enviar mensagem. Tente novamente.' },
        { status: 500 }
      )
    }

    // Send confirmation email to customer
    const customerEmailResult = await sendEmail({
      to: email,
      subject: `Recebemos sua mensagem - ${BRAND.name}`,
      html: generateConfirmationEmailHtml({ name, subject: subjectLabel }),
      text: `
Olá ${name}!

Recebemos sua mensagem sobre "${subjectLabel}".

Nossa equipe irá analisar e entrar em contato em breve.

Atenciosamente,
Equipe ${BRAND.name}
      `.trim(),
    })

    if (!customerEmailResult.success) {
      logger.error('[CONTACT] Failed to send confirmation email:', customerEmailResult.error)
      // Don't fail the request, business email was sent
    }

    logger.debug('[CONTACT] Contact form submitted successfully:', { name, email, subject })

    return NextResponse.json({
      success: true,
      message: 'Mensagem enviada com sucesso!',
    })
  } catch (error) {
    logger.error('[CONTACT] Error processing contact form:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}

function generateContactEmailHtml(data: {
  name: string
  email: string
  phone: string
  subject: string
  message: string
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
              <h1 style="margin: 0; color: #000; font-size: 24px;">Nova Mensagem de Contato</h1>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 32px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #252525; border-radius: 8px; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 24px;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding-bottom: 16px;">
                          <span style="color: #a0a0a0;">Nome</span>
                          <p style="color: #fff; margin: 4px 0 0; font-weight: bold;">${data.name}</p>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding-bottom: 16px;">
                          <span style="color: #a0a0a0;">Email</span>
                          <p style="color: #fff; margin: 4px 0 0;">
                            <a href="mailto:${data.email}" style="color: #d4af37; text-decoration: none;">${data.email}</a>
                          </p>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding-bottom: 16px;">
                          <span style="color: #a0a0a0;">Telefone</span>
                          <p style="color: #fff; margin: 4px 0 0;">
                            <a href="tel:${data.phone}" style="color: #d4af37; text-decoration: none;">${data.phone}</a>
                          </p>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <span style="color: #a0a0a0;">Assunto</span>
                          <p style="color: #d4af37; margin: 4px 0 0; font-weight: bold;">${data.subject}</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <h3 style="color: #fff; margin: 0 0 16px;">Mensagem:</h3>
              <div style="background-color: #252525; border-radius: 8px; padding: 24px;">
                <p style="color: #e0e0e0; margin: 0; line-height: 1.8; white-space: pre-wrap;">${data.message}</p>
              </div>

              <!-- Action buttons -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-top: 24px;">
                <tr>
                  <td align="center">
                    <a href="mailto:${data.email}" style="display: inline-block; background-color: #d4af37; color: #000; text-decoration: none; padding: 14px 32px; border-radius: 6px; font-weight: bold; margin-right: 16px;">
                      Responder por Email
                    </a>
                    <a href="https://wa.me/${data.phone.replace(/\D/g, '')}" style="display: inline-block; background-color: #25D366; color: #fff; text-decoration: none; padding: 14px 32px; border-radius: 6px; font-weight: bold;">
                      Responder no WhatsApp
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #151515; padding: 24px; text-align: center;">
              <p style="color: #666; margin: 0; font-size: 12px;">
                Mensagem recebida via formulário de contato do site
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

function generateConfirmationEmailHtml(data: { name: string; subject: string }): string {
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
              <h1 style="margin: 0; color: #000; font-size: 24px;">${BRAND.name}</h1>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 32px; text-align: center;">
              <div style="width: 64px; height: 64px; background-color: rgba(34, 197, 94, 0.2); border-radius: 50%; margin: 0 auto 16px; line-height: 64px;">
                <span style="color: #22c55e; font-size: 32px;">✓</span>
              </div>

              <h2 style="color: #fff; margin: 0 0 16px;">Mensagem Recebida!</h2>

              <p style="color: #a0a0a0; line-height: 1.6; margin: 0 0 24px;">
                Olá, ${data.name}!<br><br>
                Recebemos sua mensagem sobre <strong style="color: #d4af37;">"${data.subject}"</strong>.<br><br>
                Nossa equipe irá analisar e entrar em contato em breve.
              </p>

              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #252525; border-radius: 8px; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 24px;">
                    <p style="color: #a0a0a0; margin: 0 0 8px;">Tempo médio de resposta</p>
                    <p style="color: #fff; font-size: 24px; font-weight: bold; margin: 0;">Até 24 horas</p>
                  </td>
                </tr>
              </table>

              <p style="color: #a0a0a0; line-height: 1.6; margin: 0 0 24px;">
                Precisa de atendimento mais rápido?<br>
                Fale conosco pelo WhatsApp!
              </p>

              <a href="https://wa.me/${CONTACT.phoneWhatsApp}?text=Olá! Enviei uma mensagem pelo site e gostaria de mais informações." style="display: inline-block; background-color: #25D366; color: #fff; text-decoration: none; padding: 14px 32px; border-radius: 6px; font-weight: bold;">
                Falar no WhatsApp
              </a>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #151515; padding: 24px; text-align: center;">
              <p style="color: #666; margin: 0 0 8px; font-size: 14px;">
                ${BRAND.name} - ${BRAND.tagline}
              </p>
              <p style="color: #666; margin: 0; font-size: 12px;">
                ${CONTACT.address.full} | ${CONTACT.phone}
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
