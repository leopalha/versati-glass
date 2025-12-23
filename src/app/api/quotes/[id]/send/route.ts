import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { sendEmail } from '@/services/email'
import { generateQuoteSentEmailHtml } from '@/services/email-templates'
import { sendWhatsAppMessage } from '@/services/whatsapp'
import { formatCurrency, formatDate } from '@/lib/utils'
import { logger } from '@/lib/logger'
import { notifyQuoteReceived } from '@/services/in-app-notifications'

interface RouteParams {
  params: Promise<{ id: string }>
}

/**
 * POST /api/quotes/:id/send
 * Envia orcamento ao cliente por email e opcionalmente WhatsApp
 * Atualiza status para SENT e define sentAt
 */
export async function POST(request: Request, { params }: RouteParams) {
  try {
    // Verificar autenticacao
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Nao autenticado' }, { status: 401 })
    }

    // Verificar se e admin ou staff
    if (session.user.role !== 'ADMIN' && session.user.role !== 'STAFF') {
      return NextResponse.json(
        { error: 'Permissao negada. Apenas administradores podem enviar orcamentos.' },
        { status: 403 }
      )
    }

    const { id } = await params

    // Ler body para opcoes de envio
    let sendWhatsApp = true
    try {
      const body = await request.json()
      sendWhatsApp = body.sendWhatsApp !== false
    } catch {
      // Body vazio, usar padrao
    }

    // Buscar orcamento com todos os dados necessarios
    const quote = await prisma.quote.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    })

    if (!quote) {
      return NextResponse.json({ error: 'Orcamento nao encontrado' }, { status: 404 })
    }

    // Verificar se o orcamento pode ser enviado
    if (quote.status === 'ACCEPTED') {
      return NextResponse.json({ error: 'Orcamento ja foi aceito pelo cliente' }, { status: 400 })
    }

    if (quote.status === 'REJECTED') {
      return NextResponse.json({ error: 'Orcamento foi recusado pelo cliente' }, { status: 400 })
    }

    if (quote.status === 'EXPIRED') {
      return NextResponse.json(
        { error: 'Orcamento expirado. Crie um novo orcamento.' },
        { status: 400 }
      )
    }

    if (quote.status === 'CONVERTED') {
      return NextResponse.json({ error: 'Orcamento ja foi convertido em pedido' }, { status: 400 })
    }

    if (!quote.user.email) {
      return NextResponse.json({ error: 'Cliente nao possui email cadastrado' }, { status: 400 })
    }

    // Verificar se orcamento tem validade
    if (!quote.validUntil) {
      return NextResponse.json(
        { error: 'Orcamento nao possui data de validade definida' },
        { status: 400 }
      )
    }

    // Verificar se orcamento tem itens
    if (quote.items.length === 0) {
      return NextResponse.json({ error: 'Orcamento nao possui itens' }, { status: 400 })
    }

    // Preparar dados do email
    const portalUrl = `${process.env.NEXT_PUBLIC_APP_URL}/portal/orcamentos/${quote.id}`

    const emailItems = quote.items.map((item) => ({
      description: item.description || item.product?.name || 'Item',
      quantity: item.quantity,
      price: formatCurrency(Number(item.totalPrice)),
    }))

    const emailHtml = generateQuoteSentEmailHtml({
      customerName: quote.user.name || 'Cliente',
      quoteNumber: quote.number,
      total: formatCurrency(Number(quote.total)),
      validUntil: formatDate(new Date(quote.validUntil)),
      portalUrl,
      items: emailItems,
    })

    // Atualizar status do orcamento para SENT
    const updatedQuote = await prisma.quote.update({
      where: { id },
      data: {
        status: 'SENT',
        sentAt: new Date(),
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
        items: true,
      },
    })

    // Enviar email
    let emailSent = false
    try {
      await sendEmail({
        to: quote.user.email,
        subject: `Orcamento #${quote.number} - Versati Glass`,
        html: emailHtml,
      })
      emailSent = true

      // Create in-app notification for customer
      try {
        await notifyQuoteReceived(quote.user.id, quote.number, quote.id)
      } catch (notifError) {
        logger.error('Error creating quote notification:', notifError)
        // Don't fail the request if notification creation fails
      }
    } catch (emailError) {
      logger.error('Error sending quote email:', emailError)
      // Se falhou o envio do email, reverter status
      await prisma.quote.update({
        where: { id },
        data: {
          status: quote.status, // Voltar ao status anterior
          sentAt: quote.sentAt, // Voltar ao sentAt anterior (pode ser null)
        },
      })

      return NextResponse.json({ error: 'Erro ao enviar email. Tente novamente.' }, { status: 500 })
    }

    // Enviar WhatsApp se solicitado e cliente tiver telefone
    let whatsappSent = false
    const customerPhone = quote.customerPhone || quote.user.phone
    if (sendWhatsApp && customerPhone) {
      try {
        // Preparar mensagem WhatsApp
        const itemsList = quote.items
          .slice(0, 3)
          .map((item) => `- ${item.description || item.product?.name}: ${item.quantity}x`)
          .join('\n')

        const moreItems =
          quote.items.length > 3 ? `\n... e mais ${quote.items.length - 3} itens` : ''

        const whatsappMessage = `Ola, ${quote.customerName}!

Seu orcamento *#${quote.number}* da Versati Glass esta pronto!

*Itens:*
${itemsList}${moreItems}

*Total: ${formatCurrency(Number(quote.total))}*
*Valido ate: ${formatDate(new Date(quote.validUntil))}*

Acesse o link abaixo para ver os detalhes e aceitar:
${portalUrl}

Qualquer duvida, estamos a disposicao!
Versati Glass`

        const result = await sendWhatsAppMessage({
          to: customerPhone,
          message: whatsappMessage,
        })

        if (result.success) {
          whatsappSent = true

          // TODO: Log WhatsApp message sent (WhatsAppMessage model doesn't exist yet)
          logger.info('WhatsApp message sent for quote', {
            quoteId: quote.id,
            messageSid: result.messageSid,
            to: customerPhone,
          })
        }
      } catch (whatsappError) {
        logger.error('Error sending quote WhatsApp:', whatsappError)
        // Nao reverter o status, email ja foi enviado
      }
    }

    // Serializar Decimal para JSON
    const serializedQuote = {
      ...updatedQuote,
      subtotal: Number(updatedQuote.subtotal),
      discount: Number(updatedQuote.discount),
      shippingFee: Number((updatedQuote as any).shippingFee || 0),
      laborFee: Number((updatedQuote as any).laborFee || 0),
      materialFee: Number((updatedQuote as any).materialFee || 0),
      total: Number(updatedQuote.total),
      items: updatedQuote.items.map((item) => ({
        ...item,
        width: item.width ? Number(item.width) : null,
        height: item.height ? Number(item.height) : null,
        unitPrice: Number(item.unitPrice),
        totalPrice: Number(item.totalPrice),
      })),
    }

    // Construir mensagem de sucesso
    let successMessage = `Orcamento enviado com sucesso para ${quote.user.email}`
    if (whatsappSent) {
      successMessage += ` e WhatsApp (${customerPhone})`
    } else if (sendWhatsApp && !customerPhone) {
      successMessage += ' (WhatsApp nao enviado: telefone nao informado)'
    } else if (sendWhatsApp && !whatsappSent) {
      successMessage += ' (WhatsApp nao enviado: erro no envio)'
    }

    return NextResponse.json({
      quote: serializedQuote,
      message: successMessage,
      emailSent,
      whatsappSent,
    })
  } catch (error) {
    logger.error('Error sending quote:', error)
    return NextResponse.json({ error: 'Erro ao enviar orcamento' }, { status: 500 })
  }
}
