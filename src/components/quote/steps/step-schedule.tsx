'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useQuoteStore } from '@/store/quote-store'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/toast/use-toast'
import { cn } from '@/lib/utils'
import { logger, getErrorMessage } from '@/lib/logger'
import { Calendar, Clock, CheckCircle, ArrowLeft, Loader2, MessageCircle } from 'lucide-react'

const timeSlots = ['08:00', '09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00']

export function StepSchedule() {
  const router = useRouter()
  const { scheduleData, setScheduleData, reset, prevStep } = useQuoteStore()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedDate, setSelectedDate] = useState<string>(scheduleData?.date || '')
  const [selectedTime, setSelectedTime] = useState<string>(scheduleData?.time || '')
  const [notes, setNotes] = useState(scheduleData?.notes || '')
  const [isCompleted, setIsCompleted] = useState(false)

  // Generate available dates (next 14 days, excluding Sundays)
  const getAvailableDates = () => {
    const dates: { value: string; label: string }[] = []
    const today = new Date()

    for (let i = 1; i <= 14; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() + i)

      // Skip Sundays
      if (date.getDay() === 0) continue

      const value = date.toISOString().split('T')[0]
      const label = date.toLocaleDateString('pt-BR', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
      })

      dates.push({ value, label })
    }

    return dates
  }

  const availableDates = getAvailableDates()

  const handleSchedule = async () => {
    // FQ.4.5: Validação de data e horário
    if (!selectedDate || !selectedTime) {
      toast({
        variant: 'error',
        title: 'Selecione data e horario',
        description: 'Por favor, escolha uma data e horario para a visita',
      })
      return
    }

    // FQ.4.5: Validar que a data está no futuro
    const scheduledDate = new Date(selectedDate)
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    if (scheduledDate < today) {
      toast({
        variant: 'error',
        title: 'Data invalida',
        description: 'Nao e possivel agendar para datas passadas',
      })
      return
    }

    // FQ.4.5: Validar que a data não é domingo
    if (scheduledDate.getDay() === 0) {
      toast({
        variant: 'error',
        title: 'Data invalida',
        description: 'Nao atendemos aos domingos. Por favor, escolha outra data',
      })
      return
    }

    // FQ.4.5: Validar formato do horário
    const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/
    if (!timeRegex.test(selectedTime)) {
      toast({
        variant: 'error',
        title: 'Horario invalido',
        description: 'Formato de horario invalido (use HH:MM)',
      })
      return
    }

    // FQ.4.5: Validar que o horário está dentro do expediente (08:00-18:00)
    const [hours, minutes] = selectedTime.split(':').map(Number)
    if (hours < 8 || hours >= 18) {
      toast({
        variant: 'error',
        title: 'Horario fora do expediente',
        description: 'Nosso horario de atendimento e das 08:00 as 18:00',
      })
      return
    }

    // FQ.4.5: Validar tamanho das observações (máximo 500 caracteres)
    if (notes && notes.length > 500) {
      toast({
        variant: 'error',
        title: 'Observacoes muito longas',
        description: 'As observacoes devem ter no maximo 500 caracteres',
      })
      return
    }

    setIsSubmitting(true)

    try {
      setScheduleData({
        type: 'VISITA_TECNICA',
        date: selectedDate,
        time: selectedTime,
        notes,
      })

      // Here we would create the appointment via API
      // For now, just show success

      setIsCompleted(true)

      toast({
        variant: 'success',
        title: 'Agendamento realizado!',
        description: 'Voce recebera uma confirmacao por WhatsApp',
      })
    } catch (error) {
      // ARCH-P1-2: Standardized error handling
      const errorMsg = getErrorMessage(error)
      logger.error('[SCHEDULE] Failed to schedule appointment:', { error: errorMsg })

      toast({
        variant: 'error',
        title: 'Erro',
        description: 'Erro ao agendar visita',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleFinish = () => {
    reset()
    router.push('/')
  }

  const handleSkip = () => {
    toast({
      variant: 'success',
      title: 'Orcamento enviado!',
      description: 'Entraremos em contato em breve pelo WhatsApp',
    })
    reset()
    router.push('/')
  }

  if (isCompleted) {
    return (
      <div className="mx-auto max-w-md">
        <Card className="p-8 text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-500/20">
            <CheckCircle className="h-10 w-10 text-green-500" />
          </div>

          <h2 className="text-theme-primary mb-2 font-display text-2xl font-bold">Tudo pronto!</h2>
          <p className="text-theme-muted mb-6">
            Seu orcamento foi enviado e a visita tecnica foi agendada para{' '}
            <span className="text-theme-primary font-medium">
              {new Date(selectedDate).toLocaleDateString('pt-BR', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
              })}{' '}
              as {selectedTime}
            </span>
          </p>

          <div className="space-y-4">
            <div className="bg-accent-500/10 rounded-lg p-4">
              <div className="flex items-center justify-center gap-2 text-accent-400">
                <MessageCircle className="h-5 w-5" />
                <span className="text-sm">Voce recebera uma confirmacao por WhatsApp</span>
              </div>
            </div>

            <Button onClick={handleFinish} className="w-full">
              Voltar para a Home
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-8 text-center">
        <h2 className="text-theme-primary font-display text-3xl font-bold">
          Agendar visita tecnica
        </h2>
        <p className="text-theme-muted mt-2">
          Escolha o melhor dia e horario para nossa equipe ir ate voce
        </p>
      </div>

      <Card className="p-6">
        <div className="space-y-6">
          {/* Date Selection */}
          <div>
            <div className="mb-3 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-accent-400" />
              <label className="text-theme-primary font-medium">Selecione uma data</label>
            </div>

            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {availableDates.slice(0, 9).map((date) => (
                <button
                  key={date.value}
                  type="button"
                  onClick={() => setSelectedDate(date.value)}
                  className={cn(
                    'rounded-lg border p-3 text-left transition-colors',
                    selectedDate === date.value
                      ? 'bg-accent-500/10 border-accent-500'
                      : 'border-theme-default hover:border-neutral-600'
                  )}
                >
                  <p className="text-theme-primary text-sm font-medium capitalize">
                    {new Date(date.value).toLocaleDateString('pt-BR', {
                      weekday: 'short',
                    })}
                  </p>
                  <p className="text-theme-primary text-lg font-bold">
                    {new Date(date.value).getDate()}
                  </p>
                  <p className="text-theme-muted text-xs capitalize">
                    {new Date(date.value).toLocaleDateString('pt-BR', {
                      month: 'short',
                    })}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Time Selection */}
          <div>
            <div className="mb-3 flex items-center gap-2">
              <Clock className="h-5 w-5 text-accent-400" />
              <label className="text-theme-primary font-medium">Selecione um horario</label>
            </div>

            <div className="grid grid-cols-4 gap-2">
              {timeSlots.map((time) => (
                <button
                  key={time}
                  type="button"
                  onClick={() => setSelectedTime(time)}
                  className={cn(
                    'rounded-lg border p-3 text-center transition-colors',
                    selectedTime === time
                      ? 'bg-accent-500/10 border-accent-500'
                      : 'border-theme-default hover:border-neutral-600'
                  )}
                >
                  <span className="text-theme-primary font-medium">{time}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="text-theme-muted text-sm">Observacoes (opcional)</label>
              <span
                className={cn('text-xs', notes.length > 500 ? 'text-error' : 'text-theme-subtle')}
              >
                {notes.length}/500
              </span>
            </div>
            <textarea
              className="bg-theme-elevated border-theme-default text-theme-primary placeholder:text-theme-subtle w-full rounded-lg border px-4 py-3 focus:border-accent-500 focus:outline-none"
              rows={3}
              placeholder="Alguma informacao adicional para nossa equipe..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              maxLength={500}
            />
          </div>
        </div>
      </Card>

      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-between">
        <Button variant="outline" onClick={prevStep} disabled={isSubmitting}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>

        <div className="flex gap-2">
          <Button variant="ghost" onClick={handleSkip} disabled={isSubmitting}>
            Pular agendamento
          </Button>
          <Button onClick={handleSchedule} disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Agendando...
              </>
            ) : (
              'Confirmar Agendamento'
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
