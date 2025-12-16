'use client'

import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { FileText, ShoppingCart, Calendar, MessageSquare, User, Package, Clock } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'

type ActivityType =
  | 'QUOTE_CREATED'
  | 'QUOTE_SENT'
  | 'ORDER_CREATED'
  | 'ORDER_STATUS_CHANGED'
  | 'APPOINTMENT_SCHEDULED'
  | 'CUSTOMER_REGISTERED'
  | 'MESSAGE_RECEIVED'

interface Activity {
  id: string
  type: ActivityType
  title: string
  description: string
  timestamp: Date
  userId?: string
  userName?: string
  entityId?: string
  entityType?: 'order' | 'quote' | 'appointment'
  metadata?: Record<string, any>
}

interface ActivityFeedProps {
  activities: Activity[]
  maxItems?: number
}

const activityIcons: Record<ActivityType, any> = {
  QUOTE_CREATED: FileText,
  QUOTE_SENT: FileText,
  ORDER_CREATED: ShoppingCart,
  ORDER_STATUS_CHANGED: Package,
  APPOINTMENT_SCHEDULED: Calendar,
  CUSTOMER_REGISTERED: User,
  MESSAGE_RECEIVED: MessageSquare,
}

const activityColors: Record<ActivityType, string> = {
  QUOTE_CREATED: 'text-blue-400',
  QUOTE_SENT: 'text-blue-500',
  ORDER_CREATED: 'text-green-400',
  ORDER_STATUS_CHANGED: 'text-yellow-400',
  APPOINTMENT_SCHEDULED: 'text-purple-400',
  CUSTOMER_REGISTERED: 'text-accent-500',
  MESSAGE_RECEIVED: 'text-pink-400',
}

export function ActivityFeed({ activities, maxItems = 10 }: ActivityFeedProps) {
  const displayedActivities = activities.slice(0, maxItems)

  const getActivityLink = (activity: Activity): string | null => {
    if (!activity.entityId) return null

    switch (activity.entityType) {
      case 'order':
        return `/admin/pedidos/${activity.entityId}`
      case 'quote':
        return `/admin/orcamentos/${activity.entityId}`
      case 'appointment':
        return `/admin/agendamentos`
      default:
        return null
    }
  }

  return (
    <Card className="bg-theme-secondary border-theme-default p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-theme-primary text-lg font-semibold">Atividades Recentes</h3>
          <p className="text-theme-secondary text-sm">
            Últimas {displayedActivities.length} atividades
          </p>
        </div>
        <Clock className="text-theme-secondary h-5 w-5" />
      </div>

      <div className="space-y-4">
        {displayedActivities.length === 0 ? (
          <div className="py-8 text-center">
            <MessageSquare className="text-theme-secondary mx-auto mb-3 h-12 w-12 opacity-50" />
            <p className="text-theme-secondary">Nenhuma atividade recente</p>
          </div>
        ) : (
          displayedActivities.map((activity) => {
            const Icon = activityIcons[activity.type]
            const color = activityColors[activity.type]
            const link = getActivityLink(activity)

            const content = (
              <div className="hover:bg-theme-elevated flex gap-4 rounded-lg p-3 transition-colors">
                <div className={`flex-shrink-0 ${color}`}>
                  <div className="bg-theme-elevated flex h-10 w-10 items-center justify-center rounded-full">
                    <Icon className="h-5 w-5" />
                  </div>
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <p className="text-theme-primary text-sm font-medium">{activity.title}</p>
                      <p className="text-theme-secondary mt-1 text-sm">{activity.description}</p>
                      {activity.userName && (
                        <p className="text-theme-secondary mt-1 text-xs">por {activity.userName}</p>
                      )}
                    </div>
                    <span className="text-theme-secondary whitespace-nowrap text-xs">
                      {formatDistanceToNow(new Date(activity.timestamp), {
                        addSuffix: true,
                        locale: ptBR,
                      })}
                    </span>
                  </div>

                  {activity.metadata && (
                    <div className="mt-2 flex gap-2">
                      {activity.metadata.status && (
                        <Badge variant="secondary" className="text-xs">
                          {activity.metadata.status}
                        </Badge>
                      )}
                      {activity.metadata.value && (
                        <Badge variant="secondary" className="text-xs">
                          {new Intl.NumberFormat('pt-BR', {
                            style: 'currency',
                            currency: 'BRL',
                          }).format(activity.metadata.value)}
                        </Badge>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )

            if (link) {
              return (
                <Link key={activity.id} href={link} className="block">
                  {content}
                </Link>
              )
            }

            return <div key={activity.id}>{content}</div>
          })
        )}
      </div>

      {activities.length > maxItems && (
        <div className="mt-4 text-center">
          <Link
            href="/admin/atividades"
            className="text-sm text-accent-500 transition-colors hover:text-accent-600"
          >
            Ver todas as atividades ({activities.length})
          </Link>
        </div>
      )}
    </Card>
  )
}
