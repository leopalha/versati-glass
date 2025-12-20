/**
 * AI-CHAT Sprint P4.1: Metrics Dashboard
 *
 * Analytics and insights for AI conversation system:
 * - Conversion rate (conversation → quote)
 * - Average conversation time
 * - Escalation to human rate
 * - Most requested products
 * - Peak hours analysis
 * - Token usage and costs
 */

import { prisma } from '@/lib/prisma'
import { AdminHeader } from '@/components/admin/admin-header'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  ArrowLeft,
  TrendingUp,
  MessageSquare,
  Clock,
  DollarSign,
  Users,
  Package,
  Calendar,
  Image as ImageIcon,
  BarChart3,
  CheckCircle,
  XCircle,
} from 'lucide-react'
import Link from 'next/link'

interface HourlyData {
  hour: number
  count: number
}

interface ProductCategory {
  category: string
  count: number
}

interface DailyData {
  date: string
  conversations: number
  quotes: number
}

export default async function MetricsDashboardPage() {
  // Date range for analysis (last 30 days)
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  // Fetch all conversations from last 30 days
  const conversations = await prisma.aiConversation.findMany({
    where: {
      createdAt: {
        gte: thirtyDaysAgo,
      },
    },
    include: {
      messages: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  // Fetch related quotes
  const quoteIds = conversations.map((c) => c.quoteId).filter((id): id is string => !!id)
  const quotes = await prisma.quote.findMany({
    where: {
      id: {
        in: quoteIds,
      },
    },
    select: {
      id: true,
      number: true,
      status: true,
      createdAt: true,
    },
  })

  // Create a map for easy lookup
  const quotesMap = new Map(quotes.map((q) => [q.id, q]))

  // Add quote data to conversations
  const conversationsWithQuotes = conversations.map((c) => ({
    ...c,
    quote: c.quoteId ? quotesMap.get(c.quoteId) : null,
  }))

  // === BASIC METRICS ===
  const totalConversations = conversations.length
  const conversationsWithQuotesCount = conversationsWithQuotes.filter((c) => c.quote).length
  const conversionRate =
    totalConversations > 0 ? (conversationsWithQuotesCount / totalConversations) * 100 : 0

  const activeConversations = conversations.filter((c) => c.status === 'ACTIVE').length
  const abandonedConversations = conversations.filter((c) => c.status === 'ABANDONED').length
  const abandonmentRate =
    totalConversations > 0 ? (abandonedConversations / totalConversations) * 100 : 0

  // === CONVERSATION METRICS ===
  const totalMessages = conversations.reduce((acc, c) => acc + c.messages.length, 0)
  const avgMessagesPerConversation = totalConversations > 0 ? totalMessages / totalConversations : 0

  const userMessages = conversations.reduce(
    (acc, c) => acc + c.messages.filter((m) => m.role === 'USER').length,
    0
  )
  const aiMessages = conversations.reduce(
    (acc, c) => acc + c.messages.filter((m) => m.role === 'ASSISTANT').length,
    0
  )

  // === TIME METRICS ===
  const conversationDurations = conversations
    .filter((c) => c.messages.length > 1)
    .map((c) => {
      const firstMessage = c.messages[0]
      const lastMessage = c.messages[c.messages.length - 1]
      return lastMessage.createdAt.getTime() - firstMessage.createdAt.getTime()
    })

  const avgConversationDuration =
    conversationDurations.length > 0
      ? conversationDurations.reduce((a, b) => a + b, 0) / conversationDurations.length
      : 0
  const avgMinutes = Math.round(avgConversationDuration / 60000)

  // === TOKEN & COST METRICS ===
  const totalTokens = conversations.reduce((acc, c) => {
    return (
      acc +
      c.messages.reduce((msgAcc, msg) => {
        const metadata = msg.metadata as { tokensUsed?: number } | null
        return msgAcc + (metadata?.tokensUsed || 0)
      }, 0)
    )
  }, 0)

  const imagesAnalyzed = conversations.reduce(
    (acc, c) => acc + c.messages.filter((m) => m.imageUrl).length,
    0
  )

  // Estimated costs (based on Groq pricing + OpenAI Vision)
  // Groq: ~$0.001 per 1K tokens, OpenAI Vision: ~$0.01 per image
  const estimatedGroqCost = (totalTokens / 1000) * 0.001
  const estimatedVisionCost = imagesAnalyzed * 0.01
  const totalEstimatedCost = estimatedGroqCost + estimatedVisionCost

  // === PRODUCT CATEGORY ANALYSIS ===
  const categoryCount: Record<string, number> = {}

  conversations.forEach((conv) => {
    const quoteContext = conv.quoteContext as {
      items?: Array<{ category?: string }>
    } | null

    if (quoteContext?.items) {
      quoteContext.items.forEach((item) => {
        if (item.category) {
          categoryCount[item.category] = (categoryCount[item.category] || 0) + 1
        }
      })
    }
  })

  const topCategories: ProductCategory[] = Object.entries(categoryCount)
    .map(([category, count]) => ({ category, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)

  // === HOURLY DISTRIBUTION ===
  const hourlyDistribution: Record<number, number> = {}
  conversations.forEach((conv) => {
    const hour = new Date(conv.createdAt).getHours()
    hourlyDistribution[hour] = (hourlyDistribution[hour] || 0) + 1
  })

  const hourlyData: HourlyData[] = Array.from({ length: 24 }, (_, hour) => ({
    hour,
    count: hourlyDistribution[hour] || 0,
  }))

  const peakHour = hourlyData.reduce((max, curr) => (curr.count > max.count ? curr : max), {
    hour: 0,
    count: 0,
  })

  // === DAILY TREND (last 7 days) ===
  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

  const dailyTrend: Record<string, { conversations: number; quotes: number }> = {}

  conversationsWithQuotes
    .filter((c) => c.createdAt >= sevenDaysAgo)
    .forEach((conv) => {
      const dateKey = conv.createdAt.toISOString().split('T')[0]
      if (!dailyTrend[dateKey]) {
        dailyTrend[dateKey] = { conversations: 0, quotes: 0 }
      }
      dailyTrend[dateKey].conversations++
      if (conv.quote) {
        dailyTrend[dateKey].quotes++
      }
    })

  const dailyData: DailyData[] = Object.entries(dailyTrend)
    .map(([date, data]) => ({
      date,
      conversations: data.conversations,
      quotes: data.quotes,
    }))
    .sort((a, b) => a.date.localeCompare(b.date))

  // === CUSTOMER TYPE ANALYSIS ===
  const authenticatedConversations = conversations.filter((c) => c.customerEmail).length
  const anonymousConversations = conversations.filter((c) => !c.customerEmail).length

  return (
    <div>
      <AdminHeader
        title="Métricas & Analytics - IA Chat"
        subtitle={`Análise dos últimos 30 dias (${totalConversations} conversas)`}
        actions={
          <div className="flex gap-2">
            <a
              href={`/api/ai/chat/export-csv?startDate=${thirtyDaysAgo.toISOString().split('T')[0]}&endDate=${new Date().toISOString().split('T')[0]}`}
              download
            >
              <Button variant="outline" size="sm">
                📥 Exportar CSV
              </Button>
            </a>
            <Link href="/admin/conversas-ia">
              <Button variant="outline" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar
              </Button>
            </Link>
          </div>
        }
      />

      <div className="space-y-6 p-6">
        {/* === KEY METRICS CARDS === */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {/* Conversion Rate */}
          <Card className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-neutral-700">Taxa de Conversão</p>
                <p className="mt-2 text-3xl font-bold text-white">{conversionRate.toFixed(1)}%</p>
                <p className="mt-1 text-xs text-neutral-600">
                  {conversationsWithQuotesCount} de {totalConversations} conversas
                </p>
              </div>
              <div className="rounded-full bg-green-500/20 p-3">
                <CheckCircle className="h-6 w-6 text-green-400" />
              </div>
            </div>
          </Card>

          {/* Abandonment Rate */}
          <Card className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-neutral-700">Taxa de Abandono</p>
                <p className="mt-2 text-3xl font-bold text-white">{abandonmentRate.toFixed(1)}%</p>
                <p className="mt-1 text-xs text-neutral-600">
                  {abandonedConversations} abandonadas
                </p>
              </div>
              <div className="rounded-full bg-yellow-500/20 p-3">
                <XCircle className="h-6 w-6 text-yellow-400" />
              </div>
            </div>
          </Card>

          {/* Avg Conversation Time */}
          <Card className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-neutral-700">Tempo Médio</p>
                <p className="mt-2 text-3xl font-bold text-white">{avgMinutes}min</p>
                <p className="mt-1 text-xs text-neutral-600">
                  {avgMessagesPerConversation.toFixed(1)} msgs/conversa
                </p>
              </div>
              <div className="rounded-full bg-blue-500/20 p-3">
                <Clock className="h-6 w-6 text-blue-400" />
              </div>
            </div>
          </Card>

          {/* Estimated Cost */}
          <Card className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-neutral-700">Custo Estimado</p>
                <p className="mt-2 text-3xl font-bold text-white">
                  ${totalEstimatedCost.toFixed(2)}
                </p>
                <p className="mt-1 text-xs text-neutral-600">
                  {totalTokens.toLocaleString()} tokens
                </p>
              </div>
              <div className="rounded-full bg-purple-500/20 p-3">
                <DollarSign className="h-6 w-6 text-purple-400" />
              </div>
            </div>
          </Card>
        </div>

        {/* === DETAILED STATS === */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Message Breakdown */}
          <Card className="p-6">
            <div className="mb-4 flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-accent-500" />
              <h3 className="font-display text-lg font-semibold text-white">
                Mensagens & Engajamento
              </h3>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-neutral-700">Total de Mensagens</span>
                <span className="text-xl font-bold text-white">{totalMessages}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-neutral-700">Mensagens do Usuário</span>
                <span className="text-lg font-semibold text-white">{userMessages}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-neutral-700">Respostas da IA</span>
                <span className="text-lg font-semibold text-accent-500">{aiMessages}</span>
              </div>

              <div className="flex items-center justify-between border-t border-neutral-400 pt-3">
                <span className="text-sm text-neutral-700">Imagens Analisadas</span>
                <span className="text-lg font-semibold text-blue-400">{imagesAnalyzed}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-neutral-700">Conversas Ativas</span>
                <span className="text-lg font-semibold text-green-400">{activeConversations}</span>
              </div>
            </div>
          </Card>

          {/* Customer Type */}
          <Card className="p-6">
            <div className="mb-4 flex items-center gap-2">
              <Users className="h-5 w-5 text-accent-500" />
              <h3 className="font-display text-lg font-semibold text-white">Tipo de Cliente</h3>
            </div>

            <div className="space-y-4">
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm text-neutral-700">Usuários Autenticados</span>
                  <span className="text-lg font-semibold text-white">
                    {authenticatedConversations}
                  </span>
                </div>
                <div className="h-2 rounded-full bg-neutral-200">
                  <div
                    className="h-full rounded-full bg-accent-500"
                    style={{
                      width: `${totalConversations > 0 ? (authenticatedConversations / totalConversations) * 100 : 0}%`,
                    }}
                  />
                </div>
                <p className="mt-1 text-xs text-neutral-600">
                  {totalConversations > 0
                    ? ((authenticatedConversations / totalConversations) * 100).toFixed(1)
                    : 0}
                  % do total
                </p>
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm text-neutral-700">Visitantes Anônimos</span>
                  <span className="text-lg font-semibold text-white">{anonymousConversations}</span>
                </div>
                <div className="h-2 rounded-full bg-neutral-200">
                  <div
                    className="h-full rounded-full bg-blue-400"
                    style={{
                      width: `${totalConversations > 0 ? (anonymousConversations / totalConversations) * 100 : 0}%`,
                    }}
                  />
                </div>
                <p className="mt-1 text-xs text-neutral-600">
                  {totalConversations > 0
                    ? ((anonymousConversations / totalConversations) * 100).toFixed(1)
                    : 0}
                  % do total
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* === PRODUCT CATEGORIES === */}
        <Card className="p-6">
          <div className="mb-4 flex items-center gap-2">
            <Package className="h-5 w-5 text-accent-500" />
            <h3 className="font-display text-lg font-semibold text-white">
              Categorias Mais Solicitadas
            </h3>
          </div>

          {topCategories.length > 0 ? (
            <div className="space-y-3">
              {topCategories.map((category, index) => {
                const maxCount = topCategories[0]?.count || 1
                const percentage = (category.count / maxCount) * 100

                return (
                  <div key={category.category}>
                    <div className="mb-1 flex items-center justify-between">
                      <span className="text-sm font-medium text-white">
                        {index + 1}. {category.category}
                      </span>
                      <span className="text-sm text-neutral-600">{category.count} pedidos</span>
                    </div>
                    <div className="h-2 rounded-full bg-neutral-200">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-accent-500 to-gold-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <p className="text-center text-neutral-600">Nenhuma categoria identificada ainda</p>
          )}
        </Card>

        {/* === HOURLY DISTRIBUTION === */}
        <Card className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-accent-500" />
              <h3 className="font-display text-lg font-semibold text-white">
                Distribuição por Horário
              </h3>
            </div>
            <div className="text-sm text-neutral-700">
              Pico: <span className="font-semibold text-accent-500">{peakHour.hour}:00h</span> (
              {peakHour.count} conversas)
            </div>
          </div>

          <div className="flex items-end justify-between gap-1" style={{ height: '200px' }}>
            {hourlyData.map((data) => {
              const maxCount = Math.max(...hourlyData.map((d) => d.count), 1)
              const heightPercent = (data.count / maxCount) * 100

              return (
                <div key={data.hour} className="flex flex-1 flex-col items-center gap-1">
                  <div className="relative flex w-full flex-1 items-end">
                    <div
                      className={`w-full rounded-t transition-all ${
                        data.hour === peakHour.hour
                          ? 'bg-accent-500'
                          : 'bg-neutral-500 hover:bg-neutral-600'
                      }`}
                      style={{ height: `${heightPercent}%` }}
                      title={`${data.hour}:00 - ${data.count} conversas`}
                    />
                  </div>
                  <span className="text-[10px] text-neutral-600">{data.hour}h</span>
                </div>
              )
            })}
          </div>
        </Card>

        {/* === DAILY TREND (Last 7 days) === */}
        <Card className="p-6">
          <div className="mb-4 flex items-center gap-2">
            <Calendar className="h-5 w-5 text-accent-500" />
            <h3 className="font-display text-lg font-semibold text-white">
              Tendência Diária (Últimos 7 Dias)
            </h3>
          </div>

          {dailyData.length > 0 ? (
            <div className="space-y-3">
              {dailyData.map((day) => {
                const date = new Date(day.date)
                const formattedDate = date.toLocaleDateString('pt-BR', {
                  day: '2-digit',
                  month: 'short',
                })

                return (
                  <div key={day.date} className="flex items-center gap-4">
                    <span className="w-20 text-sm font-medium text-neutral-700">
                      {formattedDate}
                    </span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <div
                          className="h-6 rounded bg-blue-500/20"
                          style={{
                            width: `${(day.conversations / Math.max(...dailyData.map((d) => d.conversations), 1)) * 100}%`,
                            minWidth: '20px',
                          }}
                        >
                          <span className="px-2 text-xs text-blue-400">{day.conversations}</span>
                        </div>
                        <span className="text-xs text-neutral-600">conversas</span>
                      </div>
                      {day.quotes > 0 && (
                        <div className="mt-1 flex items-center gap-2">
                          <div
                            className="h-6 rounded bg-green-500/20"
                            style={{
                              width: `${(day.quotes / Math.max(...dailyData.map((d) => d.quotes), 1)) * 100}%`,
                              minWidth: '20px',
                            }}
                          >
                            <span className="px-2 text-xs text-green-400">{day.quotes}</span>
                          </div>
                          <span className="text-xs text-neutral-600">orçamentos</span>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <p className="text-center text-neutral-600">Sem dados dos últimos 7 dias</p>
          )}
        </Card>

        {/* === COST BREAKDOWN === */}
        <Card className="p-6">
          <div className="mb-4 flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-accent-500" />
            <h3 className="font-display text-lg font-semibold text-white">Breakdown de Custos</h3>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-700">Groq API (Text)</p>
                <p className="text-xs text-neutral-600">
                  {totalTokens.toLocaleString()} tokens × $0.001/1K
                </p>
              </div>
              <p className="text-xl font-bold text-white">${estimatedGroqCost.toFixed(4)}</p>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-700">OpenAI Vision (Images)</p>
                <p className="text-xs text-neutral-600">{imagesAnalyzed} imagens × $0.01</p>
              </div>
              <p className="text-xl font-bold text-white">${estimatedVisionCost.toFixed(2)}</p>
            </div>

            <div className="flex items-center justify-between border-t border-neutral-400 pt-3">
              <p className="font-semibold text-white">Total Estimado</p>
              <p className="text-2xl font-bold text-accent-500">${totalEstimatedCost.toFixed(2)}</p>
            </div>

            <p className="text-xs text-neutral-600">
              * Custos aproximados baseados em preços públicos das APIs. Valores reais podem variar.
            </p>
          </div>
        </Card>
      </div>
    </div>
  )
}
