import { prisma } from '@/lib/prisma'
import { logger } from '@/lib/logger'
import type { QuoteSource, QuoteStatus } from '@prisma/client'

export interface UnifiedCustomerContext {
  // Identificação
  userId?: string
  sessionId?: string
  phoneNumber?: string | null
  customerName?: string

  // Histórico de conversas
  webConversations: Array<{
    id: string
    createdAt: Date
    messageCount: number
    quoteContext?: any
    status: string
  }>

  whatsappConversations: Array<{
    id: string
    createdAt: Date
    messageCount: number
    context?: any
    status: string
  }>

  // Orçamentos relacionados
  quotes: Array<{
    id: string
    number: string
    total: number
    status: QuoteStatus
    source: QuoteSource
  }>

  // Contexto mesclado
  mergedContext: {
    products?: string[] // Produtos mencionados em qualquer canal
    measurements?: Record<string, any>
    preferences?: Record<string, any>
    lastChannel: 'WEB' | 'WHATSAPP'
    totalInteractions: number
  }
}

/**
 * FASE-5: Busca contexto unificado de um cliente através de múltiplos canais
 */
export async function getUnifiedCustomerContext(params: {
  userId?: string
  phoneNumber?: string
  sessionId?: string
}): Promise<UnifiedCustomerContext | null> {
  const { userId, phoneNumber, sessionId } = params

  logger.debug('[UNIFIED CONTEXT] Fetching for:', { userId, phoneNumber, sessionId })

  try {
    // 1. Buscar todas as conversas web
    const webConversations = await prisma.aiConversation.findMany({
      where: {
        OR: [
          userId ? { userId } : undefined,
          sessionId ? { sessionId } : undefined,
          phoneNumber ? { customerPhone: phoneNumber } : undefined,
        ].filter(Boolean) as any[],
      },
      include: {
        messages: { select: { id: true } },
      },
      orderBy: { createdAt: 'desc' },
    })

    logger.debug(`[UNIFIED CONTEXT] Found ${webConversations.length} web conversations`)

    // 2. Buscar todas as conversas WhatsApp
    const whatsappConversations = await prisma.conversation.findMany({
      where: {
        OR: [
          userId ? { userId } : undefined,
          phoneNumber ? { phoneNumber } : undefined,
          // Buscar por IDs linkados via quoteId
          webConversations.length > 0
            ? {
                quoteId: { in: webConversations.map((c) => c.quoteId).filter(Boolean) as string[] },
              }
            : undefined,
        ].filter(Boolean) as any[],
      },
      include: {
        messages: { select: { id: true } },
      },
      orderBy: { createdAt: 'desc' },
    })

    logger.debug(`[UNIFIED CONTEXT] Found ${whatsappConversations.length} WhatsApp conversations`)

    // 3. Buscar quotes relacionados
    const quoteIds = [
      ...webConversations.map((c) => c.quoteId).filter(Boolean),
      ...whatsappConversations.map((c) => c.quoteId).filter(Boolean),
    ] as string[]

    const quotes =
      quoteIds.length > 0
        ? await prisma.quote.findMany({
            where: { id: { in: quoteIds } },
            select: {
              id: true,
              number: true,
              total: true,
              status: true,
              source: true,
            },
          })
        : []

    logger.debug(`[UNIFIED CONTEXT] Found ${quotes.length} quotes`)

    // 4. Mesclar contextos
    const mergedContext = mergeContexts(webConversations, whatsappConversations)

    // 5. Determinar dados primários
    const primaryName = webConversations[0]?.customerName || whatsappConversations[0]?.customerName
    const primaryPhone =
      phoneNumber || webConversations[0]?.customerPhone || whatsappConversations[0]?.phoneNumber

    const context: UnifiedCustomerContext = {
      userId,
      sessionId,
      phoneNumber: primaryPhone,
      customerName: primaryName || undefined,

      webConversations: webConversations.map((c) => ({
        id: c.id,
        createdAt: c.createdAt,
        messageCount: c.messages.length,
        quoteContext: c.quoteContext,
        status: c.status,
      })),

      whatsappConversations: whatsappConversations.map((c) => ({
        id: c.id,
        createdAt: c.createdAt,
        messageCount: c.messages.length,
        context: c.context,
        status: c.status,
      })),

      quotes: quotes.map((q) => ({
        id: q.id,
        number: q.number,
        total: Number(q.total),
        status: q.status,
        source: q.source,
      })),

      mergedContext,
    }

    return context
  } catch (error) {
    logger.error('[UNIFIED CONTEXT] Error fetching:', error)
    return null
  }
}

/**
 * Mescla contextos de Web Chat e WhatsApp
 */
function mergeContexts(
  webConvos: any[],
  whatsappConvos: any[]
): UnifiedCustomerContext['mergedContext'] {
  const allProducts = new Set<string>()
  const allMeasurements: Record<string, any> = {}
  const allPreferences: Record<string, any> = {}

  // Processar Web Chat
  webConvos.forEach((c) => {
    if (c.quoteContext?.items) {
      c.quoteContext.items.forEach((item: any) => {
        if (item.category) allProducts.add(item.category)
        if (item.width && item.height) {
          allMeasurements[item.category] = { width: item.width, height: item.height }
        }
        if (item.color) {
          allPreferences[`${item.category}_color`] = item.color
        }
      })
    }
  })

  // Processar WhatsApp
  whatsappConvos.forEach((c) => {
    if (c.context?.product) allProducts.add(c.context.product)
    if (c.context?.measurements) {
      Object.assign(allMeasurements, c.context.measurements)
    }
    if (c.context?.preferences) {
      Object.assign(allPreferences, c.context.preferences)
    }
  })

  const lastWeb = webConvos[0]
  const lastWhatsApp = whatsappConvos[0]
  const lastChannel =
    !lastWeb && !lastWhatsApp
      ? 'WEB'
      : !lastWeb
        ? 'WHATSAPP'
        : !lastWhatsApp
          ? 'WEB'
          : lastWeb.createdAt > lastWhatsApp.createdAt
            ? 'WEB'
            : 'WHATSAPP'

  return {
    products: Array.from(allProducts),
    measurements: allMeasurements,
    preferences: allPreferences,
    lastChannel,
    totalInteractions: webConvos.length + whatsappConvos.length,
  }
}

/**
 * Linka conversa web com WhatsApp quando telefone é fornecido
 */
export async function linkWebChatToWhatsApp(
  aiConversationId: string,
  phoneNumber: string
): Promise<{ success: boolean; whatsappConversationId?: string }> {
  try {
    // Normalizar telefone (remover caracteres não numéricos)
    const normalizedPhone = phoneNumber.replace(/\D/g, '')

    logger.debug('[LINK WEB→WA] Linking:', { aiConversationId, normalizedPhone })

    // Atualizar AiConversation com telefone
    await prisma.aiConversation.update({
      where: { id: aiConversationId },
      data: { customerPhone: normalizedPhone },
    })

    // Buscar Conversation ativa no WhatsApp
    const whatsappConvo = await prisma.conversation.findFirst({
      where: {
        phoneNumber: normalizedPhone,
        status: { in: ['ACTIVE', 'WAITING_HUMAN'] },
      },
    })

    if (whatsappConvo) {
      logger.debug('[LINK WEB→WA] Found existing WhatsApp conversation:', whatsappConvo.id)

      // Link via shared quote if exists
      const aiConvo = await prisma.aiConversation.findUnique({
        where: { id: aiConversationId },
        select: { quoteId: true },
      })

      if (aiConvo?.quoteId && !whatsappConvo.quoteId) {
        // Update WhatsApp conversation with the same quoteId
        await prisma.conversation.update({
          where: { id: whatsappConvo.id },
          data: { quoteId: aiConvo.quoteId },
        })
      }

      return { success: true, whatsappConversationId: whatsappConvo.id }
    }

    logger.debug('[LINK WEB→WA] No active WhatsApp conversation found')
    return { success: true } // Telefone salvo, mas sem conversa WA ainda
  } catch (error) {
    logger.error('[LINK WEB→WA] Error:', error)
    return { success: false }
  }
}

/**
 * Transfere contexto de Web Chat para WhatsApp
 */
export async function transferContextToWhatsApp(
  aiConversationId: string,
  whatsappConversationId: string
): Promise<{ success: boolean }> {
  try {
    logger.debug('[TRANSFER CONTEXT] From web to WhatsApp:', {
      aiConversationId,
      whatsappConversationId,
    })

    // Buscar contexto do web chat
    const aiConvo = await prisma.aiConversation.findUnique({
      where: { id: aiConversationId },
      select: { quoteContext: true, customerName: true, customerEmail: true },
    })

    if (!aiConvo?.quoteContext) {
      logger.debug('[TRANSFER CONTEXT] No quote context to transfer')
      return { success: false }
    }

    // Buscar contexto atual do WhatsApp
    const whatsappConvo = await prisma.conversation.findUnique({
      where: { id: whatsappConversationId },
      select: { context: true },
    })

    // Mesclar contextos (preservar dados existentes do WhatsApp)
    const mergedContext = {
      ...((whatsappConvo?.context as object) || {}),
      webChatData: aiConvo.quoteContext,
      lastSync: new Date().toISOString(),
    }

    // Atualizar contexto do WhatsApp
    await prisma.conversation.update({
      where: { id: whatsappConversationId },
      data: {
        context: mergedContext,
        customerName: aiConvo.customerName || undefined,
      },
    })

    logger.debug('[TRANSFER CONTEXT] Successfully transferred')
    return { success: true }
  } catch (error) {
    logger.error('[TRANSFER CONTEXT] Error:', error)
    return { success: false }
  }
}

/**
 * Gera resumo do contexto unificado para incluir no prompt da IA
 */
export function generateContextSummary(context: UnifiedCustomerContext | null): string {
  if (!context) return ''

  const parts: string[] = []

  // Informações do cliente
  if (context.customerName) {
    parts.push(`Cliente: ${context.customerName}`)
  }

  // Histórico de interações
  const totalConversations = context.webConversations.length + context.whatsappConversations.length
  if (totalConversations > 1) {
    parts.push(`Cliente retornando (${totalConversations} conversas anteriores)`)
  }

  // Produtos mencionados
  if (context.mergedContext.products && context.mergedContext.products.length > 0) {
    parts.push(`Produtos de interesse: ${context.mergedContext.products.join(', ')}`)
  }

  // Medidas coletadas
  if (
    context.mergedContext.measurements &&
    Object.keys(context.mergedContext.measurements).length > 0
  ) {
    const measurementsStr = Object.entries(context.mergedContext.measurements)
      .map(([product, dims]: [string, any]) => `${product}: ${dims.width}m x ${dims.height}m`)
      .join(', ')
    parts.push(`Medidas coletadas: ${measurementsStr}`)
  }

  // Orçamentos anteriores
  if (context.quotes.length > 0) {
    const quotesStr = context.quotes.map((q) => `#${q.number} (${q.status})`).join(', ')
    parts.push(`Orçamentos anteriores: ${quotesStr}`)
  }

  // Canal anterior
  if (context.mergedContext.lastChannel && totalConversations > 0) {
    const otherChannel = context.mergedContext.lastChannel === 'WEB' ? 'site' : 'WhatsApp'
    parts.push(`Última interação: ${otherChannel}`)
  }

  return parts.length > 0 ? `\n\n[CONTEXTO DO CLIENTE]:\n${parts.join('\n')}` : ''
}
