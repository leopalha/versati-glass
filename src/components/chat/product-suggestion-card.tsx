'use client'

/**
 * AI-CHAT Sprint P2.4: Product Suggestion Card
 *
 * Displays a product card in the chat with image, name, description,
 * and price. Users can click to add the product to their quote.
 */

import { motion } from 'framer-motion'
import { Plus, Check, Sparkles, Tag } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'

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
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className={`bg-theme-elevated border-theme-default group relative overflow-hidden rounded-lg border transition-all ${
        isSelected
          ? 'ring-2 ring-accent-500'
          : 'hover:shadow-accent-500/10 hover:border-accent-500 hover:shadow-lg'
      }`}
    >
      {/* Featured Badge */}
      {product.isFeatured && (
        <div className="absolute right-2 top-2 z-10">
          <div className="flex items-center gap-1 rounded-full bg-accent-500 px-2 py-1 text-xs font-medium text-neutral-900">
            <Sparkles className="h-3 w-3" />
            Destaque
          </div>
        </div>
      )}

      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-neutral-800">
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
        />

        {/* Overlay on hover */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"
        />
      </div>

      {/* Content */}
      <div className="p-3">
        {/* Title */}
        <h4 className="mb-1 line-clamp-1 font-medium text-white">{product.name}</h4>

        {/* Description */}
        <p className="text-theme-muted mb-2 line-clamp-2 text-xs">{product.description}</p>

        {/* Options */}
        {(product.colors.length > 0 ||
          product.finishes.length > 0 ||
          product.thicknesses.length > 0) && (
          <div className="mb-2 flex flex-wrap gap-1 text-xs">
            {product.colors.length > 0 && (
              <span className="bg-theme-default text-theme-muted rounded px-1.5 py-0.5">
                {product.colors.length} cor{product.colors.length > 1 ? 'es' : ''}
              </span>
            )}
            {product.thicknesses.length > 0 && (
              <span className="bg-theme-default text-theme-muted rounded px-1.5 py-0.5">
                {product.thicknesses.length} espessura{product.thicknesses.length > 1 ? 's' : ''}
              </span>
            )}
          </div>
        )}

        {/* Price */}
        <div className="mb-3 flex items-center gap-1">
          <Tag className="h-3.5 w-3.5 text-accent-500" />
          <span className="text-sm font-semibold text-accent-500">{product.priceInfo}</span>
        </div>

        {/* Action Button */}
        <Button
          onClick={() => onSelect(product)}
          disabled={isSelected}
          className={`w-full text-sm ${
            isSelected
              ? 'bg-accent-500 text-neutral-900'
              : 'bg-theme-default text-white hover:bg-accent-500 hover:text-neutral-900'
          }`}
          size="sm"
        >
          {isSelected ? (
            <>
              <Check className="mr-1.5 h-4 w-4" />
              Selecionado
            </>
          ) : (
            <>
              <Plus className="mr-1.5 h-4 w-4" />
              Adicionar ao Orçamento
            </>
          )}
        </Button>
      </div>

      {/* Selected Indicator */}
      {isSelected && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute right-2 top-2 rounded-full bg-accent-500 p-1"
        >
          <Check className="h-4 w-4 text-neutral-900" />
        </motion.div>
      )}
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
    BOX: 'Box de Banheiro',
    ESPELHOS: 'Espelhos',
    VIDROS: 'Vidros',
    PORTAS: 'Portas de Vidro',
    JANELAS: 'Janelas',
    GUARDA_CORPOS: 'Guarda-Corpos',
    CORRIMAOS: 'Corrimãos',
    TAMPOS: 'Tampos',
    DIVISORIAS: 'Divisórias',
    OUTROS: 'Outros Produtos',
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-theme-secondary border-theme-default my-3 rounded-lg border p-4"
    >
      {/* Header */}
      <div className="mb-3 flex items-center gap-2">
        <Sparkles className="h-5 w-5 text-accent-500" />
        <h3 className="font-display text-lg font-semibold text-white">
          Sugestões de {categoryLabels[category] || category}
        </h3>
      </div>

      <p className="text-theme-muted mb-4 text-sm">
        Selecione um produto para adicionar ao seu orçamento:
      </p>

      {/* Product Grid */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <ProductSuggestionCard
              product={product}
              onSelect={onSelectProduct}
              isSelected={selectedProductIds.includes(product.id)}
            />
          </motion.div>
        ))}
      </div>

      {/* Footer Hint */}
      <p className="text-theme-subtle mt-3 text-center text-xs">
        💡 Você pode selecionar múltiplos produtos ou continuar descrevendo o que precisa
      </p>
    </motion.div>
  )
}
