import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { slugify } from '@/lib/utils'
import { updateProductSchema } from '@/lib/validations/product'
import { z } from 'zod'

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
      return NextResponse.json({ error: 'Produto nao encontrado' }, { status: 404 })
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
    return NextResponse.json({ error: 'Erro ao buscar produto' }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: RouteParams) {
  try {
    // Verificar autenticação
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
    }

    // Verificar se é admin
    if (session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Permissão negada. Apenas administradores podem editar produtos.' },
        { status: 403 }
      )
    }

    const { slug } = await params

    // Verificar se produto existe
    const existingProduct = await prisma.product.findUnique({
      where: { slug },
    })

    if (!existingProduct) {
      return NextResponse.json({ error: 'Produto não encontrado' }, { status: 404 })
    }

    // Parsear e validar dados
    const body = await request.json()
    const validatedData = updateProductSchema.parse({
      ...body,
      id: existingProduct.id,
    })

    // Se name mudou, gerar novo slug
    let newSlug = slug
    if (validatedData.name && validatedData.name !== existingProduct.name) {
      newSlug = slugify(validatedData.name)

      // Verificar se novo slug já existe
      if (newSlug !== slug) {
        const slugExists = await prisma.product.findUnique({
          where: { slug: newSlug },
        })

        if (slugExists) {
          return NextResponse.json(
            { error: 'Já existe um produto com este nome. Tente um nome diferente.' },
            { status: 409 }
          )
        }
      }
    }

    // Remover id do objeto de atualização
    const { id, ...dataToUpdate } = validatedData

    // Atualizar produto
    const updatedProduct = await prisma.product.update({
      where: { id: existingProduct.id },
      data: {
        ...dataToUpdate,
        slug: newSlug,
      },
    })

    // Serializar Decimal para JSON
    const serializedProduct = {
      ...updatedProduct,
      basePrice: updatedProduct.basePrice ? Number(updatedProduct.basePrice) : null,
      pricePerM2: updatedProduct.pricePerM2 ? Number(updatedProduct.pricePerM2) : null,
      priceRangeMin: updatedProduct.priceRangeMin ? Number(updatedProduct.priceRangeMin) : null,
      priceRangeMax: updatedProduct.priceRangeMax ? Number(updatedProduct.priceRangeMax) : null,
    }

    return NextResponse.json(serializedProduct)
  } catch (error) {
    console.error('Error updating product:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Dados inválidos', details: error.errors }, { status: 400 })
    }

    return NextResponse.json({ error: 'Erro ao atualizar produto' }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    // Verificar autenticação
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
    }

    // Verificar se é admin
    if (session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Permissão negada. Apenas administradores podem deletar produtos.' },
        { status: 403 }
      )
    }

    const { slug } = await params

    // Verificar se produto existe
    const existingProduct = await prisma.product.findUnique({
      where: { slug },
      include: {
        _count: {
          select: {
            orderItems: true,
            quoteItems: true,
          },
        },
      },
    })

    if (!existingProduct) {
      return NextResponse.json({ error: 'Produto não encontrado' }, { status: 404 })
    }

    // Verificar se produto tem dependências (soft delete ao invés de hard delete)
    const hasOrders = existingProduct._count.orderItems > 0
    const hasQuotes = existingProduct._count.quoteItems > 0

    if (hasOrders || hasQuotes) {
      // Soft delete: apenas desativar
      const deactivatedProduct = await prisma.product.update({
        where: { id: existingProduct.id },
        data: { isActive: false },
      })

      return NextResponse.json({
        message: 'Produto desativado com sucesso (usado em pedidos/orçamentos)',
        product: {
          ...deactivatedProduct,
          basePrice: deactivatedProduct.basePrice ? Number(deactivatedProduct.basePrice) : null,
          pricePerM2: deactivatedProduct.pricePerM2 ? Number(deactivatedProduct.pricePerM2) : null,
          priceRangeMin: deactivatedProduct.priceRangeMin
            ? Number(deactivatedProduct.priceRangeMin)
            : null,
          priceRangeMax: deactivatedProduct.priceRangeMax
            ? Number(deactivatedProduct.priceRangeMax)
            : null,
        },
        softDelete: true,
      })
    }

    // Hard delete se não tem dependências
    await prisma.product.delete({
      where: { id: existingProduct.id },
    })

    return NextResponse.json({
      message: 'Produto deletado com sucesso',
      softDelete: false,
    })
  } catch (error) {
    console.error('Error deleting product:', error)
    return NextResponse.json({ error: 'Erro ao deletar produto' }, { status: 500 })
  }
}
