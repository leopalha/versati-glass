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
  // Buscar conversas do modelo Conversation (WhatsApp)
  const conversations = await prisma.conversation.findMany({
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
      messages: {
        orderBy: {
          createdAt: 'asc',
        },
        include: {
          sender: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
            },
          },
        },
      },
    },
    orderBy: {
      lastMessageAt: 'desc',
    },
  })

  // Transformar para o formato esperado pelo componente
  return conversations.map((conv) => {
    // Contar mensagens não lidas (INBOUND que não foram marcadas como READ)
    const unreadCount = conv.messages.filter(
      (msg) => msg.direction === 'INBOUND' && msg.status !== 'READ'
    ).length

    // Transformar mensagens para o formato esperado
    const messages = conv.messages.map((msg) => ({
      id: msg.id,
      messageId: msg.id, // Usar o mesmo ID
      from: msg.direction === 'INBOUND' ? conv.phoneNumber : process.env.TWILIO_PHONE_NUMBER || '',
      to: msg.direction === 'OUTBOUND' ? conv.phoneNumber : process.env.TWILIO_PHONE_NUMBER || '',
      body: msg.content,
      direction: msg.direction,
      status: msg.status || 'SENT',
      createdAt: msg.createdAt,
      user: conv.user,
      quote: conv.quote,
      order: null, // Não temos referência direta a order em Message
    }))

    return {
      phone: conv.phoneNumber,
      customerName: conv.customerName || conv.user?.name || null,
      userId: conv.userId || null,
      messages,
      lastMessageAt: conv.lastMessageAt,
      unreadCount,
    }
  })
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
