/**
 * Utilitarios para gerar links "Adicionar ao Calendario"
 * Suporta: Google Calendar, Outlook, Apple/ICS
 */

export interface CalendarEventInput {
  title: string
  description: string
  location: string
  startDate: Date
  endDate: Date
}

/**
 * Formata data no formato esperado pelo Google Calendar
 * Formato: YYYYMMDDTHHMMSSZ (UTC)
 */
function formatGoogleDate(date: Date): string {
  return date
    .toISOString()
    .replace(/[-:]/g, '')
    .replace(/\.\d{3}/, '')
}

/**
 * Formata data no formato esperado pelo Outlook
 * Formato: YYYY-MM-DDTHH:MM:SS
 */
function formatOutlookDate(date: Date): string {
  return date.toISOString().slice(0, 19)
}

/**
 * Gera link para adicionar evento ao Google Calendar
 */
export function generateGoogleCalendarLink(event: CalendarEventInput): string {
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: event.title,
    dates: `${formatGoogleDate(event.startDate)}/${formatGoogleDate(event.endDate)}`,
    details: event.description,
    location: event.location,
    ctz: 'America/Sao_Paulo',
  })

  return `https://calendar.google.com/calendar/render?${params.toString()}`
}

/**
 * Gera link para adicionar evento ao Outlook Web
 */
export function generateOutlookCalendarLink(event: CalendarEventInput): string {
  const params = new URLSearchParams({
    path: '/calendar/action/compose',
    rru: 'addevent',
    subject: event.title,
    body: event.description,
    location: event.location,
    startdt: formatOutlookDate(event.startDate),
    enddt: formatOutlookDate(event.endDate),
  })

  return `https://outlook.live.com/calendar/0/deeplink/compose?${params.toString()}`
}

/**
 * Gera link para adicionar evento ao Outlook Office 365
 */
export function generateOffice365CalendarLink(event: CalendarEventInput): string {
  const params = new URLSearchParams({
    path: '/calendar/action/compose',
    rru: 'addevent',
    subject: event.title,
    body: event.description,
    location: event.location,
    startdt: formatOutlookDate(event.startDate),
    enddt: formatOutlookDate(event.endDate),
  })

  return `https://outlook.office.com/calendar/0/deeplink/compose?${params.toString()}`
}

/**
 * Gera conteudo ICS para download (Apple Calendar, outros)
 */
export function generateICSContent(event: CalendarEventInput): string {
  const formatICSDate = (date: Date) =>
    date
      .toISOString()
      .replace(/[-:]/g, '')
      .replace(/\.\d{3}/, '')

  const escapeICS = (text: string) =>
    text.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n')

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Versati Glass//Agendamento//PT',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `DTSTART:${formatICSDate(event.startDate)}`,
    `DTEND:${formatICSDate(event.endDate)}`,
    `SUMMARY:${escapeICS(event.title)}`,
    `DESCRIPTION:${escapeICS(event.description)}`,
    `LOCATION:${escapeICS(event.location)}`,
    `UID:${Date.now()}@versatiglass.com.br`,
    `DTSTAMP:${formatICSDate(new Date())}`,
    'STATUS:CONFIRMED',
    'BEGIN:VALARM',
    'TRIGGER:-PT1H',
    'ACTION:DISPLAY',
    'DESCRIPTION:Lembrete: Visita Versati Glass',
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n')
}

/**
 * Gera data URL para download do arquivo ICS
 */
export function generateICSDataUrl(event: CalendarEventInput): string {
  const icsContent = generateICSContent(event)
  const base64 = Buffer.from(icsContent).toString('base64')
  return `data:text/calendar;base64,${base64}`
}

/**
 * Gera todos os links de calendario para um agendamento
 */
export interface CalendarLinks {
  google: string
  outlook: string
  office365: string
  icsDataUrl: string
  icsContent: string
}

export function generateAllCalendarLinks(event: CalendarEventInput): CalendarLinks {
  return {
    google: generateGoogleCalendarLink(event),
    outlook: generateOutlookCalendarLink(event),
    office365: generateOffice365CalendarLink(event),
    icsDataUrl: generateICSDataUrl(event),
    icsContent: generateICSContent(event),
  }
}

/**
 * Cria evento de agendamento para Versati Glass
 */
export function createVersatiAppointmentEvent(params: {
  type: 'TECHNICAL_VISIT' | 'INSTALLATION'
  scheduledDate: Date
  scheduledTime: string
  address: string
  customerName?: string
  notes?: string
}): CalendarEventInput {
  const { type, scheduledDate, scheduledTime, address, customerName, notes } = params

  // Extrair hora e minutos
  const [hours, minutes] = scheduledTime.split(':').map(Number)

  // Criar data/hora de inicio
  const startDate = new Date(scheduledDate)
  startDate.setHours(hours, minutes, 0, 0)

  // Duracao baseada no tipo
  const durationHours = type === 'INSTALLATION' ? 4 : 2

  // Data/hora de fim
  const endDate = new Date(startDate)
  endDate.setHours(startDate.getHours() + durationHours)

  // Titulo do evento
  const title =
    type === 'INSTALLATION' ? 'Instalacao Versati Glass' : 'Visita Tecnica Versati Glass'

  // Descricao
  const descriptionParts = [
    type === 'INSTALLATION'
      ? 'Instalacao agendada com a Versati Glass.'
      : 'Visita tecnica gratuita para medicao e avaliacao.',
    '',
    `Endereco: ${address}`,
  ]

  if (customerName) {
    descriptionParts.push(`Cliente: ${customerName}`)
  }

  if (notes) {
    descriptionParts.push(``, `Observacoes: ${notes}`)
  }

  descriptionParts.push('', 'Contato: (21) 99535-4010', 'Site: www.versatiglass.com.br')

  return {
    title,
    description: descriptionParts.join('\n'),
    location: address,
    startDate,
    endDate,
  }
}

/**
 * Formata links de calendario para mensagem de texto
 */
export function formatCalendarLinksMessage(links: CalendarLinks): string {
  return [
    '📅 Adicione ao seu calendario:',
    '',
    `• Google: ${links.google}`,
    `• Outlook: ${links.outlook}`,
    '',
    'Ou baixe o arquivo .ics para outros calendarios.',
  ].join('\n')
}
