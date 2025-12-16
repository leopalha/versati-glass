import { prisma } from '@/lib/prisma'
import { AdminHeader } from '@/components/admin/admin-header'
import { Card } from '@/components/ui/card'
import { OrdersFilters } from '@/components/admin/orders-filters'
import { formatCurrency } from '@/lib/utils'
import { Package, Eye, Calendar } from 'lucide-react'
import Link from 'next/link'

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

const paymentLabels: Record<string, { label: string; color: string }> = {
  PENDING: { label: 'Pendente', color: 'bg-yellow-500/20 text-yellow-400' },
  PARTIAL: { label: 'Parcial', color: 'bg-orange-500/20 text-orange-400' },
  PAID: { label: 'Pago', color: 'bg-green-500/20 text-green-400' },
  REFUNDED: { label: 'Estornado', color: 'bg-red-500/20 text-red-400' },
}

interface AdminPedidosPageProps {
  searchParams: Promise<{
    search?: string
    status?: string
    paymentStatus?: string
    dateFrom?: string
    dateTo?: string
  }>
}

export default async function AdminPedidosPage({ searchParams }: AdminPedidosPageProps) {
  const params = await searchParams

  // Build where clause based on filters
  const where: Record<string, unknown> = {}

  if (params.status) {
    where.status = params.status
  }

  if (params.paymentStatus) {
    where.paymentStatus = params.paymentStatus
  }

  if (params.search) {
    where.OR = [
      { number: { contains: params.search, mode: 'insensitive' } },
      { user: { name: { contains: params.search, mode: 'insensitive' } } },
      { user: { email: { contains: params.search, mode: 'insensitive' } } },
    ]
  }

  if (params.dateFrom || params.dateTo) {
    const dateFilter: { gte?: Date; lte?: Date } = {}
    if (params.dateFrom) {
      dateFilter.gte = new Date(params.dateFrom)
    }
    if (params.dateTo) {
      const endDate = new Date(params.dateTo)
      endDate.setHours(23, 59, 59, 999)
      dateFilter.lte = endDate
    }
    where.createdAt = dateFilter
  }

  const orders = await prisma.order.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    take: 100,
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

  const stats = await prisma.order.groupBy({
    by: ['status'],
    _count: true,
  })

  const statusCounts = stats.reduce(
    (acc, curr) => {
      acc[curr.status] = curr._count
      return acc
    },
    {} as Record<string, number>
  )

  const hasFilters =
    params.search || params.status || params.paymentStatus || params.dateFrom || params.dateTo

  return (
    <div>
      <AdminHeader
        title="Pedidos"
        subtitle={
          hasFilters ? `${orders.length} resultado(s) encontrado(s)` : `${orders.length} pedido(s)`
        }
        actions={
          <div className="flex gap-2">
            <OrdersFilters />
          </div>
        }
      />

      <div className="p-6">
        {/* Status filters - only show when no other filters active */}
        {!hasFilters && (
          <div className="mb-6 flex flex-wrap gap-2">
            <Link
              href="/admin/pedidos"
              className="rounded-lg bg-gold-500/10 px-3 py-1.5 text-sm font-medium text-gold-500"
            >
              Todos ({orders.length})
            </Link>
            {Object.entries(statusLabels).map(([status, { label }]) => {
              const count = statusCounts[status] || 0
              if (count === 0) return null
              return (
                <Link
                  key={status}
                  href={`/admin/pedidos?status=${status}`}
                  className="hover:bg-neutral-250 rounded-lg bg-neutral-200 px-3 py-1.5 text-sm text-neutral-700 hover:text-white"
                >
                  {label} ({count})
                </Link>
              )
            })}
          </div>
        )}

        {/* Active filters display */}
        {hasFilters && (
          <div className="mb-4 flex flex-wrap gap-2">
            <p className="text-sm text-neutral-700">Filtros ativos:</p>
            {params.search && (
              <span className="rounded-lg bg-gold-500/10 px-3 py-1 text-sm text-gold-500">
                Busca: {params.search}
              </span>
            )}
            {params.status && (
              <span className="rounded-lg bg-gold-500/10 px-3 py-1 text-sm text-gold-500">
                Status: {statusLabels[params.status]?.label || params.status}
              </span>
            )}
            {params.paymentStatus && (
              <span className="rounded-lg bg-gold-500/10 px-3 py-1 text-sm text-gold-500">
                Pagamento: {paymentLabels[params.paymentStatus]?.label || params.paymentStatus}
              </span>
            )}
            {params.dateFrom && (
              <span className="rounded-lg bg-gold-500/10 px-3 py-1 text-sm text-gold-500">
                De: {new Date(params.dateFrom).toLocaleDateString('pt-BR')}
              </span>
            )}
            {params.dateTo && (
              <span className="rounded-lg bg-gold-500/10 px-3 py-1 text-sm text-gold-500">
                Até: {new Date(params.dateTo).toLocaleDateString('pt-BR')}
              </span>
            )}
            <Link
              href="/admin/pedidos"
              className="rounded-lg px-3 py-1 text-sm text-neutral-700 underline hover:text-white"
            >
              Limpar filtros
            </Link>
          </div>
        )}

        {orders.length === 0 ? (
          <Card className="flex flex-col items-center justify-center p-12 text-center">
            <Package className="mb-4 h-16 w-16 text-neutral-600" />
            <h3 className="mb-2 font-display text-xl font-semibold text-white">
              {hasFilters ? 'Nenhum pedido encontrado' : 'Nenhum pedido'}
            </h3>
            <p className="text-neutral-700">
              {hasFilters
                ? 'Tente ajustar os filtros para encontrar o que procura'
                : 'Os pedidos aparecerao aqui'}
            </p>
          </Card>
        ) : (
          <div className="overflow-hidden rounded-lg border border-neutral-400">
            <table className="w-full">
              <thead className="bg-neutral-200">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-neutral-700">
                    Pedido
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-neutral-700">
                    Cliente
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-neutral-700">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-neutral-700">
                    Pagamento
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-neutral-700">
                    Total
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-neutral-700">Data</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-neutral-700">
                    Acoes
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-300">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-neutral-200/50">
                    <td className="px-4 py-3">
                      <p className="font-medium text-white">#{order.number}</p>
                      <p className="text-xs text-neutral-600">{order.items.length} item(s)</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-white">{order.user.name}</p>
                      <p className="text-xs text-neutral-600">{order.user.email}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2 py-1 text-xs font-medium ${
                          statusLabels[order.status]?.color || 'bg-neutral-500/20 text-neutral-700'
                        }`}
                      >
                        {statusLabels[order.status]?.label || order.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2 py-1 text-xs font-medium ${
                          paymentLabels[order.paymentStatus]?.color ||
                          'bg-neutral-500/20 text-neutral-700'
                        }`}
                      >
                        {paymentLabels[order.paymentStatus]?.label || order.paymentStatus}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-white">
                        {formatCurrency(Number(order.total))}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 text-sm text-neutral-700">
                        <Calendar className="h-4 w-4" />
                        {new Date(order.createdAt).toLocaleDateString('pt-BR')}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        href={`/admin/pedidos/${order.id}`}
                        className="inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm text-gold-500 hover:bg-gold-500/10"
                      >
                        <Eye className="h-4 w-4" />
                        Ver
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
