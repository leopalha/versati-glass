/**
 * AI-CHAT Sprint P1.4: AI Quote Validation Schemas
 *
 * Zod schemas for validating AI-collected quote data before
 * importing into the quote wizard.
 */

import { z } from 'zod'

// Schema for a single quote item from AI
export const aiQuoteItemSchema = z.object({
  category: z
    .enum([
      'BOX',
      'ESPELHOS',
      'VIDROS',
      'PORTAS',
      'JANELAS',
      'GUARDA_CORPO',
      'GUARDA_CORPOS', // alias
      'CORTINAS_VIDRO',
      'PERGOLADOS',
      'TAMPOS_PRATELEIRAS',
      'TAMPOS', // alias
      'DIVISORIAS',
      'FECHAMENTOS',
      'FACHADAS',
      'PAINEIS_DECORATIVOS',
      'FERRAGENS',
      'KITS',
      'SERVICOS',
      'CORRIMAOS',
      'OUTROS',
    ])
    .optional(),
  productName: z.string().min(1).max(200).optional(),
  productSlug: z.string().min(1).max(200).optional(),
  description: z.string().max(1000).optional(),
  width: z.number().min(0.01).max(20).optional(), // Max 20 meters
  height: z.number().min(0.01).max(20).optional(),
  quantity: z.number().int().min(1).max(100).optional(),
  // Options
  color: z.string().max(100).optional(),
  finish: z.string().max(100).optional(),
  thickness: z.string().max(50).optional(),
  glassType: z.string().max(100).optional(),
  glassColor: z.string().max(100).optional(),
  model: z.string().max(100).optional(),
  finishLine: z.string().max(100).optional(),
  ledTemp: z.string().max(50).optional(),
  shape: z.string().max(100).optional(),
  bisoteWidth: z.string().max(50).optional(),
  images: z.array(z.string().url()).max(10).optional(),
  estimatedPrice: z.number().min(0).max(1000000).optional(),
})

// Schema for customer data from AI
export const aiCustomerDataSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  email: z.string().email().max(200).optional(),
  phone: z.string().min(8).max(20).optional(),
  cpfCnpj: z.string().max(20).optional(),
  street: z.string().max(200).optional(),
  number: z.string().max(20).optional(),
  complement: z.string().max(100).optional(),
  neighborhood: z.string().max(100).optional(),
  city: z.string().max(100).optional(),
  state: z.string().max(2).optional(),
  zipCode: z.string().max(10).optional(),
})

// Schema for schedule data from AI
export const aiScheduleDataSchema = z.object({
  type: z.enum(['VISITA_TECNICA', 'INSTALACAO']).optional(),
  date: z.string().optional(), // ISO date string
  time: z.string().optional(), // HH:MM format
  notes: z.string().max(500).optional(),
})

// Schema for complete AI quote context
export const aiQuoteContextSchema = z.object({
  items: z.array(aiQuoteItemSchema).min(1).max(50).optional(),
  customerData: aiCustomerDataSchema.optional(),
  scheduleData: aiScheduleDataSchema.optional(),
})

// Type inference
export type AiQuoteItemInput = z.infer<typeof aiQuoteItemSchema>
export type AiCustomerDataInput = z.infer<typeof aiCustomerDataSchema>
export type AiScheduleDataInput = z.infer<typeof aiScheduleDataSchema>
export type AiQuoteContextInput = z.infer<typeof aiQuoteContextSchema>

/**
 * Validate AI quote context and return errors or validated data
 */
export function validateAiQuoteContext(context: unknown): {
  success: boolean
  data?: AiQuoteContextInput
  errors?: string[]
} {
  try {
    const result = aiQuoteContextSchema.safeParse(context)

    if (!result.success) {
      const errors = result.error.errors.map((err) => {
        const path = err.path.join('.')
        return `${path}: ${err.message}`
      })

      return {
        success: false,
        errors,
      }
    }

    // Additional business logic validation
    const validationErrors: string[] = []

    // Check if at least one item has required data
    if (!result.data.items || result.data.items.length === 0) {
      validationErrors.push('At least one product item is required')
    } else {
      const hasValidItem = result.data.items.some((item) => {
        return item.category && (item.width || item.height)
      })

      if (!hasValidItem) {
        validationErrors.push('At least one item must have category and dimensions')
      }
    }

    if (validationErrors.length > 0) {
      return {
        success: false,
        errors: validationErrors,
      }
    }

    return {
      success: true,
      data: result.data,
    }
  } catch (error) {
    return {
      success: false,
      errors: ['Validation error: ' + (error instanceof Error ? error.message : 'Unknown error')],
    }
  }
}

/**
 * Check if quote context has minimum required data for export
 */
export function canExportQuote(context: unknown): boolean {
  const validation = validateAiQuoteContext(context)
  return validation.success
}
