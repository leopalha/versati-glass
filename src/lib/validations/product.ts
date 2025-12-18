import { z } from 'zod'

/**
 * Schema para criar um novo produto
 * Validações:
 * - Nome mínimo 3 caracteres
 * - Descrição mínima 10 caracteres
 * - Categoria obrigatória
 * - PriceType condicional: FIXED requer basePrice, PER_M2 requer pricePerM2
 */
export const createProductSchema = z
  .object({
    name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
    slug: z.string().optional(), // auto-gerado se não fornecido
    description: z.string().min(10, 'Descrição deve ter no mínimo 10 caracteres'),
    shortDescription: z.string().optional(),

    category: z.enum(
      [
        'BOX',
        'ESPELHOS',
        'VIDROS',
        'PORTAS',
        'JANELAS',
        'GUARDA_CORPO',
        'CORTINAS_VIDRO',
        'PERGOLADOS',
        'TAMPOS_PRATELEIRAS',
        'DIVISORIAS',
        'FECHAMENTOS',
        'FERRAGENS',
        'KITS',
        'SERVICOS',
        'OUTROS',
      ],
      {
        errorMap: () => ({ message: 'Categoria inválida' }),
      }
    ),
    subcategory: z.string().optional(),

    images: z.array(z.string().url('URL de imagem inválida')).default([]),
    thumbnail: z.string().url('URL de thumbnail inválida').optional(),

    priceType: z.enum(['FIXED', 'PER_M2', 'QUOTE_ONLY'], {
      errorMap: () => ({ message: 'Tipo de preço inválido' }),
    }),
    basePrice: z.number().min(0, 'Preço base deve ser maior ou igual a zero').optional().nullable(),
    pricePerM2: z
      .number()
      .min(0, 'Preço por m² deve ser maior ou igual a zero')
      .optional()
      .nullable(),
    priceRangeMin: z
      .number()
      .min(0, 'Preço mínimo deve ser maior ou igual a zero')
      .optional()
      .nullable(),
    priceRangeMax: z
      .number()
      .min(0, 'Preço máximo deve ser maior ou igual a zero')
      .optional()
      .nullable(),

    colors: z.array(z.string()).default([]),
    finishes: z.array(z.string()).default([]),
    thicknesses: z.array(z.string()).default([]),

    isActive: z.boolean().default(true),
    isFeatured: z.boolean().default(false),

    metaTitle: z.string().max(60, 'Meta title deve ter no máximo 60 caracteres').optional(),
    metaDescription: z
      .string()
      .max(160, 'Meta description deve ter no máximo 160 caracteres')
      .optional(),
  })
  .refine(
    (data) => {
      // Validação: se priceType = FIXED, deve ter basePrice
      if (data.priceType === 'FIXED' && !data.basePrice) {
        return false
      }
      return true
    },
    {
      message: 'Produtos com preço fixo devem ter um valor base definido',
      path: ['basePrice'],
    }
  )
  .refine(
    (data) => {
      // Se priceType = PER_M2, deve ter pricePerM2
      if (data.priceType === 'PER_M2' && !data.pricePerM2) {
        return false
      }
      return true
    },
    {
      message: 'Produtos com preço por m² devem ter um valor por m² definido',
      path: ['pricePerM2'],
    }
  )
  .refine(
    (data) => {
      // Se tem priceRangeMax, deve ter priceRangeMin
      if (data.priceRangeMax && !data.priceRangeMin) {
        return false
      }
      return true
    },
    {
      message: 'Faixa de preço deve ter valor mínimo e máximo',
      path: ['priceRangeMin'],
    }
  )
  .refine(
    (data) => {
      // Se tem range, min deve ser menor que max
      if (data.priceRangeMin && data.priceRangeMax && data.priceRangeMin >= data.priceRangeMax) {
        return false
      }
      return true
    },
    {
      message: 'Preço mínimo deve ser menor que o preço máximo',
      path: ['priceRangeMax'],
    }
  )

/**
 * Schema base para produto (sem refines)
 */
const productBaseSchema = z.object({
  name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  slug: z.string().optional(),
  description: z.string().min(10, 'Descrição deve ter no mínimo 10 caracteres'),
  shortDescription: z.string().optional(),
  category: z
    .enum([
      'BOX',
      'ESPELHOS',
      'VIDROS',
      'PORTAS',
      'JANELAS',
      'GUARDA_CORPO',
      'CORTINAS_VIDRO',
      'PERGOLADOS',
      'TAMPOS_PRATELEIRAS',
      'DIVISORIAS',
      'FECHAMENTOS',
      'FERRAGENS',
      'KITS',
      'SERVICOS',
      'OUTROS',
    ])
    .optional(),
  subcategory: z.string().optional(),
  images: z.array(z.string().url('URL de imagem inválida')).optional(),
  thumbnail: z.string().url('URL de thumbnail inválida').optional().nullable(),
  priceType: z.enum(['FIXED', 'PER_M2', 'QUOTE_ONLY']).optional(),
  basePrice: z.number().min(0).optional().nullable(),
  pricePerM2: z.number().min(0).optional().nullable(),
  priceRangeMin: z.number().min(0).optional().nullable(),
  priceRangeMax: z.number().min(0).optional().nullable(),
  colors: z.array(z.string()).optional(),
  finishes: z.array(z.string()).optional(),
  thicknesses: z.array(z.string()).optional(),
  isActive: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
  metaTitle: z.string().max(60).optional().nullable(),
  metaDescription: z.string().max(160).optional().nullable(),
})

/**
 * Schema para atualizar um produto existente
 * Todos os campos são opcionais
 */
export const updateProductSchema = productBaseSchema.extend({
  id: z.string().cuid('ID de produto inválido'),
})

/**
 * Schema para query de produtos (filtros e paginação)
 */
export const productQuerySchema = z.object({
  category: z
    .enum([
      'BOX',
      'ESPELHOS',
      'VIDROS',
      'PORTAS',
      'JANELAS',
      'GUARDA_CORPO',
      'CORTINAS_VIDRO',
      'PERGOLADOS',
      'TAMPOS_PRATELEIRAS',
      'DIVISORIAS',
      'FECHAMENTOS',
      'FERRAGENS',
      'KITS',
      'SERVICOS',
      'OUTROS',
    ])
    .optional(),
  featured: z
    .enum(['true', 'false'])
    .optional()
    .transform((val) => val === 'true'),
  active: z
    .enum(['true', 'false'])
    .optional()
    .transform((val) => val === 'true'),
  search: z.string().optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
  orderBy: z.enum(['name', 'createdAt', 'updatedAt', 'category']).default('createdAt'),
  order: z.enum(['asc', 'desc']).default('desc'),
})

/**
 * Type inference para TypeScript
 */
export type CreateProductInput = z.infer<typeof createProductSchema>
export type UpdateProductInput = z.infer<typeof updateProductSchema>
export type ProductQuery = z.infer<typeof productQuerySchema>
