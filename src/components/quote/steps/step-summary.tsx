'use client'

import { useState } from 'react'
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
  Ruler,
} from 'lucide-react'

export function StepSummary() {
  const { items, customerData, prevStep, nextStep } = useQuoteStore()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const item = items[0]

  // Calculate estimated price (this would normally come from backend)
  const calculateEstimatedPrice = () => {
    if (!item?.width || !item?.height) return 0
    const area = item.width * item.height
    // Base price estimation
    const basePrice = 1500 + area * 500
    return basePrice * item.quantity
  }

  const estimatedTotal = calculateEstimatedPrice()

  const handleSubmit = async () => {
    if (!customerData) {
      toast({
        variant: 'error',
        title: 'Dados incompletos',
        description: 'Por favor, preencha seus dados de contato',
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
          items: items.map((i) => ({
            productId: i.productId || undefined,
            description: i.description || `${i.productName} - ${i.width}m x ${i.height}m`,
            specifications: `${i.width}m x ${i.height}m${i.color ? ` - ${i.color}` : ''}${i.thickness ? ` - ${i.thickness}` : ''}`,
            width: i.width,
            height: i.height,
            quantity: i.quantity,
            color: i.color,
            finish: i.finish,
            thickness: i.thickness,
            unitPrice: estimatedTotal / i.quantity,
            totalPrice: estimatedTotal,
            customerImages: i.images,
          })),
          source: 'WEBSITE',
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Erro ao enviar orcamento')
      }

      const result = await response.json()

      toast({
        variant: 'success',
        title: 'Orcamento enviado!',
        description: `Numero: ${result.number}`,
      })

      // Go to scheduling step
      nextStep()
    } catch (error) {
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
    <div className="mx-auto max-w-2xl">
      <div className="mb-8 text-center">
        <h2 className="font-display text-3xl font-bold text-white">
          Resumo do orcamento
        </h2>
        <p className="mt-2 text-neutral-400">
          Revise as informacoes antes de enviar
        </p>
      </div>

      <div className="space-y-6">
        {/* Product Summary */}
        <Card className="p-6">
          <div className="mb-4 flex items-center gap-2">
            <Package className="h-5 w-5 text-gold-400" />
            <h3 className="font-display text-lg font-semibold text-white">
              Produto
            </h3>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-neutral-400">Produto</span>
              <span className="font-medium text-white">{item?.productName}</span>
            </div>

            {item?.width && item?.height && (
              <div className="flex justify-between">
                <span className="text-neutral-400">Medidas</span>
                <span className="font-medium text-white">
                  {item.width}m x {item.height}m
                </span>
              </div>
            )}

            <div className="flex justify-between">
              <span className="text-neutral-400">Quantidade</span>
              <span className="font-medium text-white">{item?.quantity}</span>
            </div>

            {item?.color && (
              <div className="flex justify-between">
                <span className="text-neutral-400">Cor</span>
                <span className="font-medium text-white">{item.color}</span>
              </div>
            )}

            {item?.finish && (
              <div className="flex justify-between">
                <span className="text-neutral-400">Acabamento</span>
                <span className="font-medium text-white">{item.finish}</span>
              </div>
            )}

            {item?.thickness && (
              <div className="flex justify-between">
                <span className="text-neutral-400">Espessura</span>
                <span className="font-medium text-white">{item.thickness}</span>
              </div>
            )}

            {item?.images && item.images.length > 0 && (
              <div>
                <span className="text-neutral-400">Fotos enviadas:</span>
                <div className="mt-2 flex gap-2">
                  {item.images.map((img, idx) => (
                    <img
                      key={idx}
                      src={img}
                      alt={`Foto ${idx + 1}`}
                      className="h-16 w-16 rounded object-cover"
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Customer Info */}
        <Card className="p-6">
          <div className="mb-4 flex items-center gap-2">
            <Mail className="h-5 w-5 text-gold-400" />
            <h3 className="font-display text-lg font-semibold text-white">
              Dados de contato
            </h3>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="font-medium text-white">{customerData?.name}</span>
            </div>
            <div className="flex items-center gap-2 text-neutral-400">
              <Mail className="h-4 w-4" />
              <span>{customerData?.email}</span>
            </div>
            <div className="flex items-center gap-2 text-neutral-400">
              <Phone className="h-4 w-4" />
              <span>{customerData?.phone}</span>
            </div>
          </div>
        </Card>

        {/* Address */}
        <Card className="p-6">
          <div className="mb-4 flex items-center gap-2">
            <MapPin className="h-5 w-5 text-gold-400" />
            <h3 className="font-display text-lg font-semibold text-white">
              Endereco para instalacao
            </h3>
          </div>

          <p className="text-neutral-300">
            {customerData?.street}, {customerData?.number}
            {customerData?.complement && ` - ${customerData.complement}`}
            <br />
            {customerData?.neighborhood}
            <br />
            {customerData?.city} - {customerData?.state}
            <br />
            CEP: {customerData?.zipCode}
          </p>
        </Card>

        {/* Estimated Price */}
        <Card className="bg-gold-500/10 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-400">Estimativa de valor</p>
              <p className="font-display text-3xl font-bold text-gold-400">
                {formatCurrency(estimatedTotal)}
              </p>
              <p className="mt-1 text-xs text-neutral-500">
                * Valor estimado. O preco final sera confirmado apos visita tecnica.
              </p>
            </div>
            <Ruler className="h-12 w-12 text-gold-500/30" />
          </div>
        </Card>
      </div>

      <div className="mt-8 flex justify-between">
        <Button variant="outline" onClick={prevStep} disabled={isSubmitting}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>
        <Button onClick={handleSubmit} disabled={isSubmitting}>
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
