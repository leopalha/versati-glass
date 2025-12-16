'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Calendar as CalendarIcon, Loader2, Plus } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog'

interface CreateAppointmentDialogProps {
  variant?: 'default' | 'outline' | 'ghost'
  size?: 'default' | 'sm' | 'lg' | 'icon'
}

interface TimeSlot {
  date: string
  time: string
  available: boolean
}

export function CreateAppointmentDialog({
  variant = 'default',
  size = 'sm',
}: CreateAppointmentDialogProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [creating, setCreating] = useState(false)
  const [loadingSlots, setLoadingSlots] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Form fields
  const [type, setType] = useState<string>('INSTALACAO')
  const [customerEmail, setCustomerEmail] = useState('')
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedTime, setSelectedTime] = useState('')
  const [estimatedDuration, setEstimatedDuration] = useState('180')
  const [addressStreet, setAddressStreet] = useState('')
  const [addressNumber, setAddressNumber] = useState('')
  const [addressComplement, setAddressComplement] = useState('')
  const [addressNeighborhood, setAddressNeighborhood] = useState('')
  const [addressCity, setAddressCity] = useState('')
  const [addressState, setAddressState] = useState('')
  const [addressZipCode, setAddressZipCode] = useState('')
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

  const handleCreate = async () => {
    if (!customerEmail || !selectedDate || !selectedTime) {
      setError('Email, data e horário são obrigatórios')
      return
    }

    if (
      !addressStreet ||
      !addressNumber ||
      !addressNeighborhood ||
      !addressCity ||
      !addressState ||
      !addressZipCode
    ) {
      setError('Endereço completo é obrigatório')
      return
    }

    setCreating(true)
    setError(null)

    try {
      // Buscar usuário por email
      const userResponse = await fetch(`/api/users?email=${encodeURIComponent(customerEmail)}`)
      if (!userResponse.ok) {
        throw new Error('Cliente não encontrado')
      }
      const userData = await userResponse.json()
      const userId = userData.user?.id

      if (!userId) {
        throw new Error('Cliente não encontrado')
      }

      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          type,
          scheduledDate: selectedDate,
          scheduledTime: selectedTime,
          estimatedDuration: parseInt(estimatedDuration),
          addressStreet,
          addressNumber,
          addressComplement: addressComplement || undefined,
          addressNeighborhood,
          addressCity,
          addressState,
          addressZipCode,
          notes: notes || undefined,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao criar agendamento')
      }

      setOpen(false)
      router.refresh()

      // Limpar formulário
      setCustomerEmail('')
      setSelectedDate('')
      setSelectedTime('')
      setAddressStreet('')
      setAddressNumber('')
      setAddressComplement('')
      setAddressNeighborhood('')
      setAddressCity('')
      setAddressState('')
      setAddressZipCode('')
      setNotes('')
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao criar agendamento'
      setError(message)
    } finally {
      setCreating(false)
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
          <Plus className="mr-2 h-4 w-4" />
          Novo Agendamento
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Criar Agendamento Manual</DialogTitle>
          <DialogDescription>Criar um novo agendamento para um cliente existente</DialogDescription>
        </DialogHeader>

        {error && (
          <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-400">
            {error}
          </div>
        )}

        <div className="space-y-4">
          {/* Tipo de Agendamento */}
          <div>
            <label className="mb-2 block text-sm font-medium text-neutral-700">Tipo *</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full rounded-lg border border-neutral-400 bg-neutral-100 px-3 py-2 text-white focus:border-gold-500 focus:outline-none focus:ring-2 focus:ring-gold-500/20"
            >
              <option value="INSTALACAO">Instalação</option>
              <option value="VISITA_TECNICA">Visita Técnica</option>
              <option value="MANUTENCAO">Manutenção</option>
              <option value="REVISAO">Revisão</option>
            </select>
          </div>

          {/* Email do Cliente */}
          <div>
            <label className="mb-2 block text-sm font-medium text-neutral-700">
              Email do Cliente *
            </label>
            <Input
              type="email"
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
              placeholder="cliente@example.com"
            />
          </div>

          {loadingSlots ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-gold-500" />
            </div>
          ) : (
            <>
              {/* Data */}
              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-700">Data *</label>
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
            </>
          )}

          {/* Endereço */}
          <div className="space-y-3 rounded-lg border border-neutral-400 bg-neutral-200 p-4">
            <h4 className="font-medium text-white">Endereço do Serviço</h4>

            <div className="grid gap-3 sm:grid-cols-3">
              <div className="sm:col-span-2">
                <Input
                  placeholder="Rua *"
                  value={addressStreet}
                  onChange={(e) => setAddressStreet(e.target.value)}
                />
              </div>
              <div>
                <Input
                  placeholder="Número *"
                  value={addressNumber}
                  onChange={(e) => setAddressNumber(e.target.value)}
                />
              </div>
            </div>

            <Input
              placeholder="Complemento"
              value={addressComplement}
              onChange={(e) => setAddressComplement(e.target.value)}
            />

            <div className="grid gap-3 sm:grid-cols-2">
              <Input
                placeholder="Bairro *"
                value={addressNeighborhood}
                onChange={(e) => setAddressNeighborhood(e.target.value)}
              />
              <Input
                placeholder="Cidade *"
                value={addressCity}
                onChange={(e) => setAddressCity(e.target.value)}
              />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <Input
                placeholder="Estado (UF) *"
                value={addressState}
                onChange={(e) => setAddressState(e.target.value)}
                maxLength={2}
              />
              <Input
                placeholder="CEP *"
                value={addressZipCode}
                onChange={(e) => setAddressZipCode(e.target.value)}
              />
            </div>
          </div>

          {/* Observações */}
          <div>
            <label className="mb-2 block text-sm font-medium text-neutral-700">
              Observações (opcional)
            </label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder="Ex: Trazer escada, acesso pelo elevador de serviço..."
            />
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="ghost" onClick={() => setOpen(false)} disabled={creating}>
            Cancelar
          </Button>
          <Button
            type="button"
            onClick={handleCreate}
            disabled={creating || !selectedDate || !selectedTime || loadingSlots}
          >
            {creating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Criando...
              </>
            ) : (
              <>
                <CalendarIcon className="mr-2 h-4 w-4" />
                Criar Agendamento
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
