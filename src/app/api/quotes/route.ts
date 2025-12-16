import { NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

const quoteItemSchema = z.object({
  productId: z.string().optional(),
  description: z.string().min(1),
  specifications: z.string().optional(),
  width: z.number().optional(),
  height: z.number().optional(),
  quantity: z.number().min(1).default(1),
  color: z.string().optional(),
  finish: z.string().optional(),
  thickness: z.string().optional(),
  unitPrice: z.number().min(0),
  totalPrice: z.number().min(0),
  customerImages: z.array(z.string()).default([]),
})

const createQuoteSchema = z.object({
  customerName: z.string().min(2),
  customerEmail: z.string().email(),
  customerPhone: z.string().min(10),
  serviceStreet: z.string().min(1),
  serviceNumber: z.string().min(1),
  serviceComplement: z.string().optional(),
  serviceNeighborhood: z.string().min(1),
  serviceCity: z.string().min(1),
  serviceState: z.string().min(2),
  serviceZipCode: z.string().min(8),
  items: z.array(quoteItemSchema).min(1),
  source: z.enum(['WEBSITE', 'WHATSAPP', 'PHONE', 'WALKIN']).default('WEBSITE'),
  customerNotes: z.string().optional(),
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
    const session = await auth()
    const body = await request.json()

    const parsed = createQuoteSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Dados invalidos', details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const data = parsed.data

    // Calculate totals
    const subtotal = data.items.reduce((acc, item) => acc + item.totalPrice, 0)
    const total = subtotal

    // Generate quote number
    const number = await generateQuoteNumber()

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

    return NextResponse.json({
      id: quote.id,
      number: quote.number,
      status: quote.status,
      total: Number(quote.total),
      validUntil: quote.validUntil,
    })
  } catch (error) {
    console.error('Error creating quote:', error)
    return NextResponse.json(
      { error: 'Erro ao criar orcamento' },
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
        ...(status && { status: status as 'DRAFT' | 'SENT' | 'VIEWED' | 'ACCEPTED' | 'REJECTED' | 'EXPIRED' | 'CONVERTED' }),
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
    console.error('Error fetching quotes:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar orcamentos' },
      { status: 500 }
    )
  }
}
