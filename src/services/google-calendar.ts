/**
 * Google Calendar Integration Service
 *
 * Gerencia criação, atualização e cancelamento de eventos no Google Calendar
 * para agendamentos de visitas técnicas e instalações.
 *
 * SETUP NECESSÁRIO:
 * 1. Criar projeto no Google Cloud Console
 * 2. Ativar Google Calendar API
 * 3. Criar Service Account no Google Cloud
 * 4. Baixar arquivo JSON da Service Account
 * 5. Compartilhar calendário com o email da Service Account
 * 6. Configurar .env com: GOOGLE_SERVICE_ACCOUNT_EMAIL, GOOGLE_PRIVATE_KEY, GOOGLE_CALENDAR_ID
 */

import { google } from 'googleapis'
import { logger } from '@/lib/logger'

// Tipos
interface AppointmentEventData {
  id: string
  type: 'TECHNICAL_VISIT' | 'INSTALLATION'
  customerName: string
  customerPhone: string
  customerEmail?: string
  scheduledDate: Date
  scheduledTime: string
  address: {
    street: string
    number: string
    complement?: string
    neighborhood: string
    city: string
    state: string
    zipCode: string
  }
  quoteNumber?: string
  quoteId?: string
  notes?: string
}

interface CalendarEventResponse {
  success: boolean
  eventId?: string
  eventLink?: string
  error?: string
}

/**
 * Inicializa cliente Service Account do Google
 */
function getServiceAccountAuth() {
  const serviceAccountEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL
  const privateKey = process.env.GOOGLE_PRIVATE_KEY

  if (!serviceAccountEmail || !privateKey) {
    throw new Error(
      'Google Calendar Service Account not configured. Set GOOGLE_SERVICE_ACCOUNT_EMAIL and GOOGLE_PRIVATE_KEY in .env'
    )
  }

  // Criar JWT client para Service Account
  const auth = new google.auth.JWT({
    email: serviceAccountEmail,
    key: privateKey.replace(/\\n/g, '\n'), // Corrigir quebras de linha
    scopes: ['https://www.googleapis.com/auth/calendar'],
  })

  return auth
}

/**
 * Converte tipo de agendamento para título e cor do evento
 */
function getEventProperties(type: AppointmentEventData['type']) {
  switch (type) {
    case 'TECHNICAL_VISIT':
      return {
        title: '🔍 Visita Técnica',
        duration: 2, // horas
        colorId: '10', // Verde no Google Calendar
        description: 'Visita técnica para medições e avaliação do projeto.',
      }
    case 'INSTALLATION':
      return {
        title: '🔧 Instalação',
        duration: 4, // horas
        colorId: '9', // Azul no Google Calendar
        description: 'Instalação do produto conforme orçamento aprovado.',
      }
    default:
      return {
        title: '📅 Agendamento',
        duration: 2,
        colorId: '7', // Cinza
        description: 'Agendamento Versati Glass',
      }
  }
}

/**
 * Formata endereço completo
 */
function formatAddress(address: AppointmentEventData['address']): string {
  const parts = [
    `${address.street}, ${address.number}`,
    address.complement,
    address.neighborhood,
    `${address.city} - ${address.state}`,
    address.zipCode,
  ].filter(Boolean)

  return parts.join(', ')
}

/**
 * Calcula data/hora de início e fim do evento
 */
function calculateEventTimes(scheduledDate: Date, scheduledTime: string, durationHours: number) {
  // scheduledTime formato: "14:30"
  const [hours, minutes] = scheduledTime.split(':').map(Number)

  const start = new Date(scheduledDate)
  start.setHours(hours, minutes, 0, 0)

  const end = new Date(start)
  end.setHours(start.getHours() + durationHours)

  return {
    start: start.toISOString(),
    end: end.toISOString(),
  }
}

/**
 * Cria evento no Google Calendar
 */
export async function createCalendarEvent(
  appointmentData: AppointmentEventData
): Promise<CalendarEventResponse> {
  try {
    logger.info('[Google Calendar] Creating event', {
      appointmentId: appointmentData.id,
      type: appointmentData.type,
      customer: appointmentData.customerName,
    })

    // Verificar se Google Calendar está configurado
    if (
      !process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL ||
      !process.env.GOOGLE_PRIVATE_KEY
    ) {
      logger.warn('[Google Calendar] Service Account not configured, skipping event creation')
      return {
        success: false,
        error: 'Google Calendar not configured',
      }
    }

    const auth = getServiceAccountAuth()
    const calendar = google.calendar({ version: 'v3', auth })

    const eventProps = getEventProperties(appointmentData.type)
    const { start, end } = calculateEventTimes(
      appointmentData.scheduledDate,
      appointmentData.scheduledTime,
      eventProps.duration
    )

    const fullAddress = formatAddress(appointmentData.address)

    // Montar descrição detalhada
    const descriptionLines = [
      eventProps.description,
      '',
      `👤 Cliente: ${appointmentData.customerName}`,
      `📞 Telefone: ${appointmentData.customerPhone}`,
    ]

    if (appointmentData.customerEmail) {
      descriptionLines.push(`📧 Email: ${appointmentData.customerEmail}`)
    }

    if (appointmentData.quoteNumber) {
      descriptionLines.push(`📋 Orçamento: ${appointmentData.quoteNumber}`)
    }

    descriptionLines.push(
      '',
      `📍 Endereço: ${fullAddress}`,
      '',
      `🔗 Ver detalhes: ${process.env.NEXTAUTH_URL}/admin/agendamentos/${appointmentData.id}`
    )

    if (appointmentData.notes) {
      descriptionLines.push('', `📝 Observações: ${appointmentData.notes}`)
    }

    // Criar evento
    const event = {
      summary: `${eventProps.title} - ${appointmentData.customerName}`,
      description: descriptionLines.join('\n'),
      location: fullAddress,
      start: {
        dateTime: start,
        timeZone: 'America/Sao_Paulo',
      },
      end: {
        dateTime: end,
        timeZone: 'America/Sao_Paulo',
      },
      colorId: eventProps.colorId,
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'email', minutes: 24 * 60 }, // 1 dia antes (email)
          { method: 'popup', minutes: 60 }, // 1 hora antes (popup)
          { method: 'popup', minutes: 15 }, // 15 minutos antes (popup)
        ],
      },
      extendedProperties: {
        private: {
          appointmentId: appointmentData.id,
          quoteId: appointmentData.quoteId || '',
          source: 'versatiglass',
        },
      },
    }

    const response = await calendar.events.insert({
      calendarId: process.env.GOOGLE_CALENDAR_ID || 'primary',
      requestBody: event,
    })

    logger.info('[Google Calendar] Event created successfully', {
      appointmentId: appointmentData.id,
      eventId: response.data.id,
      eventLink: response.data.htmlLink,
    })

    return {
      success: true,
      eventId: response.data.id || undefined,
      eventLink: response.data.htmlLink || undefined,
    }
  } catch (error: any) {
    logger.error('[Google Calendar] Failed to create event', {
      appointmentId: appointmentData.id,
      error: error.message,
      code: error.code,
    })

    return {
      success: false,
      error: error.message,
    }
  }
}

/**
 * Atualiza evento existente no Google Calendar
 */
export async function updateCalendarEvent(
  eventId: string,
  appointmentData: Partial<AppointmentEventData>
): Promise<CalendarEventResponse> {
  try {
    logger.info('[Google Calendar] Updating event', {
      eventId,
      changes: Object.keys(appointmentData),
    })

    if (
      !process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL ||
      !process.env.GOOGLE_PRIVATE_KEY
    ) {
      logger.warn('[Google Calendar] Service Account not configured, skipping event update')
      return {
        success: false,
        error: 'Google Calendar not configured',
      }
    }

    const auth = getServiceAccountAuth()
    const calendar = google.calendar({ version: 'v3', auth })

    // Buscar evento atual
    const existingEvent = await calendar.events.get({
      calendarId: process.env.GOOGLE_CALENDAR_ID || 'primary',
      eventId: eventId,
    })

    // Preparar updates
    const updates: any = {}

    if (appointmentData.scheduledDate && appointmentData.scheduledTime && appointmentData.type) {
      const eventProps = getEventProperties(appointmentData.type)
      const { start, end } = calculateEventTimes(
        appointmentData.scheduledDate,
        appointmentData.scheduledTime,
        eventProps.duration
      )

      updates.start = {
        dateTime: start,
        timeZone: 'America/Sao_Paulo',
      }
      updates.end = {
        dateTime: end,
        timeZone: 'America/Sao_Paulo',
      }
    }

    if (appointmentData.address) {
      updates.location = formatAddress(appointmentData.address)
    }

    if (appointmentData.customerName) {
      const currentSummary = existingEvent.data.summary || ''
      const summaryType = currentSummary.split(' - ')[0]
      updates.summary = `${summaryType} - ${appointmentData.customerName}`
    }

    // Atualizar evento
    const response = await calendar.events.patch({
      calendarId: process.env.GOOGLE_CALENDAR_ID || 'primary',
      eventId: eventId,
      requestBody: updates,
    })

    logger.info('[Google Calendar] Event updated successfully', {
      eventId,
      eventLink: response.data.htmlLink,
    })

    return {
      success: true,
      eventId: response.data.id || undefined,
      eventLink: response.data.htmlLink || undefined,
    }
  } catch (error: any) {
    logger.error('[Google Calendar] Failed to update event', {
      eventId,
      error: error.message,
    })

    return {
      success: false,
      error: error.message,
    }
  }
}

/**
 * Cancela evento no Google Calendar
 */
export async function cancelCalendarEvent(eventId: string): Promise<CalendarEventResponse> {
  try {
    logger.info('[Google Calendar] Canceling event', { eventId })

    if (
      !process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL ||
      !process.env.GOOGLE_PRIVATE_KEY
    ) {
      logger.warn('[Google Calendar] Service Account not configured, skipping event cancellation')
      return {
        success: false,
        error: 'Google Calendar not configured',
      }
    }

    const auth = getServiceAccountAuth()
    const calendar = google.calendar({ version: 'v3', auth })

    // Deletar evento
    await calendar.events.delete({
      calendarId: process.env.GOOGLE_CALENDAR_ID || 'primary',
      eventId: eventId,
    })

    logger.info('[Google Calendar] Event canceled successfully', { eventId })

    return {
      success: true,
      eventId,
    }
  } catch (error: any) {
    logger.error('[Google Calendar] Failed to cancel event', {
      eventId,
      error: error.message,
    })

    return {
      success: false,
      error: error.message,
    }
  }
}

/**
 * Verifica se Google Calendar está configurado
 */
export function isGoogleCalendarEnabled(): boolean {
  return !!(
    process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL &&
    process.env.GOOGLE_PRIVATE_KEY
  )
}
