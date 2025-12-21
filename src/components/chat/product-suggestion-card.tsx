'use client'

/**
 * AI-CHAT Sprint P2.4: Product Suggestion Card
 *
 * Displays a product card in the chat with image, name, description,
 * and price. Users can click to add the product to their quote.
 */

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Check, Sparkles, ChevronDown, ChevronUp, ShoppingBag } from 'lucide-react'

export interface ProductSuggestion {
  id: string
  name: string
  slug: string
  description: string
  category: string
  image: string
  priceType: string
  priceInfo: string
  colors: string[]
  finishes: string[]
  thicknesses: string[]
  isFeatured: boolean
}

interface ProductSuggestionCardProps {
  product: ProductSuggestion
  onSelect: (product: ProductSuggestion) => void
  isSelected?: boolean
}

export function ProductSuggestionCard({
  product,
  onSelect,
  isSelected = false,
}: ProductSuggestionCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.2 }}
      onClick={() => onSelect(product)}
      className={`bg-theme-elevated border-theme-default group relative flex cursor-pointer items-center gap-3 overflow-hidden rounded-lg border p-2 transition-all ${
        isSelected
          ? 'bg-accent-500/10 ring-2 ring-accent-500'
          : 'hover:bg-accent-500/5 hover:border-accent-500'
      }`}
    >
      {/* Imagem pequena quadrada */}
      <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-md bg-neutral-800">
        <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
        {/* Badge de destaque */}
        {product.isFeatured && (
          <div className="absolute -right-1 -top-1 rounded-full bg-accent-500 p-0.5">
            <Sparkles className="h-2.5 w-2.5 text-neutral-900" />
          </div>
        )}
      </div>

      {/* Conteúdo compacto */}
      <div className="min-w-0 flex-1">
        <h4 className="truncate text-sm font-medium text-white">{product.name}</h4>
        <p className="text-theme-muted truncate text-xs">{product.description}</p>
        <div className="mt-1 flex items-center gap-2">
          <span className="text-xs font-semibold text-accent-500">{product.priceInfo}</span>
          {product.colors.length > 0 && (
            <span className="text-theme-subtle text-[10px]">
              {product.colors.length} cor{product.colors.length > 1 ? 'es' : ''}
            </span>
          )}
        </div>
      </div>

      {/* Indicador de seleção/ação */}
      <div className="flex-shrink-0">
        {isSelected ? (
          <div className="rounded-full bg-accent-500 p-1.5">
            <Check className="h-3.5 w-3.5 text-neutral-900" />
          </div>
        ) : (
          <div className="bg-theme-default rounded-full p-1.5 transition-colors group-hover:bg-accent-500">
            <Plus className="h-3.5 w-3.5 text-white group-hover:text-neutral-900" />
          </div>
        )}
      </div>
    </motion.div>
  )
}

/**
 * Container for product suggestions in chat
 */
interface ProductSuggestionsProps {
  products: ProductSuggestion[]
  onSelectProduct: (product: ProductSuggestion) => void
  selectedProductIds?: string[]
  category: string
}

export function ProductSuggestions({
  products,
  onSelectProduct,
  selectedProductIds = [],
  category,
}: ProductSuggestionsProps) {
  if (products.length === 0) return null

  const categoryLabels: Record<string, string> = {
    BOX: 'Box',
    ESPELHOS: 'Espelhos',
    VIDROS: 'Vidros',
    PORTAS: 'Portas',
    JANELAS: 'Janelas',
    GUARDA_CORPOS: 'Guarda-Corpos',
    CORRIMAOS: 'Corrimãos',
    TAMPOS: 'Tampos',
    DIVISORIAS: 'Divisórias',
    OUTROS: 'Produtos',
  }

  const selectedCount = selectedProductIds.length

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-theme-secondary/50 border-theme-default my-2 rounded-lg border p-3"
    >
      {/* Header compacto */}
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Sparkles className="h-4 w-4 text-accent-500" />
          <span className="text-sm font-medium text-white">
            {categoryLabels[category] || category}
          </span>
        </div>
        {selectedCount > 0 && (
          <span className="text-xs font-medium text-accent-500">
            {selectedCount} selecionado{selectedCount > 1 ? 's' : ''}
          </span>
        )}
      </div>

      {/* Lista de produtos compacta */}
      <div className="flex flex-col gap-2">
        {products.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <ProductSuggestionCard
              product={product}
              onSelect={onSelectProduct}
              isSelected={selectedProductIds.includes(product.id)}
            />
          </motion.div>
        ))}
      </div>

      {/* Footer Hint compacto */}
      <p className="text-theme-subtle mt-2 text-center text-[10px]">
        Clique para selecionar • Pode escolher vários
      </p>
    </motion.div>
  )
}

/**
 * Container for product suggestions grouped by multiple categories
 * Use when user mentions multiple product types (e.g., "porta e espelho")
 */
interface MultiCategoryProductSuggestionsProps {
  products: ProductSuggestion[]
  onSelectProduct: (product: ProductSuggestion) => void
  selectedProductIds?: string[]
}

export function MultiCategoryProductSuggestions({
  products,
  onSelectProduct,
  selectedProductIds = [],
}: MultiCategoryProductSuggestionsProps) {
  if (products.length === 0) return null

  const categoryLabels: Record<string, string> = {
    BOX: 'Box de Banheiro',
    ESPELHOS: 'Espelhos',
    VIDROS: 'Vidros',
    PORTAS: 'Portas de Vidro',
    JANELAS: 'Janelas',
    GUARDA_CORPO: 'Guarda-Corpos',
    GUARDA_CORPOS: 'Guarda-Corpos',
    CORRIMAOS: 'Corrimaos',
    TAMPOS: 'Tampos',
    TAMPOS_PRATELEIRAS: 'Tampos e Prateleiras',
    DIVISORIAS: 'Divisorias',
    CORTINAS_VIDRO: 'Cortinas de Vidro',
    PERGOLADOS: 'Pergolados',
    FECHAMENTOS: 'Fechamentos',
    OUTROS: 'Produtos',
  }

  // Agrupa produtos por categoria
  const groupedByCategory = products.reduce(
    (acc, product) => {
      const cat = product.category || 'OUTROS'
      if (!acc[cat]) acc[cat] = []
      acc[cat].push(product)
      return acc
    },
    {} as Record<string, ProductSuggestion[]>
  )

  const categories = Object.keys(groupedByCategory)
  const selectedCount = selectedProductIds.length

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-theme-secondary/50 border-theme-default my-2 rounded-lg border p-3"
    >
      {/* Header geral */}
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Sparkles className="h-4 w-4 text-accent-500" />
          <span className="text-sm font-medium text-white">Produtos Sugeridos</span>
        </div>
        {selectedCount > 0 && (
          <span className="text-xs font-medium text-accent-500">
            {selectedCount} selecionado{selectedCount > 1 ? 's' : ''}
          </span>
        )}
      </div>

      {/* Categorias com produtos */}
      <div className="flex flex-col gap-4">
        {categories.map((category) => (
          <div key={category}>
            {/* Label da categoria */}
            <div className="mb-2 flex items-center gap-1">
              <span className="text-theme-muted text-xs font-medium uppercase tracking-wide">
                {categoryLabels[category] || category}
              </span>
              <span className="text-theme-subtle text-[10px]">
                ({groupedByCategory[category].length})
              </span>
            </div>

            {/* Lista de produtos da categoria */}
            <div className="flex flex-col gap-2">
              {groupedByCategory[category].map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <ProductSuggestionCard
                    product={product}
                    onSelect={onSelectProduct}
                    isSelected={selectedProductIds.includes(product.id)}
                  />
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Footer Hint */}
      <p className="text-theme-subtle mt-3 text-center text-[10px]">
        Clique para selecionar • Pode escolher de varias categorias
      </p>
    </motion.div>
  )
}

/**
 * Collapsible version of ProductSuggestions
 * Collapses after first selection to show summary, can be expanded again
 */
interface CollapsibleProductSuggestionsProps {
  products: ProductSuggestion[]
  onSelectProduct: (product: ProductSuggestion) => void
  selectedProductIds?: string[]
  category: string
  isCollapsed?: boolean
  onToggleCollapse?: () => void
}

export function CollapsibleProductSuggestions({
  products,
  onSelectProduct,
  selectedProductIds = [],
  category,
  isCollapsed = false,
  onToggleCollapse,
}: CollapsibleProductSuggestionsProps) {
  const [localCollapsed, setLocalCollapsed] = useState(isCollapsed)

  // Use external control if provided, otherwise local state
  const collapsed = onToggleCollapse ? isCollapsed : localCollapsed
  const toggleCollapse = onToggleCollapse || (() => setLocalCollapsed(!localCollapsed))

  if (products.length === 0) return null

  const categoryLabels: Record<string, string> = {
    BOX: 'Box',
    ESPELHOS: 'Espelhos',
    VIDROS: 'Vidros',
    PORTAS: 'Portas',
    JANELAS: 'Janelas',
    GUARDA_CORPO: 'Guarda-Corpos',
    GUARDA_CORPOS: 'Guarda-Corpos',
    CORRIMAOS: 'Corrimaos',
    TAMPOS: 'Tampos',
    TAMPOS_PRATELEIRAS: 'Tampos e Prateleiras',
    DIVISORIAS: 'Divisorias',
    CORTINAS_VIDRO: 'Cortinas de Vidro',
    PERGOLADOS: 'Pergolados',
    FECHAMENTOS: 'Fechamentos',
    OUTROS: 'Produtos',
  }

  const selectedCount = selectedProductIds.length
  const selectedProducts = products.filter((p) => selectedProductIds.includes(p.id))

  // Collapsed view - compact summary
  if (collapsed && selectedCount > 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2 }}
        className="bg-accent-500/10 border-accent-500/30 my-2 rounded-lg border p-3"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent-500">
              <Check className="h-4 w-4 text-neutral-900" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-white">
                {selectedCount} {categoryLabels[category] || 'produto'}
                {selectedCount > 1 ? 's' : ''} selecionado{selectedCount > 1 ? 's' : ''}
              </p>
              <p className="truncate text-xs text-accent-400">
                {selectedProducts.map((p) => p.name).join(', ')}
              </p>
            </div>
          </div>
          <button
            onClick={toggleCollapse}
            className="hover:bg-accent-500/10 flex items-center gap-1 rounded-md px-2 py-1 text-xs text-accent-500 transition-colors"
          >
            <span>Ver mais</span>
            <ChevronDown className="h-3.5 w-3.5" />
          </button>
        </div>
      </motion.div>
    )
  }

  // Expanded view - full product list
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-theme-secondary/50 border-theme-default my-2 rounded-lg border p-3"
    >
      {/* Header with collapse button */}
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Sparkles className="h-4 w-4 text-accent-500" />
          <span className="text-sm font-medium text-white">
            {categoryLabels[category] || category}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {selectedCount > 0 && (
            <span className="text-xs font-medium text-accent-500">
              {selectedCount} selecionado{selectedCount > 1 ? 's' : ''}
            </span>
          )}
          {selectedCount > 0 && (
            <button
              onClick={toggleCollapse}
              className="text-theme-muted hover:bg-accent-500/10 rounded p-1 transition-colors hover:text-accent-500"
              title="Minimizar"
            >
              <ChevronUp className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Product list */}
      <AnimatePresence>
        <div className="flex flex-col gap-2">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ delay: index * 0.05 }}
            >
              <ProductSuggestionCard
                product={product}
                onSelect={onSelectProduct}
                isSelected={selectedProductIds.includes(product.id)}
              />
            </motion.div>
          ))}
        </div>
      </AnimatePresence>

      {/* Footer Hint */}
      <p className="text-theme-subtle mt-2 text-center text-[10px]">
        Clique para selecionar • Pode escolher varios
      </p>
    </motion.div>
  )
}

/**
 * Collapsible version for multiple categories
 */
interface CollapsibleMultiCategoryProps {
  products: ProductSuggestion[]
  onSelectProduct: (product: ProductSuggestion) => void
  selectedProductIds?: string[]
  isCollapsed?: boolean
  onToggleCollapse?: () => void
}

export function CollapsibleMultiCategoryProductSuggestions({
  products,
  onSelectProduct,
  selectedProductIds = [],
  isCollapsed = false,
  onToggleCollapse,
}: CollapsibleMultiCategoryProps) {
  const [localCollapsed, setLocalCollapsed] = useState(isCollapsed)

  const collapsed = onToggleCollapse ? isCollapsed : localCollapsed
  const toggleCollapse = onToggleCollapse || (() => setLocalCollapsed(!localCollapsed))

  if (products.length === 0) return null

  const categoryLabels: Record<string, string> = {
    BOX: 'Box de Banheiro',
    ESPELHOS: 'Espelhos',
    VIDROS: 'Vidros',
    PORTAS: 'Portas de Vidro',
    JANELAS: 'Janelas',
    GUARDA_CORPO: 'Guarda-Corpos',
    GUARDA_CORPOS: 'Guarda-Corpos',
    CORRIMAOS: 'Corrimaos',
    TAMPOS: 'Tampos',
    TAMPOS_PRATELEIRAS: 'Tampos e Prateleiras',
    DIVISORIAS: 'Divisorias',
    CORTINAS_VIDRO: 'Cortinas de Vidro',
    PERGOLADOS: 'Pergolados',
    FECHAMENTOS: 'Fechamentos',
    OUTROS: 'Produtos',
  }

  // Group products by category
  const groupedByCategory = products.reduce(
    (acc, product) => {
      const cat = product.category || 'OUTROS'
      if (!acc[cat]) acc[cat] = []
      acc[cat].push(product)
      return acc
    },
    {} as Record<string, ProductSuggestion[]>
  )

  const categories = Object.keys(groupedByCategory)
  const selectedCount = selectedProductIds.length
  const selectedProducts = products.filter((p) => selectedProductIds.includes(p.id))

  // Collapsed view
  if (collapsed && selectedCount > 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2 }}
        className="bg-accent-500/10 border-accent-500/30 my-2 rounded-lg border p-3"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent-500">
              <ShoppingBag className="h-4 w-4 text-neutral-900" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-white">
                {selectedCount} produto{selectedCount > 1 ? 's' : ''} selecionado
                {selectedCount > 1 ? 's' : ''}
              </p>
              <p className="truncate text-xs text-accent-400">
                {selectedProducts
                  .slice(0, 2)
                  .map((p) => p.name)
                  .join(', ')}
                {selectedProducts.length > 2 && ` +${selectedProducts.length - 2}`}
              </p>
            </div>
          </div>
          <button
            onClick={toggleCollapse}
            className="hover:bg-accent-500/10 flex items-center gap-1 rounded-md px-2 py-1 text-xs text-accent-500 transition-colors"
          >
            <span>Ver mais</span>
            <ChevronDown className="h-3.5 w-3.5" />
          </button>
        </div>
      </motion.div>
    )
  }

  // Expanded view
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-theme-secondary/50 border-theme-default my-2 rounded-lg border p-3"
    >
      {/* Header */}
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Sparkles className="h-4 w-4 text-accent-500" />
          <span className="text-sm font-medium text-white">Produtos Sugeridos</span>
        </div>
        <div className="flex items-center gap-2">
          {selectedCount > 0 && (
            <span className="text-xs font-medium text-accent-500">
              {selectedCount} selecionado{selectedCount > 1 ? 's' : ''}
            </span>
          )}
          {selectedCount > 0 && (
            <button
              onClick={toggleCollapse}
              className="text-theme-muted hover:bg-accent-500/10 rounded p-1 transition-colors hover:text-accent-500"
              title="Minimizar"
            >
              <ChevronUp className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Categories with products */}
      <AnimatePresence>
        <div className="flex flex-col gap-4">
          {categories.map((category) => (
            <div key={category}>
              <div className="mb-2 flex items-center gap-1">
                <span className="text-theme-muted text-xs font-medium uppercase tracking-wide">
                  {categoryLabels[category] || category}
                </span>
                <span className="text-theme-subtle text-[10px]">
                  ({groupedByCategory[category].length})
                </span>
              </div>

              <div className="flex flex-col gap-2">
                {groupedByCategory[category].map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <ProductSuggestionCard
                      product={product}
                      onSelect={onSelectProduct}
                      isSelected={selectedProductIds.includes(product.id)}
                    />
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </AnimatePresence>

      {/* Footer Hint */}
      <p className="text-theme-subtle mt-3 text-center text-[10px]">
        Clique para selecionar • Pode escolher de varias categorias
      </p>
    </motion.div>
  )
}
