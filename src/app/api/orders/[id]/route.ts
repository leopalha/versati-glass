import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { logger } from '@/lib/logger'

interface RouteParams {
  params: Promise<{ id: string }>
}

// Get single order
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        timeline: {
          orderBy: { createdAt: 'desc' },
        },
        appointments: {
          orderBy: { scheduledDate: 'asc' },
        },
        documents: true,
        quote: {
          select: {
            id: true,
            number: true,
          },
        },
      },
    })

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    // Check ownership (unless admin)
    if (order.userId !== session.user.id && session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Serialize Decimal fields to numbers for JSON
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
        product: item.product
          ? {
              ...item.product,
              basePrice: item.product.basePrice ? Number(item.product.basePrice) : null,
              pricePerM2: item.product.pricePerM2 ? Number(item.product.pricePerM2) : null,
              priceRangeMin: item.product.priceRangeMin ? Number(item.product.priceRangeMin) : null,
              priceRangeMax: item.product.priceRangeMax ? Number(item.product.priceRangeMax) : null,
            }
          : null,
      })),
    }

    return NextResponse.json(serializedOrder)
  } catch (error) {
    logger.error('Get order error:', error)
    return NextResponse.json({ error: 'Failed to get order' }, { status: 500 })
  }
}
