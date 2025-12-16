import { z } from 'zod'

/**
 * Enum de todos os status possíveis de uma ordem
 */
const orderStatusEnum = z.enum(
  [
    'ORCAMENTO_ENVIADO',
    'AGUARDANDO_PAGAMENTO',
    'APROVADO',
    'EM_PRODUCAO',
    'PRONTO_ENTREGA',
    'INSTALACAO_AGENDADA',
    'INSTALANDO',
    'CONCLUIDO',
    'CANCELADO',
    'AGUARDANDO_CLIENTE',
    'EM_REVISAO',
  ],
  {
    errorMap: () => ({ message: 'Status de ordem inválido' }),
  }
)

/**
 * Schema para atualizar status de uma ordem
 * Usado por admins para mover ordem através do workflow
 */
export const updateOrderStatusSchema = z.object({
  status: orderStatusEnum,
  internalNotes: z
    .string()
    .max(500, 'Notas internas devem ter no máximo 500 caracteres')
    .optional(),
  notifyCustomer: z.boolean().default(true), // Enviar notificação ao cliente?
})

/**
 * Schema para query de ordens (filtros e paginação)
 * Usado tanto por admin quanto por cliente (com filtro de userId)
 */
export const orderQuerySchema = z.object({
  status: orderStatusEnum.optional(),
  userId: z.string().cuid('ID de usuário inválido').optional(),
  paymentStatus: z.enum(['PENDING', 'PARTIAL', 'PAID', 'REFUNDED']).optional(),
  dateFrom: z.string().datetime('Data inicial inválida').optional(),
  dateTo: z.string().datetime('Data final inválida').optional(),
  search: z.string().optional(), // busca por number, customer name, email
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
  orderBy: z.enum(['createdAt', 'updatedAt', 'total', 'number']).default('createdAt'),
  order: z.enum(['asc', 'desc']).default('desc'),
})

/**
 * Schema para atualizar dados gerais de uma ordem (admin)
 * Permite atualizar endereço de serviço, valores, etc
 */
export const updateOrderSchema = z
  .object({
    id: z.string().cuid('ID de ordem inválido'),

    // Endereço de serviço (opcional)
    serviceStreet: z.string().optional(),
    serviceNumber: z.string().optional(),
    serviceComplement: z.string().optional(),
    serviceNeighborhood: z.string().optional(),
    serviceCity: z.string().optional(),
    serviceState: z.string().length(2, 'Estado deve ter 2 caracteres').optional(),
    serviceZipCode: z
      .string()
      .regex(/^\d{5}-?\d{3}$/, 'CEP inválido')
      .optional(),

    // Valores (opcional)
    subtotal: z.number().min(0).optional(),
    discount: z.number().min(0).optional(),
    installationFee: z.number().min(0).optional(),

    // Datas estimadas
    estimatedDelivery: z.string().datetime().optional().nullable(),

    // Notas
    internalNotes: z.string().max(1000).optional(),
  })
  .partial()

/**
 * Type inference para TypeScript
 */
export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>
export type OrderQuery = z.infer<typeof orderQuerySchema>
export type UpdateOrderInput = z.infer<typeof updateOrderSchema>
export type OrderStatus = z.infer<typeof orderStatusEnum>
