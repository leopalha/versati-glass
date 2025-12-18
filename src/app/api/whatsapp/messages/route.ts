import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await auth()

    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Buscar todas as mensagens WhatsApp com relacionamentos
    const messages = await prisma.whatsAppMessage.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
        quote: {
          select: {
            id: true,
            number: true,
          },
        },
        order: {
          select: {
            id: true,
            number: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    // Agrupar por número de telefone do cliente
    const conversationsMap = new Map<string, any>()

    messages.forEach((msg) => {
      // Determinar o número do cliente (quem está conversando)
      const customerPhone = msg.direction === 'INBOUND' ? msg.from : msg.to

      if (!conversationsMap.has(customerPhone)) {
        conversationsMap.set(customerPhone, {
          phone: customerPhone,
          customerName: msg.user?.name || null,
          userId: msg.userId || null,
          messages: [],
          lastMessageAt: msg.createdAt,
          unreadCount: 0,
        })
      }

      const conversation = conversationsMap.get(customerPhone)!
      conversation.messages.push(msg)

      // Atualizar data da última mensagem
      if (msg.createdAt > conversation.lastMessageAt) {
        conversation.lastMessageAt = msg.createdAt
      }

      // Contar mensagens não lidas (INBOUND que não foram marcadas como READ)
      if (msg.direction === 'INBOUND' && msg.status !== 'READ') {
        conversation.unreadCount++
      }
    })

    // Converter Map para Array e ordenar por última mensagem
    const conversations = Array.from(conversationsMap.values()).sort(
      (a, b) => b.lastMessageAt.getTime() - a.lastMessageAt.getTime()
    )

    return NextResponse.json({
      conversations,
      total: conversations.length,
      unreadTotal: conversations.reduce((sum, c) => sum + c.unreadCount, 0),
    })
  } catch (error) {
    console.error('[WhatsApp Messages] Error:', error)
    return NextResponse.json({ error: 'Failed to fetch WhatsApp conversations' }, { status: 500 })
  }
}
