'use client'

import { useState } from 'react'
import { useQuoteStore } from '@/store/quote-store'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import {
  Droplets,
  LayoutGrid,
  DoorOpen,
  Square,
  Grid3x3,
  Package,
} from 'lucide-react'

const categories = [
  {
    id: 'BOX',
    name: 'Box para Banheiro',
    description: 'Box de correr, abrir e especiais',
    icon: Droplets,
    color: 'text-blue-400',
  },
  {
    id: 'ESPELHOS',
    name: 'Espelhos',
    description: 'Espelhos com ou sem moldura, LED',
    icon: Square,
    color: 'text-silver-400',
  },
  {
    id: 'VIDROS',
    name: 'Vidros',
    description: 'Temperados, laminados e comuns',
    icon: LayoutGrid,
    color: 'text-cyan-400',
  },
  {
    id: 'PORTAS_JANELAS',
    name: 'Portas e Janelas',
    description: 'Portas de vidro e janelas blindex',
    icon: DoorOpen,
    color: 'text-amber-400',
  },
  {
    id: 'FECHAMENTOS',
    name: 'Fechamentos',
    description: 'Areas, varandas e coberturas',
    icon: Grid3x3,
    color: 'text-green-400',
  },
  {
    id: 'OUTROS',
    name: 'Outros Servicos',
    description: 'Instalacoes e reparos em geral',
    icon: Package,
    color: 'text-purple-400',
  },
]

export function StepCategory() {
  const { nextStep, addItem, items, clearItems } = useQuoteStore()
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    items[0]?.category || null
  )

  const handleContinue = () => {
    if (selectedCategory) {
      // Clear existing items if changing category
      if (items.length > 0 && items[0].category !== selectedCategory) {
        clearItems()
      }
      // Add a new item with the selected category
      if (items.length === 0 || items[0].category !== selectedCategory) {
        addItem({
          productId: '',
          productName: '',
          productSlug: '',
          category: selectedCategory,
          quantity: 1,
          images: [],
        })
      }
      nextStep()
    }
  }

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-8 text-center">
        <h2 className="font-display text-3xl font-bold text-white">
          O que voce precisa?
        </h2>
        <p className="mt-2 text-neutral-400">
          Selecione a categoria do produto ou servico
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => {
          const Icon = category.icon
          const isSelected = selectedCategory === category.id

          return (
            <Card
              key={category.id}
              className={cn(
                'cursor-pointer p-6 transition-all hover:border-gold-500/50',
                isSelected && 'border-gold-500 bg-gold-500/10'
              )}
              onClick={() => setSelectedCategory(category.id)}
            >
              <div className="flex flex-col items-center text-center">
                <div
                  className={cn(
                    'mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-neutral-100/10',
                    category.color
                  )}
                >
                  <Icon className="h-8 w-8" />
                </div>
                <h3 className="mb-1 font-display text-lg font-semibold text-white">
                  {category.name}
                </h3>
                <p className="text-sm text-neutral-400">{category.description}</p>
              </div>
            </Card>
          )
        })}
      </div>

      <div className="mt-8 flex justify-center">
        <Button
          size="lg"
          disabled={!selectedCategory}
          onClick={handleContinue}
        >
          Continuar
        </Button>
      </div>
    </div>
  )
}
