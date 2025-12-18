import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { logger } from '@/lib/logger'

const itemUpdateSchema = z.object({
  id: z.string(),
  quantity: z.number().min(1),
  unitPrice: z.number().min(0),
})

const updateValuesSchema = z.object({
  items: z.array(itemUpdateSchema),
  discount: z.number().min(0).max(100),
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
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    const validatedData = updateValuesSchema.parse(body)

    // Verificar se o orçamento existe
    const quote = await prisma.quote.findUnique({
      where: { id },
      include: { items: true },
    })

    if (!quote) {
      return NextResponse.json({ error: 'Orçamento não encontrado' }, { status: 404 })
    }

    // Não permitir editar orçamentos já aceitos ou convertidos
    if (quote.status === 'ACCEPTED' || quote.status === 'CONVERTED') {
      return NextResponse.json(
        { error: 'Não é possível editar orçamento já aceito ou convertido' },
        { status: 400 }
      )
    }

    // Atualizar itens
    await Promise.all(
      validatedData.items.map(async (item) => {
        const subtotal = item.quantity * item.unitPrice

        return prisma.quoteItem.update({
          where: { id: item.id },
          data: {
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            totalPrice: subtotal,
          },
        })
      })
    )

    // Recalcular totais
    const updatedItems = await prisma.quoteItem.findMany({
      where: { quoteId: id },
    })

    const subtotal = updatedItems.reduce((sum, item) => sum + Number(item.totalPrice), 0)

    const discountValue = subtotal * (validatedData.discount / 100)
    const total = subtotal - discountValue

    // Atualizar orçamento
    const updatedQuote = await prisma.quote.update({
      where: { id },
      data: {
        subtotal,
        discount: validatedData.discount,
        total,
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
      return NextResponse.json({ error: 'Dados inválidos', details: error.errors }, { status: 400 })
    }

    return NextResponse.json({ error: 'Erro ao atualizar valores' }, { status: 500 })
  }
}
