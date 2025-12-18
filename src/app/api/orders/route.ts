import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { logger } from '@/lib/logger'

// Get orders for current user (or all orders if admin)
export async function GET(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const userId = searchParams.get('userId') // Admin pode filtrar por cliente específico
    const search = searchParams.get('search') // Buscar por número ou nome do cliente
    const paymentStatus = searchParams.get('paymentStatus')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')

    // Build filter
    const where: Record<string, unknown> = {}

    // Admin pode ver todos os pedidos, cliente só os próprios
    const isAdmin = session.user.role === 'ADMIN' || session.user.role === 'STAFF'

    if (!isAdmin) {
      where.userId = session.user.id
    } else if (userId) {
      // Admin pode filtrar por cliente específico
      where.userId = userId
    }

    // Filtros adicionais
    if (status) {
      where.status = status
    }

    if (paymentStatus) {
      where.paymentStatus = paymentStatus
    }

    // Busca por número de pedido ou nome do cliente
    if (search && isAdmin) {
      where.OR = [
        { number: { contains: search, mode: 'insensitive' as const } },
        { user: { name: { contains: search, mode: 'insensitive' as const } } },
        { user: { email: { contains: search, mode: 'insensitive' as const } } },
      ]
    }

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
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
                  slug: true,
                  thumbnail: true,
                },
              },
            },
          },
          appointments: {
            where: {
              scheduledDate: { gte: new Date() },
              status: { in: ['SCHEDULED', 'CONFIRMED'] },
            },
            orderBy: { scheduledDate: 'asc' },
            take: 1,
          },
          _count: {
            select: {
              timeline: true,
              documents: true,
            },
          },
        },
      }),
      prisma.order.count({ where }),
    ])

    // Serializar Decimals para JSON
    const serializedOrders = orders.map((order) => ({
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
            }
          : null,
      })),
    }))

    return NextResponse.json({
      orders: serializedOrders,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    logger.error('Get orders error:', error)
    return NextResponse.json({ error: 'Failed to get orders' }, { status: 500 })
  }
}
