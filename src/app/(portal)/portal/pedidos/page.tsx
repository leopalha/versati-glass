import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { PortalHeader } from '@/components/portal/portal-header'
import { Card } from '@/components/ui/card'
import { formatCurrency } from '@/lib/utils'
import { Package, Eye, Calendar } from 'lucide-react'
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

export default async function PedidosPage() {
  const session = await auth()

  if (!session?.user?.id) {
    return null
  }

  const orders = await prisma.order.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
  })

  return (
    <div>
      <PortalHeader title="Meus Pedidos" subtitle={`${orders.length} pedido(s)`} />

      <div className="p-6">
        {orders.length === 0 ? (
          <Card className="flex flex-col items-center justify-center p-12 text-center">
            <Package className="mb-4 h-16 w-16 text-neutral-500" />
            <h3 className="mb-2 font-display text-xl font-semibold text-white">
              Nenhum pedido ainda
            </h3>
            <p className="mb-4 text-neutral-400">
              Solicite um orcamento para comecar
            </p>
            <Link
              href="/orcamento"
              className="rounded-lg bg-gold-500 px-6 py-2 font-medium text-black hover:bg-gold-400"
            >
              Solicitar Orcamento
            </Link>
          </Card>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <Card key={order.id} className="p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="font-display text-lg font-semibold text-white">
                        Pedido #{order.number}
                      </h3>
                      <span
                        className={`rounded-full px-2 py-1 text-xs font-medium ${
                          statusLabels[order.status]?.color || 'bg-neutral-500/20 text-neutral-400'
                        }`}
                      >
                        {statusLabels[order.status]?.label || order.status}
                      </span>
                    </div>
                    <div className="mt-2 flex items-center gap-4 text-sm text-neutral-400">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {new Date(order.createdAt).toLocaleDateString('pt-BR')}
                      </span>
                      <span>{order.items.length} item(s)</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm text-neutral-400">Total</p>
                      <p className="font-display text-xl font-bold text-gold-500">
                        {formatCurrency(Number(order.total))}
                      </p>
                    </div>
                    <Link
                      href={`/portal/pedidos/${order.id}`}
                      className="flex items-center gap-2 rounded-lg border border-gold-500 px-4 py-2 text-gold-500 transition-colors hover:bg-gold-500 hover:text-black"
                    >
                      <Eye className="h-4 w-4" />
                      <span>Ver Detalhes</span>
                    </Link>
                  </div>
                </div>

                {/* Items preview */}
                <div className="mt-4 border-t border-neutral-300 pt-4">
                  <div className="flex flex-wrap gap-2">
                    {order.items.slice(0, 3).map((item) => (
                      <span
                        key={item.id}
                        className="rounded-lg bg-neutral-200 px-3 py-1 text-sm text-neutral-300"
                      >
                        {item.description}
                      </span>
                    ))}
                    {order.items.length > 3 && (
                      <span className="rounded-lg bg-neutral-200 px-3 py-1 text-sm text-neutral-400">
                        +{order.items.length - 3} mais
                      </span>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
