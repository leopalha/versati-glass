'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Pencil, Loader2, Save, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface QuoteItem {
  id: string
  description: string
  quantity: number
  unitPrice: number
  subtotal: number
}

interface EditQuoteValuesProps {
  quoteId: string
  items: QuoteItem[]
  currentDiscount: number
  currentTotal: number
}

export function EditQuoteValues({
  quoteId,
  items: initialItems,
  currentDiscount,
  currentTotal,
}: EditQuoteValuesProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [items, setItems] = useState(initialItems)
  const [discount, setDiscount] = useState(currentDiscount)

  const updateItem = (itemId: string, field: 'quantity' | 'unitPrice', value: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === itemId
          ? {
              ...item,
              [field]: value,
              subtotal: field === 'quantity' ? value * item.unitPrice : item.quantity * value,
            }
          : item
      )
    )
  }

  const calculateNewTotal = () => {
    const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0)
    const discountAmount = subtotal * (discount / 100)
    return subtotal - discountAmount
  }

  const handleSave = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/quotes/${quoteId}/values`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map((item) => ({
            id: item.id,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
          })),
          discount,
        }),
      })

      if (!response.ok) {
        throw new Error('Erro ao atualizar valores')
      }

      setOpen(false)
      router.refresh()
    } catch (error) {
      console.error('Erro:', error)
      alert('Erro ao atualizar valores. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setItems(initialItems)
    setDiscount(currentDiscount)
    setOpen(false)
  }

  const newTotal = calculateNewTotal()
  const hasChanges =
    JSON.stringify(items) !== JSON.stringify(initialItems) || discount !== currentDiscount

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Pencil className="h-4 w-4" />
          Editar Valores
        </Button>
      </DialogTrigger>

      <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Valores do Orçamento</DialogTitle>
          <DialogDescription>Ajuste quantidades, preços unitários e desconto</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Items */}
          <div className="space-y-4">
            <Label>Itens</Label>
            {items.map((item, index) => (
              <div
                key={item.id}
                className="bg-theme-elevated border-theme-default space-y-3 rounded-lg border p-4"
              >
                <div className="text-theme-primary text-sm font-medium">
                  {index + 1}. {item.description}
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <Label className="text-xs">Quantidade</Label>
                    <Input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => updateItem(item.id, 'quantity', Number(e.target.value))}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label className="text-xs">Preço Unit. (R$)</Label>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.unitPrice}
                      onChange={(e) => updateItem(item.id, 'unitPrice', Number(e.target.value))}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label className="text-xs">Subtotal</Label>
                    <div className="bg-theme-primary border-theme-default mt-1 rounded-md border px-3 py-2 text-sm font-semibold text-accent-500">
                      {new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                      }).format(item.subtotal)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Discount */}
          <div className="space-y-2">
            <Label>Desconto (%)</Label>
            <Input
              type="number"
              min="0"
              max="100"
              step="0.01"
              value={discount}
              onChange={(e) => setDiscount(Number(e.target.value))}
            />
          </div>

          {/* Totals Comparison */}
          <div className="bg-theme-elevated border-accent-500/30 space-y-2 rounded-lg border p-4">
            <div className="flex justify-between text-sm">
              <span className="text-theme-secondary">Subtotal:</span>
              <span className="text-theme-primary font-medium">
                {new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                }).format(items.reduce((sum, item) => sum + item.subtotal, 0))}
              </span>
            </div>

            {discount > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-theme-secondary">Desconto ({discount}%):</span>
                <span className="font-medium text-error">
                  -
                  {new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  }).format(items.reduce((sum, item) => sum + item.subtotal, 0) * (discount / 100))}
                </span>
              </div>
            )}

            <div className="border-theme-default flex items-center justify-between border-t pt-2">
              <span className="text-theme-primary text-lg font-semibold">Novo Total:</span>
              <div className="text-right">
                <div className="text-2xl font-bold text-accent-500">
                  {new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  }).format(newTotal)}
                </div>
                {hasChanges && (
                  <div className="text-theme-secondary text-xs">
                    Anterior:{' '}
                    {new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    }).format(currentTotal)}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={handleCancel} disabled={loading}>
            <X className="mr-2 h-4 w-4" />
            Cancelar
          </Button>
          <Button type="button" onClick={handleSave} disabled={loading || !hasChanges}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Salvando...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Salvar Alterações
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
