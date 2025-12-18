import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { logger } from '@/lib/logger'

/**
 * GET /api/appointments/slots
 * Retorna slots disponíveis para agendamento
 * Query params:
 * - date: data inicial (YYYY-MM-DD) - padrão: hoje
 * - days: número de dias a frente - padrão: 7
 * - type: tipo de agendamento (opcional)
 */
export async function GET(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const dateParam = searchParams.get('date')
    const daysParam = searchParams.get('days')
    const type = searchParams.get('type')

    const startDate = dateParam ? new Date(dateParam) : new Date()
    const days = daysParam ? parseInt(daysParam) : 7

    // Configuração de horários disponíveis
    const workingHours = {
      start: 8, // 8h
      end: 18, // 18h
      interval: 2, // Intervalo de 2 horas entre slots
    }

    // Duração estimada por tipo de serviço
    const durations: Record<string, number> = {
      VISITA_TECNICA: 60,
      INSTALACAO: 180,
      MANUTENCAO: 120,
      REVISAO: 60,
    }

    // Gerar slots disponíveis
    const slots: { date: string; times: string[] }[] = []

    for (let i = 0; i < days; i++) {
      const currentDate = new Date(startDate)
      currentDate.setDate(currentDate.getDate() + i)

      // Pular finais de semana
      const dayOfWeek = currentDate.getDay()
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        continue
      }

      const dateStr = currentDate.toISOString().split('T')[0]
      const times: string[] = []

      // Gerar horários do dia
      for (let hour = workingHours.start; hour < workingHours.end; hour += workingHours.interval) {
        const timeStr = `${hour.toString().padStart(2, '0')}:00`
        times.push(timeStr)
      }

      slots.push({
        date: dateStr,
        times,
      })
    }

    return NextResponse.json({
      slots,
      config: {
        workingHours,
        durations,
      },
    })
  } catch (error) {
    logger.error('Get appointment slots error:', error)
    return NextResponse.json({ error: 'Failed to get available slots' }, { status: 500 })
  }
}
