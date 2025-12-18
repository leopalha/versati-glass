'use client'

import { useState, useMemo, useCallback } from 'react'
import { useQuoteStore } from '@/store/quote-store'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/toast/use-toast'
import { formatCurrency } from '@/lib/utils'
import {
  ArrowLeft,
  Check,
  Loader2,
  MapPin,
  Package,
  Phone,
  Mail,
  Edit2,
  ShoppingCart,
} from 'lucide-react'

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

// ARCH-P1-4: Move base prices outside component to avoid recreating
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

export function StepFinalSummary() {
  const { items, customerData, prevStep, nextStep, setStep } = useQuoteStore()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  // ARCH-P1-4: Memoize calculation function
  const calculateItemEstimate = useCallback((item: (typeof items)[0]) => {
    if (!item.width || !item.height) return 0
    const area = item.width * item.height
    const basePrice = basePrices[item.category] || 500
    return (basePrice + area * 300) * item.quantity
  }, [])

  // ARCH-P1-4: Memoize total to avoid recalculation
  const totalEstimate = useMemo(
    () => items.reduce((acc, item) => acc + calculateItemEstimate(item), 0),
    [items, calculateItemEstimate]
  )

  // ARCH-P1-4: Memoize handlers
  const handleEditItems = useCallback(() => {
    setStep(4) // Volta para o carrinho
  }, [setStep])

  const handleEditCustomer = useCallback(() => {
    prevStep() // Volta para dados do cliente
  }, [prevStep])

  const handleSubmit = async () => {
    if (!customerData) {
      toast({
        variant: 'error',
        title: 'Dados incompletos',
        description: 'Por favor, preencha seus dados de contato',
      })
      return
    }

    if (items.length === 0) {
      toast({
        variant: 'error',
        title: 'Carrinho vazio',
        description: 'Adicione pelo menos um item ao orcamento',
      })
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/quotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: customerData.name,
          customerEmail: customerData.email,
          customerPhone: customerData.phone,
          serviceStreet: customerData.street,
          serviceNumber: customerData.number,
          serviceComplement: customerData.complement,
          serviceNeighborhood: customerData.neighborhood,
          serviceCity: customerData.city,
          serviceState: customerData.state,
          serviceZipCode: customerData.zipCode,
          items: items.map((item) => {
            const estimate = calculateItemEstimate(item)
            const baseItem: any = {
              description:
                item.description || `${item.productName} - ${item.width}m x ${item.height}m`,
              specifications: `${item.width}m x ${item.height}m${item.color ? ` - ${item.color}` : ''}${item.thickness ? ` - ${item.thickness}` : ''}`,
              width: item.width,
              height: item.height,
              quantity: item.quantity,
              unitPrice: estimate / item.quantity,
              totalPrice: estimate,
              customerImages: item.images || [],
            }

            // Only include productId if it's not a custom product
            if (item.productId && !item.productId.startsWith('custom-')) {
              baseItem.productId = item.productId
            }

            // Only include optional fields if they have values
            if (item.color) baseItem.color = item.color
            if (item.finish) baseItem.finish = item.finish
            if (item.thickness) baseItem.thickness = item.thickness
            if (item.glassType) baseItem.glassType = item.glassType
            if (item.glassColor) baseItem.glassColor = item.glassColor
            if (item.model) baseItem.model = item.model

            return baseItem
          }),
          source: 'WEBSITE',
        }),
      })

      if (!response.ok) {
        // Tentar ler resposta de erro, mas pode estar vazia
        let errorMessage = 'Erro ao enviar orcamento'
        try {
          const error = await response.json()
          errorMessage = error.error || error.message || errorMessage
        } catch {
          // Resposta não é JSON válido
          errorMessage = `Erro ${response.status}: ${response.statusText}`
        }
        throw new Error(errorMessage)
      }

      // Verificar se há conteúdo na resposta antes de fazer .json()
      const contentType = response.headers.get('content-type')
      let result = { number: 'ORC-TEMP', id: '' }

      if (contentType?.includes('application/json')) {
        const text = await response.text()
        if (text && text.trim().length > 0) {
          result = JSON.parse(text)
        }
      }

      toast({
        variant: 'success',
        title: 'Orcamento enviado!',
        description: `Numero: ${result.number}`,
      })

      // Go to scheduling step
      nextStep()
    } catch (error) {
      console.error('[QUOTE SUBMIT ERROR]', error)
      toast({
        variant: 'error',
        title: 'Erro',
        description: error instanceof Error ? error.message : 'Erro ao enviar orcamento',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-8 text-center">
        <h2 className="text-theme-primary font-display text-3xl font-bold">Resumo do orcamento</h2>
        <p className="text-theme-muted mt-2">Revise as informacoes antes de enviar</p>
      </div>

      <div className="space-y-6">
        {/* Items Summary */}
        <Card className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5 text-accent-400" />
              <h3 className="text-theme-primary font-display text-lg font-semibold">
                Itens do orcamento ({items.length})
              </h3>
            </div>
            <Button variant="ghost" size="sm" onClick={handleEditItems}>
              <Edit2 className="mr-1 h-4 w-4" />
              Editar
            </Button>
          </div>

          <div className="space-y-3">
            {items.map((item, index) => {
              const estimate = calculateItemEstimate(item)

              return (
                <div
                  key={item.id}
                  className="border-theme-default flex items-start justify-between border-b pb-3 last:border-0 last:pb-0"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-theme-subtle text-xs font-medium">{index + 1}.</span>
                      <span className="text-theme-primary font-medium">{item.productName}</span>
                      <span className="text-theme-muted text-xs">x{item.quantity}</span>
                    </div>
                    <div className="text-theme-muted mt-1 text-sm">
                      <span className="text-theme-subtle text-xs">
                        {categoryNames[item.category] || item.category}
                      </span>
                      {item.width && item.height && (
                        <span className="ml-2">
                          {item.width}m x {item.height}m
                        </span>
                      )}
                      {item.color && <span className="ml-2">• {item.color}</span>}
                      {item.thickness && <span className="ml-2">• {item.thickness}</span>}
                    </div>
                  </div>
                  <p className="font-medium text-accent-400">
                    {estimate > 0 ? formatCurrency(estimate) : 'Sob consulta'}
                  </p>
                </div>
              )
            })}
          </div>
        </Card>

        {/* Customer Info */}
        <Card className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-accent-400" />
              <h3 className="text-theme-primary font-display text-lg font-semibold">
                Dados de contato
              </h3>
            </div>
            <Button variant="ghost" size="sm" onClick={handleEditCustomer}>
              <Edit2 className="mr-1 h-4 w-4" />
              Editar
            </Button>
          </div>

          <div className="space-y-2">
            <p className="text-theme-primary font-medium">{customerData?.name}</p>
            <div className="text-theme-muted flex items-center gap-2 text-sm">
              <Mail className="h-4 w-4" />
              <span>{customerData?.email}</span>
            </div>
            <div className="text-theme-muted flex items-center gap-2 text-sm">
              <Phone className="h-4 w-4" />
              <span>{customerData?.phone}</span>
            </div>
          </div>
        </Card>

        {/* Address */}
        <Card className="p-6">
          <div className="mb-4 flex items-center gap-2">
            <MapPin className="h-5 w-5 text-accent-400" />
            <h3 className="text-theme-primary font-display text-lg font-semibold">
              Endereco para instalacao
            </h3>
          </div>

          <p className="text-theme-muted text-sm">
            {customerData?.street}, {customerData?.number}
            {customerData?.complement && ` - ${customerData.complement}`}
            <br />
            {customerData?.neighborhood} - {customerData?.city}/{customerData?.state}
            <br />
            CEP: {customerData?.zipCode}
          </p>
        </Card>

        {/* Total */}
        <Card className="bg-accent-500/10 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-theme-muted text-sm">Total estimado</p>
              <p className="font-display text-3xl font-bold text-accent-400">
                {totalEstimate > 0 ? formatCurrency(totalEstimate) : 'Sob consulta'}
              </p>
              <p className="text-theme-subtle mt-1 text-xs">
                * Valor estimado. O preco final sera confirmado apos visita tecnica.
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
      </div>

      <div className="mt-8 flex justify-between">
        <Button variant="outline" onClick={prevStep} disabled={isSubmitting}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>
        <Button onClick={handleSubmit} disabled={isSubmitting} size="lg">
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Enviando...
            </>
          ) : (
            <>
              <Check className="mr-2 h-4 w-4" />
              Enviar Orcamento
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
