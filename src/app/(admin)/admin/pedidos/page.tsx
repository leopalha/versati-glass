import { prisma } from '@/lib/prisma'
import { AdminHeader } from '@/components/admin/admin-header'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { formatCurrency } from '@/lib/utils'
import { Package, Eye, Calendar, Search, Filter } from 'lucide-react'
import Link from 'next/link'

const statusLabels: Record<string, { label: string; color: string }> = {
  ORCAMENTO_ENVIADO: { label: 'Orcamento Enviado', color: 'bg-blue-500/20 text-blue-400' },
  AGUARDANDO_PAGAMENTO: { label: 'Aguardando Pagamento', color: 'bg-yellow-500/20 text-yellow-400' },
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

export default async function AdminPedidosPage() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: 'desc' },
    take: 50,
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

  return (
    <div>
      <AdminHeader
        title="Pedidos"
        subtitle={`${orders.length} pedido(s)`}
        actions={
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Filter className="mr-2 h-4 w-4" />
              Filtrar
            </Button>
            <Button variant="outline" size="sm">
              <Search className="mr-2 h-4 w-4" />
              Buscar
            </Button>
          </div>
        }
      />

      <div className="p-6">
        {/* Status filters */}
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
                className="rounded-lg bg-neutral-200 px-3 py-1.5 text-sm text-neutral-400 hover:bg-neutral-250 hover:text-white"
              >
                {label} ({count})
              </Link>
            )
          })}
        </div>

        {orders.length === 0 ? (
          <Card className="flex flex-col items-center justify-center p-12 text-center">
            <Package className="mb-4 h-16 w-16 text-neutral-500" />
            <h3 className="mb-2 font-display text-xl font-semibold text-white">
              Nenhum pedido
            </h3>
            <p className="text-neutral-400">
              Os pedidos aparecerao aqui
            </p>
          </Card>
        ) : (
          <div className="overflow-hidden rounded-lg border border-neutral-300">
            <table className="w-full">
              <thead className="bg-neutral-200">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-neutral-400">
                    Pedido
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-neutral-400">
                    Cliente
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-neutral-400">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-neutral-400">
                    Pagamento
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-neutral-400">
                    Total
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-neutral-400">
                    Data
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-neutral-400">
                    Acoes
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-300">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-neutral-200/50">
                    <td className="px-4 py-3">
                      <p className="font-medium text-white">#{order.number}</p>
                      <p className="text-xs text-neutral-500">
                        {order.items.length} item(s)
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-white">{order.user.name}</p>
                      <p className="text-xs text-neutral-500">{order.user.email}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2 py-1 text-xs font-medium ${
                          statusLabels[order.status]?.color || 'bg-neutral-500/20 text-neutral-400'
                        }`}
                      >
                        {statusLabels[order.status]?.label || order.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2 py-1 text-xs font-medium ${
                          paymentLabels[order.paymentStatus]?.color || 'bg-neutral-500/20 text-neutral-400'
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
                      <div className="flex items-center gap-1 text-sm text-neutral-400">
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
