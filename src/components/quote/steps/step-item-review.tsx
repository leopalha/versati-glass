'use client'

import { useState, useMemo, useCallback } from 'react'
import { useQuoteStore } from '@/store/quote-store'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { formatCurrency } from '@/lib/utils'
import { ArrowLeft, Plus, Trash2, Edit2, ShoppingCart, ArrowRight, AlertCircle } from 'lucide-react'

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

// ARCH-P1-4: Memoize base prices to avoid recreating on every render
const basePrices: Record<string, number> = {
  BOX: 1500,
  ESPELHOS: 300,
  VIDROS: 200,
  PORTAS: 2000,
  JANELAS: 1200,
  GUARDA_CORPO: 800,
  CORTINAS_VIDRO: 600,
  PERGOLADOS: 500,
  TAMPOS_PRATELEIRAS: 250,
  DIVISORIAS: 400,
  FECHAMENTOS: 450,
  SERVICOS: 500,
}

export function StepItemReview() {
  const { items, removeItem, startEditItem, startNewItem, nextStep, prevStep, clearItems } =
    useQuoteStore()
  const [itemToRemove, setItemToRemove] = useState<number | null>(null)

  // ARCH-P1-4: Memoize calculation function
  const calculateItemEstimate = useCallback((item: (typeof items)[0]) => {
    if (!item.width || !item.height) return 0
    const area = item.width * item.height
    const basePrice = basePrices[item.category] || 500
    return (basePrice + area * 300) * item.quantity
  }, [])

  // ARCH-P1-4: Memoize total calculation to avoid recalculating on every render
  const totalEstimate = useMemo(
    () => items.reduce((acc, item) => acc + calculateItemEstimate(item), 0),
    [items, calculateItemEstimate]
  )

  // ARCH-P1-4: Memoize handlers to prevent re-renders
  const handleAddMore = useCallback(() => {
    startNewItem()
  }, [startNewItem])

  const handleEdit = useCallback(
    (index: number) => {
      startEditItem(index)
    },
    [startEditItem]
  )

  const handleRemove = useCallback((index: number) => {
    // FQ.3.4: Confirmação antes de remover item
    setItemToRemove(index)
  }, [])

  const confirmRemove = useCallback(() => {
    if (itemToRemove !== null) {
      removeItem(itemToRemove)
      setItemToRemove(null)
    }
  }, [itemToRemove, removeItem])

  const cancelRemove = useCallback(() => {
    setItemToRemove(null)
  }, [])

  const handleContinue = useCallback(() => {
    nextStep() // Vai para Step 5 (dados do cliente)
  }, [nextStep])

  const handleBack = useCallback(() => {
    // Se não tem itens, volta para Step 1
    if (items.length === 0) {
      clearItems()
      prevStep()
      prevStep()
      prevStep()
    } else {
      prevStep()
    }
  }, [items.length, clearItems, prevStep])

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl">
        <div className="mb-8 text-center">
          <h2 className="text-theme-primary font-display text-3xl font-bold">Seu carrinho</h2>
          <p className="text-theme-muted mt-2">Adicione itens ao seu orcamento</p>
        </div>

        <Card className="p-8 text-center">
          <div className="bg-theme-elevated mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full">
            <ShoppingCart className="text-theme-muted h-10 w-10" />
          </div>
          <h3 className="text-theme-primary mb-2 text-lg font-semibold">Carrinho vazio</h3>
          <p className="text-theme-muted mb-6">
            Voce ainda nao adicionou nenhum item ao seu orcamento.
          </p>
          <Button onClick={handleAddMore}>
            <Plus className="mr-2 h-4 w-4" />
            Adicionar Item
          </Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-8 text-center">
        <h2 className="text-theme-primary font-display text-3xl font-bold">
          Seu carrinho ({items.length} {items.length === 1 ? 'item' : 'itens'})
        </h2>
        <p className="text-theme-muted mt-2">Revise seus itens ou adicione mais produtos</p>
      </div>

      <div className="space-y-4">
        {items.map((item, index) => {
          const estimate = calculateItemEstimate(item)

          return (
            <Card key={item.id} className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="bg-accent-500/20 rounded-full px-2 py-0.5 text-xs font-medium text-accent-400">
                      {categoryNames[item.category] || item.category}
                    </span>
                    <span className="text-theme-subtle text-xs">x{item.quantity}</span>
                  </div>
                  <h3 className="text-theme-primary mt-1 font-display text-lg font-semibold">
                    {item.productName}
                  </h3>

                  <div className="text-theme-muted mt-2 space-y-1 text-sm">
                    {item.width && item.height && (
                      <p>
                        Medidas: {item.width}m x {item.height}m
                      </p>
                    )}
                    {item.glassType && <p>Vidro: {item.glassType}</p>}
                    {item.color && <p>Ferragem: {item.color}</p>}
                    {item.thickness && <p>Espessura: {item.thickness}</p>}
                    {item.model && <p>Modelo: {item.model}</p>}
                    {item.description && (
                      <p className="text-theme-subtle italic">{item.description}</p>
                    )}
                  </div>

                  {item.images && item.images.length > 0 && (
                    <div className="mt-2 flex gap-1">
                      {item.images.slice(0, 3).map((img, imgIndex) => (
                        <img
                          key={imgIndex}
                          src={img}
                          alt={`Foto ${imgIndex + 1}`}
                          className="h-10 w-10 rounded object-cover"
                        />
                      ))}
                      {item.images.length > 3 && (
                        <span className="text-theme-subtle flex h-10 w-10 items-center justify-center rounded bg-neutral-800 text-xs">
                          +{item.images.length - 3}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex flex-col items-end gap-2">
                  <p className="font-display text-lg font-bold text-accent-400">
                    {estimate > 0 ? formatCurrency(estimate) : 'Sob consulta'}
                  </p>
                  <p className="text-theme-subtle text-xs">Estimativa</p>

                  <div className="mt-2 flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(index)}
                      aria-label={`Editar ${item.productName}`}
                    >
                      <Edit2 className="h-4 w-4" aria-hidden="true" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-400 hover:bg-red-500/10 hover:text-red-400"
                      onClick={() => handleRemove(index)}
                      aria-label={`Remover ${item.productName}`}
                    >
                      <Trash2 className="h-4 w-4" aria-hidden="true" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      {/* Adicionar mais itens */}
      <Card className="mt-4 border-dashed p-4">
        <button
          type="button"
          onClick={handleAddMore}
          className="text-theme-muted flex w-full items-center justify-center gap-2 py-2 transition-colors hover:text-accent-400"
        >
          <Plus className="h-5 w-5" />
          <span>Adicionar outro item ao orcamento</span>
        </button>
      </Card>

      {/* Total estimado */}
      <Card className="bg-accent-500/10 mt-6 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-theme-muted text-sm">Total estimado</p>
            <p className="font-display text-3xl font-bold text-accent-400">
              {totalEstimate > 0 ? formatCurrency(totalEstimate) : 'Sob consulta'}
            </p>
            <p className="text-theme-subtle mt-1 text-xs">
              * Valor estimado. O preco final sera confirmado apos analise.
            </p>
          </div>
          <div className="text-theme-muted text-right text-sm">
            <p>
              {items.length} {items.length === 1 ? 'item' : 'itens'}
            </p>
            <p>{items.reduce((acc, i) => acc + i.quantity, 0)} unidade(s)</p>
          </div>
        </div>
      </Card>

      {/* Ações */}
      <div className="mt-8 flex justify-between">
        <Button variant="outline" onClick={handleBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>
        <Button onClick={handleContinue}>
          Continuar para Dados
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>

      {/* FQ.3.4: Modal de confirmação de remoção */}
      {/* ARCH-P1-5: Accessible modal with ARIA attributes */}
      {itemToRemove !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="remove-dialog-title"
          aria-describedby="remove-dialog-description"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
        >
          <Card className="w-full max-w-md p-6">
            <div className="mb-4 flex items-center gap-3">
              <div
                className="flex h-10 w-10 items-center justify-center rounded-full bg-red-500/20"
                aria-hidden="true"
              >
                <AlertCircle className="h-5 w-5 text-red-400" />
              </div>
              <div>
                <h3
                  id="remove-dialog-title"
                  className="text-theme-primary font-display text-lg font-bold"
                >
                  Remover item?
                </h3>
                <p id="remove-dialog-description" className="text-theme-muted text-sm">
                  Esta acao nao pode ser desfeita
                </p>
              </div>
            </div>

            <div className="bg-theme-elevated mb-6 rounded-lg p-4">
              <p className="text-theme-primary text-sm font-medium">
                {items[itemToRemove]?.productName}
              </p>
              {items[itemToRemove]?.width && items[itemToRemove]?.height && (
                <p className="text-theme-muted mt-1 text-xs">
                  {items[itemToRemove].width}m x {items[itemToRemove].height}m{' • '}
                  {items[itemToRemove].quantity}x
                </p>
              )}
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={cancelRemove}
                aria-label="Cancelar remocao de item"
              >
                Cancelar
              </Button>
              <Button
                className="flex-1 bg-red-500 hover:bg-red-600"
                onClick={confirmRemove}
                aria-label={`Confirmar remocao de ${items[itemToRemove]?.productName}`}
              >
                Sim, remover
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
