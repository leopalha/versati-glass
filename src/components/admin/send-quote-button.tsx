'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Send, Loader2 } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog'

interface SendQuoteButtonProps {
  quoteId: string
  quoteNumber: string
  customerName: string
  customerEmail: string
  status: string
  variant?: 'default' | 'outline' | 'ghost'
  size?: 'default' | 'sm' | 'lg' | 'icon'
}

export function SendQuoteButton({
  quoteId,
  quoteNumber,
  customerName,
  customerEmail,
  status,
  variant = 'outline',
  size = 'sm',
}: SendQuoteButtonProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Verificar se orçamento pode ser enviado
  const canSend = ['DRAFT', 'SENT', 'VIEWED'].includes(status)

  if (!canSend) {
    return null
  }

  const handleSend = async () => {
    setSending(true)
    setError(null)

    try {
      const response = await fetch(`/api/quotes/${quoteId}/send`, {
        method: 'POST',
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao enviar orçamento')
      }

      // Sucesso - fechar dialog e atualizar página
      setOpen(false)
      router.refresh()
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao enviar orçamento'
      setError(message)
    } finally {
      setSending(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={variant} size={size}>
          <Send className="mr-2 h-4 w-4" />
          {status === 'DRAFT' ? 'Enviar' : 'Reenviar'}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {status === 'DRAFT' ? 'Enviar orçamento?' : 'Reenviar orçamento?'}
          </DialogTitle>
          <DialogDescription>
            O orçamento <strong>#{quoteNumber}</strong> será enviado para{' '}
            <strong>{customerName}</strong> no email{' '}
            <strong className="text-gold-500">{customerEmail}</strong>.
          </DialogDescription>
        </DialogHeader>

        {error && (
          <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-400">
            {error}
          </div>
        )}

        <div className="rounded-lg border border-neutral-400 bg-neutral-200 p-4">
          <p className="mb-2 text-sm font-medium text-white">O cliente receberá:</p>
          <ul className="space-y-1 text-sm text-neutral-700">
            <li>• Email com detalhes do orçamento</li>
            <li>• Link para visualizar no portal</li>
            <li>• Opção de aceitar ou recusar</li>
            <li>• Prazo de validade do orçamento</li>
          </ul>
        </div>

        <DialogFooter>
          <Button type="button" variant="ghost" onClick={() => setOpen(false)} disabled={sending}>
            Cancelar
          </Button>
          <Button type="button" onClick={handleSend} disabled={sending}>
            {sending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Enviando...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Enviar Orçamento
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
