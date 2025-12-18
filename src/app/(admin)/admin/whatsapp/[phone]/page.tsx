import { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import { redirect, notFound } from 'next/navigation'
import { auth } from '@/lib/auth'
import { WhatsAppConversationView } from '@/components/admin/whatsapp-conversation-view'

export const metadata: Metadata = {
  title: 'Conversa WhatsApp | Admin - Versati Glass',
}

interface PageProps {
  params: {
    phone: string
  }
}

async function getConversation(phone: string) {
  const decodedPhone = decodeURIComponent(phone)

  // Buscar todas as mensagens desta conversa
  const messages = await prisma.whatsAppMessage.findMany({
    where: {
      OR: [{ from: decodedPhone }, { to: decodedPhone }],
    },
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
          status: true,
        },
      },
      order: {
        select: {
          id: true,
          number: true,
          status: true,
        },
      },
    },
    orderBy: {
      createdAt: 'asc', // Ordem cronológica para thread
    },
  })

  if (messages.length === 0) {
    return null
  }

  // Marcar mensagens INBOUND como READ
  await prisma.whatsAppMessage.updateMany({
    where: {
      from: decodedPhone,
      direction: 'INBOUND',
      status: { not: 'READ' },
    },
    data: {
      status: 'READ',
    },
  })

  return {
    phone: decodedPhone,
    customerName: messages[0]?.user?.name || null,
    userId: messages[0]?.userId || null,
    userEmail: messages[0]?.user?.email || null,
    messages,
  }
}

export default async function WhatsAppConversationPage({ params }: PageProps) {
  const session = await auth()

  if (!session?.user || session.user.role !== 'ADMIN') {
    redirect('/login')
  }

  const conversation = await getConversation(params.phone)

  if (!conversation) {
    notFound()
  }

  return (
    <div className="container mx-auto max-w-5xl px-4 py-8">
      <WhatsAppConversationView
        conversation={conversation}
        adminName={session.user.name || 'Admin'}
      />
    </div>
  )
}
