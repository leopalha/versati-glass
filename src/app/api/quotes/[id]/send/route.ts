import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { sendEmail } from '@/services/email'
import { generateQuoteSentEmailHtml } from '@/services/email-templates'
import { formatCurrency, formatDate } from '@/lib/utils'
import { logger } from '@/lib/logger'

interface RouteParams {
  params: Promise<{ id: string }>
}

/**
 * POST /api/quotes/:id/send
 * Envia orçamento ao cliente por email (apenas ADMIN)
 * Atualiza status para SENT e define sentAt
 */
export async function POST(request: Request, { params }: RouteParams) {
  try {
    // Verificar autenticação
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
    }

    // Verificar se é admin ou staff
    if (session.user.role !== 'ADMIN' && session.user.role !== 'STAFF') {
      return NextResponse.json(
        { error: 'Permissão negada. Apenas administradores podem enviar orçamentos.' },
        { status: 403 }
      )
    }

    const { id } = await params

    // Buscar orçamento com todos os dados necessários
    const quote = await prisma.quote.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
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
      return NextResponse.json({ error: 'Orçamento não encontrado' }, { status: 404 })
    }

    // Verificar se o orçamento pode ser enviado
    if (quote.status === 'ACCEPTED') {
      return NextResponse.json({ error: 'Orçamento já foi aceito pelo cliente' }, { status: 400 })
    }

    if (quote.status === 'REJECTED') {
      return NextResponse.json({ error: 'Orçamento foi recusado pelo cliente' }, { status: 400 })
    }

    if (quote.status === 'EXPIRED') {
      return NextResponse.json(
        { error: 'Orçamento expirado. Crie um novo orçamento.' },
        { status: 400 }
      )
    }

    if (quote.status === 'CONVERTED') {
      return NextResponse.json({ error: 'Orçamento já foi convertido em pedido' }, { status: 400 })
    }

    if (!quote.user.email) {
      return NextResponse.json({ error: 'Cliente não possui email cadastrado' }, { status: 400 })
    }

    // Verificar se orçamento tem validade
    if (!quote.validUntil) {
      return NextResponse.json(
        { error: 'Orçamento não possui data de validade definida' },
        { status: 400 }
      )
    }

    // Verificar se orçamento tem itens
    if (quote.items.length === 0) {
      return NextResponse.json({ error: 'Orçamento não possui itens' }, { status: 400 })
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

    // Atualizar status do orçamento para SENT
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
          },
        },
        items: true,
      },
    })

    // Enviar email
    try {
      await sendEmail({
        to: quote.user.email,
        subject: `Orçamento #${quote.number} - Versati Glass`,
        html: emailHtml,
      })
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

    // Serializar Decimal para JSON
    const serializedQuote = {
      ...updatedQuote,
      subtotal: Number(updatedQuote.subtotal),
      discount: Number(updatedQuote.discount),
      total: Number(updatedQuote.total),
      items: updatedQuote.items.map((item) => ({
        ...item,
        width: item.width ? Number(item.width) : null,
        height: item.height ? Number(item.height) : null,
        unitPrice: Number(item.unitPrice),
        totalPrice: Number(item.totalPrice),
      })),
    }

    return NextResponse.json({
      quote: serializedQuote,
      message: `Orçamento enviado com sucesso para ${quote.user.email}`,
    })
  } catch (error) {
    logger.error('Error sending quote:', error)
    return NextResponse.json({ error: 'Erro ao enviar orçamento' }, { status: 500 })
  }
}
