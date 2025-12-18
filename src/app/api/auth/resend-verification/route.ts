import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendEmail, generateEmailVerificationHtml } from '@/services/email'
import crypto from 'crypto'
import { auth } from '@/lib/auth'
import { logger } from '@/lib/logger'

/**
 * POST /api/auth/resend-verification
 * Reenvia o email de verificação
 */
export async function POST(request: NextRequest) {
  try {
    const session = await auth()

    // Pode ser chamado por usuário logado ou com email no body
    let userEmail: string | null = null

    if (session?.user?.email) {
      userEmail = session.user.email
    } else {
      const body = await request.json()
      userEmail = body.email
    }

    if (!userEmail) {
      return NextResponse.json({ error: 'Email é obrigatório' }, { status: 400 })
    }

    // Buscar usuário
    const user = await prisma.user.findUnique({
      where: { email: userEmail.toLowerCase() },
    })

    // Não revelar se usuário existe
    if (!user) {
      return NextResponse.json({
        message: 'Se o email estiver cadastrado, você receberá o link de verificação.',
      })
    }

    // Se já verificou, não precisa enviar novamente
    if (user.emailVerified) {
      return NextResponse.json({
        message: 'Este email já foi verificado.',
      })
    }

    // Deletar tokens antigos de verificação
    await prisma.account.deleteMany({
      where: {
        userId: user.id,
        type: 'email_verification',
      },
    })

    // Gerar novo token
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

    // URL de verificação
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'
    const verificationUrl = `${baseUrl}/verificar-email?token=${verificationToken}`

    // Enviar email
    const emailResult = await sendEmail({
      to: user.email,
      subject: 'Verifique seu email - Versati Glass',
      html: generateEmailVerificationHtml({
        userName: user.name || 'Cliente',
        verificationUrl,
      }),
      text: `Olá ${user.name || 'Cliente'}!\n\nClique no link para verificar seu email: ${verificationUrl}\n\nEste link expira em 24 horas.`,
    })

    if (!emailResult.success) {
      logger.error('Failed to send verification email:', emailResult.error)
      return NextResponse.json({ error: 'Falha ao enviar email de verificação' }, { status: 500 })
    }

    return NextResponse.json({
      message: 'Email de verificação enviado com sucesso!',
    })
  } catch (error) {
    logger.error('Resend verification error:', error)
    return NextResponse.json({ error: 'Erro ao enviar email de verificação' }, { status: 500 })
  }
}
