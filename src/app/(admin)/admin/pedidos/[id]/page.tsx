import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { AdminHeader } from '@/components/admin/admin-header'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatCurrency, formatDate } from '@/lib/utils'
import {
  Package,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  CreditCard,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Truck,
  Wrench,
} from 'lucide-react'
import Link from 'next/link'
import { OrderTimeline } from '@/components/admin/order-timeline'
import { UpdateOrderStatus } from '@/components/admin/update-order-status'
import { ScheduleInstallationButton } from '@/components/admin/schedule-installation-button'

interface OrderDetailPageProps {
  params: Promise<{ id: string }>
}

const orderStatusLabels: Record<string, { label: string; color: string; icon: typeof Clock }> = {
  ORCAMENTO_ENVIADO: {
    label: 'Orçamento Enviado',
    color: 'bg-blue-500/20 text-blue-400',
    icon: AlertCircle,
  },
  AGUARDANDO_PAGAMENTO: {
    label: 'Aguardando Pagamento',
    color: 'bg-yellow-500/20 text-yellow-400',
    icon: Clock,
  },
  APROVADO: { label: 'Aprovado', color: 'bg-green-500/20 text-green-400', icon: CheckCircle },
  EM_PRODUCAO: { label: 'Em Produção', color: 'bg-purple-500/20 text-purple-400', icon: Package },
  PRONTO_ENTREGA: {
    label: 'Pronto p/ Entrega',
    color: 'bg-cyan-500/20 text-cyan-400',
    icon: Truck,
  },
  INSTALACAO_AGENDADA: {
    label: 'Instalação Agendada',
    color: 'bg-indigo-500/20 text-indigo-400',
    icon: Calendar,
  },
  INSTALANDO: { label: 'Instalando', color: 'bg-orange-500/20 text-orange-400', icon: Wrench },
  CONCLUIDO: { label: 'Concluído', color: 'bg-green-500/20 text-green-400', icon: CheckCircle },
  CANCELADO: { label: 'Cancelado', color: 'bg-red-500/20 text-red-400', icon: XCircle },
}

const paymentStatusLabels: Record<string, { label: string; color: string }> = {
  PENDING: { label: 'Pendente', color: 'bg-yellow-500/20 text-yellow-400' },
  PAID: { label: 'Pago', color: 'bg-green-500/20 text-green-400' },
  PARTIAL: { label: 'Parcial', color: 'bg-blue-500/20 text-blue-400' },
  REFUNDED: { label: 'Reembolsado', color: 'bg-red-500/20 text-red-400' },
}

export default async function OrderDetailPage({ params }: OrderDetailPageProps) {
  const { id } = await params

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      user: true,
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
      quote: {
        select: {
          id: true,
          number: true,
        },
      },
      timeline: {
        orderBy: { createdAt: 'desc' },
      },
      appointments: {
        take: 1,
        orderBy: { scheduledDate: 'desc' },
      },
    },
  })

  if (!order) {
    notFound()
  }

  const statusInfo = orderStatusLabels[order.status] || orderStatusLabels.APROVADO
  const StatusIcon = statusInfo.icon
  const paymentInfo = paymentStatusLabels[order.paymentStatus] || paymentStatusLabels.PENDING

  // Verificar se pode agendar instalação
  const canScheduleInstallation =
    order.status === 'PRONTO_ENTREGA' && order.serviceStreet && order.appointments.length === 0

  return (
    <div>
      <AdminHeader
        title={`Pedido #${order.number}`}
        subtitle={`Criado em ${formatDate(order.createdAt)}`}
        actions={
          <div className="flex gap-2">
            {canScheduleInstallation && (
              <ScheduleInstallationButton
                orderId={order.id}
                orderNumber={order.number}
                customerName={order.user.name}
                serviceAddress={{
                  street: order.serviceStreet,
                  number: order.serviceNumber,
                  complement: order.serviceComplement,
                  neighborhood: order.serviceNeighborhood,
                  city: order.serviceCity,
                  state: order.serviceState,
                  zipCode: order.serviceZipCode,
                }}
              />
            )}
            <Button variant="outline" asChild>
              <Link href="/admin/pedidos">Voltar</Link>
            </Button>
          </div>
        }
      />

      <div className="space-y-6 p-6">
        {/* Status e Atualização */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="p-6">
            <h3 className="mb-4 font-display text-lg font-semibold text-white">Status do Pedido</h3>
            <div className="mb-4 flex items-center gap-3">
              <Badge className={`${statusInfo.color} px-3 py-1 text-sm`}>
                <StatusIcon className="mr-2 h-4 w-4" />
                {statusInfo.label}
              </Badge>
              <Badge className={paymentInfo.color}>
                <CreditCard className="mr-2 h-4 w-4" />
                {paymentInfo.label}
              </Badge>
            </div>
            <UpdateOrderStatus orderId={order.id} currentStatus={order.status} />
          </Card>

          <Card className="p-6">
            <h3 className="mb-4 font-display text-lg font-semibold text-white">Valores</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-neutral-700">Subtotal</span>
                <span className="text-white">{formatCurrency(Number(order.subtotal))}</span>
              </div>
              {Number(order.discount) > 0 && (
                <div className="flex justify-between text-green-400">
                  <span>Desconto</span>
                  <span>-{formatCurrency(Number(order.discount))}</span>
                </div>
              )}
              <div className="flex justify-between border-t border-neutral-300 pt-3">
                <span className="font-semibold text-white">Total</span>
                <span className="text-xl font-bold text-accent-500">
                  {formatCurrency(Number(order.total))}
                </span>
              </div>
            </div>
          </Card>
        </div>

        {/* Cliente */}
        <Card className="p-6">
          <div className="mb-4 flex items-center gap-2">
            <User className="h-5 w-5 text-accent-500" />
            <h3 className="font-display text-lg font-semibold text-white">Cliente</h3>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="flex items-start gap-3">
              <User className="mt-0.5 h-4 w-4 text-neutral-600" />
              <div>
                <p className="text-xs text-neutral-700">Nome</p>
                <Link
                  href={`/admin/clientes/${order.user.id}`}
                  className="text-sm text-accent-500 hover:underline"
                >
                  {order.user.name}
                </Link>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Mail className="mt-0.5 h-4 w-4 text-neutral-600" />
              <div>
                <p className="text-xs text-neutral-700">Email</p>
                <p className="text-sm text-white">{order.user.email}</p>
              </div>
            </div>
            {order.user.phone && (
              <div className="flex items-start gap-3">
                <Phone className="mt-0.5 h-4 w-4 text-neutral-600" />
                <div>
                  <p className="text-xs text-neutral-700">Telefone</p>
                  <p className="text-sm text-white">{order.user.phone}</p>
                </div>
              </div>
            )}
            {order.serviceStreet && (
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 text-neutral-600" />
                <div>
                  <p className="text-xs text-neutral-700">Endereço de Instalação</p>
                  <p className="text-sm text-white">
                    {order.serviceStreet}, {order.serviceNumber}
                    {order.serviceComplement && ` - ${order.serviceComplement}`}
                    <br />
                    {order.serviceNeighborhood}, {order.serviceCity}/{order.serviceState}
                  </p>
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Itens do Pedido */}
        <Card className="p-6">
          <div className="mb-4 flex items-center gap-2">
            <Package className="h-5 w-5 text-accent-500" />
            <h3 className="font-display text-lg font-semibold text-white">
              Itens do Pedido ({order.items.length})
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-neutral-300">
                <tr>
                  <th className="pb-3 text-left text-sm font-medium text-neutral-700">Produto</th>
                  <th className="pb-3 text-center text-sm font-medium text-neutral-700">Qtd</th>
                  <th className="pb-3 text-right text-sm font-medium text-neutral-700">
                    Preço Unit.
                  </th>
                  <th className="pb-3 text-right text-sm font-medium text-neutral-700">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-300">
                {order.items.map((item) => (
                  <tr key={item.id}>
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        {item.product?.thumbnail && (
                          <img
                            src={item.product.thumbnail}
                            alt={item.product.name}
                            className="h-12 w-12 rounded-lg object-cover"
                          />
                        )}
                        <div>
                          <p className="font-medium text-white">
                            {item.product?.name || item.description}
                          </p>
                          {item.specifications && (
                            <p className="text-xs text-neutral-700">{item.specifications}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 text-center text-white">{item.quantity}</td>
                    <td className="py-4 text-right text-white">
                      {formatCurrency(Number(item.unitPrice))}
                    </td>
                    <td className="py-4 text-right font-medium text-accent-500">
                      {formatCurrency(Number(item.totalPrice))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Timeline e Observações */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="p-6">
            <div className="mb-4 flex items-center gap-2">
              <Clock className="h-5 w-5 text-accent-500" />
              <h3 className="font-display text-lg font-semibold text-white">Timeline</h3>
            </div>
            <OrderTimeline entries={order.timeline} currentStatus={order.status} />
          </Card>

          <Card className="p-6">
            <div className="mb-4 flex items-center gap-2">
              <FileText className="h-5 w-5 text-accent-500" />
              <h3 className="font-display text-lg font-semibold text-white">
                Informações Adicionais
              </h3>
            </div>
            <div className="space-y-4">
              {order.quote && (
                <div>
                  <p className="mb-1 text-xs text-neutral-700">Orçamento de Origem</p>
                  <Link
                    href={`/admin/orcamentos/${order.quote.id}`}
                    className="text-accent-500 hover:underline"
                  >
                    #{order.quote.number}
                  </Link>
                </div>
              )}
              {order.internalNotes && (
                <div>
                  <p className="mb-1 text-xs text-neutral-700">Notas Internas</p>
                  <p className="whitespace-pre-wrap text-sm text-yellow-400">
                    {order.internalNotes}
                  </p>
                </div>
              )}
              {order.appointments && order.appointments[0] && (
                <div>
                  <p className="mb-1 text-xs text-neutral-700">Instalação Agendada</p>
                  <p className="text-sm text-white">
                    {formatDate(order.appointments[0].scheduledDate)} às{' '}
                    {order.appointments[0].scheduledTime}
                  </p>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
