'use client'

/**
 * AI-CHAT Sprint P2.4: Product Suggestion Card
 *
 * Displays a product card in the chat with image, name, description,
 * and price. Users can click to add the product to their quote.
 */

import { motion } from 'framer-motion'
import { Plus, Check, Sparkles } from 'lucide-react'

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
          ? 'ring-2 ring-accent-500 bg-accent-500/10'
          : 'hover:border-accent-500 hover:bg-accent-500/5'
      }`}
    >
      {/* Imagem pequena quadrada */}
      <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-md bg-neutral-800">
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover"
        />
        {/* Badge de destaque */}
        {product.isFeatured && (
          <div className="absolute -right-1 -top-1 rounded-full bg-accent-500 p-0.5">
            <Sparkles className="h-2.5 w-2.5 text-neutral-900" />
          </div>
        )}
      </div>

      {/* Conteúdo compacto */}
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-medium text-white truncate">{product.name}</h4>
        <p className="text-theme-muted text-xs truncate">{product.description}</p>
        <div className="flex items-center gap-2 mt-1">
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
          <div className="rounded-full bg-theme-default p-1.5 group-hover:bg-accent-500 transition-colors">
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
          <span className="text-xs text-accent-500 font-medium">
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
