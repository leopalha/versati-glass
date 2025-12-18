'use client'

import { useEffect, useState } from 'react'
import { use } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  ArrowLeft,
  MessageSquare,
  Phone,
  FileText,
  ShoppingCart,
  Calendar,
  Link as LinkIcon,
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface TimelineEvent {
  id: string
  type: 'web_chat' | 'whatsapp' | 'quote' | 'order' | 'appointment'
  timestamp: string
  channel?: 'WEB' | 'WHATSAPP'
  title: string
  description: string
  metadata?: Record<string, any>
  linkedEntityId?: string
  status?: string
}

interface TimelineResponse {
  user: {
    id: string
    name: string | null
    email: string | null
    phone: string | null
  }
  timeline: TimelineEvent[]
  stats: {
    totalEvents: number
    webChats: number
    whatsappChats: number
    quotes: number
    orders: number
    appointments: number
  }
}

export default function CustomerTimelinePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const router = useRouter()
  const [data, setData] = useState<TimelineResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchTimeline() {
      try {
        const res = await fetch(`/api/admin/customers/${resolvedParams.id}/timeline`)
        if (!res.ok) throw new Error('Erro ao carregar timeline')
        const json = await res.json()
        setData(json)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro desconhecido')
      } finally {
        setLoading(false)
      }
    }

    fetchTimeline()
  }, [resolvedParams.id])

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-1/3 rounded bg-gray-200"></div>
          <div className="h-64 rounded bg-gray-200"></div>
        </div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="container mx-auto p-6">
        <Card className="p-6">
          <p className="text-red-600">Erro: {error || 'Dados não encontrados'}</p>
          <Button onClick={() => router.back()} className="mt-4">
            Voltar
          </Button>
        </Card>
      </div>
    )
  }

  const getEventIcon = (type: TimelineEvent['type']) => {
    switch (type) {
      case 'web_chat':
        return <MessageSquare className="h-5 w-5 text-blue-600" />
      case 'whatsapp':
        return <Phone className="h-5 w-5 text-green-600" />
      case 'quote':
        return <FileText className="h-5 w-5 text-purple-600" />
      case 'order':
        return <ShoppingCart className="h-5 w-5 text-orange-600" />
      case 'appointment':
        return <Calendar className="h-5 w-5 text-teal-600" />
    }
  }

  const getStatusBadge = (status?: string) => {
    if (!status) return null

    const variants: Record<
      string,
      'default' | 'secondary' | 'outline' | 'success' | 'warning' | 'error'
    > = {
      ACTIVE: 'success',
      COMPLETED: 'default',
      CLOSED: 'secondary',
      ABANDONED: 'outline',
      PENDING: 'warning',
      APPROVED: 'success',
      REJECTED: 'error',
      PAID: 'success',
      DELIVERED: 'success',
    }

    const variant = variants[status] || 'default'

    return (
      <Badge variant={variant} className="ml-2">
        {status}
      </Badge>
    )
  }

  return (
    <div className="container mx-auto max-w-4xl p-6">
      {/* Header */}
      <div className="mb-6">
        <Button variant="ghost" onClick={() => router.push('/admin/clientes')} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar para Clientes
        </Button>

        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold">Timeline do Cliente</h1>
            <p className="mt-1 text-gray-600">{data.user.name || 'Nome não disponível'}</p>
            <div className="mt-2 flex gap-4 text-sm text-gray-500">
              {data.user.email && <span>📧 {data.user.email}</span>}
              {data.user.phone && <span>📱 {data.user.phone}</span>}
            </div>
          </div>

          <Card className="p-4">
            <div className="space-y-1 text-sm">
              <div className="flex justify-between gap-4">
                <span className="text-gray-600">Total de Eventos:</span>
                <span className="font-bold">{data.stats.totalEvents}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-gray-600">💬 Chats Web:</span>
                <span className="font-bold">{data.stats.webChats}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-gray-600">📱 WhatsApp:</span>
                <span className="font-bold">{data.stats.whatsappChats}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-gray-600">📋 Orçamentos:</span>
                <span className="font-bold">{data.stats.quotes}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-gray-600">🛒 Pedidos:</span>
                <span className="font-bold">{data.stats.orders}</span>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute bottom-0 left-6 top-0 w-0.5 bg-gray-200"></div>

        <div className="space-y-6">
          {data.timeline.map((event, idx) => (
            <div key={event.id} className="relative flex gap-4">
              {/* Icon */}
              <div className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-gray-200 bg-white">
                {getEventIcon(event.type)}
              </div>

              {/* Content */}
              <Card className="flex-1 p-4 transition-shadow hover:shadow-md">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-semibold">{event.title}</h3>
                      {event.channel && (
                        <Badge variant="outline" className="text-xs">
                          {event.channel}
                        </Badge>
                      )}
                      {getStatusBadge(event.status)}
                      {event.linkedEntityId && (
                        <Badge variant="secondary" className="text-xs">
                          <LinkIcon className="mr-1 h-3 w-3" />
                          Linked
                        </Badge>
                      )}
                    </div>

                    <p className="mt-1 text-sm text-gray-600">{event.description}</p>

                    <div className="mt-2 flex items-center gap-4 text-xs text-gray-500">
                      <span>📅 {new Date(event.timestamp).toLocaleString('pt-BR')}</span>
                      {event.metadata?.messageCount && (
                        <span>💬 {event.metadata.messageCount} mensagens</span>
                      )}
                      {event.metadata?.itemCount && (
                        <span>📦 {event.metadata.itemCount} itens</span>
                      )}
                    </div>
                  </div>

                  {/* Action Button */}
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      const routes: Record<TimelineEvent['type'], string> = {
                        web_chat: `/admin/conversas-ia/${event.id}`,
                        whatsapp: `/admin/conversas/${event.id}`,
                        quote: `/admin/orcamentos/${event.id}`,
                        order: `/admin/pedidos/${event.id}`,
                        appointment: `/admin/agendamentos/${event.id}`,
                      }
                      router.push(routes[event.type])
                    }}
                  >
                    Ver Detalhes →
                  </Button>
                </div>
              </Card>
            </div>
          ))}
        </div>

        {data.timeline.length === 0 && (
          <Card className="p-8 text-center text-gray-500">
            <p>Nenhum evento encontrado para este cliente.</p>
          </Card>
        )}
      </div>
    </div>
  )
}
