/**
 * Smart Suggestions - Intelligent recommendations for glass products
 *
 * This module provides context-aware suggestions based on:
 * - Product category
 * - Dimensions and area
 * - User selections (glass type, model, etc.)
 * - Common industry practices
 * - NBR standards compliance
 */

import type { GlassApplication } from './nbr-validations'

// ============================================================================
// TYPES
// ============================================================================

export interface Suggestion {
  field: string
  value: string
  reason: string
  confidence: 'high' | 'medium' | 'low'
  savingsOrBenefit?: string
}

export interface QuoteContext {
  category: string
  width?: number
  height?: number
  glassType?: string
  model?: string
  color?: string
  thickness?: number
  finish?: string
  application?: string
  // Phase 1 conditional fields
  glassTexture?: string
  hasteSize?: string
  pivotPosition?: string
  handleType?: string
  lockType?: string
  hasHandrail?: boolean
  handrailType?: string
  pergolaStructure?: string
  pergolaFixing?: string
  pergolaSlope?: string
  shelfType?: string
  shelfSupportType?: string
  shelfSupportMaterial?: string
  partitionSystem?: string
  closingType?: string
  closingSystem?: string
  serviceUrgency?: string
}

// ============================================================================
// SMART SUGGESTIONS ENGINE
// ============================================================================

/**
 * Generate intelligent suggestions based on quote context
 */
export function generateSuggestions(context: QuoteContext): Suggestion[] {
  const suggestions: Suggestion[] = []

  // Area calculation for dimension-based suggestions
  const area = context.width && context.height ? context.width * context.height : 0

  // Category-specific suggestions
  switch (context.category) {
    case 'BOX':
      suggestions.push(...getBoxSuggestions(context, area))
      break
    case 'ESPELHOS':
      suggestions.push(...getMirrorSuggestions(context, area))
      break
    case 'PORTAS':
      suggestions.push(...getDoorSuggestions(context, area))
      break
    case 'JANELAS':
      suggestions.push(...getWindowSuggestions(context, area))
      break
    case 'GUARDA_CORPO':
      suggestions.push(...getGuardRailSuggestions(context, area))
      break
    case 'PERGOLADOS':
      suggestions.push(...getPergolaSuggestions(context, area))
      break
    case 'TAMPOS_PRATELEIRAS':
      suggestions.push(...getShelfSuggestions(context, area))
      break
    case 'DIVISORIAS':
      suggestions.push(...getPartitionSuggestions(context, area))
      break
    case 'FECHAMENTOS':
      suggestions.push(...getClosureSuggestions(context, area))
      break
  }

  // Universal thickness suggestions
  if (context.width && context.height && !context.thickness) {
    suggestions.push(...getThicknessSuggestions(context, area))
  }

  // Color harmony suggestions
  if (context.color) {
    suggestions.push(...getColorHarmonySuggestions(context))
  }

  // Cost optimization suggestions
  suggestions.push(...getCostOptimizationSuggestions(context, area))

  return suggestions
}

// ============================================================================
// CATEGORY-SPECIFIC SUGGESTIONS
// ============================================================================

function getBoxSuggestions(context: QuoteContext, area: number): Suggestion[] {
  const suggestions: Suggestion[] = []

  // Model suggestion based on dimensions
  if (context.width && context.width >= 1.0 && context.width <= 1.2) {
    suggestions.push({
      field: 'model',
      value: 'FRONTAL',
      reason: 'Largura de 1,00-1,20m é ideal para box frontal com 1 ou 2 folhas',
      confidence: 'high',
    })
  }

  // Glass type suggestion
  if (!context.glassType) {
    suggestions.push({
      field: 'glassType',
      value: 'TEMPERADO',
      reason: 'Vidro temperado é obrigatório por norma (NBR 7199) e mais seguro para boxes',
      confidence: 'high',
    })
  }

  // Thickness suggestion for box
  if (area > 2.0 && !context.thickness) {
    suggestions.push({
      field: 'thickness',
      value: '10',
      reason: 'Para boxes grandes (>2m²), recomendamos 10mm para maior durabilidade',
      confidence: 'high',
    })
  } else if (!context.thickness) {
    suggestions.push({
      field: 'thickness',
      value: '8',
      reason: 'Espessura padrão para boxes residenciais, bom custo-benefício',
      confidence: 'medium',
    })
  }

  // Finish line suggestion
  if (!context.finish) {
    suggestions.push({
      field: 'finishLine',
      value: 'CROMADO',
      reason: 'Acabamento cromado é o mais popular e combina com qualquer decoração',
      confidence: 'medium',
      savingsOrBenefit: 'Melhor disponibilidade e preço',
    })
  }

  return suggestions
}

function getMirrorSuggestions(context: QuoteContext, area: number): Suggestion[] {
  const suggestions: Suggestion[] = []

  // Thickness based on area
  if (area > 2.0 && !context.thickness) {
    suggestions.push({
      field: 'thickness',
      value: '6',
      reason: 'Espelhos grandes (>2m²) precisam de 6mm para evitar distorção',
      confidence: 'high',
    })
  } else if (area <= 1.0 && !context.thickness) {
    suggestions.push({
      field: 'thickness',
      value: '4',
      reason: 'Para espelhos pequenos, 4mm é suficiente e mais econômico',
      confidence: 'medium',
      savingsOrBenefit: 'Economia de ~30%',
    })
  }

  // LED suggestion for bathrooms
  if (context.model === 'BANHEIRO') {
    suggestions.push({
      field: 'ledTemp',
      value: 'NEUTRO',
      reason: 'LED branco neutro (4000K) é ideal para banheiros - não altera cores',
      confidence: 'high',
    })
  }

  // Bisote suggestion for large mirrors
  if (area > 1.5) {
    suggestions.push({
      field: 'finish',
      value: 'BISOTE_1CM',
      reason: 'Bisotê de 1cm valoriza espelhos grandes e protege bordas',
      confidence: 'medium',
      savingsOrBenefit: 'Acabamento premium',
    })
  }

  return suggestions
}

function getDoorSuggestions(context: QuoteContext, area: number): Suggestion[] {
  const suggestions: Suggestion[] = []

  // Standard door dimensions warning
  if (context.height && context.height < 2.0) {
    suggestions.push({
      field: 'height',
      value: '2.10',
      reason: 'Altura padrão de porta é 2,10m - facilita instalação e acabamento',
      confidence: 'medium',
    })
  }

  // Handle suggestion based on door type
  if (context.model === 'PIVOTANTE') {
    suggestions.push({
      field: 'handleType',
      value: 'H_60',
      reason: 'Puxador H de 60cm é proporcionalmente adequado para portas pivotantes',
      confidence: 'high',
    })
  } else if (context.model === 'CORRER') {
    suggestions.push({
      field: 'handleType',
      value: 'EMBUTIDO',
      reason: 'Puxador embutido para porta de correr evita saliências e acidentes',
      confidence: 'high',
    })
  }

  // Lock type suggestion
  if (context.model !== 'ABRIR' && !context.lockType) {
    suggestions.push({
      field: 'lockType',
      value: 'CENTRAL',
      reason: 'Fechadura central (1520) é mais segura e durável',
      confidence: 'medium',
    })
  }

  // Glass type
  if (!context.glassType) {
    suggestions.push({
      field: 'glassType',
      value: 'TEMPERADO',
      reason: 'Obrigatório por norma (NBR 7199) para portas',
      confidence: 'high',
    })
  }

  return suggestions
}

function getWindowSuggestions(context: QuoteContext, area: number): Suggestion[] {
  const suggestions: Suggestion[] = []

  // Maxim-ar haste size
  if (context.model === 'MAXIM_AR' && context.width) {
    if (context.width <= 0.6) {
      suggestions.push({
        field: 'hasteSize',
        value: '30CM',
        reason: 'Para janelas pequenas (≤60cm), haste de 30cm é suficiente',
        confidence: 'high',
      })
    } else if (context.width <= 1.0) {
      suggestions.push({
        field: 'hasteSize',
        value: '40CM',
        reason: 'Para janelas médias, haste de 40cm oferece melhor abertura',
        confidence: 'high',
      })
    } else {
      suggestions.push({
        field: 'hasteSize',
        value: '50CM',
        reason: 'Para janelas grandes (>1m), haste de 50cm é recomendada',
        confidence: 'high',
      })
    }
  }

  // Glass texture for privacy
  if (context.glassType === 'IMPRESSO' && !context.glassTexture) {
    suggestions.push({
      field: 'glassTexture',
      value: 'CANELADO',
      reason: 'Vidro canelado oferece ótima privacidade mantendo luminosidade',
      confidence: 'medium',
    })
  }

  return suggestions
}

function getGuardRailSuggestions(context: QuoteContext, area: number): Suggestion[] {
  const suggestions: Suggestion[] = []

  // Always recommend laminated glass
  if (!context.glassType) {
    suggestions.push({
      field: 'glassType',
      value: 'LAMINADO',
      reason: 'Obrigatório por norma (NBR 7199) - fragmentos ficam aderidos em caso de quebra',
      confidence: 'high',
    })
  }

  // Minimum thickness
  if (!context.thickness) {
    suggestions.push({
      field: 'thickness',
      value: '10',
      reason: 'Guarda-corpo deve ter no mínimo 10mm (NBR 14718) para segurança',
      confidence: 'high',
    })
  }

  // Handrail recommendation for safety
  suggestions.push({
    field: 'hasHandrail',
    value: 'true',
    reason: 'Corrimão aumenta segurança e é exigido em alguns municípios',
    confidence: 'medium',
  })

  // Handrail type based on location
  if (context.hasHandrail) {
    suggestions.push({
      field: 'handrailType',
      value: 'INOX_50MM',
      reason: 'Corrimão inox Ø50mm atende NBR 9050 (acessibilidade) e é mais confortável',
      confidence: 'high',
    })
  }

  return suggestions
}

function getPergolaSuggestions(context: QuoteContext, area: number): Suggestion[] {
  const suggestions: Suggestion[] = []

  // Glass type for pergolas
  if (!context.glassType) {
    suggestions.push({
      field: 'glassType',
      value: 'LAMINADO',
      reason: 'Vidro laminado evita queda de fragmentos em coberturas',
      confidence: 'high',
    })
  }

  // Slope for drainage
  if (!context.pergolaSlope) {
    suggestions.push({
      field: 'pergolaSlope',
      value: '5%',
      reason: 'Inclinação mínima de 5% garante escoamento de água',
      confidence: 'high',
    })
  }

  // Structure material based on area
  if (area > 15 && !context.pergolaStructure) {
    suggestions.push({
      field: 'pergolaStructure',
      value: 'ACO',
      reason: 'Para áreas grandes (>15m²), estrutura de aço oferece melhor resistência',
      confidence: 'medium',
    })
  } else if (!context.pergolaStructure) {
    suggestions.push({
      field: 'pergolaStructure',
      value: 'ALUMINIO',
      reason: 'Alumínio é leve, não enferruja e tem ótimo custo-benefício',
      confidence: 'medium',
    })
  }

  return suggestions
}

function getShelfSuggestions(context: QuoteContext, area: number): Suggestion[] {
  const suggestions: Suggestion[] = []

  // Tempered glass for table tops
  if (context.shelfType === 'TAMPO' && !context.glassType) {
    suggestions.push({
      field: 'glassType',
      value: 'TEMPERADO',
      reason: 'Vidro temperado resiste a choque térmico (pratos quentes) e impacto',
      confidence: 'high',
    })
  }

  // Thickness based on span
  if (context.width && context.width > 1.0 && !context.thickness) {
    suggestions.push({
      field: 'thickness',
      value: '10',
      reason: 'Tampos/prateleiras com >1m de vão livre precisam de 10mm mínimo',
      confidence: 'high',
    })
  }

  // Support type for shelves
  if (context.shelfType === 'PRATELEIRA' && !context.shelfSupportType) {
    suggestions.push({
      field: 'shelfSupportType',
      value: 'INVISIVEL',
      reason: 'Suporte invisível dá aspecto flutuante e moderno à prateleira',
      confidence: 'medium',
      savingsOrBenefit: 'Visual clean e elegante',
    })
  }

  return suggestions
}

function getPartitionSuggestions(context: QuoteContext, area: number): Suggestion[] {
  const suggestions: Suggestion[] = []

  // System recommendation based on height
  if (context.height && context.height >= 2.5 && !context.partitionSystem) {
    suggestions.push({
      field: 'partitionSystem',
      value: 'PISO_TETO',
      reason: 'Para pé-direito alto (≥2,5m), sistema piso-teto oferece melhor estabilidade',
      confidence: 'high',
    })
  } else if (context.height && context.height < 2.0) {
    suggestions.push({
      field: 'partitionSystem',
      value: 'MEIA_ALTURA',
      reason: 'Divisória meia-altura para ambientes que precisam de ventilação/iluminação',
      confidence: 'medium',
    })
  }

  // Glass type for partitions
  if (area > 3.0 && !context.glassType) {
    suggestions.push({
      field: 'glassType',
      value: 'TEMPERADO',
      reason: 'Para divisórias grandes, vidro temperado oferece mais segurança',
      confidence: 'medium',
    })
  }

  return suggestions
}

function getClosureSuggestions(context: QuoteContext, area: number): Suggestion[] {
  const suggestions: Suggestion[] = []

  // System recommendation based on type
  if (context.closingType === 'VARANDA' && !context.closingSystem) {
    suggestions.push({
      field: 'closingSystem',
      value: 'CORTINA_VIDRO',
      reason: 'Cortina de vidro é ideal para varandas - abertura total quando desejado',
      confidence: 'high',
    })
  }

  if (context.closingType === 'PISCINA' && !context.closingSystem) {
    suggestions.push({
      field: 'closingSystem',
      value: 'CAIXILHO_FIXO',
      reason: 'Caixilho fixo para piscina oferece segurança permanente',
      confidence: 'high',
    })
  }

  // Glass type for closures
  if (!context.glassType) {
    suggestions.push({
      field: 'glassType',
      value: 'TEMPERADO',
      reason: 'Vidro temperado é recomendado para áreas externas e de circulação',
      confidence: 'high',
    })
  }

  return suggestions
}

// ============================================================================
// UNIVERSAL SUGGESTIONS
// ============================================================================

function getThicknessSuggestions(context: QuoteContext, area: number): Suggestion[] {
  const suggestions: Suggestion[] = []

  // Area-based thickness
  if (area <= 0.5) {
    suggestions.push({
      field: 'thickness',
      value: '4',
      reason: 'Área pequena (≤0,5m²) - 4mm é suficiente e econômico',
      confidence: 'medium',
      savingsOrBenefit: 'Economia de 25-35%',
    })
  } else if (area <= 1.5) {
    suggestions.push({
      field: 'thickness',
      value: '6',
      reason: 'Área média (0,5-1,5m²) - 6mm oferece bom equilíbrio',
      confidence: 'medium',
    })
  } else if (area <= 3.0) {
    suggestions.push({
      field: 'thickness',
      value: '8',
      reason: 'Área grande (1,5-3m²) - 8mm recomendado',
      confidence: 'medium',
    })
  } else {
    suggestions.push({
      field: 'thickness',
      value: '10',
      reason: 'Área muito grande (>3m²) - 10mm+ necessário por segurança',
      confidence: 'high',
    })
  }

  return suggestions
}

function getColorHarmonySuggestions(context: QuoteContext): Suggestion[] {
  const suggestions: Suggestion[] = []

  // Harmonize hardware color with glass/mirror color
  if (context.color === 'BRONZE' && context.category === 'ESPELHOS') {
    suggestions.push({
      field: 'finish',
      value: 'BISOTE_1CM',
      reason: 'Bisotê valoriza espelhos bronze e destaca a cor',
      confidence: 'low',
      savingsOrBenefit: 'Acabamento premium',
    })
  }

  return suggestions
}

function getCostOptimizationSuggestions(context: QuoteContext, area: number): Suggestion[] {
  const suggestions: Suggestion[] = []

  // Suggest standard dimensions when close
  if (context.width && context.width > 0.95 && context.width < 1.05) {
    suggestions.push({
      field: 'width',
      value: '1.00',
      reason: 'Ajustar para largura padrão 1,00m pode reduzir desperdício',
      confidence: 'low',
      savingsOrBenefit: 'Possível economia de 10-15%',
    })
  }

  if (context.height && context.height > 2.05 && context.height < 2.15) {
    suggestions.push({
      field: 'height',
      value: '2.10',
      reason: 'Altura padrão 2,10m aproveita melhor as chapas de vidro',
      confidence: 'low',
      savingsOrBenefit: 'Reduz desperdício',
    })
  }

  return suggestions
}

// ============================================================================
// SUGGESTION FILTERING & RANKING
// ============================================================================

/**
 * Filter suggestions by confidence level
 */
export function filterSuggestionsByConfidence(
  suggestions: Suggestion[],
  minConfidence: 'low' | 'medium' | 'high' = 'medium'
): Suggestion[] {
  const confidenceOrder = { low: 0, medium: 1, high: 2 }
  const minLevel = confidenceOrder[minConfidence]

  return suggestions.filter((s) => confidenceOrder[s.confidence] >= minLevel)
}

/**
 * Get top N suggestions sorted by confidence
 */
export function getTopSuggestions(suggestions: Suggestion[], limit: number = 3): Suggestion[] {
  const confidenceOrder = { high: 3, medium: 2, low: 1 }

  return [...suggestions]
    .sort((a, b) => confidenceOrder[b.confidence] - confidenceOrder[a.confidence])
    .slice(0, limit)
}

/**
 * Check if field already has a value (don't suggest if user already set it)
 */
export function filterAlreadySetFields(
  suggestions: Suggestion[],
  context: QuoteContext
): Suggestion[] {
  return suggestions.filter((suggestion) => {
    const fieldValue = context[suggestion.field as keyof QuoteContext]
    return !fieldValue || fieldValue === ''
  })
}
