import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { ProductForm } from '@/components/admin/product-form'

interface EditarProdutoPageProps {
  params: Promise<{ id: string }>
}

async function getProduct(id: string) {
  const product = await prisma.product.findUnique({
    where: { id },
  })

  if (!product) {
    return null
  }

  // Serializar Decimals para numbers e converter null para undefined
  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    description: product.description,
    shortDescription: product.shortDescription ?? undefined,
    category: product.category as
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
      | 'OUTROS',
    subcategory: product.subcategory ?? undefined,
    images: product.images,
    thumbnail: product.thumbnail ?? undefined,
    priceType: product.priceType as 'FIXED' | 'PER_M2' | 'QUOTE_ONLY',
    basePrice: product.basePrice ? Number(product.basePrice) : undefined,
    pricePerM2: product.pricePerM2 ? Number(product.pricePerM2) : undefined,
    priceRangeMin: product.priceRangeMin ? Number(product.priceRangeMin) : undefined,
    priceRangeMax: product.priceRangeMax ? Number(product.priceRangeMax) : undefined,
    colors: product.colors,
    finishes: product.finishes,
    thicknesses: product.thicknesses,
    isActive: product.isActive,
    isFeatured: product.isFeatured,
    metaTitle: product.metaTitle ?? undefined,
    metaDescription: product.metaDescription ?? undefined,
  }
}

export default async function EditarProdutoPage({ params }: EditarProdutoPageProps) {
  const { id } = await params
  const product = await getProduct(id)

  if (!product) {
    notFound()
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Editar Produto</h1>
        <p className="text-neutral-500 dark:text-neutral-400">{product.name}</p>
      </div>

      {/* Form */}
      <ProductForm mode="edit" initialData={product} />
    </div>
  )
}
