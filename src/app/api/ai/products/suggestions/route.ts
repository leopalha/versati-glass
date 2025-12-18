/**
 * AI-CHAT Sprint P2.4: Product Suggestions API
 *
 * Returns product suggestions from the catalog based on
 * the category detected in the AI conversation.
 *
 * GET /api/ai/products/suggestions?category=BOX&limit=3
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { logger } from '@/lib/logger'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const category = searchParams.get('category')
    const limit = parseInt(searchParams.get('limit') || '3', 10)

    if (!category) {
      return NextResponse.json({ error: 'Category is required' }, { status: 400 })
    }

    // Validate category
    const validCategories = [
      'BOX',
      'ESPELHOS',
      'VIDROS',
      'PORTAS',
      'JANELAS',
      'GUARDA_CORPOS',
      'CORRIMAOS',
      'TAMPOS',
      'DIVISORIAS',
      'OUTROS',
    ]

    if (!validCategories.includes(category)) {
      return NextResponse.json({ error: 'Invalid category' }, { status: 400 })
    }

    // Fetch products from catalog
    const products = await prisma.product.findMany({
      where: {
        category: category as any,
        isActive: true,
      },
      orderBy: [
        { isFeatured: 'desc' }, // Featured products first
        { createdAt: 'desc' }, // Newest first
      ],
      take: Math.min(limit, 10), // Max 10 suggestions
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        shortDescription: true,
        category: true,
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
        isFeatured: true,
      },
    })

    logger.info('Product suggestions fetched', {
      category,
      count: products.length,
      limit,
    })

    return NextResponse.json({
      success: true,
      category,
      products: products.map((p) => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
        description: p.shortDescription || p.description,
        category: p.category,
        image: p.thumbnail || p.images[0] || '/images/placeholder-product.jpg',
        priceType: p.priceType,
        priceInfo: getPriceInfo(p),
        colors: p.colors,
        finishes: p.finishes,
        thicknesses: p.thicknesses,
        isFeatured: p.isFeatured,
      })),
    })
  } catch (error) {
    logger.error('Error fetching product suggestions', { error })

    return NextResponse.json(
      {
        error: 'Failed to fetch product suggestions',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

/**
 * Format price information based on product pricing type
 */
function getPriceInfo(product: {
  priceType: string
  basePrice: any
  pricePerM2: any
  priceRangeMin: any
  priceRangeMax: any
}): string {
  switch (product.priceType) {
    case 'FIXED':
      if (product.basePrice) {
        return `R$ ${Number(product.basePrice).toFixed(2)}`
      }
      return 'Sob consulta'

    case 'PER_M2':
      if (product.pricePerM2) {
        return `R$ ${Number(product.pricePerM2).toFixed(2)}/m²`
      }
      return 'Sob consulta'

    case 'RANGE':
      if (product.priceRangeMin && product.priceRangeMax) {
        return `R$ ${Number(product.priceRangeMin).toFixed(2)} - R$ ${Number(product.priceRangeMax).toFixed(2)}`
      }
      return 'Sob consulta'

    case 'ON_DEMAND':
    default:
      return 'Sob consulta'
  }
}
