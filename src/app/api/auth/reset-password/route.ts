import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { logger } from '@/lib/logger'

const resetSchema = z.object({
  token: z.string().min(1, 'Token é obrigatório'),
  password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
})

/**
 * POST /api/auth/reset-password
 * Redefine a senha usando o token enviado por email
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const parsed = resetSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Dados inválidos', details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const { token, password } = parsed.data

    // Buscar o token no banco (armazenado como Account temporário)
    const resetAccount = await prisma.account.findFirst({
      where: {
        type: 'password_reset',
        providerAccountId: token,
        token_type: 'reset',
      },
      include: {
        user: true,
      },
    })

    if (!resetAccount) {
      return NextResponse.json({ error: 'Token inválido ou expirado' }, { status: 400 })
    }

    // Verificar se o token expirou
    const expiresAt = resetAccount.expires_at ? new Date(resetAccount.expires_at * 1000) : null

    if (!expiresAt || expiresAt < new Date()) {
      // Limpar token expirado
      await prisma.account.delete({
        where: { id: resetAccount.id },
      })
      return NextResponse.json(
        { error: 'Token expirado. Solicite um novo link de recuperação.' },
        { status: 400 }
      )
    }

    // Hash da nova senha
    const hashedPassword = await bcrypt.hash(password, 12)

    // Atualizar senha do usuário
    await prisma.user.update({
      where: { id: resetAccount.userId },
      data: { password: hashedPassword },
    })

    // Remover token usado
    await prisma.account.delete({
      where: { id: resetAccount.id },
    })

    return NextResponse.json({
      success: true,
      message: 'Senha alterada com sucesso!',
    })
  } catch (error) {
    logger.error('Password reset error:', error)
    return NextResponse.json({ error: 'Erro ao redefinir senha' }, { status: 500 })
  }
}
