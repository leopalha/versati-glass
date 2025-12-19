import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { logger } from '@/lib/logger'

const createSupplierSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  tradeName: z.string().optional(),
  cnpj: z.string().optional(),
  email: z.string().email('Email inválido'),
  phone: z.string().optional(),
  whatsapp: z.string().optional(),
  street: z.string().optional(),
  number: z.string().optional(),
  complement: z.string().optional(),
  neighborhood: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),
  categories: z.array(z.string()).default([]),
  isActive: z.boolean().default(true),
  isPreferred: z.boolean().default(false),
  notes: z.string().optional(),
  averageDeliveryDays: z.number().optional(),
})

// GET - Listar fornecedores
export async function GET(request: Request) {
  try {
    const session = await auth()

    if (!session?.user || (session.user.role !== 'ADMIN' && session.user.role !== 'STAFF')) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search') || ''
    const isActive = searchParams.get('isActive')
    const category = searchParams.get('category')

    const where: {
      isActive?: boolean
      categories?: { has: string }
      OR?: Array<
        | { name: { contains: string; mode: 'insensitive' } }
        | { tradeName: { contains: string; mode: 'insensitive' } }
        | { email: { contains: string; mode: 'insensitive' } }
      >
    } = {}

    // Filtro de busca
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { tradeName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ]
    }

    // Filtro de status
    if (isActive !== null) {
      where.isActive = isActive === 'true'
    }

    // Filtro de categoria
    if (category) {
      where.categories = {
        has: category,
      }
    }

    const suppliers = await prisma.supplier.findMany({
      where,
      orderBy: [{ isPreferred: 'desc' }, { name: 'asc' }],
      include: {
        _count: {
          select: {
            supplierQuotes: true,
            orders: true,
          },
        },
      },
    })

    return NextResponse.json({ suppliers })
  } catch (error) {
    logger.error('Erro ao listar fornecedores:', error)
    return NextResponse.json({ error: 'Erro ao listar fornecedores' }, { status: 500 })
  }
}

// POST - Criar fornecedor
export async function POST(request: Request) {
  try {
    const session = await auth()

    if (!session?.user || (session.user.role !== 'ADMIN' && session.user.role !== 'STAFF')) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = createSupplierSchema.parse(body)

    // Verificar se email já existe
    const existingSupplier = await prisma.supplier.findUnique({
      where: { email: validatedData.email },
    })

    if (existingSupplier) {
      return NextResponse.json({ error: 'Email já cadastrado' }, { status: 400 })
    }

    // Verificar CNPJ se fornecido
    if (validatedData.cnpj) {
      const existingCnpj = await prisma.supplier.findUnique({
        where: { cnpj: validatedData.cnpj },
      })

      if (existingCnpj) {
        return NextResponse.json({ error: 'CNPJ já cadastrado' }, { status: 400 })
      }
    }

    const supplier = await prisma.supplier.create({
      data: validatedData,
    })

    logger.info(`Fornecedor criado: ${supplier.name}`, { supplierId: supplier.id })

    return NextResponse.json(
      {
        message: 'Fornecedor criado com sucesso',
        supplier,
      },
      { status: 201 }
    )
  } catch (error) {
    logger.error('Erro ao criar fornecedor:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Dados inválidos', details: error.errors }, { status: 400 })
    }

    return NextResponse.json({ error: 'Erro ao criar fornecedor' }, { status: 500 })
  }
}
