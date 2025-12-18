/**
 * Region-based Pricing System
 *
 * Calculates price multipliers based on customer location (CEP).
 * Different regions have different pricing due to logistics costs.
 *
 * Zones (Rio de Janeiro example):
 * - Zona Sul: +20% (mais caro - Copacabana, Ipanema, Leblon, etc)
 * - Zona Oeste: +10% (Barra, Recreio, Jacarepagua)
 * - Zona Norte: Normal (base price)
 * - Centro: Normal (base price)
 * - Baixada Fluminense: +15% (distância)
 * - Niterói: +10%
 * - Outros: +25% (fora da área de cobertura principal)
 */

export interface RegionInfo {
  zone: string
  zoneName: string
  priceMultiplier: number
  deliveryDays: number
  isServiceArea: boolean
  message?: string
}

// CEP ranges for different zones in Rio de Janeiro
// Format: { start: 'XXXXX', end: 'XXXXX', zone: 'ZONE_NAME', multiplier: X.XX }
const CEP_ZONES = [
  // Zona Sul - mais caro
  { start: '22000', end: '22799', zone: 'ZONA_SUL', name: 'Zona Sul', multiplier: 1.2, days: 3 },
  { start: '22800', end: '22899', zone: 'ZONA_SUL', name: 'Zona Sul', multiplier: 1.2, days: 3 },

  // Zona Oeste - Barra/Recreio
  {
    start: '22600',
    end: '22799',
    zone: 'ZONA_OESTE',
    name: 'Zona Oeste (Barra)',
    multiplier: 1.1,
    days: 4,
  },
  {
    start: '22780',
    end: '22799',
    zone: 'ZONA_OESTE',
    name: 'Zona Oeste (Recreio)',
    multiplier: 1.15,
    days: 5,
  },
  {
    start: '22700',
    end: '22779',
    zone: 'ZONA_OESTE',
    name: 'Jacarepagua',
    multiplier: 1.05,
    days: 4,
  },

  // Centro
  { start: '20000', end: '20999', zone: 'CENTRO', name: 'Centro', multiplier: 1.0, days: 2 },

  // Zona Norte
  {
    start: '20000',
    end: '21999',
    zone: 'ZONA_NORTE',
    name: 'Zona Norte',
    multiplier: 1.0,
    days: 3,
  },
  {
    start: '21000',
    end: '21999',
    zone: 'ZONA_NORTE',
    name: 'Zona Norte',
    multiplier: 1.0,
    days: 3,
  },

  // Niterói / São Gonçalo
  {
    start: '24000',
    end: '24999',
    zone: 'NITEROI',
    name: 'Niteroi/Sao Goncalo',
    multiplier: 1.1,
    days: 4,
  },

  // Baixada Fluminense
  {
    start: '25000',
    end: '26999',
    zone: 'BAIXADA',
    name: 'Baixada Fluminense',
    multiplier: 1.15,
    days: 5,
  },
  {
    start: '23000',
    end: '23999',
    zone: 'BAIXADA',
    name: 'Campo Grande/Santa Cruz',
    multiplier: 1.15,
    days: 5,
  },

  // Interior RJ
  {
    start: '27000',
    end: '28999',
    zone: 'INTERIOR_RJ',
    name: 'Interior RJ',
    multiplier: 1.25,
    days: 7,
  },
  {
    start: '29000',
    end: '29999',
    zone: 'INTERIOR_RJ',
    name: 'Interior RJ',
    multiplier: 1.25,
    days: 7,
  },
]

/**
 * Get region info from CEP
 */
export function getRegionFromCEP(cep: string): RegionInfo {
  // Clean CEP - remove non-digits
  const cleanCep = cep.replace(/\D/g, '')

  if (cleanCep.length !== 8) {
    return {
      zone: 'UNKNOWN',
      zoneName: 'CEP invalido',
      priceMultiplier: 1.0,
      deliveryDays: 7,
      isServiceArea: false,
      message: 'CEP invalido. Por favor, verifique.',
    }
  }

  // Get first 5 digits for zone matching
  const cepPrefix = cleanCep.substring(0, 5)
  const cepNum = parseInt(cepPrefix, 10)

  // Find matching zone
  for (const zone of CEP_ZONES) {
    const startNum = parseInt(zone.start, 10)
    const endNum = parseInt(zone.end, 10)

    if (cepNum >= startNum && cepNum <= endNum) {
      return {
        zone: zone.zone,
        zoneName: zone.name,
        priceMultiplier: zone.multiplier,
        deliveryDays: zone.days,
        isServiceArea: true,
      }
    }
  }

  // Check if it's in Rio de Janeiro state (20xxx-28xxx)
  const statePrefix = parseInt(cleanCep.substring(0, 2), 10)
  if (statePrefix >= 20 && statePrefix <= 28) {
    return {
      zone: 'OUTROS_RJ',
      zoneName: 'Outras regioes RJ',
      priceMultiplier: 1.2,
      deliveryDays: 7,
      isServiceArea: true,
      message: 'Regiao com acrescimo de deslocamento.',
    }
  }

  // Outside Rio de Janeiro - may or may not service
  return {
    zone: 'FORA_RJ',
    zoneName: 'Fora do Rio de Janeiro',
    priceMultiplier: 1.3,
    deliveryDays: 10,
    isServiceArea: false,
    message: 'Atendemos esta regiao sob consulta. Entre em contato para verificar disponibilidade.',
  }
}

/**
 * Calculate price with region multiplier
 */
export function calculateRegionalPrice(basePrice: number, cep: string): number {
  const region = getRegionFromCEP(cep)
  return Math.round(basePrice * region.priceMultiplier * 100) / 100
}

/**
 * Get price difference text for display
 */
export function getPriceDifferenceText(multiplier: number): string {
  if (multiplier === 1.0) {
    return 'Preco normal (sem acrescimo)'
  }

  const percentage = Math.round((multiplier - 1) * 100)
  if (percentage > 0) {
    return `+${percentage}% devido a regiao`
  }

  return `${percentage}% desconto regional`
}

/**
 * Format region info for display
 */
export function formatRegionDisplay(region: RegionInfo): string {
  const priceText = getPriceDifferenceText(region.priceMultiplier)
  const deliveryText =
    region.deliveryDays === 1 ? '1 dia util' : `${region.deliveryDays} dias uteis`

  return `${region.zoneName} - ${priceText} - Entrega em ${deliveryText}`
}
