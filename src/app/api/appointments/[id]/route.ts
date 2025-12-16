import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { z } from 'zod'

interface RouteParams {
  params: Promise<{ id: string }>
}

const updateAppointmentSchema = z.object({
  status: z
    .enum([
      'SCHEDULED',
      'CONFIRMED',
      'IN_PROGRESS',
      'COMPLETED',
      'CANCELLED',
      'RESCHEDULED',
      'NO_SHOW',
    ])
    .optional(),
  scheduledDate: z.string().optional(),
  scheduledTime: z.string().optional(),
  estimatedDuration: z.number().optional(),
  notes: z.string().optional(),
})

/**
 * PUT /api/appointments/:id
 * Atualiza um agendamento (apenas ADMIN/STAFF)
 */
export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    // Apenas admin e staff podem atualizar agendamentos
    if (session.user.role !== 'ADMIN' && session.user.role !== 'STAFF') {
      return NextResponse.json({ error: 'Permissão negada' }, { status: 403 })
    }

    const { id } = await params
    const body = await request.json()

    // Validar dados
    const validatedData = updateAppointmentSchema.parse(body)

    // Verificar se agendamento existe
    const existingAppointment = await prisma.appointment.findUnique({
      where: { id },
      include: {
        user: { select: { email: true, name: true } },
        order: { select: { id: true, number: true } },
      },
    })

    if (!existingAppointment) {
      return NextResponse.json({ error: 'Agendamento não encontrado' }, { status: 404 })
    }

    // Atualizar agendamento
    const updatedAppointment = await prisma.appointment.update({
      where: { id },
      data: validatedData,
      include: {
        user: { select: { id: true, name: true, email: true, phone: true } },
        order: { select: { id: true, number: true } },
        assignedTo: { select: { id: true, name: true } },
      },
    })

    // TODO: Enviar notificação por email ao cliente quando status mudar
    // if (validatedData.status && validatedData.status !== existingAppointment.status) {
    //   await sendAppointmentStatusEmail(updatedAppointment)
    // }

    return NextResponse.json({
      appointment: updatedAppointment,
      message: 'Agendamento atualizado com sucesso',
    })
  } catch (error) {
    console.error('[APPOINTMENT_UPDATE_ERROR]', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Dados inválidos', details: error.errors }, { status: 400 })
    }

    return NextResponse.json({ error: 'Erro ao atualizar agendamento' }, { status: 500 })
  }
}

/**
 * GET /api/appointments/:id
 * Busca um agendamento por ID
 */
export async function GET(request: Request, { params }: RouteParams) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const { id } = await params

    const appointment = await prisma.appointment.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, name: true, email: true, phone: true } },
        order: { select: { id: true, number: true, status: true } },
        assignedTo: { select: { id: true, name: true, email: true } },
      },
    })

    if (!appointment) {
      return NextResponse.json({ error: 'Agendamento não encontrado' }, { status: 404 })
    }

    // Clientes só podem ver seus próprios agendamentos
    if (session.user.role === 'CUSTOMER' && appointment.userId !== session.user.id) {
      return NextResponse.json({ error: 'Permissão negada' }, { status: 403 })
    }

    return NextResponse.json({ appointment })
  } catch (error) {
    console.error('[APPOINTMENT_GET_ERROR]', error)
    return NextResponse.json({ error: 'Erro ao buscar agendamento' }, { status: 500 })
  }
}

/**
 * DELETE /api/appointments/:id
 * Deleta um agendamento (apenas ADMIN)
 */
export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    // Apenas admin pode deletar
    if (session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Permissão negada' }, { status: 403 })
    }

    const { id } = await params

    // Verificar se existe
    const existingAppointment = await prisma.appointment.findUnique({
      where: { id },
    })

    if (!existingAppointment) {
      return NextResponse.json({ error: 'Agendamento não encontrado' }, { status: 404 })
    }

    // Deletar
    await prisma.appointment.delete({
      where: { id },
    })

    return NextResponse.json({
      message: 'Agendamento deletado com sucesso',
    })
  } catch (error) {
    console.error('[APPOINTMENT_DELETE_ERROR]', error)
    return NextResponse.json({ error: 'Erro ao deletar agendamento' }, { status: 500 })
  }
}
