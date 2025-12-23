import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { logger } from '@/lib/logger'
import { Decimal } from '@prisma/client/runtime/library'
import { notifyPaymentReceived } from '@/services/in-app-notifications'

// Payment interface (until Prisma is regenerated)
interface PaymentRecord {
  id: string
  orderId: string
  method: string
  amount: Decimal
  installments: number
  status: string
  externalId: string | null
  paidAt: Date | null
  notes: string | null
  createdAt: Date
  updatedAt: Date
}

const addPaymentSchema = z.object({
  method: z.enum(['PIX', 'CREDIT_CARD', 'DEBIT_CARD', 'BOLETO', 'CASH']),
  amount: z.number().positive(),
  installments: z.number().int().min(1).default(1),
  notes: z.string().optional(),
})

// GET - List payments for an order
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Nao autorizado' }, { status: 401 })
    }

    const { id } = await params

    // Verify order ownership or admin
    const order = await prisma.order.findUnique({
      where: { id },
      select: { userId: true },
    })

    if (!order) {
      return NextResponse.json({ error: 'Pedido nao encontrado' }, { status: 404 })
    }

    if (order.userId !== session.user.id && !['ADMIN', 'STAFF'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Nao autorizado' }, { status: 401 })
    }

    // Use raw query until Prisma is regenerated
    const payments = await prisma.$queryRaw<PaymentRecord[]>`
      SELECT * FROM payments WHERE "orderId" = ${id} ORDER BY "createdAt" DESC
    `

    // Calculate totals
    const totalPaid = payments
      .filter((p: PaymentRecord) => p.status === 'PAID')
      .reduce((sum: number, p: PaymentRecord) => sum + Number(p.amount), 0)

    const totalPending = payments
      .filter((p: PaymentRecord) => p.status === 'PENDING')
      .reduce((sum: number, p: PaymentRecord) => sum + Number(p.amount), 0)

    return NextResponse.json({
      payments,
      totalPaid,
      totalPending,
    })
  } catch (error) {
    logger.error('Error fetching payments:', error)
    return NextResponse.json({ error: 'Erro ao buscar pagamentos' }, { status: 500 })
  }
}

// POST - Add a payment to an order
export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Nao autorizado' }, { status: 401 })
    }

    // Only admins can add manual payments
    if (!['ADMIN', 'STAFF'].includes(session.user.role)) {
      return NextResponse.json(
        { error: 'Apenas administradores podem registrar pagamentos' },
        { status: 403 }
      )
    }

    const { id } = await params
    const body = await request.json()
    const parsed = addPaymentSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Dados invalidos', details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const { method, amount, installments, notes } = parsed.data

    // Get order
    const order = await prisma.order.findUnique({
      where: { id },
    })

    if (!order) {
      return NextResponse.json({ error: 'Pedido nao encontrado' }, { status: 404 })
    }

    // Get existing payments
    const existingPayments = await prisma.$queryRaw<PaymentRecord[]>`
      SELECT * FROM payments WHERE "orderId" = ${id}
    `

    // Calculate remaining amount
    const paidAmount = existingPayments
      .filter((p: PaymentRecord) => p.status === 'PAID')
      .reduce((sum: number, p: PaymentRecord) => sum + Number(p.amount), 0)

    const remainingAmount = Number(order.total) - paidAmount

    if (amount > remainingAmount) {
      return NextResponse.json(
        { error: `Valor excede o saldo restante de R$ ${remainingAmount.toFixed(2)}` },
        { status: 400 }
      )
    }

    // Create payment (for cash/manual payments, mark as paid immediately)
    const isCashPayment = method === 'CASH'
    const paymentId = crypto.randomUUID()
    const now = new Date()

    await prisma.$executeRaw`
      INSERT INTO payments (id, "orderId", method, amount, installments, status, "paidAt", notes, "createdAt", "updatedAt")
      VALUES (
        ${paymentId},
        ${id},
        ${method}::"PaymentMethod",
        ${amount},
        ${installments},
        ${isCashPayment ? 'PAID' : 'PENDING'}::"PaymentStatus",
        ${isCashPayment ? now : null},
        ${notes || null},
        ${now},
        ${now}
      )
    `

    // Update order paid amount and status if cash payment
    if (isCashPayment) {
      const newPaidAmount = paidAmount + amount
      const isPaidInFull = newPaidAmount >= Number(order.total)

      await prisma.order.update({
        where: { id },
        data: {
          paidAmount: newPaidAmount,
          paymentStatus: isPaidInFull ? 'PAID' : 'PARTIAL',
        },
      })

      // Create in-app notification for customer
      try {
        await notifyPaymentReceived(order.userId, order.number, order.id, amount)
      } catch (notifError) {
        logger.error('Error creating payment notification:', notifError)
      }
    }

    logger.info(`Payment added to order ${order.number}`, {
      paymentId,
      method,
      amount,
      addedBy: session.user.id,
    })

    return NextResponse.json(
      {
        payment: {
          id: paymentId,
          orderId: id,
          method,
          amount,
          installments,
          status: isCashPayment ? 'PAID' : 'PENDING',
          paidAt: isCashPayment ? now : null,
          notes,
          createdAt: now,
        },
      },
      { status: 201 }
    )
  } catch (error) {
    logger.error('Error adding payment:', error)
    return NextResponse.json({ error: 'Erro ao registrar pagamento' }, { status: 500 })
  }
}

// PATCH - Update payment status
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Nao autorizado' }, { status: 401 })
    }

    if (!['ADMIN', 'STAFF'].includes(session.user.role)) {
      return NextResponse.json(
        { error: 'Apenas administradores podem atualizar pagamentos' },
        { status: 403 }
      )
    }

    const { id } = await params
    const body = await request.json()
    const { paymentId, status } = body

    if (!paymentId || !status) {
      return NextResponse.json({ error: 'paymentId e status sao obrigatorios' }, { status: 400 })
    }

    // Get payment
    const payments = await prisma.$queryRaw<PaymentRecord[]>`
      SELECT * FROM payments WHERE id = ${paymentId}
    `

    if (payments.length === 0) {
      return NextResponse.json({ error: 'Pagamento nao encontrado' }, { status: 404 })
    }

    const payment = payments[0]

    if (payment.orderId !== id) {
      return NextResponse.json({ error: 'Pagamento nao pertence a este pedido' }, { status: 400 })
    }

    // Update payment
    const now = new Date()
    await prisma.$executeRaw`
      UPDATE payments
      SET status = ${status}::"PaymentStatus",
          "paidAt" = ${status === 'PAID' ? now : null},
          "updatedAt" = ${now}
      WHERE id = ${paymentId}
    `

    // Get order
    const order = await prisma.order.findUnique({
      where: { id },
    })

    if (!order) {
      return NextResponse.json({ error: 'Pedido nao encontrado' }, { status: 404 })
    }

    // Recalculate order paid amount
    const allPayments = await prisma.$queryRaw<PaymentRecord[]>`
      SELECT * FROM payments WHERE "orderId" = ${id}
    `

    const newPaidAmount = allPayments
      .filter((p: PaymentRecord) => p.status === 'PAID' || (p.id === paymentId && status === 'PAID'))
      .filter((p: PaymentRecord) => !(p.id === paymentId && status !== 'PAID'))
      .reduce((sum: number, p: PaymentRecord) => sum + Number(p.amount), 0)

    const isPaidInFull = newPaidAmount >= Number(order.total)
    const hasPartialPayment = newPaidAmount > 0 && !isPaidInFull

    await prisma.order.update({
      where: { id },
      data: {
        paidAmount: newPaidAmount,
        paymentStatus: isPaidInFull ? 'PAID' : hasPartialPayment ? 'PARTIAL' : 'PENDING',
      },
    })

    // Create in-app notification for customer if payment was confirmed
    if (status === 'PAID') {
      try {
        await notifyPaymentReceived(order.userId, order.number, order.id, Number(payment.amount))
      } catch (notifError) {
        logger.error('Error creating payment notification:', notifError)
      }
    }

    logger.info(`Payment status updated`, {
      paymentId,
      newStatus: status,
      updatedBy: session.user.id,
    })

    return NextResponse.json({
      payment: {
        ...payment,
        status,
        paidAt: status === 'PAID' ? now : null,
        updatedAt: now,
      },
    })
  } catch (error) {
    logger.error('Error updating payment:', error)
    return NextResponse.json({ error: 'Erro ao atualizar pagamento' }, { status: 500 })
  }
}
