import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { sendTemplateMessage } from '@/services/whatsapp'
import { startConversation, sendHumanResponse } from '@/services/conversation'
import { logger } from '@/lib/logger'

// Send a new WhatsApp message
export async function POST(request: NextRequest) {
  try {
    const session = await auth()

    // Require authentication for sending messages
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Only admins and staff can send messages
    if (!['ADMIN', 'STAFF'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    const { to, message, conversationId, template, templateVariables } = body

    if (!to) {
      return NextResponse.json({ error: 'Phone number (to) is required' }, { status: 400 })
    }

    // If it's a template message
    if (template) {
      if (!templateVariables) {
        return NextResponse.json({ error: 'Template variables are required' }, { status: 400 })
      }

      const result = await sendTemplateMessage(to, template, templateVariables)
      return NextResponse.json(result)
    }

    // Regular message
    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 })
    }

    // If conversation exists, use human response
    if (conversationId) {
      const result = await sendHumanResponse(conversationId, message, session.user.id)
      return NextResponse.json(result)
    }

    // Start new conversation
    const conversation = await startConversation(to, message, session.user.id)

    if (!conversation) {
      return NextResponse.json({ error: 'Failed to create conversation' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      conversationId: conversation.id,
    })
  } catch (error) {
    logger.error('Send message error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to send message' },
      { status: 500 }
    )
  }
}
