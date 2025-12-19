'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Send } from 'lucide-react'
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
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { logger } from '@/lib/logger'

interface Supplier {
  id: string
  name: string
  email: string
  isPreferred: boolean
  categories: string[]
  averageDeliveryDays?: number
}

interface SendToSuppliersDialogProps {
  quoteId: string
  quoteNumber: string
  suppliers: Supplier[]
}

export function SendToSuppliersDialog({
  quoteId,
  quoteNumber,
  suppliers,
}: SendToSuppliersDialogProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [selectedSuppliers, setSelectedSuppliers] = useState<string[]>([])

  const toggleSupplier = (supplierId: string) => {
    setSelectedSuppliers((prev) =>
      prev.includes(supplierId) ? prev.filter((id) => id !== supplierId) : [...prev, supplierId]
    )
  }

  const selectPreferred = () => {
    const preferredIds = suppliers.filter((s) => s.isPreferred).map((s) => s.id)
    setSelectedSuppliers(preferredIds)
  }

  const selectAll = () => {
    setSelectedSuppliers(suppliers.map((s) => s.id))
  }

  const clearSelection = () => {
    setSelectedSuppliers([])
  }

  async function handleSend() {
    if (selectedSuppliers.length === 0) {
      toast.error('Selecione pelo menos um fornecedor')
      return
    }

    setLoading(true)

    try {
      const response = await fetch(`/api/quotes/${quoteId}/send-to-suppliers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          supplierIds: selectedSuppliers,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Erro ao enviar cotação')
      }

      const successCount = result.results.filter((r: { success: boolean }) => r.success).length
      const totalCount = result.results.length

      if (successCount === totalCount) {
        toast.success(`Cotação enviada para ${successCount} fornecedores!`)
      } else {
        toast.warning(`Enviado para ${successCount} de ${totalCount} fornecedores`)
      }

      setOpen(false)
      setSelectedSuppliers([])
      router.refresh()
    } catch (error) {
      logger.error('Erro ao enviar cotação:', error)
      toast.error(error instanceof Error ? error.message : 'Erro ao enviar')
    } finally {
      setLoading(false)
    }
  }

  if (suppliers.length === 0) {
    return (
      <Button variant="outline" disabled>
        Nenhum fornecedor disponível
      </Button>
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Send className="mr-2 h-4 w-4" />
          Enviar para Fornecedores
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Enviar Cotação para Fornecedores</DialogTitle>
          <DialogDescription>
            Selecione os fornecedores que devem receber a solicitação de cotação{' '}
            <strong>{quoteNumber}</strong>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Quick Actions */}
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={selectPreferred}>
              Preferenciais ({suppliers.filter((s) => s.isPreferred).length})
            </Button>
            <Button variant="outline" size="sm" onClick={selectAll}>
              Todos ({suppliers.length})
            </Button>
            <Button variant="outline" size="sm" onClick={clearSelection}>
              Limpar
            </Button>
          </div>

          {/* Supplier List */}
          <div className="space-y-2">
            <Label>Fornecedores ({selectedSuppliers.length} selecionados)</Label>
            <div className="max-h-96 divide-y overflow-y-auto rounded-lg border">
              {suppliers.map((supplier) => {
                const isSelected = selectedSuppliers.includes(supplier.id)

                return (
                  <div
                    key={supplier.id}
                    className="hover:bg-muted/50 flex cursor-pointer items-start gap-3 p-4"
                    onClick={() => toggleSupplier(supplier.id)}
                  >
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={() => toggleSupplier(supplier.id)}
                      className="mt-1"
                    />
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{supplier.name}</span>
                        {supplier.isPreferred && (
                          <Badge variant="secondary" className="text-xs">
                            Preferencial
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{supplier.email}</p>
                      <div className="flex flex-wrap items-center gap-2">
                        {supplier.categories.slice(0, 3).map((cat) => (
                          <Badge key={cat} variant="outline" className="text-xs">
                            {cat}
                          </Badge>
                        ))}
                        {supplier.averageDeliveryDays && (
                          <span className="text-xs text-muted-foreground">
                            ~{supplier.averageDeliveryDays} dias
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {selectedSuppliers.length > 0 && (
            <div className="space-y-2 rounded-lg bg-muted p-4">
              <p className="text-sm font-medium">
                📧 Será enviado email para {selectedSuppliers.length} fornecedor
                {selectedSuppliers.length > 1 ? 'es' : ''}:
              </p>
              <ul className="space-y-1 text-sm text-muted-foreground">
                {suppliers
                  .filter((s) => selectedSuppliers.includes(s.id))
                  .map((s) => (
                    <li key={s.id}>• {s.name}</li>
                  ))}
              </ul>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={loading}>
            Cancelar
          </Button>
          <Button onClick={handleSend} disabled={loading || selectedSuppliers.length === 0}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Enviar Cotação
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
