'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { CreditCard, Loader2 } from 'lucide-react'
import { useToast } from '@/components/ui/toast/use-toast'

interface PaymentButtonProps {
  orderId: string
  className?: string
}

export function PaymentButton({ orderId, className }: PaymentButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handlePayment = async () => {
    setIsLoading(true)
    try {
      const res = await fetch('/api/payments/create-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId,
          paymentMethod: 'card', // Default to card, could add selector
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
    <Button onClick={handlePayment} disabled={isLoading} className={className}>
      {isLoading ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <CreditCard className="mr-2 h-4 w-4" />
      )}
      Pagar Agora
    </Button>
  )
}
