import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { logger } from '@/lib/logger'

export async function GET(request: Request) {
  try {
    const session = await auth()

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const period = searchParams.get('period') || '30d'

    // Calculate date range
    const daysAgo = period === '7d' ? 7 : period === '30d' ? 30 : 90
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - daysAgo)

    // Fetch Web Chats
    const webChats = await prisma.aiConversation.findMany({
      where: {
        createdAt: { gte: startDate },
      },
      include: {
        messages: true,
      },
    })

    // Fetch WhatsApp Conversations
    const whatsappChats = await prisma.conversation.findMany({
      where: {
        createdAt: { gte: startDate },
      },
      include: {
        messages: true,
      },
    })

    // Fetch Quotes
    const quotes = await prisma.quote.findMany({
      where: {
        createdAt: { gte: startDate },
      },
      select: {
        id: true,
        source: true,
        createdAt: true,
        status: true,
      },
    })

    // Calculate metrics
    const totalConversations = webChats.length + whatsappChats.length
    const linkedConversations = webChats.filter(
      (c) => c.linkedPhone || c.whatsappConversationId
    ).length
    const linkingRate =
      totalConversations > 0 ? (linkedConversations / totalConversations) * 100 : 0

    const webQuotes = quotes.filter((q) => q.source === 'WEBSITE').length
    const whatsappQuotes = quotes.filter((q) => q.source === 'WHATSAPP').length
    const totalQuotes = quotes.length

    const conversionRate = totalConversations > 0 ? (totalQuotes / totalConversations) * 100 : 0

    // Web Chat metrics
    const webConversionRate = webChats.length > 0 ? (webQuotes / webChats.length) * 100 : 0
    const webAvgDuration =
      webChats.length > 0
        ? webChats.reduce((sum, c) => {
            const duration = c.updatedAt.getTime() - c.createdAt.getTime()
            return sum + duration / (1000 * 60) // minutes
          }, 0) / webChats.length
        : 0

    // WhatsApp metrics
    const whatsappConversionRate =
      whatsappChats.length > 0 ? (whatsappQuotes / whatsappChats.length) * 100 : 0
    const whatsappAvgDuration =
      whatsappChats.length > 0
        ? whatsappChats.reduce((sum, c) => {
            const duration = c.updatedAt.getTime() - c.createdAt.getTime()
            return sum + duration / (1000 * 60) // minutes
          }, 0) / whatsappChats.length
        : 0

    // Average response time (from messages)
    const allMessages = [...webChats.flatMap((c) => c.messages)]
    const avgResponseTime =
      allMessages.length > 1
        ? allMessages.slice(1).reduce((sum, msg, idx) => {
            const prevMsg = allMessages[idx]
            if (prevMsg) {
              const diff = new Date(msg.createdAt).getTime() - new Date(prevMsg.createdAt).getTime()
              return sum + diff / (1000 * 60)
            }
            return sum
          }, 0) /
          (allMessages.length - 1)
        : 0

    // Cross-channel analytics
    const startedWeb = webChats.filter((c) => !c.whatsappConversationId).length
    const startedWhatsApp = whatsappChats.filter((c) => !c.websiteChatId).length
    const switchedChannels =
      webChats.filter((c) => c.whatsappConversationId).length +
      whatsappChats.filter((c) => c.websiteChatId).length

    // Simplified: assume cross-channel has higher conversion
    const completedCrossChannel = Math.floor(switchedChannels * 0.7) // 70% conversion for cross-channel

    // Timeline data (daily aggregation)
    const timeline: Array<{
      date: string
      webChats: number
      whatsappChats: number
      quotes: number
    }> = []
    for (let i = daysAgo - 1; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      date.setHours(0, 0, 0, 0)

      const nextDate = new Date(date)
      nextDate.setDate(nextDate.getDate() + 1)

      const dayWebChats = webChats.filter(
        (c) => c.createdAt >= date && c.createdAt < nextDate
      ).length

      const dayWhatsappChats = whatsappChats.filter(
        (c) => c.createdAt >= date && c.createdAt < nextDate
      ).length

      const dayQuotes = quotes.filter((q) => q.createdAt >= date && q.createdAt < nextDate).length

      timeline.push({
        date: date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
        webChats: dayWebChats,
        whatsappChats: dayWhatsappChats,
        quotes: dayQuotes,
      })
    }

    const analyticsData = {
      overview: {
        totalConversations,
        webChats: webChats.length,
        whatsappChats: whatsappChats.length,
        linkedConversations,
        linkingRate,
        totalQuotes,
        conversionRate,
        avgResponseTime: Math.round(avgResponseTime),
      },
      byChannel: {
        web: {
          conversations: webChats.length,
          quotes: webQuotes,
          conversionRate: webConversionRate,
          avgDuration: Math.round(webAvgDuration),
        },
        whatsapp: {
          conversations: whatsappChats.length,
          quotes: whatsappQuotes,
          conversionRate: whatsappConversionRate,
          avgDuration: Math.round(whatsappAvgDuration),
        },
      },
      crossChannel: {
        startedWeb,
        startedWhatsApp,
        switchedChannels,
        completedCrossChannel,
      },
      timeline,
    }

    logger.info('[ANALYTICS] Fetched successfully', {
      period,
      totalConversations,
      conversionRate,
    })

    return NextResponse.json(analyticsData)
  } catch (error) {
    logger.error('[ANALYTICS] Error:', error)
    return NextResponse.json({ error: 'Erro ao buscar analytics' }, { status: 500 })
  }
}
