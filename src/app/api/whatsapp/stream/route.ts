import { NextRequest } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { logger } from '@/lib/logger'

// SSE endpoint for real-time WhatsApp message updates
export async function GET(request: NextRequest) {
  const session = await auth()

  if (!session?.user || !['ADMIN', 'STAFF'].includes(session.user.role)) {
    return new Response('Unauthorized', { status: 401 })
  }

  const encoder = new TextEncoder()

  // Create a transform stream for SSE
  const stream = new ReadableStream({
    async start(controller) {
      // Send initial connection message
      controller.enqueue(
        encoder.encode(`data: ${JSON.stringify({ type: 'connected', timestamp: Date.now() })}\n\n`)
      )

      // Poll for new messages every 3 seconds
      const intervalId = setInterval(async () => {
        try {
          // Get recent conversations with new messages
          const conversations = await prisma.conversation.findMany({
            where: {
              lastMessageAt: {
                gte: new Date(Date.now() - 10000), // Last 10 seconds
              },
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
                },
              },
            },
            orderBy: { lastMessageAt: 'desc' },
            take: 20,
          })

          if (conversations.length > 0) {
            controller.enqueue(
              encoder.encode(
                `data: ${JSON.stringify({
                  type: 'update',
                  conversations,
                  timestamp: Date.now(),
                })}\n\n`
              )
            )
          }

          // Send heartbeat
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({ type: 'heartbeat', timestamp: Date.now() })}\n\n`
            )
          )
        } catch (error) {
          logger.error('Error in WhatsApp SSE stream:', error)
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({
                type: 'error',
                error: 'Failed to fetch updates',
                timestamp: Date.now(),
              })}\n\n`
            )
          )
        }
      }, 3000) // Poll every 3 seconds

      // Cleanup on close
      request.signal.addEventListener('abort', () => {
        clearInterval(intervalId)
        controller.close()
      })
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  })
}
