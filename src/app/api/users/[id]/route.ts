import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { logger } from '@/lib/logger'

const updateUserSchema = z.object({
  name: z.string().min(3).optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
})

interface RouteParams {
  params: Promise<{
    id: string
  }>
}

export async function GET(request: Request, { params }: RouteParams) {
  try {
    const session = await auth()

    if (!session?.user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const { id } = await params

    // Admins e staff podem ver qualquer usuário
    // Usuários normais só podem ver o próprio perfil
    if (session.user.role !== 'ADMIN' && session.user.role !== 'STAFF' && session.user.id !== id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 403 })
    }

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        createdAt: true,
        _count: {
          select: {
            orders: true,
            quotes: true,
            appointments: true,
          },
        },
      },
    })

    if (!user) {
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 })
    }

    return NextResponse.json({ user })
  } catch (error) {
    logger.error('Erro ao buscar usuário:', error)
    return NextResponse.json({ error: 'Erro ao buscar usuário' }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const session = await auth()

    if (!session?.user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const { id } = await params

    // Admins e staff podem editar qualquer usuário
    // Usuários normais só podem editar o próprio perfil
    if (session.user.role !== 'ADMIN' && session.user.role !== 'STAFF' && session.user.id !== id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 403 })
    }

    const body = await request.json()
    const validatedData = updateUserSchema.parse(body)

    // Verificar se o email já está em uso por outro usuário
    if (validatedData.email) {
      const existingUser = await prisma.user.findUnique({
        where: { email: validatedData.email },
      })

      if (existingUser && existingUser.id !== id) {
        return NextResponse.json({ error: 'Este email já está em uso' }, { status: 400 })
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: validatedData,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
      },
    })

    return NextResponse.json({
      message: 'Usuário atualizado com sucesso',
      user: updatedUser,
    })
  } catch (error) {
    logger.error('Erro ao atualizar usuário:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Dados inválidos', details: error.errors }, { status: 400 })
    }

    return NextResponse.json({ error: 'Erro ao atualizar usuário' }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const session = await auth()

    // Apenas admins podem deletar usuários
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const { id } = await params

    // Não permitir deletar a si mesmo
    if (session.user.id === id) {
      return NextResponse.json(
        { error: 'Você não pode deletar sua própria conta' },
        { status: 400 }
      )
    }

    await prisma.user.delete({
      where: { id },
    })

    return NextResponse.json({
      message: 'Usuário deletado com sucesso',
    })
  } catch (error) {
    logger.error('Erro ao deletar usuário:', error)
    return NextResponse.json({ error: 'Erro ao deletar usuário' }, { status: 500 })
  }
}
