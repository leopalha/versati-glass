'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { PortalHeader } from '@/components/portal/portal-header'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/toast/use-toast'
import { formatCurrency } from '@/lib/utils'
import {
  FileText,
  MapPin,
  Calendar,
  ArrowLeft,
  CheckCircle,
  XCircle,
  Loader2,
  Package,
  AlertCircle,
} from 'lucide-react'
import Link from 'next/link'

interface QuoteItem {
  id: string
  description: string
  specifications?: string
  width?: number
  height?: number
  quantity: number
  color?: string
  finish?: string
  thickness?: string
  unitPrice: number
  totalPrice: number
}

interface Quote {
  id: string
  number: string
  status: string
  customerName: string
  serviceStreet: string
  serviceNumber: string
  serviceComplement?: string
  serviceNeighborhood: string
  serviceCity: string
  serviceState: string
  serviceZipCode: string
  subtotal: number
  discount: number
  total: number
  validUntil: string
  createdAt: string
  customerNotes?: string
  items: QuoteItem[]
}

export default function OrcamentoDetalhePage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [quote, setQuote] = useState<Quote | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isAccepting, setIsAccepting] = useState(false)
  const [isRejecting, setIsRejecting] = useState(false)

  useEffect(() => {
    async function fetchQuote() {
      try {
        const res = await fetch(`/api/quotes/${params.id}`)
        if (!res.ok) throw new Error('Failed to fetch quote')
        const data = await res.json()
        setQuote(data.quote || data)
      } catch {
        toast({
          variant: 'error',
          title: 'Erro',
          description: 'Nao foi possivel carregar o orcamento',
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchQuote()
  }, [params.id, toast])

  const handleAccept = async () => {
    setIsAccepting(true)
    try {
      const res = await fetch(`/api/quotes/${params.id}/accept`, {
        method: 'POST',
      })

      if (!res.ok) throw new Error('Failed to accept quote')

      const data = await res.json()

      toast({
        variant: 'success',
        title: 'Orcamento Aceito!',
        description: 'Seu pedido foi criado com sucesso',
      })

      // Redirect to order
      router.push(`/portal/pedidos/${data.orderId}`)
    } catch {
      toast({
        variant: 'error',
        title: 'Erro',
        description: 'Nao foi possivel aceitar o orcamento',
      })
    } finally {
      setIsAccepting(false)
    }
  }

  const handleReject = async () => {
    setIsRejecting(true)
    try {
      const res = await fetch(`/api/quotes/${params.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'REJECTED' }),
      })

      if (!res.ok) throw new Error('Failed to reject quote')

      toast({
        title: 'Orcamento Recusado',
        description: 'O orcamento foi marcado como recusado',
      })

      router.push('/portal/orcamentos')
    } catch {
      toast({
        variant: 'error',
        title: 'Erro',
        description: 'Nao foi possivel recusar o orcamento',
      })
    } finally {
      setIsRejecting(false)
    }
  }

  if (isLoading) {
    return (
      <div>
        <PortalHeader title="Carregando..." />
        <div className="flex items-center justify-center p-12">
          <Loader2 className="h-8 w-8 animate-spin text-gold-500" />
        </div>
      </div>
    )
  }

  if (!quote) {
    return (
      <div>
        <PortalHeader title="Orcamento nao encontrado" />
        <div className="p-6">
          <Card className="flex flex-col items-center justify-center p-12 text-center">
            <FileText className="mb-4 h-16 w-16 text-neutral-600" />
            <h3 className="mb-2 font-display text-xl font-semibold text-white">
              Orcamento nao encontrado
            </h3>
            <Link href="/portal/orcamentos" className="mt-4 text-gold-500 hover:text-gold-400">
              Voltar para orcamentos
            </Link>
          </Card>
        </div>
      </div>
    )
  }

  const isExpired = new Date(quote.validUntil) < new Date()
  const canAccept = ['SENT', 'VIEWED'].includes(quote.status) && !isExpired

  return (
    <div>
      <PortalHeader
        title={`Orcamento #${quote.number}`}
        subtitle={`Criado em ${new Date(quote.createdAt).toLocaleDateString('pt-BR')}`}
      />

      <div className="p-6">
        {/* Back button */}
        <Link
          href="/portal/orcamentos"
          className="mb-6 inline-flex items-center gap-2 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar para orcamentos
        </Link>

        {/* Expiration warning */}
        {isExpired && quote.status !== 'ACCEPTED' && quote.status !== 'CONVERTED' && (
          <div className="mb-6 rounded-lg bg-red-500/10 p-4">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-red-400" />
              <div>
                <p className="font-medium text-red-400">Orcamento Expirado</p>
                <p className="text-sm text-neutral-700">
                  Este orcamento expirou em {new Date(quote.validUntil).toLocaleDateString('pt-BR')}
                  . Solicite um novo orcamento.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main content */}
          <div className="space-y-6 lg:col-span-2">
            {/* Items */}
            <Card className="p-6">
              <h2 className="mb-4 font-display text-lg font-semibold">Itens do Orcamento</h2>

              <div className="space-y-4">
                {quote.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-start justify-between rounded-lg border p-4"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
                        <Package className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="font-medium">{item.description}</p>
                        {item.specifications && (
                          <p className="text-sm text-muted-foreground">{item.specifications}</p>
                        )}
                        <div className="mt-1 flex flex-wrap gap-2">
                          {item.width && item.height && (
                            <span className="rounded bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                              {item.width}m x {item.height}m
                            </span>
                          )}
                          {item.color && (
                            <span className="rounded bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                              {item.color}
                            </span>
                          )}
                          {item.finish && (
                            <span className="rounded bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                              {item.finish}
                            </span>
                          )}
                          {item.thickness && (
                            <span className="rounded bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                              {item.thickness}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{formatCurrency(Number(item.totalPrice))}</p>
                      <p className="text-sm text-muted-foreground">
                        {item.quantity}x {formatCurrency(Number(item.unitPrice))}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Notes */}
            {quote.customerNotes && (
              <Card className="p-6">
                <h2 className="mb-4 font-display text-lg font-semibold">Observacoes</h2>
                <p className="text-muted-foreground">{quote.customerNotes}</p>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Summary */}
            <Card className="p-6">
              <h2 className="mb-4 font-display text-lg font-semibold">Resumo</h2>

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatCurrency(Number(quote.subtotal))}</span>
                </div>
                {Number(quote.discount) > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Desconto</span>
                    <span className="text-green-600">
                      -{formatCurrency(Number(quote.discount))}
                    </span>
                  </div>
                )}
                <div className="border-t pt-3">
                  <div className="flex justify-between">
                    <span className="font-medium">Total</span>
                    <span className="text-primary font-display text-xl font-bold">
                      {formatCurrency(Number(quote.total))}
                    </span>
                  </div>
                </div>
              </div>

              {/* Validity */}
              <div className="mt-4 flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className={isExpired ? 'text-destructive' : 'text-muted-foreground'}>
                  Valido ate {new Date(quote.validUntil).toLocaleDateString('pt-BR')}
                </span>
              </div>

              {/* Actions */}
              {canAccept && (
                <div className="mt-6 space-y-3">
                  <Button
                    onClick={handleAccept}
                    disabled={isAccepting || isRejecting}
                    className="w-full"
                  >
                    {isAccepting ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <CheckCircle className="mr-2 h-4 w-4" />
                    )}
                    Aceitar Orcamento
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleReject}
                    disabled={isAccepting || isRejecting}
                    className="w-full text-red-400 hover:bg-red-500/10 hover:text-red-400"
                  >
                    {isRejecting ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <XCircle className="mr-2 h-4 w-4" />
                    )}
                    Recusar Orcamento
                  </Button>
                </div>
              )}
            </Card>

            {/* Address */}
            <Card className="p-6">
              <div className="mb-4 flex items-center gap-2">
                <MapPin className="text-primary h-5 w-5" />
                <h2 className="font-display text-lg font-semibold">Endereco de Instalacao</h2>
              </div>

              <p className="text-muted-foreground">
                {quote.serviceStreet}, {quote.serviceNumber}
                {quote.serviceComplement && ` - ${quote.serviceComplement}`}
                <br />
                {quote.serviceNeighborhood}
                <br />
                {quote.serviceCity} - {quote.serviceState}
                <br />
                CEP: {quote.serviceZipCode}
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
