import { Suspense } from 'react'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { formatCurrency } from '@/lib/utils'
import { Plus, Package, TrendingUp, Eye, EyeOff } from 'lucide-react'

async function getProducts() {
  const products = await prisma.product.findMany({
    orderBy: [{ isFeatured: 'desc' }, { isActive: 'desc' }, { name: 'asc' }],
    select: {
      id: true,
      name: true,
      slug: true,
      category: true,
      priceType: true,
      basePrice: true,
      pricePerM2: true,
      priceRangeMin: true,
      priceRangeMax: true,
      isActive: true,
      isFeatured: true,
      thumbnail: true,
      _count: {
        select: {
          orderItems: true,
          quoteItems: true,
        },
      },
    },
  })

  return products
}

async function getStats() {
  const [total, active, featured] = await Promise.all([
    prisma.product.count(),
    prisma.product.count({ where: { isActive: true } }),
    prisma.product.count({ where: { isFeatured: true } }),
  ])

  return { total, active, featured }
}

export default async function ProdutosPage() {
  const [products, stats] = await Promise.all([getProducts(), getStats()])

  const categoryLabels: Record<string, string> = {
    BOX: 'Box',
    ESPELHOS: 'Espelhos',
    VIDROS: 'Vidros',
    PORTAS: 'Portas',
    JANELAS: 'Janelas',
    GUARDA_CORPO: 'Guarda-Corpo',
    CORTINAS_VIDRO: 'Cortinas de Vidro',
    PERGOLADOS: 'Pergolados',
    TAMPOS_PRATELEIRAS: 'Tampos/Prateleiras',
    DIVISORIAS: 'Divisorias',
    FECHAMENTOS: 'Fechamentos',
    FERRAGENS: 'Ferragens',
    KITS: 'Kits',
    SERVICOS: 'Servicos',
    OUTROS: 'Outros',
  }

  const priceTypeLabels: Record<string, string> = {
    FIXED: 'Fixo',
    PER_M2: 'Por m²',
    QUOTE_ONLY: 'Orçamento',
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Produtos</h1>
          <p className="text-neutral-500 dark:text-neutral-400">Gerencie o catálogo de produtos</p>
        </div>
        <Link href="/admin/produtos/novo">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Novo Produto
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
            <Package className="h-4 w-4 text-neutral-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-neutral-500">produtos cadastrados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ativos</CardTitle>
            <Eye className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.active}</div>
            <p className="text-xs text-neutral-500">visíveis para clientes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Destaques</CardTitle>
            <TrendingUp className="h-4 w-4 text-gold-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.featured}</div>
            <p className="text-xs text-neutral-500">em destaque na home</p>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Produtos */}
      <Card>
        <CardHeader>
          <CardTitle>Todos os Produtos</CardTitle>
          <CardDescription>
            {products.length} produto{products.length !== 1 ? 's' : ''} encontrado
            {products.length !== 1 ? 's' : ''}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {products.length === 0 ? (
            <div className="py-12 text-center">
              <Package className="mx-auto h-12 w-12 text-neutral-400" />
              <h3 className="mt-4 text-lg font-medium">Nenhum produto cadastrado</h3>
              <p className="mt-2 text-sm text-neutral-500">Comece criando seu primeiro produto</p>
              <Link href="/admin/produtos/novo">
                <Button className="mt-4">
                  <Plus className="mr-2 h-4 w-4" />
                  Criar Primeiro Produto
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {products.map((product) => {
                const usage = product._count.orderItems + product._count.quoteItems

                let priceDisplay = 'Sob consulta'
                if (product.priceType === 'FIXED' && product.basePrice) {
                  priceDisplay = formatCurrency(Number(product.basePrice))
                } else if (product.priceType === 'PER_M2' && product.pricePerM2) {
                  priceDisplay = `${formatCurrency(Number(product.pricePerM2))}/m²`
                } else if (product.priceRangeMin && product.priceRangeMax) {
                  priceDisplay = `${formatCurrency(Number(product.priceRangeMin))} - ${formatCurrency(Number(product.priceRangeMax))}`
                }

                return (
                  <div
                    key={product.id}
                    className="flex items-center justify-between rounded-lg border border-neutral-200 p-4 transition-colors hover:bg-neutral-50 dark:border-neutral-800 dark:hover:bg-neutral-900"
                  >
                    <div className="flex flex-1 items-center gap-4">
                      <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-neutral-100 dark:bg-neutral-800">
                        {product.thumbnail ? (
                          <img
                            src={product.thumbnail}
                            alt={product.name}
                            className="h-full w-full rounded-lg object-cover"
                          />
                        ) : (
                          <Package className="h-8 w-8 text-neutral-400" />
                        )}
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium">{product.name}</h3>
                          {!product.isActive && (
                            <Badge variant="outline" className="border-red-500 text-red-500">
                              <EyeOff className="mr-1 h-3 w-3" />
                              Inativo
                            </Badge>
                          )}
                          {product.isFeatured && (
                            <Badge variant="outline" className="border-gold-500 text-gold-500">
                              <TrendingUp className="mr-1 h-3 w-3" />
                              Destaque
                            </Badge>
                          )}
                        </div>
                        <div className="mt-1 flex items-center gap-4 text-sm text-neutral-500">
                          <span>{categoryLabels[product.category]}</span>
                          <span>•</span>
                          <span>
                            {priceTypeLabels[product.priceType]}: {priceDisplay}
                          </span>
                          {usage > 0 && (
                            <>
                              <span>•</span>
                              <span>
                                {usage} uso{usage !== 1 ? 's' : ''}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <Link href={`/admin/produtos/${product.id}`}>
                      <Button variant="outline" size="sm">
                        Editar
                      </Button>
                    </Link>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
