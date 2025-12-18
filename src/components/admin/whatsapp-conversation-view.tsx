'use client'

import { useState, useEffect, useRef } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import {
  ArrowLeft,
  Send,
  User,
  Phone,
  Mail,
  FileText,
  Package,
  CheckCheck,
  Clock,
  XCircle,
} from 'lucide-react'
import Link from 'next/link'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { useRouter } from 'next/navigation'

interface Message {
  id: string
  messageId: string
  from: string
  to: string
  body: string
  direction: 'INBOUND' | 'OUTBOUND'
  status: string
  createdAt: Date
  mediaUrl: string | null
  user: {
    id: string
    name: string | null
    email: string | null
    phone: string | null
  } | null
  quote: {
    id: string
    number: string
    status: string
  } | null
  order: {
    id: string
    number: string
    status: string
  } | null
}

interface Conversation {
  phone: string
  customerName: string | null
  userId: string | null
  userEmail: string | null
  messages: Message[]
}

interface WhatsAppConversationViewProps {
  conversation: Conversation
  adminName: string
}

export function WhatsAppConversationView({
  conversation: initialConversation,
  adminName,
}: WhatsAppConversationViewProps) {
  const [conversation, setConversation] = useState(initialConversation)
  const [replyText, setReplyText] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [isPolling, setIsPolling] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  // Auto-scroll para última mensagem
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [conversation.messages])

  // Polling para novas mensagens a cada 15 segundos
  useEffect(() => {
    if (!isPolling) return

    const interval = setInterval(async () => {
      try {
        const response = await fetch(
          `/api/whatsapp/messages/${encodeURIComponent(conversation.phone)}`
        )
        if (response.ok) {
          const data = await response.json()
          setConversation(data)
        }
      } catch (error) {
        console.error('[WhatsApp Polling] Error:', error)
      }
    }, 15000) // 15 segundos

    return () => clearInterval(interval)
  }, [isPolling, conversation.phone])

  // Enviar mensagem
  async function handleSendMessage(e: React.FormEvent) {
    e.preventDefault()

    if (!replyText.trim() || isSending) return

    setIsSending(true)

    try {
      const response = await fetch('/api/whatsapp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: conversation.phone,
          message: replyText.trim(),
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Erro ao enviar mensagem')
      }

      const data = await response.json()

      // Adicionar mensagem enviada à lista local
      setConversation((prev) => ({
        ...prev,
        messages: [
          ...prev.messages,
          {
            id: data.messageId,
            messageId: data.messageId,
            from: data.from,
            to: data.to,
            body: replyText.trim(),
            direction: 'OUTBOUND',
            status: 'SENT',
            createdAt: new Date(),
            mediaUrl: null,
            user: prev.messages[0]?.user || null,
            quote: null,
            order: null,
          },
        ],
      }))

      setReplyText('')
    } catch (error) {
      console.error('[Send Message] Error:', error)
      alert(error instanceof Error ? error.message : 'Erro ao enviar mensagem. Tente novamente.')
    } finally {
      setIsSending(false)
    }
  }

  // Status icon
  function getStatusIcon(status: string) {
    switch (status) {
      case 'DELIVERED':
      case 'READ':
        return <CheckCheck className="h-3 w-3 text-green-600" />
      case 'SENT':
        return <CheckCheck className="h-3 w-3 text-gray-400" />
      case 'QUEUED':
        return <Clock className="h-3 w-3 text-gray-400" />
      case 'FAILED':
      case 'UNDELIVERED':
        return <XCircle className="h-3 w-3 text-red-600" />
      default:
        return null
    }
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/whatsapp">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>

        <div className="flex-1">
          <h1 className="text-2xl font-bold">
            {conversation.customerName || 'Cliente sem cadastro'}
          </h1>
          <div className="mt-1 flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Phone className="h-3 w-3" />
              <span>{conversation.phone}</span>
            </div>
            {conversation.userEmail && (
              <div className="flex items-center gap-1">
                <Mail className="h-3 w-3" />
                <span>{conversation.userEmail}</span>
              </div>
            )}
          </div>
        </div>

        {conversation.userId && (
          <Button variant="outline" asChild>
            <Link href={`/admin/clientes/${conversation.userId}`}>
              <User className="mr-2 h-4 w-4" />
              Ver Cliente
            </Link>
          </Button>
        )}
      </div>

      {/* Thread de mensagens */}
      <Card className="max-h-[600px] min-h-[500px] overflow-y-auto p-6">
        <div className="space-y-4">
          {conversation.messages.map((message, index) => {
            const isInbound = message.direction === 'INBOUND'
            const showDateSeparator =
              index === 0 ||
              format(new Date(message.createdAt), 'yyyy-MM-dd') !==
                format(new Date(conversation.messages[index - 1].createdAt), 'yyyy-MM-dd')

            return (
              <div key={message.id}>
                {/* Separador de data */}
                {showDateSeparator && (
                  <div className="my-4 flex items-center justify-center">
                    <div className="rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground">
                      {format(new Date(message.createdAt), "EEEE, d 'de' MMMM", {
                        locale: ptBR,
                      })}
                    </div>
                  </div>
                )}

                {/* Mensagem */}
                <div className={`flex ${isInbound ? 'justify-start' : 'justify-end'}`}>
                  <div
                    className={`max-w-[70%] rounded-lg px-4 py-2 ${
                      isInbound ? 'bg-muted text-foreground' : 'bg-primary text-primary-foreground'
                    }`}
                  >
                    {/* Remetente */}
                    <div className="mb-1 text-xs font-semibold opacity-80">
                      {isInbound ? conversation.customerName || 'Cliente' : adminName}
                    </div>

                    {/* Corpo da mensagem */}
                    <div className="whitespace-pre-wrap break-words">{message.body}</div>

                    {/* Imagem (se houver) */}
                    {message.mediaUrl && (
                      <div className="mt-2">
                        <img src={message.mediaUrl} alt="Media" className="max-w-full rounded" />
                      </div>
                    )}

                    {/* Contexto (Orçamento/Pedido) */}
                    {(message.quote || message.order) && (
                      <div className="mt-2 flex gap-2">
                        {message.quote && (
                          <Link href={`/admin/orcamentos/${message.quote.id}`}>
                            <Badge variant="secondary" className="cursor-pointer text-xs">
                              <FileText className="mr-1 h-3 w-3" />
                              {message.quote.number}
                            </Badge>
                          </Link>
                        )}
                        {message.order && (
                          <Link href={`/admin/pedidos/${message.order.id}`}>
                            <Badge variant="secondary" className="cursor-pointer text-xs">
                              <Package className="mr-1 h-3 w-3" />
                              {message.order.number}
                            </Badge>
                          </Link>
                        )}
                      </div>
                    )}

                    {/* Timestamp + Status */}
                    <div
                      className={`mt-1 flex items-center gap-1 text-xs opacity-70 ${
                        isInbound ? 'justify-start' : 'justify-end'
                      }`}
                    >
                      <span>{format(new Date(message.createdAt), 'HH:mm', { locale: ptBR })}</span>
                      {!isInbound && getStatusIcon(message.status)}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}

          <div ref={messagesEndRef} />
        </div>
      </Card>

      {/* Formulário de resposta */}
      <Card className="p-4">
        <form onSubmit={handleSendMessage} className="space-y-3">
          <Textarea
            placeholder="Digite sua mensagem..."
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            rows={3}
            disabled={isSending}
            className="resize-none"
          />

          <div className="flex items-center justify-between">
            <div className="text-xs text-muted-foreground">
              {isPolling ? (
                <span className="flex items-center gap-1">
                  <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-green-500" />
                  Atualizando automaticamente
                </span>
              ) : (
                <span>Atualizações pausadas</span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsPolling(!isPolling)}
              >
                {isPolling ? 'Pausar' : 'Retomar'}
              </Button>

              <Button type="submit" disabled={!replyText.trim() || isSending}>
                {isSending ? (
                  'Enviando...'
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Enviar
                  </>
                )}
              </Button>
            </div>
          </div>
        </form>
      </Card>
    </div>
  )
}
