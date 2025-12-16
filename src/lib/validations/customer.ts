import { z } from 'zod'

/**
 * Schema para query de clientes/usuários (admin)
 * Permite filtrar e buscar clientes com diferentes critérios
 */
export const customerQuerySchema = z.object({
  search: z.string().optional(), // busca por name, email, phone, cpfCnpj
  role: z.enum(['CUSTOMER', 'ADMIN', 'STAFF']).optional(),
  minOrders: z.coerce.number().min(0).optional(), // clientes com no mínimo X pedidos
  maxOrders: z.coerce.number().min(0).optional(),
  dateFrom: z.string().datetime('Data inicial inválida').optional(), // data de cadastro
  dateTo: z.string().datetime('Data final inválida').optional(),
  hasOrders: z
    .enum(['true', 'false'])
    .optional()
    .transform((val) => val === 'true'), // apenas clientes com pedidos
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(50),
  orderBy: z.enum(['name', 'email', 'createdAt', 'lastLoginAt']).default('createdAt'),
  order: z.enum(['asc', 'desc']).default('desc'),
})

/**
 * Schema para atualizar dados de um cliente (admin)
 * Admin pode alterar role, dados pessoais, endereço
 */
export const updateCustomerSchema = z
  .object({
    id: z.string().cuid('ID de cliente inválido'),

    // Dados pessoais
    name: z.string().min(2, 'Nome deve ter no mínimo 2 caracteres').optional(),
    email: z.string().email('Email inválido').optional(),
    phone: z
      .string()
      .regex(/^\(\d{2}\) \d{4,5}-\d{4}$/, 'Telefone inválido (formato: (XX) XXXXX-XXXX)')
      .optional(),
    cpfCnpj: z.string().optional(),

    // Endereço
    street: z.string().optional(),
    number: z.string().optional(),
    complement: z.string().optional(),
    neighborhood: z.string().optional(),
    city: z.string().optional(),
    state: z.string().length(2, 'Estado deve ter 2 caracteres').optional(),
    zipCode: z
      .string()
      .regex(/^\d{5}-?\d{3}$/, 'CEP inválido')
      .optional(),

    // Role (apenas admin pode alterar)
    role: z.enum(['CUSTOMER', 'ADMIN', 'STAFF']).optional(),

    // Verificações
    emailVerified: z.boolean().optional(),
    phoneVerified: z.boolean().optional(),
  })
  .partial()

/**
 * Schema para estatísticas de cliente
 * Usado para calcular total gasto, número de pedidos, etc
 */
export const customerStatsSchema = z.object({
  totalOrders: z.number().default(0),
  totalQuotes: z.number().default(0),
  totalSpent: z.number().default(0),
  averageOrderValue: z.number().default(0),
  lastOrderDate: z.date().nullable().default(null),
  lifetimeValue: z.number().default(0),
})

/**
 * Type inference para TypeScript
 */
export type CustomerQuery = z.infer<typeof customerQuerySchema>
export type UpdateCustomerInput = z.infer<typeof updateCustomerSchema>
export type CustomerStats = z.infer<typeof customerStatsSchema>
