import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

interface RouteContext {
  params: {
    phone: string
  }
}

export async function GET(request: Request, { params }: RouteContext) {
  try {
    const session = await auth()

    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const decodedPhone = decodeURIComponent(params.phone)

    // Buscar mensagens da conversa
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
        createdAt: 'asc',
      },
    })

    if (messages.length === 0) {
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 })
    }

    // Marcar mensagens como lidas
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

    return NextResponse.json({
      phone: decodedPhone,
      customerName: messages[0]?.user?.name || null,
      userId: messages[0]?.userId || null,
      userEmail: messages[0]?.user?.email || null,
      messages,
    })
  } catch (error) {
    console.error('[WhatsApp Conversation] Error:', error)
    return NextResponse.json({ error: 'Failed to fetch conversation' }, { status: 500 })
  }
}
