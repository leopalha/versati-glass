'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { MessageSquare, Search, User, Phone } from 'lucide-react'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { useToast } from '@/components/ui/toast/use-toast'
import { logger } from '@/lib/logger'

interface Message {
  id: string
  messageId: string
  from: string
  to: string
  body: string
  direction: 'INBOUND' | 'OUTBOUND'
  status: string
  createdAt: Date
  user: {
    id: string
    name: string | null
    email: string | null
    phone: string | null
  } | null
  quote: {
    id: string
    number: string
  } | null
  order: {
    id: string
    number: string
  } | null
}

interface Conversation {
  phone: string
  customerName: string | null
  userId: string | null
  messages: Message[]
  lastMessageAt: Date
  unreadCount: number
}

interface WhatsAppConversationListProps {
  conversations: Conversation[]
}

export function WhatsAppConversationList({
  conversations: initialConversations,
}: WhatsAppConversationListProps) {
  const [conversations, setConversations] = useState(initialConversations)
  const [searchQuery, setSearchQuery] = useState('')
  const [isConnected, setIsConnected] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState<
    'connecting' | 'connected' | 'disconnected'
  >('disconnected')
  const { toast } = useToast()

  // Server-Sent Events (SSE) para atualizações em tempo real
  useEffect(() => {
    let eventSource: EventSource | null = null

    const connect = () => {
      try {
        setConnectionStatus('connecting')
        eventSource = new EventSource('/api/whatsapp/stream')

        eventSource.onopen = () => {
          logger.debug('[SSE] Conectado ao stream de WhatsApp')
          setIsConnected(true)
          setConnectionStatus('connected')
        }

        eventSource.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data)

            if (data.type === 'connected') {
              logger.debug('[SSE] Conexão confirmada', { timestamp: data.timestamp })
            } else if (data.type === 'new_message') {
              logger.debug('[SSE] Nova mensagem recebida')

              // Mostrar notificação toast para mensagens INBOUND
              if (data.data.direction === 'INBOUND') {
                const customerName = data.data.user?.name || data.data.from
                const messagePreview =
                  data.data.body.length > 50
                    ? data.data.body.substring(0, 50) + '...'
                    : data.data.body

                toast({
                  title: `Nova mensagem de ${customerName}`,
                  description: messagePreview,
                })
              }

              // Atualizar lista de conversas
              setConversations((prev) => {
                const phone = data.data.direction === 'INBOUND' ? data.data.from : data.data.to
                const existingConvIndex = prev.findIndex((c) => c.phone === phone)

                if (existingConvIndex >= 0) {
                  // Atualizar conversa existente
                  const updated = [...prev]
                  const conv = updated[existingConvIndex]

                  // Adicionar mensagem se não existe
                  const messageExists = conv.messages.some((m) => m.id === data.data.id)
                  if (!messageExists) {
                    conv.messages = [...conv.messages, data.data]
                    conv.lastMessageAt = new Date(data.data.createdAt)

                    // Incrementar unread se INBOUND
                    if (data.data.direction === 'INBOUND') {
                      conv.unreadCount += 1
                    }
                  }

                  // Mover conversa para o topo
                  updated.splice(existingConvIndex, 1)
                  updated.unshift(conv)

                  return updated
                } else {
                  // Nova conversa
                  const newConv: Conversation = {
                    phone,
                    customerName: data.data.user?.name || null,
                    userId: data.data.user?.id || null,
                    messages: [data.data],
                    lastMessageAt: new Date(data.data.createdAt),
                    unreadCount: data.data.direction === 'INBOUND' ? 1 : 0,
                  }
                  return [newConv, ...prev]
                }
              })
            }
          } catch (error) {
            logger.error('[SSE] Erro ao processar mensagem', { error })
          }
        }

        eventSource.onerror = (error) => {
          logger.error('[SSE] Erro de conexão', { error })
          setIsConnected(false)
          setConnectionStatus('disconnected')
          eventSource?.close()

          // Reconectar após 5 segundos
          setTimeout(() => {
            if (connectionStatus !== 'connected') {
              logger.debug('[SSE] Tentando reconectar...')
              connect()
            }
          }, 5000)
        }
      } catch (error) {
        logger.error('[SSE] Erro ao criar conexão', { error })
        setConnectionStatus('disconnected')
      }
    }

    connect()

    // Cleanup ao desmontar
    return () => {
      if (eventSource) {
        logger.debug('[SSE] Fechando conexão')
        eventSource.close()
      }
    }
  }, [])

  // Filtrar conversas
  const filteredConversations = conversations.filter((conv) => {
    const query = searchQuery.toLowerCase()
    return conv.phone.includes(query) || conv.customerName?.toLowerCase().includes(query) || false
  })

  // Total de mensagens não lidas
  const totalUnread = conversations.reduce((sum, conv) => sum + conv.unreadCount, 0)

  return (
    <div className="space-y-6">
      {/* Header com busca */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar por telefone ou nome..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex items-center gap-2">
          <Badge variant={totalUnread > 0 ? 'error' : 'secondary'}>
            {totalUnread} não lida{totalUnread !== 1 ? 's' : ''}
          </Badge>

          <Badge
            variant={
              connectionStatus === 'connected'
                ? 'default'
                : connectionStatus === 'connecting'
                  ? 'secondary'
                  : 'error'
            }
          >
            {connectionStatus === 'connected'
              ? '🟢 Conectado'
              : connectionStatus === 'connecting'
                ? '🟡 Conectando...'
                : '🔴 Desconectado'}
          </Badge>
        </div>
      </div>

      {/* Lista de conversas */}
      {filteredConversations.length === 0 ? (
        <Card className="p-12 text-center">
          <MessageSquare className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
          <h3 className="mb-2 text-lg font-semibold">
            {searchQuery ? 'Nenhuma conversa encontrada' : 'Nenhuma conversa ainda'}
          </h3>
          <p className="text-muted-foreground">
            {searchQuery
              ? 'Tente buscar com outros termos'
              : 'As conversas WhatsApp com clientes aparecerão aqui'}
          </p>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredConversations.map((conversation) => {
            const lastMessage = conversation.messages[conversation.messages.length - 1]
            const lastMessagePreview =
              lastMessage.body.length > 80
                ? lastMessage.body.substring(0, 80) + '...'
                : lastMessage.body

            return (
              <Link
                key={conversation.phone}
                href={`/admin/whatsapp/${encodeURIComponent(conversation.phone)}`}
              >
                <Card className="cursor-pointer p-4 transition-colors hover:bg-accent">
                  <div className="flex items-start justify-between gap-4">
                    {/* Info do cliente */}
                    <div className="min-w-0 flex-1">
                      <div className="mb-1 flex items-center gap-2">
                        <User className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                        <h3 className="truncate font-semibold">
                          {conversation.customerName || 'Cliente sem cadastro'}
                        </h3>
                        {conversation.unreadCount > 0 && (
                          <Badge variant="error" className="ml-auto">
                            {conversation.unreadCount}
                          </Badge>
                        )}
                      </div>

                      <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
                        <Phone className="h-3 w-3" />
                        <span>{conversation.phone}</span>
                      </div>

                      <p className="truncate text-sm text-muted-foreground">
                        {lastMessage.direction === 'INBOUND' ? '← ' : '→ '}
                        {lastMessagePreview}
                      </p>
                    </div>

                    {/* Timestamp */}
                    <div className="whitespace-nowrap text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(conversation.lastMessageAt), {
                        addSuffix: true,
                        locale: ptBR,
                      })}
                    </div>
                  </div>

                  {/* Tags de contexto */}
                  <div className="mt-3 flex gap-2">
                    {lastMessage.quote && (
                      <Badge variant="outline" className="text-xs">
                        Orçamento: {lastMessage.quote.number}
                      </Badge>
                    )}
                    {lastMessage.order && (
                      <Badge variant="outline" className="text-xs">
                        Pedido: {lastMessage.order.number}
                      </Badge>
                    )}
                    <Badge
                      variant={
                        lastMessage.status === 'DELIVERED'
                          ? 'default'
                          : lastMessage.status === 'FAILED'
                            ? 'error'
                            : 'secondary'
                      }
                      className="text-xs"
                    >
                      {conversation.messages.length} mensagens
                    </Badge>
                  </div>
                </Card>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
