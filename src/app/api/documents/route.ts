import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { logger } from '@/lib/logger'
import { uploadToR2, isR2Configured } from '@/lib/r2-storage'

const createDocumentSchema = z.object({
  orderId: z.string().optional(),
  quoteId: z.string().optional(),
  title: z.string().min(3),
  description: z.string().optional(),
  type: z.enum([
    'CONTRACT',
    'INVOICE',
    'RECEIPT',
    'TECHNICAL_DRAWING',
    'PHOTO',
    'WARRANTY',
    'OTHER',
  ]),
})

export async function GET(request: Request) {
  try {
    const session = await auth()

    if (!session?.user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const orderId = searchParams.get('orderId')
    const quoteId = searchParams.get('quoteId')
    const userId = searchParams.get('userId')

    const where: any = {}

    // Admins e staff podem ver todos os documentos
    if (session.user.role !== 'ADMIN' && session.user.role !== 'STAFF') {
      // Clientes só podem ver seus próprios documentos
      where.OR = [{ order: { userId: session.user.id } }, { quote: { userId: session.user.id } }]
    } else if (userId) {
      // Admin filtrando por usuário específico
      where.OR = [{ order: { userId } }, { quote: { userId } }]
    }

    if (orderId) {
      where.orderId = orderId
    }

    if (quoteId) {
      where.quoteId = quoteId
    }

    const documents = await prisma.document.findMany({
      where,
      include: {
        order: {
          select: {
            id: true,
            number: true,
            user: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        quote: {
          select: {
            id: true,
            number: true,
            user: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ documents })
  } catch (error) {
    logger.error('Erro ao buscar documentos:', error)
    return NextResponse.json({ error: 'Erro ao buscar documentos' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth()

    // Apenas admin e staff podem fazer upload
    if (!session?.user || (session.user.role !== 'ADMIN' && session.user.role !== 'STAFF')) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File
    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const type = formData.get('type') as string
    const orderId = formData.get('orderId') as string | null
    const quoteId = formData.get('quoteId') as string | null

    if (!file) {
      return NextResponse.json({ error: 'Nenhum arquivo enviado' }, { status: 400 })
    }

    // Validar tipo de arquivo (permitir PDFs, imagens e documentos)
    const allowedTypes = [
      'application/pdf',
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/webp',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ]

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Tipo de arquivo não permitido' }, { status: 400 })
    }

    // Tamanho máximo: 10MB
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: 'Arquivo muito grande (máx 10MB)' }, { status: 400 })
    }

    // Upload para R2
    if (!isR2Configured()) {
      logger.error('R2 não configurado. Configure as variáveis de ambiente R2.')
      return NextResponse.json(
        { error: 'Serviço de upload não disponível. Entre em contato com o suporte.' },
        { status: 503 }
      )
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const timestamp = Date.now()
    const randomStr = Math.random().toString(36).substring(7)
    const ext = file.name.split('.').pop()
    const filename = `documents/${timestamp}-${randomStr}.${ext}`

    const { url: fileUrl } = await uploadToR2(buffer, filename, file.type)

    // Criar documento no banco
    const document = await prisma.document.create({
      data: {
        userId: session.user.id,
        name: title || file.name,
        type: type as any,
        url: fileUrl,
        mimeType: file.type,
        size: file.size,
        orderId: orderId || undefined,
        quoteId: quoteId || undefined,
      },
      include: {
        order: {
          select: {
            id: true,
            number: true,
          },
        },
        quote: {
          select: {
            id: true,
            number: true,
          },
        },
      },
    })

    return NextResponse.json(
      {
        message: 'Documento enviado com sucesso',
        document,
      },
      { status: 201 }
    )
  } catch (error) {
    logger.error('Erro ao fazer upload:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Dados inválidos', details: error.errors }, { status: 400 })
    }

    return NextResponse.json({ error: 'Erro ao fazer upload do documento' }, { status: 500 })
  }
}
