'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { XCircle, Loader2 } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog'

interface CancelQuoteButtonProps {
  quoteId: string
  quoteNumber: string
  customerName: string
  status: string
  variant?: 'default' | 'outline' | 'ghost' | 'danger'
  size?: 'default' | 'sm' | 'lg' | 'icon'
}

export function CancelQuoteButton({
  quoteId,
  quoteNumber,
  customerName,
  status,
  variant = 'ghost',
  size = 'sm',
}: CancelQuoteButtonProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [canceling, setCanceling] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Can only cancel quotes that haven't been accepted/converted/already cancelled
  const canCancel = !['ACCEPTED', 'CONVERTED', 'CANCELLED', 'REJECTED'].includes(status)

  if (!canCancel) {
    return null
  }

  const handleCancel = async () => {
    setCanceling(true)
    setError(null)

    try {
      const response = await fetch(`/api/quotes/${quoteId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: 'CANCELLED',
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao cancelar orcamento')
      }

      setOpen(false)
      router.refresh()
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao cancelar orcamento'
      setError(message)
      setCanceling(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant={variant}
          size={size}
          className="text-red-400 hover:bg-red-500/10 hover:text-red-300"
        >
          <XCircle className="mr-2 h-4 w-4" />
          Cancelar
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle className="text-red-400">Cancelar orcamento?</DialogTitle>
          <DialogDescription>
            O orcamento <strong>#{quoteNumber}</strong> de <strong>{customerName}</strong> sera
            cancelado permanentemente.
          </DialogDescription>
        </DialogHeader>

        {error && (
          <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-400">
            {error}
          </div>
        )}

        <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-4">
          <p className="mb-2 text-sm font-medium text-red-400">Atencao:</p>
          <ul className="space-y-1 text-sm text-red-300">
            <li>Esta acao nao pode ser desfeita</li>
            <li>O cliente nao sera notificado</li>
            <li>O orcamento ficara com status &quot;Cancelado&quot;</li>
          </ul>
        </div>

        <DialogFooter>
          <Button type="button" variant="ghost" onClick={() => setOpen(false)} disabled={canceling}>
            Voltar
          </Button>
          <Button type="button" variant="danger" onClick={handleCancel} disabled={canceling}>
            {canceling ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Cancelando...
              </>
            ) : (
              <>
                <XCircle className="mr-2 h-4 w-4" />
                Confirmar Cancelamento
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
