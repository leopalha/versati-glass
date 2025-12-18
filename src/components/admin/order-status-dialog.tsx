'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import type { OrderStatus } from '@prisma/client'
import { logger } from '@/lib/logger'

interface OrderStatusDialogProps {
  orderId: string
  currentStatus: OrderStatus
  children: React.ReactNode
}

const statusOptions: { value: OrderStatus; label: string; description: string }[] = [
  {
    value: 'ORCAMENTO_ENVIADO',
    label: 'Orçamento Enviado',
    description: 'Orçamento foi enviado ao cliente',
  },
  {
    value: 'AGUARDANDO_PAGAMENTO',
    label: 'Aguardando Pagamento',
    description: 'Aguardando confirmação de pagamento',
  },
  { value: 'APROVADO', label: 'Aprovado', description: 'Pedido aprovado e confirmado' },
  { value: 'EM_PRODUCAO', label: 'Em Produção', description: 'Produção iniciada' },
  {
    value: 'PRONTO_ENTREGA',
    label: 'Pronto para Entrega',
    description: 'Produto pronto para instalação',
  },
  {
    value: 'INSTALACAO_AGENDADA',
    label: 'Instalação Agendada',
    description: 'Instalação agendada com cliente',
  },
  { value: 'INSTALANDO', label: 'Instalando', description: 'Instalação em andamento' },
  { value: 'CONCLUIDO', label: 'Concluído', description: 'Serviço concluído com sucesso' },
  { value: 'CANCELADO', label: 'Cancelado', description: 'Pedido cancelado' },
  {
    value: 'AGUARDANDO_CLIENTE',
    label: 'Aguardando Cliente',
    description: 'Aguardando retorno do cliente',
  },
  { value: 'EM_REVISAO', label: 'Em Revisão', description: 'Pedido em revisão' },
]

export function OrderStatusDialog({ orderId, currentStatus, children }: OrderStatusDialogProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [newStatus, setNewStatus] = useState<OrderStatus>(currentStatus)
  const [internalNotes, setInternalNotes] = useState('')
  const [notifyCustomer, setNotifyCustomer] = useState(true)

  async function handleSubmit() {
    if (newStatus === currentStatus) {
      setOpen(false)
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: newStatus,
          internalNotes: internalNotes || undefined,
          notifyCustomer,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Erro ao atualizar status')
      }

      // Sucesso
      setOpen(false)
      router.refresh()
    } catch (error) {
      logger.error('Error updating status:', error)
      alert(error instanceof Error ? error.message : 'Erro ao atualizar status')
    } finally {
      setIsLoading(false)
    }
  }

  const selectedOption = statusOptions.find((opt) => opt.value === newStatus)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Atualizar Status do Pedido</DialogTitle>
          <DialogDescription>
            Altere o status atual do pedido. O cliente será notificado automaticamente.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Seletor de Status */}
          <div className="space-y-2">
            <Label>Novo Status</Label>
            <Select value={newStatus} onValueChange={(value) => setNewStatus(value as OrderStatus)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex flex-col items-start">
                      <span className="font-medium">{option.label}</span>
                      <span className="text-xs text-neutral-500">{option.description}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedOption && (
              <p className="text-sm text-neutral-500">{selectedOption.description}</p>
            )}
          </div>

          {/* Notas Internas */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notas Internas (Opcional)</Label>
            <Textarea
              id="notes"
              placeholder="Adicione observações sobre esta mudança de status..."
              value={internalNotes}
              onChange={(e) => setInternalNotes(e.target.value)}
              rows={3}
            />
          </div>

          {/* Notificar Cliente */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="notify"
              checked={notifyCustomer}
              onCheckedChange={(checked) => setNotifyCustomer(checked as boolean)}
            />
            <Label htmlFor="notify" className="cursor-pointer text-sm font-normal">
              Notificar cliente por email e WhatsApp
            </Label>
          </div>

          {/* Warning se status final */}
          {newStatus === 'CONCLUIDO' && (
            <div className="rounded-lg bg-green-50 p-3 text-sm text-green-800 dark:bg-green-950 dark:text-green-200">
              <strong>Atenção:</strong> Ao marcar como concluído, a data de conclusão será
              registrada e a garantia iniciará.
            </div>
          )}

          {newStatus === 'CANCELADO' && (
            <div className="rounded-lg bg-red-50 p-3 text-sm text-red-800 dark:bg-red-950 dark:text-red-200">
              <strong>Atenção:</strong> Esta ação cancelará o pedido. Certifique-se de que isso é o
              que deseja.
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={isLoading}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading || newStatus === currentStatus}>
            {isLoading ? 'Atualizando...' : 'Confirmar Atualização'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
