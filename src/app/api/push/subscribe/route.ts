import { NextResponse } from 'next/server'
import { z } from 'zod'
import { auth } from '@/lib/auth'
import { subscribeToPush } from '@/services/push-notifications'
import { logger } from '@/lib/logger'

const subscribeSchema = z.object({
  subscription: z.object({
    endpoint: z.string().url(),
    keys: z.object({
      p256dh: z.string(),
      auth: z.string(),
    }),
  }),
})

export async function POST(request: Request) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const body = await request.json()
    const parsed = subscribeSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Dados inválidos', details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const { subscription } = parsed.data

    // Get user agent
    const userAgent = request.headers.get('user-agent') || undefined

    // Subscribe user to push notifications
    const result = await subscribeToPush(session.user.id, subscription, userAgent)

    return NextResponse.json({
      success: true,
      subscription: {
        id: result.id,
        endpoint: result.endpoint,
      },
    })
  } catch (error) {
    logger.error('Error subscribing to push notifications:', error)
    return NextResponse.json({ error: 'Erro ao inscrever para notificações push' }, { status: 500 })
  }
}
