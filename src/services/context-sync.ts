/**
 * OMNICHANNEL Sprint 1: Context Synchronization Service
 *
 * Sincroniza contexto bidirecional entre Web Chat e WhatsApp
 * após cada mensagem em qualquer canal.
 */

import { prisma } from '@/lib/prisma'
import { logger } from '@/lib/logger'
import type { AiQuoteContext } from '@/lib/ai-quote-transformer'
import type { ConversationContext } from './conversation'

/**
 * Sincroniza contexto bidirecional após cada mensagem
 *
 * @param aiConversationId - ID da conversa web (AiConversation)
 * @param whatsappConversationId - ID da conversa WhatsApp (Conversation)
 */
export async function syncContextBidirectional(
  aiConversationId: string,
  whatsappConversationId: string
): Promise<void> {
  try {
    logger.debug('[CONTEXT SYNC] Starting bidirectional sync:', {
      aiConversationId,
      whatsappConversationId,
    })

    // 1. Buscar ambas conversas
    const [aiConvo, whatsappConvo] = await Promise.all([
      prisma.aiConversation.findUnique({
        where: { id: aiConversationId },
        select: { quoteContext: true, updatedAt: true },
      }),
      prisma.conversation.findUnique({
        where: { id: whatsappConversationId },
        select: { context: true, updatedAt: true },
      }),
    ])

    if (!aiConvo || !whatsappConvo) {
      logger.warn('[CONTEXT SYNC] One or both conversations not found')
      return
    }

    // 2. Mesclar contextos
    const webContext = aiConvo.quoteContext as AiQuoteContext | null
    const whatsappContext = whatsappConvo.context as ConversationContext | null

    const mergedQuoteContext = mergeQuoteContexts(webContext, whatsappContext)

    // 3. Atualizar ambos em transação
    await prisma.$transaction([
      prisma.aiConversation.update({
        where: { id: aiConversationId },
        data: {
          quoteContext: mergedQuoteContext as any, // Prisma JSON type
          updatedAt: new Date(),
        },
      }),
      prisma.conversation.update({
        where: { id: whatsappConversationId },
        data: {
          context: {
            ...(whatsappContext || {}),
            webChatData: mergedQuoteContext,
            lastSync: new Date().toISOString(),
          } as any, // Prisma JSON type
        },
      }),
    ])

    logger.info('[CONTEXT SYNC] Bidirectional sync completed successfully', {
      aiConversationId,
      whatsappConversationId,
      itemsCount: mergedQuoteContext?.items?.length || 0,
    })
  } catch (error) {
    logger.error('[CONTEXT SYNC] Error during sync:', error)
    // Não lançar erro - sync é best-effort
  }
}

/**
 * Mescla quoteContext de web e WhatsApp de forma inteligente
 *
 * Regras:
 * - Items: união sem duplicatas (por category + dimensions)
 * - CustomerData: preferir web (mais completo), preencher gaps com WhatsApp
 * - ScheduleData: última informação prevalece
 */
function mergeQuoteContexts(
  webContext: AiQuoteContext | null,
  whatsappContext: ConversationContext | null
): AiQuoteContext {
  // Items: união sem duplicatas
  const webItems = webContext?.items || []
  const whatsappItems = extractItemsFromWhatsAppContext(whatsappContext) || []

  const mergedItems = deduplicateItems([...webItems, ...whatsappItems])

  // CustomerData: preferir web, preencher gaps com WhatsApp
  const mergedCustomer = {
    ...(whatsappContext?.customerName && { name: whatsappContext.customerName }),
    ...(webContext?.customerData || {}),
  }

  // ScheduleData: última informação prevalece (prefer web se existir)
  const mergedSchedule = webContext?.scheduleData || extractScheduleFromWhatsApp(whatsappContext)

  return {
    items: mergedItems,
    customerData: Object.keys(mergedCustomer).length > 0 ? mergedCustomer : undefined,
    scheduleData: mergedSchedule,
  }
}

/**
 * Extrai items do contexto WhatsApp (formato livre)
 *
 * WhatsApp armazena em formato diferente: { product, measurements, etc }
 * Precisamos converter para AiQuoteContext.items[]
 */
function extractItemsFromWhatsAppContext(
  whatsappContext: ConversationContext | null
): NonNullable<AiQuoteContext['items']> {
  if (!whatsappContext) return []

  const items: NonNullable<AiQuoteContext['items']> = []

  // Se WhatsApp tem product e measurements, criar um item
  if (whatsappContext.product) {
    const item: NonNullable<AiQuoteContext['items']>[number] = {
      category: whatsappContext.product,
      productName: whatsappContext.product,
      description: whatsappContext.measurements || undefined,
    }

    // Tentar parsear medidas (ex: "2.0x1.5")
    if (whatsappContext.measurements) {
      const dimensionMatch = whatsappContext.measurements.match(/(\d+\.?\d*)\s*x\s*(\d+\.?\d*)/)
      if (dimensionMatch) {
        item.width = parseFloat(dimensionMatch[1])
        item.height = parseFloat(dimensionMatch[2])
      }
    }

    items.push(item)
  }

  return items
}

/**
 * Extrai informações de agendamento do contexto WhatsApp
 */
function extractScheduleFromWhatsApp(
  whatsappContext: ConversationContext | null
): AiQuoteContext['scheduleData'] | undefined {
  if (!whatsappContext?.appointmentDate) return undefined

  return {
    type: 'VISITA_TECNICA', // Default
    date: whatsappContext.appointmentDate,
    notes: undefined,
  }
}

/**
 * Remove items duplicados baseado em categoria + dimensões
 *
 * Dois items são considerados duplicados se tiverem:
 * - Mesma categoria
 * - Mesmas dimensões (width + height)
 */
function deduplicateItems(
  items: NonNullable<AiQuoteContext['items']>
): NonNullable<AiQuoteContext['items']> {
  if (!items || items.length === 0) return []

  const seen = new Set<string>()
  const unique: NonNullable<AiQuoteContext['items']> = []

  for (const item of items) {
    // Criar key baseada em category + dimensions
    const key = [item.category || 'unknown', item.width || 0, item.height || 0].join('-')

    if (!seen.has(key)) {
      seen.add(key)
      unique.push(item)
    }
  }

  return unique
}

/**
 * Verifica se uma conversa tem link ativo com outro canal
 *
 * Retorna IDs das conversas linkadas se existirem
 */
export async function getLinkedConversations(params: {
  aiConversationId?: string
  whatsappConversationId?: string
}): Promise<{
  aiConversationId?: string
  whatsappConversationId?: string
} | null> {
  const { aiConversationId, whatsappConversationId } = params

  try {
    if (aiConversationId) {
      const aiConvo = await prisma.aiConversation.findUnique({
        where: { id: aiConversationId },
        select: { whatsappConversationId: true },
      })

      if (aiConvo?.whatsappConversationId) {
        return {
          aiConversationId,
          whatsappConversationId: aiConvo.whatsappConversationId,
        }
      }
    }

    if (whatsappConversationId) {
      const whatsappConvo = await prisma.conversation.findUnique({
        where: { id: whatsappConversationId },
        select: { websiteChatId: true },
      })

      if (whatsappConvo?.websiteChatId) {
        return {
          aiConversationId: whatsappConvo.websiteChatId,
          whatsappConversationId,
        }
      }
    }

    return null
  } catch (error) {
    logger.error('[CONTEXT SYNC] Error getting linked conversations:', error)
    return null
  }
}

/**
 * Auto-sync após mensagem web
 * Chama do endpoint /api/ai/chat após salvar mensagem
 */
export async function autoSyncAfterWebMessage(aiConversationId: string): Promise<void> {
  const linked = await getLinkedConversations({ aiConversationId })

  if (linked?.whatsappConversationId) {
    logger.debug('[AUTO-SYNC] Triggering sync after web message:', linked)
    await syncContextBidirectional(linked.aiConversationId!, linked.whatsappConversationId)
  }
}

/**
 * Auto-sync após mensagem WhatsApp
 * Chama do processIncomingMessage após salvar mensagem
 */
export async function autoSyncAfterWhatsAppMessage(whatsappConversationId: string): Promise<void> {
  const linked = await getLinkedConversations({ whatsappConversationId })

  if (linked?.aiConversationId) {
    logger.debug('[AUTO-SYNC] Triggering sync after WhatsApp message:', linked)
    await syncContextBidirectional(linked.aiConversationId, linked.whatsappConversationId!)
  }
}
