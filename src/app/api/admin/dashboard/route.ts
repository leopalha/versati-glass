import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { logger } from '@/lib/logger'

/**
 * GET /api/admin/dashboard
 * Retorna estatísticas e dados do dashboard admin
 */
export async function GET(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (session.user.role !== 'ADMIN' && session.user.role !== 'STAFF') {
      return NextResponse.json({ error: 'Forbidden. Admin access required.' }, { status: 403 })
    }

    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0)

    // Executar todas as queries em paralelo para performance
    const [
      // Orders stats
      totalOrders,
      monthOrders,
      lastMonthOrders,
      pendingOrders,
      inProductionOrders,
      completedOrders,

      // Revenue stats
      monthRevenue,
      lastMonthRevenue,
      totalRevenue,

      // Quotes stats
      totalQuotes,
      pendingQuotes,
      acceptedQuotesThisMonth,

      // Appointments stats
      todayAppointments,
      upcomingAppointments,
      completedAppointmentsThisMonth,

      // Customer stats
      totalCustomers,
      newCustomersThisMonth,

      // Conversations stats
      activeConversations,
      waitingHumanConversations,

      // Recent data
      recentOrders,
      recentQuotes,
      todaySchedule,
    ] = await Promise.all([
      // Orders
      prisma.order.count(),
      prisma.order.count({
        where: { createdAt: { gte: startOfMonth } },
      }),
      prisma.order.count({
        where: {
          createdAt: { gte: startOfLastMonth, lte: endOfLastMonth },
        },
      }),
      prisma.order.count({
        where: { status: { in: ['AGUARDANDO_PAGAMENTO', 'APROVADO'] } },
      }),
      prisma.order.count({
        where: { status: 'EM_PRODUCAO' },
      }),
      prisma.order.count({
        where: { status: 'CONCLUIDO' },
      }),

      // Revenue
      prisma.order.aggregate({
        where: {
          createdAt: { gte: startOfMonth },
          paymentStatus: 'PAID',
        },
        _sum: { total: true },
      }),
      prisma.order.aggregate({
        where: {
          createdAt: { gte: startOfLastMonth, lte: endOfLastMonth },
          paymentStatus: 'PAID',
        },
        _sum: { total: true },
      }),
      prisma.order.aggregate({
        where: { paymentStatus: 'PAID' },
        _sum: { total: true },
      }),

      // Quotes
      prisma.quote.count(),
      prisma.quote.count({
        where: { status: { in: ['SENT', 'VIEWED'] } },
      }),
      prisma.quote.count({
        where: {
          status: 'ACCEPTED',
          acceptedAt: { gte: startOfMonth },
        },
      }),

      // Appointments
      prisma.appointment.count({
        where: {
          scheduledDate: {
            gte: new Date(now.getFullYear(), now.getMonth(), now.getDate()),
            lt: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1),
          },
          status: { in: ['SCHEDULED', 'CONFIRMED', 'IN_PROGRESS'] },
        },
      }),
      prisma.appointment.count({
        where: {
          scheduledDate: { gte: now },
          status: { in: ['SCHEDULED', 'CONFIRMED'] },
        },
      }),
      prisma.appointment.count({
        where: {
          completedAt: { gte: startOfMonth },
          status: 'COMPLETED',
        },
      }),

      // Customers
      prisma.user.count({
        where: { role: 'CUSTOMER' },
      }),
      prisma.user.count({
        where: {
          role: 'CUSTOMER',
          createdAt: { gte: startOfMonth },
        },
      }),

      // Conversations
      prisma.conversation.count({
        where: { status: 'ACTIVE' },
      }),
      prisma.conversation.count({
        where: { status: 'WAITING_HUMAN' },
      }),

      // Recent data
      prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          number: true,
          status: true,
          total: true,
          createdAt: true,
          user: {
            select: {
              name: true,
              email: true,
            },
          },
        },
      }),
      prisma.quote.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        where: { status: { in: ['SENT', 'VIEWED'] } },
        select: {
          id: true,
          number: true,
          status: true,
          total: true,
          createdAt: true,
          customerName: true,
          customerEmail: true,
        },
      }),
      prisma.appointment.findMany({
        where: {
          scheduledDate: {
            gte: new Date(now.getFullYear(), now.getMonth(), now.getDate()),
            lt: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1),
          },
        },
        orderBy: { scheduledTime: 'asc' },
        select: {
          id: true,
          type: true,
          scheduledTime: true,
          status: true,
          user: {
            select: {
              name: true,
              phone: true,
            },
          },
          addressStreet: true,
          addressNumber: true,
          addressNeighborhood: true,
        },
      }),
    ])

    // Calcular variações percentuais
    const orderGrowth =
      lastMonthOrders > 0 ? ((monthOrders - lastMonthOrders) / lastMonthOrders) * 100 : 0

    const revenueGrowth =
      lastMonthRevenue._sum.total && Number(lastMonthRevenue._sum.total) > 0
        ? ((Number(monthRevenue._sum.total || 0) - Number(lastMonthRevenue._sum.total)) /
            Number(lastMonthRevenue._sum.total)) *
          100
        : 0

    // Serializar Decimals
    const serializedRecentOrders = recentOrders.map((order) => ({
      ...order,
      total: Number(order.total),
    }))

    const serializedRecentQuotes = recentQuotes.map((quote) => ({
      ...quote,
      total: Number(quote.total),
    }))

    return NextResponse.json({
      stats: {
        orders: {
          total: totalOrders,
          thisMonth: monthOrders,
          growth: Math.round(orderGrowth),
          pending: pendingOrders,
          inProduction: inProductionOrders,
          completed: completedOrders,
        },
        revenue: {
          total: Number(totalRevenue._sum.total || 0),
          thisMonth: Number(monthRevenue._sum.total || 0),
          lastMonth: Number(lastMonthRevenue._sum.total || 0),
          growth: Math.round(revenueGrowth),
        },
        quotes: {
          total: totalQuotes,
          pending: pendingQuotes,
          acceptedThisMonth: acceptedQuotesThisMonth,
        },
        appointments: {
          today: todayAppointments,
          upcoming: upcomingAppointments,
          completedThisMonth: completedAppointmentsThisMonth,
        },
        customers: {
          total: totalCustomers,
          newThisMonth: newCustomersThisMonth,
        },
        conversations: {
          active: activeConversations,
          waitingHuman: waitingHumanConversations,
        },
      },
      recentOrders: serializedRecentOrders,
      recentQuotes: serializedRecentQuotes,
      todaySchedule: todaySchedule,
    })
  } catch (error) {
    logger.error('Get dashboard stats error:', error)
    return NextResponse.json({ error: 'Failed to get dashboard stats' }, { status: 500 })
  }
}
