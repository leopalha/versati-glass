import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { logger } from '@/lib/logger'

const itemUpdateSchema = z.object({
  id: z.string().nullable(),
  description: z.string().min(1),
  quantity: z.number().min(1),
  unitPrice: z.number().min(0),
  specifications: z.string().nullable().optional(),
  width: z.number().nullable().optional(),
  height: z.number().nullable().optional(),
  color: z.string().nullable().optional(),
})

const updateValuesSchema = z.object({
  items: z.array(itemUpdateSchema),
  discount: z.number().min(0).max(100),
  shippingFee: z.number().min(0).optional(),
  laborFee: z.number().min(0).optional(),
  materialFee: z.number().min(0).optional(),
  internalNotes: z.string().nullable().optional(),
  customerNotes: z.string().nullable().optional(),
})

interface RouteParams {
  params: Promise<{
    id: string
  }>
}

export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const session = await auth()

    if (!session?.user || (session.user.role !== 'ADMIN' && session.user.role !== 'STAFF')) {
      return NextResponse.json({ error: 'Nao autorizado' }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    const validatedData = updateValuesSchema.parse(body)

    // Verificar se o orcamento existe
    const quote = await prisma.quote.findUnique({
      where: { id },
      include: { items: true },
    })

    if (!quote) {
      return NextResponse.json({ error: 'Orcamento nao encontrado' }, { status: 404 })
    }

    // Nao permitir editar orcamentos ja aceitos ou convertidos
    if (quote.status === 'ACCEPTED' || quote.status === 'CONVERTED') {
      return NextResponse.json(
        { error: 'Nao e possivel editar orcamento ja aceito ou convertido' },
        { status: 400 }
      )
    }

    // Separar itens existentes, novos e removidos
    const existingItemIds = quote.items.map((item) => item.id)
    const updatedItemIds = validatedData.items
      .filter((item) => item.id !== null)
      .map((item) => item.id as string)

    const itemsToDelete = existingItemIds.filter((itemId) => !updatedItemIds.includes(itemId))
    const itemsToUpdate = validatedData.items.filter(
      (item) => item.id !== null && existingItemIds.includes(item.id as string)
    )
    const itemsToCreate = validatedData.items.filter((item) => item.id === null)

    // Deletar itens removidos
    if (itemsToDelete.length > 0) {
      await prisma.quoteItem.deleteMany({
        where: { id: { in: itemsToDelete } },
      })
    }

    // Atualizar itens existentes
    await Promise.all(
      itemsToUpdate.map(async (item) => {
        const subtotal = item.quantity * item.unitPrice

        return prisma.quoteItem.update({
          where: { id: item.id as string },
          data: {
            description: item.description,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            totalPrice: subtotal,
            specifications: item.specifications,
            width: item.width,
            height: item.height,
            color: item.color,
          },
        })
      })
    )

    // Criar novos itens
    if (itemsToCreate.length > 0) {
      await prisma.quoteItem.createMany({
        data: itemsToCreate.map((item) => ({
          quoteId: id,
          description: item.description,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          totalPrice: item.quantity * item.unitPrice,
          specifications: item.specifications,
          width: item.width,
          height: item.height,
          color: item.color,
        })),
      })
    }

    // Recalcular totais
    const updatedItems = await prisma.quoteItem.findMany({
      where: { quoteId: id },
    })

    const subtotal = updatedItems.reduce((sum, item) => sum + Number(item.totalPrice), 0)
    const discountValue = subtotal * (validatedData.discount / 100)
    const total = subtotal - discountValue

    // Atualizar orcamento
    const updatedQuote = await prisma.quote.update({
      where: { id },
      data: {
        subtotal,
        discount: validatedData.discount,
        total,
        internalNotes: validatedData.internalNotes,
        customerNotes: validatedData.customerNotes,
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

    return NextResponse.json({
      message: 'Valores atualizados com sucesso',
      quote: updatedQuote,
    })
  } catch (error) {
    logger.error('Erro ao atualizar valores:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Dados invalidos', details: error.errors }, { status: 400 })
    }

    return NextResponse.json({ error: 'Erro ao atualizar valores' }, { status: 500 })
  }
}
