/**
 * NBR Validations - Brazilian Technical Standards for Glass
 *
 * This module implements validations and recommendations based on ABNT NBR standards:
 * - NBR 14718: Glass in Civil Construction - Design Requirements
 * - NBR 16259: Tempered Glass Requirements
 * - NBR 7199: Safety Glass Design
 * - NBR 14488: Safety Glass - Thickness Calculation
 */

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export interface ThicknessRecommendation {
  minThickness: number
  recommendedThickness: number
  maxThickness?: number
  warning?: string
  nbrReference: string
  reason: string
}

export interface ValidationResult {
  valid: boolean
  severity: 'info' | 'warning' | 'error'
  message: string
  nbrReference?: string
  recommendation?: string
}

export interface GlassDimensions {
  width: number
  height: number
  thickness?: number
}

export type GlassApplication =
  | 'JANELA'
  | 'PORTA'
  | 'BOX'
  | 'GUARDA_CORPO'
  | 'COBERTURA'
  | 'TAMPO'
  | 'DIVISORIA'
  | 'FACHADA'
  | 'ESPELHOS'
  | 'CORTINAS_VIDRO'
  | 'FECHAMENTOS'
  | 'PERGOLADOS'
  | 'VIDROS'
  | 'TAMPOS_PRATELEIRAS'

/**
 * Categorias que são tipicamente para áreas EXTERNAS (sujeitas a vento)
 * Zona de vento afeta significativamente o cálculo de espessura
 */
export const EXTERNAL_APPLICATIONS: GlassApplication[] = [
  'FACHADA',
  'COBERTURA',
  'JANELA',
  'GUARDA_CORPO', // Pode ser externo (sacada) ou interno (mezanino)
  'CORTINAS_VIDRO', // Fechamento de sacadas - externo
  'FECHAMENTOS', // Geralmente externo
  'PERGOLADOS', // Externo
]

/**
 * Categorias que são tipicamente para áreas INTERNAS (sem vento)
 * Zona de vento NÃO afeta o cálculo - usa fator fixo mínimo
 */
export const INTERNAL_APPLICATIONS: GlassApplication[] = [
  'BOX', // Banheiro - interno
  'DIVISORIA', // Escritório - interno
  'TAMPO', // Mesa - interno
  'PORTA', // Geralmente interna
  'ESPELHOS', // Interno
  'VIDROS', // Depende, mas geralmente interno
  'TAMPOS_PRATELEIRAS', // Interno
]

/**
 * Verifica se a aplicação é tipicamente externa (sujeita a vento)
 */
export function isExternalApplication(application: GlassApplication): boolean {
  return EXTERNAL_APPLICATIONS.includes(application)
}

// ============================================================================
// CONSTANTS - NBR STANDARDS
// ============================================================================

/**
 * NBR 14718 - Maximum dimensions for tempered glass
 * Based on thickness and support type
 */
const NBR_14718_MAX_DIMENSIONS = {
  4: { maxArea: 1.5, maxSide: 1.5 }, // 4mm: max 1.5m²
  5: { maxArea: 2.0, maxSide: 2.0 }, // 5mm: max 2.0m²
  6: { maxArea: 3.0, maxSide: 2.5 }, // 6mm: max 3.0m²
  8: { maxArea: 4.5, maxSide: 3.0 }, // 8mm: max 4.5m²
  10: { maxArea: 6.0, maxSide: 3.5 }, // 10mm: max 6.0m²
  12: { maxArea: 8.0, maxSide: 4.0 }, // 12mm: max 8.0m²
  15: { maxArea: 10.0, maxSide: 4.5 }, // 15mm: max 10.0m²
  19: { maxArea: 12.0, maxSide: 5.0 }, // 19mm: max 12.0m²
} as const

/**
 * NBR 16259 - Wind load resistance
 * Minimum thickness based on wind pressure zones
 */
const NBR_16259_WIND_ZONES = {
  1: 1.0, // Low wind (inland areas)
  2: 1.3, // Medium wind (coastal areas 50km+)
  3: 1.6, // High wind (coastal areas <50km)
  4: 2.0, // Very high wind (coast exposed)
} as const

/**
 * NBR 7199 - Safety glass requirements
 * Applications that require tempered or laminated glass
 */
export const NBR_7199_SAFETY_REQUIRED = {
  PORTA: true,
  BOX: true, // Área molhada + risco de choque térmico
  GUARDA_CORPO: true, // Segurança contra queda
  COBERTURA: true, // Fragmentos podem cair
  FACHADA: true, // Altura + vento
  CORTINAS_VIDRO: true, // Fechamento de sacadas - externo
  FECHAMENTOS: true, // Geralmente externo
  PERGOLADOS: true, // Cobertura - fragmentos podem cair
  JANELA: false, // Only if > 1.5m from floor
  TAMPO: false, // Depende do uso
  DIVISORIA: false, // Geralmente não obrigatório
  ESPELHOS: false, // Interno, não estrutural
  VIDROS: false, // Depende da aplicação específica
  TAMPOS_PRATELEIRAS: false, // Interno
} as const

/**
 * NBR 14488 - Thickness calculation factors
 * Based on aspect ratio and support conditions
 */
const NBR_14488_ASPECT_RATIO_FACTOR = {
  '1.0': 1.0, // Square
  '1.5': 1.15,
  '2.0': 1.3,
  '2.5': 1.45,
  '3.0': 1.6,
  '4.0': 1.8,
  '5.0': 2.0,
} as const

// ============================================================================
// THICKNESS CALCULATION - NBR 14488
// ============================================================================

/**
 * Calculate minimum glass thickness based on NBR 14488
 *
 * Formula: t = k * √(q * a² / σ)
 * Where:
 * - t = thickness (mm)
 * - k = coefficient based on aspect ratio and support
 * - q = distributed load (kN/m²) - wind pressure (ONLY for external applications)
 * - a = smaller dimension (m)
 * - σ = allowable stress (MPa) - 24 MPa for tempered glass
 *
 * IMPORTANTE: Zona de vento só é considerada para ÁREAS EXTERNAS.
 * Áreas internas (BOX, DIVISÓRIA, TAMPO, etc.) usam fator fixo mínimo.
 *
 * @param dimensions - Width and height in meters
 * @param application - Type of glass application
 * @param windZone - Wind zone (1-4) - IGNORED for internal applications
 * @returns Thickness recommendation with NBR reference
 */
export function calculateThickness(
  dimensions: GlassDimensions,
  application: GlassApplication,
  windZone: number = 2
): ThicknessRecommendation {
  const { width, height } = dimensions
  const area = width * height

  // Calculate aspect ratio
  const longerSide = Math.max(width, height)
  const shorterSide = Math.min(width, height)
  const aspectRatio = longerSide / shorterSide

  // Get aspect ratio factor (k)
  const kFactor = getAspectRatioFactor(aspectRatio)

  // Determina se é área externa (sujeita a vento) ou interna
  const isExternal = isExternalApplication(application)

  // Get load factor:
  // - EXTERNO: usa zona de vento da região (NBR 16259)
  // - INTERNO: usa fator mínimo de 0.5 kN/m² (apenas peso próprio + uso normal)
  const loadFactor = isExternal
    ? NBR_16259_WIND_ZONES[windZone as keyof typeof NBR_16259_WIND_ZONES] || 1.3
    : 0.5 // Áreas internas: carga reduzida (sem vento)

  // Allowable stress for tempered glass (σ) - 24 MPa per NBR 7199
  const allowableStress = 24

  // Calculate minimum thickness using simplified formula
  // t = k * √((q * a²) / σ)
  const calculatedThickness =
    kFactor * Math.sqrt((loadFactor * Math.pow(shorterSide, 2)) / allowableStress)

  // Round up to nearest available thickness
  const minThickness = roundToAvailableThickness(calculatedThickness)

  // Get recommended thickness (usually one step above minimum for safety)
  const recommendedThickness = getRecommendedThickness(minThickness, application, area)

  // Determine warnings
  let warning: string | undefined
  const maxDimensions =
    NBR_14718_MAX_DIMENSIONS[recommendedThickness as keyof typeof NBR_14718_MAX_DIMENSIONS]

  if (maxDimensions && (area > maxDimensions.maxArea || longerSide > maxDimensions.maxSide)) {
    warning = `Dimensões excedem limites da NBR 14718 para vidro ${recommendedThickness}mm. Considere vidro laminado.`
  }

  if (aspectRatio > 5.0) {
    warning = `Proporção muito alongada (${aspectRatio.toFixed(1)}:1). Recomendamos avaliação estrutural.`
  }

  // Build reason text based on application type
  const reasonText = isExternal
    ? `Área externa - cálculo com zona de vento ${windZone} (NBR 16259). Área ${area.toFixed(2)}m², proporção ${aspectRatio.toFixed(1)}:1`
    : `Área interna - sem fator de vento. Área ${area.toFixed(2)}m², proporção ${aspectRatio.toFixed(1)}:1`

  return {
    minThickness,
    recommendedThickness,
    warning,
    nbrReference: isExternal ? 'NBR 14488, NBR 14718, NBR 16259' : 'NBR 14488, NBR 14718',
    reason: reasonText,
  }
}

/**
 * Get aspect ratio factor (k) based on NBR 14488
 */
function getAspectRatioFactor(ratio: number): number {
  if (ratio <= 1.0) return 1.0
  if (ratio <= 1.5) return 1.15
  if (ratio <= 2.0) return 1.3
  if (ratio <= 2.5) return 1.45
  if (ratio <= 3.0) return 1.6
  if (ratio <= 4.0) return 1.8
  return 2.0 // ratio > 4.0
}

/**
 * Round calculated thickness to nearest available commercial thickness
 */
function roundToAvailableThickness(calculated: number): number {
  const availableThicknesses = [4, 5, 6, 8, 10, 12, 15, 19]

  for (const thickness of availableThicknesses) {
    if (calculated <= thickness) {
      return thickness
    }
  }

  return 19 // Maximum standard thickness
}

/**
 * Get recommended thickness (safety margin above minimum)
 */
function getRecommendedThickness(
  minThickness: number,
  application: GlassApplication,
  area: number
): number {
  const availableThicknesses = [4, 5, 6, 8, 10, 12, 15, 19]
  const minIndex = availableThicknesses.indexOf(minThickness)

  // Safety-critical applications: recommend +1 step
  if (application === 'GUARDA_CORPO' || application === 'COBERTURA') {
    const safeIndex = Math.min(minIndex + 1, availableThicknesses.length - 1)
    return availableThicknesses[safeIndex]
  }

  // Large areas: recommend +1 step for stability
  if (area > 3.0) {
    const safeIndex = Math.min(minIndex + 1, availableThicknesses.length - 1)
    return availableThicknesses[safeIndex]
  }

  // Standard applications: minimum is ok
  return minThickness
}

// ============================================================================
// DIMENSION VALIDATIONS
// ============================================================================

/**
 * Validate if glass dimensions are within NBR 14718 limits
 *
 * @param dimensions - Width, height, and thickness
 * @param application - Type of application
 * @returns Validation result with recommendations
 */
export function validateDimensions(
  dimensions: GlassDimensions,
  application: GlassApplication
): ValidationResult {
  const { width, height, thickness } = dimensions
  const area = width * height
  const longerSide = Math.max(width, height)

  if (!thickness) {
    return {
      valid: false,
      severity: 'error',
      message: 'Espessura não especificada',
      recommendation: 'Selecione a espessura do vidro',
    }
  }

  // Check NBR 14718 limits
  const limits = NBR_14718_MAX_DIMENSIONS[thickness as keyof typeof NBR_14718_MAX_DIMENSIONS]

  if (!limits) {
    return {
      valid: false,
      severity: 'error',
      message: 'Espessura fora do padrão',
      nbrReference: 'NBR 14718',
      recommendation: 'Use espessura entre 4mm e 19mm',
    }
  }

  // Validate area
  if (area > limits.maxArea) {
    return {
      valid: false,
      severity: 'error',
      message: `Área ${area.toFixed(2)}m² excede o limite de ${limits.maxArea}m² para vidro ${thickness}mm`,
      nbrReference: 'NBR 14718',
      recommendation: `Use vidro mais espesso ou considere laminado. Área máxima: ${limits.maxArea}m²`,
    }
  }

  // Validate side length
  if (longerSide > limits.maxSide) {
    return {
      valid: false,
      severity: 'error',
      message: `Lado de ${longerSide.toFixed(2)}m excede o limite de ${limits.maxSide}m para vidro ${thickness}mm`,
      nbrReference: 'NBR 14718',
      recommendation: `Use vidro mais espesso ou divida em painéis menores. Lado máximo: ${limits.maxSide}m`,
    }
  }

  // Warning for dimensions near limits
  if (area > limits.maxArea * 0.85 || longerSide > limits.maxSide * 0.9) {
    return {
      valid: true,
      severity: 'warning',
      message: 'Dimensões próximas ao limite da norma',
      nbrReference: 'NBR 14718',
      recommendation: 'Considere usar espessura maior para maior segurança',
    }
  }

  return {
    valid: true,
    severity: 'info',
    message: 'Dimensões dentro das normas',
    nbrReference: 'NBR 14718',
  }
}

// ============================================================================
// SAFETY VALIDATIONS - NBR 7199
// ============================================================================

/**
 * Validate if tempered/safety glass is required for the application
 *
 * @param application - Type of application
 * @param heightFromFloor - Height from floor in meters (for windows)
 * @returns Validation result
 */
export function validateSafetyRequirement(
  application: GlassApplication,
  heightFromFloor: number = 0
): ValidationResult {
  // Check if application requires safety glass
  const requiresSafety = NBR_7199_SAFETY_REQUIRED[application]

  if (requiresSafety) {
    return {
      valid: true,
      severity: 'info',
      message: 'Vidro temperado ou laminado obrigatório',
      nbrReference: 'NBR 7199',
      recommendation: 'Use vidro temperado ou laminado para esta aplicação',
    }
  }

  // Special case: Windows near floor
  if (application === 'JANELA' && heightFromFloor < 1.5) {
    return {
      valid: true,
      severity: 'warning',
      message: 'Janela a menos de 1,5m do piso - vidro de segurança recomendado',
      nbrReference: 'NBR 7199',
      recommendation: 'Use vidro temperado ou laminado para janelas baixas',
    }
  }

  return {
    valid: true,
    severity: 'info',
    message: 'Vidro de segurança não obrigatório',
    nbrReference: 'NBR 7199',
  }
}

// ============================================================================
// GLASS TYPE RECOMMENDATIONS
// ============================================================================

/**
 * Get recommended glass type based on application and dimensions
 *
 * @param application - Type of application
 * @param dimensions - Dimensions of the glass
 * @returns Recommended glass types with explanations
 */
export function getGlassTypeRecommendations(
  application: GlassApplication,
  dimensions: GlassDimensions
): Array<{ type: string; reason: string; nbrReference?: string }> {
  const recommendations: Array<{ type: string; reason: string; nbrReference?: string }> = []
  const area = dimensions.width * dimensions.height

  switch (application) {
    case 'BOX':
      recommendations.push({
        type: 'TEMPERADO',
        reason: 'Obrigatório por norma - resistência a choque térmico e impacto',
        nbrReference: 'NBR 7199',
      })
      if (area > 2.0) {
        recommendations.push({
          type: 'LAMINADO',
          reason: 'Recomendado para áreas grandes - maior segurança em caso de quebra',
          nbrReference: 'NBR 14718',
        })
      }
      break

    case 'GUARDA_CORPO':
      recommendations.push({
        type: 'LAMINADO',
        reason: 'Obrigatório por norma - fragmentos permanecem aderidos em caso de quebra',
        nbrReference: 'NBR 7199, NBR 14718',
      })
      break

    case 'COBERTURA':
      recommendations.push({
        type: 'LAMINADO',
        reason: 'Obrigatório por norma - evita queda de fragmentos',
        nbrReference: 'NBR 7199',
      })
      recommendations.push({
        type: 'TEMPERADO + LAMINADO',
        reason: 'Máxima segurança - resistência + retenção de fragmentos',
        nbrReference: 'NBR 7199, NBR 16259',
      })
      break

    case 'PORTA':
      recommendations.push({
        type: 'TEMPERADO',
        reason: 'Obrigatório por norma - resistência a impacto e tensão',
        nbrReference: 'NBR 7199',
      })
      break

    case 'JANELA':
      recommendations.push({
        type: 'COMUM',
        reason: 'Adequado para janelas sem requisitos especiais',
      })
      recommendations.push({
        type: 'TEMPERADO',
        reason: 'Maior segurança e resistência',
        nbrReference: 'NBR 16259',
      })
      break

    case 'TAMPO':
      recommendations.push({
        type: 'TEMPERADO',
        reason: 'Recomendado - resistência a choque térmico e impacto',
        nbrReference: 'NBR 16259',
      })
      if (area > 1.5) {
        recommendations.push({
          type: 'LAMINADO',
          reason: 'Para tampos grandes - maior segurança',
        })
      }
      break

    case 'DIVISORIA':
      recommendations.push({
        type: 'COMUM',
        reason: 'Adequado para divisórias sem carga',
      })
      recommendations.push({
        type: 'TEMPERADO',
        reason: 'Maior segurança em ambientes de circulação',
        nbrReference: 'NBR 7199',
      })
      break

    case 'FACHADA':
      recommendations.push({
        type: 'LAMINADO',
        reason: 'Obrigatório por norma - evita queda de fragmentos',
        nbrReference: 'NBR 7199',
      })
      recommendations.push({
        type: 'REFLETIVO',
        reason: 'Recomendado - controle térmico e luminoso',
      })
      break
  }

  return recommendations
}

// ============================================================================
// TOOLTIPS & INFO
// ============================================================================

/**
 * Get NBR standard information for tooltips
 */
export const NBR_INFO = {
  NBR_14718: {
    title: 'NBR 14718',
    fullName: 'Vidro temperado - Requisitos e métodos de ensaio',
    description: 'Define requisitos de projeto e dimensões máximas para vidros temperados',
    url: 'https://www.abntcatalogo.com.br/norma.aspx?ID=3679',
  },
  NBR_16259: {
    title: 'NBR 16259',
    fullName: 'Vidro temperado - Requisitos gerais',
    description: 'Estabelece requisitos de resistência ao vento e cargas externas',
    url: 'https://www.abntcatalogo.com.br/norma.aspx?ID=357391',
  },
  NBR_7199: {
    title: 'NBR 7199',
    fullName: 'Projeto, execução e aplicações de vidros na construção civil',
    description: 'Define requisitos de segurança e aplicações que exigem vidro de segurança',
    url: 'https://www.abntcatalogo.com.br/norma.aspx?ID=4292',
  },
  NBR_14488: {
    title: 'NBR 14488',
    fullName: 'Vidro de segurança - Cálculo de espessura',
    description: 'Fornece métodos de cálculo para determinação da espessura mínima',
    url: 'https://www.abntcatalogo.com.br/norma.aspx?ID=3678',
  },
} as const

/**
 * Get contextual help text for a field with NBR reference
 */
export function getFieldHelp(field: 'width' | 'height' | 'thickness' | 'glassType'): {
  text: string
  nbrReference?: string
} {
  switch (field) {
    case 'width':
    case 'height':
      return {
        text: 'Dimensões devem respeitar os limites da NBR 14718 de acordo com a espessura do vidro',
        nbrReference: 'NBR 14718',
      }
    case 'thickness':
      return {
        text: 'Espessura mínima calculada segundo NBR 14488 com base nas dimensões e aplicação',
        nbrReference: 'NBR 14488',
      }
    case 'glassType':
      return {
        text: 'Tipo de vidro deve atender requisitos de segurança da NBR 7199',
        nbrReference: 'NBR 7199',
      }
  }
}
