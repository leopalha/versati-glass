import { prisma } from '@/lib/prisma'
import { AdminHeader } from '@/components/admin/admin-header'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Bot,
  User,
  Clock,
  MessageSquare,
  Image as ImageIcon,
  CheckCircle,
  AlertCircle,
  XCircle,
} from 'lucide-react'
import Link from 'next/link'

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

export default async function AdminConversasIAPage() {
  const conversations = await prisma.aiConversation.findMany({
    orderBy: { updatedAt: 'desc' },
    take: 50,
    include: {
      messages: {
        orderBy: { createdAt: 'desc' },
        take: 1,
      },
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      _count: {
        select: { messages: true },
      },
    },
  })

  // Contar mensagens com imagens
  const conversationsWithImageCount = await Promise.all(
    conversations.map(async (conv) => {
      const imageCount = await prisma.aiMessage.count({
        where: {
          conversationId: conv.id,
          imageUrl: { not: null },
        },
      })
      return { ...conv, imageCount }
    })
  )

  const [activeCount, quoteGeneratedCount, abandonedCount, closedCount] = await Promise.all([
    prisma.aiConversation.count({ where: { status: 'ACTIVE' } }),
    prisma.aiConversation.count({ where: { status: 'QUOTE_GENERATED' } }),
    prisma.aiConversation.count({ where: { status: 'ABANDONED' } }),
    prisma.aiConversation.count({ where: { status: 'CLOSED' } }),
  ])

  return (
    <div>
      <AdminHeader
        title="Conversas IA (Chat do Site)"
        subtitle={`${conversations.length} conversa(s) do assistente virtual`}
        actions={
          <div className="flex gap-2">
            <Link href="/admin/conversas-ia/metrics">
              <Button variant="outline" size="sm">
                📊 Métricas
              </Button>
            </Link>
            {activeCount > 0 && (
              <span className="flex items-center gap-2 rounded-lg bg-green-500/10 px-3 py-1.5 text-sm font-medium text-green-400">
                <Bot className="h-4 w-4" />
                {activeCount} ativas
              </span>
            )}
          </div>
        }
      />

      <div className="p-6">
        {/* Status tabs */}
        <div className="mb-6 flex flex-wrap gap-2">
          <Link
            href="/admin/conversas-ia"
            className="rounded-lg bg-gold-500/10 px-3 py-1.5 text-sm font-medium text-gold-500"
          >
            Todas ({conversations.length})
          </Link>
          <Link
            href="/admin/conversas-ia?status=active"
            className={`rounded-lg px-3 py-1.5 text-sm font-medium ${
              activeCount > 0 ? 'bg-green-500/10 text-green-400' : 'bg-neutral-200 text-neutral-700'
            }`}
          >
            Ativas ({activeCount})
          </Link>
          <Link
            href="/admin/conversas-ia?status=quote"
            className={`rounded-lg px-3 py-1.5 text-sm font-medium ${
              quoteGeneratedCount > 0
                ? 'bg-blue-500/10 text-blue-400'
                : 'bg-neutral-200 text-neutral-700'
            }`}
          >
            Com Orcamento ({quoteGeneratedCount})
          </Link>
          <Link
            href="/admin/conversas-ia?status=abandoned"
            className="hover:bg-neutral-250 rounded-lg bg-neutral-200 px-3 py-1.5 text-sm text-neutral-700"
          >
            Abandonadas ({abandonedCount})
          </Link>
          <Link
            href="/admin/conversas-ia?status=closed"
            className="hover:bg-neutral-250 rounded-lg bg-neutral-200 px-3 py-1.5 text-sm text-neutral-700"
          >
            Fechadas ({closedCount})
          </Link>
        </div>

        {conversations.length === 0 ? (
          <Card className="flex flex-col items-center justify-center p-12 text-center">
            <Bot className="mb-4 h-16 w-16 text-neutral-600" />
            <h3 className="mb-2 font-display text-xl font-semibold text-white">
              Nenhuma conversa IA
            </h3>
            <p className="text-neutral-700">
              As conversas do chat assistido do site aparecerao aqui
            </p>
          </Card>
        ) : (
          <div className="space-y-3">
            {conversationsWithImageCount.map((conversation) => {
              const statusInfo = statusLabels[conversation.status] || statusLabels.ACTIVE
              const StatusIcon = statusInfo.icon
              const lastMessage = conversation.messages[0]

              return (
                <Link
                  key={conversation.id}
                  href={`/admin/conversas-ia/${conversation.id}`}
                  className="block"
                >
                  <Card className="p-4 transition-colors hover:bg-neutral-200/50">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <div className="bg-accent-500/20 flex h-12 w-12 items-center justify-center rounded-full">
                          {conversation.user ? (
                            <User className="h-6 w-6 text-accent-500" />
                          ) : (
                            <Bot className="h-6 w-6 text-accent-500" />
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-white">
                              {conversation.user?.name || 'Visitante Anonimo'}
                            </p>
                            <span
                              className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${statusInfo.color}`}
                            >
                              <StatusIcon className="h-3 w-3" />
                              {statusInfo.label}
                            </span>
                          </div>
                          <p className="text-sm text-neutral-700">
                            {conversation.user?.email ||
                              `Sessao: ${conversation.sessionId.slice(0, 20)}...`}
                          </p>
                          {lastMessage && (
                            <p className="mt-1 line-clamp-1 text-sm text-neutral-600">
                              {lastMessage.role === 'ASSISTANT' && (
                                <span className="text-accent-500">IA: </span>
                              )}
                              {lastMessage.content.slice(0, 100)}
                              {lastMessage.content.length > 100 && '...'}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="flex items-center justify-end gap-3">
                          <div className="flex items-center gap-1 text-xs text-neutral-600">
                            <MessageSquare className="h-3 w-3" />
                            {conversation._count.messages} msgs
                          </div>
                          {conversation.imageCount > 0 && (
                            <div className="flex items-center gap-1 text-xs text-blue-400">
                              <ImageIcon className="h-3 w-3" />
                              {conversation.imageCount} img
                            </div>
                          )}
                        </div>
                        <div className="mt-1 flex items-center gap-1 text-xs text-neutral-600">
                          <Clock className="h-3 w-3" />
                          {new Date(conversation.updatedAt).toLocaleTimeString('pt-BR', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </div>
                        <p className="mt-1 text-xs text-neutral-600">
                          {new Date(conversation.updatedAt).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                    </div>
                  </Card>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
