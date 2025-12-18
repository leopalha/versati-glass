/**
 * AI-CHAT Sprint P1.4: AI Quote Transformer
 *
 * Transforms AI conversation quoteContext (JSON) to QuoteItem[] format
 * for seamless integration with the quote wizard.
 */

import { QuoteItem } from '@/store/quote-store'
import type { AiQuoteData } from '@/store/quote-store'

// AI quoteContext structure (what the AI saves)
export interface AiQuoteContext {
  items?: Array<{
    category?: string
    productName?: string
    productSlug?: string
    description?: string
    width?: number
    height?: number
    quantity?: number
    // Options
    color?: string
    finish?: string
    thickness?: string
    glassType?: string
    glassColor?: string
    model?: string
    finishLine?: string
    ledTemp?: string
    shape?: string
    bisoteWidth?: string
    images?: string[]
    estimatedPrice?: number
  }>
  customerData?: {
    name?: string
    email?: string
    phone?: string
    cpfCnpj?: string
    street?: string
    number?: string
    complement?: string
    neighborhood?: string
    city?: string
    state?: string
    zipCode?: string
  }
  scheduleData?: {
    type?: 'VISITA_TECNICA' | 'INSTALACAO'
    date?: string
    time?: string
    notes?: string
  }
}

// Category mapping: AI terms → Product categories
const CATEGORY_MAP: Record<string, string> = {
  box: 'BOX',
  'box de banheiro': 'BOX',
  'box para banheiro': 'BOX',
  'box de correr': 'BOX',
  'box de abrir': 'BOX',
  espelho: 'ESPELHOS',
  espelhos: 'ESPELHOS',
  'espelho bisotado': 'ESPELHOS',
  'espelho com led': 'ESPELHOS',
  vidro: 'VIDROS',
  vidros: 'VIDROS',
  'vidro temperado': 'VIDROS',
  'vidro laminado': 'VIDROS',
  porta: 'PORTAS',
  portas: 'PORTAS',
  'porta de vidro': 'PORTAS',
  janela: 'JANELAS',
  janelas: 'JANELAS',
  'guarda-corpo': 'GUARDA_CORPOS',
  'guarda corpo': 'GUARDA_CORPOS',
  corrimao: 'CORRIMAOS',
  corrimão: 'CORRIMAOS',
  tampo: 'TAMPOS',
  'tampo de mesa': 'TAMPOS',
  divisoria: 'DIVISORIAS',
  divisória: 'DIVISORIAS',
}

/**
 * Normalize category name from AI to match ProductCategory enum
 */
function normalizeCategory(aiCategory?: string): string {
  if (!aiCategory) return 'VIDROS' // Default fallback

  const normalized = aiCategory.toLowerCase().trim()
  return CATEGORY_MAP[normalized] || 'VIDROS'
}

/**
 * Generate product ID from category and name
 * This is a temporary ID until we match against real products
 */
function generateProductId(category: string, productName: string): string {
  const slug = productName
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')

  return `${category.toLowerCase()}-${slug}`
}

/**
 * Generate product slug from name
 */
function generateProductSlug(productName: string): string {
  return productName
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

/**
 * Validate dimensions (must be > 0 and < 20m)
 */
function validateDimension(value?: number): number | undefined {
  if (value === undefined || value === null) return undefined
  if (value <= 0 || value > 20) return undefined
  return value
}

/**
 * Transform a single AI quote item to QuoteItem format
 */
export function transformAiItemToQuoteItem(
  aiItem: NonNullable<AiQuoteContext['items']>[0]
): Omit<QuoteItem, 'id'> {
  const category = normalizeCategory(aiItem.category)
  const productName = aiItem.productName || `Produto ${category}`
  const productId = aiItem.productSlug
    ? `${category.toLowerCase()}-${aiItem.productSlug}`
    : generateProductId(category, productName)
  const productSlug = aiItem.productSlug || generateProductSlug(productName)

  return {
    productId,
    productName,
    productSlug,
    category,
    description: aiItem.description,
    width: validateDimension(aiItem.width),
    height: validateDimension(aiItem.height),
    quantity: aiItem.quantity && aiItem.quantity > 0 ? aiItem.quantity : 1,
    // Options
    color: aiItem.color,
    finish: aiItem.finish,
    thickness: aiItem.thickness || '8mm', // Default thickness
    glassType: aiItem.glassType || 'Temperado', // Default glass type
    glassColor: aiItem.glassColor,
    model: aiItem.model,
    finishLine: aiItem.finishLine,
    ledTemp: aiItem.ledTemp,
    shape: aiItem.shape,
    bisoteWidth: aiItem.bisoteWidth,
    images: aiItem.images || [],
    estimatedPrice: aiItem.estimatedPrice,
  }
}

/**
 * Main transformer: AI quoteContext → AiQuoteData
 *
 * Validates and transforms the entire AI conversation context
 * into the format expected by useQuoteStore.importFromAI()
 */
export function transformAiContextToQuoteData(
  quoteContext: AiQuoteContext | null | undefined
): AiQuoteData | null {
  if (!quoteContext || !quoteContext.items || quoteContext.items.length === 0) {
    return null
  }

  // Transform items
  const transformedItems = quoteContext.items
    .filter((item) => {
      // Filter out items without basic required data
      return item.category || item.productName
    })
    .map(transformAiItemToQuoteItem)

  if (transformedItems.length === 0) {
    return null
  }

  // Transform customer data (only if at least name or phone present)
  let customerData = null
  if (quoteContext.customerData) {
    const {
      name,
      email,
      phone,
      cpfCnpj,
      street,
      number: num,
      complement,
      neighborhood,
      city,
      state,
      zipCode,
    } = quoteContext.customerData

    if (name || phone) {
      customerData = {
        name,
        email,
        phone,
        cpfCnpj,
        street,
        number: num,
        complement,
        neighborhood,
        city,
        state,
        zipCode,
      }
    }
  }

  // Transform schedule data (only if type and date present)
  let scheduleData = null
  if (quoteContext.scheduleData) {
    const { type, date, time, notes } = quoteContext.scheduleData

    if (type && date) {
      scheduleData = {
        type,
        date,
        time,
        notes,
      }
    }
  }

  return {
    items: transformedItems,
    customerData,
    scheduleData,
  }
}

/**
 * Validate if AI quote context has minimum required data
 * for creating a quote
 */
export function isQuoteContextComplete(quoteContext: AiQuoteContext | null | undefined): boolean {
  if (!quoteContext || !quoteContext.items || quoteContext.items.length === 0) {
    return false
  }

  // Check if at least one item has category and basic dimensions
  return quoteContext.items.some((item) => {
    const hasCategory = !!item.category
    const hasDimensions = (item.width && item.width > 0) || (item.height && item.height > 0)
    return hasCategory && hasDimensions
  })
}

/**
 * Get completion percentage of quote context (0-100)
 * Useful for progress indicators
 */
export function getQuoteContextCompletion(quoteContext: AiQuoteContext | null | undefined): number {
  if (!quoteContext) return 0

  let totalPoints = 0
  let earnedPoints = 0

  // Items (40 points)
  totalPoints += 40
  if (quoteContext.items && quoteContext.items.length > 0) {
    earnedPoints += 20 // Has items

    const firstItem = quoteContext.items[0]
    if (firstItem.category) earnedPoints += 5
    if (firstItem.width && firstItem.height) earnedPoints += 10
    if (firstItem.quantity) earnedPoints += 5
  }

  // Customer data (40 points)
  totalPoints += 40
  if (quoteContext.customerData) {
    if (quoteContext.customerData.name) earnedPoints += 10
    if (quoteContext.customerData.phone || quoteContext.customerData.email) earnedPoints += 15
    if (quoteContext.customerData.street && quoteContext.customerData.city) earnedPoints += 15
  }

  // Schedule data (20 points)
  totalPoints += 20
  if (quoteContext.scheduleData) {
    if (quoteContext.scheduleData.type) earnedPoints += 10
    if (quoteContext.scheduleData.date) earnedPoints += 10
  }

  return Math.round((earnedPoints / totalPoints) * 100)
}
