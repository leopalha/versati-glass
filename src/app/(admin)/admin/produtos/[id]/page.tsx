import { notFound } from 'next/navigation'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { ProductForm } from '@/components/admin/product-form'
import { AdminHeader } from '@/components/admin/admin-header'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'

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
      | 'FACHADAS'
      | 'PAINEIS_DECORATIVOS'
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
    <div>
      <AdminHeader
        title="Editar Produto"
        subtitle={product.name}
        actions={
          <Link href="/admin/produtos">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar
            </Button>
          </Link>
        }
      />

      <div className="p-6">
        <ProductForm mode="edit" initialData={product} />
      </div>
    </div>
  )
}
