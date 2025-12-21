import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { logger } from '@/lib/logger'

const supplierResponseSchema = z.object({
  supplierId: z.string(),
  subtotal: z.number().min(0).optional(),
  shippingFee: z.number().min(0).default(0),
  laborFee: z.number().min(0).default(0),
  materialFee: z.number().min(0).default(0),
  total: z.number().min(0),
  deliveryDays: z.number().min(0).optional(),
  supplierNotes: z.string().optional(),
})

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth()

    if (!session?.user || (session.user.role !== 'ADMIN' && session.user.role !== 'STAFF')) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    const validatedData = supplierResponseSchema.parse(body)

    // Buscar orçamento
    const quote = await prisma.quote.findUnique({
      where: { id },
    })

    if (!quote) {
      return NextResponse.json({ error: 'Orçamento não encontrado' }, { status: 404 })
    }

    // Buscar SupplierQuote
    const supplierQuote = await prisma.supplierQuote.findFirst({
      where: {
        quoteId: quote.id,
        supplierId: validatedData.supplierId,
      },
    })

    if (!supplierQuote) {
      return NextResponse.json({ error: 'Cotação do fornecedor não encontrada' }, { status: 404 })
    }

    // Atualizar com a resposta
    const updated = await prisma.supplierQuote.update({
      where: { id: supplierQuote.id },
      data: {
        status: 'RESPONDED',
        respondedAt: new Date(),
        subtotal: validatedData.subtotal,
        shippingFee: validatedData.shippingFee,
        laborFee: validatedData.laborFee,
        materialFee: validatedData.materialFee,
        total: validatedData.total,
        deliveryDays: validatedData.deliveryDays,
        supplierNotes: validatedData.supplierNotes,
        parseConfidence: 'HIGH', // Manual entry = alta confiança
      },
      include: {
        supplier: true,
      },
    })

    logger.info(`Resposta de fornecedor registrada manualmente`, {
      quoteId: quote.id,
      supplierId: validatedData.supplierId,
      total: validatedData.total,
    })

    return NextResponse.json({
      message: 'Resposta registrada com sucesso',
      supplierQuote: updated,
    })
  } catch (error) {
    logger.error('Erro ao registrar resposta do fornecedor:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Dados inválidos', details: error.errors }, { status: 400 })
    }

    return NextResponse.json({ error: 'Erro ao registrar resposta' }, { status: 500 })
  }
}
