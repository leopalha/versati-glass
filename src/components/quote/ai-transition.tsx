'use client'

/**
 * AI-CHAT Sprint P3.1: Visual Transition Component
 *
 * Modal that appears when finalizing a quote from AI chat,
 * showing a summary of collected items before transitioning
 * to the quote wizard.
 */

import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { CheckCircle2, ArrowRight, Package, Ruler, X } from 'lucide-react'
import type { AiQuoteData } from '@/store/quote-store'

interface AiTransitionProps {
  isOpen: boolean
  quoteData: AiQuoteData | null
  onProceed: () => void
  onCancel: () => void
}

export function AiTransition({ isOpen, quoteData, onProceed, onCancel }: AiTransitionProps) {
  if (!quoteData || !quoteData.items || quoteData.items.length === 0) {
    return null
  }

  const totalItems = quoteData.items.reduce((sum, item) => sum + (item.quantity || 1), 0)

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={onCancel}
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-lg"
            >
              <Card className="relative p-6">
                {/* Close button */}
                <button
                  onClick={onCancel}
                  className="absolute right-4 top-4 rounded-lg p-1 text-neutral-600 transition-colors hover:bg-neutral-200 hover:text-white"
                  aria-label="Fechar"
                >
                  <X className="h-5 w-5" />
                </button>

                {/* Header */}
                <div className="mb-6 text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
                    className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/20"
                  >
                    <CheckCircle2 className="h-8 w-8 text-green-400" />
                  </motion.div>

                  <h2 className="mb-2 font-display text-2xl font-bold text-white">
                    Seu Orçamento está Pronto!
                  </h2>
                  <p className="text-neutral-600">Coletei todas as informações necessárias</p>
                </div>

                {/* Summary Stats */}
                <div className="mb-6 grid grid-cols-2 gap-4">
                  <div className="bg-accent-500/10 rounded-lg p-4 text-center">
                    <Package className="mx-auto mb-2 h-6 w-6 text-accent-500" />
                    <p className="text-2xl font-bold text-white">{quoteData.items.length}</p>
                    <p className="text-sm text-neutral-600">
                      {quoteData.items.length === 1 ? 'Produto' : 'Produtos'}
                    </p>
                  </div>

                  <div className="rounded-lg bg-blue-500/10 p-4 text-center">
                    <Ruler className="mx-auto mb-2 h-6 w-6 text-blue-400" />
                    <p className="text-2xl font-bold text-white">{totalItems}</p>
                    <p className="text-sm text-neutral-600">
                      {totalItems === 1 ? 'Item' : 'Itens'} total
                    </p>
                  </div>
                </div>

                {/* Items List */}
                <div className="bg-theme-secondary mb-6 max-h-60 space-y-3 overflow-y-auto rounded-lg p-4">
                  <h3 className="mb-3 text-sm font-semibold text-neutral-600">Itens Coletados:</h3>

                  {quoteData.items.map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + index * 0.05 }}
                      className="flex items-start gap-3 rounded-lg border border-neutral-600 p-3"
                    >
                      <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-400" />
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-white">
                          {item.productName || 'Produto'} - {item.category}
                        </p>

                        <div className="mt-1 flex flex-wrap gap-2 text-sm text-neutral-600">
                          {item.width && item.height && (
                            <span>
                              📏 {item.width}m × {item.height}m
                            </span>
                          )}
                          {item.quantity && item.quantity > 1 && <span>✕ {item.quantity}</span>}
                          {item.glassType && <span>🔷 {item.glassType}</span>}
                          {item.color && <span>🎨 {item.color}</span>}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Customer Data Preview */}
                {quoteData.customerData &&
                  (quoteData.customerData.name || quoteData.customerData.phone) && (
                    <div className="mb-6 rounded-lg bg-blue-500/10 p-4">
                      <h3 className="mb-2 text-sm font-semibold text-blue-400">
                        Dados de Contato:
                      </h3>
                      <div className="space-y-1 text-sm text-neutral-600">
                        {quoteData.customerData.name && (
                          <p>✓ Nome: {quoteData.customerData.name}</p>
                        )}
                        {quoteData.customerData.phone && (
                          <p>✓ Telefone: {quoteData.customerData.phone}</p>
                        )}
                        {quoteData.customerData.email && (
                          <p>✓ Email: {quoteData.customerData.email}</p>
                        )}
                      </div>
                    </div>
                  )}

                {/* Info Box */}
                <div className="mb-6 rounded-lg bg-gold-500/10 p-4">
                  <p className="text-sm text-neutral-600">
                    <span className="font-semibold text-gold-500">Próximo passo:</span> Você poderá
                    revisar todos os itens, ajustar detalhes e finalizar seu orçamento.
                  </p>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <Button variant="outline" onClick={onCancel} className="flex-1">
                    Voltar ao Chat
                  </Button>

                  <Button
                    onClick={onProceed}
                    className="flex-1 bg-accent-500 font-medium text-neutral-900 hover:bg-accent-600"
                  >
                    Revisar Orçamento
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </Card>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
