'use client'

import { useState, useMemo, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { formatCurrency } from '@/lib/utils'

interface Product {
  id: string
  slug: string
  name: string
  category: string
  shortDescription: string | null
  priceType: string
  basePrice: number | null
  pricePerM2: number | null
  priceRangeMin: number | null
  priceRangeMax: number | null
  thumbnail: string | null
  isFeatured: boolean
  thicknesses: string[]
  finishes: string[]
}

const categoryLabels: Record<string, string> = {
  BOX: 'Box de Vidro',
  ESPELHOS: 'Espelhos',
  VIDROS: 'Vidros',
  PORTAS: 'Portas',
  JANELAS: 'Janelas',
  GUARDA_CORPO: 'Guarda-Corpo',
  CORTINAS_VIDRO: 'Cortinas de Vidro',
  PERGOLADOS: 'Pergolados',
  TAMPOS_PRATELEIRAS: 'Tampos e Prateleiras',
  DIVISORIAS: 'Divisórias',
  FECHAMENTOS: 'Fechamentos',
  FACHADAS: 'Fachadas',
  PAINEIS_DECORATIVOS: 'Painéis Decorativos',
  FERRAGENS: 'Ferragens',
  KITS: 'Kits',
  SERVICOS: 'Serviços',
  OUTROS: 'Outros',
}

function getPriceDisplay(product: Product): string {
  if (product.priceType === 'QUOTE_ONLY') {
    return 'Sob Consulta'
  }
  if (product.priceType === 'PER_M2' && product.pricePerM2) {
    return `A partir de ${formatCurrency(Number(product.pricePerM2))}/m²`
  }
  if (product.basePrice) {
    return `A partir de ${formatCurrency(Number(product.basePrice))}`
  }
  if (product.priceRangeMin && product.priceRangeMax) {
    return `${formatCurrency(Number(product.priceRangeMin))} - ${formatCurrency(Number(product.priceRangeMax))}`
  }
  return 'Sob Consulta'
}

export function ProdutosList() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch('/api/products?active=true')
        if (res.ok) {
          const data = await res.json()
          setProducts(data.products || data)
        }
      } catch (error) {
        console.error('Erro ao carregar produtos:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  // Get unique categories from products
  const categories = useMemo(() => {
    const cats = new Set(products.map((p) => p.category))
    return Array.from(cats).sort()
  }, [products])

  // Filter products based on search and category
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch =
        searchTerm === '' ||
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.shortDescription?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false)

      const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory

      return matchesSearch && matchesCategory
    })
  }, [products, searchTerm, selectedCategory])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-accent-500" />
        <span className="text-theme-muted ml-3">Carregando produtos...</span>
      </div>
    )
  }

  return (
    <>
      {/* Filters */}
      <div className="mb-12 grid gap-4 md:grid-cols-2">
        <Input
          type="search"
          placeholder="Buscar produtos..."
          className="w-full"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="border-theme-default bg-theme-elevated text-theme-primary focus:ring-accent-500/20 rounded-md border px-4 py-2 text-sm focus:border-accent-500 focus:outline-none focus:ring-2"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="all">Todas as Categorias ({products.length})</option>
          {categories.map((cat) => {
            const count = products.filter((p) => p.category === cat).length
            return (
              <option key={cat} value={cat}>
                {categoryLabels[cat] || cat} ({count})
              </option>
            )
          })}
        </select>
      </div>

      {/* Results count */}
      <div className="mb-6 text-center">
        <p className="text-theme-muted text-sm">
          {filteredProducts.length === 0
            ? 'Nenhum produto encontrado'
            : `${filteredProducts.length} produto${filteredProducts.length > 1 ? 's' : ''} encontrado${filteredProducts.length > 1 ? 's' : ''}`}
        </p>
      </div>

      {/* Products Grid */}
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredProducts.map((product) => (
          <Card key={product.id} variant="hover" className="group overflow-hidden">
            <div className="bg-theme-elevated relative aspect-square overflow-hidden">
              {product.thumbnail ? (
                <Image
                  src={product.thumbnail}
                  alt={product.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-neutral-800">
                  <span className="text-neutral-500">Sem imagem</span>
                </div>
              )}
              {product.isFeatured && (
                <Badge variant="gold" className="absolute right-4 top-4">
                  Destaque
                </Badge>
              )}
              <Badge
                variant="outline"
                className="absolute left-4 top-4 border-white/30 bg-black/50 text-white"
              >
                {categoryLabels[product.category] || product.category}
              </Badge>
            </div>
            <div className="p-6">
              <h3 className="text-theme-primary mb-2 line-clamp-1 text-lg font-bold">
                {product.name}
              </h3>
              <p className="text-theme-muted mb-4 line-clamp-2 text-sm">
                {product.shortDescription || 'Produto de alta qualidade'}
              </p>
              {(product.thicknesses?.length > 0 || product.finishes?.length > 0) && (
                <ul className="mb-4 space-y-1">
                  {product.thicknesses?.slice(0, 2).map((t, idx) => (
                    <li key={idx} className="text-theme-subtle text-xs">
                      • {t}
                    </li>
                  ))}
                  {product.finishes?.slice(0, 2).map((f, idx) => (
                    <li key={idx} className="text-theme-subtle text-xs">
                      • {f}
                    </li>
                  ))}
                </ul>
              )}
              <p className="mb-4 text-lg font-semibold text-accent-400">
                {getPriceDisplay(product)}
              </p>
              <div className="grid gap-2">
                <Button asChild className="w-full">
                  <Link href={`/produtos/${product.slug}`}>
                    Ver Detalhes
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/orcamento">Solicitar Orçamento</Link>
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Empty state */}
      {filteredProducts.length === 0 && (
        <div className="py-20 text-center">
          <p className="text-theme-muted mb-4 text-lg">
            Nenhum produto encontrado com os filtros selecionados.
          </p>
          <Button
            variant="outline"
            onClick={() => {
              setSearchTerm('')
              setSelectedCategory('all')
            }}
          >
            Limpar Filtros
          </Button>
        </div>
      )}
    </>
  )
}
