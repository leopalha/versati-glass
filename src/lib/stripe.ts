import Stripe from 'stripe'

let stripeInstance: Stripe | null = null

function getStripe(): Stripe {
  if (!stripeInstance) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error('Missing STRIPE_SECRET_KEY environment variable')
    }
    stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2025-02-24.acacia',
      typescript: true,
    })
  }
  return stripeInstance
}

export const STRIPE_PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY

export interface CreateCheckoutSessionParams {
  orderId: string
  orderNumber: string
  customerEmail: string
  customerName: string
  amount: number
  description: string
  paymentMethod: 'card' | 'pix'
  successUrl: string
  cancelUrl: string
}

export async function createCheckoutSession(params: CreateCheckoutSessionParams) {
  const stripe = getStripe()
  const {
    orderId,
    orderNumber,
    customerEmail,
    customerName,
    amount,
    description,
    paymentMethod,
    successUrl,
    cancelUrl,
  } = params

  const paymentMethodTypes: Stripe.Checkout.SessionCreateParams.PaymentMethodType[] =
    paymentMethod === 'pix' ? ['pix'] : ['card']

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    payment_method_types: paymentMethodTypes,
    customer_email: customerEmail,
    client_reference_id: orderId,
    metadata: {
      orderId,
      orderNumber,
      customerName,
    },
    line_items: [
      {
        price_data: {
          currency: 'brl',
          product_data: {
            name: `Pedido ${orderNumber}`,
            description,
          },
          unit_amount: Math.round(amount * 100), // Stripe uses cents
        },
        quantity: 1,
      },
    ],
    payment_intent_data: {
      metadata: {
        orderId,
        orderNumber,
      },
    },
    ...(paymentMethod === 'card' && {
      payment_method_options: {
        card: {
          installments: {
            enabled: true,
          },
        },
      },
    }),
    success_url: `${successUrl}?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: cancelUrl,
    expires_at: Math.floor(Date.now() / 1000) + 30 * 60, // 30 minutes
  })

  return session
}

export async function retrieveSession(sessionId: string) {
  const stripe = getStripe()
  return stripe.checkout.sessions.retrieve(sessionId, {
    expand: ['payment_intent'],
  })
}

export async function constructWebhookEvent(
  payload: string | Buffer,
  signature: string
) {
  const stripe = getStripe()
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

  if (!webhookSecret) {
    throw new Error('Missing STRIPE_WEBHOOK_SECRET environment variable')
  }

  return stripe.webhooks.constructEvent(payload, signature, webhookSecret)
}
