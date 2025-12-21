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
 *
 * Agora exige: produto + dimensões + dados do cliente (nome OU telefone)
 * O agente coleta esses dados durante a conversa antes de habilitar checkout
 */
export function isQuoteContextComplete(quoteContext: AiQuoteContext | null | undefined): boolean {
  if (!quoteContext || !quoteContext.items || quoteContext.items.length === 0) {
    return false
  }

  // Check if at least one item has:
  // 1. Category OR product name (required)
  // 2. At least ONE dimension (width OR height)
  const hasMinimalItem = quoteContext.items.some((item) => {
    const hasCategory = !!item.category || !!item.productName
    const hasAnyDimension = (item.width && item.width > 0) || (item.height && item.height > 0)
    return hasCategory && hasAnyDimension
  })

  if (!hasMinimalItem) {
    return false
  }

  // NOVO: Exige dados do cliente (nome OU telefone)
  const hasCustomerData = !!(
    quoteContext.customerData &&
    (quoteContext.customerData.name || quoteContext.customerData.phone)
  )

  // Só habilita checkout quando tem produto + dimensão + dados do cliente
  return hasMinimalItem && hasCustomerData
}

/**
 * Validate if quote context has COMPLETE data (both dimensions)
 * Use this for showing progress indicators
 */
export function isQuoteContextFullyComplete(
  quoteContext: AiQuoteContext | null | undefined
): boolean {
  if (!quoteContext || !quoteContext.items || quoteContext.items.length === 0) {
    return false
  }

  // Check if at least one item has:
  // 1. Category (required)
  // 2. BOTH dimensions (width AND height)
  const hasCompleteItem = quoteContext.items.some((item) => {
    const hasCategory = !!item.category || !!item.productName
    const hasBothDimensions = item.width && item.width > 0 && item.height && item.height > 0
    return hasCategory && hasBothDimensions
  })

  if (!hasCompleteItem) {
    return false
  }

  // Also check for customer info for fully complete
  const hasCustomerInfo = !!(
    quoteContext.customerData &&
    (quoteContext.customerData.name ||
      quoteContext.customerData.phone ||
      quoteContext.customerData.email)
  )

  return hasCompleteItem && (hasCustomerInfo || quoteContext.items.length > 1)
}

/**
 * Get completion percentage of quote context (0-100)
 * Useful for progress indicators
 *
 * Campos OBRIGATÓRIOS para chegar a 100%:
 * - Produto/categoria selecionado: 25%
 * - AMBAS as medidas (largura E altura): 25%
 * - Telefone do cliente: 25%
 * - Nome do cliente: 25%
 *
 * Campos opcionais não contam para os 100%
 * Isso garante que só mostra checkout quando tem TUDO preenchido
 */
export function getQuoteContextCompletion(quoteContext: AiQuoteContext | null | undefined): number {
  if (!quoteContext) return 0

  let earnedPoints = 0

  // Produto (50% - obrigatório)
  if (quoteContext.items && quoteContext.items.length > 0) {
    const firstItem = quoteContext.items[0]

    // Categoria/produto selecionado: 25%
    if (firstItem.category || firstItem.productName) {
      earnedPoints += 25
    }

    // AMBAS as medidas (obrigatório): 25%
    // Só ganha pontos se tiver AMBAS as dimensões
    if (firstItem.width && firstItem.width > 0 && firstItem.height && firstItem.height > 0) {
      earnedPoints += 25
    }
    // Se tiver só uma dimensão, não ganha pontos completos - precisa das duas
  }

  // Dados do cliente (50% - obrigatório)
  if (quoteContext.customerData) {
    // Telefone (OBRIGATÓRIO): 25%
    if (quoteContext.customerData.phone) {
      earnedPoints += 25
    }

    // Nome (OBRIGATÓRIO): 25%
    if (quoteContext.customerData.name) {
      earnedPoints += 25
    }
  }

  return earnedPoints
}

/**
 * Campos de progresso por categoria
 * Define quais campos sao relevantes para cada tipo de produto
 */
export const CATEGORY_PROGRESS_FIELDS: Record<
  string,
  Array<{
    key: string
    label: string
    check: (item: NonNullable<AiQuoteContext['items']>[0]) => boolean
    required?: boolean
  }>
> = {
  BOX: [
    { key: 'category', label: 'Tipo de box', check: (i) => !!i.category, required: true },
    { key: 'model', label: 'Modelo selecionado', check: (i) => !!i.model },
    {
      key: 'dimensions',
      label: 'Medidas informadas',
      check: (i) => !!(i.width && i.height),
      required: true,
    },
    { key: 'thickness', label: 'Espessura definida', check: (i) => !!i.thickness },
    { key: 'glassType', label: 'Tipo de vidro', check: (i) => !!i.glassType },
    { key: 'color', label: 'Cor da ferragem', check: (i) => !!i.color },
  ],
  ESPELHOS: [
    { key: 'category', label: 'Tipo de espelho', check: (i) => !!i.category, required: true },
    { key: 'model', label: 'Modelo selecionado', check: (i) => !!i.model },
    {
      key: 'dimensions',
      label: 'Medidas informadas',
      check: (i) => !!(i.width && i.height),
      required: true,
    },
    { key: 'finish', label: 'Acabamento', check: (i) => !!i.finish },
    { key: 'ledTemp', label: 'Temperatura LED', check: (i) => !!i.ledTemp },
    { key: 'bisoteWidth', label: 'Largura do bisote', check: (i) => !!i.bisoteWidth },
  ],
  VIDROS: [
    { key: 'category', label: 'Tipo de vidro', check: (i) => !!i.category, required: true },
    { key: 'glassType', label: 'Tipo especifico', check: (i) => !!i.glassType },
    {
      key: 'dimensions',
      label: 'Medidas informadas',
      check: (i) => !!(i.width && i.height),
      required: true,
    },
    { key: 'thickness', label: 'Espessura definida', check: (i) => !!i.thickness, required: true },
    { key: 'glassColor', label: 'Cor do vidro', check: (i) => !!i.glassColor },
  ],
  PORTAS: [
    { key: 'category', label: 'Tipo de porta', check: (i) => !!i.category, required: true },
    { key: 'model', label: 'Modelo selecionado', check: (i) => !!i.model },
    {
      key: 'dimensions',
      label: 'Medidas informadas',
      check: (i) => !!(i.width && i.height),
      required: true,
    },
    { key: 'glassType', label: 'Tipo de vidro', check: (i) => !!i.glassType },
    { key: 'color', label: 'Cor da ferragem', check: (i) => !!i.color },
  ],
  JANELAS: [
    { key: 'category', label: 'Tipo de janela', check: (i) => !!i.category, required: true },
    { key: 'model', label: 'Modelo selecionado', check: (i) => !!i.model },
    {
      key: 'dimensions',
      label: 'Medidas informadas',
      check: (i) => !!(i.width && i.height),
      required: true,
    },
    { key: 'glassType', label: 'Tipo de vidro', check: (i) => !!i.glassType },
    { key: 'thickness', label: 'Espessura definida', check: (i) => !!i.thickness },
  ],
  GUARDA_CORPO: [
    { key: 'category', label: 'Tipo de guarda-corpo', check: (i) => !!i.category, required: true },
    { key: 'model', label: 'Modelo selecionado', check: (i) => !!i.model },
    {
      key: 'dimensions',
      label: 'Medidas informadas',
      check: (i) => !!(i.width && i.height),
      required: true,
    },
    { key: 'glassType', label: 'Tipo de vidro', check: (i) => !!i.glassType, required: true },
    { key: 'color', label: 'Cor da ferragem', check: (i) => !!i.color },
  ],
  DEFAULT: [
    { key: 'category', label: 'Produto selecionado', check: (i) => !!i.category, required: true },
    {
      key: 'dimensions',
      label: 'Medidas informadas',
      check: (i) => !!(i.width && i.height),
      required: true,
    },
    { key: 'thickness', label: 'Espessura definida', check: (i) => !!i.thickness },
    { key: 'color', label: 'Cor/acabamento', check: (i) => !!i.color || !!i.finish },
  ],
}

/**
 * Interface para detalhes de progresso
 */
export interface ProgressDetail {
  key: string
  label: string
  completed: boolean
  required: boolean
}

/**
 * Obter detalhes do progresso por categoria
 * Retorna lista de campos com status de preenchimento
 */
export function getProgressDetails(quoteContext: AiQuoteContext | null | undefined): {
  productFields: ProgressDetail[]
  contactFields: ProgressDetail[]
  category: string | null
} {
  const result = {
    productFields: [] as ProgressDetail[],
    contactFields: [] as ProgressDetail[],
    category: null as string | null,
  }

  if (!quoteContext || !quoteContext.items || quoteContext.items.length === 0) {
    return result
  }

  const firstItem = quoteContext.items[0]
  const category = firstItem.category?.toUpperCase() || 'DEFAULT'
  result.category = category

  // Obter campos relevantes para a categoria
  const fields = CATEGORY_PROGRESS_FIELDS[category] || CATEGORY_PROGRESS_FIELDS.DEFAULT

  // Mapear campos do produto
  result.productFields = fields.map((field) => ({
    key: field.key,
    label: field.label,
    completed: field.check(firstItem),
    required: field.required || false,
  }))

  // Campos de contato (sempre os mesmos)
  result.contactFields = [
    {
      key: 'name',
      label: 'Nome',
      completed: !!quoteContext.customerData?.name,
      required: false,
    },
    {
      key: 'phone',
      label: 'Telefone',
      completed: !!quoteContext.customerData?.phone,
      required: true,
    },
    {
      key: 'email',
      label: 'Email',
      completed: !!quoteContext.customerData?.email,
      required: false,
    },
  ]

  return result
}
