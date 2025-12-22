import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { slugify } from '@/lib/utils'
import { logger } from '@/lib/logger'

interface RouteParams {
  params: Promise<{ slug: string }>
}

export async function POST(request: Request, { params }: RouteParams) {
  try {
    // Verificar autenticação
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
    }

    // Verificar se é admin
    if (session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Permissão negada. Apenas administradores podem duplicar produtos.' },
        { status: 403 }
      )
    }

    const { slug } = await params

    // Buscar produto original
    const originalProduct = await prisma.product.findUnique({
      where: { slug },
    })

    if (!originalProduct) {
      return NextResponse.json({ error: 'Produto não encontrado' }, { status: 404 })
    }

    // Gerar novo nome e slug
    const baseName = `${originalProduct.name} (Cópia)`
    let newName = baseName
    let newSlug = slugify(newName)
    let counter = 1

    // Verificar se já existe produto com esse nome/slug
    while (true) {
      const existing = await prisma.product.findFirst({
        where: {
          OR: [{ name: newName }, { slug: newSlug }],
        },
      })

      if (!existing) break

      counter++
      newName = `${originalProduct.name} (Cópia ${counter})`
      newSlug = slugify(newName)
    }

    // Criar cópia do produto
    const duplicatedProduct = await prisma.product.create({
      data: {
        name: newName,
        slug: newSlug,
        description: originalProduct.description,
        shortDescription: originalProduct.shortDescription,
        category: originalProduct.category,
        subcategory: originalProduct.subcategory,
        images: originalProduct.images,
        thumbnail: originalProduct.thumbnail,
        priceType: originalProduct.priceType,
        basePrice: originalProduct.basePrice,
        pricePerM2: originalProduct.pricePerM2,
        priceRangeMin: originalProduct.priceRangeMin,
        priceRangeMax: originalProduct.priceRangeMax,
        colors: originalProduct.colors,
        finishes: originalProduct.finishes,
        thicknesses: originalProduct.thicknesses,
        isActive: false, // Começa desativado para revisão
        isFeatured: false, // Não destaca automaticamente
        metaTitle: originalProduct.metaTitle,
        metaDescription: originalProduct.metaDescription,
      },
    })

    logger.info('Product duplicated', {
      originalId: originalProduct.id,
      originalSlug: originalProduct.slug,
      newId: duplicatedProduct.id,
      newSlug: duplicatedProduct.slug,
    })

    return NextResponse.json({
      id: duplicatedProduct.id,
      slug: duplicatedProduct.slug,
      name: duplicatedProduct.name,
      message: 'Produto duplicado com sucesso',
    })
  } catch (error) {
    logger.error('Error duplicating product:', error)
    return NextResponse.json({ error: 'Erro ao duplicar produto' }, { status: 500 })
  }
}
