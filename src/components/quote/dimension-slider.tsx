'use client'

import { useState } from 'react'
import { Ruler, Minus, Plus } from 'lucide-react'
import { Label } from '@/components/ui/label'

interface DimensionSliderProps {
  label: string
  value: string
  onChange: (value: string) => void
  min?: number
  max?: number
  step?: number
  unit?: string
  id?: string
  presets?: number[] // Medidas comuns pré-definidas (ex: [1.0, 1.5, 2.0, 2.5, 3.0])
  showPresets?: boolean
}

/**
 * DimensionSlider - Seletor Híbrido de Dimensões
 *
 * Permite ao usuário selecionar dimensões de duas formas:
 * 1. Slider visual - arrasta para selecionar medidas comuns
 * 2. Input manual - digita valores exatos
 *
 * Features:
 * - Botões +/- para ajustes finos
 * - Presets de medidas comuns (1m, 1.5m, 2m, etc)
 * - Input sempre disponível para valores personalizados
 * - Visual limpo e intuitivo
 * - Mobile-friendly (touch gestures)
 */
export function DimensionSlider({
  label,
  value,
  onChange,
  min = 0.3,
  max = 6.0,
  step = 0.05,
  unit = 'm',
  id,
  presets,
  showPresets = true,
}: DimensionSliderProps) {
  const [inputMode, setInputMode] = useState(false)
  const numValue = value ? parseFloat(value) : min

  // Presets padrão se não fornecidos
  const defaultPresets = [0.5, 1.0, 1.5, 2.0, 2.5, 3.0, 3.5, 4.0]
  const finalPresets = presets || defaultPresets.filter(p => p >= min && p <= max)

  // Incrementar valor
  const handleIncrement = () => {
    const newValue = Math.min(numValue + step, max)
    onChange(newValue.toFixed(2))
  }

  // Decrementar valor
  const handleDecrement = () => {
    const newValue = Math.max(numValue - step, min)
    onChange(newValue.toFixed(2))
  }

  // Mudar via slider
  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(e.target.value)
    onChange(newValue.toFixed(2))
  }

  // Mudar via input direto
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value

    // Permitir digitação livre (validar depois)
    if (inputValue === '' || inputValue === '.') {
      onChange(inputValue)
      return
    }

    // Validar número
    const num = parseFloat(inputValue)
    if (!isNaN(num)) {
      onChange(inputValue)
    }
  }

  // Validar ao sair do input
  const handleInputBlur = () => {
    const num = parseFloat(value)
    if (isNaN(num) || num < min) {
      onChange(min.toFixed(2))
    } else if (num > max) {
      onChange(max.toFixed(2))
    } else {
      onChange(num.toFixed(2))
    }
    setInputMode(false)
  }

  // Selecionar preset
  const handlePresetClick = (presetValue: number) => {
    onChange(presetValue.toFixed(2))
  }

  // Calcular porcentagem para o slider visual
  const percentage = ((numValue - min) / (max - min)) * 100

  return (
    <div className="space-y-3">
      {/* Label com ícone */}
      <div className="flex items-center gap-2">
        <Ruler className="h-4 w-4 text-blue-400" />
        <Label htmlFor={id} className="text-sm font-medium text-neutral-200">
          {label}
        </Label>
      </div>

      {/* Controles principais */}
      <div className="flex items-center gap-3">
        {/* Botão - */}
        <button
          type="button"
          onClick={handleDecrement}
          disabled={numValue <= min}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-neutral-700 bg-neutral-800 text-neutral-300 transition-colors hover:bg-neutral-700 disabled:opacity-30 disabled:cursor-not-allowed"
          aria-label="Diminuir"
        >
          <Minus className="h-4 w-4" />
        </button>

        {/* Input de valor */}
        <div className="relative flex-1">
          <input
            type="text"
            id={id}
            value={value}
            onChange={handleInputChange}
            onFocus={() => setInputMode(true)}
            onBlur={handleInputBlur}
            className="h-10 w-full rounded-lg border border-neutral-700 bg-neutral-800 px-4 pr-12 text-center text-lg font-semibold text-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            placeholder="0.00"
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-neutral-400">
            {unit}
          </span>
        </div>

        {/* Botão + */}
        <button
          type="button"
          onClick={handleIncrement}
          disabled={numValue >= max}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-neutral-700 bg-neutral-800 text-neutral-300 transition-colors hover:bg-neutral-700 disabled:opacity-30 disabled:cursor-not-allowed"
          aria-label="Aumentar"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      {/* Slider visual */}
      {!inputMode && (
        <div className="space-y-2">
          {/* Barra do slider */}
          <div className="relative">
            <input
              type="range"
              min={min}
              max={max}
              step={step}
              value={numValue}
              onChange={handleSliderChange}
              className="slider-custom h-2 w-full cursor-pointer appearance-none rounded-full bg-neutral-700 outline-none"
              style={{
                background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${percentage}%, #404040 ${percentage}%, #404040 100%)`
              }}
            />
          </div>

          {/* Labels min/max */}
          <div className="flex justify-between text-xs text-neutral-500">
            <span>{min}{unit}</span>
            <span>{max}{unit}</span>
          </div>
        </div>
      )}

      {/* Presets de medidas comuns */}
      {showPresets && !inputMode && finalPresets.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs text-neutral-500">Medidas comuns:</p>
          <div className="flex flex-wrap gap-2">
            {finalPresets.map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => handlePresetClick(preset)}
                className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                  Math.abs(numValue - preset) < 0.01
                    ? 'bg-blue-500 text-white'
                    : 'border border-neutral-700 bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
                }`}
              >
                {preset.toFixed(1)}{unit}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Instruções */}
      {!inputMode && (
        <p className="text-xs text-neutral-500">
          Arraste o seletor, use os botões +/- ou clique no valor para digitar
        </p>
      )}
    </div>
  )
}

// Estilos CSS para o slider (adicionar ao globals.css ou aqui com styled-jsx)
// Nota: Range input precisa de estilos específicos para cada browser
