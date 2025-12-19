'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ArrowRight, Loader2, Package, DollarSign, User, CheckCircle } from 'lucide-react'
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
  const [quoteDetails, setQuoteDetails] = useState<QuoteDetails | null>(null)
  const [loading, setLoading] = useState(false)

  // Verificar se orçamento pode ser convertido
  const canConvert = !['CONVERTED', 'REJECTED'].includes(status)

  // Carregar detalhes do orçamento quando o dialog abrir
  useEffect(() => {
    if (open && !quoteDetails && canConvert) {
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

      loadQuoteDetails()
    }
  }, [open, quoteDetails, canConvert, quoteId])

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
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Converter orçamento em pedido?</DialogTitle>
          <DialogDescription>
            Revise os detalhes antes de converter o orçamento de <strong>{customerName}</strong>
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
              <TabsTrigger value="preview">Prévia do Pedido</TabsTrigger>
              <TabsTrigger value="info">O que será criado</TabsTrigger>
            </TabsList>

            <TabsContent value="preview" className="space-y-4">
              {/* Order Header */}
              <div className="border-accent-500/30 bg-accent-500/10 rounded-lg border p-4">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-white">
                    Pedido de Orçamento #{quoteNumber}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-neutral-700">
                    <User className="h-4 w-4" />
                    {customerName}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-accent-500" />
                  <span className="text-sm font-medium text-accent-500">
                    Status: Aguardando Pagamento
                  </span>
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-2">
                <h4 className="flex items-center gap-2 text-sm font-medium text-neutral-700">
                  <Package className="h-4 w-4" />
                  Itens do Pedido ({quoteDetails.items.length})
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
                    <span className="text-base font-semibold text-white">Valor Total</span>
                    <span className="text-lg font-bold text-accent-500">
                      {formatCurrency(quoteDetails.total)}
                    </span>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="info" className="space-y-4">
              <div className="border-accent-500/30 bg-accent-500/10 rounded-lg border p-4">
                <p className="mb-3 text-sm font-medium text-white">Ao converter, será criado:</p>
                <ul className="space-y-2 text-sm text-neutral-700">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-accent-500" />
                    Pedido com status &quot;Aguardando Pagamento&quot;
                  </li>
                  <li className="flex items-start gap-2">
                    <Package className="mt-0.5 h-4 w-4 flex-shrink-0 text-accent-500" />
                    Todos os {quoteDetails.items.length} itens do orçamento serão copiados
                  </li>
                  <li className="flex items-start gap-2">
                    <ArrowRight className="mt-0.5 h-4 w-4 flex-shrink-0 text-accent-500" />
                    Orçamento será marcado como &quot;Convertido&quot;
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-accent-500" />
                    Timeline do pedido será iniciada automaticamente
                  </li>
                  <li className="flex items-start gap-2">
                    <DollarSign className="mt-0.5 h-4 w-4 flex-shrink-0 text-accent-500" />
                    Valor total: {formatCurrency(quoteDetails.total)}
                  </li>
                </ul>
              </div>

              <div className="rounded-lg border border-neutral-400 bg-neutral-200 p-4">
                <p className="mb-2 text-sm font-medium text-white">Próximos passos:</p>
                <ol className="space-y-1.5 text-sm text-neutral-700">
                  <li>1. Pedido será criado com status &quot;Aguardando Pagamento&quot;</li>
                  <li>2. Cliente receberá email de confirmação (se marcado abaixo)</li>
                  <li>3. Você poderá acompanhar o pedido na aba de Pedidos</li>
                  <li>4. Timeline permitirá registrar etapas de produção</li>
                </ol>
              </div>

              <div className="flex items-center space-x-2 rounded-lg border border-neutral-600 bg-neutral-700 p-4">
                <Checkbox
                  id="notify"
                  checked={notifyCustomer}
                  onCheckedChange={(checked) => setNotifyCustomer(checked === true)}
                />
                <label htmlFor="notify" className="cursor-pointer text-sm text-neutral-300">
                  Notificar <strong>{customerName}</strong> por email sobre o novo pedido
                </label>
              </div>
            </TabsContent>
          </Tabs>
        ) : null}

        <DialogFooter>
          <Button
            type="button"
            variant="ghost"
            onClick={() => setOpen(false)}
            disabled={converting || loading}
          >
            Cancelar
          </Button>
          <Button
            type="button"
            onClick={handleConvert}
            disabled={converting || loading || !quoteDetails}
          >
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
