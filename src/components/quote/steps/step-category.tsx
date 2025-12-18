'use client'

import { useState } from 'react'
import { useQuoteStore } from '@/store/quote-store'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import {
  Droplets,
  LayoutGrid,
  DoorOpen,
  Square,
  Grid3x3,
  Package,
  PanelTop,
  Fence,
  PanelsTopLeft,
  Home,
  RectangleHorizontal,
  Columns,
  Wrench,
  Hammer,
  MoreHorizontal,
  Check,
} from 'lucide-react'

// Mapeamento de ícones por ID
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Droplets,
  Square,
  LayoutGrid,
  DoorOpen,
  PanelTop,
  Fence,
  PanelsTopLeft,
  Home,
  RectangleHorizontal,
  Columns,
  Grid3x3,
  Wrench,
  Package,
  Hammer,
  MoreHorizontal,
}

// Categorias principais para o Quote Wizard (mais relevantes para cotação)
const categories = [
  {
    id: 'BOX',
    name: 'Box para Banheiro',
    description: 'Box de correr, abrir, pivotante e especiais',
    icon: 'Droplets',
    color: 'text-blue-400',
  },
  {
    id: 'ESPELHOS',
    name: 'Espelhos',
    description: 'Lapidados, bisotados, com LED e decorativos',
    icon: 'Square',
    color: 'text-gray-300',
  },
  {
    id: 'VIDROS',
    name: 'Vidros',
    description: 'Temperados, laminados, jateados e especiais',
    icon: 'LayoutGrid',
    color: 'text-cyan-400',
  },
  {
    id: 'PORTAS',
    name: 'Portas de Vidro',
    description: 'Pivotantes, de abrir, correr e articuladas',
    icon: 'DoorOpen',
    color: 'text-amber-400',
  },
  {
    id: 'JANELAS',
    name: 'Janelas de Vidro',
    description: 'Maxim-ar, basculante, correr e pivotante',
    icon: 'PanelTop',
    color: 'text-sky-400',
  },
  {
    id: 'GUARDA_CORPO',
    name: 'Guarda-Corpo',
    description: 'Autoportante, torres de inox, bottons e spider',
    icon: 'Fence',
    color: 'text-orange-400',
  },
  {
    id: 'CORTINAS_VIDRO',
    name: 'Cortinas de Vidro',
    description: 'Envidracamento de sacadas e varandas',
    icon: 'PanelsTopLeft',
    color: 'text-teal-400',
  },
  {
    id: 'PERGOLADOS',
    name: 'Pergolados e Coberturas',
    description: 'Coberturas de vidro para areas externas',
    icon: 'Home',
    color: 'text-lime-400',
  },
  {
    id: 'TAMPOS_PRATELEIRAS',
    name: 'Tampos e Prateleiras',
    description: 'Tampos de mesa e prateleiras de vidro',
    icon: 'RectangleHorizontal',
    color: 'text-indigo-400',
  },
  {
    id: 'DIVISORIAS',
    name: 'Divisorias e Paineis',
    description: 'Divisorias de escritorio e paineis decorativos',
    icon: 'Columns',
    color: 'text-pink-400',
  },
  {
    id: 'FECHAMENTOS',
    name: 'Fechamentos em Vidro',
    description: 'Fechamento de varanda, area gourmet e piscina',
    icon: 'Grid3x3',
    color: 'text-green-400',
  },
  {
    id: 'SERVICOS',
    name: 'Servicos',
    description: 'Manutencao, reparos e instalacao',
    icon: 'Hammer',
    color: 'text-rose-400',
  },
]

export function StepCategory() {
  const {
    nextStep,
    currentItem,
    items,
    cancelEditItem,
    editingIndex,
    selectedCategories,
    toggleCategorySelection,
    setSelectedCategories,
  } = useQuoteStore()

  const isEditing = editingIndex !== null

  const handleContinue = () => {
    if (selectedCategories.length > 0) {
      // Avança para Step 2 com categorias selecionadas
      nextStep()
    }
  }

  const handleCancel = () => {
    if (isEditing) {
      cancelEditItem()
    }
  }

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-8 text-center">
        <h2 id="category-heading" className="text-theme-primary font-display text-3xl font-bold">
          {isEditing ? 'Editando item' : 'O que voce precisa?'}
        </h2>
        <p className="text-theme-muted mt-2">
          {isEditing
            ? 'Selecione a categoria do produto ou servico'
            : 'Selecione uma ou mais categorias de produtos'}
        </p>
        {selectedCategories.length > 0 && !isEditing && (
          <p className="mt-2 text-sm font-medium text-accent-400" role="status" aria-live="polite">
            {selectedCategories.length} categoria(s) selecionada(s)
          </p>
        )}
        {items.length > 0 && !isEditing && (
          <p className="text-theme-muted mt-1 text-sm" role="status" aria-live="polite">
            Voce ja tem {items.length} item(ns) no carrinho. Continue adicionando!
          </p>
        )}
      </div>

      {/* Multi-select categories with checkboxes */}
      <div
        role="group"
        aria-labelledby="category-heading"
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
      >
        {categories.map((category) => {
          const Icon = iconMap[category.icon] || Package
          const isSelected = selectedCategories.includes(category.id)

          return (
            <button
              key={category.id}
              type="button"
              aria-label={`${isSelected ? 'Desselecionar' : 'Selecionar'} ${category.name}: ${category.description}`}
              onClick={() => toggleCategorySelection(category.id)}
              className={cn(
                'hover:border-accent-500/50 relative w-full cursor-pointer p-6 text-left transition-all',
                'bg-theme-secondary border-theme-default rounded-lg border',
                isSelected && 'bg-accent-500/10 ring-accent-500/20 border-accent-500 ring-2'
              )}
            >
              {/* Checkmark indicator */}
              {isSelected && (
                <div className="absolute right-3 top-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-accent-500">
                    <Check className="h-4 w-4 text-white" />
                  </div>
                </div>
              )}

              <div className="flex flex-col items-center text-center">
                <div
                  className={cn(
                    'bg-theme-elevated mb-4 flex h-16 w-16 items-center justify-center rounded-full transition-all',
                    category.color,
                    isSelected && 'ring-accent-500/50 ring-2'
                  )}
                >
                  <Icon className="h-8 w-8" />
                </div>
                <h3 className="text-theme-primary mb-1 font-display text-lg font-semibold">
                  {category.name}
                </h3>
                <p className="text-theme-muted text-sm">{category.description}</p>
              </div>
            </button>
          )
        })}
      </div>

      <div className="mt-8 flex justify-center gap-4">
        {isEditing && (
          <Button variant="outline" onClick={handleCancel} aria-label="Cancelar edicao de item">
            Cancelar Edicao
          </Button>
        )}
        <Button
          size="lg"
          disabled={selectedCategories.length === 0}
          onClick={handleContinue}
          aria-label={
            selectedCategories.length > 0
              ? `Continuar com ${selectedCategories.length} categoria(s) selecionada(s)`
              : 'Selecione pelo menos uma categoria para continuar'
          }
        >
          Continuar {selectedCategories.length > 0 && `(${selectedCategories.length})`}
        </Button>
      </div>
    </div>
  )
}
