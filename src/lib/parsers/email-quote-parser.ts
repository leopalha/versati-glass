export interface ParsedEmailQuote {
  supplierEmail: string
  quoteNumber: string | null
  values: {
    subtotal?: number
    shipping?: number
    labor?: number
    material?: number
    total?: number
  }
  deliveryDays?: number
  notes?: string
  confidence: 'HIGH' | 'MEDIUM' | 'LOW'
  rawBody: string
}

export interface ResendInboundWebhook {
  from: string
  to: string
  subject: string
  html: string
  text: string
  attachments?: Array<{
    filename: string
    content: string // Base64
    contentType: string
  }>
}

export function parseSupplierEmail(email: ResendInboundWebhook): ParsedEmailQuote {
  const body = email.text || stripHtml(email.html)

  // 1. EXTRAIR NÚMERO DO ORÇAMENTO
  const quoteNumber = extractQuoteNumber(email.subject, body)

  // 2. EXTRAIR VALORES MONETÁRIOS
  const monetaryValues = extractMonetaryValues(body)

  // 3. IDENTIFICAR QUAL VALOR É O QUÊ
  const categorized = categorizeValues(body, monetaryValues)

  // 4. EXTRAIR PRAZO
  const deliveryDays = extractDeliveryDays(body)

  // 5. CALCULAR CONFIANÇA
  const confidence = calculateConfidence({
    hasQuoteNumber: !!quoteNumber,
    hasTotal: !!categorized.total,
    valuesCategorized: Object.keys(categorized).length > 1,
  })

  return {
    supplierEmail: email.from,
    quoteNumber,
    values: categorized,
    deliveryDays,
    notes: body.slice(0, 500), // Primeiros 500 chars
    confidence,
    rawBody: body,
  }
}

// REGEX HELPERS

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
}

function extractQuoteNumber(subject: string, body: string): string | null {
  // Padrão: ORC-2024-0123 ou #ORC-2024-0123
  const pattern = /#?ORC-\d{4}-\d{4,}/i
  return (subject.match(pattern) || body.match(pattern))?.[0]?.replace('#', '') || null
}

function extractMonetaryValues(text: string): number[] {
  // Detecta: "R$ 2.500,00", "R$2500", "2.500 reais", "2500.00"
  const patterns = [
    /R\$\s?([\d.]+,\d{2})/g, // R$ 2.500,00
    /R\$\s?([\d.]+)/g, // R$ 2500
    /([\d.]+,\d{2})\s*reais?/gi, // 2.500,00 reais
    /([\d.]+)\s*reais?/gi, // 2500 reais
  ]

  const values: number[] = []

  patterns.forEach((pattern) => {
    let match
    const regex = new RegExp(pattern.source, pattern.flags)
    while ((match = regex.exec(text)) !== null) {
      const numStr = match[1].replace(/\./g, '').replace(',', '.')
      const num = parseFloat(numStr)
      if (!isNaN(num) && num > 0 && num < 1000000) {
        values.push(num)
      }
    }
  })

  return Array.from(new Set(values)).sort((a, b) => b - a) // Unique, desc
}

function categorizeValues(body: string, values: number[]): Record<string, number> {
  if (values.length === 0) return {}

  const result: Record<string, number> = {}

  // Procurar por palavras-chave próximas aos valores
  const keywords = {
    total: ['total', 'valor total', 'soma', 'final'],
    subtotal: ['subtotal', 'material', 'vidro', 'produto'],
    shipping: ['frete', 'entrega', 'transporte'],
    labor: ['mão de obra', 'mao de obra', 'instalação', 'instalacao', 'montagem'],
    material: ['material adicional', 'extras', 'acessórios', 'acessorios'],
  }

  values.forEach((value) => {
    // Encontrar contexto (50 chars antes e depois do valor)
    const valueStr = value.toFixed(2).replace('.', ',')
    const index = body.toLowerCase().indexOf(valueStr.toLowerCase())
    if (index === -1) return

    const context = body.slice(Math.max(0, index - 50), index + 50).toLowerCase()

    // Tentar categorizar
    for (const [category, terms] of Object.entries(keywords)) {
      if (terms.some((term) => context.includes(term))) {
        if (!result[category]) {
          // Evitar sobrescrever
          result[category] = value
        }
        return
      }
    }
  })

  // Fallback: se não categorizou nenhum, pegar o maior como total
  if (Object.keys(result).length === 0 && values.length > 0) {
    result.total = values[0]
  }

  return result
}

function extractDeliveryDays(body: string): number | undefined {
  // Padrões: "7 dias", "uma semana", "15 dias úteis", "1 semana"
  const patterns = [
    /(\d+)\s*dias?\s*(úteis|uteis|corridos)?/i,
    /(uma|1)\s*semanas?/i,
    /(duas|2)\s*semanas?/i,
  ]

  for (const pattern of patterns) {
    const match = body.match(pattern)
    if (match) {
      if (match[0].includes('semana')) {
        return match[1] === 'duas' || match[1] === '2' ? 14 : 7
      }
      return parseInt(match[1])
    }
  }

  return undefined
}

function calculateConfidence(criteria: {
  hasQuoteNumber: boolean
  hasTotal: boolean
  valuesCategorized: boolean
}): 'HIGH' | 'MEDIUM' | 'LOW' {
  const score =
    (criteria.hasQuoteNumber ? 40 : 0) +
    (criteria.hasTotal ? 40 : 0) +
    (criteria.valuesCategorized ? 20 : 0)

  if (score >= 80) return 'HIGH'
  if (score >= 50) return 'MEDIUM'
  return 'LOW'
}
