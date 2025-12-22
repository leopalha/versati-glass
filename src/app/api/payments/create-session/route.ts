import { NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { createCheckoutSession } from '@/lib/stripe'
import { logger } from '@/lib/logger'

const createSessionSchema = z.object({
  orderId: z.string(),
  paymentMethod: z.enum(['card', 'pix']),
})

export async function POST(request: Request) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Nao autorizado' }, { status: 401 })
    }

    const body = await request.json()
    const parsed = createSessionSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Dados invalidos', details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const { orderId, paymentMethod } = parsed.data

    // Get the order
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        user: {
          select: {
            email: true,
            name: true,
          },
        },
        items: {
          select: {
            description: true,
            quantity: true,
          },
        },
      },
    })

    if (!order) {
      return NextResponse.json({ error: 'Pedido nao encontrado' }, { status: 404 })
    }

    // Check ownership
    if (order.userId !== session.user.id && session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Nao autorizado' }, { status: 401 })
    }

    // Check if order can be paid
    if (order.paymentStatus === 'PAID') {
      return NextResponse.json({ error: 'Este pedido ja foi pago' }, { status: 400 })
    }

    // Create description from items
    const description = order.items
      .map((item) => `${item.quantity}x ${item.description}`)
      .join(', ')

    // Get base URL
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

    // Validate amount
    if (Number(order.total) <= 0) {
      return NextResponse.json({ error: 'Valor do pedido invalido' }, { status: 400 })
    }

    // Create Stripe checkout session
    const checkoutSession = await createCheckoutSession({
      orderId: order.id,
      orderNumber: order.number,
      customerEmail: order.user.email,
      customerName: order.user.name || 'Cliente',
      amount: Number(order.total),
      description,
      paymentMethod,
      successUrl: `${baseUrl}/portal/pedidos/${order.id}/sucesso`,
      cancelUrl: `${baseUrl}/portal/pedidos/${order.id}`,
    })

    // Update order with Stripe session ID
    await prisma.order.update({
      where: { id: orderId },
      data: {
        stripeSessionId: checkoutSession.id,
        paymentMethod: paymentMethod === 'pix' ? 'PIX' : 'CREDIT_CARD',
      },
    })

    return NextResponse.json({
      sessionId: checkoutSession.id,
      url: checkoutSession.url,
    })
  } catch (error) {
    logger.error('Error creating payment session:', error)
    return NextResponse.json({ error: 'Erro ao criar sessao de pagamento' }, { status: 500 })
  }
}
