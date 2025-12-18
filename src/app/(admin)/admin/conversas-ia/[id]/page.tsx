import { prisma } from '@/lib/prisma'
import { AdminHeader } from '@/components/admin/admin-header'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ManualQuoteButton } from '@/components/admin/manual-quote-button'
import {
  Bot,
  User,
  Clock,
  ArrowLeft,
  Image as ImageIcon,
  FileText,
  CheckCircle,
  AlertCircle,
  XCircle,
} from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'

const statusLabels: Record<string, { label: string; color: string; icon: typeof Clock }> = {
  ACTIVE: { label: 'Ativa', color: 'bg-green-500/20 text-green-400', icon: Bot },
  QUOTE_GENERATED: {
    label: 'Orcamento Gerado',
    color: 'bg-blue-500/20 text-blue-400',
    icon: CheckCircle,
  },
  ABANDONED: { label: 'Abandonada', color: 'bg-yellow-500/20 text-yellow-400', icon: AlertCircle },
  CLOSED: { label: 'Fechada', color: 'bg-neutral-500/20 text-neutral-700', icon: XCircle },
}

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function ConversaIADetailPage({ params }: PageProps) {
  const { id } = await params

  const conversation = await prisma.aiConversation.findUnique({
    where: { id },
    include: {
      messages: {
        orderBy: { createdAt: 'asc' },
      },
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
        },
      },
    },
  })

  if (!conversation) {
    notFound()
  }

  const statusInfo = statusLabels[conversation.status] || statusLabels.ACTIVE
  const StatusIcon = statusInfo.icon

  // Calcular estatisticas
  const userMessages = conversation.messages.filter((m) => m.role === 'USER')
  const aiMessages = conversation.messages.filter((m) => m.role === 'ASSISTANT')
  const imagesCount = conversation.messages.filter((m) => m.imageUrl).length

  // Extrair metadata dos tokens
  const totalTokens = conversation.messages.reduce((acc, msg) => {
    const metadata = msg.metadata as { tokensUsed?: number } | null
    return acc + (metadata?.tokensUsed || 0)
  }, 0)

  return (
    <div>
      <AdminHeader
        title="Detalhes da Conversa IA"
        subtitle={`Conversa iniciada em ${new Date(conversation.createdAt).toLocaleString('pt-BR')}`}
        actions={
          <div className="flex gap-2">
            <ManualQuoteButton
              conversationId={conversation.id}
              hasQuote={!!conversation.quoteId}
              quoteContext={conversation.quoteContext}
            />
            <Link href="/admin/conversas-ia">
              <Button variant="outline" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar
              </Button>
            </Link>
          </div>
        }
      />

      <div className="p-6">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Info Card */}
          <Card className="p-6">
            <h3 className="mb-4 font-display text-lg font-semibold text-white">Informacoes</h3>

            <div className="space-y-4">
              <div>
                <p className="text-sm text-neutral-700">Status</p>
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-sm font-medium ${statusInfo.color}`}
                >
                  <StatusIcon className="h-4 w-4" />
                  {statusInfo.label}
                </span>
              </div>

              <div>
                <p className="text-sm text-neutral-700">Cliente</p>
                <p className="font-medium text-white">
                  {conversation.user?.name || 'Visitante Anonimo'}
                </p>
                {conversation.user?.email && (
                  <p className="text-sm text-neutral-600">{conversation.user.email}</p>
                )}
                {conversation.user?.phone && (
                  <p className="text-sm text-neutral-600">{conversation.user.phone}</p>
                )}
              </div>

              <div>
                <p className="text-sm text-neutral-700">Sessao ID</p>
                <p className="break-all font-mono text-xs text-neutral-600">
                  {conversation.sessionId}
                </p>
              </div>

              {conversation.quoteId && (
                <div>
                  <p className="text-sm text-neutral-700">Orçamento</p>
                  <Link
                    href={`/admin/orcamentos/${conversation.quoteId}`}
                    className="text-sm font-medium text-accent-500 hover:text-accent-600"
                  >
                    Ver Orçamento →
                  </Link>
                </div>
              )}

              {!conversation.quoteId && conversation.quoteContext && (
                <div>
                  <p className="text-sm text-neutral-700">Status da Coleta</p>
                  <div className="mt-1 space-y-1 text-xs">
                    {(() => {
                      const ctx = conversation.quoteContext as any
                      const hasItems = ctx?.items && ctx.items.length > 0
                      const hasCustomer = ctx?.customerData?.phone
                      const hasSchedule = ctx?.scheduleData

                      return (
                        <>
                          <p className={hasItems ? 'text-green-400' : 'text-neutral-600'}>
                            {hasItems ? '✓' : '○'} Produtos ({ctx?.items?.length || 0})
                          </p>
                          <p className={hasCustomer ? 'text-green-400' : 'text-neutral-600'}>
                            {hasCustomer ? '✓' : '○'} Dados do Cliente
                          </p>
                          <p className={hasSchedule ? 'text-green-400' : 'text-neutral-600'}>
                            {hasSchedule ? '✓' : '○'} Agendamento
                          </p>
                        </>
                      )
                    })()}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 border-t border-neutral-400 pt-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-white">{userMessages.length}</p>
                  <p className="text-xs text-neutral-700">Msgs Usuario</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-accent-500">{aiMessages.length}</p>
                  <p className="text-xs text-neutral-700">Msgs IA</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-400">{imagesCount}</p>
                  <p className="text-xs text-neutral-700">Imagens</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-purple-400">{totalTokens}</p>
                  <p className="text-xs text-neutral-700">Tokens</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Messages */}
          <div className="lg:col-span-2">
            <Card className="p-6">
              <h3 className="mb-4 font-display text-lg font-semibold text-white">
                Historico de Mensagens
              </h3>

              <div className="max-h-[600px] space-y-4 overflow-y-auto">
                {conversation.messages.map((message) => {
                  const metadata = message.metadata as {
                    model?: string
                    responseTimeMs?: number
                    hasImage?: boolean
                  } | null

                  return (
                    <div
                      key={message.id}
                      className={`flex gap-3 ${message.role === 'USER' ? 'flex-row-reverse' : ''}`}
                    >
                      <div
                        className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full ${
                          message.role === 'USER' ? 'bg-neutral-600' : 'bg-accent-500/20'
                        }`}
                      >
                        {message.role === 'USER' ? (
                          <User className="h-4 w-4 text-neutral-300" />
                        ) : (
                          <Bot className="h-4 w-4 text-accent-500" />
                        )}
                      </div>

                      <div
                        className={`max-w-[80%] rounded-lg px-4 py-2 ${
                          message.role === 'USER'
                            ? 'bg-accent-500 text-neutral-900'
                            : 'bg-neutral-200 text-white'
                        }`}
                      >
                        {message.imageUrl && (
                          <div className="mb-2">
                            <img
                              src={message.imageUrl}
                              alt="Imagem enviada"
                              className="h-auto max-h-48 max-w-full rounded-md"
                            />
                          </div>
                        )}

                        <p className="whitespace-pre-wrap text-sm">{message.content}</p>

                        <div className="mt-1 flex items-center gap-2 text-xs opacity-70">
                          <Clock className="h-3 w-3" />
                          {new Date(message.createdAt).toLocaleTimeString('pt-BR')}
                          {metadata?.model && (
                            <span className="rounded bg-black/20 px-1">{metadata.model}</span>
                          )}
                          {metadata?.responseTimeMs && <span>{metadata.responseTimeMs}ms</span>}
                          {metadata?.hasImage && <ImageIcon className="h-3 w-3 text-blue-300" />}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
