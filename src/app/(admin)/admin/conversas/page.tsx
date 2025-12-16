import { prisma } from '@/lib/prisma'
import { AdminHeader } from '@/components/admin/admin-header'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  MessageSquare,
  User,
  Clock,
  AlertCircle,
  CheckCircle,
  Bot,
} from 'lucide-react'
import Link from 'next/link'

const statusLabels: Record<string, { label: string; color: string; icon: typeof Clock }> = {
  ACTIVE: { label: 'Ativa (IA)', color: 'bg-green-500/20 text-green-400', icon: Bot },
  WAITING_HUMAN: { label: 'Aguardando Humano', color: 'bg-yellow-500/20 text-yellow-400', icon: AlertCircle },
  CLOSED: { label: 'Fechada', color: 'bg-neutral-500/20 text-neutral-400', icon: CheckCircle },
}

export default async function AdminConversasPage() {
  const conversations = await prisma.conversation.findMany({
    orderBy: { lastMessageAt: 'desc' },
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
      assignedTo: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  })

  const [activeCount, waitingCount, closedCount] = await Promise.all([
    prisma.conversation.count({ where: { status: 'ACTIVE' } }),
    prisma.conversation.count({ where: { status: 'WAITING_HUMAN' } }),
    prisma.conversation.count({ where: { status: 'CLOSED' } }),
  ])

  return (
    <div>
      <AdminHeader
        title="Conversas WhatsApp"
        subtitle={`${conversations.length} conversa(s)`}
        actions={
          <div className="flex gap-2">
            {waitingCount > 0 && (
              <span className="flex items-center gap-2 rounded-lg bg-yellow-500/10 px-3 py-1.5 text-sm font-medium text-yellow-400">
                <AlertCircle className="h-4 w-4" />
                {waitingCount} aguardando
              </span>
            )}
          </div>
        }
      />

      <div className="p-6">
        {/* Status tabs */}
        <div className="mb-6 flex flex-wrap gap-2">
          <Link
            href="/admin/conversas"
            className="rounded-lg bg-gold-500/10 px-3 py-1.5 text-sm font-medium text-gold-500"
          >
            Todas ({conversations.length})
          </Link>
          <Link
            href="/admin/conversas?status=waiting"
            className={`rounded-lg px-3 py-1.5 text-sm font-medium ${
              waitingCount > 0
                ? 'bg-yellow-500/10 text-yellow-400'
                : 'bg-neutral-200 text-neutral-400'
            }`}
          >
            Aguardando ({waitingCount})
          </Link>
          <Link
            href="/admin/conversas?status=active"
            className="rounded-lg bg-neutral-200 px-3 py-1.5 text-sm text-neutral-400 hover:bg-neutral-250"
          >
            Ativas ({activeCount})
          </Link>
          <Link
            href="/admin/conversas?status=closed"
            className="rounded-lg bg-neutral-200 px-3 py-1.5 text-sm text-neutral-400 hover:bg-neutral-250"
          >
            Fechadas ({closedCount})
          </Link>
        </div>

        {conversations.length === 0 ? (
          <Card className="flex flex-col items-center justify-center p-12 text-center">
            <MessageSquare className="mb-4 h-16 w-16 text-neutral-500" />
            <h3 className="mb-2 font-display text-xl font-semibold text-white">
              Nenhuma conversa
            </h3>
            <p className="text-neutral-400">
              As conversas do WhatsApp aparecerao aqui
            </p>
          </Card>
        ) : (
          <div className="space-y-3">
            {conversations.map((conversation) => {
              const statusInfo = statusLabels[conversation.status] || statusLabels.ACTIVE
              const StatusIcon = statusInfo.icon
              const lastMessage = conversation.messages[0]

              return (
                <Link
                  key={conversation.id}
                  href={`/admin/conversas/${conversation.id}`}
                  className="block"
                >
                  <Card className="p-4 transition-colors hover:bg-neutral-200/50">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-neutral-250">
                          <User className="h-6 w-6 text-neutral-400" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-white">
                              {conversation.customerName ||
                                conversation.user?.name ||
                                'Cliente'}
                            </p>
                            <span
                              className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${statusInfo.color}`}
                            >
                              <StatusIcon className="h-3 w-3" />
                              {statusInfo.label}
                            </span>
                          </div>
                          <p className="text-sm text-neutral-400">
                            +{conversation.phoneNumber}
                          </p>
                          {lastMessage && (
                            <p className="mt-1 line-clamp-1 text-sm text-neutral-500">
                              {lastMessage.direction === 'OUTBOUND' && (
                                <span className="text-neutral-400">Voce: </span>
                              )}
                              {lastMessage.content}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="flex items-center gap-1 text-xs text-neutral-500">
                          <Clock className="h-3 w-3" />
                          {new Date(conversation.lastMessageAt).toLocaleTimeString('pt-BR', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </div>
                        <p className="mt-1 text-xs text-neutral-500">
                          {new Date(conversation.lastMessageAt).toLocaleDateString('pt-BR')}
                        </p>
                        {conversation.assignedTo && (
                          <p className="mt-2 text-xs text-neutral-400">
                            Atribuido: {conversation.assignedTo.name}
                          </p>
                        )}
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
