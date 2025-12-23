import { prisma } from '@/lib/prisma'
import { logger } from '@/lib/logger'

type NotificationType =
  | 'QUOTE_RECEIVED'
  | 'QUOTE_ACCEPTED'
  | 'QUOTE_REJECTED'
  | 'ORDER_STATUS_CHANGED'
  | 'PAYMENT_RECEIVED'
  | 'APPOINTMENT_REMINDER'
  | 'APPOINTMENT_CONFIRMED'
  | 'NEW_MESSAGE'
  | 'SYSTEM'

interface CreateNotificationParams {
  userId: string
  type: NotificationType
  title: string
  message: string
  link?: string
}

export async function createNotification(params: CreateNotificationParams) {
  try {
    const notification = await prisma.$executeRaw`
      INSERT INTO notifications (id, "userId", type, title, message, link, "isRead", "createdAt")
      VALUES (
        ${crypto.randomUUID()},
        ${params.userId},
        ${params.type}::"NotificationType",
        ${params.title},
        ${params.message},
        ${params.link || null},
        false,
        ${new Date()}
      )
    `

    logger.info('In-app notification created', {
      userId: params.userId,
      type: params.type,
      title: params.title,
    })

    return notification
  } catch (error) {
    logger.error('Error creating in-app notification:', error)
    throw error
  }
}

// Helper functions for common notification scenarios

export async function notifyQuoteReceived(userId: string, quoteNumber: string, quoteId: string) {
  return createNotification({
    userId,
    type: 'QUOTE_RECEIVED',
    title: 'Novo Orçamento Recebido',
    message: `Seu orçamento #${quoteNumber} foi criado e está disponível para visualização.`,
    link: `/portal/orcamentos/${quoteId}`,
  })
}

export async function notifyQuoteAccepted(userId: string, quoteNumber: string, quoteId: string) {
  return createNotification({
    userId,
    type: 'QUOTE_ACCEPTED',
    title: 'Orçamento Aceito',
    message: `Seu orçamento #${quoteNumber} foi aceito! Em breve entraremos em contato.`,
    link: `/portal/orcamentos/${quoteId}`,
  })
}

export async function notifyOrderStatusChanged(
  userId: string,
  orderNumber: string,
  orderId: string,
  newStatus: string
) {
  const statusMessages: Record<string, string> = {
    ORCAMENTO_ENVIADO: 'Orçamento enviado para aprovação',
    AGUARDANDO_PAGAMENTO: 'Aguardando confirmação de pagamento',
    PAGAMENTO_CONFIRMADO: 'Pagamento confirmado! Pedido em produção',
    EM_PRODUCAO: 'Seu pedido está em produção',
    PRONTO_INSTALACAO: 'Pedido pronto para instalação',
    INSTALADO: 'Instalação concluída com sucesso!',
  }

  return createNotification({
    userId,
    type: 'ORDER_STATUS_CHANGED',
    title: 'Status do Pedido Atualizado',
    message: `Pedido #${orderNumber}: ${statusMessages[newStatus] || newStatus}`,
    link: `/portal/pedidos/${orderId}`,
  })
}

export async function notifyPaymentReceived(
  userId: string,
  orderNumber: string,
  orderId: string,
  amount: number
) {
  return createNotification({
    userId,
    type: 'PAYMENT_RECEIVED',
    title: 'Pagamento Confirmado',
    message: `Recebemos seu pagamento de R$ ${amount.toFixed(2)} para o pedido #${orderNumber}.`,
    link: `/portal/pedidos/${orderId}`,
  })
}

export async function notifyAppointmentReminder(
  userId: string,
  appointmentId: string,
  type: string,
  date: string,
  time: string
) {
  const typeLabels: Record<string, string> = {
    VISITA_TECNICA: 'Visita Técnica',
    INSTALACAO: 'Instalação',
    MANUTENCAO: 'Manutenção',
    REVISAO: 'Revisão',
  }

  return createNotification({
    userId,
    type: 'APPOINTMENT_REMINDER',
    title: 'Lembrete de Agendamento',
    message: `${typeLabels[type] || type} agendada para ${date} às ${time}.`,
    link: `/portal/agendamentos`,
  })
}

export async function notifyAppointmentConfirmed(
  userId: string,
  appointmentId: string,
  type: string,
  date: string,
  time: string
) {
  const typeLabels: Record<string, string> = {
    VISITA_TECNICA: 'Visita Técnica',
    INSTALACAO: 'Instalação',
    MANUTENCAO: 'Manutenção',
    REVISAO: 'Revisão',
  }

  return createNotification({
    userId,
    type: 'APPOINTMENT_CONFIRMED',
    title: 'Agendamento Confirmado',
    message: `Sua ${typeLabels[type] || type} foi confirmada para ${date} às ${time}.`,
    link: `/portal/agendamentos`,
  })
}

export async function notifyNewMessage(userId: string, senderName: string, conversationId: string) {
  return createNotification({
    userId,
    type: 'NEW_MESSAGE',
    title: 'Nova Mensagem',
    message: `${senderName} enviou uma mensagem para você.`,
    link: `/portal/conversas/${conversationId}`,
  })
}
