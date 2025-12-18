import { NextRequest } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

/**
 * Server-Sent Events (SSE) endpoint for real-time WhatsApp notifications
 *
 * Usage:
 * - Admin connects to this endpoint to receive real-time updates
 * - Events sent: new_message, message_status_update, conversation_update
 * - Replaces polling architecture with efficient push-based updates
 *
 * @returns ReadableStream with SSE format
 */
export async function GET(request: NextRequest) {
  // Authenticate admin
  const session = await auth()
  if (!session?.user || session.user.role !== 'ADMIN') {
    return new Response('Unauthorized', { status: 401 })
  }

  // Create encoder for SSE format
  const encoder = new TextEncoder()

  // Track last check timestamp
  let lastCheck = new Date()

  // Create readable stream
  const stream = new ReadableStream({
    async start(controller) {
      // Send initial connection event
      controller.enqueue(
        encoder.encode(`data: ${JSON.stringify({ type: 'connected', timestamp: new Date() })}\n\n`)
      )

      // Poll database every 3 seconds for new messages
      const intervalId = setInterval(async () => {
        try {
          // Fetch new messages since last check
          const newMessages = await prisma.whatsAppMessage.findMany({
            where: {
              createdAt: {
                gt: lastCheck,
              },
            },
            orderBy: {
              createdAt: 'desc',
            },
          })

          // Send event for each new message
          for (const message of newMessages) {
            // Fetch related data if IDs exist
            const user = message.userId
              ? await prisma.user.findUnique({
                  where: { id: message.userId },
                  select: { id: true, name: true, email: true },
                })
              : null

            const quote = message.quoteId
              ? await prisma.quote.findUnique({
                  where: { id: message.quoteId },
                  select: { id: true, number: true },
                })
              : null

            const order = message.orderId
              ? await prisma.order.findUnique({
                  where: { id: message.orderId },
                  select: { id: true, number: true },
                })
              : null

            const event = {
              type: 'new_message',
              data: {
                id: message.id,
                messageId: message.messageId,
                from: message.from,
                to: message.to,
                body: message.body,
                direction: message.direction,
                status: message.status,
                user,
                quote,
                order,
                createdAt: message.createdAt,
              },
              timestamp: new Date(),
            }

            controller.enqueue(encoder.encode(`data: ${JSON.stringify(event)}\n\n`))
          }

          // Update last check timestamp
          if (newMessages.length > 0) {
            lastCheck = newMessages[0].createdAt
          }

          // Send heartbeat every 30 seconds to keep connection alive
          const now = new Date()
          if (now.getTime() - lastCheck.getTime() > 30000) {
            controller.enqueue(encoder.encode(`: heartbeat\n\n`))
          }
        } catch (error) {
          console.error('[SSE] Error fetching messages:', error)
          // Don't close connection on error, just log and continue
        }
      }, 3000) // Check every 3 seconds

      // Cleanup on connection close
      request.signal.addEventListener('abort', () => {
        clearInterval(intervalId)
        controller.close()
      })
    },
  })

  // Return SSE response
  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  })
}
