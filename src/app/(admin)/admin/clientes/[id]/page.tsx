import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { AdminHeader } from '@/components/admin/admin-header'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { formatCurrency } from '@/lib/utils'
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Package,
  FileText,
  MessageSquare,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  TrendingUp,
  Activity,
} from 'lucide-react'
import Link from 'next/link'

interface CustomerProfilePageProps {
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
  EM_PRODUCAO: { label: 'Em Produção', color: 'bg-purple-500/20 text-purple-400', icon: Activity },
  PRONTO_ENTREGA: {
    label: 'Pronto p/ Entrega',
    color: 'bg-cyan-500/20 text-cyan-400',
    icon: Package,
  },
  INSTALACAO_AGENDADA: {
    label: 'Instalação Agendada',
    color: 'bg-indigo-500/20 text-indigo-400',
    icon: Calendar,
  },
  INSTALANDO: { label: 'Instalando', color: 'bg-orange-500/20 text-orange-400', icon: Activity },
  CONCLUIDO: { label: 'Concluído', color: 'bg-green-500/20 text-green-400', icon: CheckCircle },
  CANCELADO: { label: 'Cancelado', color: 'bg-red-500/20 text-red-400', icon: XCircle },
}

const quoteStatusLabels: Record<string, { label: string; color: string }> = {
  DRAFT: { label: 'Rascunho', color: 'bg-neutral-500/20 text-neutral-700' },
  SENT: { label: 'Enviado', color: 'bg-blue-500/20 text-blue-400' },
  VIEWED: { label: 'Visualizado', color: 'bg-purple-500/20 text-purple-400' },
  ACCEPTED: { label: 'Aceito', color: 'bg-green-500/20 text-green-400' },
  REJECTED: { label: 'Recusado', color: 'bg-red-500/20 text-red-400' },
  EXPIRED: { label: 'Expirado', color: 'bg-neutral-500/20 text-neutral-700' },
  CONVERTED: { label: 'Convertido', color: 'bg-gold-500/20 text-gold-400' },
}

export default async function CustomerProfilePage({ params }: CustomerProfilePageProps) {
  const { id } = await params

  const customer = await prisma.user.findUnique({
    where: { id, role: 'CUSTOMER' },
    include: {
      orders: {
        orderBy: { createdAt: 'desc' },
        include: {
          items: {
            select: {
              id: true,
              description: true,
              totalPrice: true,
            },
          },
        },
      },
      quotes: {
        orderBy: { createdAt: 'desc' },
        include: {
          items: {
            select: {
              id: true,
              description: true,
            },
          },
        },
      },
      appointments: {
        orderBy: { scheduledDate: 'desc' },
        take: 10,
      },
      conversations: {
        orderBy: { lastMessageAt: 'desc' },
        take: 5,
        select: {
          id: true,
          lastMessageAt: true,
          status: true,
        },
      },
    },
  })

  if (!customer) {
    notFound()
  }

  // Calcular estatísticas
  const totalOrders = customer.orders.length
  const completedOrders = customer.orders.filter((o) => o.status === 'CONCLUIDO').length
  const totalSpent = customer.orders.reduce((sum, order) => sum + Number(order.total), 0)
  const averageOrderValue = totalOrders > 0 ? totalSpent / totalOrders : 0

  const totalQuotes = customer.quotes.length
  const acceptedQuotes = customer.quotes.filter(
    (q) => q.status === 'ACCEPTED' || q.status === 'CONVERTED'
  ).length
  const conversionRate = totalQuotes > 0 ? (acceptedQuotes / totalQuotes) * 100 : 0

  // Atividade recente (combinar orders, quotes, appointments)
  const recentActivity = [
    ...customer.orders.map((o) => ({
      type: 'order' as const,
      date: o.createdAt,
      data: o,
    })),
    ...customer.quotes.map((q) => ({
      type: 'quote' as const,
      date: q.createdAt,
      data: q,
    })),
    ...customer.appointments.map((a) => ({
      type: 'appointment' as const,
      date: a.createdAt,
      data: a,
    })),
  ]
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .slice(0, 20)

  return (
    <div>
      <AdminHeader
        title={customer.name}
        subtitle={`Cliente desde ${new Date(customer.createdAt).toLocaleDateString('pt-BR')}`}
      />

      <div className="space-y-6 p-6">
        {/* Informações do Cliente */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Card de Informações Pessoais */}
          <Card className="p-6">
            <div className="mb-4 flex items-center gap-2">
              <User className="h-5 w-5 text-gold-500" />
              <h3 className="font-display text-lg font-semibold text-white">
                Informações Pessoais
              </h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Mail className="mt-0.5 h-4 w-4 text-neutral-600" />
                <div>
                  <p className="text-xs text-neutral-700">Email</p>
                  <p className="text-sm text-white">{customer.email}</p>
                </div>
              </div>
              {customer.phone && (
                <div className="flex items-start gap-3">
                  <Phone className="mt-0.5 h-4 w-4 text-neutral-600" />
                  <div>
                    <p className="text-xs text-neutral-700">Telefone</p>
                    <p className="text-sm text-white">{customer.phone}</p>
                  </div>
                </div>
              )}
              <div className="flex items-start gap-3">
                <Calendar className="mt-0.5 h-4 w-4 text-neutral-600" />
                <div>
                  <p className="text-xs text-neutral-700">Cadastrado em</p>
                  <p className="text-sm text-white">
                    {new Date(customer.createdAt).toLocaleDateString('pt-BR', {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Card de Estatísticas */}
          <Card className="p-6">
            <div className="mb-4 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-gold-500" />
              <h3 className="font-display text-lg font-semibold text-white">Estatísticas</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-neutral-700">Total de Pedidos</p>
                <p className="text-2xl font-bold text-white">{totalOrders}</p>
              </div>
              <div>
                <p className="text-xs text-neutral-700">Concluídos</p>
                <p className="text-2xl font-bold text-green-400">{completedOrders}</p>
              </div>
              <div>
                <p className="text-xs text-neutral-700">Total Gasto</p>
                <p className="text-2xl font-bold text-gold-500">{formatCurrency(totalSpent)}</p>
              </div>
              <div>
                <p className="text-xs text-neutral-700">Ticket Médio</p>
                <p className="text-2xl font-bold text-white">{formatCurrency(averageOrderValue)}</p>
              </div>
              <div>
                <p className="text-xs text-neutral-700">Orçamentos</p>
                <p className="text-2xl font-bold text-white">{totalQuotes}</p>
              </div>
              <div>
                <p className="text-xs text-neutral-700">Taxa de Conversão</p>
                <p className="text-2xl font-bold text-purple-400">{conversionRate.toFixed(0)}%</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Tabs de Histórico */}
        <Tabs defaultValue="activity" className="w-full">
          <TabsList>
            <TabsTrigger value="activity">
              <Activity className="mr-2 h-4 w-4" />
              Atividade Recente
            </TabsTrigger>
            <TabsTrigger value="orders">
              <Package className="mr-2 h-4 w-4" />
              Pedidos ({totalOrders})
            </TabsTrigger>
            <TabsTrigger value="quotes">
              <FileText className="mr-2 h-4 w-4" />
              Orçamentos ({totalQuotes})
            </TabsTrigger>
            <TabsTrigger value="appointments">
              <Calendar className="mr-2 h-4 w-4" />
              Agendamentos ({customer.appointments.length})
            </TabsTrigger>
            <TabsTrigger value="conversations">
              <MessageSquare className="mr-2 h-4 w-4" />
              Conversas ({customer.conversations.length})
            </TabsTrigger>
          </TabsList>

          {/* Tab: Atividade Recente */}
          <TabsContent value="activity" className="mt-6">
            <Card className="p-6">
              <div className="space-y-4">
                {recentActivity.length === 0 ? (
                  <p className="py-8 text-center text-neutral-700">Nenhuma atividade recente</p>
                ) : (
                  recentActivity.map((activity, index) => (
                    <div
                      key={`${activity.type}-${activity.data.id}-${index}`}
                      className="flex items-start gap-4 border-b border-neutral-300 pb-4 last:border-0 last:pb-0"
                    >
                      <div className="mt-1">
                        {activity.type === 'order' && (
                          <div className="rounded-full bg-gold-500/20 p-2">
                            <Package className="h-4 w-4 text-gold-500" />
                          </div>
                        )}
                        {activity.type === 'quote' && (
                          <div className="rounded-full bg-blue-500/20 p-2">
                            <FileText className="h-4 w-4 text-blue-400" />
                          </div>
                        )}
                        {activity.type === 'appointment' && (
                          <div className="rounded-full bg-purple-500/20 p-2">
                            <Calendar className="h-4 w-4 text-purple-400" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        {activity.type === 'order' && (
                          <>
                            <div className="flex items-center justify-between">
                              <Link
                                href={`/admin/pedidos/${activity.data.id}`}
                                className="font-medium text-white hover:text-gold-500"
                              >
                                Pedido #{activity.data.number}
                              </Link>
                              <Badge
                                className={
                                  orderStatusLabels[activity.data.status]?.color ||
                                  'bg-neutral-500/20 text-neutral-700'
                                }
                              >
                                {orderStatusLabels[activity.data.status]?.label ||
                                  activity.data.status}
                              </Badge>
                            </div>
                            <p className="mt-1 text-sm text-neutral-700">
                              {formatCurrency(Number(activity.data.total))} •{' '}
                              {activity.data.items.length} item(s)
                            </p>
                          </>
                        )}
                        {activity.type === 'quote' && (
                          <>
                            <div className="flex items-center justify-between">
                              <Link
                                href={`/admin/orcamentos/${activity.data.id}`}
                                className="font-medium text-white hover:text-gold-500"
                              >
                                Orçamento #{activity.data.number}
                              </Link>
                              <Badge
                                className={
                                  quoteStatusLabels[activity.data.status]?.color ||
                                  'bg-neutral-500/20 text-neutral-700'
                                }
                              >
                                {quoteStatusLabels[activity.data.status]?.label ||
                                  activity.data.status}
                              </Badge>
                            </div>
                            <p className="mt-1 text-sm text-neutral-700">
                              {formatCurrency(Number(activity.data.total))} •{' '}
                              {activity.data.items.length} item(s)
                            </p>
                          </>
                        )}
                        {activity.type === 'appointment' && (
                          <>
                            <p className="font-medium text-white">
                              {activity.data.type === 'INSTALACAO' && 'Instalação'}
                              {activity.data.type === 'VISITA_TECNICA' && 'Visita Técnica'}
                              {activity.data.type === 'MANUTENCAO' && 'Manutenção'}
                            </p>
                            <p className="mt-1 text-sm text-neutral-700">
                              {new Date(activity.data.scheduledDate).toLocaleDateString('pt-BR')} às{' '}
                              {activity.data.scheduledTime} • {activity.data.status}
                            </p>
                          </>
                        )}
                        <p className="mt-2 text-xs text-neutral-600">
                          {new Date(activity.date).toLocaleDateString('pt-BR', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </Card>
          </TabsContent>

          {/* Tab: Pedidos */}
          <TabsContent value="orders" className="mt-6">
            <Card className="p-6">
              {customer.orders.length === 0 ? (
                <p className="py-8 text-center text-neutral-700">Nenhum pedido encontrado</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b border-neutral-300">
                      <tr>
                        <th className="pb-3 text-left text-sm font-medium text-neutral-700">
                          Pedido
                        </th>
                        <th className="pb-3 text-left text-sm font-medium text-neutral-700">
                          Status
                        </th>
                        <th className="pb-3 text-right text-sm font-medium text-neutral-700">
                          Total
                        </th>
                        <th className="pb-3 text-right text-sm font-medium text-neutral-700">
                          Data
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-300">
                      {customer.orders.map((order) => {
                        const statusInfo =
                          orderStatusLabels[order.status] || orderStatusLabels.APROVADO
                        const StatusIcon = statusInfo.icon

                        return (
                          <tr key={order.id} className="hover:bg-neutral-200/50">
                            <td className="py-3">
                              <Link
                                href={`/admin/pedidos/${order.id}`}
                                className="font-medium text-gold-500 hover:underline"
                              >
                                #{order.number}
                              </Link>
                            </td>
                            <td className="py-3">
                              <Badge className={statusInfo.color}>
                                <StatusIcon className="mr-1 h-3 w-3" />
                                {statusInfo.label}
                              </Badge>
                            </td>
                            <td className="py-3 text-right font-medium text-white">
                              {formatCurrency(Number(order.total))}
                            </td>
                            <td className="py-3 text-right text-sm text-neutral-700">
                              {new Date(order.createdAt).toLocaleDateString('pt-BR')}
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </Card>
          </TabsContent>

          {/* Tab: Orçamentos */}
          <TabsContent value="quotes" className="mt-6">
            <Card className="p-6">
              {customer.quotes.length === 0 ? (
                <p className="py-8 text-center text-neutral-700">Nenhum orçamento encontrado</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b border-neutral-300">
                      <tr>
                        <th className="pb-3 text-left text-sm font-medium text-neutral-700">
                          Orçamento
                        </th>
                        <th className="pb-3 text-left text-sm font-medium text-neutral-700">
                          Status
                        </th>
                        <th className="pb-3 text-right text-sm font-medium text-neutral-700">
                          Total
                        </th>
                        <th className="pb-3 text-right text-sm font-medium text-neutral-700">
                          Validade
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-300">
                      {customer.quotes.map((quote) => {
                        const statusInfo =
                          quoteStatusLabels[quote.status] || quoteStatusLabels.DRAFT
                        const isExpired =
                          new Date(quote.validUntil) < new Date() &&
                          ['SENT', 'VIEWED'].includes(quote.status)

                        return (
                          <tr key={quote.id} className="hover:bg-neutral-200/50">
                            <td className="py-3">
                              <Link
                                href={`/admin/orcamentos/${quote.id}`}
                                className="font-medium text-gold-500 hover:underline"
                              >
                                #{quote.number}
                              </Link>
                            </td>
                            <td className="py-3">
                              <Badge
                                className={
                                  isExpired ? 'bg-red-500/20 text-red-400' : statusInfo.color
                                }
                              >
                                {isExpired ? 'Expirado' : statusInfo.label}
                              </Badge>
                            </td>
                            <td className="py-3 text-right font-medium text-white">
                              {formatCurrency(Number(quote.total))}
                            </td>
                            <td className="py-3 text-right text-sm text-neutral-700">
                              {new Date(quote.validUntil).toLocaleDateString('pt-BR')}
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </Card>
          </TabsContent>

          {/* Tab: Agendamentos */}
          <TabsContent value="appointments" className="mt-6">
            <Card className="p-6">
              {customer.appointments.length === 0 ? (
                <p className="py-8 text-center text-neutral-700">Nenhum agendamento encontrado</p>
              ) : (
                <div className="space-y-4">
                  {customer.appointments.map((appointment) => (
                    <div
                      key={appointment.id}
                      className="flex items-start justify-between border-b border-neutral-300 pb-4 last:border-0 last:pb-0"
                    >
                      <div>
                        <p className="font-medium text-white">
                          {appointment.type === 'INSTALACAO' && 'Instalação'}
                          {appointment.type === 'VISITA_TECNICA' && 'Visita Técnica'}
                          {appointment.type === 'MANUTENCAO' && 'Manutenção'}
                        </p>
                        <p className="mt-1 text-sm text-neutral-700">
                          {new Date(appointment.scheduledDate).toLocaleDateString('pt-BR')} às{' '}
                          {appointment.scheduledTime}
                        </p>
                        <p className="mt-1 text-xs text-neutral-600">
                          {appointment.addressStreet}, {appointment.addressNumber} -{' '}
                          {appointment.addressNeighborhood}
                        </p>
                      </div>
                      <Badge
                        className={
                          appointment.status === 'COMPLETED'
                            ? 'bg-green-500/20 text-green-400'
                            : appointment.status === 'CANCELLED'
                              ? 'bg-red-500/20 text-red-400'
                              : 'bg-blue-500/20 text-blue-400'
                        }
                      >
                        {appointment.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </TabsContent>

          {/* Tab: Conversas */}
          <TabsContent value="conversations" className="mt-6">
            <Card className="p-6">
              {customer.conversations.length === 0 ? (
                <p className="py-8 text-center text-neutral-700">Nenhuma conversa encontrada</p>
              ) : (
                <div className="space-y-4">
                  {customer.conversations.map((conversation) => (
                    <Link
                      key={conversation.id}
                      href={`/admin/conversas/${conversation.id}`}
                      className="-m-3 flex items-start justify-between rounded-lg border-b border-neutral-300 p-3 pb-4 last:border-0 last:pb-0 hover:bg-neutral-200/50"
                    >
                      <div>
                        <p className="font-medium text-white">Conversa WhatsApp</p>
                        <p className="mt-1 text-sm text-neutral-700">
                          Última mensagem:{' '}
                          {new Date(conversation.lastMessageAt).toLocaleDateString('pt-BR', {
                            day: '2-digit',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          className={
                            conversation.status === 'ACTIVE'
                              ? 'bg-green-500/20 text-green-400'
                              : conversation.status === 'WAITING_HUMAN'
                                ? 'bg-yellow-500/20 text-yellow-400'
                                : 'bg-neutral-500/20 text-neutral-700'
                          }
                        >
                          {conversation.status === 'WAITING_HUMAN'
                            ? 'Aguardando'
                            : conversation.status}
                        </Badge>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
