import { prisma } from '@/lib/prisma'
import {
  ConversationStatus,
  MessageDirection,
  MessageType,
  SenderType,
  MessageStatus,
} from '@prisma/client'
import { generateAIResponse, generateGreeting, type ConversationMessage } from './ai'
import { sendWhatsAppMessage } from './whatsapp'

export interface ConversationContext {
  customerName?: string
  product?: string
  measurements?: string
  address?: string
  quoteId?: string
  appointmentDate?: string
  step?: 'greeting' | 'product' | 'measurements' | 'contact' | 'schedule' | 'human'
}

// Get or create conversation by phone number
export async function getOrCreateConversation(phoneNumber: string, customerName?: string) {
  // Normalize phone number
  const normalizedPhone = phoneNumber.replace(/\D/g, '')

  // Try to find existing active conversation
  const existingConversation = await prisma.conversation.findFirst({
    where: {
      phoneNumber: normalizedPhone,
      status: { in: ['ACTIVE', 'WAITING_HUMAN'] },
    },
    include: {
      messages: {
        orderBy: { createdAt: 'asc' },
        take: 50,
      },
      user: true,
    },
  })

  if (existingConversation) {
    return existingConversation
  }

  // Try to find user by phone
  const user = await prisma.user.findFirst({
    where: { phone: normalizedPhone },
  })

  // Create new conversation
  const newConversation = await prisma.conversation.create({
    data: {
      phoneNumber: normalizedPhone,
      customerName: customerName || user?.name,
      userId: user?.id,
      status: 'ACTIVE',
      context: { step: 'greeting' },
    },
    include: {
      messages: true,
      user: true,
    },
  })

  return newConversation
}

// Add message to conversation
export async function addMessage(
  conversationId: string,
  direction: MessageDirection,
  content: string,
  senderType: SenderType,
  options?: {
    senderId?: string
    mediaUrl?: string
    messageType?: MessageType
    status?: MessageStatus
  }
) {
  const message = await prisma.message.create({
    data: {
      conversationId,
      direction,
      content,
      senderType,
      type: options?.messageType || 'TEXT',
      mediaUrl: options?.mediaUrl,
      senderId: options?.senderId,
      status: options?.status,
    },
  })

  // Update conversation lastMessageAt
  await prisma.conversation.update({
    where: { id: conversationId },
    data: { lastMessageAt: new Date() },
  })

  return message
}

// Get conversation history for AI
export function getConversationHistoryForAI(
  messages: Array<{
    direction: MessageDirection
    content: string
    senderType: SenderType
  }>
): ConversationMessage[] {
  return messages
    .filter((m) => m.content && m.content.trim() !== '')
    .map((m) => ({
      role: m.direction === 'INBOUND' ? 'user' : 'assistant',
      content: m.content,
    })) as ConversationMessage[]
}

// Process incoming WhatsApp message
export async function processIncomingMessage(
  phoneNumber: string,
  messageContent: string,
  profileName?: string,
  mediaUrl?: string
): Promise<{
  response: string
  conversation: {
    id: string
    status: ConversationStatus
  }
}> {
  // Get or create conversation
  const conversation = await getOrCreateConversation(phoneNumber, profileName)

  // Store incoming message
  await addMessage(conversation.id, 'INBOUND', messageContent, 'CUSTOMER', {
    mediaUrl,
    messageType: mediaUrl ? 'IMAGE' : 'TEXT',
  })

  // Get conversation context
  const context = (conversation.context as ConversationContext) || {}

  // If waiting for human, don't respond with AI
  if (conversation.status === 'WAITING_HUMAN') {
    return {
      response: '',
      conversation: {
        id: conversation.id,
        status: conversation.status,
      },
    }
  }

  // Get customer context for AI
  const customerContext = conversation.user
    ? {
        name: conversation.user.name,
        previousOrders: await prisma.order.count({
          where: { userId: conversation.user.id },
        }),
      }
    : context.customerName
      ? { name: context.customerName }
      : undefined

  // Get conversation history
  const history = getConversationHistoryForAI(conversation.messages)

  // Generate AI response
  const aiResponse = await generateAIResponse(messageContent, history, customerContext)

  // Handle escalation
  if (aiResponse.shouldEscalate) {
    await prisma.conversation.update({
      where: { id: conversation.id },
      data: { status: 'WAITING_HUMAN' },
    })

    const escalationMessage =
      aiResponse.message +
      '\n\n_Um atendente humano sera notificado e entrara em contato em breve._'

    await addMessage(conversation.id, 'OUTBOUND', escalationMessage, 'AI', {
      status: 'SENT',
    })

    // Send via WhatsApp
    await sendWhatsAppMessage({
      to: phoneNumber,
      message: escalationMessage,
    })

    return {
      response: escalationMessage,
      conversation: {
        id: conversation.id,
        status: 'WAITING_HUMAN',
      },
    }
  }

  // Update context with extracted data
  if (aiResponse.extractedData) {
    const updatedContext = {
      ...context,
      ...aiResponse.extractedData,
    }

    await prisma.conversation.update({
      where: { id: conversation.id },
      data: {
        context: updatedContext as object,
        customerName: aiResponse.extractedData.name || conversation.customerName,
      },
    })
  }

  // Store AI response
  await addMessage(conversation.id, 'OUTBOUND', aiResponse.message, 'AI', {
    status: 'SENT',
  })

  // Send via WhatsApp
  await sendWhatsAppMessage({
    to: phoneNumber,
    message: aiResponse.message,
  })

  return {
    response: aiResponse.message,
    conversation: {
      id: conversation.id,
      status: conversation.status,
    },
  }
}

// Send message from human agent
export async function sendHumanResponse(
  conversationId: string,
  message: string,
  senderId: string
) {
  const conversation = await prisma.conversation.findUnique({
    where: { id: conversationId },
  })

  if (!conversation) {
    throw new Error('Conversation not found')
  }

  // Store message
  await addMessage(conversationId, 'OUTBOUND', message, 'HUMAN', {
    senderId,
    status: 'SENT',
  })

  // Send via WhatsApp
  const result = await sendWhatsAppMessage({
    to: conversation.phoneNumber,
    message,
  })

  // Update conversation status back to active
  await prisma.conversation.update({
    where: { id: conversationId },
    data: {
      status: 'ACTIVE',
      assignedToId: senderId,
    },
  })

  return result
}

// Close conversation
export async function closeConversation(conversationId: string) {
  await prisma.conversation.update({
    where: { id: conversationId },
    data: { status: 'CLOSED' },
  })
}

// Get active conversations (for admin)
export async function getActiveConversations() {
  return prisma.conversation.findMany({
    where: {
      status: { in: ['ACTIVE', 'WAITING_HUMAN'] },
    },
    include: {
      messages: {
        orderBy: { createdAt: 'desc' },
        take: 1,
      },
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      assignedTo: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    orderBy: { lastMessageAt: 'desc' },
  })
}

// Get conversation with messages
export async function getConversationWithMessages(conversationId: string) {
  return prisma.conversation.findUnique({
    where: { id: conversationId },
    include: {
      messages: {
        orderBy: { createdAt: 'asc' },
      },
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
          total: true,
        },
      },
    },
  })
}

// Start new conversation (outbound)
export async function startConversation(
  phoneNumber: string,
  initialMessage: string,
  senderId?: string
) {
  // Create conversation
  const conversation = await getOrCreateConversation(phoneNumber)

  // If it's a greeting, use the AI greeting
  const messageToSend = initialMessage || generateGreeting()

  // Store message
  await addMessage(
    conversation.id,
    'OUTBOUND',
    messageToSend,
    senderId ? 'HUMAN' : 'AI',
    {
      senderId,
      status: 'SENT',
    }
  )

  // Send via WhatsApp
  await sendWhatsAppMessage({
    to: phoneNumber,
    message: messageToSend,
  })

  return conversation
}

// Assign conversation to agent
export async function assignConversation(conversationId: string, agentId: string) {
  return prisma.conversation.update({
    where: { id: conversationId },
    data: {
      assignedToId: agentId,
      status: 'WAITING_HUMAN',
    },
  })
}
