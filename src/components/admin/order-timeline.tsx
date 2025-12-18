'use client'

import { memo } from 'react'
import { formatDateTime } from '@/lib/utils'
import { Check, Clock, Package, Truck, Wrench, X, AlertCircle } from 'lucide-react'
import type { OrderStatus } from '@prisma/client'

interface TimelineEntry {
  id: string
  status: string
  description: string
  createdBy: string
  createdAt: Date | string
}

interface OrderTimelineProps {
  entries: TimelineEntry[]
  currentStatus: OrderStatus
}

export const OrderTimeline = memo(function OrderTimeline({
  entries,
  currentStatus,
}: OrderTimelineProps) {
  const getStatusIcon = (status: string) => {
    const iconClass = 'h-5 w-5'

    switch (status) {
      case 'ORCAMENTO_ENVIADO':
        return <Clock className={iconClass} />
      case 'AGUARDANDO_PAGAMENTO':
        return <AlertCircle className={iconClass} />
      case 'APROVADO':
        return <Check className={iconClass} />
      case 'EM_PRODUCAO':
        return <Package className={iconClass} />
      case 'PRONTO_ENTREGA':
      case 'INSTALACAO_AGENDADA':
        return <Truck className={iconClass} />
      case 'INSTALANDO':
        return <Wrench className={iconClass} />
      case 'CONCLUIDO':
        return <Check className={iconClass} />
      case 'CANCELADO':
        return <X className={iconClass} />
      default:
        return <Clock className={iconClass} />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CONCLUIDO':
        return 'bg-green-500 border-green-500 text-green-500'
      case 'CANCELADO':
        return 'bg-red-500 border-red-500 text-red-500'
      case 'AGUARDANDO_PAGAMENTO':
      case 'AGUARDANDO_CLIENTE':
        return 'bg-yellow-500 border-yellow-500 text-yellow-500'
      case 'EM_PRODUCAO':
      case 'INSTALANDO':
        return 'bg-blue-500 border-blue-500 text-blue-500'
      case 'APROVADO':
      case 'PRONTO_ENTREGA':
      case 'INSTALACAO_AGENDADA':
        return 'bg-gold-500 border-gold-500 text-gold-500'
      default:
        return 'bg-neutral-500 border-neutral-500 text-neutral-500'
    }
  }

  if (!entries || entries.length === 0) {
    return (
      <div className="py-8 text-center text-neutral-500">
        <Clock className="mx-auto mb-4 h-12 w-12 opacity-50" />
        <p>Nenhuma atualização ainda</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {entries.map((entry, index) => {
        const isLast = index === entries.length - 1
        const colors = getStatusColor(entry.status)

        return (
          <div key={entry.id} className="relative flex gap-4 pb-4">
            {/* Linha conectora */}
            {!isLast && (
              <div className="absolute bottom-0 left-[18px] top-10 w-px bg-neutral-200 dark:bg-neutral-800" />
            )}

            {/* Ícone */}
            <div
              className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 bg-background ${colors}`}
            >
              {getStatusIcon(entry.status)}
            </div>

            {/* Conteúdo */}
            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between">
                <p className="font-medium">{entry.description}</p>
                <p className="text-sm text-neutral-500">{formatDateTime(entry.createdAt)}</p>
              </div>
              {entry.createdBy !== 'system' && (
                <p className="text-sm text-neutral-500">por {entry.createdBy}</p>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
})
