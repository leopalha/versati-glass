import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import crypto from 'crypto'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { sendEmail, generateEmailVerificationHtml } from '@/services/email'
import { rateLimitSync as rateLimit, getClientIp, RATE_LIMITS } from '@/lib/rate-limit'
import { logger } from '@/lib/logger'

const registerSchema = z.object({
  name: z.string().min(2, 'Nome deve ter no minimo 2 caracteres'),
  email: z.string().email('Email invalido'),
  password: z.string().min(6, 'Senha deve ter no minimo 6 caracteres'),
  phone: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const clientIp = getClientIp(request)
    const rateLimitResult = rateLimit(`register:${clientIp}`, RATE_LIMITS.strict)

    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: `Muitas tentativas. Tente novamente em ${rateLimitResult.resetIn} segundos.` },
        { status: 429 }
      )
    }

    const body = await request.json()
    const parsed = registerSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Dados invalidos', details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const { name, email, password, phone } = parsed.data
    const normalizedEmail = email.toLowerCase()

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    })

    if (existingUser) {
      return NextResponse.json({ error: 'Este email ja esta cadastrado' }, { status: 409 })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email: normalizedEmail,
        password: hashedPassword,
        phone: phone || null,
        role: 'CUSTOMER',
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    })

    // Gerar token de verificação de email
    const verificationToken = crypto.randomBytes(32).toString('hex')
    const tokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 horas

    // Salvar token
    await prisma.account.create({
      data: {
        userId: user.id,
        type: 'email_verification',
        provider: 'email',
        providerAccountId: verificationToken,
        expires_at: Math.floor(tokenExpiry.getTime() / 1000),
        token_type: 'verification',
      },
    })

    // Enviar email de verificação (não bloqueia o registro se falhar)
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'
    const verificationUrl = `${baseUrl}/verificar-email?token=${verificationToken}`

    sendEmail({
      to: user.email,
      subject: 'Verifique seu email - Versati Glass',
      html: generateEmailVerificationHtml({
        userName: user.name || 'Cliente',
        verificationUrl,
      }),
      text: `Olá ${user.name || 'Cliente'}!\n\nClique no link para verificar seu email: ${verificationUrl}\n\nEste link expira em 24 horas.`,
    }).catch((err) => {
      logger.error('Failed to send verification email:', err)
    })

    return NextResponse.json(
      {
        message: 'Usuario criado com sucesso. Verifique seu email para ativar a conta.',
        user,
        requiresVerification: true,
      },
      { status: 201 }
    )
  } catch (error) {
    logger.error('Registration error:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}
