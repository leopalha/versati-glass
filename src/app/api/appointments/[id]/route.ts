import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { z } from 'zod'
import { logger } from '@/lib/logger'
import { notifyAppointmentConfirmed } from '@/services/in-app-notifications'

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

    // Create in-app notification when status changes to CONFIRMED
    if (validatedData.status === 'CONFIRMED' && existingAppointment.status !== 'CONFIRMED') {
      try {
        await notifyAppointmentConfirmed(
          updatedAppointment.userId,
          updatedAppointment.id,
          updatedAppointment.type,
          new Date(updatedAppointment.scheduledDate).toLocaleDateString('pt-BR'),
          updatedAppointment.scheduledTime
        )
      } catch (notifError) {
        logger.error('Error creating appointment confirmation notification:', notifError)
      }
    }

    // Enviar notificação por email ao cliente quando status mudar
    if (validatedData.status && validatedData.status !== existingAppointment.status) {
      try {
        const { sendEmail, generateAppointmentStatusChangeHtml } = await import('@/services/email')

        const scheduledDate = new Date(updatedAppointment.scheduledDate).toLocaleDateString('pt-BR')
        const portalUrl = `${process.env.NEXTAUTH_URL}/portal/pedidos/${updatedAppointment.orderId}`

        await sendEmail({
          to: updatedAppointment.user.email,
          subject: `Agendamento ${validatedData.status === 'CONFIRMED' ? 'Confirmado' : 'Atualizado'} - Versati Glass`,
          html: generateAppointmentStatusChangeHtml({
            userName: updatedAppointment.user.name || 'Cliente',
            orderNumber: updatedAppointment.order?.number || 'N/A',
            appointmentType: updatedAppointment.type,
            status: updatedAppointment.status,
            scheduledDate,
            scheduledTime: updatedAppointment.scheduledTime,
            portalUrl,
          }),
        })

        logger.debug('Appointment status change notification sent', {
          appointmentId: id,
          oldStatus: existingAppointment.status,
          newStatus: updatedAppointment.status,
        })
      } catch (emailError) {
        // Não falhar a atualização se o email não for enviado
        logger.error('Failed to send appointment status email', emailError)
      }
    }

    return NextResponse.json({
      appointment: updatedAppointment,
      message: 'Agendamento atualizado com sucesso',
    })
  } catch (error) {
    logger.error('[APPOINTMENT_UPDATE_ERROR]', error)

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
    logger.error('[APPOINTMENT_GET_ERROR]', error)
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
    logger.error('[APPOINTMENT_DELETE_ERROR]', error)
    return NextResponse.json({ error: 'Erro ao deletar agendamento' }, { status: 500 })
  }
}
