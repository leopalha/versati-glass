import { useEffect, useState, useCallback } from 'react'
import { logger } from '@/lib/logger'

/**
 * OMNICHANNEL Sprint 1 - Task 4: Cross-Channel Updates Hook
 *
 * Hook para polling de atualizações WhatsApp enquanto cliente está no web chat
 *
 * Verifica a cada 10s se há novas mensagens WhatsApp para conversa linkada
 * Retorna callback para exibir notificação ao usuário
 */

interface CrossChannelUpdate {
  id: string
  content: string
  timestamp: string
  senderType: string
}

interface UseCrossChannelUpdatesOptions {
  conversationId?: string
  enabled?: boolean
  onUpdate?: (message: CrossChannelUpdate) => void
  pollingInterval?: number // ms (default: 10000)
}

export function useCrossChannelUpdates({
  conversationId,
  enabled = true,
  onUpdate,
  pollingInterval = 10000,
}: UseCrossChannelUpdatesOptions) {
  const [lastChecked, setLastChecked] = useState<string>(new Date().toISOString())
  const [hasUpdate, setHasUpdate] = useState(false)
  const [latestMessage, setLatestMessage] = useState<CrossChannelUpdate | null>(null)

  const checkForUpdates = useCallback(async () => {
    if (!conversationId || !enabled) return

    try {
      const params = new URLSearchParams({
        conversationId,
        lastChecked,
      })

      const response = await fetch(`/api/ai/chat/check-updates?${params}`)

      if (!response.ok) {
        logger.error('[CROSS-CHANNEL] Check updates failed:', response.status)
        return
      }

      const data = await response.json()

      if (data.hasWhatsAppUpdate && data.latestMessage) {
        logger.info('[CROSS-CHANNEL] New WhatsApp message detected:', data.latestMessage)

        setHasUpdate(true)
        setLatestMessage(data.latestMessage)
        setLastChecked(new Date().toISOString())

        // Callback para exibir notificação
        if (onUpdate) {
          onUpdate(data.latestMessage)
        }
      }
    } catch (error) {
      logger.error('[CROSS-CHANNEL] Error checking updates:', error)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversationId, enabled, lastChecked])

  useEffect(() => {
    if (!conversationId || !enabled) return

    // Check imediatamente ao montar
    checkForUpdates()

    // Setup polling interval
    const interval = setInterval(checkForUpdates, pollingInterval)

    return () => clearInterval(interval)
  }, [conversationId, enabled, pollingInterval, checkForUpdates])

  const dismissUpdate = useCallback(() => {
    setHasUpdate(false)
    setLatestMessage(null)
  }, [])

  return {
    hasUpdate,
    latestMessage,
    dismissUpdate,
  }
}
