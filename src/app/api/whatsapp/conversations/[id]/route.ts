import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import {
  getConversationWithMessages,
  closeConversation,
  assignConversation,
} from '@/services/conversation'
import { prisma } from '@/lib/prisma'

interface RouteParams {
  params: Promise<{ id: string }>
}

// Get single conversation with all messages
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth()

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!['ADMIN', 'STAFF'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { id } = await params
    const conversation = await getConversationWithMessages(id)

    if (!conversation) {
      return NextResponse.json(
        { error: 'Conversation not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(conversation)
  } catch (error) {
    console.error('Get conversation error:', error)
    return NextResponse.json(
      { error: 'Failed to get conversation' },
      { status: 500 }
    )
  }
}

// Update conversation (close, assign, etc.)
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth()

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!['ADMIN', 'STAFF'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { id } = await params
    const body = await request.json()
    const { action, assignedToId } = body

    // Verify conversation exists
    const conversation = await prisma.conversation.findUnique({
      where: { id },
    })

    if (!conversation) {
      return NextResponse.json(
        { error: 'Conversation not found' },
        { status: 404 }
      )
    }

    if (action === 'close') {
      await closeConversation(id)
      return NextResponse.json({ success: true, status: 'CLOSED' })
    }

    if (action === 'assign' && assignedToId) {
      await assignConversation(id, assignedToId)
      return NextResponse.json({ success: true, assignedToId })
    }

    if (action === 'reopen') {
      await prisma.conversation.update({
        where: { id },
        data: { status: 'ACTIVE' },
      })
      return NextResponse.json({ success: true, status: 'ACTIVE' })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error) {
    console.error('Update conversation error:', error)
    return NextResponse.json(
      { error: 'Failed to update conversation' },
      { status: 500 }
    )
  }
}
