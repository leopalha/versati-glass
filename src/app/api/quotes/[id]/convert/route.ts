import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { sendEmail } from '@/services/email'
import { generateOrderApprovedEmailHtml } from '@/services/email-templates'
import { formatCurrency, formatDate } from '@/lib/utils'
import { logger } from '@/lib/logger'

interface RouteParams {
  params: Promise<{ id: string }>
}

async function generateOrderNumber(): Promise<string> {
  const year = new Date().getFullYear()
  const lastOrder = await prisma.order.findFirst({
    where: {
      number: {
        startsWith: `OS-${year}`,
      },
    },
    orderBy: {
      number: 'desc',
    },
  })

  let nextNumber = 1
  if (lastOrder) {
    const lastNumber = parseInt(lastOrder.number.split('-').pop() || '0', 10)
    nextNumber = lastNumber + 1
  }

  return `OS-${year}-${nextNumber.toString().padStart(4, '0')}`
}

/**
 * POST /api/quotes/:id/convert
 * Converte orçamento em ordem manualmente (apenas ADMIN)
 * Usado quando admin quer converter sem esperar aprovação do cliente
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
        { error: 'Permissão negada. Apenas administradores podem converter orçamentos.' },
        { status: 403 }
      )
    }

    const { id } = await params

    // Parse request body for optional parameters
    const body = await request.json().catch(() => ({}))
    const { notifyCustomer = true, paymentMethod = 'PIX' } = body

    // Buscar orçamento
    const quote = await prisma.quote.findUnique({
      where: { id },
      include: {
        items: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })

    if (!quote) {
      return NextResponse.json({ error: 'Orçamento não encontrado' }, { status: 404 })
    }

    // Verificar se orçamento pode ser convertido
    if (quote.status === 'CONVERTED') {
      return NextResponse.json({ error: 'Orçamento já foi convertido em pedido' }, { status: 400 })
    }

    if (quote.status === 'REJECTED') {
      return NextResponse.json({ error: 'Orçamento foi recusado pelo cliente' }, { status: 400 })
    }

    if (quote.items.length === 0) {
      return NextResponse.json({ error: 'Orçamento não possui itens' }, { status: 400 })
    }

    // Gerar número da ordem
    const orderNumber = await generateOrderNumber()

    // Definir garantia e previsão de entrega
    const warrantyUntil = new Date()
    warrantyUntil.setFullYear(warrantyUntil.getFullYear() + 1) // 1 ano de garantia

    const estimatedDelivery = new Date()
    estimatedDelivery.setDate(estimatedDelivery.getDate() + 15) // 15 dias

    // Criar ordem a partir do orçamento
    const order = await prisma.$transaction(async (tx) => {
      // Atualizar status do orçamento
      await tx.quote.update({
        where: { id },
        data: {
          status: 'CONVERTED',
          acceptedAt: new Date(),
        },
      })

      // Criar a ordem
      const newOrder = await tx.order.create({
        data: {
          number: orderNumber,
          userId: quote.userId,
          quoteId: quote.id,
          serviceStreet: quote.serviceStreet,
          serviceNumber: quote.serviceNumber,
          serviceComplement: quote.serviceComplement,
          serviceNeighborhood: quote.serviceNeighborhood,
          serviceCity: quote.serviceCity,
          serviceState: quote.serviceState,
          serviceZipCode: quote.serviceZipCode,
          subtotal: quote.subtotal,
          discount: quote.discount,
          installationFee: 0, // Admin pode adicionar depois
          total: quote.total,
          paidAmount: 0,
          status: 'AGUARDANDO_PAGAMENTO',
          paymentStatus: 'PENDING',
          paymentMethod,
          warrantyUntil,
          estimatedDelivery,
          items: {
            create: quote.items.map((item) => ({
              productId: item.productId,
              description: item.description,
              specifications: item.specifications,
              width: item.width,
              height: item.height,
              quantity: item.quantity,
              color: item.color,
              finish: item.finish,
              thickness: item.thickness,
              unitPrice: item.unitPrice,
              totalPrice: item.totalPrice,
              status: 'PENDING',
            })),
          },
          timeline: {
            create: [
              {
                status: 'ORCAMENTO_ENVIADO',
                description: 'Orçamento convertido manualmente pelo admin',
                createdBy: session.user.id,
                createdAt: new Date(),
              },
            ],
          },
        },
        include: {
          items: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      })

      return newOrder
    })

    // Enviar notificação ao cliente (opcional)
    if (notifyCustomer && quote.user.email) {
      try {
        const portalUrl = `${process.env.NEXT_PUBLIC_APP_URL}/portal/pedidos/${order.id}`

        const emailHtml = generateOrderApprovedEmailHtml({
          customerName: quote.user.name || 'Cliente',
          orderNumber: order.number,
          total: formatCurrency(Number(order.total)),
          estimatedDelivery: order.estimatedDelivery
            ? formatDate(new Date(order.estimatedDelivery))
            : undefined,
          portalUrl,
        })

        await sendEmail({
          to: quote.user.email,
          subject: `Pedido #${order.number} - Seu Orçamento foi Aprovado! 🎉`,
          html: emailHtml,
        })
      } catch (emailError) {
        logger.error('Error sending order notification email:', emailError)
        // Não falha a conversão se o email falhar
      }
    }

    // Serializar Decimal para JSON
    const serializedOrder = {
      ...order,
      subtotal: Number(order.subtotal),
      discount: Number(order.discount),
      installationFee: Number(order.installationFee),
      total: Number(order.total),
      paidAmount: Number(order.paidAmount),
      items: order.items.map((item) => ({
        ...item,
        width: item.width ? Number(item.width) : null,
        height: item.height ? Number(item.height) : null,
        unitPrice: Number(item.unitPrice),
        totalPrice: Number(item.totalPrice),
      })),
    }

    return NextResponse.json({
      order: serializedOrder,
      message: `Orçamento convertido em pedido #${order.number}`,
    })
  } catch (error) {
    logger.error('Error converting quote to order:', error)
    return NextResponse.json({ error: 'Erro ao converter orçamento em pedido' }, { status: 500 })
  }
}
