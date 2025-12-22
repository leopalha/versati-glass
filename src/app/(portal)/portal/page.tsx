import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { PortalHeader } from '@/components/portal/portal-header'
import { Card } from '@/components/ui/card'
import { formatCurrency } from '@/lib/utils'
import {
  Package,
  FileText,
  Calendar,
  Clock,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  ArrowRight,
} from 'lucide-react'
import { redirect } from 'next/navigation'
import Link from 'next/link'

async function getDashboardData(userId: string) {
  const [orders, quotes, appointments] = await Promise.all([
    prisma.order.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: {
        items: true,
      },
    }),
    prisma.quote.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 5,
    }),
    prisma.appointment.findMany({
      where: {
        userId,
        scheduledDate: { gte: new Date() },
        status: { in: ['SCHEDULED', 'CONFIRMED'] },
      },
      orderBy: { scheduledDate: 'asc' },
      take: 3,
    }),
  ])

  // Stats
  const [totalOrders, activeOrders, pendingQuotes] = await Promise.all([
    prisma.order.count({ where: { userId } }),
    prisma.order.count({
      where: {
        userId,
        status: { notIn: ['CONCLUIDO', 'CANCELADO'] },
      },
    }),
    prisma.quote.count({
      where: {
        userId,
        status: { in: ['SENT', 'VIEWED'] },
      },
    }),
  ])

  return {
    orders,
    quotes,
    appointments,
    stats: {
      totalOrders,
      activeOrders,
      pendingQuotes,
      nextAppointment: appointments[0],
    },
  }
}

const statusLabels: Record<string, { label: string; color: string }> = {
  ORCAMENTO_ENVIADO: { label: 'Orcamento Enviado', color: 'bg-blue-500/20 text-blue-400' },
  AGUARDANDO_PAGAMENTO: {
    label: 'Aguardando Pagamento',
    color: 'bg-yellow-500/20 text-yellow-400',
  },
  APROVADO: { label: 'Aprovado', color: 'bg-green-500/20 text-green-400' },
  EM_PRODUCAO: { label: 'Em Producao', color: 'bg-purple-500/20 text-purple-400' },
  PRONTO_ENTREGA: { label: 'Pronto p/ Entrega', color: 'bg-cyan-500/20 text-cyan-400' },
  INSTALACAO_AGENDADA: { label: 'Instalacao Agendada', color: 'bg-indigo-500/20 text-indigo-400' },
  INSTALANDO: { label: 'Instalando', color: 'bg-orange-500/20 text-orange-400' },
  CONCLUIDO: { label: 'Concluido', color: 'bg-green-500/20 text-green-400' },
  CANCELADO: { label: 'Cancelado', color: 'bg-red-500/20 text-red-400' },
}

export default async function PortalDashboardPage() {
  const session = await auth()

  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/portal")
  }

  const { orders, quotes, appointments, stats } = await getDashboardData(session.user.id)

  return (
    <div>
      <PortalHeader
        title={`Ola, ${session.user.name?.split(' ')[0] || 'Cliente'}!`}
        subtitle="Bem-vindo ao seu portal"
      />

      <div className="p-6">
        {/* Stats Cards */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="p-4">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-500/20">
                <Package className="h-6 w-6 text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-neutral-400">Total de Pedidos</p>
                <p className="text-2xl font-bold text-white">{stats.totalOrders}</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-yellow-500/20">
                <TrendingUp className="h-6 w-6 text-yellow-400" />
              </div>
              <div>
                <p className="text-sm text-neutral-400">Pedidos Ativos</p>
                <p className="text-2xl font-bold text-white">{stats.activeOrders}</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-500/20">
                <FileText className="h-6 w-6 text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-neutral-400">Orcamentos Pendentes</p>
                <p className="text-2xl font-bold text-white">{stats.pendingQuotes}</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-500/20">
                <Calendar className="h-6 w-6 text-green-400" />
              </div>
              <div>
                <p className="text-sm text-neutral-400">Proximo Agendamento</p>
                <p className="text-lg font-bold text-white">
                  {stats.nextAppointment
                    ? new Date(stats.nextAppointment.scheduledDate).toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: 'short',
                      })
                    : 'Nenhum'}
                </p>
              </div>
            </div>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Recent Orders */}
          <Card className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-lg font-semibold">Pedidos Recentes</h2>
              <Link
                href="/portal/pedidos"
                className="flex items-center gap-1 text-sm text-primary hover:text-primary/80"
              >
                Ver todos <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {orders.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Package className="mb-3 h-12 w-12 text-neutral-500" />
                <p className="text-neutral-400">Nenhum pedido ainda</p>
                <Link href="/orcamento" className="mt-2 text-sm text-gold-500 hover:text-gold-400">
                  Solicitar orcamento
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {orders.map((order) => (
                  <Link
                    key={order.id}
                    href={`/portal/pedidos/${order.id}`}
                    className="block rounded-lg border p-3 transition-colors hover:bg-accent"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-white">#{order.number}</p>
                        <p className="text-sm text-neutral-400">
                          {order.items.length} item(s) - {formatCurrency(Number(order.total))}
                        </p>
                      </div>
                      <span
                        className={`rounded-full px-2 py-1 text-xs font-medium ${
                          statusLabels[order.status]?.color || 'bg-neutral-500/20 text-neutral-700'
                        }`}
                      >
                        {statusLabels[order.status]?.label || order.status}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </Card>

          {/* Pending Quotes */}
          <Card className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-lg font-semibold">Orcamentos</h2>
              <Link
                href="/portal/orcamentos"
                className="flex items-center gap-1 text-sm text-primary hover:text-primary/80"
              >
                Ver todos <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {quotes.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <FileText className="mb-3 h-12 w-12 text-neutral-500" />
                <p className="text-neutral-400">Nenhum orcamento</p>
                <Link href="/orcamento" className="mt-2 text-sm text-gold-500 hover:text-gold-400">
                  Solicitar orcamento
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {quotes.map((quote) => (
                  <Link
                    key={quote.id}
                    href={`/portal/orcamentos/${quote.id}`}
                    className="block rounded-lg border p-3 transition-colors hover:bg-accent"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-white">#{quote.number}</p>
                        <p className="text-sm text-neutral-400">
                          {formatCurrency(Number(quote.total))}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {quote.status === 'SENT' && (
                          <span className="flex items-center gap-1 rounded-full bg-yellow-500/20 px-2 py-1 text-xs font-medium text-yellow-400">
                            <AlertCircle className="h-3 w-3" />
                            Aguardando
                          </span>
                        )}
                        {quote.status === 'ACCEPTED' && (
                          <span className="flex items-center gap-1 rounded-full bg-green-500/20 px-2 py-1 text-xs font-medium text-green-400">
                            <CheckCircle className="h-3 w-3" />
                            Aceito
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Upcoming Appointments */}
        {appointments.length > 0 && (
          <Card className="mt-6 p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-lg font-semibold">
                Proximos Agendamentos
              </h2>
              <Link
                href="/portal/agendamentos"
                className="flex items-center gap-1 text-sm text-primary hover:text-primary/80"
              >
                Ver todos <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {appointments.map((appointment) => (
                <div key={appointment.id} className="rounded-lg border p-4">
                  <div className="mb-2 flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    <span className="font-medium">
                      {new Date(appointment.scheduledDate).toLocaleDateString('pt-BR', {
                        weekday: 'long',
                        day: 'numeric',
                        month: 'long',
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-neutral-400">
                    <Clock className="h-4 w-4" />
                    <span>{appointment.scheduledTime}</span>
                  </div>
                  <p className="mt-2 text-sm text-neutral-400">
                    {appointment.type === 'VISITA_TECNICA'
                      ? 'Visita Tecnica'
                      : appointment.type === 'INSTALACAO'
                        ? 'Instalacao'
                        : appointment.type}
                  </p>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}
