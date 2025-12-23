'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { CreditCard, Loader2, QrCode } from 'lucide-react'
import { useToast } from '@/components/ui/toast/use-toast'
import { cn } from '@/lib/utils'

interface PaymentMethodSelectorProps {
  orderId: string
  className?: string
}

type PaymentMethod = 'card' | 'pix'

export function PaymentMethodSelector({ orderId, className }: PaymentMethodSelectorProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('card')
  const { toast } = useToast()

  const handlePayment = async () => {
    setIsLoading(true)
    try {
      const res = await fetch('/api/payments/create-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId,
          paymentMethod: selectedMethod,
        }),
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || 'Erro ao criar sessão de pagamento')
      }

      const { url } = await res.json()

      if (url) {
        window.location.href = url
      } else {
        throw new Error('URL de pagamento não retornada')
      }
    } catch (error) {
      toast({
        variant: 'error',
        title: 'Erro',
        description: error instanceof Error ? error.message : 'Erro ao processar pagamento',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={cn('space-y-4', className)}>
      {/* Payment Method Selection */}
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => setSelectedMethod('card')}
          disabled={isLoading}
          className={cn(
            'flex flex-col items-center gap-2 rounded-lg border-2 p-4 transition-all',
            'hover:border-gold-500/50 hover:bg-neutral-800/50',
            selectedMethod === 'card'
              ? 'border-gold-500 bg-gold-500/10'
              : 'border-neutral-700 bg-neutral-900'
          )}
        >
          <CreditCard
            className={cn(
              'h-8 w-8',
              selectedMethod === 'card' ? 'text-gold-500' : 'text-neutral-400'
            )}
          />
          <div className="text-center">
            <p
              className={cn(
                'font-medium',
                selectedMethod === 'card' ? 'text-gold-500' : 'text-white'
              )}
            >
              Cartão de Crédito
            </p>
            <p className="text-xs text-neutral-400">Até 12x sem juros</p>
          </div>
        </button>

        <button
          type="button"
          onClick={() => setSelectedMethod('pix')}
          disabled={isLoading}
          className={cn(
            'flex flex-col items-center gap-2 rounded-lg border-2 p-4 transition-all',
            'hover:border-gold-500/50 hover:bg-neutral-800/50',
            selectedMethod === 'pix'
              ? 'border-gold-500 bg-gold-500/10'
              : 'border-neutral-700 bg-neutral-900'
          )}
        >
          <QrCode
            className={cn(
              'h-8 w-8',
              selectedMethod === 'pix' ? 'text-gold-500' : 'text-neutral-400'
            )}
          />
          <div className="text-center">
            <p
              className={cn(
                'font-medium',
                selectedMethod === 'pix' ? 'text-gold-500' : 'text-white'
              )}
            >
              PIX
            </p>
            <p className="text-xs text-neutral-400">Aprovação instantânea</p>
          </div>
        </button>
      </div>

      {/* Payment Button */}
      <Button onClick={handlePayment} disabled={isLoading} size="lg" className="w-full">
        {isLoading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : selectedMethod === 'card' ? (
          <CreditCard className="mr-2 h-4 w-4" />
        ) : (
          <QrCode className="mr-2 h-4 w-4" />
        )}
        {isLoading
          ? 'Processando...'
          : selectedMethod === 'card'
            ? 'Pagar com Cartão'
            : 'Pagar com PIX'}
      </Button>

      {selectedMethod === 'pix' && (
        <p className="text-center text-sm text-neutral-400">
          Você será redirecionado para escanear o QR Code do PIX
        </p>
      )}
    </div>
  )
}
