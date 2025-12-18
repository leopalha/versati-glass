import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { slugify } from '@/lib/utils'
import { createProductSchema, productQuerySchema } from '@/lib/validations/product'
import { z } from 'zod'
import { logger } from '@/lib/logger'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const featured = searchParams.get('featured')
    const active = searchParams.get('active')

    // Importar tipo ProductCategory do Prisma Client
    type ProductCategory =
      | 'BOX'
      | 'ESPELHOS'
      | 'VIDROS'
      | 'PORTAS'
      | 'JANELAS'
      | 'GUARDA_CORPO'
      | 'CORTINAS_VIDRO'
      | 'PERGOLADOS'
      | 'TAMPOS_PRATELEIRAS'
      | 'DIVISORIAS'
      | 'FECHAMENTOS'
      | 'FERRAGENS'
      | 'KITS'
      | 'SERVICOS'
      | 'OUTROS'

    const validCategories: ProductCategory[] = [
      'BOX',
      'ESPELHOS',
      'VIDROS',
      'PORTAS',
      'JANELAS',
      'GUARDA_CORPO',
      'CORTINAS_VIDRO',
      'PERGOLADOS',
      'TAMPOS_PRATELEIRAS',
      'DIVISORIAS',
      'FECHAMENTOS',
      'FERRAGENS',
      'KITS',
      'SERVICOS',
      'OUTROS',
    ]

    const products = await prisma.product.findMany({
      where: {
        ...(category &&
          validCategories.includes(category as ProductCategory) && {
            category: category as ProductCategory,
          }),
        ...(featured === 'true' && { isFeatured: true }),
        ...(active !== 'false' && { isActive: true }),
      },
      orderBy: [{ isFeatured: 'desc' }, { name: 'asc' }],
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        shortDescription: true,
        category: true,
        subcategory: true,
        images: true,
        thumbnail: true,
        priceType: true,
        basePrice: true,
        pricePerM2: true,
        priceRangeMin: true,
        priceRangeMax: true,
        colors: true,
        finishes: true,
        thicknesses: true,
        isActive: true,
        isFeatured: true,
      },
    })

    // Convert Decimal to number for JSON serialization
    const serializedProducts = products.map((product) => ({
      ...product,
      basePrice: product.basePrice ? Number(product.basePrice) : null,
      pricePerM2: product.pricePerM2 ? Number(product.pricePerM2) : null,
      priceRangeMin: product.priceRangeMin ? Number(product.priceRangeMin) : null,
      priceRangeMax: product.priceRangeMax ? Number(product.priceRangeMax) : null,
    }))

    return NextResponse.json(serializedProducts)
  } catch (error) {
    logger.error('Error fetching products:', error)
    return NextResponse.json({ error: 'Erro ao buscar produtos' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    // Verificar autenticação
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
    }

    // Verificar se é admin
    if (session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Permissão negada. Apenas administradores podem criar produtos.' },
        { status: 403 }
      )
    }

    // Parsear e validar dados
    const body = await request.json()
    const validatedData = createProductSchema.parse(body)

    // Gerar slug se não fornecido
    const slug = validatedData.slug || slugify(validatedData.name)

    // Verificar se slug já existe
    const existingProduct = await prisma.product.findUnique({
      where: { slug },
    })

    if (existingProduct) {
      return NextResponse.json(
        { error: 'Já existe um produto com este slug. Tente um nome diferente.' },
        { status: 409 }
      )
    }

    // Criar produto
    const product = await prisma.product.create({
      data: {
        ...validatedData,
        slug,
      },
    })

    // Serializar Decimal para JSON
    const serializedProduct = {
      ...product,
      basePrice: product.basePrice ? Number(product.basePrice) : null,
      pricePerM2: product.pricePerM2 ? Number(product.pricePerM2) : null,
      priceRangeMin: product.priceRangeMin ? Number(product.priceRangeMin) : null,
      priceRangeMax: product.priceRangeMax ? Number(product.priceRangeMax) : null,
    }

    return NextResponse.json(serializedProduct, { status: 201 })
  } catch (error) {
    logger.error('Error creating product:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Dados inválidos', details: error.errors }, { status: 400 })
    }

    return NextResponse.json({ error: 'Erro ao criar produto' }, { status: 500 })
  }
}
