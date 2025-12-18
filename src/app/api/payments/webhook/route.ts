import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { constructWebhookEvent } from '@/lib/stripe'
import type Stripe from 'stripe'
import { logger } from '@/lib/logger'
import { sendOrderStatusUpdateEmail } from '@/services/email'
import { sendTemplateMessage } from '@/services/whatsapp'
import { formatCurrency } from '@/lib/utils'

const PORTAL_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://versatiglass.com.br'

export async function POST(request: Request) {
  try {
    const body = await request.text()
    const signature = request.headers.get('stripe-signature')

    if (!signature) {
      return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 })
    }

    let event: Stripe.Event

    try {
      event = await constructWebhookEvent(body, signature)
    } catch (err) {
      logger.error('Webhook signature verification failed:', err)
      return NextResponse.json({ error: 'Webhook signature verification failed' }, { status: 400 })
    }

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session

        const orderId = session.client_reference_id || session.metadata?.orderId

        if (!orderId) {
          logger.error('No orderId found in session')
          break
        }

        const paymentIntent = session.payment_intent as Stripe.PaymentIntent | string
        const paymentIntentId =
          typeof paymentIntent === 'string' ? paymentIntent : paymentIntent?.id
        const paidAmount = session.amount_total ? session.amount_total / 100 : 0
        const paymentMethod = session.payment_method_types?.[0] === 'pix' ? 'PIX' : 'Cartão'

        // Update order and get user info
        const order = await prisma.$transaction(async (tx) => {
          const updatedOrder = await tx.order.update({
            where: { id: orderId },
            data: {
              paymentStatus: 'PAID',
              paidAmount,
              stripePaymentIntentId: paymentIntentId,
              status: 'APROVADO',
            },
            include: {
              user: true,
            },
          })

          // Add timeline entry
          await tx.orderTimelineEntry.create({
            data: {
              orderId: updatedOrder.id,
              status: 'APROVADO',
              description: `Pagamento de ${formatCurrency(paidAmount)} confirmado via ${paymentMethod}`,
              createdBy: 'system',
            },
          })

          return updatedOrder
        })

        // Send notifications to customer
        try {
          // Send email notification
          await sendOrderStatusUpdateEmail({
            customerName: order.user.name,
            customerEmail: order.user.email,
            orderNumber: order.number,
            status: 'PAID',
            statusMessage: `Pagamento de ${formatCurrency(paidAmount)} confirmado via ${paymentMethod}. Seu pedido está em processamento.`,
            orderUrl: `${PORTAL_BASE_URL}/portal/pedidos/${order.id}`,
          })
          logger.debug(`Payment confirmation email sent for order ${order.number}`)
        } catch (emailError) {
          logger.error(`Failed to send payment email for order ${order.number}:`, emailError)
        }

        try {
          // Send WhatsApp notification
          if (order.user.phone) {
            await sendTemplateMessage(order.user.phone, 'payment_confirmed', {
              customerName: order.user.name.split(' ')[0],
              orderNumber: order.number,
              amount: formatCurrency(paidAmount),
              paymentMethod,
              portalUrl: `${PORTAL_BASE_URL}/portal/pedidos/${order.id}`,
            })
            logger.debug(`Payment WhatsApp notification sent for order ${order.number}`)
          }
        } catch (whatsappError) {
          logger.error(
            `Failed to send WhatsApp notification for order ${order.number}:`,
            whatsappError
          )
        }

        logger.debug(`Payment completed for order ${orderId}`)
        break
      }

      case 'checkout.session.expired': {
        const session = event.data.object as Stripe.Checkout.Session
        const orderId = session.client_reference_id || session.metadata?.orderId

        if (orderId) {
          // Clear the session ID since it's expired
          await prisma.order.update({
            where: { id: orderId },
            data: {
              stripeSessionId: null,
            },
          })

          logger.debug(`Checkout session expired for order ${orderId}`)
        }
        break
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        const orderId = paymentIntent.metadata?.orderId

        if (orderId) {
          await prisma.orderTimelineEntry.create({
            data: {
              orderId,
              status: 'AGUARDANDO_PAGAMENTO',
              description: `Falha no pagamento: ${paymentIntent.last_payment_error?.message || 'Erro desconhecido'}`,
              createdBy: 'system',
            },
          })

          logger.debug(`Payment failed for order ${orderId}`)
        }
        break
      }

      case 'charge.refunded': {
        const charge = event.data.object as Stripe.Charge
        const paymentIntentId = charge.payment_intent as string

        if (paymentIntentId) {
          const order = await prisma.order.findFirst({
            where: { stripePaymentIntentId: paymentIntentId },
          })

          if (order) {
            await prisma.$transaction(async (tx) => {
              await tx.order.update({
                where: { id: order.id },
                data: {
                  paymentStatus: 'REFUNDED',
                },
              })

              await tx.orderTimelineEntry.create({
                data: {
                  orderId: order.id,
                  status: 'CANCELADO',
                  description: `Pagamento estornado: R$ ${(charge.amount_refunded / 100).toFixed(2)}`,
                  createdBy: 'system',
                },
              })
            })

            logger.debug(`Refund processed for order ${order.id}`)
          }
        }
        break
      }

      default:
        logger.debug(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    logger.error('Webhook error:', error)
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 })
  }
}
