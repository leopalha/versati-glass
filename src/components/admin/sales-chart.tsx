'use client'

import { memo, useMemo } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import { Card } from '@/components/ui/card'

interface SalesData {
  month: string
  revenue: number
  orders: number
}

interface SalesChartProps {
  data: SalesData[]
  period?: 'week' | 'month' | 'year'
}

export const SalesChart = memo(function SalesChart({ data, period = 'month' }: SalesChartProps) {
  const chartData = useMemo(() => {
    return data.map((item) => ({
      ...item,
      revenueFormatted: `R$ ${(item.revenue / 1000).toFixed(1)}k`,
    }))
  }, [data])

  const maxRevenue = useMemo(() => {
    return Math.max(...data.map((item) => item.revenue))
  }, [data])

  const totalRevenue = useMemo(() => {
    return data.reduce((sum, item) => sum + item.revenue, 0)
  }, [data])

  const totalOrders = useMemo(() => {
    return data.reduce((sum, item) => sum + item.orders, 0)
  }, [data])

  const avgOrderValue = useMemo(() => {
    return totalOrders > 0 ? totalRevenue / totalOrders : 0
  }, [totalRevenue, totalOrders])

  const periodLabel = {
    week: 'Últimos 7 dias',
    month: 'Últimos 30 dias',
    year: 'Últimos 12 meses',
  }[period]

  return (
    <Card className="bg-theme-secondary border-theme-default p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-theme-primary text-lg font-semibold">Receita e Vendas</h3>
          <p className="text-theme-secondary text-sm">{periodLabel}</p>
        </div>

        <div className="flex gap-6 text-sm">
          <div>
            <p className="text-theme-secondary">Total de Pedidos</p>
            <p className="text-theme-primary text-xl font-bold">{totalOrders}</p>
          </div>
          <div>
            <p className="text-theme-secondary">Receita Total</p>
            <p className="text-xl font-bold text-accent-500">
              {new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              }).format(totalRevenue)}
            </p>
          </div>
          <div>
            <p className="text-theme-secondary">Ticket Médio</p>
            <p className="text-theme-primary text-xl font-bold">
              {new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              }).format(avgOrderValue)}
            </p>
          </div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={350}>
        <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
          <XAxis
            dataKey="month"
            stroke="rgba(255,255,255,0.5)"
            tick={{ fill: 'rgba(255,255,255,0.7)' }}
          />
          <YAxis
            yAxisId="left"
            stroke="rgba(255,255,255,0.5)"
            tick={{ fill: 'rgba(255,255,255,0.7)' }}
            tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}k`}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            stroke="rgba(255,255,255,0.5)"
            tick={{ fill: 'rgba(255,255,255,0.7)' }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(0,0,0,0.9)',
              border: '1px solid rgba(212,175,55,0.3)',
              borderRadius: '8px',
              color: '#fff',
            }}
            formatter={(value: number, name: string) => {
              if (name === 'revenue') {
                return [
                  new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  }).format(value),
                  'Receita',
                ]
              }
              return [value, 'Pedidos']
            }}
          />
          <Legend
            wrapperStyle={{ color: 'rgba(255,255,255,0.7)' }}
            formatter={(value) => (value === 'revenue' ? 'Receita' : 'Pedidos')}
          />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="revenue"
            stroke="#d4af37"
            strokeWidth={3}
            dot={{ fill: '#d4af37', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6 }}
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="orders"
            stroke="#60a5fa"
            strokeWidth={2}
            dot={{ fill: '#60a5fa', strokeWidth: 2, r: 3 }}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  )
})
