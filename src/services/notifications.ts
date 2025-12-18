import { prisma } from '@/lib/prisma'
import { formatCurrency } from '@/lib/utils'
import {
  sendEmail,
  generateQuoteEmailHtml,
  generateOrderConfirmationHtml,
  generateAppointmentReminderHtml,
} from './email'
import { sendTemplateMessage } from './whatsapp'
import { logger } from '@/lib/logger'

const PORTAL_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://versatiglass.com.br'

// Send quote notification (email + WhatsApp)
export async function sendQuoteNotification(quoteId: string) {
  const quote = await prisma.quote.findUnique({
    where: { id: quoteId },
    include: {
      items: true,
      user: true,
    },
  })

  if (!quote) {
    throw new Error('Quote not found')
  }

  const portalUrl = `${PORTAL_BASE_URL}/portal/orcamentos/${quote.id}`

  // Send email
  const emailResult = await sendEmail({
    to: quote.customerEmail,
    subject: `Orcamento #${quote.number} - Versati Glass`,
    html: generateQuoteEmailHtml({
      customerName: quote.customerName,
      quoteNumber: quote.number,
      total: formatCurrency(Number(quote.total)),
      validUntil: new Date(quote.validUntil).toLocaleDateString('pt-BR'),
      portalUrl,
      items: quote.items.map((item) => ({
        description: item.description,
        quantity: item.quantity,
        price: formatCurrency(Number(item.totalPrice)),
      })),
    }),
  })

  // Send WhatsApp
  const whatsappResult = await sendTemplateMessage(quote.customerPhone, 'quote_sent', {
    customerName: quote.customerName.split(' ')[0],
    quoteNumber: quote.number,
    total: formatCurrency(Number(quote.total)),
    validUntil: new Date(quote.validUntil).toLocaleDateString('pt-BR'),
    portalUrl,
  })

  // Update quote status
  await prisma.quote.update({
    where: { id: quoteId },
    data: {
      status: 'SENT',
      sentAt: new Date(),
    },
  })

  return {
    email: emailResult,
    whatsapp: whatsappResult,
  }
}

// Send order confirmation notification
export async function sendOrderConfirmationNotification(orderId: string) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      user: true,
    },
  })

  if (!order) {
    throw new Error('Order not found')
  }

  const portalUrl = `${PORTAL_BASE_URL}/portal/pedidos/${order.id}`

  // Send email
  const emailResult = await sendEmail({
    to: order.user.email,
    subject: `Pedido #${order.number} Confirmado - Versati Glass`,
    html: generateOrderConfirmationHtml({
      customerName: order.user.name,
      orderNumber: order.number,
      total: formatCurrency(Number(order.total)),
      portalUrl,
    }),
  })

  // Send WhatsApp
  const whatsappResult = await sendTemplateMessage(order.user.phone || '', 'order_approved', {
    customerName: order.user.name.split(' ')[0],
    orderNumber: order.number,
    estimatedDelivery: order.estimatedDelivery
      ? new Date(order.estimatedDelivery).toLocaleDateString('pt-BR')
      : 'A definir',
    portalUrl,
  })

  return {
    email: emailResult,
    whatsapp: whatsappResult,
  }
}

// Send appointment reminder notification
export async function sendAppointmentReminderNotification(appointmentId: string) {
  const appointment = await prisma.appointment.findUnique({
    where: { id: appointmentId },
    include: {
      user: true,
    },
  })

  if (!appointment) {
    throw new Error('Appointment not found')
  }

  const portalUrl = `${PORTAL_BASE_URL}/portal/agendamentos`
  const typeLabels: Record<string, string> = {
    VISITA_TECNICA: 'Visita Tecnica',
    INSTALACAO: 'Instalacao',
    MANUTENCAO: 'Manutencao',
    REVISAO: 'Revisao',
  }

  const address = `${appointment.addressStreet}, ${appointment.addressNumber}${
    appointment.addressComplement ? ` - ${appointment.addressComplement}` : ''
  }, ${appointment.addressNeighborhood}, ${appointment.addressCity}`

  // Send email
  const emailResult = await sendEmail({
    to: appointment.user.email,
    subject: `Lembrete: ${typeLabels[appointment.type]} amanha - Versati Glass`,
    html: generateAppointmentReminderHtml({
      customerName: appointment.user.name,
      type: typeLabels[appointment.type] || appointment.type,
      date: new Date(appointment.scheduledDate).toLocaleDateString('pt-BR', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
      }),
      time: appointment.scheduledTime,
      address,
      portalUrl,
    }),
  })

  // Send WhatsApp
  const whatsappResult = await sendTemplateMessage(
    appointment.user.phone || '',
    'appointment_reminder',
    {
      customerName: appointment.user.name.split(' ')[0],
      date: new Date(appointment.scheduledDate).toLocaleDateString('pt-BR'),
      time: appointment.scheduledTime,
      type: typeLabels[appointment.type] || appointment.type,
      address,
    }
  )

  // Mark reminder as sent
  await prisma.appointment.update({
    where: { id: appointmentId },
    data: { reminderSentAt: new Date() },
  })

  return {
    email: emailResult,
    whatsapp: whatsappResult,
  }
}

// Send installation complete notification
export async function sendInstallationCompleteNotification(orderId: string) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      user: true,
    },
  })

  if (!order) {
    throw new Error('Order not found')
  }

  // Send WhatsApp
  const whatsappResult = await sendTemplateMessage(
    order.user.phone || '',
    'installation_complete',
    {
      customerName: order.user.name.split(' ')[0],
      orderNumber: order.number,
      warrantyUntil: order.warrantyUntil
        ? new Date(order.warrantyUntil).toLocaleDateString('pt-BR')
        : 'N/A',
    }
  )

  return {
    whatsapp: whatsappResult,
  }
}

// Cron job to send appointment reminders (run daily)
export async function sendDailyAppointmentReminders() {
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  tomorrow.setHours(0, 0, 0, 0)

  const dayAfterTomorrow = new Date(tomorrow)
  dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 1)

  // Find appointments for tomorrow that haven't been reminded
  const appointments = await prisma.appointment.findMany({
    where: {
      scheduledDate: {
        gte: tomorrow,
        lt: dayAfterTomorrow,
      },
      status: { in: ['SCHEDULED', 'CONFIRMED'] },
      reminderSentAt: null,
    },
  })

  logger.debug(`Sending reminders for ${appointments.length} appointments`)

  const results = []
  for (const appointment of appointments) {
    try {
      const result = await sendAppointmentReminderNotification(appointment.id)
      results.push({ appointmentId: appointment.id, success: true, result })
    } catch (error) {
      logger.error(`Failed to send reminder for appointment ${appointment.id}:`, error)
      results.push({ appointmentId: appointment.id, success: false, error })
    }
  }

  return results
}
