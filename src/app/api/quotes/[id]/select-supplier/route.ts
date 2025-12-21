import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { logger } from '@/lib/logger'

const selectSupplierSchema = z.object({
  supplierId: z.string(),
})

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth()

    if (!session?.user || (session.user.role !== 'ADMIN' && session.user.role !== 'STAFF')) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    const { supplierId } = selectSupplierSchema.parse(body)

    // Buscar orçamento
    const quote = await prisma.quote.findUnique({
      where: { id },
      include: {
        supplierQuotes: true,
      },
    })

    if (!quote) {
      return NextResponse.json({ error: 'Orçamento não encontrado' }, { status: 404 })
    }

    // Verificar se o fornecedor respondeu
    const supplierQuote = quote.supplierQuotes.find((sq) => sq.supplierId === supplierId)

    if (!supplierQuote) {
      return NextResponse.json({ error: 'Cotação do fornecedor não encontrada' }, { status: 404 })
    }

    if (supplierQuote.status !== 'RESPONDED') {
      return NextResponse.json({ error: 'Fornecedor ainda não respondeu' }, { status: 400 })
    }

    if (!supplierQuote.total) {
      return NextResponse.json({ error: 'Fornecedor não informou o valor total' }, { status: 400 })
    }

    // Atualizar todos os SupplierQuotes para REJECTED exceto o selecionado
    await prisma.supplierQuote.updateMany({
      where: {
        quoteId: quote.id,
        supplierId: { not: supplierId },
      },
      data: {
        status: 'REJECTED',
      },
    })

    // Atualizar o selecionado para SELECTED
    await prisma.supplierQuote.update({
      where: { id: supplierQuote.id },
      data: {
        status: 'SELECTED',
      },
    })

    // Atualizar o Quote com o fornecedor selecionado e valores
    const updatedQuote = await prisma.quote.update({
      where: { id },
      data: {
        selectedSupplierId: supplierId,
        subtotal: supplierQuote.subtotal || supplierQuote.total,
        total: supplierQuote.total,
      },
      include: {
        selectedSupplier: true,
        supplierQuotes: {
          include: {
            supplier: true,
          },
        },
      },
    })

    logger.info(`Fornecedor selecionado para orçamento ${quote.number}`, {
      quoteId: quote.id,
      supplierId,
      total: supplierQuote.total,
    })

    return NextResponse.json({
      message: 'Fornecedor selecionado com sucesso',
      quote: updatedQuote,
    })
  } catch (error) {
    logger.error('Erro ao selecionar fornecedor:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Dados inválidos', details: error.errors }, { status: 400 })
    }

    return NextResponse.json({ error: 'Erro ao selecionar fornecedor' }, { status: 500 })
  }
}
