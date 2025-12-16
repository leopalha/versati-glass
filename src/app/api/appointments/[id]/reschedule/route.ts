import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const rescheduleSchema = z.object({
  newDate: z.string(),
  newTime: z.string(),
  reason: z.string().optional(),
})

interface RouteParams {
  params: Promise<{
    id: string
  }>
}

export async function POST(request: Request, { params }: RouteParams) {
  try {
    const session = await auth()

    if (!session?.user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    const validatedData = rescheduleSchema.parse(body)

    // Verificar se o agendamento existe
    const appointment = await prisma.appointment.findUnique({
      where: { id },
      include: { user: true },
    })

    if (!appointment) {
      return NextResponse.json({ error: 'Agendamento não encontrado' }, { status: 404 })
    }

    // Verificar permissão (apenas o dono ou admin/staff)
    if (
      session.user.role !== 'ADMIN' &&
      session.user.role !== 'STAFF' &&
      appointment.userId !== session.user.id
    ) {
      return NextResponse.json({ error: 'Permissão negada' }, { status: 403 })
    }

    // Verificar se pode ser reagendado
    if (['CANCELLED', 'COMPLETED', 'NO_SHOW'].includes(appointment.status)) {
      return NextResponse.json(
        { error: 'Este agendamento não pode ser reagendado' },
        { status: 400 }
      )
    }

    // Combinar data e hora
    const scheduledDateTime = new Date(`${validatedData.newDate}T${validatedData.newTime}`)

    // Verificar se a data é futura
    if (scheduledDateTime <= new Date()) {
      return NextResponse.json({ error: 'A data deve ser no futuro' }, { status: 400 })
    }

    // Atualizar agendamento
    const updatedAppointment = await prisma.appointment.update({
      where: { id },
      data: {
        scheduledDate: scheduledDateTime,
        scheduledTime: validatedData.newTime,
        status: 'SCHEDULED', // Reset para SCHEDULED quando reagendado
        notes: validatedData.reason
          ? `${appointment.notes || ''}\n\nReagendamento solicitado: ${validatedData.reason}`
          : appointment.notes,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })

    // TODO: Enviar email de confirmação de reagendamento

    return NextResponse.json({
      message: 'Agendamento reagendado com sucesso',
      appointment: updatedAppointment,
    })
  } catch (error) {
    console.error('Erro ao reagendar:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Dados inválidos', details: error.errors }, { status: 400 })
    }

    return NextResponse.json({ error: 'Erro ao reagendar agendamento' }, { status: 500 })
  }
}
