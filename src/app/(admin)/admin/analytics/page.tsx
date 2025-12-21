'use client'

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { AdminHeader } from '@/components/admin/admin-header'
import {
  TrendingUp,
  Users,
  MessageSquare,
  Phone,
  ShoppingCart,
  Clock,
  Target,
  Activity,
  Calendar,
  RefreshCw,
} from 'lucide-react'

interface AnalyticsData {
  overview: {
    totalConversations: number
    webChats: number
    whatsappChats: number
    linkedConversations: number
    linkingRate: number
    totalQuotes: number
    conversionRate: number
    avgResponseTime: number
  }
  byChannel: {
    web: {
      conversations: number
      quotes: number
      conversionRate: number
      avgDuration: number
    }
    whatsapp: {
      conversations: number
      quotes: number
      conversionRate: number
      avgDuration: number
    }
  }
  crossChannel: {
    startedWeb: number
    startedWhatsApp: number
    switchedChannels: number
    completedCrossChannel: number
  }
  timeline: Array<{
    date: string
    webChats: number
    whatsappChats: number
    quotes: number
  }>
}

// Helper to get date string in YYYY-MM-DD format
function formatDateForInput(date: Date): string {
  return date.toISOString().split('T')[0]
}

// Helper to get date ranges for presets
function getPresetDates(preset: '7d' | '30d' | '90d'): { from: string; to: string } {
  const to = new Date()
  const from = new Date()
  const days = preset === '7d' ? 7 : preset === '30d' ? 30 : 90
  from.setDate(from.getDate() - days)
  return {
    from: formatDateForInput(from),
    to: formatDateForInput(to),
  }
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [period, setPeriod] = useState<'7d' | '30d' | '90d' | 'custom'>('30d')
  const [showCustomRange, setShowCustomRange] = useState(false)
  const [customFrom, setCustomFrom] = useState('')
  const [customTo, setCustomTo] = useState('')

  useEffect(() => {
    async function fetchAnalytics() {
      setLoading(true)
      try {
        let url = `/api/admin/analytics?period=${period}`
        if (period === 'custom' && customFrom && customTo) {
          url = `/api/admin/analytics?from=${customFrom}&to=${customTo}`
        }
        const res = await fetch(url)
        if (!res.ok) throw new Error('Failed to fetch')
        const json = await res.json()
        setData(json)
      } catch (error) {
        console.error('Error fetching analytics:', error)
      } finally {
        setLoading(false)
      }
    }

    // Only fetch if not custom, or if custom with valid dates
    if (period !== 'custom' || (customFrom && customTo)) {
      fetchAnalytics()
    }
  }, [period, customFrom, customTo])

  const handlePresetClick = (preset: '7d' | '30d' | '90d') => {
    setPeriod(preset)
    setShowCustomRange(false)
  }

  const handleCustomClick = () => {
    setPeriod('custom')
    setShowCustomRange(true)
    // Set default range to last 30 days
    const defaults = getPresetDates('30d')
    setCustomFrom(defaults.from)
    setCustomTo(defaults.to)
  }

  const handleApplyCustomRange = () => {
    if (customFrom && customTo) {
      setPeriod('custom')
    }
  }

  if (loading) {
    return (
      <div>
        <AdminHeader title="Analytics Omnichannel" subtitle="Métricas de conversão e performance" />
        <div className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 w-1/3 rounded bg-neutral-800"></div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-32 rounded bg-neutral-800"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div>
        <AdminHeader title="Analytics Omnichannel" subtitle="Métricas de conversão e performance" />
        <div className="p-6">
          <Card className="border-neutral-700 bg-neutral-800 p-6">
            <p className="text-red-400">Erro ao carregar analytics</p>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div>
      <AdminHeader
        title="Analytics Omnichannel"
        subtitle="Métricas de conversão e performance"
        actions={
          <div className="flex flex-wrap items-center gap-2">
            {(['7d', '30d', '90d'] as const).map((p) => (
              <button
                key={p}
                onClick={() => handlePresetClick(p)}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  period === p
                    ? 'bg-accent-500 text-black'
                    : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
                }`}
              >
                {p === '7d' ? '7 dias' : p === '30d' ? '30 dias' : '90 dias'}
              </button>
            ))}
            <button
              onClick={handleCustomClick}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                period === 'custom'
                  ? 'bg-accent-500 text-black'
                  : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
              }`}
            >
              <Calendar className="h-4 w-4" />
              Personalizado
            </button>
            {loading && <RefreshCw className="h-5 w-5 animate-spin text-accent-500" />}
          </div>
        }
      />

      <div className="space-y-6 p-6">
        {/* Custom Date Range Picker */}
        {showCustomRange && (
          <Card className="border-neutral-700 bg-neutral-800 p-4">
            <div className="flex flex-wrap items-end gap-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-neutral-300">
                  Data inicial
                </label>
                <Input
                  type="date"
                  value={customFrom}
                  onChange={(e) => setCustomFrom(e.target.value)}
                  className="w-40"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-neutral-300">
                  Data final
                </label>
                <Input
                  type="date"
                  value={customTo}
                  onChange={(e) => setCustomTo(e.target.value)}
                  max={formatDateForInput(new Date())}
                  className="w-40"
                />
              </div>
              <Button onClick={handleApplyCustomRange} disabled={!customFrom || !customTo}>
                Aplicar
              </Button>
              {period === 'custom' && customFrom && customTo && (
                <span className="text-sm text-neutral-400">
                  Exibindo: {new Date(customFrom).toLocaleDateString('pt-BR')} a{' '}
                  {new Date(customTo).toLocaleDateString('pt-BR')}
                </span>
              )}
            </div>
          </Card>
        )}

        {/* KPI Cards */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="border-neutral-700 bg-neutral-800 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-400">Total Conversas</p>
                <p className="mt-1 text-3xl font-bold text-white">
                  {data.overview.totalConversations}
                </p>
                <p className="mt-1 text-xs text-neutral-500">
                  Web: {data.overview.webChats} | WhatsApp: {data.overview.whatsappChats}
                </p>
              </div>
              <MessageSquare className="h-12 w-12 text-blue-500 opacity-30" />
            </div>
          </Card>

          <Card className="border-neutral-700 bg-neutral-800 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-400">Taxa de Linking</p>
                <p className="mt-1 text-3xl font-bold text-white">
                  {data.overview.linkingRate.toFixed(1)}%
                </p>
                <p className="mt-1 text-xs text-neutral-500">
                  {data.overview.linkedConversations} conversas linkadas
                </p>
              </div>
              <Activity className="h-12 w-12 text-green-500 opacity-30" />
            </div>
          </Card>

          <Card className="border-neutral-700 bg-neutral-800 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-400">Taxa de Conversão</p>
                <p className="mt-1 text-3xl font-bold text-white">
                  {data.overview.conversionRate.toFixed(1)}%
                </p>
                <p className="mt-1 text-xs text-neutral-500">
                  {data.overview.totalQuotes} orçamentos gerados
                </p>
              </div>
              <Target className="h-12 w-12 text-purple-500 opacity-30" />
            </div>
          </Card>

          <Card className="border-neutral-700 bg-neutral-800 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-400">Tempo Médio</p>
                <p className="mt-1 text-3xl font-bold text-white">
                  {data.overview.avgResponseTime}min
                </p>
                <p className="mt-1 text-xs text-neutral-500">Tempo de resposta</p>
              </div>
              <Clock className="h-12 w-12 text-orange-500 opacity-30" />
            </div>
          </Card>
        </div>

        {/* Performance por Canal */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Web Chat */}
          <Card className="border-neutral-700 bg-neutral-800 p-6">
            <div className="mb-4 flex items-center gap-3">
              <MessageSquare className="h-6 w-6 text-blue-500" />
              <h2 className="text-xl font-bold text-white">Web Chat</h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-neutral-400">Conversas</span>
                <span className="text-lg font-bold text-white">
                  {data.byChannel.web.conversations}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-neutral-400">Orçamentos</span>
                <span className="text-lg font-bold text-white">{data.byChannel.web.quotes}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-neutral-400">Taxa de Conversão</span>
                <Badge variant="success" className="text-lg">
                  {data.byChannel.web.conversionRate.toFixed(1)}%
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-neutral-400">Duração Média</span>
                <span className="text-lg font-bold text-white">
                  {data.byChannel.web.avgDuration}min
                </span>
              </div>
            </div>
          </Card>

          {/* WhatsApp */}
          <Card className="border-neutral-700 bg-neutral-800 p-6">
            <div className="mb-4 flex items-center gap-3">
              <Phone className="h-6 w-6 text-green-500" />
              <h2 className="text-xl font-bold text-white">WhatsApp</h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-neutral-400">Conversas</span>
                <span className="text-lg font-bold text-white">
                  {data.byChannel.whatsapp.conversations}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-neutral-400">Orçamentos</span>
                <span className="text-lg font-bold text-white">
                  {data.byChannel.whatsapp.quotes}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-neutral-400">Taxa de Conversão</span>
                <Badge variant="success" className="text-lg">
                  {data.byChannel.whatsapp.conversionRate.toFixed(1)}%
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-neutral-400">Duração Média</span>
                <span className="text-lg font-bold text-white">
                  {data.byChannel.whatsapp.avgDuration}min
                </span>
              </div>
            </div>
          </Card>
        </div>

        {/* Cross-Channel Analytics */}
        <Card className="border-neutral-700 bg-neutral-800 p-6">
          <div className="mb-6 flex items-center gap-3">
            <TrendingUp className="h-6 w-6 text-purple-500" />
            <h2 className="text-xl font-bold text-white">Jornada Cross-Channel</h2>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <div className="rounded-lg bg-blue-500/10 p-4 text-center">
              <p className="text-sm text-neutral-400">Iniciaram no Site</p>
              <p className="mt-1 text-2xl font-bold text-blue-400">
                {data.crossChannel.startedWeb}
              </p>
            </div>
            <div className="rounded-lg bg-green-500/10 p-4 text-center">
              <p className="text-sm text-neutral-400">Iniciaram no WhatsApp</p>
              <p className="mt-1 text-2xl font-bold text-green-400">
                {data.crossChannel.startedWhatsApp}
              </p>
            </div>
            <div className="rounded-lg bg-purple-500/10 p-4 text-center">
              <p className="text-sm text-neutral-400">Mudaram de Canal</p>
              <p className="mt-1 text-2xl font-bold text-purple-400">
                {data.crossChannel.switchedChannels}
              </p>
            </div>
            <div className="rounded-lg bg-orange-500/10 p-4 text-center">
              <p className="text-sm text-neutral-400">Converteram Cross-Channel</p>
              <p className="mt-1 text-2xl font-bold text-orange-400">
                {data.crossChannel.completedCrossChannel}
              </p>
            </div>
          </div>

          <div className="mt-6 rounded-lg bg-neutral-900 p-4">
            <h3 className="mb-2 font-bold text-white">Insights</h3>
            <ul className="space-y-1 text-sm text-neutral-400">
              <li>
                •{' '}
                {(
                  (data.crossChannel.switchedChannels / data.overview.totalConversations) *
                  100
                ).toFixed(1)}
                % dos clientes usam múltiplos canais
              </li>
              <li>
                • Conversas cross-channel têm{' '}
                <span className="font-bold text-green-400">
                  {(
                    (data.crossChannel.completedCrossChannel / data.crossChannel.switchedChannels) *
                      100 -
                    data.overview.conversionRate
                  ).toFixed(1)}
                  %
                </span>{' '}
                mais conversão que single-channel
              </li>
              <li>
                • {data.overview.linkedConversations} conversas foram linkadas automaticamente
              </li>
            </ul>
          </div>
        </Card>

        {/* Timeline Chart (Simplified) */}
        <Card className="border-neutral-700 bg-neutral-800 p-6">
          <h2 className="mb-4 text-xl font-bold text-white">Evolução Temporal</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-neutral-900">
                <tr>
                  <th className="px-4 py-2 text-left text-neutral-400">Data</th>
                  <th className="px-4 py-2 text-right text-neutral-400">Web Chat</th>
                  <th className="px-4 py-2 text-right text-neutral-400">WhatsApp</th>
                  <th className="px-4 py-2 text-right text-neutral-400">Orçamentos</th>
                </tr>
              </thead>
              <tbody>
                {data.timeline.slice(-7).map((day, idx) => (
                  <tr key={idx} className="border-t border-neutral-700">
                    <td className="px-4 py-2 text-neutral-300">{day.date}</td>
                    <td className="px-4 py-2 text-right font-medium text-blue-400">
                      {day.webChats}
                    </td>
                    <td className="px-4 py-2 text-right font-medium text-green-400">
                      {day.whatsappChats}
                    </td>
                    <td className="px-4 py-2 text-right font-medium text-purple-400">
                      {day.quotes}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  )
}
