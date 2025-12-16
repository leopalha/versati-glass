import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { constructWebhookEvent } from '@/lib/stripe'
import type Stripe from 'stripe'

export async function POST(request: Request) {
  try {
    const body = await request.text()
    const signature = request.headers.get('stripe-signature')

    if (!signature) {
      return NextResponse.json(
        { error: 'Missing stripe-signature header' },
        { status: 400 }
      )
    }

    let event: Stripe.Event

    try {
      event = await constructWebhookEvent(body, signature)
    } catch (err) {
      console.error('Webhook signature verification failed:', err)
      return NextResponse.json(
        { error: 'Webhook signature verification failed' },
        { status: 400 }
      )
    }

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session

        const orderId = session.client_reference_id || session.metadata?.orderId

        if (!orderId) {
          console.error('No orderId found in session')
          break
        }

        const paymentIntent = session.payment_intent as Stripe.PaymentIntent | string
        const paymentIntentId = typeof paymentIntent === 'string' ? paymentIntent : paymentIntent?.id

        // Update order
        await prisma.$transaction(async (tx) => {
          const order = await tx.order.update({
            where: { id: orderId },
            data: {
              paymentStatus: 'PAID',
              paidAmount: session.amount_total ? session.amount_total / 100 : 0,
              stripePaymentIntentId: paymentIntentId,
              status: 'APROVADO',
            },
          })

          // Add timeline entry
          await tx.orderTimelineEntry.create({
            data: {
              orderId: order.id,
              status: 'APROVADO',
              description: `Pagamento de R$ ${((session.amount_total || 0) / 100).toFixed(2)} confirmado via ${session.payment_method_types?.[0] === 'pix' ? 'PIX' : 'Cartao'}`,
              createdBy: 'system',
            },
          })
        })

        console.log(`Payment completed for order ${orderId}`)
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

          console.log(`Checkout session expired for order ${orderId}`)
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

          console.log(`Payment failed for order ${orderId}`)
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

            console.log(`Refund processed for order ${order.id}`)
          }
        }
        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    )
  }
}
