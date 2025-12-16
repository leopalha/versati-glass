'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Calendar as CalendarIcon, Loader2 } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select } from '@/components/ui/select'

interface ScheduleInstallationButtonProps {
  orderId: string
  orderNumber: string
  customerName: string
  serviceAddress: {
    street: string
    number: string
    complement?: string | null
    neighborhood: string
    city: string
    state: string
    zipCode: string
  }
  variant?: 'default' | 'outline' | 'ghost'
  size?: 'default' | 'sm' | 'lg' | 'icon'
}

interface TimeSlot {
  date: string
  time: string
  available: boolean
}

export function ScheduleInstallationButton({
  orderId,
  orderNumber,
  customerName,
  serviceAddress,
  variant = 'default',
  size = 'sm',
}: ScheduleInstallationButtonProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [scheduling, setScheduling] = useState(false)
  const [loadingSlots, setLoadingSlots] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [selectedDate, setSelectedDate] = useState('')
  const [selectedTime, setSelectedTime] = useState('')
  const [estimatedDuration, setEstimatedDuration] = useState('180') // 3 hours default
  const [notes, setNotes] = useState('')
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([])

  // Carregar horários disponíveis quando abrir o dialog
  useEffect(() => {
    if (open) {
      loadAvailableSlots()
    }
  }, [open])

  const loadAvailableSlots = async () => {
    setLoadingSlots(true)
    try {
      const response = await fetch('/api/appointments/slots')
      if (response.ok) {
        const data = await response.json()
        setAvailableSlots(data.slots || [])
      }
    } catch (err) {
      console.error('Error loading slots:', err)
    } finally {
      setLoadingSlots(false)
    }
  }

  const handleSchedule = async () => {
    if (!selectedDate || !selectedTime) {
      setError('Selecione data e horário')
      return
    }

    setScheduling(true)
    setError(null)

    try {
      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId,
          type: 'INSTALACAO',
          scheduledDate: selectedDate,
          scheduledTime: selectedTime,
          estimatedDuration: parseInt(estimatedDuration),
          addressStreet: serviceAddress.street,
          addressNumber: serviceAddress.number,
          addressComplement: serviceAddress.complement,
          addressNeighborhood: serviceAddress.neighborhood,
          addressCity: serviceAddress.city,
          addressState: serviceAddress.state,
          addressZipCode: serviceAddress.zipCode,
          notes,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao agendar instalação')
      }

      // Atualizar status do pedido para INSTALACAO_AGENDADA
      await fetch(`/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: 'INSTALACAO_AGENDADA',
          internalNotes: `Instalação agendada para ${selectedDate} às ${selectedTime}`,
          notifyCustomer: true,
        }),
      })

      setOpen(false)
      router.refresh()
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao agendar instalação'
      setError(message)
    } finally {
      setScheduling(false)
    }
  }

  // Agrupar slots por data
  const slotsByDate = availableSlots.reduce(
    (acc, slot) => {
      if (!acc[slot.date]) {
        acc[slot.date] = []
      }
      acc[slot.date].push(slot)
      return acc
    },
    {} as Record<string, TimeSlot[]>
  )

  const dates = Object.keys(slotsByDate).sort()
  const times =
    selectedDate && slotsByDate[selectedDate]
      ? slotsByDate[selectedDate].filter((s) => s.available)
      : []

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={variant} size={size}>
          <CalendarIcon className="mr-2 h-4 w-4" />
          Agendar Instalação
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Agendar Instalação</DialogTitle>
          <DialogDescription>
            Pedido <strong>#{orderNumber}</strong> - {customerName}
          </DialogDescription>
        </DialogHeader>

        {error && (
          <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-400">
            {error}
          </div>
        )}

        <div className="space-y-4">
          {/* Endereço */}
          <div className="rounded-lg border border-neutral-400 bg-neutral-200 p-4">
            <p className="mb-2 text-sm font-medium text-white">Endereço da Instalação</p>
            <p className="text-sm text-neutral-700">
              {serviceAddress.street}, {serviceAddress.number}
              {serviceAddress.complement && ` - ${serviceAddress.complement}`}
              <br />
              {serviceAddress.neighborhood} - {serviceAddress.city}/{serviceAddress.state}
              <br />
              CEP: {serviceAddress.zipCode}
            </p>
          </div>

          {loadingSlots ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-gold-500" />
            </div>
          ) : (
            <>
              {/* Data */}
              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-700">
                  Data da Instalação *
                </label>
                <select
                  value={selectedDate}
                  onChange={(e) => {
                    setSelectedDate(e.target.value)
                    setSelectedTime('')
                  }}
                  className="w-full rounded-lg border border-neutral-400 bg-neutral-100 px-3 py-2 text-white focus:border-gold-500 focus:outline-none focus:ring-2 focus:ring-gold-500/20"
                >
                  <option value="">Selecione uma data</option>
                  {dates.map((date) => (
                    <option key={date} value={date}>
                      {new Date(date).toLocaleDateString('pt-BR', {
                        weekday: 'long',
                        day: '2-digit',
                        month: 'long',
                      })}
                    </option>
                  ))}
                </select>
              </div>

              {/* Horário */}
              {selectedDate && (
                <div>
                  <label className="mb-2 block text-sm font-medium text-neutral-700">
                    Horário *
                  </label>
                  <select
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                    className="w-full rounded-lg border border-neutral-400 bg-neutral-100 px-3 py-2 text-white focus:border-gold-500 focus:outline-none focus:ring-2 focus:ring-gold-500/20"
                  >
                    <option value="">Selecione um horário</option>
                    {times.map((slot) => (
                      <option key={slot.time} value={slot.time}>
                        {slot.time}
                      </option>
                    ))}
                  </select>
                  {times.length === 0 && (
                    <p className="mt-2 text-sm text-yellow-400">
                      Nenhum horário disponível para esta data
                    </p>
                  )}
                </div>
              )}

              {/* Duração Estimada */}
              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-700">
                  Duração Estimada (minutos) *
                </label>
                <select
                  value={estimatedDuration}
                  onChange={(e) => setEstimatedDuration(e.target.value)}
                  className="w-full rounded-lg border border-neutral-400 bg-neutral-100 px-3 py-2 text-white focus:border-gold-500 focus:outline-none focus:ring-2 focus:ring-gold-500/20"
                >
                  <option value="60">1 hora</option>
                  <option value="120">2 horas</option>
                  <option value="180">3 horas</option>
                  <option value="240">4 horas</option>
                  <option value="300">5 horas</option>
                  <option value="360">6 horas</option>
                </select>
              </div>

              {/* Observações */}
              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-700">
                  Observações (opcional)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  className="w-full rounded-lg border border-neutral-400 bg-neutral-100 px-3 py-2 text-white placeholder-neutral-600 focus:border-gold-500 focus:outline-none focus:ring-2 focus:ring-gold-500/20"
                  placeholder="Ex: Trazer escada, acesso pelo elevador de serviço..."
                />
              </div>
            </>
          )}
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="ghost"
            onClick={() => setOpen(false)}
            disabled={scheduling}
          >
            Cancelar
          </Button>
          <Button
            type="button"
            onClick={handleSchedule}
            disabled={scheduling || !selectedDate || !selectedTime || loadingSlots}
          >
            {scheduling ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Agendando...
              </>
            ) : (
              <>
                <CalendarIcon className="mr-2 h-4 w-4" />
                Confirmar Agendamento
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
