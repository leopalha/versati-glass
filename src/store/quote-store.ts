'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type QuoteStep = 1 | 2 | 3 | 4 | 5 | 6

export interface QuoteItem {
  productId: string
  productName: string
  productSlug: string
  category: string
  description?: string
  width?: number
  height?: number
  quantity: number
  color?: string
  finish?: string
  thickness?: string
  images: string[]
  estimatedPrice?: number
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

interface QuoteState {
  step: QuoteStep
  items: QuoteItem[]
  customerData: CustomerData | null
  scheduleData: ScheduleData | null
  source: 'WEBSITE' | 'WHATSAPP' | 'PHONE' | 'WALKIN'

  // Actions
  setStep: (step: QuoteStep) => void
  nextStep: () => void
  prevStep: () => void

  addItem: (item: QuoteItem) => void
  updateItem: (index: number, item: Partial<QuoteItem>) => void
  removeItem: (index: number) => void
  clearItems: () => void

  setCustomerData: (data: CustomerData) => void
  setScheduleData: (data: ScheduleData) => void

  reset: () => void

  // Computed
  getTotalItems: () => number
  getEstimatedTotal: () => number
}

const initialState = {
  step: 1 as QuoteStep,
  items: [] as QuoteItem[],
  customerData: null,
  scheduleData: null,
  source: 'WEBSITE' as const,
}

export const useQuoteStore = create<QuoteState>()(
  persist(
    (set, get) => ({
      ...initialState,

      setStep: (step) => set({ step }),

      nextStep: () => {
        const currentStep = get().step
        if (currentStep < 6) {
          set({ step: (currentStep + 1) as QuoteStep })
        }
      },

      prevStep: () => {
        const currentStep = get().step
        if (currentStep > 1) {
          set({ step: (currentStep - 1) as QuoteStep })
        }
      },

      addItem: (item) => {
        const items = get().items
        set({ items: [...items, item] })
      },

      updateItem: (index, item) => {
        const items = get().items
        const updatedItems = items.map((i, idx) =>
          idx === index ? { ...i, ...item } : i
        )
        set({ items: updatedItems })
      },

      removeItem: (index) => {
        const items = get().items
        set({ items: items.filter((_, idx) => idx !== index) })
      },

      clearItems: () => set({ items: [] }),

      setCustomerData: (data) => set({ customerData: data }),

      setScheduleData: (data) => set({ scheduleData: data }),

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
        items: state.items,
        customerData: state.customerData,
        scheduleData: state.scheduleData,
        source: state.source,
      }),
    }
  )
)
