import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

interface RouteParams {
  params: Promise<{ slug: string }>
}

export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { slug } = await params

    const product = await prisma.product.findUnique({
      where: { slug },
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
        metaTitle: true,
        metaDescription: true,
      },
    })

    if (!product) {
      return NextResponse.json(
        { error: 'Produto nao encontrado' },
        { status: 404 }
      )
    }

    // Convert Decimal to number for JSON serialization
    const serializedProduct = {
      ...product,
      basePrice: product.basePrice ? Number(product.basePrice) : null,
      pricePerM2: product.pricePerM2 ? Number(product.pricePerM2) : null,
      priceRangeMin: product.priceRangeMin ? Number(product.priceRangeMin) : null,
      priceRangeMax: product.priceRangeMax ? Number(product.priceRangeMax) : null,
    }

    return NextResponse.json(serializedProduct)
  } catch (error) {
    console.error('Error fetching product:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar produto' },
      { status: 500 }
    )
  }
}
