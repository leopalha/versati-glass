import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { generateQuoteNumber } from '@/lib/utils'

const quoteItemSchema = z.object({
  productId: z.string().optional(),
  description: z.string(),
  quantity: z.number().min(1),
  unitPrice: z.number().min(0),
  width: z.number().optional(),
  height: z.number().optional(),
  notes: z.string().optional(),
})

const createQuoteSchema = z.object({
  userId: z.string(),
  items: z.array(quoteItemSchema),
  validityDays: z.number().min(1).max(90).default(15),
  notes: z.string().optional(),
  discount: z.number().min(0).max(100).default(0),
  // Endereço do serviço (opcional - pega do usuário se não fornecido)
  serviceStreet: z.string().optional(),
  serviceNumber: z.string().optional(),
  serviceComplement: z.string().optional(),
  serviceNeighborhood: z.string().optional(),
  serviceCity: z.string().optional(),
  serviceState: z.string().optional(),
  serviceZipCode: z.string().optional(),
})

export async function POST(request: Request) {
  try {
    const session = await auth()

    if (!session?.user || (session.user.role !== 'ADMIN' && session.user.role !== 'STAFF')) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = createQuoteSchema.parse(body)

    // Verificar se o usuário existe
    const user = await prisma.user.findUnique({
      where: { id: validatedData.userId },
    })

    if (!user) {
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 })
    }

    // Calcular valores
    const subtotal = validatedData.items.reduce((sum, item) => {
      return sum + item.quantity * item.unitPrice
    }, 0)

    const discountDecimal = validatedData.discount / 100
    const total = subtotal * (1 - discountDecimal)

    // Calcular data de validade
    const validUntil = new Date()
    validUntil.setDate(validUntil.getDate() + validatedData.validityDays)

    // Gerar número do orçamento
    const quoteNumber = await generateQuoteNumber()

    // Criar orçamento
    const quote = await prisma.quote.create({
      data: {
        number: quoteNumber,
        userId: validatedData.userId,
        customerName: user.name,
        customerEmail: user.email,
        customerPhone: user.phone || '',
        serviceStreet: validatedData.serviceStreet || '',
        serviceNumber: validatedData.serviceNumber || '',
        serviceComplement: validatedData.serviceComplement,
        serviceNeighborhood: validatedData.serviceNeighborhood || '',
        serviceCity: validatedData.serviceCity || 'Rio de Janeiro',
        serviceState: validatedData.serviceState || 'RJ',
        serviceZipCode: validatedData.serviceZipCode || '',
        status: 'DRAFT',
        source: 'PHONE',
        validUntil,
        subtotal,
        discount: validatedData.discount,
        total,
        internalNotes: validatedData.notes,
        items: {
          create: validatedData.items.map((item) => ({
            productId: item.productId,
            description: item.description,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            totalPrice: item.quantity * item.unitPrice,
            width: item.width,
            height: item.height,
          })),
        },
      },
      include: {
        items: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })

    return NextResponse.json(
      {
        message: 'Orçamento criado com sucesso',
        quote,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Erro ao criar orçamento:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Dados inválidos', details: error.errors }, { status: 400 })
    }

    return NextResponse.json({ error: 'Erro ao criar orçamento' }, { status: 500 })
  }
}
