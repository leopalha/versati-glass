import { prisma } from '@/lib/prisma'
import { AdminHeader } from '@/components/admin/admin-header'
import { Card } from '@/components/ui/card'
import { formatCurrency } from '@/lib/utils'
import {
  Package,
  FileText,
  Calendar,
  Users,
  DollarSign,
  TrendingUp,
  Clock,
  MessageSquare,
  AlertCircle,
} from 'lucide-react'
import Link from 'next/link'

async function getDashboardStats() {
  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
  const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0)

  const [
    totalOrders,
    monthlyOrders,
    lastMonthOrders,
    pendingOrders,
    totalQuotes,
    pendingQuotes,
    todayAppointments,
    totalCustomers,
    monthlyRevenue,
    lastMonthRevenue,
    waitingConversations,
    recentOrders,
    recentQuotes,
  ] = await Promise.all([
    prisma.order.count(),
    prisma.order.count({ where: { createdAt: { gte: startOfMonth } } }),
    prisma.order.count({
      where: { createdAt: { gte: startOfLastMonth, lte: endOfLastMonth } },
    }),
    prisma.order.count({
      where: { status: { notIn: ['CONCLUIDO', 'CANCELADO'] } },
    }),
    prisma.quote.count(),
    prisma.quote.count({ where: { status: { in: ['SENT', 'VIEWED'] } } }),
    prisma.appointment.count({
      where: {
        scheduledDate: {
          gte: new Date(now.setHours(0, 0, 0, 0)),
          lt: new Date(now.setHours(23, 59, 59, 999)),
        },
        status: { in: ['SCHEDULED', 'CONFIRMED'] },
      },
    }),
    prisma.user.count({ where: { role: 'CUSTOMER' } }),
    prisma.order.aggregate({
      where: { createdAt: { gte: startOfMonth }, paymentStatus: 'PAID' },
      _sum: { total: true },
    }),
    prisma.order.aggregate({
      where: {
        createdAt: { gte: startOfLastMonth, lte: endOfLastMonth },
        paymentStatus: 'PAID',
      },
      _sum: { total: true },
    }),
    prisma.conversation.count({ where: { status: 'WAITING_HUMAN' } }),
    prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: { user: { select: { name: true } } },
    }),
    prisma.quote.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
      where: { status: { in: ['SENT', 'VIEWED'] } },
    }),
  ])

  const monthlyRevenueValue = Number(monthlyRevenue._sum.total || 0)
  const lastMonthRevenueValue = Number(lastMonthRevenue._sum.total || 0)
  const revenueGrowth =
    lastMonthRevenueValue > 0
      ? ((monthlyRevenueValue - lastMonthRevenueValue) / lastMonthRevenueValue) * 100
      : 0

  return {
    totalOrders,
    monthlyOrders,
    lastMonthOrders,
    pendingOrders,
    totalQuotes,
    pendingQuotes,
    todayAppointments,
    totalCustomers,
    monthlyRevenue: monthlyRevenueValue,
    revenueGrowth,
    waitingConversations,
    recentOrders,
    recentQuotes,
  }
}

const statusLabels: Record<string, { label: string; color: string }> = {
  ORCAMENTO_ENVIADO: { label: 'Orcamento', color: 'bg-blue-500/20 text-blue-400' },
  AGUARDANDO_PAGAMENTO: { label: 'Aguardando Pag.', color: 'bg-yellow-500/20 text-yellow-400' },
  APROVADO: { label: 'Aprovado', color: 'bg-green-500/20 text-green-400' },
  EM_PRODUCAO: { label: 'Producao', color: 'bg-purple-500/20 text-purple-400' },
  INSTALACAO_AGENDADA: { label: 'Agendado', color: 'bg-indigo-500/20 text-indigo-400' },
  CONCLUIDO: { label: 'Concluido', color: 'bg-green-500/20 text-green-400' },
}

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats()

  return (
    <div>
      <AdminHeader title="Dashboard" subtitle="Visao geral do negocio" />

      <div className="p-6">
        {/* Alert for waiting conversations */}
        {stats.waitingConversations > 0 && (
          <div className="mb-6 rounded-lg bg-yellow-500/10 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <AlertCircle className="h-5 w-5 text-yellow-400" />
                <div>
                  <p className="font-medium text-yellow-400">
                    {stats.waitingConversations} conversa(s) aguardando atendimento
                  </p>
                  <p className="text-sm text-neutral-400">
                    Clientes solicitaram atendimento humano
                  </p>
                </div>
              </div>
              <Link
                href="/admin/conversas?status=waiting"
                className="rounded-lg bg-yellow-500 px-4 py-2 text-sm font-medium text-black hover:bg-yellow-400"
              >
                Atender Agora
              </Link>
            </div>
          </div>
        )}

        {/* Stats Grid */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="p-4">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-500/20">
                <DollarSign className="h-6 w-6 text-green-400" />
              </div>
              <div>
                <p className="text-sm text-neutral-400">Faturamento (mes)</p>
                <p className="text-2xl font-bold text-white">
                  {formatCurrency(stats.monthlyRevenue)}
                </p>
                {stats.revenueGrowth !== 0 && (
                  <p
                    className={`text-xs ${stats.revenueGrowth > 0 ? 'text-green-400' : 'text-red-400'}`}
                  >
                    {stats.revenueGrowth > 0 ? '+' : ''}
                    {stats.revenueGrowth.toFixed(1)}% vs mes anterior
                  </p>
                )}
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-500/20">
                <Package className="h-6 w-6 text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-neutral-400">Pedidos (mes)</p>
                <p className="text-2xl font-bold text-white">{stats.monthlyOrders}</p>
                <p className="text-xs text-neutral-500">{stats.pendingOrders} em andamento</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-500/20">
                <FileText className="h-6 w-6 text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-neutral-400">Orcamentos</p>
                <p className="text-2xl font-bold text-white">{stats.totalQuotes}</p>
                <p className="text-xs text-neutral-500">{stats.pendingQuotes} pendentes</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gold-500/20">
                <Calendar className="h-6 w-6 text-gold-400" />
              </div>
              <div>
                <p className="text-sm text-neutral-400">Agendamentos Hoje</p>
                <p className="text-2xl font-bold text-white">{stats.todayAppointments}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Second row stats */}
        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          <Card className="p-4">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-500/20">
                <Users className="h-5 w-5 text-cyan-400" />
              </div>
              <div>
                <p className="text-sm text-neutral-400">Total Clientes</p>
                <p className="text-xl font-bold text-white">{stats.totalCustomers}</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500/20">
                <MessageSquare className="h-5 w-5 text-orange-400" />
              </div>
              <div>
                <p className="text-sm text-neutral-400">Aguardando Humano</p>
                <p className="text-xl font-bold text-white">{stats.waitingConversations}</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-500/20">
                <TrendingUp className="h-5 w-5 text-indigo-400" />
              </div>
              <div>
                <p className="text-sm text-neutral-400">Total Pedidos</p>
                <p className="text-xl font-bold text-white">{stats.totalOrders}</p>
              </div>
            </div>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Recent Orders */}
          <Card className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-lg font-semibold text-white">Pedidos Recentes</h2>
              <Link href="/admin/pedidos" className="text-sm text-gold-500 hover:text-gold-400">
                Ver todos
              </Link>
            </div>

            <div className="space-y-3">
              {stats.recentOrders.map((order) => (
                <Link
                  key={order.id}
                  href={`/admin/pedidos/${order.id}`}
                  className="flex items-center justify-between rounded-lg border border-neutral-700 p-3 transition-colors hover:border-neutral-600 hover:bg-neutral-800"
                >
                  <div>
                    <p className="font-medium text-white">#{order.number}</p>
                    <p className="text-sm text-neutral-400">{order.user.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-white">{formatCurrency(Number(order.total))}</p>
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        statusLabels[order.status]?.color || 'bg-neutral-500/20 text-neutral-400'
                      }`}
                    >
                      {statusLabels[order.status]?.label || order.status}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </Card>

          {/* Pending Quotes */}
          <Card className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-lg font-semibold text-white">
                Orcamentos Pendentes
              </h2>
              <Link href="/admin/orcamentos" className="text-sm text-gold-500 hover:text-gold-400">
                Ver todos
              </Link>
            </div>

            <div className="space-y-3">
              {stats.recentQuotes.length === 0 ? (
                <p className="py-4 text-center text-neutral-500">Nenhum orcamento pendente</p>
              ) : (
                stats.recentQuotes.map((quote) => (
                  <Link
                    key={quote.id}
                    href={`/admin/orcamentos/${quote.id}`}
                    className="flex items-center justify-between rounded-lg border border-neutral-700 p-3 transition-colors hover:border-neutral-600 hover:bg-neutral-800"
                  >
                    <div>
                      <p className="font-medium text-white">#{quote.number}</p>
                      <p className="text-sm text-neutral-400">{quote.customerName}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-white">
                        {formatCurrency(Number(quote.total))}
                      </p>
                      <div className="flex items-center gap-1 text-xs text-neutral-400">
                        <Clock className="h-3 w-3" />
                        {new Date(quote.validUntil).toLocaleDateString('pt-BR')}
                      </div>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
