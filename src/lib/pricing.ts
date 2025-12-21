/**
 * AI-CHAT Sprint P3.4: Price Estimation Utility
 *
 * Utilities for estimating product prices based on dimensions,
 * materials, and options. Used by AI chat to provide approximate
 * price ranges to customers.
 *
 * IMPORTANT: These are ESTIMATES only. Final prices are set by admin
 * after technical visit and detailed measurement.
 */

import { Decimal } from '@prisma/client/runtime/library'

export interface PriceEstimateInput {
  category: string
  width?: number // meters
  height?: number // meters
  quantity?: number
  glassType?: string
  thickness?: string
  finish?: string
  color?: string
  hasLed?: boolean
  hasBisote?: boolean
}

export interface PriceBreakdown {
  material: number
  installation: number
  hardware: number
  finish: number
  subtotal: number
  discount: number
  total: number
}

export interface PriceEstimate {
  min: number
  max: number
  estimated: number
  unit: 'total' | 'm2' | 'unidade'
  confidence: 'low' | 'medium' | 'high'
  notes: string[]
  breakdown?: PriceBreakdown
}

/**
 * Base prices per m² for different glass types (in BRL)
 * Updated: Dec 2024
 */
const GLASS_PRICES_PER_M2: Record<string, number> = {
  // Vidros temperados
  'temperado-8mm': 250,
  'temperado-10mm': 320,
  'temperado-12mm': 380,

  // Vidros laminados
  'laminado-8mm': 350,
  'laminado-10mm': 420,

  // Espelhos
  'espelho-4mm': 180,
  'espelho-6mm': 220,

  // Default
  default: 250,
}

/**
 * Multipliers for different finishes and options
 */
const FINISH_MULTIPLIERS: Record<string, number> = {
  'bisote-10mm': 1.25,
  'bisote-20mm': 1.35,
  lapidado: 1.15,
  jateado: 1.2,
  serigrafado: 1.3,
  antireflexo: 1.4,
}

const COLOR_MULTIPLIERS: Record<string, number> = {
  incolor: 1.0,
  fume: 1.1,
  bronze: 1.12,
  verde: 1.12,
  azul: 1.15,
  preto: 1.2,
}

/**
 * Installation cost multipliers by category (% of material cost)
 * MELHORIAS Sprint M2: Added for detailed breakdown
 */
const INSTALLATION_MULTIPLIERS: Record<string, number> = {
  BOX: 0.45, // 45% of material (complex installation)
  PORTAS: 0.5, // 50% (requires alignment, hinges)
  JANELAS: 0.4,
  GUARDA_CORPO: 0.55, // 55% (safety critical)
  ESPELHOS: 0.3, // 30% (simpler installation)
  TAMPOS_PRATELEIRAS: 0.25,
  DIVISORIAS: 0.35,
  VIDROS: 0.2,
  FECHAMENTOS: 0.4,
  PERGOLADOS: 0.6, // 60% (complex structural)
  FACHADAS: 0.7, // 70% (complex facades with engineering)
  PAINEIS_DECORATIVOS: 0.35, // 35% (decorative panels)
  CORTINAS_VIDRO: 0.5, // 50% (glass curtain systems)
  KITS: 0.0, // 0% (hardware kits, DIY or separate service)
  FERRAGENS: 0.0, // 0% (hardware items only)
  SERVICOS: 1.0, // 100% (labor is the service)
  default: 0.35,
}

/**
 * Hardware base costs by category (in BRL)
 * MELHORIAS Sprint M2: Added for detailed breakdown
 */
const HARDWARE_COSTS: Record<string, { min: number; max: number }> = {
  BOX: { min: 300, max: 800 }, // Trilhos, puxadores, travas
  PORTAS: { min: 400, max: 1200 }, // Dobradiças, fechaduras, puxadores
  JANELAS: { min: 250, max: 600 },
  GUARDA_CORPO: { min: 200, max: 500 }, // Fixações, corrimão
  ESPELHOS: { min: 50, max: 150 }, // Suportes, colagem
  TAMPOS_PRATELEIRAS: { min: 80, max: 200 }, // Suportes
  DIVISORIAS: { min: 150, max: 400 }, // Perfis, fixações
  VIDROS: { min: 30, max: 100 }, // Baguetes, silicone
  FECHAMENTOS: { min: 500, max: 1500 }, // Perfis, vedações
  PERGOLADOS: { min: 800, max: 2000 }, // Estrutura, fixações
  FACHADAS: { min: 1000, max: 3000 }, // Perfis, fixadores, silicone estrutural
  PAINEIS_DECORATIVOS: { min: 100, max: 300 }, // Suportes, colagem
  CORTINAS_VIDRO: { min: 600, max: 1500 }, // Perfis, roldanas, trilhos
  KITS: { min: 0, max: 0 }, // Já incluso no produto
  FERRAGENS: { min: 0, max: 0 }, // Já é a ferragem
  SERVICOS: { min: 0, max: 0 }, // Sem ferragens
  default: { min: 100, max: 300 },
}

/**
 * Category-specific base prices (for items sold per unit, not m²)
 */
const CATEGORY_BASE_PRICES: Record<string, { min: number; max: number }> = {
  BOX: { min: 1200, max: 2800 },
  PORTAS: { min: 1500, max: 4000 },
  JANELAS: { min: 800, max: 2500 },
  GUARDA_CORPO: { min: 450, max: 800 }, // per linear meter
  ESPELHOS: { min: 150, max: 400 }, // per m²
  TAMPOS_PRATELEIRAS: { min: 200, max: 500 }, // per m²
  DIVISORIAS: { min: 300, max: 600 }, // per m²
  VIDROS: { min: 180, max: 450 }, // per m²
  FACHADAS: { min: 800, max: 2500 }, // per m² - varies by system type
  PAINEIS_DECORATIVOS: { min: 280, max: 900 }, // per m² - painted/mirror panels
  FECHAMENTOS: { min: 600, max: 1200 }, // per m² - enclosures
  CORTINAS_VIDRO: { min: 700, max: 1400 }, // per m² - glass curtains
  PERGOLADOS: { min: 800, max: 1800 }, // per m² - pergolas/covers
  KITS: { min: 30, max: 800 }, // per unit - hardware kits
  FERRAGENS: { min: 50, max: 1200 }, // per unit - hardware items
  SERVICOS: { min: 0, max: 500 }, // per unit - services
}

/**
 * Calculate area from dimensions
 */
function calculateArea(width?: number, height?: number): number | null {
  if (!width || !height) return null
  if (width <= 0 || height <= 0) return null
  if (width > 20 || height > 20) return null // Sanity check
  return width * height
}

/**
 * Get glass price per m² based on type and thickness
 */
function getGlassPricePerM2(glassType?: string, thickness?: string): number {
  const key = `${glassType?.toLowerCase() || 'temperado'}-${thickness || '8mm'}`
  return GLASS_PRICES_PER_M2[key] || GLASS_PRICES_PER_M2['default']
}

/**
 * Calculate finish multiplier
 */
function getFinishMultiplier(finish?: string, hasBisote?: boolean): number {
  let multiplier = 1.0

  if (finish) {
    const finishKey = finish.toLowerCase()
    for (const [key, value] of Object.entries(FINISH_MULTIPLIERS)) {
      if (finishKey.includes(key)) {
        multiplier *= value
        break
      }
    }
  }

  if (hasBisote) {
    multiplier *= 1.25 // Default bisote multiplier
  }

  return multiplier
}

/**
 * Calculate color multiplier
 */
function getColorMultiplier(color?: string): number {
  if (!color) return 1.0

  const colorKey = color.toLowerCase()
  for (const [key, value] of Object.entries(COLOR_MULTIPLIERS)) {
    if (colorKey.includes(key)) {
      return value
    }
  }

  return 1.0
}

/**
 * Main price estimation function
 *
 * Returns a price range (min/max) and estimated value based on:
 * - Product category
 * - Dimensions (area calculation)
 * - Glass type and thickness
 * - Finishes and options
 * - Quantity
 */
export function estimatePrice(input: PriceEstimateInput): PriceEstimate {
  const {
    category,
    width,
    height,
    quantity = 1,
    glassType,
    thickness,
    finish,
    color,
    hasLed,
    hasBisote,
  } = input

  const notes: string[] = []
  let min = 0
  let max = 0
  let estimated = 0
  let unit: 'total' | 'm2' | 'unidade' = 'total'
  let confidence: 'low' | 'medium' | 'high' = 'medium'
  let breakdown: PriceBreakdown | undefined

  // Get category base prices
  const categoryPrices = CATEGORY_BASE_PRICES[category] || CATEGORY_BASE_PRICES['VIDROS']

  // Calculate area if dimensions provided
  const area = calculateArea(width, height)

  if (area) {
    // Categories priced per m²
    if (['ESPELHOS', 'TAMPOS_PRATELEIRAS', 'DIVISORIAS', 'VIDROS'].includes(category)) {
      const pricePerM2 = getGlassPricePerM2(glassType, thickness)
      const finishMultiplier = getFinishMultiplier(finish, hasBisote)
      const colorMultiplier = getColorMultiplier(color)

      // MELHORIAS M2: Detailed breakdown calculation
      const materialCost = pricePerM2 * area * colorMultiplier
      const finishCost = hasBisote || finish ? materialCost * (finishMultiplier - 1) : 0
      const installMultiplier =
        INSTALLATION_MULTIPLIERS[category] || INSTALLATION_MULTIPLIERS['default']
      const installationCost = materialCost * installMultiplier
      const hardwareCosts = HARDWARE_COSTS[category] || HARDWARE_COSTS['default']
      const hardwareCost = (hardwareCosts.min + hardwareCosts.max) / 2

      let subtotal = materialCost + finishCost + installationCost + hardwareCost

      // LED adds fixed cost for mirrors
      if (hasLed && category === 'ESPELHOS') {
        subtotal += 300 // LED system cost
        notes.push('Inclui sistema LED')
      }

      breakdown = {
        material: Math.round(materialCost),
        finish: Math.round(finishCost),
        installation: Math.round(installationCost),
        hardware: Math.round(hardwareCost),
        subtotal: Math.round(subtotal),
        discount: 0,
        total: Math.round(subtotal),
      }

      // Calculate range (±15%)
      min = Math.round(subtotal * 0.85)
      max = Math.round(subtotal * 1.15)
      estimated = Math.round(subtotal)

      unit = 'm2'
      confidence = 'high'

      notes.push(`Área: ${area.toFixed(2)}m²`)
      notes.push(`Base: R$ ${pricePerM2}/m²`)

      if (finishMultiplier > 1.0) {
        notes.push(`Acabamento: +${Math.round((finishMultiplier - 1) * 100)}%`)
      }
    }
    // Categories priced per unit (BOX, PORTAS, etc)
    else {
      const baseMin = categoryPrices.min
      const baseMax = categoryPrices.max

      // Area factor (larger items cost more)
      const areaFactor = Math.min(1 + (area - 2) * 0.1, 1.5) // Max 50% increase

      const adjustedMin = baseMin * areaFactor
      const adjustedMax = baseMax * areaFactor
      const avgPrice = (adjustedMin + adjustedMax) / 2

      // MELHORIAS M2: Breakdown for unit-based items
      const materialCost = avgPrice * 0.45 // 45% material
      const installMultiplier =
        INSTALLATION_MULTIPLIERS[category] || INSTALLATION_MULTIPLIERS['default']
      const installationCost = materialCost * installMultiplier
      const hardwareCosts = HARDWARE_COSTS[category] || HARDWARE_COSTS['default']
      const hardwareCost = (hardwareCosts.min + hardwareCosts.max) / 2
      const finishCost = avgPrice * 0.1 // 10% finishing

      const subtotal = materialCost + installationCost + hardwareCost + finishCost

      breakdown = {
        material: Math.round(materialCost),
        finish: Math.round(finishCost),
        installation: Math.round(installationCost),
        hardware: Math.round(hardwareCost),
        subtotal: Math.round(subtotal),
        discount: 0,
        total: Math.round(subtotal),
      }

      min = Math.round(adjustedMin)
      max = Math.round(adjustedMax)
      estimated = Math.round(avgPrice)

      unit = 'unidade'
      confidence = 'medium'

      notes.push(`Área aproximada: ${area.toFixed(2)}m²`)
      notes.push('Preço varia com ferragens e acabamentos')

      if (category === 'BOX' && finish?.toLowerCase().includes('elegance')) {
        const eleganceMultiplier = 1.25
        min = Math.round(min * eleganceMultiplier)
        max = Math.round(max * eleganceMultiplier)
        estimated = Math.round(estimated * eleganceMultiplier)
        if (breakdown) {
          breakdown.total = Math.round(breakdown.total * eleganceMultiplier)
          breakdown.subtotal = breakdown.total
        }
        notes.push('Linha Premium Elegance (+25%)')
      }
    }
  } else {
    // No dimensions - use category base prices
    min = categoryPrices.min
    max = categoryPrices.max
    estimated = Math.round((min + max) / 2)
    unit = 'unidade'
    confidence = 'low'

    notes.push('Sem medidas exatas - estimativa aproximada')
    notes.push('Recomenda-se visita técnica para precisão')
  }

  // Apply quantity
  if (quantity > 1) {
    // Discount for multiple units (5% off for 2+, 10% off for 3+)
    const quantityDiscount = quantity >= 3 ? 0.9 : quantity >= 2 ? 0.95 : 1.0
    const discountAmount = 1.0 - quantityDiscount

    // MELHORIAS M2: Update breakdown with quantity
    if (breakdown) {
      breakdown.material = Math.round(breakdown.material * quantity)
      breakdown.finish = Math.round(breakdown.finish * quantity)
      breakdown.installation = Math.round(breakdown.installation * quantity)
      breakdown.hardware = Math.round(breakdown.hardware * quantity)
      breakdown.subtotal = Math.round(breakdown.subtotal * quantity)

      const totalDiscount = Math.round(breakdown.subtotal * discountAmount)
      breakdown.discount = totalDiscount
      breakdown.total = breakdown.subtotal - totalDiscount
    }

    min = Math.round(min * quantity * quantityDiscount)
    max = Math.round(max * quantity * quantityDiscount)
    estimated = Math.round(estimated * quantity * quantityDiscount)

    notes.push(`Quantidade: ${quantity} unidade(s)`)

    if (quantityDiscount < 1.0) {
      notes.push(`Desconto por volume: ${Math.round(discountAmount * 100)}%`)
    }
  }

  // Add general notes
  notes.push('⚠️ VALORES APROXIMADOS - sujeitos a alteração')
  notes.push('Visita técnica gratuita para orçamento preciso')

  return {
    min,
    max,
    estimated,
    unit,
    confidence,
    notes,
    breakdown,
  }
}

/**
 * Format price estimate for display
 * MELHORIAS M2: Enhanced with breakdown display
 */
export function formatPriceEstimate(estimate: PriceEstimate): string {
  const { min, max, estimated, unit, confidence, notes, breakdown } = estimate

  const priceRange = `R$ ${min.toLocaleString('pt-BR')} - R$ ${max.toLocaleString('pt-BR')}`
  const estimatedValue = `R$ ${estimated.toLocaleString('pt-BR')}`

  let output = `💰 Estimativa de Preço:\n`
  output += `   Faixa: ${priceRange}\n`
  output += `   Estimado: ${estimatedValue}`

  if (unit === 'm2') {
    output += ' (total)\n'
  } else {
    output += '\n'
  }

  output += `   Confiança: ${confidence === 'high' ? '🟢 Alta' : confidence === 'medium' ? '🟡 Média' : '🔴 Baixa'}\n`

  // MELHORIAS M2: Display breakdown if available
  if (breakdown) {
    output += `\n📊 Detalhamento:\n`
    output += `   • Material: R$ ${breakdown.material.toLocaleString('pt-BR')}\n`
    if (breakdown.finish > 0) {
      output += `   • Acabamento: R$ ${breakdown.finish.toLocaleString('pt-BR')}\n`
    }
    output += `   • Instalação: R$ ${breakdown.installation.toLocaleString('pt-BR')}\n`
    output += `   • Ferragens: R$ ${breakdown.hardware.toLocaleString('pt-BR')}\n`
    output += `   • Subtotal: R$ ${breakdown.subtotal.toLocaleString('pt-BR')}\n`
    if (breakdown.discount > 0) {
      output += `   • Desconto: -R$ ${breakdown.discount.toLocaleString('pt-BR')}\n`
    }
    output += `   • Total: R$ ${breakdown.total.toLocaleString('pt-BR')}\n`
  }

  if (notes.length > 0) {
    output += `\n📝 Observações:\n`
    notes.forEach((note) => {
      output += `   • ${note}\n`
    })
  }

  return output
}

/**
 * Convert Prisma Decimal to number
 */
export function decimalToNumber(decimal: Decimal | null | undefined): number | undefined {
  if (!decimal) return undefined
  return parseFloat(decimal.toString())
}

/**
 * Get price range for a specific product from DB
 * (to be used with actual Product records)
 */
export function getProductPriceRange(
  basePrice?: Decimal | null,
  priceRangeMin?: Decimal | null,
  priceRangeMax?: Decimal | null
): { min: number; max: number } | null {
  if (basePrice) {
    const price = decimalToNumber(basePrice)
    if (price) {
      return {
        min: Math.round(price * 0.9),
        max: Math.round(price * 1.1),
      }
    }
  }

  if (priceRangeMin && priceRangeMax) {
    const min = decimalToNumber(priceRangeMin)
    const max = decimalToNumber(priceRangeMax)
    if (min && max) {
      return { min, max }
    }
  }

  return null
}
