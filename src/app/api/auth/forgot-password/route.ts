import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendEmail, generatePasswordResetHtml } from '@/services/email'
import crypto from 'crypto'
import { rateLimitSync as rateLimit, getClientIp, RATE_LIMITS } from '@/lib/rate-limit'
import { logger } from '@/lib/logger'

/**
 * POST /api/auth/forgot-password
 * Envia email com link de reset de senha
 */
export async function POST(request: NextRequest) {
  try {
    // Rate limiting - stricter for password reset
    const clientIp = getClientIp(request)
    const rateLimitResult = rateLimit(`forgot-password:${clientIp}`, RATE_LIMITS.passwordReset)

    if (!rateLimitResult.success) {
      return NextResponse.json(
        {
          error: `Muitas tentativas. Tente novamente em ${Math.ceil(rateLimitResult.resetIn / 60)} minutos.`,
        },
        { status: 429 }
      )
    }

    const body = await request.json()
    const { email } = body

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    // Buscar usuário
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    })

    // Não revelar se usuário existe (segurança)
    if (!user) {
      return NextResponse.json({
        message: 'If this email exists, a password reset link has been sent.',
      })
    }

    // Gerar token de reset
    const resetToken = crypto.randomBytes(32).toString('hex')
    const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000) // 1 hora

    // Salvar token no banco (usando campo de session ou account temporariamente)
    // Como não temos campo resetToken no User, vamos criar um Account temporário
    await prisma.account.create({
      data: {
        userId: user.id,
        type: 'password_reset',
        provider: 'email',
        providerAccountId: resetToken,
        expires_at: Math.floor(resetTokenExpiry.getTime() / 1000),
        token_type: 'reset',
      },
    })

    // URL de reset
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'
    const resetUrl = `${baseUrl}/redefinir-senha?token=${resetToken}`

    // Enviar email
    const emailResult = await sendEmail({
      to: user.email,
      subject: 'Redefinir Senha - Versati Glass',
      html: generatePasswordResetHtml({ resetUrl }),
      text: `Clique no link para redefinir sua senha: ${resetUrl}\n\nEste link expira em 1 hora.`,
    })

    if (!emailResult.success) {
      logger.error('Failed to send password reset email:', emailResult.error)
      return NextResponse.json({ error: 'Failed to send email' }, { status: 500 })
    }

    return NextResponse.json({
      message: 'If this email exists, a password reset link has been sent.',
    })
  } catch (error) {
    logger.error('Forgot password error:', error)
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 })
  }
}
