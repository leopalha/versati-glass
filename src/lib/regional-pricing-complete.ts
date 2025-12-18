/**
 * ================================================
 * VERSATI GLASS - SISTEMA COMPLETO DE PRECIFICAÇÃO REGIONAL
 * ================================================
 *
 * Sistema avançado de ajuste de preços baseado em múltiplos fatores:
 * - Localização (CEP) - Zonas nobres, periferia, interior
 * - Tipo de área - Praia, comercial, residencial, industrial
 * - Risco - Áreas de difícil acesso, favelas, zonas de risco
 * - Logística - Distância, estacionamento, acesso
 * - Perfil do cliente - Residencial, comercial, corporativo
 * - Urgência - Prazo de entrega
 * - Complexidade - Tipo de instalação
 *
 * Data: 18 Dezembro 2024
 * Versão: 2.0 (Completa e Sofisticada)
 */

export interface LocationAnalysis {
  // Identificação
  cep: string
  city: string
  state: string
  neighborhood?: string

  // Classificações
  zone: ZoneType
  areaType: AreaType
  riskLevel: RiskLevel
  accessDifficulty: AccessLevel

  // Multiplicadores (acumulativos)
  zoneMultiplier: number // 0.85 - 1.50
  areaMultiplier: number // 0.95 - 1.40
  riskMultiplier: number // 1.00 - 1.60
  accessMultiplier: number // 1.00 - 1.30
  logisticsMultiplier: number // 1.00 - 1.25

  // Resultado final
  finalMultiplier: number
  priceAdjustment: number // Porcentagem (+/-X%)
  deliveryDays: number
  isServiceArea: boolean

  // Explicações
  reasons: string[]
  warnings: string[]
  suggestions: string[]
}

// ============================================================
// TIPOS E ENUMS
// ============================================================

export type ZoneType =
  | 'ZONA_SUL_PREMIUM' // Leblon, Ipanema, Copacabana
  | 'ZONA_SUL' // Outros bairros Zona Sul
  | 'ZONA_OESTE_PREMIUM' // Barra, Recreio (orla)
  | 'ZONA_OESTE' // Jacarepaguá, Freguesia
  | 'CENTRO' // Centro, Lapa
  | 'ZONA_NORTE' // Tijuca, Vila Isabel, etc
  | 'ZONA_NORTE_BAIXA' // Subúrbios
  | 'BAIXADA_FLUMINENSE' // Duque de Caxias, Nova Iguaçu
  | 'NITEROI_SAO_GONCALO' // Região Metropolitana
  | 'INTERIOR_RJ_PROXIMA' // Região Metropolitana ampliada
  | 'INTERIOR_RJ_DISTANTE' // Interior distante
  | 'FORA_RJ' // Outros estados

export type AreaType =
  | 'PRAIA_FRENTE_MAR' // Frente para o mar (corrosão)
  | 'PRAIA_PROXIMA' // Próximo à praia
  | 'COMERCIAL_SHOPPING' // Shopping centers
  | 'COMERCIAL_CENTRO' // Áreas comerciais centrais
  | 'EMPRESARIAL_AAA' // Edifícios corporativos classe A
  | 'EMPRESARIAL' // Edifícios comerciais padrão
  | 'RESIDENCIAL_ALTO_PADRAO' // Condomínios de luxo
  | 'RESIDENCIAL_MEDIO' // Residências classe média
  | 'RESIDENCIAL_SIMPLES' // Residências simples
  | 'INDUSTRIAL' // Áreas industriais
  | 'RURAL' // Áreas rurais
  | 'MISTO' // Uso misto

export type RiskLevel =
  | 'ZONA_SEGURA' // Áreas nobres e seguras
  | 'RISCO_BAIXO' // Áreas normais
  | 'RISCO_MEDIO' // Áreas com algum risco
  | 'RISCO_ALTO' // Áreas de risco, favelas pacificadas
  | 'RISCO_CRITICO' // Áreas de risco extremo

export type AccessLevel =
  | 'FACIL' // Fácil acesso, elevador, estacionamento
  | 'MODERADO' // Acesso normal
  | 'DIFICIL' // Ruas estreitas, sem elevador, sem estacionamento
  | 'MUITO_DIFICIL' // Morros, escadas, acesso muito restrito

// ============================================================
// MAPEAMENTO DE CEPS
// ============================================================

interface CEPRange {
  start: string
  end: string
  zone: ZoneType
  zoneName: string
  defaultAreaType?: AreaType
  defaultRisk?: RiskLevel
  baseMultiplier: number
  deliveryDays: number
  keywords?: string[] // Para identificação por bairro
}

const CEP_MAPPING: CEPRange[] = [
  // ====== ZONA SUL PREMIUM ======
  {
    start: '22410',
    end: '22470',
    zone: 'ZONA_SUL_PREMIUM',
    zoneName: 'Leblon',
    defaultAreaType: 'RESIDENCIAL_ALTO_PADRAO',
    defaultRisk: 'ZONA_SEGURA',
    baseMultiplier: 1.4,
    deliveryDays: 3,
    keywords: ['leblon'],
  },
  {
    start: '22420',
    end: '22430',
    zone: 'ZONA_SUL_PREMIUM',
    zoneName: 'Ipanema',
    defaultAreaType: 'RESIDENCIAL_ALTO_PADRAO',
    defaultRisk: 'ZONA_SEGURA',
    baseMultiplier: 1.35,
    deliveryDays: 3,
    keywords: ['ipanema'],
  },
  {
    start: '22070',
    end: '22080',
    zone: 'ZONA_SUL_PREMIUM',
    zoneName: 'Copacabana',
    defaultAreaType: 'MISTO',
    defaultRisk: 'ZONA_SEGURA',
    baseMultiplier: 1.3,
    deliveryDays: 3,
    keywords: ['copacabana'],
  },
  {
    start: '22440',
    end: '22450',
    zone: 'ZONA_SUL_PREMIUM',
    zoneName: 'Lagoa',
    defaultAreaType: 'RESIDENCIAL_ALTO_PADRAO',
    defaultRisk: 'ZONA_SEGURA',
    baseMultiplier: 1.35,
    deliveryDays: 3,
    keywords: ['lagoa'],
  },

  // ====== ZONA SUL ======
  {
    start: '22210',
    end: '22299',
    zone: 'ZONA_SUL',
    zoneName: 'Botafogo',
    defaultAreaType: 'MISTO',
    defaultRisk: 'RISCO_BAIXO',
    baseMultiplier: 1.2,
    deliveryDays: 3,
    keywords: ['botafogo'],
  },
  {
    start: '22250',
    end: '22299',
    zone: 'ZONA_SUL',
    zoneName: 'Flamengo',
    defaultAreaType: 'RESIDENCIAL_MEDIO',
    defaultRisk: 'RISCO_BAIXO',
    baseMultiplier: 1.2,
    deliveryDays: 3,
    keywords: ['flamengo'],
  },
  {
    start: '22460',
    end: '22470',
    zone: 'ZONA_SUL',
    zoneName: 'Jardim Botânico',
    defaultAreaType: 'RESIDENCIAL_ALTO_PADRAO',
    defaultRisk: 'ZONA_SEGURA',
    baseMultiplier: 1.3,
    deliveryDays: 3,
    keywords: ['jardim botânico', 'jardim botanico'],
  },

  // ====== ZONA OESTE PREMIUM (BARRA/RECREIO) ======
  {
    start: '22620',
    end: '22649',
    zone: 'ZONA_OESTE_PREMIUM',
    zoneName: 'Barra da Tijuca (Orla)',
    defaultAreaType: 'RESIDENCIAL_ALTO_PADRAO',
    defaultRisk: 'ZONA_SEGURA',
    baseMultiplier: 1.25,
    deliveryDays: 4,
    keywords: ['barra', 'barra da tijuca'],
  },
  {
    start: '22790',
    end: '22799',
    zone: 'ZONA_OESTE_PREMIUM',
    zoneName: 'Recreio dos Bandeirantes',
    defaultAreaType: 'RESIDENCIAL_MEDIO',
    defaultRisk: 'RISCO_BAIXO',
    baseMultiplier: 1.2,
    deliveryDays: 5,
    keywords: ['recreio'],
  },

  // ====== ZONA OESTE ======
  {
    start: '22710',
    end: '22789',
    zone: 'ZONA_OESTE',
    zoneName: 'Jacarepaguá',
    defaultAreaType: 'RESIDENCIAL_MEDIO',
    defaultRisk: 'RISCO_BAIXO',
    baseMultiplier: 1.1,
    deliveryDays: 4,
    keywords: ['jacarepagua', 'anil', 'gardenia azul'],
  },
  {
    start: '22730',
    end: '22750',
    zone: 'ZONA_OESTE',
    zoneName: 'Freguesia',
    defaultAreaType: 'RESIDENCIAL_MEDIO',
    defaultRisk: 'RISCO_BAIXO',
    baseMultiplier: 1.05,
    deliveryDays: 4,
    keywords: ['freguesia'],
  },

  // ====== CENTRO ======
  {
    start: '20010',
    end: '20099',
    zone: 'CENTRO',
    zoneName: 'Centro',
    defaultAreaType: 'COMERCIAL_CENTRO',
    defaultRisk: 'RISCO_MEDIO',
    baseMultiplier: 1.0,
    deliveryDays: 2,
    keywords: ['centro'],
  },

  // ====== ZONA NORTE ======
  {
    start: '20510',
    end: '20560',
    zone: 'ZONA_NORTE',
    zoneName: 'Tijuca',
    defaultAreaType: 'RESIDENCIAL_MEDIO',
    defaultRisk: 'RISCO_BAIXO',
    baseMultiplier: 1.0,
    deliveryDays: 3,
    keywords: ['tijuca'],
  },
  {
    start: '20530',
    end: '20541',
    zone: 'ZONA_NORTE',
    zoneName: 'Vila Isabel',
    defaultAreaType: 'RESIDENCIAL_MEDIO',
    defaultRisk: 'RISCO_BAIXO',
    baseMultiplier: 1.0,
    deliveryDays: 3,
    keywords: ['vila isabel'],
  },
  {
    start: '21010',
    end: '21099',
    zone: 'ZONA_NORTE_BAIXA',
    zoneName: 'Penha',
    defaultAreaType: 'RESIDENCIAL_SIMPLES',
    defaultRisk: 'RISCO_MEDIO',
    baseMultiplier: 1.05,
    deliveryDays: 4,
    keywords: ['penha'],
  },

  // ====== BAIXADA FLUMINENSE ======
  {
    start: '25000',
    end: '25999',
    zone: 'BAIXADA_FLUMINENSE',
    zoneName: 'Duque de Caxias',
    defaultAreaType: 'RESIDENCIAL_SIMPLES',
    defaultRisk: 'RISCO_MEDIO',
    baseMultiplier: 1.15,
    deliveryDays: 5,
    keywords: ['duque de caxias', 'caxias'],
  },
  {
    start: '26000',
    end: '26999',
    zone: 'BAIXADA_FLUMINENSE',
    zoneName: 'Nova Iguaçu',
    defaultAreaType: 'RESIDENCIAL_SIMPLES',
    defaultRisk: 'RISCO_MEDIO',
    baseMultiplier: 1.2,
    deliveryDays: 5,
    keywords: ['nova iguacu', 'nova iguaçu'],
  },

  // ====== NITERÓI / SÃO GONÇALO ======
  {
    start: '24000',
    end: '24799',
    zone: 'NITEROI_SAO_GONCALO',
    zoneName: 'Niterói',
    defaultAreaType: 'RESIDENCIAL_MEDIO',
    defaultRisk: 'RISCO_BAIXO',
    baseMultiplier: 1.15,
    deliveryDays: 4,
    keywords: ['niteroi', 'niterói'],
  },
  {
    start: '24800',
    end: '24999',
    zone: 'NITEROI_SAO_GONCALO',
    zoneName: 'São Gonçalo',
    defaultAreaType: 'RESIDENCIAL_SIMPLES',
    defaultRisk: 'RISCO_MEDIO',
    baseMultiplier: 1.18,
    deliveryDays: 5,
    keywords: ['sao goncalo', 'são gonçalo'],
  },

  // ====== INTERIOR RJ PRÓXIMO ======
  {
    start: '27000',
    end: '27999',
    zone: 'INTERIOR_RJ_PROXIMA',
    zoneName: 'Região dos Lagos',
    defaultAreaType: 'RESIDENCIAL_MEDIO',
    defaultRisk: 'RISCO_BAIXO',
    baseMultiplier: 1.3,
    deliveryDays: 7,
    keywords: ['cabo frio', 'arraial', 'buzios', 'búzios'],
  },

  // ====== INTERIOR RJ DISTANTE ======
  {
    start: '28000',
    end: '28999',
    zone: 'INTERIOR_RJ_DISTANTE',
    zoneName: 'Interior RJ',
    defaultAreaType: 'RESIDENCIAL_SIMPLES',
    defaultRisk: 'RISCO_BAIXO',
    baseMultiplier: 1.4,
    deliveryDays: 10,
    keywords: ['interior'],
  },
]

// ============================================================
// MULTIPLICADORES POR TIPO DE ÁREA
// ============================================================

const AREA_TYPE_MULTIPLIERS: Record<AreaType, { multiplier: number; reason: string }> = {
  PRAIA_FRENTE_MAR: {
    multiplier: 1.4,
    reason: 'Frente mar - maior corrosão, manutenção especial',
  },
  PRAIA_PROXIMA: {
    multiplier: 1.25,
    reason: 'Próximo à praia - ambiente salino',
  },
  COMERCIAL_SHOPPING: {
    multiplier: 1.3,
    reason: 'Shopping - complexidade logística e padrão elevado',
  },
  COMERCIAL_CENTRO: {
    multiplier: 1.2,
    reason: 'Área comercial - horário restrito, estacionamento difícil',
  },
  EMPRESARIAL_AAA: {
    multiplier: 1.35,
    reason: 'Edifício corporativo AAA - padrão premium, segurança rigorosa',
  },
  EMPRESARIAL: {
    multiplier: 1.15,
    reason: 'Edifício comercial - normas e procedimentos',
  },
  RESIDENCIAL_ALTO_PADRAO: {
    multiplier: 1.25,
    reason: 'Alto padrão - acabamento premium, cuidado extra',
  },
  RESIDENCIAL_MEDIO: {
    multiplier: 1.0,
    reason: 'Residencial padrão (base)',
  },
  RESIDENCIAL_SIMPLES: {
    multiplier: 0.95,
    reason: 'Residencial simples - menor complexidade',
  },
  INDUSTRIAL: {
    multiplier: 1.1,
    reason: 'Área industrial - logística especial',
  },
  RURAL: {
    multiplier: 1.2,
    reason: 'Área rural - distância e acesso',
  },
  MISTO: {
    multiplier: 1.05,
    reason: 'Área mista',
  },
}

// ============================================================
// MULTIPLICADORES POR NÍVEL DE RISCO
// ============================================================

const RISK_LEVEL_MULTIPLIERS: Record<
  RiskLevel,
  { multiplier: number; reason: string; warning?: string }
> = {
  ZONA_SEGURA: {
    multiplier: 1.0,
    reason: 'Área segura',
  },
  RISCO_BAIXO: {
    multiplier: 1.0,
    reason: 'Risco baixo',
  },
  RISCO_MEDIO: {
    multiplier: 1.15,
    reason: 'Área de risco médio - seguro adicional',
    warning: 'Instalação requer seguro adicional',
  },
  RISCO_ALTO: {
    multiplier: 1.35,
    reason: 'Área de risco alto - escolta e seguro',
    warning: 'Instalação requer escolta e seguro especial',
  },
  RISCO_CRITICO: {
    multiplier: 1.6,
    reason: 'Área de risco crítico - medidas especiais de segurança',
    warning: 'Instalação sob consulta - medidas especiais necessárias',
  },
}

// ============================================================
// MULTIPLICADORES POR NÍVEL DE ACESSO
// ============================================================

const ACCESS_LEVEL_MULTIPLIERS: Record<AccessLevel, { multiplier: number; reason: string }> = {
  FACIL: {
    multiplier: 1.0,
    reason: 'Fácil acesso - elevador e estacionamento',
  },
  MODERADO: {
    multiplier: 1.05,
    reason: 'Acesso moderado',
  },
  DIFICIL: {
    multiplier: 1.15,
    reason: 'Acesso difícil - sem elevador ou estacionamento',
  },
  MUITO_DIFICIL: {
    multiplier: 1.3,
    reason: 'Acesso muito difícil - morro, escadas, acesso restrito',
  },
}

// ============================================================
// FUNÇÃO PRINCIPAL DE ANÁLISE
// ============================================================

export function analyzeLocation(
  cep: string,
  additionalInfo?: {
    isBeachfront?: boolean
    accessDifficulty?: AccessLevel
    riskLevel?: RiskLevel
    isCommercial?: boolean
    isCorporate?: boolean
    isHighEnd?: boolean
  }
): LocationAnalysis {
  // Limpar CEP
  const cleanCep = cep.replace(/\D/g, '')

  if (cleanCep.length !== 8) {
    return getInvalidCepAnalysis(cep)
  }

  // Encontrar zona por CEP
  const cepPrefix = cleanCep.substring(0, 5)
  const cepNum = parseInt(cepPrefix, 10)

  let matchedRange: CEPRange | null = null

  for (const range of CEP_MAPPING) {
    const startNum = parseInt(range.start, 10)
    const endNum = parseInt(range.end, 10)

    if (cepNum >= startNum && cepNum <= endNum) {
      matchedRange = range
      break
    }
  }

  if (!matchedRange) {
    return getUnknownZoneAnalysis(cep, cleanCep)
  }

  // Determinar tipo de área
  let areaType = matchedRange.defaultAreaType || 'RESIDENCIAL_MEDIO'

  if (additionalInfo?.isBeachfront) {
    areaType = 'PRAIA_FRENTE_MAR'
  } else if (additionalInfo?.isCorporate) {
    areaType = additionalInfo.isHighEnd ? 'EMPRESARIAL_AAA' : 'EMPRESARIAL'
  } else if (additionalInfo?.isCommercial) {
    areaType = 'COMERCIAL_CENTRO'
  } else if (additionalInfo?.isHighEnd) {
    areaType = 'RESIDENCIAL_ALTO_PADRAO'
  }

  // Determinar nível de risco
  const riskLevel = additionalInfo?.riskLevel || matchedRange.defaultRisk || 'RISCO_BAIXO'

  // Determinar dificuldade de acesso
  const accessDifficulty = additionalInfo?.accessDifficulty || 'MODERADO'

  // Calcular multiplicadores
  const zoneMultiplier = matchedRange.baseMultiplier
  const areaMultiplier = AREA_TYPE_MULTIPLIERS[areaType].multiplier
  const riskMultiplier = RISK_LEVEL_MULTIPLIERS[riskLevel].multiplier
  const accessMultiplier = ACCESS_LEVEL_MULTIPLIERS[accessDifficulty].multiplier

  // Multiplicador de logística (baseado na zona)
  const logisticsMultiplier = calculateLogisticsMultiplier(matchedRange.zone)

  // Multiplicador final (acumulativo)
  const finalMultiplier =
    zoneMultiplier * areaMultiplier * riskMultiplier * accessMultiplier * logisticsMultiplier

  const priceAdjustment = Math.round((finalMultiplier - 1.0) * 100)

  // Construir razões
  const reasons: string[] = []
  const warnings: string[] = []
  const suggestions: string[] = []

  reasons.push(`Zona: ${matchedRange.zoneName} (${formatMultiplier(zoneMultiplier)})`)
  reasons.push(AREA_TYPE_MULTIPLIERS[areaType].reason + ` (${formatMultiplier(areaMultiplier)})`)

  if (riskMultiplier > 1.0) {
    reasons.push(
      RISK_LEVEL_MULTIPLIERS[riskLevel].reason + ` (${formatMultiplier(riskMultiplier)})`
    )
    if (RISK_LEVEL_MULTIPLIERS[riskLevel].warning) {
      warnings.push(RISK_LEVEL_MULTIPLIERS[riskLevel].warning!)
    }
  }

  if (accessMultiplier > 1.0) {
    reasons.push(
      ACCESS_LEVEL_MULTIPLIERS[accessDifficulty].reason + ` (${formatMultiplier(accessMultiplier)})`
    )
  }

  if (logisticsMultiplier > 1.0) {
    reasons.push(`Logística: ${formatMultiplier(logisticsMultiplier)}`)
  }

  // Sugestões
  if (priceAdjustment > 20) {
    suggestions.push('Considere agrupar pedidos para otimizar custos de entrega')
  }

  if (matchedRange.deliveryDays > 5) {
    suggestions.push('Prazo de entrega estendido - planeje com antecedência')
  }

  return {
    cep: cleanCep,
    city: getCityFromZone(matchedRange.zone),
    state: 'RJ',
    neighborhood: matchedRange.zoneName,
    zone: matchedRange.zone,
    areaType,
    riskLevel,
    accessDifficulty,
    zoneMultiplier,
    areaMultiplier,
    riskMultiplier,
    accessMultiplier,
    logisticsMultiplier,
    finalMultiplier,
    priceAdjustment,
    deliveryDays: matchedRange.deliveryDays,
    isServiceArea: true,
    reasons,
    warnings,
    suggestions,
  }
}

// ============================================================
// FUNÇÕES AUXILIARES
// ============================================================

function calculateLogisticsMultiplier(zone: ZoneType): number {
  const logisticsMap: Record<ZoneType, number> = {
    ZONA_SUL_PREMIUM: 1.05,
    ZONA_SUL: 1.02,
    ZONA_OESTE_PREMIUM: 1.05,
    ZONA_OESTE: 1.03,
    CENTRO: 1.1, // Trânsito e estacionamento difícil
    ZONA_NORTE: 1.0,
    ZONA_NORTE_BAIXA: 1.05,
    BAIXADA_FLUMINENSE: 1.15,
    NITEROI_SAO_GONCALO: 1.12, // Ponte
    INTERIOR_RJ_PROXIMA: 1.2,
    INTERIOR_RJ_DISTANTE: 1.25,
    FORA_RJ: 1.3,
  }

  return logisticsMap[zone] || 1.0
}

function formatMultiplier(multiplier: number): string {
  if (multiplier === 1.0) return '±0%'
  const percent = Math.round((multiplier - 1.0) * 100)
  return percent > 0 ? `+${percent}%` : `${percent}%`
}

function getCityFromZone(zone: ZoneType): string {
  if (zone.includes('NITEROI')) return 'Niterói'
  if (zone.includes('BAIXADA')) return 'Baixada Fluminense'
  if (zone.includes('INTERIOR')) return 'Interior RJ'
  if (zone === 'FORA_RJ') return 'Fora do RJ'
  return 'Rio de Janeiro'
}

function getInvalidCepAnalysis(cep: string): LocationAnalysis {
  return {
    cep,
    city: 'Desconhecido',
    state: '',
    zone: 'ZONA_NORTE',
    areaType: 'RESIDENCIAL_MEDIO',
    riskLevel: 'RISCO_BAIXO',
    accessDifficulty: 'MODERADO',
    zoneMultiplier: 1.0,
    areaMultiplier: 1.0,
    riskMultiplier: 1.0,
    accessMultiplier: 1.0,
    logisticsMultiplier: 1.0,
    finalMultiplier: 1.0,
    priceAdjustment: 0,
    deliveryDays: 7,
    isServiceArea: false,
    reasons: [],
    warnings: ['CEP inválido - utilize preço base'],
    suggestions: ['Verifique o CEP e tente novamente'],
  }
}

function getUnknownZoneAnalysis(cep: string, cleanCep: string): LocationAnalysis {
  // Verificar se é RJ (20xxx-28xxx)
  const statePrefix = parseInt(cleanCep.substring(0, 2), 10)
  const isRJ = statePrefix >= 20 && statePrefix <= 28

  if (isRJ) {
    return {
      cep: cleanCep,
      city: 'Rio de Janeiro',
      state: 'RJ',
      zone: 'INTERIOR_RJ_PROXIMA',
      areaType: 'RESIDENCIAL_MEDIO',
      riskLevel: 'RISCO_BAIXO',
      accessDifficulty: 'MODERADO',
      zoneMultiplier: 1.25,
      areaMultiplier: 1.0,
      riskMultiplier: 1.0,
      accessMultiplier: 1.0,
      logisticsMultiplier: 1.15,
      finalMultiplier: 1.44,
      priceAdjustment: 44,
      deliveryDays: 7,
      isServiceArea: true,
      reasons: ['Região não mapeada - RJ (+25%)', 'Logística (+15%)'],
      warnings: ['Prazo e preço sob consulta'],
      suggestions: ['Entre em contato para confirmar atendimento'],
    }
  }

  // Fora do RJ
  return {
    cep: cleanCep,
    city: 'Fora do Rio de Janeiro',
    state: 'Outro',
    zone: 'FORA_RJ',
    areaType: 'RESIDENCIAL_MEDIO',
    riskLevel: 'RISCO_BAIXO',
    accessDifficulty: 'MODERADO',
    zoneMultiplier: 1.4,
    areaMultiplier: 1.0,
    riskMultiplier: 1.0,
    accessMultiplier: 1.0,
    logisticsMultiplier: 1.3,
    finalMultiplier: 1.82,
    priceAdjustment: 82,
    deliveryDays: 15,
    isServiceArea: false,
    reasons: ['Fora do Rio de Janeiro (+40%)', 'Logística interestadual (+30%)'],
    warnings: ['Atendimento sob consulta', 'Prazo e frete especiais'],
    suggestions: ['Entre em contato para verificar viabilidade'],
  }
}

// ============================================================
// FUNÇÃO DE APLICAÇÃO DE PREÇO
// ============================================================

export function applyRegionalPricing(
  basePrice: number,
  analysis: LocationAnalysis
): {
  originalPrice: number
  adjustedPrice: number
  adjustment: number
  adjustmentPercent: number
  breakdown: {
    base: number
    zone: number
    area: number
    risk: number
    access: number
    logistics: number
    total: number
  }
} {
  const breakdown = {
    base: basePrice,
    zone: Math.round(basePrice * (analysis.zoneMultiplier - 1)),
    area: Math.round(basePrice * (analysis.areaMultiplier - 1)),
    risk: Math.round(basePrice * (analysis.riskMultiplier - 1)),
    access: Math.round(basePrice * (analysis.accessMultiplier - 1)),
    logistics: Math.round(basePrice * (analysis.logisticsMultiplier - 1)),
    total: 0,
  }

  const adjustedPrice = Math.round(basePrice * analysis.finalMultiplier)
  const adjustment = adjustedPrice - basePrice
  const adjustmentPercent = analysis.priceAdjustment

  breakdown.total = adjustedPrice

  return {
    originalPrice: basePrice,
    adjustedPrice,
    adjustment,
    adjustmentPercent,
    breakdown,
  }
}

// ============================================================
// FUNÇÃO DE FORMATAÇÃO PARA DISPLAY
// ============================================================

export function formatPricingAnalysis(analysis: LocationAnalysis, basePrice?: number): string {
  let output = `📍 Análise de Localização\n\n`
  output += `📮 CEP: ${analysis.cep}\n`
  output += `🏙️ Região: ${analysis.neighborhood}, ${analysis.city}\n`
  output += `🏠 Tipo: ${analysis.areaType.replace(/_/g, ' ')}\n`
  output += `⚠️ Risco: ${analysis.riskLevel.replace(/_/g, ' ')}\n`
  output += `🚗 Acesso: ${analysis.accessDifficulty}\n\n`

  output += `💰 Ajuste de Preço: ${analysis.priceAdjustment > 0 ? '+' : ''}${analysis.priceAdjustment}%\n`
  output += `📦 Prazo de Entrega: ${analysis.deliveryDays} dias úteis\n\n`

  if (basePrice) {
    const pricing = applyRegionalPricing(basePrice, analysis)
    output += `💵 Preço Base: R$ ${pricing.originalPrice.toLocaleString('pt-BR')}\n`
    output += `💵 Preço Ajustado: R$ ${pricing.adjustedPrice.toLocaleString('pt-BR')}\n`
    output += `📊 Diferença: R$ ${pricing.adjustment.toLocaleString('pt-BR')}\n\n`
  }

  if (analysis.reasons.length > 0) {
    output += `📋 Fatores:\n`
    analysis.reasons.forEach((r) => (output += `   • ${r}\n`))
    output += `\n`
  }

  if (analysis.warnings.length > 0) {
    output += `⚠️ Avisos:\n`
    analysis.warnings.forEach((w) => (output += `   • ${w}\n`))
    output += `\n`
  }

  if (analysis.suggestions.length > 0) {
    output += `💡 Sugestões:\n`
    analysis.suggestions.forEach((s) => (output += `   • ${s}\n`))
  }

  return output
}
