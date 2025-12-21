'use client'

import { useMemo, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  calculateThickness,
  validateDimensions,
  isExternalApplication,
  type GlassApplication,
  type ThicknessRecommendation,
  type ValidationResult,
} from '@/lib/nbr-validations'
import { NBRTooltip, ValidationTooltip } from '@/components/ui/tooltip'
import { Calculator, AlertTriangle, CheckCircle2, Info, Wind, Home } from 'lucide-react'

interface ThicknessCalculatorProps {
  width: number
  height: number
  application: GlassApplication
  currentThickness?: number
  windZone?: number
  onApplyThickness: (thickness: number) => void
  onMinThicknessChange?: (minThickness: number) => void // Notify parent of min thickness for filtering options
  className?: string
}

export function ThicknessCalculator({
  width,
  height,
  application,
  currentThickness,
  windZone = 2,
  onApplyThickness,
  onMinThicknessChange,
  className = '',
}: ThicknessCalculatorProps) {
  // Calculate recommended thickness
  const recommendation = useMemo<ThicknessRecommendation | null>(() => {
    if (!width || !height || width <= 0 || height <= 0) return null
    return calculateThickness({ width, height }, application, windZone)
  }, [width, height, application, windZone])

  // Notify parent of minimum thickness when it changes (for filtering options)
  useEffect(() => {
    if (recommendation && onMinThicknessChange) {
      onMinThicknessChange(recommendation.minThickness)
    }
  }, [recommendation, onMinThicknessChange])

  // Validate current dimensions
  const validation = useMemo<ValidationResult | null>(() => {
    if (!width || !height || !currentThickness) return null
    return validateDimensions({ width, height, thickness: currentThickness }, application)
  }, [width, height, currentThickness, application])

  // Don't render if no dimensions
  if (!recommendation) {
    return null
  }

  const area = width * height
  // Ensure proper numeric comparison - currentThickness may be undefined or number
  // The prop is typed as number but we add safety for edge cases
  const isCurrentThicknessOk =
    currentThickness !== undefined &&
    currentThickness !== null &&
    Number(currentThickness) >= recommendation.minThickness

  // Determina se é área externa (sujeita a vento) ou interna
  const isExternal = isExternalApplication(application)

  return (
    <Card className={`border-blue-500/30 bg-blue-500/5 p-4 ${className}`}>
      {/* Header */}
      <div className="mb-3 flex items-center gap-2">
        <Calculator className="h-5 w-5 text-blue-400" />
        <h3 className="text-theme-primary font-semibold">Calculadora de Espessura</h3>
        <NBRTooltip
          title="Cálculo Automático NBR 14488"
          description={
            isExternal
              ? 'Espessura calculada com base nas dimensões, aplicação e zona de vento conforme normas brasileiras'
              : 'Espessura calculada com base nas dimensões e aplicação. Área interna - sem fator de vento.'
          }
          nbrReference={isExternal ? 'NBR 14488, NBR 14718, NBR 16259' : 'NBR 14488, NBR 14718'}
        />
      </div>

      {/* Calculation Info */}
      <div className="bg-theme-elevated mb-3 space-y-2 rounded-lg p-3">
        <div className="flex items-center justify-between">
          <span className="text-theme-muted text-sm">Área:</span>
          <span className="text-theme-primary font-medium">{area.toFixed(2)} m²</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-theme-muted text-sm">Proporção:</span>
          <span className="text-theme-primary font-medium">
            {(Math.max(width, height) / Math.min(width, height)).toFixed(1)}:1
          </span>
        </div>
        {/* Mostrar zona de vento APENAS para áreas externas */}
        {isExternal ? (
          <div className="flex items-center justify-between">
            <span className="text-theme-muted flex items-center gap-1 text-sm">
              <Wind className="h-3 w-3" /> Zona de Vento:
            </span>
            <span className="text-theme-primary font-medium">
              Zona {windZone}
              <NBRTooltip
                title="Zona de Vento (NBR 16259)"
                description={getWindZoneDescription(windZone)}
                nbrReference="NBR 16259"
              />
            </span>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <span className="text-theme-muted flex items-center gap-1 text-sm">
              <Home className="h-3 w-3" /> Ambiente:
            </span>
            <span className="font-medium text-green-400">
              Área Interna
              <NBRTooltip
                title="Área Interna"
                description="Ambientes internos não sofrem pressão de vento. O cálculo usa apenas dimensões e aplicação."
                nbrReference="NBR 14488"
              />
            </span>
          </div>
        )}
      </div>

      {/* Recommendation */}
      <div className="space-y-2">
        <div className="bg-theme-elevated rounded-lg border-2 border-blue-500/50 p-3">
          <div className="mb-2 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-blue-400" />
            <span className="text-theme-muted text-sm font-medium">Espessura Recomendada</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-blue-400">
              {recommendation.recommendedThickness}mm
            </span>
            {recommendation.recommendedThickness > recommendation.minThickness && (
              <span className="text-theme-muted text-sm">
                (mín. {recommendation.minThickness}mm)
              </span>
            )}
          </div>
          <p className="text-theme-muted mt-2 text-xs">{recommendation.reason}</p>
          {!isCurrentThicknessOk && (
            <Button
              size="sm"
              onClick={() => onApplyThickness(recommendation.recommendedThickness)}
              className="mt-3 w-full bg-blue-500 hover:bg-blue-600"
            >
              Aplicar Espessura Recomendada
            </Button>
          )}
        </div>

        {/* Warning if exists */}
        {recommendation.warning && (
          <div className="flex items-start gap-2 rounded-lg border border-yellow-500/50 bg-yellow-500/10 p-3">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-yellow-400" />
            <div className="flex-1">
              <p className="text-sm font-medium text-yellow-400">Atenção</p>
              <p className="text-theme-muted text-xs">{recommendation.warning}</p>
            </div>
          </div>
        )}

        {/* Current thickness validation */}
        {validation && currentThickness && (
          <ValidationDisplay validation={validation} currentThickness={currentThickness} />
        )}
      </div>

      {/* NBR Reference */}
      <div className="mt-3 flex items-center gap-1 text-xs text-neutral-400">
        <Info className="h-3 w-3" />
        <span>Ref: {recommendation.nbrReference}</span>
      </div>
    </Card>
  )
}

/**
 * Display validation result for current thickness selection
 */
interface ValidationDisplayProps {
  validation: ValidationResult
  currentThickness: number
}

function ValidationDisplay({ validation, currentThickness }: ValidationDisplayProps) {
  const severityConfig = {
    info: {
      icon: CheckCircle2,
      color: 'text-blue-400',
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/50',
    },
    warning: {
      icon: AlertTriangle,
      color: 'text-yellow-400',
      bg: 'bg-yellow-500/10',
      border: 'border-yellow-500/50',
    },
    error: {
      icon: AlertTriangle,
      color: 'text-red-400',
      bg: 'bg-red-500/10',
      border: 'border-red-500/50',
    },
  }

  const config = severityConfig[validation.severity]
  const Icon = config.icon

  return (
    <div className={`flex items-start gap-2 rounded-lg border p-3 ${config.bg} ${config.border}`}>
      <Icon className={`mt-0.5 h-4 w-4 shrink-0 ${config.color}`} />
      <div className="flex-1">
        <div className="mb-1 flex items-center gap-2">
          <p className={`text-sm font-medium ${config.color}`}>{currentThickness}mm selecionado</p>
          {validation.valid && validation.severity === 'info' && (
            <CheckCircle2 className="h-4 w-4 text-green-400" />
          )}
        </div>
        <p className="text-theme-muted text-xs">{validation.message}</p>
        {validation.recommendation && (
          <p className="text-theme-muted mt-1 text-xs italic">{validation.recommendation}</p>
        )}
        {validation.nbrReference && (
          <p className="text-theme-subtle mt-1 text-xs">{validation.nbrReference}</p>
        )}
      </div>
    </div>
  )
}

/**
 * Get wind zone description for tooltip
 */
function getWindZoneDescription(zone: number): string {
  const descriptions = {
    1: 'Zona 1 - Baixo vento (áreas internas do continente)',
    2: 'Zona 2 - Vento médio (costa a 50km+)',
    3: 'Zona 3 - Vento alto (costa até 50km)',
    4: 'Zona 4 - Vento muito alto (costa exposta)',
  }
  return descriptions[zone as keyof typeof descriptions] || 'Zona desconhecida'
}

/**
 * Compact version for inline display
 */
interface CompactThicknessCalculatorProps {
  width: number
  height: number
  application: GlassApplication
  currentThickness?: number
  onApplyThickness: (thickness: number) => void
}

export function CompactThicknessCalculator({
  width,
  height,
  application,
  currentThickness,
  onApplyThickness,
}: CompactThicknessCalculatorProps) {
  const recommendation = useMemo<ThicknessRecommendation | null>(() => {
    if (!width || !height || width <= 0 || height <= 0) return null
    return calculateThickness({ width, height }, application, 2)
  }, [width, height, application])

  if (!recommendation) return null

  const needsUpdate = !currentThickness || currentThickness < recommendation.recommendedThickness

  if (!needsUpdate) return null

  return (
    <div className="mt-2 flex items-center gap-2 rounded-lg border border-blue-500/30 bg-blue-500/5 p-2">
      <Calculator className="h-4 w-4 shrink-0 text-blue-400" />
      <div className="flex-1">
        <p className="text-theme-primary text-sm">
          Espessura recomendada: <strong>{recommendation.recommendedThickness}mm</strong>
        </p>
        <p className="text-theme-muted text-xs">{recommendation.reason}</p>
      </div>
      <Button
        size="sm"
        variant="outline"
        onClick={() => onApplyThickness(recommendation.recommendedThickness)}
        className="shrink-0 border-blue-500/50 text-blue-400 hover:bg-blue-500/10"
      >
        Aplicar
      </Button>
    </div>
  )
}
