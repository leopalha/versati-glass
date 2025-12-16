import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

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

export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const session = await auth()
    const { id } = await params

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Nao autorizado' }, { status: 401 })
    }

    const quote = await prisma.quote.findUnique({
      where: { id },
      include: {
        items: true,
      },
    })

    if (!quote) {
      return NextResponse.json(
        { error: 'Orcamento nao encontrado' },
        { status: 404 }
      )
    }

    // Check ownership
    if (quote.userId !== session.user.id && session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Nao autorizado' }, { status: 401 })
    }

    // Check if quote is still valid
    if (quote.validUntil < new Date()) {
      return NextResponse.json(
        { error: 'Orcamento expirado' },
        { status: 400 }
      )
    }

    // Check if quote can be accepted
    if (!['SENT', 'VIEWED'].includes(quote.status)) {
      return NextResponse.json(
        { error: 'Este orcamento nao pode ser aceito' },
        { status: 400 }
      )
    }

    // Generate order number
    const orderNumber = await generateOrderNumber()

    // Set warranty and estimated delivery
    const warrantyUntil = new Date()
    warrantyUntil.setFullYear(warrantyUntil.getFullYear() + 1) // 1 year warranty

    const estimatedDelivery = new Date()
    estimatedDelivery.setDate(estimatedDelivery.getDate() + 15) // 15 days

    // Create order from quote
    const order = await prisma.$transaction(async (tx) => {
      // Update quote status
      await tx.quote.update({
        where: { id },
        data: {
          status: 'ACCEPTED',
          acceptedAt: new Date(),
        },
      })

      // Create the order
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
          total: quote.total,
          status: 'AGUARDANDO_PAGAMENTO',
          paymentStatus: 'PENDING',
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
                description: 'Orcamento enviado ao cliente',
                createdBy: 'system',
                createdAt: quote.sentAt || quote.createdAt,
              },
              {
                status: 'APROVADO',
                description: 'Cliente aprovou o orcamento',
                createdBy: session.user.id,
                createdAt: new Date(),
              },
            ],
          },
        },
      })

      // Update quote with CONVERTED status
      await tx.quote.update({
        where: { id },
        data: {
          status: 'CONVERTED',
        },
      })

      return newOrder
    })

    return NextResponse.json({
      id: order.id,
      number: order.number,
      status: order.status,
      total: Number(order.total),
      message: 'Orcamento aceito! Prossiga para o pagamento.',
    })
  } catch (error) {
    console.error('Error accepting quote:', error)
    return NextResponse.json(
      { error: 'Erro ao aceitar orcamento' },
      { status: 500 }
    )
  }
}
