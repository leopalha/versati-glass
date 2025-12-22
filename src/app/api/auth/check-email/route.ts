import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { rateLimitSync as rateLimit, getClientIp, RATE_LIMITS } from '@/lib/rate-limit'
import { logger } from '@/lib/logger'

/**
 * Check Email API
 *
 * Verifies if an email already exists in the system.
 * Returns user data (without sensitive info) if found.
 * Used during quote flow to auto-fill customer data.
 */

const checkEmailSchema = z.object({
  email: z.string().email('Email invalido'),
})

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const clientIp = getClientIp(request)
    const rateLimitResult = rateLimit(`check-email:${clientIp}`, RATE_LIMITS.moderate)

    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: `Muitas tentativas. Tente novamente em ${rateLimitResult.resetIn} segundos.` },
        { status: 429 }
      )
    }

    const body = await request.json()
    const parsed = checkEmailSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Email invalido', details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const { email } = parsed.data
    const normalizedEmail = email.toLowerCase()

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        cpfCnpj: true,
        street: true,
        number: true,
        complement: true,
        neighborhood: true,
        city: true,
        state: true,
        zipCode: true,
        authProvider: true,
        password: true, // Just to check if they have a password set
      },
    })

    if (!existingUser) {
      return NextResponse.json({
        exists: false,
        message: 'Email não encontrado',
      })
    }

    // Check if user has password (can login with credentials)
    const hasPassword = !!existingUser.password
    const isGoogleUser = existingUser.authProvider === 'GOOGLE'

    logger.debug('[CHECK-EMAIL] User found:', {
      email: normalizedEmail,
      hasPassword,
      isGoogleUser,
    })

    // Return user data (without password)
    return NextResponse.json({
      exists: true,
      hasPassword,
      isGoogleUser,
      user: {
        name: existingUser.name,
        email: existingUser.email,
        phone: existingUser.phone,
        cpfCnpj: existingUser.cpfCnpj,
        street: existingUser.street,
        number: existingUser.number,
        complement: existingUser.complement,
        neighborhood: existingUser.neighborhood,
        city: existingUser.city,
        state: existingUser.state,
        zipCode: existingUser.zipCode,
      },
    })
  } catch (error) {
    logger.error('[CHECK-EMAIL] Error:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}
