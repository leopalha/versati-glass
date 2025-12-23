import { NextResponse } from 'next/server'
import { z } from 'zod'
import { auth } from '@/lib/auth'
import { unsubscribeFromPush } from '@/services/push-notifications'
import { logger } from '@/lib/logger'

const unsubscribeSchema = z.object({
  endpoint: z.string().url(),
})

export async function POST(request: Request) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const body = await request.json()
    const parsed = unsubscribeSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Dados inválidos', details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const { endpoint } = parsed.data

    await unsubscribeFromPush(endpoint)

    return NextResponse.json({
      success: true,
      message: 'Notificações push desativadas',
    })
  } catch (error) {
    logger.error('Error unsubscribing from push notifications:', error)
    return NextResponse.json(
      { error: 'Erro ao desinscrever das notificações push' },
      { status: 500 }
    )
  }
}
