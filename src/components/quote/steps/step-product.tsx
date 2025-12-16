'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useQuoteStore } from '@/store/quote-store'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { cn, formatCurrency } from '@/lib/utils'
import { ArrowLeft, Check } from 'lucide-react'

interface Product {
  id: string
  name: string
  slug: string
  shortDescription: string | null
  thumbnail: string | null
  priceType: string
  priceRangeMin: number | null
  priceRangeMax: number | null
  pricePerM2: number | null
  colors: string[]
}

export function StepProduct() {
  const { items, updateItem, nextStep, prevStep } = useQuoteStore()
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedProduct, setSelectedProduct] = useState<string | null>(items[0]?.productId || null)

  const category = items[0]?.category

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`/api/products?category=${category}`)
        if (response.ok) {
          const data = await response.json()
          setProducts(data)
        }
      } catch (error) {
        console.error('Error fetching products:', error)
      } finally {
        setIsLoading(false)
      }
    }

    if (category) {
      fetchProducts()
    }
  }, [category])

  const handleSelect = (product: Product) => {
    setSelectedProduct(product.id)
    updateItem(0, {
      productId: product.id,
      productName: product.name,
      productSlug: product.slug,
    })
  }

  const handleContinue = () => {
    if (selectedProduct) {
      nextStep()
    }
  }

  const getPriceDisplay = (product: Product) => {
    if (product.priceType === 'PER_M2' && product.pricePerM2) {
      return `A partir de ${formatCurrency(product.pricePerM2)}/m²`
    }
    if (product.priceRangeMin && product.priceRangeMax) {
      return `${formatCurrency(product.priceRangeMin)} - ${formatCurrency(product.priceRangeMax)}`
    }
    return 'Sob consulta'
  }

  if (isLoading) {
    return (
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 text-center">
          <Skeleton className="mx-auto h-8 w-64" />
          <Skeleton className="mx-auto mt-2 h-4 w-48" />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-64 rounded-lg" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-8 text-center">
        <h2 className="text-theme-primary font-display text-3xl font-bold">Escolha o produto</h2>
        <p className="text-theme-muted mt-2">
          Selecione o modelo que melhor atende suas necessidades
        </p>
      </div>

      {products.length === 0 ? (
        <div className="text-center">
          <p className="text-theme-muted">Nenhum produto disponivel nesta categoria no momento.</p>
          <Button variant="outline" className="mt-4" onClick={prevStep}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => {
              const isSelected = selectedProduct === product.id

              return (
                <Card
                  key={product.id}
                  className={cn(
                    'hover:border-accent-500/50 cursor-pointer overflow-hidden transition-all',
                    isSelected && 'border-accent-500 ring-1 ring-accent-500'
                  )}
                  onClick={() => handleSelect(product)}
                >
                  <div className="relative aspect-[4/3]">
                    {product.thumbnail ? (
                      <Image
                        src={product.thumbnail}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="bg-theme-elevated flex h-full items-center justify-center">
                        <span className="text-theme-subtle">Sem imagem</span>
                      </div>
                    )}
                    {isSelected && (
                      <div className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-accent-500">
                        <Check className="h-5 w-5 text-neutral-900" />
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="text-theme-primary font-display text-lg font-semibold">
                      {product.name}
                    </h3>
                    {product.shortDescription && (
                      <p className="text-theme-muted mt-1 line-clamp-2 text-sm">
                        {product.shortDescription}
                      </p>
                    )}
                    <p className="mt-2 text-sm font-medium text-accent-400">
                      {getPriceDisplay(product)}
                    </p>
                    {product.colors.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {product.colors.slice(0, 4).map((color) => (
                          <span key={color} className="text-theme-subtle text-xs">
                            {color}
                            {product.colors.indexOf(color) <
                              Math.min(3, product.colors.length - 1) && ', '}
                          </span>
                        ))}
                        {product.colors.length > 4 && (
                          <span className="text-theme-subtle text-xs">
                            +{product.colors.length - 4}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </Card>
              )
            })}
          </div>

          <div className="mt-8 flex justify-between">
            <Button variant="outline" onClick={prevStep}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar
            </Button>
            <Button disabled={!selectedProduct} onClick={handleContinue}>
              Continuar
            </Button>
          </div>
        </>
      )}
    </div>
  )
}
