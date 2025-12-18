'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Steps:
// 1 = Categoria
// 2 = Produto (lista produtos da categoria)
// 3 = Medidas/Opções
// 4 = Revisão do Item (permite adicionar mais ou continuar)
// 5 = Dados do Cliente
// 6 = Resumo Final
// 7 = Agendamento
export type QuoteStep = 1 | 2 | 3 | 4 | 5 | 6 | 7

export interface QuoteItem {
  id: string // ID único para cada item no carrinho
  productId: string
  productName: string
  productSlug: string
  category: string
  description?: string
  width?: number
  height?: number
  quantity: number
  // Opções gerais
  color?: string // Cor da ferragem
  finish?: string // Acabamento de borda
  thickness?: string // Espessura
  // Opções de vidro
  glassType?: string // Tipo de vidro (temperado, laminado, etc)
  glassColor?: string // Cor do vidro ou espelho
  // Opções específicas por categoria
  model?: string // Modelo (box, porta, janela, etc)
  finishLine?: string // Linha de acabamento (box)
  ledTemp?: string // Temperatura LED (espelhos)
  shape?: string // Formato (espelhos, tampos)
  bisoteWidth?: string // Largura do bisotê (espelhos)
  // Mídia
  images: string[]
  estimatedPrice?: number
}

// Item temporário sendo editado (antes de confirmar)
export interface TempItem {
  category?: string
  productId?: string
  productName?: string
  productSlug?: string
}

export interface CustomerData {
  name: string
  email: string
  phone: string
  cpfCnpj?: string
  street: string
  number: string
  complement?: string
  neighborhood: string
  city: string
  state: string
  zipCode: string
}

export interface ScheduleData {
  type: 'VISITA_TECNICA' | 'INSTALACAO'
  date: string
  time: string
  notes?: string
}

// AI-CHAT Sprint P1.3: Data structure for AI import
export interface AiQuoteData {
  items: Omit<QuoteItem, 'id'>[]
  customerData?: Partial<CustomerData> | null
  scheduleData?: Partial<ScheduleData> | null
}

interface QuoteState {
  step: QuoteStep
  items: QuoteItem[]
  currentItem: TempItem | null // Item sendo criado/editado
  editingIndex: number | null // Índice do item sendo editado (null = novo item)
  selectedProducts: string[] // IDs dos produtos selecionados no Step 2
  customerData: CustomerData | null
  scheduleData: ScheduleData | null
  source: 'WEBSITE' | 'WHATSAPP' | 'PHONE' | 'WALKIN'
  lastActivity: number | null // FQ.5.4: Timestamp da última atividade (para timeout)

  // Multi-category support
  selectedCategories: string[] // Categorias selecionadas no Step 1
  productsToDetail: any[] // Fila de produtos aguardando detalhamento
  currentProductIndex: number // Índice do produto atual sendo detalhado

  // Actions
  setStep: (step: QuoteStep) => void
  nextStep: () => void
  prevStep: () => void

  // Gerenciamento do item atual (em edição)
  setCurrentItem: (item: TempItem) => void
  updateCurrentItem: (data: Partial<TempItem>) => void
  clearCurrentItem: () => void

  // Gerenciamento de seleção de produtos (Step 2)
  toggleProductSelection: (productId: string) => void
  clearSelectedProducts: () => void

  // Multi-category support actions
  setSelectedCategories: (categories: string[]) => void
  toggleCategorySelection: (categoryId: string) => void
  clearCategories: () => void
  setProductsToDetail: (products: any[]) => void
  nextProductToDetail: () => void
  getCurrentProductToDetail: () => any | null
  allProductsDetailed: () => boolean
  resetProductDetailingIndex: () => void

  // Gerenciamento de itens confirmados
  addItem: (item: Omit<QuoteItem, 'id'>) => void
  updateItem: (index: number, item: Partial<QuoteItem>) => void
  removeItem: (index: number) => void
  clearItems: () => void

  // Editar item existente
  startEditItem: (index: number) => void
  cancelEditItem: () => void
  saveEditItem: (data: Partial<QuoteItem>) => void

  // Adicionar mais itens
  startNewItem: () => void

  setCustomerData: (data: CustomerData) => void
  setScheduleData: (data: ScheduleData) => void

  // AI-CHAT Sprint P1.3: Import quote data from AI chat
  importFromAI: (aiQuoteData: AiQuoteData) => void
  clearForNewQuote: () => void

  reset: () => void

  // Computed
  getTotalItems: () => number
  getEstimatedTotal: () => number
}

const initialState = {
  step: 1 as QuoteStep,
  items: [] as QuoteItem[],
  currentItem: null as TempItem | null,
  editingIndex: null as number | null,
  selectedProducts: [] as string[],
  customerData: null,
  scheduleData: null,
  source: 'WEBSITE' as const,
  lastActivity: null as number | null, // FQ.5.4: Inicializa como null
  selectedCategories: [] as string[],
  productsToDetail: [] as any[],
  currentProductIndex: 0,
}

// Gera ID único para itens
const generateItemId = () => `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

// FQ.5.4: Update activity timestamp helper
const updateActivity = () => ({ lastActivity: Date.now() })

export const useQuoteStore = create<QuoteState>()(
  persist(
    (set, get) => ({
      ...initialState,

      setStep: (step) => set({ step, ...updateActivity() }),

      nextStep: () => {
        const currentStep = get().step
        if (currentStep < 7) {
          set({ step: (currentStep + 1) as QuoteStep, ...updateActivity() })
        }
      },

      prevStep: () => {
        const currentStep = get().step
        if (currentStep > 1) {
          set({ step: (currentStep - 1) as QuoteStep, ...updateActivity() })
        }
      },

      // Gerenciamento do item atual (em criação/edição)
      setCurrentItem: (item) => set({ currentItem: item }),

      updateCurrentItem: (data) => {
        const current = get().currentItem
        const updated = current ? { ...current, ...data } : { ...data }
        set({ currentItem: updated })
      },

      clearCurrentItem: () => set({ currentItem: null, editingIndex: null }),

      // Gerenciamento de seleção de produtos (Step 2)
      toggleProductSelection: (productId) => {
        const current = get().selectedProducts
        const isSelected = current.includes(productId)

        if (isSelected) {
          // Remove se já está selecionado
          set({ selectedProducts: current.filter((id) => id !== productId) })
        } else {
          // Adiciona se não está selecionado
          set({ selectedProducts: [...current, productId] })
        }
      },

      clearSelectedProducts: () => set({ selectedProducts: [] }),

      // Multi-category support implementations
      setSelectedCategories: (categories) => set({ selectedCategories: categories }),

      toggleCategorySelection: (categoryId) => {
        const current = get().selectedCategories
        const isSelected = current.includes(categoryId)

        if (isSelected) {
          set({ selectedCategories: current.filter((id) => id !== categoryId) })
        } else {
          set({ selectedCategories: [...current, categoryId] })
        }
      },

      clearCategories: () => set({ selectedCategories: [] }),

      setProductsToDetail: (products) =>
        set({
          productsToDetail: products,
          currentProductIndex: 0,
        }),

      nextProductToDetail: () => {
        const { currentProductIndex, productsToDetail } = get()
        if (currentProductIndex < productsToDetail.length - 1) {
          set({ currentProductIndex: currentProductIndex + 1 })
        }
      },

      getCurrentProductToDetail: () => {
        const { currentProductIndex, productsToDetail } = get()
        return productsToDetail[currentProductIndex] || null
      },

      allProductsDetailed: () => {
        const { currentProductIndex, productsToDetail } = get()
        return currentProductIndex >= productsToDetail.length - 1
      },

      resetProductDetailingIndex: () => set({ currentProductIndex: 0 }),

      // Gerenciamento de itens confirmados
      addItem: (item) => {
        const items = get().items
        const newItem: QuoteItem = {
          ...item,
          id: generateItemId(),
        }
        set({ items: [...items, newItem], currentItem: null, editingIndex: null })
      },

      updateItem: (index, item) => {
        const items = get().items
        const updatedItems = items.map((i, idx) => (idx === index ? { ...i, ...item } : i))
        set({ items: updatedItems })
      },

      removeItem: (index) => {
        const items = get().items
        set({ items: items.filter((_, idx) => idx !== index) })
      },

      clearItems: () => set({ items: [], currentItem: null, editingIndex: null }),

      // Editar item existente
      startEditItem: (index) => {
        const items = get().items
        const item = items[index]
        if (item) {
          set({
            editingIndex: index,
            currentItem: {
              category: item.category,
              productId: item.productId,
              productName: item.productName,
              productSlug: item.productSlug,
            },
            selectedProducts: [item.productId], // Restaurar seleção para edit flow
            step: 3, // Pula direto para Step 3 (detalhes) ao editar
          })
        }
      },

      cancelEditItem: () => {
        const items = get().items
        set({
          editingIndex: null,
          currentItem: null,
          selectedProducts: [], // Limpar produtos selecionados ao cancelar
          step: items.length > 0 ? 4 : 1, // Se tem itens, vai pro resumo
        })
      },

      saveEditItem: (data) => {
        const { editingIndex, items } = get()
        if (editingIndex !== null && items[editingIndex]) {
          const updatedItems = items.map((item, idx) =>
            idx === editingIndex ? { ...item, ...data } : item
          )
          set({
            items: updatedItems,
            editingIndex: null,
            currentItem: null,
            step: 4, // Volta pro resumo do item
          })
        }
      },

      // Adicionar mais itens - volta para o Step 1
      startNewItem: () => {
        set({
          currentItem: null,
          editingIndex: null,
          selectedProducts: [],
          selectedCategories: [],
          productsToDetail: [],
          currentProductIndex: 0,
          step: 1,
        })
      },

      setCustomerData: (data) => set({ customerData: data }),

      setScheduleData: (data) => set({ scheduleData: data }),

      // AI-CHAT Sprint P1.3: Import data from AI conversation
      importFromAI: (aiQuoteData) => {
        const itemsWithIds: QuoteItem[] = aiQuoteData.items.map((item) => ({
          ...item,
          id: generateItemId(),
        }))

        set({
          items: itemsWithIds,
          customerData: (aiQuoteData.customerData as CustomerData | null) || null,
          scheduleData: (aiQuoteData.scheduleData as ScheduleData | null) || null,
          source: 'WEBSITE',
          step: 4, // Go directly to Step 4 (Item Review) per user decision
          currentItem: null,
          editingIndex: null,
          selectedProducts: [],
          ...updateActivity(),
        })
      },

      // AI-CHAT Sprint P1.3: Clear everything for a fresh quote
      clearForNewQuote: () => set({ ...initialState, ...updateActivity() }),

      reset: () => set(initialState),

      getTotalItems: () => {
        return get().items.reduce((acc, item) => acc + item.quantity, 0)
      },

      getEstimatedTotal: () => {
        return get().items.reduce((acc, item) => {
          return acc + (item.estimatedPrice || 0) * item.quantity
        }, 0)
      },
    }),
    {
      name: 'versati-quote',
      partialize: (state) => ({
        step: state.step, // FQ.5.1: Persistir step atual
        items: state.items,
        currentItem: state.currentItem,
        editingIndex: state.editingIndex, // FQ.6: Persistir índice de edição
        selectedProducts: state.selectedProducts, // FQ.6: Persistir produtos selecionados (E2E fix)
        customerData: state.customerData,
        scheduleData: state.scheduleData,
        source: state.source,
        lastActivity: state.lastActivity, // FQ.5.4: Persistir última atividade
        selectedCategories: state.selectedCategories,
        productsToDetail: state.productsToDetail,
        currentProductIndex: state.currentProductIndex,
      }),
    }
  )
)
