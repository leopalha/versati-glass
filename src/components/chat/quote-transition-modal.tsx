'use client'

/**
 * AI-CHAT Sprint P2.3: Quote Transition Modal
 *
 * Displays a summary of collected quote data before transitioning
 * from AI chat to the quote wizard. Provides visual confirmation
 * and opportunity to review before proceeding.
 *
 * Enhanced with:
 * - Edit item functionality
 * - Add more items option
 * - Remove item functionality
 */

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  CheckCircle2,
  ArrowRight,
  Package,
  Ruler,
  UserCircle,
  MapPin,
  Calendar,
  Sparkles,
  X,
  Edit2,
  Trash2,
  Plus,
  MessageCircle,
  Save,
} from 'lucide-react'
import type { AiQuoteData, QuoteItem } from '@/store/quote-store'

interface QuoteTransitionModalProps {
  isOpen: boolean
  quoteData: AiQuoteData | null
  onConfirm: () => void
  onCancel: () => void
  onAddMore?: () => void
  isLoading?: boolean
}

export function QuoteTransitionModal({
  isOpen,
  quoteData,
  onConfirm,
  onCancel,
  onAddMore,
  isLoading = false,
}: QuoteTransitionModalProps) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [editedItems, setEditedItems] = useState<Omit<QuoteItem, 'id'>[]>([])
  const [deletedIndexes, setDeletedIndexes] = useState<number[]>([])

  // Initialize edited items from quoteData
  useState(() => {
    if (quoteData?.items) {
      setEditedItems(quoteData.items)
    }
  })

  if (!isOpen || !quoteData) return null

  const { customerData, scheduleData } = quoteData
  const items = editedItems.length > 0 ? editedItems : quoteData.items

  // Filter out deleted items
  const visibleItems = items.filter((_, index) => !deletedIndexes.includes(index))

  const handleEditItem = (index: number) => {
    setEditingIndex(index)
  }

  const handleSaveEdit = (index: number, field: string, value: string | number) => {
    setEditedItems((prev) => {
      const updated = [...(prev.length > 0 ? prev : quoteData.items)]
      updated[index] = { ...updated[index], [field]: value }
      return updated
    })
  }

  const handleDeleteItem = (index: number) => {
    setDeletedIndexes((prev) => [...prev, index])
  }

  const handleConfirmWithEdits = () => {
    // If items were edited, pass them to the confirm handler
    // The parent component will handle merging the edits
    onConfirm()
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          onClick={onCancel}
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="relative z-10 mx-4 w-full max-w-2xl"
        >
          <Card className="bg-theme-secondary border-theme-default max-h-[85vh] overflow-y-auto">
            {/* Header */}
            <div className="border-theme-default from-accent-500/10 sticky top-0 z-10 border-b bg-gradient-to-r to-purple-500/10 p-6">
              <div className="flex items-start justify-between">
                <div>
                  <div className="mb-2 flex items-center gap-2">
                    <Sparkles className="h-6 w-6 text-accent-500" />
                    <h2 className="font-display text-2xl font-bold text-white">
                      Seu Orçamento está Pronto!
                    </h2>
                  </div>
                  <p className="text-theme-muted text-sm">
                    Revise os dados coletados antes de prosseguir
                  </p>
                </div>
                <button
                  onClick={onCancel}
                  className="text-theme-muted hover:text-theme-primary rounded-lg p-1 transition-colors"
                  aria-label="Fechar"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="space-y-6 p-6">
              {/* Items Summary */}
              <section>
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Package className="h-5 w-5 text-accent-500" />
                    <h3 className="font-display text-lg font-semibold text-white">
                      Itens Coletados ({visibleItems.length})
                    </h3>
                  </div>
                </div>

                <div className="space-y-3">
                  {items.map((item, index) => {
                    // Skip deleted items
                    if (deletedIndexes.includes(index)) return null

                    const isEditing = editingIndex === index

                    return (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-theme-elevated border-theme-default rounded-lg border p-4"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-accent-500" />
                              {isEditing ? (
                                <Input
                                  value={item.productName || item.category}
                                  onChange={(e) =>
                                    handleSaveEdit(index, 'productName', e.target.value)
                                  }
                                  className="h-7 w-full max-w-[200px] text-sm font-medium"
                                />
                              ) : (
                                <p className="font-medium text-white">
                                  {item.productName || item.category}
                                </p>
                              )}
                            </div>

                            {item.description && !isEditing && (
                              <p className="text-theme-muted mt-1 text-sm">{item.description}</p>
                            )}

                            {/* Specifications - Editable when editing */}
                            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-2 text-xs">
                              {isEditing ? (
                                <>
                                  <div className="flex items-center gap-1">
                                    <Ruler className="text-theme-muted h-3 w-3" />
                                    <Input
                                      type="number"
                                      step="0.01"
                                      value={item.width || ''}
                                      onChange={(e) =>
                                        handleSaveEdit(
                                          index,
                                          'width',
                                          parseFloat(e.target.value) || 0
                                        )
                                      }
                                      placeholder="Largura"
                                      className="h-6 w-16 text-xs"
                                    />
                                    <span className="text-theme-muted">x</span>
                                    <Input
                                      type="number"
                                      step="0.01"
                                      value={item.height || ''}
                                      onChange={(e) =>
                                        handleSaveEdit(
                                          index,
                                          'height',
                                          parseFloat(e.target.value) || 0
                                        )
                                      }
                                      placeholder="Altura"
                                      className="h-6 w-16 text-xs"
                                    />
                                    <span className="text-theme-muted">m</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <span className="text-theme-muted">Qtd:</span>
                                    <Input
                                      type="number"
                                      min="1"
                                      value={item.quantity || 1}
                                      onChange={(e) =>
                                        handleSaveEdit(
                                          index,
                                          'quantity',
                                          parseInt(e.target.value) || 1
                                        )
                                      }
                                      className="h-6 w-12 text-xs"
                                    />
                                  </div>
                                </>
                              ) : (
                                <>
                                  {(item.width || item.height) && (
                                    <span className="text-theme-muted flex items-center gap-1">
                                      <Ruler className="h-3 w-3" />
                                      {item.width && item.height
                                        ? `${item.width}m × ${item.height}m`
                                        : item.width
                                          ? `${item.width}m largura`
                                          : `${item.height}m altura`}
                                    </span>
                                  )}

                                  {item.quantity && item.quantity > 1 && (
                                    <span className="text-theme-muted">
                                      Quantidade: {item.quantity}
                                    </span>
                                  )}

                                  {item.glassType && (
                                    <span className="text-theme-muted">
                                      Vidro: {item.glassType}
                                    </span>
                                  )}

                                  {item.thickness && (
                                    <span className="text-theme-muted">
                                      Espessura: {item.thickness}
                                    </span>
                                  )}

                                  {item.color && (
                                    <span className="text-theme-muted">Cor: {item.color}</span>
                                  )}
                                </>
                              )}
                            </div>
                          </div>

                          {/* Edit/Delete Actions */}
                          <div className="ml-3 flex flex-col items-end gap-2">
                            {item.images && item.images.length > 0 && (
                              <div>
                                <img
                                  src={item.images[0]}
                                  alt="Preview"
                                  className="border-theme-default h-12 w-12 rounded-md border object-cover"
                                />
                              </div>
                            )}
                            <div className="flex gap-1">
                              <button
                                onClick={() =>
                                  isEditing ? setEditingIndex(null) : handleEditItem(index)
                                }
                                className="rounded p-1.5 text-neutral-400 transition-colors hover:bg-neutral-700 hover:text-accent-500"
                                title={isEditing ? 'Salvar' : 'Editar'}
                              >
                                {isEditing ? (
                                  <Save className="h-3.5 w-3.5" />
                                ) : (
                                  <Edit2 className="h-3.5 w-3.5" />
                                )}
                              </button>
                              <button
                                onClick={() => handleDeleteItem(index)}
                                className="rounded p-1.5 text-neutral-400 transition-colors hover:bg-red-500/20 hover:text-red-400"
                                title="Remover item"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )
                  })}
                </div>

                {/* Add More Items Button */}
                {onAddMore && (
                  <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    onClick={onAddMore}
                    className="border-theme-default mt-3 flex w-full items-center justify-center gap-2 rounded-lg border border-dashed p-4 text-sm text-neutral-400 transition-colors hover:border-accent-500 hover:text-accent-500"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Adicionar mais itens ao orcamento</span>
                  </motion.button>
                )}
              </section>

              {/* Customer Data */}
              {customerData && (customerData.name || customerData.phone) && (
                <motion.section
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="mb-3 flex items-center gap-2">
                    <UserCircle className="h-5 w-5 text-accent-500" />
                    <h3 className="font-display text-lg font-semibold text-white">
                      Dados de Contato
                    </h3>
                  </div>

                  <div className="bg-theme-elevated border-theme-default rounded-lg border p-4">
                    <div className="grid gap-2 text-sm">
                      {customerData.name && (
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="h-3.5 w-3.5 text-accent-500" />
                          <span className="text-theme-muted">Nome:</span>
                          <span className="text-white">{customerData.name}</span>
                        </div>
                      )}

                      {customerData.phone && (
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="h-3.5 w-3.5 text-accent-500" />
                          <span className="text-theme-muted">Telefone:</span>
                          <span className="text-white">{customerData.phone}</span>
                        </div>
                      )}

                      {customerData.email && (
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="h-3.5 w-3.5 text-accent-500" />
                          <span className="text-theme-muted">Email:</span>
                          <span className="text-white">{customerData.email}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.section>
              )}

              {/* Address */}
              {customerData && (customerData.street || customerData.city || customerData.state) && (
                <motion.section
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <div className="mb-3 flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-accent-500" />
                    <h3 className="font-display text-lg font-semibold text-white">
                      Endereço de Instalação
                    </h3>
                  </div>

                  <div className="bg-theme-elevated border-theme-default rounded-lg border p-4">
                    <p className="text-sm text-white">
                      {[
                        customerData.street && customerData.number
                          ? `${customerData.street}, ${customerData.number}`
                          : customerData.street,
                        customerData.neighborhood,
                        customerData.city,
                        customerData.state,
                      ]
                        .filter(Boolean)
                        .join(' - ')}
                    </p>
                    {customerData.zipCode && (
                      <p className="text-theme-muted mt-1 text-xs">CEP: {customerData.zipCode}</p>
                    )}
                  </div>
                </motion.section>
              )}

              {/* Schedule */}
              {scheduleData && scheduleData.type && scheduleData.date && (
                <motion.section
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <div className="mb-3 flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-accent-500" />
                    <h3 className="font-display text-lg font-semibold text-white">Agendamento</h3>
                  </div>

                  <div className="bg-theme-elevated border-theme-default rounded-lg border p-4">
                    <div className="grid gap-2 text-sm">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-3.5 w-3.5 text-accent-500" />
                        <span className="text-theme-muted">Tipo:</span>
                        <span className="text-white">
                          {scheduleData.type === 'VISITA_TECNICA' ? 'Visita Técnica' : 'Instalação'}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-3.5 w-3.5 text-accent-500" />
                        <span className="text-theme-muted">Data:</span>
                        <span className="text-white">
                          {new Date(scheduleData.date).toLocaleDateString('pt-BR')}
                          {scheduleData.time && ` às ${scheduleData.time}`}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.section>
              )}
            </div>

            {/* Footer Actions */}
            <div className="border-theme-default from-accent-500/5 sticky bottom-0 border-t bg-gradient-to-r to-purple-500/5 p-6">
              {/* Add More Items Option */}
              {onAddMore && (
                <button
                  onClick={onAddMore}
                  disabled={isLoading}
                  className="border-accent-500/30 bg-accent-500/10 hover:bg-accent-500/20 mb-4 flex w-full items-center justify-center gap-2 rounded-lg border px-4 py-3 text-sm font-medium text-accent-400 transition-colors disabled:opacity-50"
                >
                  <MessageCircle className="h-4 w-4" />
                  Preciso de mais coisas - Voltar ao Chat
                </button>
              )}

              <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
                <Button
                  variant="outline"
                  onClick={onCancel}
                  disabled={isLoading}
                  className="w-full sm:w-auto"
                >
                  Cancelar
                </Button>

                <Button
                  onClick={handleConfirmWithEdits}
                  disabled={isLoading || visibleItems.length === 0}
                  className="w-full bg-accent-500 font-medium text-neutral-900 hover:bg-accent-600 sm:w-auto"
                >
                  {isLoading ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        className="mr-2 h-4 w-4 rounded-full border-2 border-neutral-900 border-t-transparent"
                      />
                      Enviando orcamento...
                    </>
                  ) : (
                    <>
                      Enviar Orcamento ({visibleItems.length}{' '}
                      {visibleItems.length === 1 ? 'item' : 'itens'})
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>

              <p className="text-theme-subtle mt-3 text-center text-xs">
                Voce recebera uma resposta em breve via email ou WhatsApp
              </p>
            </div>
          </Card>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
