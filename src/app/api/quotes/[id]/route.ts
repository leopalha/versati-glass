import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { logger } from '@/lib/logger'

interface RouteParams {
  params: Promise<{ id: string }>
}

export async function GET(request: Request, { params }: RouteParams) {
  try {
    const session = await auth()
    const { id } = await params

    const quote = await prisma.quote.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                slug: true,
                thumbnail: true,
                category: true,
              },
            },
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
      },
    })

    if (!quote) {
      return NextResponse.json({ error: 'Orcamento nao encontrado' }, { status: 404 })
    }

    // Check if user can access this quote
    const isOwner = session?.user?.id === quote.userId
    const isAdmin = session?.user?.role === 'ADMIN'

    if (!isOwner && !isAdmin) {
      return NextResponse.json({ error: 'Nao autorizado' }, { status: 401 })
    }

    // Mark as viewed if it's the customer viewing and status is SENT
    if (isOwner && !isAdmin && quote.status === 'SENT' && !quote.viewedAt) {
      await prisma.quote.update({
        where: { id },
        data: {
          status: 'VIEWED',
          viewedAt: new Date(),
        },
      })
      quote.status = 'VIEWED'
      quote.viewedAt = new Date()
    }

    // Serialize decimals
    const serializedQuote = {
      ...quote,
      subtotal: Number(quote.subtotal),
      discount: Number(quote.discount),
      shippingFee: Number(quote.shippingFee),
      laborFee: Number(quote.laborFee),
      materialFee: Number(quote.materialFee),
      total: Number(quote.total),
      items: quote.items.map((item) => ({
        ...item,
        width: item.width ? Number(item.width) : null,
        height: item.height ? Number(item.height) : null,
        unitPrice: Number(item.unitPrice),
        totalPrice: Number(item.totalPrice),
      })),
    }

    return NextResponse.json(serializedQuote)
  } catch (error) {
    logger.error('Error fetching quote:', error)
    return NextResponse.json({ error: 'Erro ao buscar orcamento' }, { status: 500 })
  }
}

export async function PATCH(request: Request, { params }: RouteParams) {
  try {
    const session = await auth()
    const { id } = await params

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Nao autorizado' }, { status: 401 })
    }

    const body = await request.json()
    const { status: newStatus } = body

    const quote = await prisma.quote.findUnique({
      where: { id },
    })

    if (!quote) {
      return NextResponse.json({ error: 'Orcamento nao encontrado' }, { status: 404 })
    }

    // Check ownership
    const isOwner = session.user.id === quote.userId
    const isAdmin = session.user.role === 'ADMIN' || session.user.role === 'STAFF'

    if (!isOwner && !isAdmin) {
      return NextResponse.json({ error: 'Nao autorizado' }, { status: 401 })
    }

    // Only allow certain status transitions
    const allowedStatuses = ['REJECTED', 'CANCELLED']
    if (!allowedStatuses.includes(newStatus)) {
      return NextResponse.json({ error: 'Status invalido' }, { status: 400 })
    }

    // Can only reject/cancel quotes that haven't been accepted/converted
    if (['ACCEPTED', 'CONVERTED'].includes(quote.status)) {
      return NextResponse.json(
        { error: 'Este orcamento ja foi aceito e nao pode ser alterado' },
        { status: 400 }
      )
    }

    const updatedQuote = await prisma.quote.update({
      where: { id },
      data: {
        status: newStatus,
      },
    })

    return NextResponse.json({
      id: updatedQuote.id,
      status: updatedQuote.status,
      message:
        newStatus === 'REJECTED'
          ? 'Orcamento recusado com sucesso'
          : 'Orcamento cancelado com sucesso',
    })
  } catch (error) {
    logger.error('Error updating quote:', error)
    return NextResponse.json({ error: 'Erro ao atualizar orcamento' }, { status: 500 })
  }
}
