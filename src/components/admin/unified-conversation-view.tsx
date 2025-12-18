'use client'

/**
 * OMNICHANNEL Sprint 1 - Task 3: Unified Conversation Timeline
 *
 * Componente que exibe timeline unificada de conversas web + WhatsApp
 * - Mensagens mescladas em ordem cronológica
 * - Badges visuais por canal (🌐 Web | 📱 WhatsApp)
 * - Contexto consolidado na sidebar
 * - Ações para responder em qualquer canal
 */

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { MessageSquare, Send, Phone, Mail, Package, Calendar } from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { toast } from 'sonner'

interface UnifiedMessage {
  id: string
  channel: 'WEB' | 'WHATSAPP'
  role: 'USER' | 'ASSISTANT' | 'SYSTEM'
  content: string
  timestamp: Date
  status?: 'SENT' | 'DELIVERED' | 'READ'
  imageUrl?: string | null
}

interface UnifiedContext {
  customerName?: string
  phone?: string
  email?: string
  totalInteractions: number
  lastChannel: 'WEB' | 'WHATSAPP'
  items?: Array<{
    category?: string
    width?: number
    height?: number
    quantity?: number
  }>
  quotes?: Array<{
    id: string
    number: string
    total: number
    status: string
  }>
}

interface UnifiedConversationViewProps {
  customerId?: string
  phoneNumber?: string
  onRefresh?: () => void
}

export function UnifiedConversationView({
  customerId,
  phoneNumber,
  onRefresh
}: UnifiedConversationViewProps) {
  const [messages, setMessages] = useState<UnifiedMessage[]>([])
  const [context, setContext] = useState<UnifiedContext | null>(null)
  const [loading, setLoading] = useState(true)
  const [replyText, setReplyText] = useState('')
  const [replyChannel, setReplyChannel] = useState<'WEB' | 'WHATSAPP'>('WHATSAPP')
  const [sending, setSending] = useState(false)

  useEffect(() => {
    loadConversationData()
  }, [customerId, phoneNumber])

  async function loadConversationData() {
    try {
      setLoading(true)

      // Buscar timeline unificada
      const params = new URLSearchParams()
      if (customerId) params.append('userId', customerId)
      if (phoneNumber) params.append('phoneNumber', phoneNumber)

      const response = await fetch(`/api/admin/conversations/unified?${params}`)

      if (!response.ok) throw new Error('Failed to load conversation')

      const data = await response.json()

      setMessages(data.messages.map((msg: any) => ({
        ...msg,
        timestamp: new Date(msg.timestamp)
      })))

      setContext(data.context)
    } catch (error) {
      console.error('Error loading conversation:', error)
      toast.error('Erro ao carregar conversa')
    } finally {
      setLoading(false)
    }
  }

  async function handleSendReply() {
    if (!replyText.trim() || !phoneNumber) return

    try {
      setSending(true)

      const endpoint = replyChannel === 'WHATSAPP'
        ? '/api/whatsapp/send'
        : '/api/admin/conversations/reply'

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: phoneNumber,
          message: replyText,
          channel: replyChannel
        })
      })

      if (!response.ok) throw new Error('Failed to send reply')

      toast.success('Mensagem enviada com sucesso!')
      setReplyText('')
      loadConversationData()
      onRefresh?.()
    } catch (error) {
      console.error('Error sending reply:', error)
      toast.error('Erro ao enviar mensagem')
    } finally {
      setSending(false)
    }
  }

  function getChannelBadge(channel: 'WEB' | 'WHATSAPP') {
    return channel === 'WEB' ? (
      <Badge variant="secondary" className="gap-1">
        🌐 Web Chat
      </Badge>
    ) : (
      <Badge variant="default" className="gap-1 bg-green-600">
        📱 WhatsApp
      </Badge>
    )
  }

  function getRoleBadge(role: 'USER' | 'ASSISTANT' | 'SYSTEM') {
    if (role === 'USER') return <Badge variant="outline">Cliente</Badge>
    if (role === 'ASSISTANT') return <Badge variant="secondary">IA</Badge>
    return <Badge>Sistema</Badge>
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-sm text-muted-foreground">Carregando conversa...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Timeline de Mensagens */}
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Timeline Unificada
              </span>
              <Button variant="outline" size="sm" onClick={loadConversationData}>
                Atualizar
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[500px] pr-4">
              {messages.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Nenhuma mensagem encontrada</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div key={message.id} className="flex gap-3">
                      <Avatar className="h-8 w-8 mt-1">
                        <AvatarFallback>
                          {message.role === 'USER' ? '👤' : '🤖'}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          {getRoleBadge(message.role)}
                          {getChannelBadge(message.channel)}
                          <span className="text-xs text-muted-foreground">
                            {format(message.timestamp, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                          </span>
                          {message.status && (
                            <Badge variant="outline" className="text-xs">
                              {message.status}
                            </Badge>
                          )}
                        </div>

                        <div className="bg-muted/50 rounded-lg p-3">
                          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                          {message.imageUrl && (
                            <img
                              src={message.imageUrl}
                              alt="Anexo"
                              className="mt-2 rounded max-w-xs"
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>

            <Separator className="my-4" />

            {/* Área de Resposta */}
            <div className="space-y-3">
              <div className="flex gap-2">
                <Button
                  variant={replyChannel === 'WHATSAPP' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setReplyChannel('WHATSAPP')}
                >
                  📱 WhatsApp
                </Button>
                <Button
                  variant={replyChannel === 'WEB' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setReplyChannel('WEB')}
                >
                  🌐 Web Chat
                </Button>
              </div>

              <div className="flex gap-2">
                <Textarea
                  placeholder={`Responder via ${replyChannel === 'WHATSAPP' ? 'WhatsApp' : 'Web Chat'}...`}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className="min-h-[80px]"
                  disabled={sending}
                />
                <Button
                  onClick={handleSendReply}
                  disabled={!replyText.trim() || sending}
                  size="icon"
                  className="shrink-0"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Contexto Consolidado */}
      <div>
        <Card>
          <CardHeader>
            <CardTitle>Contexto do Cliente</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {context ? (
              <>
                {/* Informações Básicas */}
                <div>
                  <h4 className="text-sm font-semibold mb-2">Informações</h4>
                  <div className="space-y-2 text-sm">
                    {context.customerName && (
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">Nome:</span>
                        <span className="font-medium">{context.customerName}</span>
                      </div>
                    )}
                    {context.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span>{context.phone}</span>
                      </div>
                    )}
                    {context.email && (
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span>{context.email}</span>
                      </div>
                    )}
                  </div>
                </div>

                <Separator />

                {/* Estatísticas */}
                <div>
                  <h4 className="text-sm font-semibold mb-2">Atividade</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total de interações:</span>
                      <span className="font-medium">{context.totalInteractions}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Último canal:</span>
                      {getChannelBadge(context.lastChannel)}
                    </div>
                  </div>
                </div>

                {/* Items (Produtos) */}
                {context.items && context.items.length > 0 && (
                  <>
                    <Separator />
                    <div>
                      <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                        <Package className="h-4 w-4" />
                        Produtos Mencionados
                      </h4>
                      <div className="space-y-2">
                        {context.items.map((item, index) => (
                          <div key={index} className="bg-muted/50 rounded p-2 text-sm">
                            <p className="font-medium">{item.category || 'Sem categoria'}</p>
                            {(item.width || item.height) && (
                              <p className="text-xs text-muted-foreground">
                                Dimensões: {item.width}m x {item.height}m
                                {item.quantity && ` (${item.quantity}x)`}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {/* Orçamentos */}
                {context.quotes && context.quotes.length > 0 && (
                  <>
                    <Separator />
                    <div>
                      <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Orçamentos
                      </h4>
                      <div className="space-y-2">
                        {context.quotes.map((quote) => (
                          <div key={quote.id} className="bg-muted/50 rounded p-2 text-sm">
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="font-medium">#{quote.number}</p>
                                <p className="text-xs text-muted-foreground">
                                  {new Intl.NumberFormat('pt-BR', {
                                    style: 'currency',
                                    currency: 'BRL'
                                  }).format(quote.total)}
                                </p>
                              </div>
                              <Badge variant="outline" className="text-xs">
                                {quote.status}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p className="text-sm">Nenhum contexto disponível</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
