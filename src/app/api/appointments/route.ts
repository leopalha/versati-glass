import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { logger } from '@/lib/logger'
import { sendWhatsAppMessage } from '@/services/whatsapp'
import {
  appointmentScheduledTemplate,
  formatDate,
  formatTime,
  sanitizeCustomerName,
} from '@/lib/whatsapp-templates'
import { createCalendarEvent, isGoogleCalendarEnabled } from '@/services/google-calendar'

// Get appointments for current user (or all if admin)
export async function GET(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const type = searchParams.get('type')
    const userId = searchParams.get('userId')
    const upcoming = searchParams.get('upcoming') === 'true'
    const dateFrom = searchParams.get('dateFrom')
    const dateTo = searchParams.get('dateTo')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')

    // Admin pode ver todos, cliente só os próprios
    const isAdmin = session.user.role === 'ADMIN' || session.user.role === 'STAFF'

    // Build filter
    const where: Record<string, unknown> = {}

    if (!isAdmin) {
      where.userId = session.user.id
    } else if (userId) {
      where.userId = userId
    }

    if (status) {
      where.status = status
    }

    if (type) {
      where.type = type
    }

    if (upcoming) {
      where.scheduledDate = { gte: new Date() }
      where.status = { in: ['SCHEDULED', 'CONFIRMED', 'IN_PROGRESS'] }
    }

    if (dateFrom && dateTo) {
      where.scheduledDate = {
        gte: new Date(dateFrom),
        lte: new Date(dateTo),
      }
    } else if (dateFrom) {
      where.scheduledDate = { gte: new Date(dateFrom) }
    } else if (dateTo) {
      where.scheduledDate = { lte: new Date(dateTo) }
    }

    const [appointments, total] = await Promise.all([
      prisma.appointment.findMany({
        where,
        orderBy: { scheduledDate: upcoming ? 'asc' : 'desc' },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
            },
          },
          order: {
            select: {
              id: true,
              number: true,
              status: true,
            },
          },
          quote: {
            select: {
              id: true,
              number: true,
              status: true,
            },
          },
          assignedTo: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      }),
      prisma.appointment.count({ where }),
    ])

    return NextResponse.json({
      appointments,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    logger.error('Get appointments error:', error)
    return NextResponse.json({ error: 'Failed to get appointments' }, { status: 500 })
  }
}

// Create appointment (for scheduling)
export async function POST(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const {
      orderId,
      quoteId,
      type,
      scheduledDate,
      scheduledTime,
      estimatedDuration,
      addressStreet,
      addressNumber,
      addressComplement,
      addressNeighborhood,
      addressCity,
      addressState,
      addressZipCode,
      notes,
    } = body

    // Validate required fields
    if (!type || !scheduledDate || !scheduledTime) {
      return NextResponse.json({ error: 'Type, date and time are required' }, { status: 400 })
    }

    if (!addressStreet || !addressNumber || !addressCity || !addressState) {
      return NextResponse.json({ error: 'Address is required' }, { status: 400 })
    }

    const appointment = await prisma.appointment.create({
      data: {
        userId: session.user.id,
        orderId,
        quoteId,
        type,
        scheduledDate: new Date(scheduledDate),
        scheduledTime,
        estimatedDuration: estimatedDuration || 60,
        addressStreet,
        addressNumber,
        addressComplement,
        addressNeighborhood,
        addressCity,
        addressState,
        addressZipCode,
        notes,
        status: 'SCHEDULED',
      },
      include: {
        user: true,
        quote: true,
      },
    })

    logger.info('[API /appointments POST] Appointment created successfully', {
      appointmentId: appointment.id,
      userId: session.user.id,
      type: appointment.type,
      scheduledDate: appointment.scheduledDate,
    })

    // NOTIF.3: Criar evento no Google Calendar
    if (isGoogleCalendarEnabled()) {
      createCalendarEvent({
        id: appointment.id,
        type: appointment.type as 'TECHNICAL_VISIT' | 'INSTALLATION',
        customerName: appointment.user.name || 'Cliente',
        customerPhone: appointment.user.phone || '',
        customerEmail: appointment.user.email || undefined,
        scheduledDate: appointment.scheduledDate,
        scheduledTime: appointment.scheduledTime,
        address: {
          street: appointment.addressStreet,
          number: appointment.addressNumber,
          complement: appointment.addressComplement || undefined,
          neighborhood: appointment.addressNeighborhood || '',
          city: appointment.addressCity,
          state: appointment.addressState,
          zipCode: appointment.addressZipCode || '',
        },
        quoteNumber: appointment.quote?.number,
        quoteId: appointment.quoteId || undefined,
        notes: appointment.notes || undefined,
      })
        .then(async (result) => {
          if (result.success && result.eventId) {
            logger.info('[Google Calendar] Event created for appointment', {
              appointmentId: appointment.id,
              eventId: result.eventId,
              eventLink: result.eventLink,
            })
          } else {
            logger.error('[Google Calendar] Failed to create event', {
              appointmentId: appointment.id,
              error: result.error,
            })
          }
        })
        .catch((error) => {
          logger.error('[Google Calendar] Unexpected error creating event', {
            appointmentId: appointment.id,
            error: error.message,
          })
        })
    }

    // NOTIF.1: Enviar notificação WhatsApp para empresa
    if (process.env.TWILIO_WHATSAPP_NUMBER && process.env.NEXT_PUBLIC_COMPANY_WHATSAPP) {
      const appointmentDate = new Date(scheduledDate)
      const fullAddress = `${addressStreet}, ${addressNumber}${addressComplement ? ', ' + addressComplement : ''} - ${addressNeighborhood}, ${addressCity}/${addressState}`

      const message = appointmentScheduledTemplate({
        appointmentType: type === 'TECHNICAL_VISIT' ? 'Visita Técnica' : 'Instalação',
        customerName: sanitizeCustomerName(appointment.user.name || 'Cliente'),
        date: formatDate(appointmentDate),
        time: scheduledTime,
        address: fullAddress,
        quoteNumber: appointment.quote?.number,
      })

      // Fire and forget
      sendWhatsAppMessage({
        to: process.env.NEXT_PUBLIC_COMPANY_WHATSAPP,
        message,
      })
        .then((result) => {
          if (result.success) {
            logger.info('[WhatsApp Notification] Appointment notification sent', {
              appointmentId: appointment.id,
              type: appointment.type,
              messageSid: result.messageSid,
            })
          } else {
            logger.error('[WhatsApp Notification] Failed to send appointment notification', {
              appointmentId: appointment.id,
              error: result.error,
            })
          }
        })
        .catch((error) => {
          logger.error(
            '[WhatsApp Notification] Unexpected error sending appointment notification',
            {
              appointmentId: appointment.id,
              error: error.message,
            }
          )
        })
    }

    return NextResponse.json(appointment, { status: 201 })
  } catch (error) {
    logger.error('Create appointment error:', error)
    return NextResponse.json({ error: 'Failed to create appointment' }, { status: 500 })
  }
}
