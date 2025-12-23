import { notFound, redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { PortalHeader } from '@/components/portal/portal-header'
import { Card } from '@/components/ui/card'
import { formatCurrency } from '@/lib/utils'
import {
  Package,
  MapPin,
  Calendar,
  Clock,
  CheckCircle,
  Circle,
  ArrowLeft,
  FileText,
  CreditCard,
} from 'lucide-react'
import Link from 'next/link'
import { PaymentButton } from '@/components/portal/payment-button'
import { UploadDocumentDialog } from '@/components/portal/upload-document-dialog'

interface PageProps {
  params: Promise<{ id: string }>
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

const statusOrder = [
  'ORCAMENTO_ENVIADO',
  'AGUARDANDO_PAGAMENTO',
  'APROVADO',
  'EM_PRODUCAO',
  'PRONTO_ENTREGA',
  'INSTALACAO_AGENDADA',
  'INSTALANDO',
  'CONCLUIDO',
]

export default async function PedidoDetalhePage({ params }: PageProps) {
  const session = await auth()
  const { id } = await params

  if (!session?.user?.id) {
    redirect('/login')
  }

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
    },
  })

  if (!order || order.userId !== session.user.id) {
    notFound()
  }

  const currentStatusIndex = statusOrder.indexOf(order.status)

  return (
    <div>
      <PortalHeader
        title={`Pedido #${order.number}`}
        subtitle={`Criado em ${new Date(order.createdAt).toLocaleDateString('pt-BR')}`}
      />

      <div className="p-6">
        {/* Back button */}
        <Link
          href="/portal/pedidos"
          className="mb-6 inline-flex items-center gap-2 text-neutral-400 hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar para pedidos
        </Link>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main content */}
          <div className="space-y-6 lg:col-span-2">
            {/* Status */}
            <Card className="p-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-display text-lg font-semibold text-white">Status do Pedido</h2>
                <span
                  className={`rounded-full px-3 py-1 text-sm font-medium ${
                    statusLabels[order.status]?.color || 'bg-neutral-500/20 text-neutral-700'
                  }`}
                >
                  {statusLabels[order.status]?.label || order.status}
                </span>
              </div>

              {/* Progress bar */}
              <div className="mb-4">
                <div className="flex justify-between">
                  {statusOrder.slice(0, 5).map((status, index) => (
                    <div key={status} className="flex flex-col items-center">
                      <div
                        className={`flex h-8 w-8 items-center justify-center rounded-full ${
                          index <= currentStatusIndex
                            ? 'bg-gold-500 text-black'
                            : 'bg-neutral-300 text-neutral-600'
                        }`}
                      >
                        {index < currentStatusIndex ? (
                          <CheckCircle className="h-5 w-5" />
                        ) : (
                          <Circle className="h-5 w-5" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="relative mt-2 h-1 rounded-full bg-neutral-300">
                  <div
                    className="absolute left-0 top-0 h-full rounded-full bg-gold-500"
                    style={{
                      width: `${Math.min((currentStatusIndex / 4) * 100, 100)}%`,
                    }}
                  />
                </div>
              </div>

              {/* Payment action */}
              {order.status === 'AGUARDANDO_PAGAMENTO' && order.paymentStatus === 'PENDING' && (
                <div className="mt-4 rounded-lg bg-yellow-500/10 p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <CreditCard className="h-5 w-5 text-yellow-400" />
                      <div>
                        <p className="font-medium text-white">Pagamento Pendente</p>
                        <p className="text-sm text-neutral-300">
                          Realize o pagamento para continuar
                        </p>
                      </div>
                    </div>
                    <PaymentButton orderId={order.id} />
                  </div>
                </div>
              )}
            </Card>

            {/* Items */}
            <Card className="p-6">
              <h2 className="mb-4 font-display text-lg font-semibold text-white">
                Itens do Pedido
              </h2>

              <div className="space-y-4">
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-start justify-between rounded-lg border border-neutral-700 p-4"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-neutral-800">
                        <Package className="h-6 w-6 text-neutral-400" />
                      </div>
                      <div>
                        <p className="font-medium text-white">{item.description}</p>
                        {item.specifications && (
                          <p className="text-sm text-neutral-400">{item.specifications}</p>
                        )}
                        <div className="mt-1 flex gap-2">
                          {item.color && (
                            <span className="rounded bg-neutral-800 px-2 py-0.5 text-xs text-neutral-300">
                              {item.color}
                            </span>
                          )}
                          {item.finish && (
                            <span className="rounded bg-neutral-800 px-2 py-0.5 text-xs text-neutral-300">
                              {item.finish}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-white">
                        {formatCurrency(Number(item.totalPrice))}
                      </p>
                      <p className="text-sm text-neutral-400">Qtd: {item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Timeline */}
            {order.timeline.length > 0 && (
              <Card className="p-6">
                <h2 className="mb-4 font-display text-lg font-semibold text-white">Historico</h2>

                <div className="space-y-4">
                  {order.timeline.map((entry, index) => (
                    <div key={entry.id} className="flex gap-4">
                      <div className="relative flex flex-col items-center">
                        <div
                          className={`flex h-8 w-8 items-center justify-center rounded-full ${
                            index === 0
                              ? 'bg-gold-500 text-black'
                              : 'bg-neutral-300 text-neutral-600'
                          }`}
                        >
                          <Clock className="h-4 w-4" />
                        </div>
                        {index < order.timeline.length - 1 && (
                          <div className="absolute top-8 h-full w-px bg-neutral-300" />
                        )}
                      </div>
                      <div className="pb-4">
                        <p className="font-medium text-white">{entry.status}</p>
                        <p className="text-sm text-neutral-400">{entry.description}</p>
                        <p className="mt-1 text-xs text-neutral-500">
                          {new Date(entry.createdAt).toLocaleString('pt-BR')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Order Summary */}
            <Card className="p-6">
              <h2 className="mb-4 font-display text-lg font-semibold text-white">Resumo</h2>

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-400">Subtotal</span>
                  <span className="text-white">{formatCurrency(Number(order.subtotal))}</span>
                </div>
                {Number(order.discount) > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-neutral-400">Desconto</span>
                    <span className="text-green-400">
                      -{formatCurrency(Number(order.discount))}
                    </span>
                  </div>
                )}
                {Number(order.installationFee) > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-neutral-400">Instalacao</span>
                    <span className="text-white">
                      {formatCurrency(Number(order.installationFee))}
                    </span>
                  </div>
                )}
                <div className="border-t border-neutral-400 pt-3">
                  <div className="flex justify-between">
                    <span className="font-medium text-white">Total</span>
                    <span className="font-display text-xl font-bold text-gold-500">
                      {formatCurrency(Number(order.total))}
                    </span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Address */}
            <Card className="p-6">
              <div className="mb-4 flex items-center gap-2">
                <MapPin className="h-5 w-5 text-gold-500" />
                <h2 className="font-display text-lg font-semibold text-white">Endereco</h2>
              </div>

              <p className="text-neutral-300">
                {order.serviceStreet}, {order.serviceNumber}
                {order.serviceComplement && ` - ${order.serviceComplement}`}
                <br />
                {order.serviceNeighborhood}
                <br />
                {order.serviceCity} - {order.serviceState}
                <br />
                CEP: {order.serviceZipCode}
              </p>
            </Card>

            {/* Appointments */}
            {order.appointments.length > 0 && (
              <Card className="p-6">
                <div className="mb-4 flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-gold-500" />
                  <h2 className="font-display text-lg font-semibold text-white">Agendamentos</h2>
                </div>

                <div className="space-y-3">
                  {order.appointments.map((appointment) => (
                    <div key={appointment.id} className="rounded-lg border border-neutral-700 p-3">
                      <p className="font-medium text-white">
                        {appointment.type === 'VISITA_TECNICA'
                          ? 'Visita Tecnica'
                          : appointment.type === 'INSTALACAO'
                            ? 'Instalacao'
                            : appointment.type}
                      </p>
                      <p className="text-sm text-neutral-400">
                        {new Date(appointment.scheduledDate).toLocaleDateString('pt-BR')} as{' '}
                        {appointment.scheduledTime}
                      </p>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Documents */}
            <Card className="p-6">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-gold-500" />
                  <h2 className="font-display text-lg font-semibold text-white">Documentos</h2>
                </div>
                <UploadDocumentDialog orderId={order.id} />
              </div>

              {order.documents.length > 0 ? (
                <div className="space-y-2">
                  {order.documents.map((doc) => (
                    <a
                      key={doc.id}
                      href={doc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 rounded-lg border border-neutral-700 p-3 text-sm text-neutral-300 hover:bg-neutral-800"
                    >
                      <FileText className="h-4 w-4" />
                      {doc.name}
                    </a>
                  ))}
                </div>
              ) : (
                <p className="text-center text-sm text-neutral-400">
                  Nenhum documento ainda. Envie fotos ou documentos relacionados a este pedido.
                </p>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
