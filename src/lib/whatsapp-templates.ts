/**
 * WhatsApp Message Templates
 *
 * IMPORTANTE: Templates com variáveis precisam ser aprovados pelo WhatsApp Business API
 * antes de serem usados em produção. Durante desenvolvimento/teste, use mensagens simples.
 *
 * Status: ⚠️ TEMPLATES AGUARDANDO APROVAÇÃO WHATSAPP
 */

export interface TemplateVariables {
  [key: string]: string | number
}

/**
 * Template para notificar empresa sobre novo orçamento criado
 */
export function quoteCreatedTemplate(variables: {
  quoteNumber: string
  customerName: string
  itemsCount: number
  totalValue?: number
}): string {
  const { quoteNumber, customerName, itemsCount, totalValue } = variables

  // Durante sandbox/teste: mensagem simples sem formatação especial
  if (
    process.env.NODE_ENV === 'development' ||
    process.env.TWILIO_WHATSAPP_NUMBER?.includes('14155238886')
  ) {
    return `🔔 *Novo Orçamento Recebido*

Nº ${quoteNumber}
Cliente: ${customerName}
Itens: ${itemsCount}
${totalValue ? `Valor: R$ ${totalValue.toFixed(2)}` : ''}

Acesse o painel admin para revisar.`
  }

  // Produção: Template aprovado pelo WhatsApp
  // Template Name: quote_created
  // Template ID: (será gerado após aprovação)
  return `🔔 *Novo Orçamento Recebido*

Nº {{1}}
Cliente: {{2}}
Produtos: {{3}} itens
${totalValue ? 'Valor: R$ {{4}}' : ''}

Acesse o painel admin para revisar e enviar proposta.`
}

/**
 * Template para notificar empresa sobre novo agendamento
 */
export function appointmentScheduledTemplate(variables: {
  appointmentType: string // "Visita Técnica" ou "Instalação"
  customerName: string
  date: string // formato: "DD/MM/YYYY"
  time: string // formato: "HH:MM"
  address: string
  quoteNumber?: string
}): string {
  const { appointmentType, customerName, date, time, address, quoteNumber } = variables

  if (
    process.env.NODE_ENV === 'development' ||
    process.env.TWILIO_WHATSAPP_NUMBER?.includes('14155238886')
  ) {
    return `📅 *${appointmentType} Agendada*

Cliente: ${customerName}
Data: ${date} às ${time}
Endereço: ${address}
${quoteNumber ? `Orçamento: #${quoteNumber}` : ''}

Não esqueça de confirmar presença com o cliente!`
  }

  return `📅 *${appointmentType} Agendada*

Cliente: {{1}}
Data: {{2}} às {{3}}
Endereço: {{4}}
${quoteNumber ? 'Orçamento: #{{5}}' : ''}

Acesse o painel para mais detalhes.`
}

/**
 * Template para confirmar orçamento aprovado com cliente
 */
export function quoteApprovedTemplate(variables: {
  customerName: string
  quoteNumber: string
  totalValue: number
  nextSteps: string // ex: "aguardando pagamento" ou "agendamento de instalação"
}): string {
  const { customerName, quoteNumber, totalValue, nextSteps } = variables

  if (
    process.env.NODE_ENV === 'development' ||
    process.env.TWILIO_WHATSAPP_NUMBER?.includes('14155238886')
  ) {
    return `✅ *Orçamento Aprovado*

Olá ${customerName}!

Seu orçamento #${quoteNumber} foi aprovado com sucesso!

Valor total: R$ ${totalValue.toFixed(2)}

Próximo passo: ${nextSteps}

Qualquer dúvida, estamos à disposição!

Versati Glass - Vidros Premium`
  }

  return `✅ *Orçamento Aprovado*

Olá {{1}}!

Seu orçamento #{{2}} foi aprovado!
Valor: R$ {{3}}

Próximo passo: {{4}}

Versati Glass`
}

/**
 * Template para lembrete de agendamento (24h antes)
 */
export function appointmentReminderTemplate(variables: {
  customerName: string
  appointmentType: string
  date: string
  time: string
  address: string
}): string {
  const { customerName, appointmentType, date, time, address } = variables

  if (
    process.env.NODE_ENV === 'development' ||
    process.env.TWILIO_WHATSAPP_NUMBER?.includes('14155238886')
  ) {
    return `⏰ *Lembrete de ${appointmentType}*

Olá ${customerName}!

Lembramos que sua ${appointmentType.toLowerCase()} está agendada para:

📅 ${date} às ${time}
📍 ${address}

Estaremos aí pontualmente!

Caso precise reagendar, entre em contato o quanto antes.

Versati Glass`
  }

  return `⏰ *Lembrete de ${appointmentType}*

Olá {{1}}!

Sua ${appointmentType.toLowerCase()} está agendada para:
📅 {{2}} às {{3}}
📍 {{4}}

Estaremos aí pontualmente!

Versati Glass`
}

/**
 * Template para notificar mudança de status do pedido
 */
export function orderStatusUpdateTemplate(variables: {
  customerName: string
  orderNumber: string
  oldStatus: string
  newStatus: string
  message?: string
}): string {
  const { customerName, orderNumber, oldStatus, newStatus, message } = variables

  const statusEmoji: { [key: string]: string } = {
    PENDING: '⏳',
    CONFIRMED: '✅',
    IN_PRODUCTION: '🔨',
    READY_FOR_DELIVERY: '📦',
    IN_DELIVERY: '🚚',
    DELIVERED: '🎉',
    INSTALLED: '✨',
    CANCELLED: '❌',
  }

  const emoji = statusEmoji[newStatus] || '📋'

  if (
    process.env.NODE_ENV === 'development' ||
    process.env.TWILIO_WHATSAPP_NUMBER?.includes('14155238886')
  ) {
    return `${emoji} *Atualização do Pedido #${orderNumber}*

Olá ${customerName}!

Status: ${newStatus.replace(/_/g, ' ')}
${message ? `\n${message}` : ''}

Acompanhe seu pedido pelo portal: https://versatiglass.com.br/portal/pedidos

Versati Glass`
  }

  return `${emoji} *Atualização do Pedido #{{1}}*

Olá {{2}}!

Novo status: {{3}}
${message ? '{{4}}' : ''}

Versati Glass`
}

/**
 * Template genérico para mensagens da empresa ao cliente
 */
export function genericMessageTemplate(variables: {
  customerName?: string
  message: string
}): string {
  const { customerName, message } = variables

  if (customerName) {
    return `Olá ${customerName}!

${message}

Versati Glass - Vidros Premium
(21) 99999-8888`
  }

  return `${message}

Versati Glass - Vidros Premium`
}

/**
 * Helper: Formatar valor monetário para template
 */
export function formatCurrency(value: number): string {
  return value.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

/**
 * Helper: Formatar data para template
 */
export function formatDate(date: Date): string {
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

/**
 * Helper: Formatar hora para template
 */
export function formatTime(date: Date): string {
  return date.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

/**
 * Helper: Limpar nome para uso em templates
 */
export function sanitizeCustomerName(fullName: string): string {
  // Pegar apenas primeiro nome
  return fullName.split(' ')[0]
}

/**
 * DOCUMENTAÇÃO: Como submeter templates para aprovação WhatsApp
 *
 * 1. Acessar: https://business.facebook.com/wa/manage/message-templates/
 * 2. Criar novo template com as seguintes specs:
 *
 * Template: quote_created
 * Categoria: UTILITY
 * Idioma: Portuguese (BR)
 * Header: Nenhum
 * Body:
 *   🔔 *Novo Orçamento Recebido*
 *
 *   Nº {{1}}
 *   Cliente: {{2}}
 *   Produtos: {{3}} itens
 *
 *   Acesse o painel admin para revisar e enviar proposta.
 * Footer: Versati Glass
 * Buttons: Nenhum
 *
 * 3. Aguardar aprovação (normalmente 24-48h)
 * 4. Após aprovado, atualizar código para usar template ID
 *
 * Repetir para cada template acima.
 */

/**
 * Constantes para produção (após aprovação WhatsApp)
 */
export const APPROVED_TEMPLATE_IDS = {
  quote_created: 'PENDING_APPROVAL', // Substituir após aprovação
  appointment_scheduled: 'PENDING_APPROVAL',
  quote_approved: 'PENDING_APPROVAL',
  appointment_reminder: 'PENDING_APPROVAL',
  order_status_update: 'PENDING_APPROVAL',
}

/**
 * Status dos templates
 */
export function getTemplateStatus() {
  return {
    sandbox: process.env.TWILIO_WHATSAPP_NUMBER?.includes('14155238886'),
    templatesApproved: !Object.values(APPROVED_TEMPLATE_IDS).includes('PENDING_APPROVAL'),
    environment: process.env.NODE_ENV,
  }
}
