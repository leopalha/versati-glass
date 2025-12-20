import { render } from '@react-email/render'
import QuoteCreatedEmail from '@/emails/quote-created'
import AppointmentConfirmationEmail from '@/emails/appointment-confirmation'
import OrderStatusUpdateEmail from '@/emails/order-status-update'
import ical, { ICalCalendar } from 'ical-generator'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

// Email Template Types
export interface QuoteEmailData {
  customerName: string
  customerEmail: string
  quoteNumber: string
  items: Array<{
    productName: string
    quantity: number
    width: number
    height: number
  }>
  totalItems: number
  portalUrl: string
}

export interface AppointmentEmailData {
  customerName: string
  customerEmail: string
  appointmentType: 'TECHNICAL_VISIT' | 'INSTALLATION'
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
  orderNumber?: string
  rescheduleUrl: string
}

export interface OrderStatusEmailData {
  customerName: string
  customerEmail: string
  orderNumber: string
  status:
    | 'PENDING_PAYMENT'
    | 'PAID'
    | 'IN_PRODUCTION'
    | 'READY_FOR_INSTALLATION'
    | 'INSTALLING'
    | 'COMPLETED'
    | 'CANCELLED'
  statusMessage?: string
  estimatedDate?: string
  orderUrl: string
}

/**
 * Render Quote Created Email
 */
export async function renderQuoteCreatedEmail(data: QuoteEmailData): Promise<{
  html: string
  text: string
  subject: string
}> {
  const html = await render(
    QuoteCreatedEmail({
      customerName: data.customerName,
      quoteNumber: data.quoteNumber,
      items: data.items,
      totalItems: data.totalItems,
      portalUrl: data.portalUrl,
    })
  )

  const text = `
Olá ${data.customerName},

Recebemos sua solicitação de orçamento #${data.quoteNumber}!

Itens Solicitados (${data.totalItems}):
${data.items
  .slice(0, 5)
  .map((item) => `- ${item.productName} - ${item.quantity}x (${item.width}m x ${item.height}m)`)
  .join('\n')}
${data.items.length > 5 ? `... e mais ${data.items.length - 5} itens` : ''}

Nossa equipe está revisando seu pedido e entraremos em contato em até 24 horas.

Acompanhe seu orçamento em: ${data.portalUrl}

Versati Glass - Vidros Premium
Rio de Janeiro, RJ
Tel: +55 21 99999-9999
Email: contato@versatiglass.com.br
  `.trim()

  return {
    html,
    text,
    subject: `Orçamento ${data.quoteNumber} recebido - Versati Glass`,
  }
}

/**
 * Render Appointment Confirmation Email with .ics attachment
 */
export async function renderAppointmentConfirmationEmail(data: AppointmentEmailData): Promise<{
  html: string
  text: string
  subject: string
  icsAttachment: string
}> {
  const typeLabel = data.appointmentType === 'TECHNICAL_VISIT' ? 'Visita Técnica' : 'Instalação'

  const formattedDate = format(data.scheduledDate, "dd 'de' MMMM 'de' yyyy", {
    locale: ptBR,
  })

  const fullAddress = `${data.address.street}, ${data.address.number}${data.address.complement ? ` - ${data.address.complement}` : ''} - ${data.address.neighborhood}, ${data.address.city} - ${data.address.state}`

  const html = await render(
    AppointmentConfirmationEmail({
      customerName: data.customerName,
      appointmentType: data.appointmentType,
      scheduledDate: formattedDate,
      scheduledTime: data.scheduledTime,
      address: fullAddress,
      quoteNumber: data.quoteNumber,
      orderNumber: data.orderNumber,
      rescheduleUrl: data.rescheduleUrl,
      calendarAttachment: true,
    })
  )

  const text = `
Olá ${data.customerName},

Sua ${typeLabel.toLowerCase()} foi agendada com sucesso!

📅 Detalhes do Agendamento:
Data: ${formattedDate}
Horário: ${data.scheduledTime}
Local: ${fullAddress}
${data.quoteNumber ? `Orçamento: #${data.quoteNumber}` : ''}
${data.orderNumber ? `Pedido: #${data.orderNumber}` : ''}

Importante:
- Certifique-se de que haverá alguém presente no local
- Mantenha o acesso livre ao local de instalação
- Para reagendar, avise com pelo menos 24h de antecedência

Reagendar ou cancelar: ${data.rescheduleUrl}

Dúvidas?
📱 WhatsApp: +55 (21) 98253-6229
✉ Email: versatiglass@gmail.com

Versati Glass - Vidros Premium
  `.trim()

  // Generate .ics file
  const icsAttachment = generateICSFile(data)

  return {
    html,
    text,
    subject: `${typeLabel} agendada - ${formattedDate} às ${data.scheduledTime}`,
    icsAttachment,
  }
}

/**
 * Render Order Status Update Email
 */
export async function renderOrderStatusUpdateEmail(data: OrderStatusEmailData): Promise<{
  html: string
  text: string
  subject: string
}> {
  const statusLabels: Record<string, string> = {
    PENDING_PAYMENT: 'Aguardando Pagamento',
    PAID: 'Pagamento Confirmado',
    IN_PRODUCTION: 'Em Produção',
    READY_FOR_INSTALLATION: 'Pronto para Instalação',
    INSTALLING: 'Instalação em Andamento',
    COMPLETED: 'Concluído',
    CANCELLED: 'Cancelado',
  }

  const statusLabel = statusLabels[data.status] || 'Atualização'

  const html = await render(
    OrderStatusUpdateEmail({
      customerName: data.customerName,
      orderNumber: data.orderNumber,
      status: data.status,
      statusMessage: data.statusMessage || '',
      estimatedDate: data.estimatedDate,
      orderUrl: data.orderUrl,
    })
  )

  const text = `
Olá ${data.customerName},

Atualização do Pedido #${data.orderNumber}

Status: ${statusLabel}

${data.statusMessage || ''}

${data.estimatedDate ? `Previsão: ${data.estimatedDate}` : ''}

Ver detalhes: ${data.orderUrl}

Versati Glass - Vidros Premium
Rio de Janeiro, RJ
Tel: +55 21 99999-9999
Email: contato@versatiglass.com.br
  `.trim()

  return {
    html,
    text,
    subject: `Pedido ${data.orderNumber} - ${statusLabel}`,
  }
}

/**
 * Generate .ics calendar file for appointment
 */
function generateICSFile(data: AppointmentEmailData): string {
  const calendar: ICalCalendar = ical({ name: 'Versati Glass - Agendamento' })

  // Parse time to create start/end datetime
  const [hours, minutes] = data.scheduledTime.split(':').map(Number)
  const startDate = new Date(data.scheduledDate)
  startDate.setHours(hours, minutes, 0, 0)

  // Duration: 2h for technical visit, 4h for installation
  const duration = data.appointmentType === 'TECHNICAL_VISIT' ? 2 : 4
  const endDate = new Date(startDate)
  endDate.setHours(startDate.getHours() + duration)

  const typeLabel = data.appointmentType === 'TECHNICAL_VISIT' ? 'Visita Técnica' : 'Instalação'

  const fullAddress = `${data.address.street}, ${data.address.number}${data.address.complement ? ` - ${data.address.complement}` : ''} - ${data.address.neighborhood}, ${data.address.city} - ${data.address.state}, ${data.address.zipCode}`

  const description = `
${typeLabel} - Versati Glass

${data.quoteNumber ? `Orçamento: #${data.quoteNumber}` : ''}
${data.orderNumber ? `Pedido: #${data.orderNumber}` : ''}

Endereço: ${fullAddress}

Importante:
- Certifique-se de que haverá alguém presente no local
- Mantenha o acesso livre ao local de instalação

Reagendar: ${data.rescheduleUrl}

Contato:
Tel: +55 21 99999-9999
Email: contato@versatiglass.com.br
  `.trim()

  calendar.createEvent({
    start: startDate,
    end: endDate,
    summary: `Versati Glass - ${typeLabel}`,
    description,
    location: fullAddress,
    url: data.rescheduleUrl,
    organizer: {
      name: 'Versati Glass',
      email: 'contato@versatiglass.com.br',
    },
    attendees: [
      {
        name: data.customerName,
        email: data.customerEmail,
        rsvp: true,
      },
    ],
    // Reminders
    alarms: [
      {
        trigger: 60 * 24, // 1 day before (in minutes)
        description: `Lembrete: ${typeLabel} amanhã`,
      },
      {
        trigger: 60, // 1 hour before
        description: `Lembrete: ${typeLabel} em 1 hora`,
      },
      {
        trigger: 15, // 15 minutes before
        description: `Lembrete: ${typeLabel} em 15 minutos`,
      },
    ],
  })

  return calendar.toString()
}
