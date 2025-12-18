'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useQuoteStore } from '@/store/quote-store'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { cn, formatCurrency } from '@/lib/utils'
import { ArrowLeft, Check, Package } from 'lucide-react'
import { logger } from '@/lib/logger'
import { useToast } from '@/components/ui/toast/use-toast'

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

// Nomes das categorias para exibição
const categoryNames: Record<string, string> = {
  BOX: 'Box para Banheiro',
  ESPELHOS: 'Espelho',
  VIDROS: 'Vidro',
  PORTAS: 'Porta de Vidro',
  JANELAS: 'Janela de Vidro',
  GUARDA_CORPO: 'Guarda-Corpo',
  CORTINAS_VIDRO: 'Cortina de Vidro',
  PERGOLADOS: 'Pergolado/Cobertura',
  TAMPOS_PRATELEIRAS: 'Tampo/Prateleira',
  DIVISORIAS: 'Divisoria',
  FECHAMENTOS: 'Fechamento em Vidro',
  FERRAGENS: 'Ferragem/Acessorio',
  KITS: 'Kit Completo',
  SERVICOS: 'Servico',
  OUTROS: 'Outro',
}

export function StepProduct() {
  const {
    currentItem,
    updateCurrentItem,
    nextStep,
    prevStep,
    cancelEditItem,
    editingIndex,
    selectedProducts,
    toggleProductSelection,
    clearSelectedProducts,
    selectedCategories,
    setProductsToDetail,
  } = useQuoteStore()
  const { toast } = useToast()
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const category = currentItem?.category
  const isEditing = editingIndex !== null

  // Fetch products from ALL selected categories
  useEffect(() => {
    const fetchProducts = async () => {
      if (selectedCategories.length === 0) {
        logger.warn('[STEP-PRODUCT] No categories selected')
        setProducts([])
        setIsLoading(false)
        return
      }

      setIsLoading(true)
      try {
        logger.info('[STEP-PRODUCT] Fetching products for categories:', selectedCategories)

        // Fetch products from all selected categories in parallel
        const promises = selectedCategories.map(async (cat) => {
          logger.debug(`[STEP-PRODUCT] Fetching products for category: ${cat}`)
          const response = await fetch(`/api/products?category=${cat}`)
          const products = await response.json()
          logger.debug(`[STEP-PRODUCT] Received ${products.length} products for category ${cat}`)
          return products
        })

        const results = await Promise.all(promises)
        const allProducts = results.flat()

        logger.info(
          `[STEP-PRODUCT] Total products fetched: ${allProducts.length} from ${selectedCategories.length} categories`,
          {
            byCategory: selectedCategories.map((cat, index) => ({
              category: cat,
              count: results[index].length,
              productIds: results[index].map((p: Product) => p.id),
            })),
          }
        )

        setProducts(allProducts)
      } catch (error) {
        logger.error('[STEP-PRODUCT] Error fetching products:', error)
        toast({
          variant: 'error',
          title: 'Erro ao carregar produtos',
          description: 'Não foi possível carregar os produtos. Tente novamente.',
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchProducts()
  }, [selectedCategories, toast])

  const handleSelect = (product: Product) => {
    toggleProductSelection(product.id)
  }

  const handleContinue = async () => {
    // FQ.4.3: Validar que pelo menos 1 produto foi selecionado
    if (selectedProducts.length === 0) {
      logger.error('No products selected')
      toast({
        variant: 'error',
        title: 'Nenhum produto selecionado',
        description: 'Selecione pelo menos um produto para continuar',
      })
      return
    }

    // Get full product data for selected products
    const selectedProductsData = products.filter((p) => selectedProducts.includes(p.id))

    // Save products to detail queue
    setProductsToDetail(selectedProductsData)

    logger.debug(`Continuing with ${selectedProducts.length} products selected for detailing`)
    nextStep()
  }

  const handleContinueWithoutProduct = () => {
    if (!category) {
      logger.error('Cannot continue without category')
      return
    }

    // Continuar sem produto selecionado - usar categoria como nome
    const productData = {
      category,
      productId: `custom-${category}`,
      productName: categoryNames[category] || `Produto - ${category}`,
      productSlug: category.toLowerCase(),
    }

    logger.debug('Setting currentItem with custom product:', productData)
    updateCurrentItem(productData)

    logger.debug('Calling nextStep()')
    nextStep()
  }

  const handleBack = () => {
    prevStep()
  }

  const handleCancel = () => {
    if (isEditing) {
      cancelEditItem()
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
        <h2 className="text-theme-primary font-display text-3xl font-bold">Escolha os produtos</h2>
        <p className="text-theme-muted mt-2">Selecione um ou mais produtos para o seu orçamento</p>
        {selectedCategories.length > 0 && (
          <p className="mt-2 text-sm font-medium text-accent-400">
            Mostrando produtos de:{' '}
            {selectedCategories.map((cat) => categoryNames[cat] || cat).join(', ')}
          </p>
        )}
        {products.length > 0 && (
          <p className="text-theme-subtle mt-1 text-xs">
            {products.length} produto(s) disponível(is)
          </p>
        )}
      </div>

      {products.length === 0 ? (
        <div className="text-center">
          <div className="bg-theme-secondary mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full">
            <Package className="text-theme-muted h-12 w-12" />
          </div>
          <p className="text-theme-muted mb-4">Nenhum produto cadastrado nesta categoria ainda.</p>
          <p className="text-theme-subtle mb-6 text-sm">
            Voce pode continuar para informar as medidas e detalhes do seu orcamento.
          </p>
          <div className="flex justify-center gap-4">
            <Button variant="outline" onClick={handleBack}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar
            </Button>
            {isEditing && (
              <Button variant="outline" onClick={handleCancel}>
                Cancelar
              </Button>
            )}
            <Button onClick={handleContinueWithoutProduct}>Continuar</Button>
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => {
              const isSelected = selectedProducts.includes(product.id)

              return (
                <button
                  key={product.id}
                  type="button"
                  onClick={() => handleSelect(product)}
                  aria-label={product.name}
                  className={cn(
                    'hover:border-accent-500/50 w-full cursor-pointer overflow-hidden text-left transition-all',
                    'bg-theme-secondary border-theme-default rounded-lg border',
                    isSelected && 'border-accent-500 ring-2 ring-accent-500'
                  )}
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
                        <Package className="text-theme-subtle h-12 w-12" />
                      </div>
                    )}
                    {isSelected && (
                      <div className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-accent-500 ring-2 ring-white">
                        <Check className="h-5 w-5 stroke-[3] font-bold text-neutral-900" />
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
                </button>
              )
            })}
          </div>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-between">
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleBack}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar
              </Button>
              {isEditing && (
                <Button variant="outline" onClick={handleCancel}>
                  Cancelar
                </Button>
              )}
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              {selectedProducts.length > 0 && (
                <div className="flex items-center justify-center sm:justify-start">
                  <span className="text-theme-muted text-sm">
                    {selectedProducts.length}{' '}
                    {selectedProducts.length === 1
                      ? 'produto selecionado'
                      : 'produtos selecionados'}
                  </span>
                </div>
              )}
              <Button variant="ghost" onClick={handleContinueWithoutProduct}>
                Produto personalizado
              </Button>
              <Button disabled={selectedProducts.length === 0} onClick={handleContinue}>
                Continuar {selectedProducts.length > 0 && `(${selectedProducts.length})`}
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
