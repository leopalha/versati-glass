import { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { WhatsAppConversationList } from '@/components/admin/whatsapp-conversation-list'

export const metadata: Metadata = {
  title: 'Conversas WhatsApp | Admin - Versati Glass',
  description: 'Gerenciar conversas WhatsApp com clientes',
}

async function getConversations() {
  // Agrupar mensagens por telefone (from para INBOUND, to para OUTBOUND)
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

  // Agrupar por número de telefone
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

  return conversations
}

export default async function WhatsAppPage() {
  const session = await auth()

  if (!session?.user || session.user.role !== 'ADMIN') {
    redirect('/login')
  }

  const conversations = await getConversations()

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold">Conversas WhatsApp</h1>
        <p className="text-muted-foreground">Gerenciar conversas com clientes via WhatsApp</p>
      </div>

      <WhatsAppConversationList conversations={conversations} />
    </div>
  )
}
