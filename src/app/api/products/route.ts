import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const featured = searchParams.get('featured')
    const active = searchParams.get('active')

    const products = await prisma.product.findMany({
      where: {
        ...(category && { category: category as 'BOX' | 'ESPELHOS' | 'VIDROS' | 'PORTAS_JANELAS' | 'FECHAMENTOS' | 'OUTROS' }),
        ...(featured === 'true' && { isFeatured: true }),
        ...(active !== 'false' && { isActive: true }),
      },
      orderBy: [
        { isFeatured: 'desc' },
        { name: 'asc' },
      ],
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
    console.error('Error fetching products:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar produtos' },
      { status: 500 }
    )
  }
}
