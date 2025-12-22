import { NextRequest, NextResponse } from 'next/server'
import { auth, signOut } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { logger } from '@/lib/logger'
import bcrypt from 'bcryptjs'

/**
 * DELETE /api/users/me/delete
 * Delete current user account (soft delete or full delete based on data)
 */
export async function DELETE(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const body = await request.json()
    const { password, confirmation } = body

    // Require confirmation text
    if (confirmation !== 'EXCLUIR MINHA CONTA') {
      return NextResponse.json(
        { error: 'Confirmação inválida. Digite "EXCLUIR MINHA CONTA" para confirmar.' },
        { status: 400 }
      )
    }

    // Get user with password
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        password: true,
        authProvider: true,
        _count: {
          select: {
            orders: true,
            quotes: true,
          },
        },
      },
    })

    if (!user) {
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 })
    }

    // For email users, require password confirmation
    if (user.authProvider === 'EMAIL' && user.password) {
      if (!password) {
        return NextResponse.json({ error: 'Senha é obrigatória' }, { status: 400 })
      }

      const isValidPassword = await bcrypt.compare(password, user.password)
      if (!isValidPassword) {
        return NextResponse.json({ error: 'Senha incorreta' }, { status: 400 })
      }
    }

    // Check if user has orders (can't fully delete if has order history)
    const hasOrders = user._count.orders > 0

    if (hasOrders) {
      // Soft delete: anonymize user data but keep order records
      await prisma.user.update({
        where: { id: session.user.id },
        data: {
          name: 'Usuário Excluído',
          email: `deleted_${session.user.id}@deleted.local`,
          phone: null,
          cpfCnpj: null,
          street: null,
          number: null,
          complement: null,
          neighborhood: null,
          city: null,
          state: null,
          zipCode: null,
          password: null,
          googleId: null,
        },
      })

      logger.info('[USER_DELETE] User anonymized (had orders)', { userId: session.user.id })
    } else {
      // Full delete: remove all user data
      await prisma.$transaction([
        // Delete quotes
        prisma.quote.deleteMany({ where: { userId: session.user.id } }),
        // Delete appointments
        prisma.appointment.deleteMany({ where: { userId: session.user.id } }),
        // Delete documents
        prisma.document.deleteMany({ where: { userId: session.user.id } }),
        // Delete conversations and messages
        prisma.message.deleteMany({
          where: { conversation: { userId: session.user.id } },
        }),
        prisma.conversation.deleteMany({ where: { userId: session.user.id } }),
        // Delete sessions and accounts
        prisma.session.deleteMany({ where: { userId: session.user.id } }),
        prisma.account.deleteMany({ where: { userId: session.user.id } }),
        // Finally delete user
        prisma.user.delete({ where: { id: session.user.id } }),
      ])

      logger.info('[USER_DELETE] User fully deleted', { userId: session.user.id })
    }

    return NextResponse.json({
      success: true,
      message: hasOrders
        ? 'Conta desativada. Seus dados foram anonimizados.'
        : 'Conta excluída com sucesso.',
    })
  } catch (error) {
    logger.error('[USER_DELETE] Error deleting user:', error)
    return NextResponse.json({ error: 'Erro ao excluir conta' }, { status: 500 })
  }
}
