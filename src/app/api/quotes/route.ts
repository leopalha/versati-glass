import { NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { logger } from '@/lib/logger'
import { rateLimit, RateLimitPresets } from '@/lib/rate-limit'
import { sendWhatsAppMessage } from '@/services/whatsapp'
import { quoteCreatedTemplate, sanitizeCustomerName } from '@/lib/whatsapp-templates'

// FQ.7.1: Validação aprimorada com limites realistas
const quoteItemSchema = z.object({
  productId: z.string().optional(),
  description: z.string().min(1).max(500, 'Descrição muito longa (máximo 500 caracteres)'),
  specifications: z.string().max(500).optional(),
  width: z
    .number()
    .min(0.01, 'Largura deve ser maior que 0')
    .max(100, 'Largura máxima: 100m')
    .optional(),
  height: z
    .number()
    .min(0.01, 'Altura deve ser maior que 0')
    .max(100, 'Altura máxima: 100m')
    .optional(),
  quantity: z
    .number()
    .int('Quantidade deve ser número inteiro')
    .min(1)
    .max(1000, 'Quantidade máxima: 1000'),
  color: z.string().max(50).optional(),
  finish: z.string().max(50).optional(),
  thickness: z.string().max(50).optional(),
  unitPrice: z.number().min(0).max(1000000, 'Preço unitário muito alto'),
  totalPrice: z.number().min(0).max(100000000, 'Preço total muito alto'),
  customerImages: z.array(z.string()).max(10, 'Máximo 10 imagens por item').default([]),
  glassType: z.string().max(50).optional(),
  glassColor: z.string().max(50).optional(),
  model: z.string().max(100).optional(),
})

const createQuoteSchema = z.object({
  customerName: z
    .string()
    .min(2, 'Nome deve ter pelo menos 2 caracteres')
    .max(100, 'Nome muito longo'),
  customerEmail: z.string().email('Email inválido').max(100),
  customerPhone: z.string().min(10, 'Telefone deve ter pelo menos 10 dígitos').max(20),
  serviceStreet: z.string().min(1).max(200),
  serviceNumber: z.string().min(1).max(20),
  serviceComplement: z.string().max(100).optional(),
  serviceNeighborhood: z.string().min(1).max(100),
  serviceCity: z.string().min(1).max(100),
  serviceState: z.string().min(2).max(2, 'Estado deve ter 2 caracteres (ex: SP)'),
  serviceZipCode: z.string().min(8).max(10),
  items: z
    .array(quoteItemSchema)
    .min(1, 'Pelo menos um item é obrigatório')
    .max(50, 'Máximo 50 itens por orçamento'),
  source: z.enum(['WEBSITE', 'WHATSAPP', 'PHONE', 'WALKIN']).default('WEBSITE'),
  customerNotes: z
    .string()
    .max(1000, 'Observações muito longas (máximo 1000 caracteres)')
    .optional(),
})

async function generateQuoteNumber(): Promise<string> {
  const year = new Date().getFullYear()
  const lastQuote = await prisma.quote.findFirst({
    where: {
      number: {
        startsWith: `ORC-${year}`,
      },
    },
    orderBy: {
      number: 'desc',
    },
  })

  let nextNumber = 1
  if (lastQuote) {
    const lastNumber = parseInt(lastQuote.number.split('-').pop() || '0', 10)
    nextNumber = lastNumber + 1
  }

  return `ORC-${year}-${nextNumber.toString().padStart(4, '0')}`
}

export async function POST(request: Request) {
  try {
    // FQ.7.2: Rate limiting - 5 requests per 15 minutes
    const rateLimitResult = await rateLimit(request, RateLimitPresets.QUOTE_CREATION)

    if (!rateLimitResult.success) {
      logger.warn('[API /quotes POST] Rate limit exceeded', {
        ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
        limit: rateLimitResult.limit,
        reset: new Date(rateLimitResult.reset * 1000).toISOString(),
      })

      return NextResponse.json(
        {
          error: 'Muitas solicitacoes',
          message: `Voce excedeu o limite de ${rateLimitResult.limit} orcamentos em 15 minutos. Tente novamente em alguns minutos.`,
          retryAfter: rateLimitResult.reset,
        },
        {
          status: 429,
          headers: {
            'X-RateLimit-Limit': rateLimitResult.limit.toString(),
            'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
            'X-RateLimit-Reset': rateLimitResult.reset.toString(),
            'Retry-After': Math.ceil((rateLimitResult.reset * 1000 - Date.now()) / 1000).toString(),
          },
        }
      )
    }

    const session = await auth()
    const body = await request.json()

    // FQ.7.4: Log estruturado - início da requisição
    logger.debug('[API /quotes POST] Creating new quote', {
      hasSession: !!session,
      userId: session?.user?.id,
      itemCount: body.items?.length,
      rateLimitRemaining: rateLimitResult.remaining,
    })

    // FQ.7.1: Validar payload de criação de cotação
    const parsed = createQuoteSchema.safeParse(body)
    if (!parsed.success) {
      // FQ.7.3: Melhorar mensagens de erro da API
      const errors = parsed.error.flatten()
      logger.warn('[API /quotes POST] Validation failed', { errors })

      return NextResponse.json(
        {
          error: 'Dados invalidos',
          message: 'Verifique os dados enviados e tente novamente',
          details: errors,
        },
        { status: 400 }
      )
    }

    const data = parsed.data

    // Calculate totals
    const subtotal = data.items.reduce((acc, item) => acc + item.totalPrice, 0)
    const total = subtotal

    logger.debug('[API /quotes POST] Payload validated', {
      customerEmail: data.customerEmail,
      itemCount: data.items.length,
      subtotal,
      total,
    })

    // Generate quote number
    const number = await generateQuoteNumber()
    logger.debug('[API /quotes POST] Quote number generated', { number })

    // Create or get user
    let userId = session?.user?.id

    if (!userId) {
      // Check if user exists with this email
      let user = await prisma.user.findUnique({
        where: { email: data.customerEmail.toLowerCase() },
      })

      if (!user) {
        // Create a new user without password (they can set it later)
        user = await prisma.user.create({
          data: {
            email: data.customerEmail.toLowerCase(),
            name: data.customerName,
            phone: data.customerPhone,
            street: data.serviceStreet,
            number: data.serviceNumber,
            complement: data.serviceComplement,
            neighborhood: data.serviceNeighborhood,
            city: data.serviceCity,
            state: data.serviceState,
            zipCode: data.serviceZipCode,
          },
        })
      }

      userId = user.id
    }

    // Set validity to 15 days from now
    const validUntil = new Date()
    validUntil.setDate(validUntil.getDate() + 15)

    // Create the quote
    const quote = await prisma.quote.create({
      data: {
        number,
        userId,
        customerName: data.customerName,
        customerEmail: data.customerEmail.toLowerCase(),
        customerPhone: data.customerPhone,
        serviceStreet: data.serviceStreet,
        serviceNumber: data.serviceNumber,
        serviceComplement: data.serviceComplement,
        serviceNeighborhood: data.serviceNeighborhood,
        serviceCity: data.serviceCity,
        serviceState: data.serviceState,
        serviceZipCode: data.serviceZipCode,
        subtotal,
        total,
        status: 'DRAFT',
        validUntil,
        source: data.source,
        customerNotes: data.customerNotes,
        items: {
          create: data.items.map((item) => ({
            productId: item.productId || null,
            description: item.description,
            specifications: item.specifications,
            width: item.width,
            height: item.height,
            quantity: item.quantity,
            color: item.color,
            finish: item.finish,
            thickness: item.thickness,
            glassType: item.glassType,
            glassColor: item.glassColor,
            model: item.model,
            unitPrice: item.unitPrice,
            totalPrice: item.totalPrice,
            customerImages: item.customerImages,
          })),
        },
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    })

    // FQ.7.4: Log sucesso com informações estruturadas
    logger.info('[API /quotes POST] Quote created successfully', {
      quoteId: quote.id,
      quoteNumber: quote.number,
      userId,
      itemCount: quote.items.length,
      total: Number(quote.total),
      source: data.source,
    })

    // NOTIF.1: Enviar notificação WhatsApp para empresa
    // Executa em background (não bloqueia resposta ao cliente)
    if (process.env.TWILIO_WHATSAPP_NUMBER && process.env.NEXT_PUBLIC_COMPANY_WHATSAPP) {
      const message = quoteCreatedTemplate({
        quoteNumber: quote.number,
        customerName: sanitizeCustomerName(data.customerName),
        itemsCount: quote.items.length,
        totalValue: Number(quote.total),
      })

      // Fire and forget - não aguarda conclusão
      sendWhatsAppMessage({
        to: process.env.NEXT_PUBLIC_COMPANY_WHATSAPP,
        message,
      })
        .then((result) => {
          if (result.success) {
            logger.info('[WhatsApp Notification] Quote created notification sent', {
              quoteNumber: quote.number,
              messageSid: result.messageSid,
            })
          } else {
            logger.error('[WhatsApp Notification] Failed to send quote notification', {
              quoteNumber: quote.number,
              error: result.error,
            })
          }
        })
        .catch((error) => {
          logger.error('[WhatsApp Notification] Unexpected error sending notification', {
            quoteNumber: quote.number,
            error: error.message,
          })
        })
    } else {
      logger.warn('[WhatsApp Notification] Skipped - WhatsApp not configured', {
        hasTwilioNumber: !!process.env.TWILIO_WHATSAPP_NUMBER,
        hasCompanyNumber: !!process.env.NEXT_PUBLIC_COMPANY_WHATSAPP,
      })
    }

    return NextResponse.json(
      {
        id: quote.id,
        number: quote.number,
        status: quote.status,
        total: Number(quote.total),
        validUntil: quote.validUntil,
      },
      {
        headers: {
          'X-RateLimit-Limit': rateLimitResult.limit.toString(),
          'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
          'X-RateLimit-Reset': rateLimitResult.reset.toString(),
        },
      }
    )
  } catch (error) {
    // FQ.7.4: Log erro estruturado
    // FQ.7.3: Mensagem de erro mais específica
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    logger.error('[API /quotes POST] Failed to create quote', {
      error: errorMessage,
      stack: error instanceof Error ? error.stack : undefined,
    })

    // TEMP: Em desenvolvimento, retornar erro detalhado
    if (process.env.NODE_ENV === 'development') {
      return NextResponse.json(
        {
          error: 'Erro ao criar orcamento',
          message: errorMessage,
          stack: error instanceof Error ? error.stack : undefined,
          details: error,
        },
        { status: 500 }
      )
    }

    return NextResponse.json(
      {
        error: 'Erro ao criar orcamento',
        message:
          'Ocorreu um erro ao processar sua solicitacao. Tente novamente ou entre em contato.',
      },
      { status: 500 }
    )
  }
}

export async function GET(request: Request) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Nao autorizado' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')

    const quotes = await prisma.quote.findMany({
      where: {
        userId: session.user.id,
        ...(status && {
          status: status as
            | 'DRAFT'
            | 'SENT'
            | 'VIEWED'
            | 'ACCEPTED'
            | 'REJECTED'
            | 'EXPIRED'
            | 'CONVERTED',
        }),
      },
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        id: true,
        number: true,
        status: true,
        total: true,
        validUntil: true,
        createdAt: true,
        items: {
          select: {
            description: true,
            quantity: true,
          },
        },
      },
    })

    const serializedQuotes = quotes.map((quote) => ({
      ...quote,
      total: Number(quote.total),
    }))

    return NextResponse.json(serializedQuotes)
  } catch (error) {
    logger.error('Error fetching quotes:', error)
    return NextResponse.json({ error: 'Erro ao buscar orcamentos' }, { status: 500 })
  }
}
