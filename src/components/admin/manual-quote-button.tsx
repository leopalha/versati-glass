'use client'

/**
 * AI-CHAT Sprint P4.3: Manual Quote Generation Button
 *
 * Allows admin to manually create a quote from an AI conversation
 * when the AI couldn't complete the data collection.
 */

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { FileText, Loader2 } from 'lucide-react'
import { logger } from '@/lib/logger'

interface ManualQuoteButtonProps {
  conversationId: string
  hasQuote: boolean
  quoteContext: any
}

export function ManualQuoteButton({
  conversationId,
  hasQuote,
  quoteContext,
}: ManualQuoteButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const router = useRouter()

  const handleGenerateQuote = async () => {
    try {
      setIsGenerating(true)

      // Call the from-ai endpoint to create quote
      const response = await fetch('/api/quotes/from-ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          conversationId,
          manualOverride: true,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate quote')
      }

      logger.info('Manual quote generated successfully', {
        conversationId,
        quoteId: data.quoteId,
        quoteNumber: data.quoteNumber,
      })

      // Show success message and redirect to quote detail
      alert(`Orçamento ${data.quoteNumber} criado com sucesso!`)
      router.push(`/admin/orcamentos/${data.quoteId}`)
    } catch (error) {
      console.error('Error generating quote:', error)
      alert(
        error instanceof Error
          ? error.message
          : 'Erro ao gerar orçamento. Verifique se há dados suficientes.'
      )
    } finally {
      setIsGenerating(false)
    }
  }

  // Don't show if quote already exists
  if (hasQuote) {
    return null
  }

  // Check if there's enough data
  const hasItems = quoteContext?.items && quoteContext.items.length > 0
  const hasCustomerData = quoteContext?.customerData?.phone

  const canGenerate = hasItems && hasCustomerData

  return (
    <Button
      onClick={handleGenerateQuote}
      disabled={!canGenerate || isGenerating}
      variant={canGenerate ? 'default' : 'outline'}
      size="sm"
      className={canGenerate ? 'bg-accent-500 text-neutral-900 hover:bg-accent-600' : ''}
    >
      {isGenerating ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Gerando...
        </>
      ) : (
        <>
          <FileText className="mr-2 h-4 w-4" />
          Gerar Orçamento Manualmente
        </>
      )}
    </Button>
  )
}
