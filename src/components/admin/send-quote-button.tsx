'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Send, Loader2, Package, DollarSign, Mail, User } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog'
import { formatCurrency } from '@/lib/utils'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface QuoteItem {
  description: string
  quantity: number
  unitPrice: number
  totalPrice: number
}

interface QuoteDetails {
  items: QuoteItem[]
  subtotal: number
  discount: number
  shippingFee: number
  laborFee: number
  materialFee: number
  total: number
}

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
  const [quoteDetails, setQuoteDetails] = useState<QuoteDetails | null>(null)
  const [loading, setLoading] = useState(false)

  const loadQuoteDetails = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/quotes/${quoteId}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao carregar orçamento')
      }

      setQuoteDetails({
        items: data.items || [],
        subtotal: data.subtotal || 0,
        discount: data.discount || 0,
        shippingFee: data.shippingFee || 0,
        laborFee: data.laborFee || 0,
        materialFee: data.materialFee || 0,
        total: data.total || 0,
      })
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao carregar orçamento'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  // Carregar detalhes do orçamento quando o dialog abrir
  useEffect(() => {
    if (open && !quoteDetails) {
      loadQuoteDetails()
    }
  }, [open, quoteDetails])

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

  // Verificar se orçamento pode ser enviado
  const canSend = ['DRAFT', 'SENT', 'VIEWED'].includes(status)

  if (!canSend) {
    return null
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={variant} size={size}>
          <Send className="mr-2 h-4 w-4" />
          {status === 'DRAFT' ? 'Enviar' : 'Reenviar'}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>
            {status === 'DRAFT' ? 'Enviar orçamento?' : 'Reenviar orçamento?'}
          </DialogTitle>
          <DialogDescription>
            Revise os detalhes antes de enviar para <strong>{customerName}</strong>
          </DialogDescription>
        </DialogHeader>

        {error && (
          <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-400">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-accent-500" />
          </div>
        ) : quoteDetails ? (
          <Tabs defaultValue="preview" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="preview">Prévia</TabsTrigger>
              <TabsTrigger value="info">Informações</TabsTrigger>
            </TabsList>

            <TabsContent value="preview" className="space-y-4">
              {/* Quote Header */}
              <div className="rounded-lg border border-neutral-400 bg-neutral-200 p-4">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-white">Orçamento #{quoteNumber}</h3>
                  <div className="flex items-center gap-2 text-sm text-neutral-700">
                    <User className="h-4 w-4" />
                    {customerName}
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-neutral-700">
                  <Mail className="h-4 w-4" />
                  {customerEmail}
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-2">
                <h4 className="flex items-center gap-2 text-sm font-medium text-neutral-700">
                  <Package className="h-4 w-4" />
                  Itens ({quoteDetails.items.length})
                </h4>
                <div className="max-h-[300px] space-y-2 overflow-y-auto">
                  {quoteDetails.items.map((item, index) => (
                    <div
                      key={index}
                      className="rounded-lg border border-neutral-400 bg-neutral-200 p-3"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="font-medium text-white">{item.description}</p>
                          <p className="text-sm text-neutral-700">
                            Quantidade: {item.quantity} × {formatCurrency(item.unitPrice)}
                          </p>
                        </div>
                        <p className="font-semibold text-accent-500">
                          {formatCurrency(item.totalPrice)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Totals */}
              <div className="space-y-2 rounded-lg border border-neutral-400 bg-neutral-200 p-4">
                <div className="flex items-center justify-between text-sm text-neutral-700">
                  <span>Subtotal</span>
                  <span>{formatCurrency(quoteDetails.subtotal)}</span>
                </div>
                {quoteDetails.discount > 0 && (
                  <div className="flex items-center justify-between text-sm text-green-400">
                    <span>Desconto</span>
                    <span>-{formatCurrency(quoteDetails.discount)}</span>
                  </div>
                )}
                {quoteDetails.shippingFee > 0 && (
                  <div className="flex items-center justify-between text-sm text-neutral-700">
                    <span>Frete</span>
                    <span>{formatCurrency(quoteDetails.shippingFee)}</span>
                  </div>
                )}
                {quoteDetails.laborFee > 0 && (
                  <div className="flex items-center justify-between text-sm text-neutral-700">
                    <span>Mão de obra</span>
                    <span>{formatCurrency(quoteDetails.laborFee)}</span>
                  </div>
                )}
                {quoteDetails.materialFee > 0 && (
                  <div className="flex items-center justify-between text-sm text-neutral-700">
                    <span>Material</span>
                    <span>{formatCurrency(quoteDetails.materialFee)}</span>
                  </div>
                )}
                <div className="border-t border-neutral-400 pt-2">
                  <div className="flex items-center justify-between">
                    <span className="text-base font-semibold text-white">Total</span>
                    <span className="text-lg font-bold text-accent-500">
                      {formatCurrency(quoteDetails.total)}
                    </span>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="info" className="space-y-4">
              <div className="rounded-lg border border-neutral-400 bg-neutral-200 p-4">
                <p className="mb-3 text-sm font-medium text-white">O cliente receberá:</p>
                <ul className="space-y-2 text-sm text-neutral-700">
                  <li className="flex items-start gap-2">
                    <Mail className="mt-0.5 h-4 w-4 flex-shrink-0 text-accent-500" />
                    Email com detalhes completos do orçamento
                  </li>
                  <li className="flex items-start gap-2">
                    <Package className="mt-0.5 h-4 w-4 flex-shrink-0 text-accent-500" />
                    Lista de todos os itens com especificações
                  </li>
                  <li className="flex items-start gap-2">
                    <DollarSign className="mt-0.5 h-4 w-4 flex-shrink-0 text-accent-500" />
                    Valores detalhados e total do orçamento
                  </li>
                  <li className="flex items-start gap-2">
                    <Send className="mt-0.5 h-4 w-4 flex-shrink-0 text-accent-500" />
                    Link para visualizar no portal do cliente
                  </li>
                  <li className="flex items-start gap-2">
                    <Send className="mt-0.5 h-4 w-4 flex-shrink-0 text-accent-500" />
                    Opções para aceitar ou recusar o orçamento
                  </li>
                </ul>
              </div>

              <div className="rounded-lg border border-neutral-600 bg-neutral-700 p-4">
                <p className="mb-2 text-sm font-medium text-neutral-300">Importante:</p>
                <ul className="space-y-1 text-sm text-neutral-400">
                  <li>• O orçamento tem validade limitada</li>
                  <li>• O cliente poderá visualizar e responder pelo portal</li>
                  <li>• Você receberá notificação quando visualizado ou respondido</li>
                </ul>
              </div>
            </TabsContent>
          </Tabs>
        ) : null}

        <DialogFooter>
          <Button
            type="button"
            variant="ghost"
            onClick={() => setOpen(false)}
            disabled={sending || loading}
          >
            Cancelar
          </Button>
          <Button type="button" onClick={handleSend} disabled={sending || loading || !quoteDetails}>
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
