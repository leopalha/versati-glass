import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { logger } from '@/lib/logger'

const updateSupplierSchema = z.object({
  name: z.string().min(1).optional(),
  tradeName: z.string().optional().nullable(),
  cnpj: z.string().optional().nullable(),
  email: z.string().email().optional(),
  phone: z.string().optional().nullable(),
  whatsapp: z.string().optional().nullable(),
  street: z.string().optional().nullable(),
  number: z.string().optional().nullable(),
  complement: z.string().optional().nullable(),
  neighborhood: z.string().optional().nullable(),
  city: z.string().optional().nullable(),
  state: z.string().optional().nullable(),
  zipCode: z.string().optional().nullable(),
  categories: z.array(z.string()).optional(),
  rating: z.number().min(0).max(5).optional().nullable(),
  isActive: z.boolean().optional(),
  isPreferred: z.boolean().optional(),
  notes: z.string().optional().nullable(),
  averageDeliveryDays: z.number().optional().nullable(),
})

// GET - Buscar fornecedor por ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()

    if (!session?.user || (session.user.role !== 'ADMIN' && session.user.role !== 'STAFF')) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const supplier = await prisma.supplier.findUnique({
      where: { id: params.id },
      include: {
        supplierQuotes: {
          include: {
            quote: {
              select: {
                id: true,
                number: true,
                total: true,
                status: true,
                createdAt: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
          take: 10,
        },
        orders: {
          select: {
            id: true,
            number: true,
            total: true,
            status: true,
            createdAt: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
          take: 10,
        },
        _count: {
          select: {
            supplierQuotes: true,
            orders: true,
          },
        },
      },
    })

    if (!supplier) {
      return NextResponse.json({ error: 'Fornecedor não encontrado' }, { status: 404 })
    }

    return NextResponse.json({ supplier })
  } catch (error) {
    logger.error('Erro ao buscar fornecedor:', error)
    return NextResponse.json({ error: 'Erro ao buscar fornecedor' }, { status: 500 })
  }
}

// PUT - Atualizar fornecedor
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()

    if (!session?.user || (session.user.role !== 'ADMIN' && session.user.role !== 'STAFF')) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = updateSupplierSchema.parse(body)

    // Verificar se fornecedor existe
    const existingSupplier = await prisma.supplier.findUnique({
      where: { id: params.id },
    })

    if (!existingSupplier) {
      return NextResponse.json({ error: 'Fornecedor não encontrado' }, { status: 404 })
    }

    // Verificar conflito de email
    if (validatedData.email && validatedData.email !== existingSupplier.email) {
      const emailExists = await prisma.supplier.findFirst({
        where: {
          email: validatedData.email,
          id: { not: params.id },
        },
      })

      if (emailExists) {
        return NextResponse.json({ error: 'Email já cadastrado para outro fornecedor' }, { status: 400 })
      }
    }

    // Verificar conflito de CNPJ
    if (validatedData.cnpj && validatedData.cnpj !== existingSupplier.cnpj) {
      const cnpjExists = await prisma.supplier.findFirst({
        where: {
          cnpj: validatedData.cnpj,
          id: { not: params.id },
        },
      })

      if (cnpjExists) {
        return NextResponse.json({ error: 'CNPJ já cadastrado para outro fornecedor' }, { status: 400 })
      }
    }

    const supplier = await prisma.supplier.update({
      where: { id: params.id },
      data: validatedData,
    })

    logger.info(`Fornecedor atualizado: ${supplier.name}`, { supplierId: supplier.id })

    return NextResponse.json({
      message: 'Fornecedor atualizado com sucesso',
      supplier,
    })
  } catch (error) {
    logger.error('Erro ao atualizar fornecedor:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Dados inválidos', details: error.errors }, { status: 400 })
    }

    return NextResponse.json({ error: 'Erro ao atualizar fornecedor' }, { status: 500 })
  }
}

// DELETE - Excluir fornecedor
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()

    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    // Verificar se fornecedor existe
    const supplier = await prisma.supplier.findUnique({
      where: { id: params.id },
      include: {
        _count: {
          select: {
            supplierQuotes: true,
            orders: true,
          },
        },
      },
    })

    if (!supplier) {
      return NextResponse.json({ error: 'Fornecedor não encontrado' }, { status: 404 })
    }

    // Verificar se tem quotes ou orders vinculadas
    if (supplier._count.supplierQuotes > 0 || supplier._count.orders > 0) {
      // Ao invés de deletar, desativar
      await prisma.supplier.update({
        where: { id: params.id },
        data: { isActive: false },
      })

      return NextResponse.json({
        message: 'Fornecedor desativado (possui cotações/pedidos vinculados)',
      })
    }

    // Deletar se não tiver dependências
    await prisma.supplier.delete({
      where: { id: params.id },
    })

    logger.info(`Fornecedor deletado: ${supplier.name}`, { supplierId: supplier.id })

    return NextResponse.json({
      message: 'Fornecedor excluído com sucesso',
    })
  } catch (error) {
    logger.error('Erro ao excluir fornecedor:', error)
    return NextResponse.json({ error: 'Erro ao excluir fornecedor' }, { status: 500 })
  }
}
