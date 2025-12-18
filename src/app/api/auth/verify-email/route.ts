import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { logger } from '@/lib/logger'

/**
 * POST /api/auth/verify-email
 * Verifica o email do usuário usando o token enviado
 */
export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json()

    if (!token) {
      return NextResponse.json({ error: 'Token de verificação é obrigatório' }, { status: 400 })
    }

    // Buscar o token no banco (armazenado como Account temporário)
    const verificationAccount = await prisma.account.findFirst({
      where: {
        type: 'email_verification',
        providerAccountId: token,
        token_type: 'verification',
      },
      include: {
        user: true,
      },
    })

    if (!verificationAccount) {
      return NextResponse.json({ error: 'Token inválido ou expirado' }, { status: 400 })
    }

    // Verificar se o token expirou
    const expiresAt = verificationAccount.expires_at
      ? new Date(verificationAccount.expires_at * 1000)
      : null

    if (!expiresAt || expiresAt < new Date()) {
      // Limpar token expirado
      await prisma.account.delete({
        where: { id: verificationAccount.id },
      })
      return NextResponse.json(
        { error: 'Token expirado. Solicite um novo email de verificação.' },
        { status: 400 }
      )
    }

    // Marcar email como verificado
    await prisma.user.update({
      where: { id: verificationAccount.userId },
      data: { emailVerified: new Date() },
    })

    // Remover token usado
    await prisma.account.delete({
      where: { id: verificationAccount.id },
    })

    return NextResponse.json({
      success: true,
      message: 'Email verificado com sucesso!',
    })
  } catch (error) {
    logger.error('Email verification error:', error)
    return NextResponse.json({ error: 'Erro ao verificar email' }, { status: 500 })
  }
}
