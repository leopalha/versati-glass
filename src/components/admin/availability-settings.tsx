'use client'

import { useState, useEffect } from 'react'
import { Save, Loader2, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'

interface DayAvailability {
  enabled: boolean
  start: string
  end: string
}

interface AvailabilityConfig {
  monday: DayAvailability
  tuesday: DayAvailability
  wednesday: DayAvailability
  thursday: DayAvailability
  friday: DayAvailability
  saturday: DayAvailability
  sunday: DayAvailability
  slotDuration: number // minutos
  bufferTime: number // minutos entre agendamentos
}

const defaultConfig: AvailabilityConfig = {
  monday: { enabled: true, start: '08:00', end: '18:00' },
  tuesday: { enabled: true, start: '08:00', end: '18:00' },
  wednesday: { enabled: true, start: '08:00', end: '18:00' },
  thursday: { enabled: true, start: '08:00', end: '18:00' },
  friday: { enabled: true, start: '08:00', end: '18:00' },
  saturday: { enabled: false, start: '08:00', end: '12:00' },
  sunday: { enabled: false, start: '08:00', end: '12:00' },
  slotDuration: 120, // 2 horas
  bufferTime: 30, // 30 minutos
}

const daysOfWeek = [
  { key: 'monday' as const, label: 'Segunda-feira' },
  { key: 'tuesday' as const, label: 'Terça-feira' },
  { key: 'wednesday' as const, label: 'Quarta-feira' },
  { key: 'thursday' as const, label: 'Quinta-feira' },
  { key: 'friday' as const, label: 'Sexta-feira' },
  { key: 'saturday' as const, label: 'Sábado' },
  { key: 'sunday' as const, label: 'Domingo' },
]

export function AvailabilitySettings() {
  const [config, setConfig] = useState<AvailabilityConfig>(defaultConfig)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    loadConfig()
  }, [])

  const loadConfig = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/settings/availability')
      if (response.ok) {
        const data = await response.json()
        if (data.config) {
          setConfig(data.config)
        }
      }
    } catch (error) {
      console.error('Erro ao carregar configuração:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const response = await fetch('/api/settings/availability', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      })

      if (!response.ok) {
        throw new Error('Erro ao salvar')
      }

      alert('Configuração salva com sucesso!')
    } catch (error) {
      console.error('Erro:', error)
      alert('Erro ao salvar configuração. Tente novamente.')
    } finally {
      setSaving(false)
    }
  }

  const updateDay = (day: keyof typeof config, field: keyof DayAvailability, value: any) => {
    if (field === 'enabled') {
      setConfig((prev) => ({
        ...prev,
        [day]: { ...(prev[day] as DayAvailability), [field]: value },
      }))
    } else {
      setConfig((prev) => ({
        ...prev,
        [day]: { ...(prev[day] as DayAvailability), [field]: value },
      }))
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-accent-500" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Card className="bg-theme-secondary border-theme-default p-6">
        <div className="mb-6 flex items-center gap-3">
          <Clock className="h-5 w-5 text-accent-500" />
          <div>
            <h3 className="text-theme-primary text-lg font-semibold">Horários de Atendimento</h3>
            <p className="text-theme-secondary text-sm">
              Configure os dias e horários disponíveis para agendamentos
            </p>
          </div>
        </div>

        {/* Days of Week */}
        <div className="mb-6 space-y-4">
          {daysOfWeek.map(({ key, label }) => (
            <div
              key={key}
              className="bg-theme-elevated border-theme-default flex items-center gap-4 rounded-lg border p-4"
            >
              <div className="flex w-40 items-center gap-3">
                <Checkbox
                  checked={config[key].enabled}
                  onCheckedChange={(checked) => updateDay(key, 'enabled', checked === true)}
                />
                <Label className="text-sm font-medium">{label}</Label>
              </div>

              {config[key].enabled && (
                <div className="flex flex-1 items-center gap-3">
                  <div className="flex items-center gap-2">
                    <Label className="text-theme-secondary text-xs">De:</Label>
                    <Input
                      type="time"
                      value={config[key].start}
                      onChange={(e) => updateDay(key, 'start', e.target.value)}
                      className="w-32"
                    />
                  </div>

                  <span className="text-theme-secondary">até</span>

                  <div className="flex items-center gap-2">
                    <Label className="text-theme-secondary text-xs">Até:</Label>
                    <Input
                      type="time"
                      value={config[key].end}
                      onChange={(e) => updateDay(key, 'end', e.target.value)}
                      className="w-32"
                    />
                  </div>
                </div>
              )}

              {!config[key].enabled && (
                <span className="text-theme-secondary text-sm italic">Fechado</span>
              )}
            </div>
          ))}
        </div>

        {/* Additional Settings */}
        <div className="bg-theme-elevated border-theme-default grid grid-cols-2 gap-4 rounded-lg border p-4">
          <div>
            <Label>Duração do Agendamento (minutos)</Label>
            <Input
              type="number"
              min="30"
              step="30"
              value={config.slotDuration}
              onChange={(e) =>
                setConfig((prev) => ({
                  ...prev,
                  slotDuration: Number(e.target.value),
                }))
              }
              className="mt-2"
            />
            <p className="text-theme-secondary mt-1 text-xs">Tempo padrão para cada agendamento</p>
          </div>

          <div>
            <Label>Intervalo Entre Agendamentos (minutos)</Label>
            <Input
              type="number"
              min="0"
              step="15"
              value={config.bufferTime}
              onChange={(e) =>
                setConfig((prev) => ({
                  ...prev,
                  bufferTime: Number(e.target.value),
                }))
              }
              className="mt-2"
            />
            <p className="text-theme-secondary mt-1 text-xs">
              Tempo de preparação entre agendamentos
            </p>
          </div>
        </div>

        {/* Save Button */}
        <div className="mt-6 flex justify-end">
          <Button onClick={handleSave} disabled={saving} className="gap-2">
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Salvando...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Salvar Configuração
              </>
            )}
          </Button>
        </div>
      </Card>
    </div>
  )
}
