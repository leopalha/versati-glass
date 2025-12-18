'use client'

import { useMemo } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  generateSuggestions,
  filterSuggestionsByConfidence,
  filterAlreadySetFields,
  getTopSuggestions,
  type Suggestion,
  type QuoteContext,
} from '@/lib/smart-suggestions'
import { Lightbulb, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react'

interface SmartSuggestionsPanelProps {
  context: QuoteContext
  onApplySuggestion: (field: string, value: string) => void
  maxSuggestions?: number
  minConfidence?: 'low' | 'medium' | 'high'
  className?: string
}

export function SmartSuggestionsPanel({
  context,
  onApplySuggestion,
  maxSuggestions = 3,
  minConfidence = 'medium',
  className = '',
}: SmartSuggestionsPanelProps) {
  // Generate and filter suggestions
  const suggestions = useMemo(() => {
    const allSuggestions = generateSuggestions(context)
    const filteredByField = filterAlreadySetFields(allSuggestions, context)
    const filteredByConfidence = filterSuggestionsByConfidence(filteredByField, minConfidence)
    return getTopSuggestions(filteredByConfidence, maxSuggestions)
  }, [context, maxSuggestions, minConfidence])

  // Don't render if no suggestions
  if (suggestions.length === 0) {
    return null
  }

  return (
    <Card className={`border-accent-500/30 bg-accent-500/5 p-4 ${className}`}>
      <div className="mb-3 flex items-center gap-2">
        <Lightbulb className="h-5 w-5 text-accent-500" />
        <h3 className="text-theme-primary font-semibold">Sugestões Inteligentes</h3>
      </div>

      <div className="space-y-3">
        {suggestions.map((suggestion, index) => (
          <SuggestionCard
            key={`${suggestion.field}-${index}`}
            suggestion={suggestion}
            onApply={() => onApplySuggestion(suggestion.field, suggestion.value)}
          />
        ))}
      </div>

      <p className="text-theme-subtle mt-3 text-xs">
        Baseado nas suas seleções e nas melhores práticas do mercado
      </p>
    </Card>
  )
}

interface SuggestionCardProps {
  suggestion: Suggestion
  onApply: () => void
}

function SuggestionCard({ suggestion, onApply }: SuggestionCardProps) {
  const { confidence, reason, savingsOrBenefit } = suggestion

  // Icon based on confidence
  const ConfidenceIcon = {
    high: CheckCircle,
    medium: AlertCircle,
    low: TrendingUp,
  }[confidence]

  // Color coding
  const confidenceColor = {
    high: 'text-green-400',
    medium: 'text-yellow-400',
    low: 'text-blue-400',
  }[confidence]

  const confidenceBg = {
    high: 'bg-green-500/10',
    medium: 'bg-yellow-500/10',
    low: 'bg-blue-500/10',
  }[confidence]

  const confidenceLabel = {
    high: 'Altamente recomendado',
    medium: 'Recomendado',
    low: 'Sugestão',
  }[confidence]

  return (
    <div className="bg-theme-elevated flex items-start gap-3 rounded-lg border border-neutral-700 p-3">
      <div className={`mt-0.5 rounded-full p-1 ${confidenceBg}`}>
        <ConfidenceIcon className={`h-4 w-4 ${confidenceColor}`} />
      </div>

      <div className="flex-1 space-y-1">
        <div className="flex items-center gap-2">
          <p className={`text-xs font-medium ${confidenceColor}`}>{confidenceLabel}</p>
        </div>

        <p className="text-theme-primary text-sm">{reason}</p>

        {savingsOrBenefit && (
          <p className="text-xs font-medium text-accent-400">💰 {savingsOrBenefit}</p>
        )}
      </div>

      <Button
        size="sm"
        variant="outline"
        onClick={onApply}
        className="border-accent-500/50 hover:bg-accent-500/10 shrink-0 text-accent-400"
      >
        Aplicar
      </Button>
    </div>
  )
}

/**
 * Compact inline suggestion (for individual fields)
 */
interface InlineSuggestionProps {
  suggestion: Suggestion
  onApply: () => void
}

export function InlineSuggestion({ suggestion, onApply }: InlineSuggestionProps) {
  return (
    <div className="bg-accent-500/5 mt-1 flex items-center gap-2 rounded p-2 text-xs">
      <Lightbulb className="h-3.5 w-3.5 shrink-0 text-accent-500" />
      <p className="text-theme-muted flex-1">{suggestion.reason}</p>
      <button
        type="button"
        onClick={onApply}
        className="shrink-0 font-medium text-accent-400 underline hover:text-accent-300"
      >
        Aplicar
      </button>
    </div>
  )
}
