/**
 * Wind Zone Mapping for Brazil
 *
 * Maps Brazilian states and regions to wind pressure zones according to NBR 6123 and NBR 16259
 * Wind zones determine the pressure loads used in glass thickness calculations
 *
 * Zones:
 * - Zone 1: Low wind (0.3 kPa) - Interior regions
 * - Zone 2: Medium wind (0.6 kPa) - Most of Brazil (DEFAULT)
 * - Zone 3: High wind (1.0 kPa) - Coastal regions
 * - Zone 4: Very high wind (1.5 kPa) - Southern coast, exposed areas
 */

export type BrazilianState =
  | 'AC'
  | 'AL'
  | 'AP'
  | 'AM'
  | 'BA'
  | 'CE'
  | 'DF'
  | 'ES'
  | 'GO'
  | 'MA'
  | 'MT'
  | 'MS'
  | 'MG'
  | 'PA'
  | 'PB'
  | 'PR'
  | 'PE'
  | 'PI'
  | 'RJ'
  | 'RN'
  | 'RS'
  | 'RO'
  | 'RR'
  | 'SC'
  | 'SP'
  | 'SE'
  | 'TO'

export type WindZone = 1 | 2 | 3 | 4

/**
 * State to wind zone mapping
 * Based on geographical location and coastal proximity
 */
export const STATE_WIND_ZONES: Record<BrazilianState, WindZone> = {
  // North Region (mostly Zone 2, interior Zone 1)
  AC: 2, // Acre - Interior
  AM: 2, // Amazonas - Interior
  AP: 3, // Amapá - Coastal
  PA: 2, // Pará - Mixed (coastal areas higher)
  RO: 2, // Rondônia - Interior
  RR: 2, // Roraima - Interior
  TO: 1, // Tocantins - Interior, low wind

  // Northeast Region (mostly Zone 3 due to coast)
  AL: 3, // Alagoas - Coastal
  BA: 3, // Bahia - Coastal
  CE: 3, // Ceará - Coastal
  MA: 3, // Maranhão - Coastal
  PB: 3, // Paraíba - Coastal
  PE: 3, // Pernambuco - Coastal
  PI: 2, // Piauí - Mostly interior
  RN: 3, // Rio Grande do Norte - Coastal
  SE: 3, // Sergipe - Coastal

  // Central-West Region (mostly Zone 1-2, interior)
  DF: 2, // Distrito Federal - Interior plateau
  GO: 2, // Goiás - Interior
  MT: 2, // Mato Grosso - Interior
  MS: 2, // Mato Grosso do Sul - Interior

  // Southeast Region (mixed zones)
  ES: 3, // Espírito Santo - Coastal
  MG: 2, // Minas Gerais - Interior
  RJ: 3, // Rio de Janeiro - Coastal
  SP: 2, // São Paulo - Mixed (coast Zone 3, interior Zone 2)

  // South Region (higher zones due to latitude and coast)
  PR: 3, // Paraná - Coastal and higher latitude
  RS: 4, // Rio Grande do Sul - Southern coast, highest winds
  SC: 4, // Santa Catarina - Southern coast
}

/**
 * Get wind zone for a Brazilian state
 */
export function getWindZoneByState(state: BrazilianState): WindZone {
  return STATE_WIND_ZONES[state] || 2 // Default to Zone 2 if not found
}

/**
 * Get wind zone from CEP (postal code)
 * Uses the first 2 digits to determine the state
 *
 * CEP ranges by state (first 2 digits):
 * https://www.correios.com.br/enviar/precisa-de-ajuda/tudo-sobre-cep
 */
export function getWindZoneByCEP(cep: string): WindZone {
  // Remove non-numeric characters
  const numericCep = cep.replace(/\D/g, '')

  if (numericCep.length < 5) {
    return 2 // Default to Zone 2 if invalid CEP
  }

  // Get first 5 digits to determine region/state
  const cepPrefix = parseInt(numericCep.substring(0, 5), 10)

  // CEP ranges mapping to states
  // Based on Correios official CEP distribution
  if (cepPrefix >= 1000 && cepPrefix <= 5999) return getWindZoneByState('SP') // São Paulo
  if (cepPrefix >= 6000 && cepPrefix <= 6999) return getWindZoneByState('SP') // São Paulo (interior)
  if (cepPrefix >= 7000 && cepPrefix <= 7999) return getWindZoneByState('SP') // São Paulo (interior)
  if (cepPrefix >= 8000 && cepPrefix <= 8499) return getWindZoneByState('SP') // São Paulo (interior)
  if (cepPrefix >= 8500 && cepPrefix <= 8899) return getWindZoneByState('SP') // São Paulo (coast - Santos)
  if (cepPrefix >= 9000 && cepPrefix <= 9999) return getWindZoneByState('SP') // São Paulo (ABC/interior)

  if (cepPrefix >= 10000 && cepPrefix <= 10999) return getWindZoneByState('SP') // São Paulo (capital start)
  if (cepPrefix >= 11000 && cepPrefix <= 19999) return getWindZoneByState('SP') // São Paulo (capital/metro)

  if (cepPrefix >= 20000 && cepPrefix <= 28999) return getWindZoneByState('RJ') // Rio de Janeiro

  if (cepPrefix >= 29000 && cepPrefix <= 29999) return getWindZoneByState('ES') // Espírito Santo

  if (cepPrefix >= 30000 && cepPrefix <= 39999) return getWindZoneByState('MG') // Minas Gerais

  if (cepPrefix >= 40000 && cepPrefix <= 48999) return getWindZoneByState('BA') // Bahia

  if (cepPrefix >= 49000 && cepPrefix <= 49999) return getWindZoneByState('SE') // Sergipe

  if (cepPrefix >= 50000 && cepPrefix <= 56999) return getWindZoneByState('PE') // Pernambuco

  if (cepPrefix >= 57000 && cepPrefix <= 57999) return getWindZoneByState('AL') // Alagoas

  if (cepPrefix >= 58000 && cepPrefix <= 58999) return getWindZoneByState('PB') // Paraíba

  if (cepPrefix >= 59000 && cepPrefix <= 59999) return getWindZoneByState('RN') // Rio Grande do Norte

  if (cepPrefix >= 60000 && cepPrefix <= 63999) return getWindZoneByState('CE') // Ceará

  if (cepPrefix >= 64000 && cepPrefix <= 64999) return getWindZoneByState('PI') // Piauí

  if (cepPrefix >= 65000 && cepPrefix <= 65999) return getWindZoneByState('MA') // Maranhão

  if (cepPrefix >= 66000 && cepPrefix <= 68899) return getWindZoneByState('PA') // Pará

  if (cepPrefix >= 68900 && cepPrefix <= 68999) return getWindZoneByState('AP') // Amapá

  if (cepPrefix >= 69000 && cepPrefix <= 69299) return getWindZoneByState('AM') // Amazonas (Manaus)
  if (cepPrefix >= 69300 && cepPrefix <= 69399) return getWindZoneByState('RR') // Roraima
  if (cepPrefix >= 69400 && cepPrefix <= 69899) return getWindZoneByState('AM') // Amazonas (interior)
  if (cepPrefix >= 69900 && cepPrefix <= 69999) return getWindZoneByState('AC') // Acre

  if (cepPrefix >= 70000 && cepPrefix <= 72799) return getWindZoneByState('DF') // Distrito Federal
  if (cepPrefix >= 72800 && cepPrefix <= 72999) return getWindZoneByState('GO') // Goiás (Entorno DF)
  if (cepPrefix >= 73000 && cepPrefix <= 76799) return getWindZoneByState('GO') // Goiás

  if (cepPrefix >= 76800 && cepPrefix <= 76999) return getWindZoneByState('RO') // Rondônia

  if (cepPrefix >= 77000 && cepPrefix <= 77995) return getWindZoneByState('TO') // Tocantins

  if (cepPrefix >= 78000 && cepPrefix <= 78899) return getWindZoneByState('MT') // Mato Grosso

  if (cepPrefix >= 79000 && cepPrefix <= 79999) return getWindZoneByState('MS') // Mato Grosso do Sul

  if (cepPrefix >= 80000 && cepPrefix <= 87999) return getWindZoneByState('PR') // Paraná

  if (cepPrefix >= 88000 && cepPrefix <= 89999) return getWindZoneByState('SC') // Santa Catarina

  if (cepPrefix >= 90000 && cepPrefix <= 99999) return getWindZoneByState('RS') // Rio Grande do Sul

  // Default to Zone 2 (medium wind - safest assumption)
  return 2
}

/**
 * Get wind zone description in Portuguese
 */
export function getWindZoneDescription(zone: WindZone): string {
  const descriptions: Record<WindZone, string> = {
    1: 'Zona 1 - Vento Baixo (Interior)',
    2: 'Zona 2 - Vento Médio (Padrão)',
    3: 'Zona 3 - Vento Alto (Costa)',
    4: 'Zona 4 - Vento Muito Alto (Sul/Exposto)',
  }
  return descriptions[zone]
}

/**
 * Get wind pressure in kPa for a zone
 */
export function getWindPressure(zone: WindZone): number {
  const pressures: Record<WindZone, number> = {
    1: 0.3,
    2: 0.6,
    3: 1.0,
    4: 1.5,
  }
  return pressures[zone]
}

/**
 * Extract state from address string
 * Attempts to find 2-letter state code in address
 */
export function extractStateFromAddress(address: string): BrazilianState | null {
  const normalized = address.toUpperCase().replace(/[^A-Z]/g, '')

  const states: BrazilianState[] = [
    'AC',
    'AL',
    'AP',
    'AM',
    'BA',
    'CE',
    'DF',
    'ES',
    'GO',
    'MA',
    'MT',
    'MS',
    'MG',
    'PA',
    'PB',
    'PR',
    'PE',
    'PI',
    'RJ',
    'RN',
    'RS',
    'RO',
    'RR',
    'SC',
    'SP',
    'SE',
    'TO',
  ]

  for (const state of states) {
    // Look for state code as separate word or at end
    const regex = new RegExp(`\\b${state}\\b|${state}$`)
    if (regex.test(normalized)) {
      return state
    }
  }

  return null
}

/**
 * Get wind zone from full address
 * Priority: CEP > State code > Default
 */
export function getWindZoneFromAddress(
  cep?: string,
  state?: string,
  fullAddress?: string
): WindZone {
  // Try CEP first (most accurate)
  if (cep) {
    return getWindZoneByCEP(cep)
  }

  // Try state code
  if (state && state.length === 2) {
    const upperState = state.toUpperCase() as BrazilianState
    if (STATE_WIND_ZONES[upperState]) {
      return getWindZoneByState(upperState)
    }
  }

  // Try to extract state from full address
  if (fullAddress) {
    const extractedState = extractStateFromAddress(fullAddress)
    if (extractedState) {
      return getWindZoneByState(extractedState)
    }
  }

  // Default to Zone 2 (safest middle ground)
  return 2
}
