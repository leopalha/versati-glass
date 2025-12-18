'use client'

import { useEffect } from 'react'
import { useQuoteStore } from '@/store/quote-store'
import { logger } from '@/lib/logger'

/**
 * FQ.5.4: Component que verifica timeout de inatividade (30 minutos)
 * Se o usuário ficar inativo por mais de 30 min, limpa o store
 */
export function QuoteTimeoutChecker() {
  const { lastActivity, reset, items } = useQuoteStore()

  useEffect(() => {
    // Verifica timeout apenas se há itens no carrinho
    if (!lastActivity || items.length === 0) return

    const TIMEOUT_MS = 30 * 60 * 1000 // 30 minutos
    const now = Date.now()
    const inactiveTime = now - lastActivity

    // Se passou mais de 30 minutos desde a última atividade, limpa tudo
    if (inactiveTime > TIMEOUT_MS) {
      logger.info('[QuoteStore] Session timeout - clearing quote data', {
        inactiveTime,
        lastActivity: new Date(lastActivity).toISOString(),
      })
      reset()
    }
  }, [lastActivity, items.length, reset])

  return null // Componente sem UI
}
