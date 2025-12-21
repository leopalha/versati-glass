import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { logger } from '@/lib/logger'

export interface TimelineEvent {
  id: string
  type: 'web_chat' | 'whatsapp' | 'quote' | 'order' | 'appointment'
  timestamp: Date
  channel?: 'WEB' | 'WHATSAPP'
  title: string
  description: string
  metadata?: Record<string, any>
  linkedEntityId?: string
  status?: string
}

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth()

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const { id: userId } = await params

    // Fetch user
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
      },
    })

    if (!user) {
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 })
    }

    const timeline: TimelineEvent[] = []

    // 1. Fetch AI Conversations (Web Chat)
    const aiConversations = await prisma.aiConversation.findMany({
      where: {
        OR: [
          { userId },
          user.phone ? { linkedPhone: user.phone.replace(/\D/g, '') } : undefined,
        ].filter(Boolean) as any[],
      },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' },
          take: 1,
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    aiConversations.forEach((conv) => {
      const firstMessage = conv.messages[0]
      timeline.push({
        id: conv.id,
        type: 'web_chat',
        channel: 'WEB',
        timestamp: conv.createdAt,
        title: '💬 Conversa no Site',
        description: firstMessage
          ? `Iniciou: "${firstMessage.content.substring(0, 100)}..."`
          : 'Conversa iniciada',
        metadata: {
          messageCount: conv.messages.length,
          status: conv.status,
          quoteContext: conv.quoteContext,
        },
        linkedEntityId: conv.quoteId || undefined,
        status: conv.status,
      })
    })

    // 2. Fetch WhatsApp Conversations
    const whatsappConversations = await prisma.conversation.findMany({
      where: {
        OR: [
          { userId },
          user.phone ? { phoneNumber: user.phone.replace(/\D/g, '') } : undefined,
        ].filter(Boolean) as any[],
      },
      include: {
        messages: {
          where: { direction: 'INBOUND' },
          orderBy: { createdAt: 'asc' },
          take: 1,
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    whatsappConversations.forEach((conv) => {
      const firstMessage = conv.messages[0]
      timeline.push({
        id: conv.id,
        type: 'whatsapp',
        channel: 'WHATSAPP',
        timestamp: conv.createdAt,
        title: '📱 Conversa no WhatsApp',
        description: firstMessage
          ? `Iniciou: "${firstMessage.content.substring(0, 100)}..."`
          : 'Conversa iniciada',
        metadata: {
          messageCount: conv.messages.length,
          status: conv.status,
          assignedToId: conv.assignedToId,
        },
        linkedEntityId: conv.quoteId || undefined,
        status: conv.status,
      })
    })

    // 3. Fetch Quotes
    const quotes = await prisma.quote.findMany({
      where: { userId },
      include: {
        items: true,
      },
      orderBy: { createdAt: 'desc' },
    })

    quotes.forEach((quote) => {
      timeline.push({
        id: quote.id,
        type: 'quote',
        timestamp: quote.createdAt,
        title: `📋 Orçamento #${quote.number}`,
        description: `${quote.items.length} item(ns) • Total: R$ ${Number(quote.total).toFixed(2)} • Origem: ${quote.source}`,
        metadata: {
          number: quote.number,
          total: Number(quote.total),
          itemCount: quote.items.length,
          source: quote.source,
        },
        status: quote.status,
      })
    })

    // 4. Fetch Orders
    const orders = await prisma.order.findMany({
      where: { userId },
      include: {
        items: true,
      },
      orderBy: { createdAt: 'desc' },
    })

    orders.forEach((order) => {
      timeline.push({
        id: order.id,
        type: 'order',
        timestamp: order.createdAt,
        title: `🛒 Pedido #${order.number}`,
        description: `${order.items.length} item(ns) • Total: R$ ${Number(order.total).toFixed(2)} • Pagamento: ${order.paymentStatus}`,
        metadata: {
          number: order.number,
          total: Number(order.total),
          itemCount: order.items.length,
          paymentStatus: order.paymentStatus,
        },
        status: order.status,
      })
    })

    // 5. Fetch Appointments
    const appointments = await prisma.appointment.findMany({
      where: { userId },
      orderBy: { scheduledDate: 'desc' },
    })

    appointments.forEach((appt) => {
      const address = `${appt.addressStreet}, ${appt.addressNumber} - ${appt.addressNeighborhood}, ${appt.addressCity}`
      timeline.push({
        id: appt.id,
        type: 'appointment',
        timestamp: appt.scheduledDate,
        title: `📅 Agendamento - ${appt.type}`,
        description: `${new Date(appt.scheduledDate).toLocaleDateString('pt-BR')} às ${appt.scheduledTime} • ${address}`,
        metadata: {
          type: appt.type,
          scheduledDate: appt.scheduledDate,
          scheduledTime: appt.scheduledTime,
          address,
        },
        status: appt.status,
      })
    })

    // Sort timeline by timestamp (most recent first)
    timeline.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())

    logger.info('[TIMELINE] Fetched customer timeline', {
      userId,
      eventCount: timeline.length,
    })

    return NextResponse.json({
      user,
      timeline,
      stats: {
        totalEvents: timeline.length,
        webChats: aiConversations.length,
        whatsappChats: whatsappConversations.length,
        quotes: quotes.length,
        orders: orders.length,
        appointments: appointments.length,
      },
    })
  } catch (error) {
    logger.error('[TIMELINE] Error fetching:', error)
    return NextResponse.json({ error: 'Erro ao buscar timeline' }, { status: 500 })
  }
}
