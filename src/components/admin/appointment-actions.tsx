'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Edit2, X, Loader2, CheckCircle } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog'

interface AppointmentActionsProps {
  appointmentId: string
  currentStatus: string
}

export function AppointmentActions({ appointmentId, currentStatus }: AppointmentActionsProps) {
  const router = useRouter()
  const [cancelOpen, setCancelOpen] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [completeOpen, setCompleteOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleUpdateStatus = async (newStatus: string, dialogSetter: (open: boolean) => void) => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/appointments/${appointmentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao atualizar agendamento')
      }

      dialogSetter(false)
      router.refresh()
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao atualizar agendamento'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  const canCancel = !['CANCELLED', 'COMPLETED', 'NO_SHOW'].includes(currentStatus)
  const canConfirm = currentStatus === 'SCHEDULED'
  const canComplete = ['SCHEDULED', 'CONFIRMED', 'IN_PROGRESS'].includes(currentStatus)

  return (
    <div className="flex items-center gap-2">
      {/* Confirmar */}
      {canConfirm && (
        <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <CheckCircle className="mr-2 h-4 w-4" />
              Confirmar
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[400px]">
            <DialogHeader>
              <DialogTitle>Confirmar agendamento?</DialogTitle>
              <DialogDescription>O cliente será notificado da confirmação.</DialogDescription>
            </DialogHeader>

            {error && (
              <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-400">
                {error}
              </div>
            )}

            <DialogFooter>
              <Button
                type="button"
                variant="ghost"
                onClick={() => setConfirmOpen(false)}
                disabled={loading}
              >
                Voltar
              </Button>
              <Button
                type="button"
                onClick={() => handleUpdateStatus('CONFIRMED', setConfirmOpen)}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Confirmando...
                  </>
                ) : (
                  <>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Confirmar
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Concluir */}
      {canComplete && (
        <Dialog open={completeOpen} onOpenChange={setCompleteOpen}>
          <DialogTrigger asChild>
            <Button variant="default" size="sm">
              <CheckCircle className="mr-2 h-4 w-4" />
              Concluir
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[400px]">
            <DialogHeader>
              <DialogTitle>Marcar como concluído?</DialogTitle>
              <DialogDescription>O serviço foi realizado com sucesso?</DialogDescription>
            </DialogHeader>

            {error && (
              <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-400">
                {error}
              </div>
            )}

            <DialogFooter>
              <Button
                type="button"
                variant="ghost"
                onClick={() => setCompleteOpen(false)}
                disabled={loading}
              >
                Voltar
              </Button>
              <Button
                type="button"
                onClick={() => handleUpdateStatus('COMPLETED', setCompleteOpen)}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Concluindo...
                  </>
                ) : (
                  <>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Marcar como Concluído
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Cancelar */}
      {canCancel && (
        <Dialog open={cancelOpen} onOpenChange={setCancelOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <X className="mr-2 h-4 w-4" />
              Cancelar
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[400px]">
            <DialogHeader>
              <DialogTitle>Cancelar agendamento?</DialogTitle>
              <DialogDescription>
                Esta ação não pode ser desfeita. O cliente será notificado do cancelamento.
              </DialogDescription>
            </DialogHeader>

            {error && (
              <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-400">
                {error}
              </div>
            )}

            <div className="rounded-lg border border-neutral-400 bg-neutral-200 p-4">
              <p className="text-sm text-neutral-700">Ao cancelar:</p>
              <ul className="mt-2 space-y-1 text-sm text-neutral-800">
                <li>• O cliente receberá um email de notificação</li>
                <li>• O horário ficará disponível para outros agendamentos</li>
                <li>• O agendamento será marcado como CANCELADO</li>
              </ul>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="ghost"
                onClick={() => setCancelOpen(false)}
                disabled={loading}
              >
                Voltar
              </Button>
              <Button
                type="button"
                variant="danger"
                onClick={() => handleUpdateStatus('CANCELLED', setCancelOpen)}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Cancelando...
                  </>
                ) : (
                  <>
                    <X className="mr-2 h-4 w-4" />
                    Cancelar Agendamento
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
