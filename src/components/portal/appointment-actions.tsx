'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Calendar, X, Loader2 } from 'lucide-react'
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
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

interface AppointmentActionsProps {
  appointmentId: string
  currentDate: string
  currentTime: string
  currentStatus: string
}

export function AppointmentActions({
  appointmentId,
  currentDate,
  currentTime,
  currentStatus,
}: AppointmentActionsProps) {
  const router = useRouter()
  const [rescheduleOpen, setRescheduleOpen] = useState(false)
  const [cancelOpen, setCancelOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  // Reschedule state
  const [newDate, setNewDate] = useState('')
  const [newTime, setNewTime] = useState('')
  const [rescheduleReason, setRescheduleReason] = useState('')

  // Cancel state
  const [cancelReason, setCancelReason] = useState('')

  const canReschedule = ['SCHEDULED', 'CONFIRMED'].includes(currentStatus)
  const canCancel = !['CANCELLED', 'COMPLETED', 'NO_SHOW'].includes(currentStatus)

  const handleReschedule = async () => {
    if (!newDate || !newTime) {
      alert('Por favor, selecione uma nova data e horário')
      return
    }

    setLoading(true)
    try {
      const response = await fetch(`/api/appointments/${appointmentId}/reschedule`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          newDate,
          newTime,
          reason: rescheduleReason,
        }),
      })

      if (!response.ok) {
        throw new Error('Erro ao reagendar')
      }

      setRescheduleOpen(false)
      setNewDate('')
      setNewTime('')
      setRescheduleReason('')
      router.refresh()
    } catch (error) {
      console.error('Erro:', error)
      alert('Erro ao reagendar agendamento. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = async () => {
    if (!cancelReason) {
      alert('Por favor, informe o motivo do cancelamento')
      return
    }

    setLoading(true)
    try {
      const response = await fetch(`/api/appointments/${appointmentId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'CANCELLED',
          cancellationReason: cancelReason,
        }),
      })

      if (!response.ok) {
        throw new Error('Erro ao cancelar')
      }

      setCancelOpen(false)
      setCancelReason('')
      router.refresh()
    } catch (error) {
      console.error('Erro:', error)
      alert('Erro ao cancelar agendamento. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex gap-2">
      {/* Reschedule */}
      {canReschedule && (
        <Dialog open={rescheduleOpen} onOpenChange={setRescheduleOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              <Calendar className="h-4 w-4" />
              Reagendar
            </Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>Reagendar Agendamento</DialogTitle>
              <DialogDescription>Solicite um novo horário para seu agendamento</DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="bg-theme-elevated border-theme-default rounded-lg border p-3">
                <p className="text-theme-secondary mb-1 text-sm">Agendamento atual:</p>
                <p className="text-theme-primary text-sm font-medium">
                  {new Date(currentDate).toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                  })}{' '}
                  às {currentTime}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Nova Data</Label>
                  <Input
                    type="date"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label>Novo Horário</Label>
                  <Input
                    type="time"
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>

              <div>
                <Label>Motivo do Reagendamento</Label>
                <Textarea
                  placeholder="Explique por que precisa reagendar..."
                  value={rescheduleReason}
                  onChange={(e) => setRescheduleReason(e.target.value)}
                  className="mt-1 min-h-[80px]"
                />
              </div>

              <div className="rounded-lg border border-blue-500/30 bg-blue-500/10 p-3">
                <p className="text-xs text-blue-400">
                  ℹ️ Sua solicitação será analisada pela equipe. Você receberá uma confirmação por
                  email.
                </p>
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setRescheduleOpen(false)}
                disabled={loading}
              >
                Cancelar
              </Button>
              <Button
                type="button"
                onClick={handleReschedule}
                disabled={loading || !newDate || !newTime}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Reagendando...
                  </>
                ) : (
                  'Solicitar Reagendamento'
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Cancel */}
      {canCancel && (
        <Dialog open={cancelOpen} onOpenChange={setCancelOpen}>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="gap-2 border-error/30 text-error hover:bg-error/10"
            >
              <X className="h-4 w-4" />
              Cancelar
            </Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>Cancelar Agendamento</DialogTitle>
              <DialogDescription>
                Tem certeza que deseja cancelar este agendamento?
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="bg-theme-elevated border-theme-default rounded-lg border p-3">
                <p className="text-theme-secondary mb-1 text-sm">Agendamento:</p>
                <p className="text-theme-primary text-sm font-medium">
                  {new Date(currentDate).toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                  })}{' '}
                  às {currentTime}
                </p>
              </div>

              <div>
                <Label>Motivo do Cancelamento *</Label>
                <Textarea
                  placeholder="Por favor, informe o motivo do cancelamento..."
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  className="mt-1 min-h-[100px]"
                />
              </div>

              <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3">
                <p className="text-xs text-red-400">
                  ⚠️ Esta ação não pode ser desfeita. Você precisará criar um novo agendamento.
                </p>
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setCancelOpen(false)}
                disabled={loading}
              >
                Voltar
              </Button>
              <Button
                type="button"
                variant="danger"
                onClick={handleCancel}
                disabled={loading || !cancelReason}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Cancelando...
                  </>
                ) : (
                  'Confirmar Cancelamento'
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
