'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { logger } from '@/lib/logger'

interface UpdateOrderStatusProps {
  orderId: string
  currentStatus: string
}

const statusOptions = [
  { value: 'ORCAMENTO_ENVIADO', label: 'Orçamento Enviado' },
  { value: 'AGUARDANDO_PAGAMENTO', label: 'Aguardando Pagamento' },
  { value: 'APROVADO', label: 'Aprovado' },
  { value: 'EM_PRODUCAO', label: 'Em Produção' },
  { value: 'PRONTO_ENTREGA', label: 'Pronto p/ Entrega' },
  { value: 'INSTALACAO_AGENDADA', label: 'Instalação Agendada' },
  { value: 'INSTALANDO', label: 'Instalando' },
  { value: 'CONCLUIDO', label: 'Concluído' },
  { value: 'CANCELADO', label: 'Cancelado' },
]

export function UpdateOrderStatus({ orderId, currentStatus }: UpdateOrderStatusProps) {
  const router = useRouter()
  const [status, setStatus] = useState(currentStatus)
  const [isLoading, setIsLoading] = useState(false)

  const handleUpdateStatus = async () => {
    if (status === currentStatus) return

    setIsLoading(true)
    try {
      const response = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, notifyCustomer: true }),
      })

      if (!response.ok) {
        throw new Error('Erro ao atualizar status')
      }

      router.refresh()
    } catch (error) {
      logger.error('Error updating status:', error)
      alert('Erro ao atualizar status do pedido')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex items-center gap-3">
      <Select value={status} onValueChange={setStatus}>
        <SelectTrigger className="w-[200px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {statusOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button
        onClick={handleUpdateStatus}
        disabled={isLoading || status === currentStatus}
        size="sm"
      >
        {isLoading ? 'Atualizando...' : 'Atualizar'}
      </Button>
    </div>
  )
}
