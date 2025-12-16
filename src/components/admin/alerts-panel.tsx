'use client'

import { AlertTriangle, Bell, CheckCircle, Info, XCircle } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

type AlertLevel = 'info' | 'warning' | 'error' | 'success'

interface Alert {
  id: string
  level: AlertLevel
  title: string
  message: string
  timestamp: Date
  action?: {
    label: string
    href: string
  }
  count?: number
}

interface AlertsPanelProps {
  alerts: Alert[]
  onDismiss?: (alertId: string) => void
}

const alertConfig: Record<
  AlertLevel,
  { icon: any; bgColor: string; textColor: string; borderColor: string }
> = {
  info: {
    icon: Info,
    bgColor: 'bg-blue-500/10',
    textColor: 'text-blue-400',
    borderColor: 'border-blue-500/30',
  },
  warning: {
    icon: AlertTriangle,
    bgColor: 'bg-yellow-500/10',
    textColor: 'text-yellow-400',
    borderColor: 'border-yellow-500/30',
  },
  error: {
    icon: XCircle,
    bgColor: 'bg-red-500/10',
    textColor: 'text-red-400',
    borderColor: 'border-red-500/30',
  },
  success: {
    icon: CheckCircle,
    bgColor: 'bg-green-500/10',
    textColor: 'text-green-400',
    borderColor: 'border-green-500/30',
  },
}

export function AlertsPanel({ alerts, onDismiss }: AlertsPanelProps) {
  const sortedAlerts = [...alerts].sort((a, b) => {
    const levelOrder = { error: 0, warning: 1, info: 2, success: 3 }
    return levelOrder[a.level] - levelOrder[b.level]
  })

  const criticalCount = alerts.filter((a) => a.level === 'error').length
  const warningCount = alerts.filter((a) => a.level === 'warning').length

  return (
    <Card className="bg-theme-secondary border-theme-default p-6">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Bell className="text-theme-primary h-5 w-5" />
          <div>
            <h3 className="text-theme-primary text-lg font-semibold">Alertas e Notificações</h3>
            <p className="text-theme-secondary text-sm">
              {alerts.length > 0
                ? `${alerts.length} ${alerts.length === 1 ? 'alerta ativo' : 'alertas ativos'}`
                : 'Nenhum alerta no momento'}
            </p>
          </div>
        </div>

        {(criticalCount > 0 || warningCount > 0) && (
          <div className="flex gap-2">
            {criticalCount > 0 && (
              <Badge variant="error" className="text-xs">
                {criticalCount} crítico{criticalCount > 1 ? 's' : ''}
              </Badge>
            )}
            {warningCount > 0 && (
              <Badge className="border-yellow-500/30 bg-yellow-500/20 text-xs text-yellow-400">
                {warningCount} aviso{warningCount > 1 ? 's' : ''}
              </Badge>
            )}
          </div>
        )}
      </div>

      <div className="space-y-3">
        {sortedAlerts.length === 0 ? (
          <div className="py-8 text-center">
            <CheckCircle className="mx-auto mb-3 h-12 w-12 text-green-400 opacity-50" />
            <p className="text-theme-secondary">Tudo certo! Nenhum alerta no momento.</p>
          </div>
        ) : (
          sortedAlerts.map((alert) => {
            const config = alertConfig[alert.level]
            const Icon = config.icon

            return (
              <div
                key={alert.id}
                className={`flex gap-4 rounded-lg border p-4 ${config.bgColor} ${config.borderColor}`}
              >
                <div className={`flex-shrink-0 ${config.textColor}`}>
                  <Icon className="h-5 w-5" />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex items-start justify-between gap-2">
                    <h4 className={`text-sm font-semibold ${config.textColor}`}>
                      {alert.title}
                      {alert.count && alert.count > 1 && (
                        <span className="ml-2 text-xs opacity-75">({alert.count})</span>
                      )}
                    </h4>
                  </div>

                  <p className="text-theme-secondary mb-3 text-sm">{alert.message}</p>

                  <div className="flex items-center gap-2">
                    {alert.action && (
                      <Link href={alert.action.href}>
                        <Button size="sm" variant="outline" className="h-7 text-xs">
                          {alert.action.label}
                        </Button>
                      </Link>
                    )}

                    {onDismiss && (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 text-xs"
                        onClick={() => onDismiss(alert.id)}
                      >
                        Dispensar
                      </Button>
                    )}

                    <span className="text-theme-secondary ml-auto text-xs">
                      {new Date(alert.timestamp).toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>
    </Card>
  )
}
