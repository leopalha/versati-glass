'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ArrowRight, Loader2 } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog'
import { Checkbox } from '@/components/ui/checkbox'

interface ConvertQuoteButtonProps {
  quoteId: string
  quoteNumber: string
  customerName: string
  status: string
  variant?: 'default' | 'outline' | 'ghost'
  size?: 'default' | 'sm' | 'lg' | 'icon'
}

export function ConvertQuoteButton({
  quoteId,
  quoteNumber,
  customerName,
  status,
  variant = 'default',
  size = 'sm',
}: ConvertQuoteButtonProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [converting, setConverting] = useState(false)
  const [notifyCustomer, setNotifyCustomer] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Verificar se orçamento pode ser convertido
  const canConvert = !['CONVERTED', 'REJECTED'].includes(status)

  if (!canConvert) {
    return null
  }

  const handleConvert = async () => {
    setConverting(true)
    setError(null)

    try {
      const response = await fetch(`/api/quotes/${quoteId}/convert`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          notifyCustomer,
          paymentMethod: 'PIX',
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao converter orçamento')
      }

      // Sucesso - redirecionar para página do pedido
      router.push(`/admin/pedidos/${data.order.id}`)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao converter orçamento'
      setError(message)
      setConverting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={variant} size={size}>
          <ArrowRight className="mr-2 h-4 w-4" />
          Converter em Pedido
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Converter orçamento em pedido?</DialogTitle>
          <DialogDescription>
            O orçamento <strong>#{quoteNumber}</strong> de <strong>{customerName}</strong> será
            convertido em um pedido.
          </DialogDescription>
        </DialogHeader>

        {error && (
          <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-400">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div className="rounded-lg border border-neutral-400 bg-neutral-200 p-4">
            <p className="mb-2 text-sm font-medium text-white">Ao converter, será criado:</p>
            <ul className="space-y-1 text-sm text-neutral-700">
              <li>• Pedido com status &quot;Aguardando Pagamento&quot;</li>
              <li>• Todos os itens do orçamento serão copiados</li>
              <li>• Orçamento será marcado como &quot;Convertido&quot;</li>
              <li>• Timeline do pedido será iniciada</li>
            </ul>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="notify"
              checked={notifyCustomer}
              onCheckedChange={(checked) => setNotifyCustomer(checked === true)}
            />
            <label htmlFor="notify" className="cursor-pointer text-sm text-neutral-700">
              Notificar cliente por email sobre o novo pedido
            </label>
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="ghost"
            onClick={() => setOpen(false)}
            disabled={converting}
          >
            Cancelar
          </Button>
          <Button type="button" onClick={handleConvert} disabled={converting}>
            {converting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Convertendo...
              </>
            ) : (
              <>
                <ArrowRight className="mr-2 h-4 w-4" />
                Converter em Pedido
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
