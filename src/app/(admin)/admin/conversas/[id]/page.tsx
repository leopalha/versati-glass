'use client'

import { useEffect, useState, useRef } from 'react'
import { useParams } from 'next/navigation'
import { AdminHeader } from '@/components/admin/admin-header'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useToast } from '@/components/ui/toast/use-toast'
import {
  ArrowLeft,
  Send,
  Loader2,
  User,
  Bot,
  Phone,
  Mail,
  Clock,
  XCircle,
  CheckCircle,
} from 'lucide-react'
import Link from 'next/link'

interface Message {
  id: string
  direction: 'INBOUND' | 'OUTBOUND'
  content: string
  senderType: 'CUSTOMER' | 'AI' | 'HUMAN'
  createdAt: string
  sender?: {
    id: string
    name: string
  }
}

interface Conversation {
  id: string
  phoneNumber: string
  customerName?: string
  status: string
  createdAt: string
  lastMessageAt: string
  messages: Message[]
  user?: {
    id: string
    name: string
    email: string
    phone?: string
  }
}

export default function AdminConversaDetalhePage() {
  const params = useParams()
  const { toast } = useToast()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [conversation, setConversation] = useState<Conversation | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSending, setIsSending] = useState(false)
  const [message, setMessage] = useState('')

  const fetchConversation = async () => {
    try {
      const res = await fetch(`/api/whatsapp/conversations/${params.id}`)
      if (!res.ok) throw new Error('Failed to fetch')
      const data = await res.json()
      setConversation(data)
    } catch {
      toast({
        variant: 'error',
        title: 'Erro',
        description: 'Nao foi possivel carregar a conversa',
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchConversation()

    // Poll for new messages every 5 seconds
    const interval = setInterval(fetchConversation, 5000)
    return () => clearInterval(interval)
  }, [params.id])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [conversation?.messages])

  const handleSend = async () => {
    if (!message.trim() || isSending) return

    setIsSending(true)
    try {
      const res = await fetch(`/api/whatsapp/conversations/${params.id}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: message.trim() }),
      })

      if (!res.ok) throw new Error('Failed to send')

      setMessage('')
      await fetchConversation()
    } catch {
      toast({
        variant: 'error',
        title: 'Erro',
        description: 'Nao foi possivel enviar a mensagem',
      })
    } finally {
      setIsSending(false)
    }
  }

  const handleCloseConversation = async () => {
    try {
      const res = await fetch(`/api/whatsapp/conversations/${params.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'close' }),
      })

      if (!res.ok) throw new Error('Failed to close')

      toast({
        variant: 'success',
        title: 'Conversa fechada',
      })

      await fetchConversation()
    } catch {
      toast({
        variant: 'error',
        title: 'Erro',
        description: 'Nao foi possivel fechar a conversa',
      })
    }
  }

  if (isLoading) {
    return (
      <div>
        <AdminHeader title="Carregando..." />
        <div className="flex items-center justify-center p-12">
          <Loader2 className="h-8 w-8 animate-spin text-gold-500" />
        </div>
      </div>
    )
  }

  if (!conversation) {
    return (
      <div>
        <AdminHeader title="Conversa nao encontrada" />
        <div className="p-6">
          <Link
            href="/admin/conversas"
            className="inline-flex items-center gap-2 text-neutral-700 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar para conversas
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen flex-col">
      <AdminHeader
        title={conversation.customerName || 'Cliente'}
        subtitle={`+${conversation.phoneNumber}`}
        actions={
          <div className="flex gap-2">
            {conversation.status !== 'CLOSED' && (
              <Button variant="outline" size="sm" onClick={handleCloseConversation}>
                <XCircle className="mr-2 h-4 w-4" />
                Fechar Conversa
              </Button>
            )}
          </div>
        }
      />

      <div className="flex flex-1 overflow-hidden p-6">
        {/* Messages */}
        <div className="flex flex-1 flex-col">
          <Link
            href="/admin/conversas"
            className="mb-4 inline-flex items-center gap-2 text-neutral-700 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Link>

          <Card className="flex flex-1 flex-col overflow-hidden">
            {/* Messages list */}
            <div className="flex-1 overflow-y-auto p-4">
              <div className="space-y-4">
                {conversation.messages.map((msg) => {
                  const isOutbound = msg.direction === 'OUTBOUND'

                  return (
                    <div
                      key={msg.id}
                      className={`flex ${isOutbound ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[70%] rounded-lg px-4 py-2 ${
                          isOutbound
                            ? msg.senderType === 'AI'
                              ? 'bg-purple-500/20 text-purple-100'
                              : 'bg-gold-500/20 text-gold-100'
                            : 'bg-neutral-250 text-white'
                        }`}
                      >
                        {/* Sender indicator */}
                        <div className="mb-1 flex items-center gap-1 text-xs opacity-70">
                          {msg.senderType === 'AI' ? (
                            <>
                              <Bot className="h-3 w-3" />
                              <span>Ana (IA)</span>
                            </>
                          ) : msg.senderType === 'HUMAN' ? (
                            <>
                              <User className="h-3 w-3" />
                              <span>{msg.sender?.name || 'Atendente'}</span>
                            </>
                          ) : (
                            <>
                              <User className="h-3 w-3" />
                              <span>Cliente</span>
                            </>
                          )}
                        </div>
                        <p className="whitespace-pre-wrap">{msg.content}</p>
                        <p className="mt-1 text-right text-xs opacity-50">
                          {new Date(msg.createdAt).toLocaleTimeString('pt-BR', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                    </div>
                  )
                })}
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Input */}
            {conversation.status !== 'CLOSED' && (
              <div className="border-t border-neutral-400 p-4">
                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    handleSend()
                  }}
                  className="flex gap-2"
                >
                  <Input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Digite sua mensagem..."
                    disabled={isSending}
                  />
                  <Button type="submit" disabled={isSending || !message.trim()}>
                    {isSending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                  </Button>
                </form>
              </div>
            )}
          </Card>
        </div>

        {/* Customer info sidebar */}
        <div className="ml-6 w-80 flex-shrink-0">
          <Card className="p-4">
            <h3 className="mb-4 font-display text-lg font-semibold text-white">
              Informacoes do Cliente
            </h3>

            <div className="space-y-3">
              <div className="flex items-center gap-3 text-neutral-800">
                <User className="h-5 w-5 text-neutral-600" />
                <span>
                  {conversation.customerName || conversation.user?.name || 'Nao identificado'}
                </span>
              </div>
              <div className="flex items-center gap-3 text-neutral-800">
                <Phone className="h-5 w-5 text-neutral-600" />
                <span>+{conversation.phoneNumber}</span>
              </div>
              {conversation.user?.email && (
                <div className="flex items-center gap-3 text-neutral-800">
                  <Mail className="h-5 w-5 text-neutral-600" />
                  <span>{conversation.user.email}</span>
                </div>
              )}
              <div className="flex items-center gap-3 text-neutral-800">
                <Clock className="h-5 w-5 text-neutral-600" />
                <span>
                  Iniciada em {new Date(conversation.createdAt).toLocaleDateString('pt-BR')}
                </span>
              </div>
            </div>

            {/* Status */}
            <div className="mt-4 border-t border-neutral-400 pt-4">
              <p className="text-sm text-neutral-700">Status</p>
              <div className="mt-1 flex items-center gap-2">
                {conversation.status === 'ACTIVE' ? (
                  <>
                    <Bot className="h-4 w-4 text-green-400" />
                    <span className="text-green-400">Ativa (IA)</span>
                  </>
                ) : conversation.status === 'WAITING_HUMAN' ? (
                  <>
                    <Clock className="h-4 w-4 text-yellow-400" />
                    <span className="text-yellow-400">Aguardando Humano</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4 text-neutral-700" />
                    <span className="text-neutral-700">Fechada</span>
                  </>
                )}
              </div>
            </div>

            {/* Quick actions */}
            {conversation.user && (
              <div className="mt-4 border-t border-neutral-400 pt-4">
                <p className="mb-2 text-sm text-neutral-700">Acoes Rapidas</p>
                <div className="space-y-2">
                  <Link
                    href={`/admin/clientes/${conversation.user.id}`}
                    className="hover:bg-neutral-250 block rounded-lg border border-neutral-400 p-2 text-center text-sm text-neutral-800"
                  >
                    Ver Perfil do Cliente
                  </Link>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}
