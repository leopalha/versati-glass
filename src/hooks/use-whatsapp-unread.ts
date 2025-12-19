'use client'

import { useEffect, useState } from 'react'

/**
 * Hook to track unread WhatsApp messages count in real-time
 * Uses Server-Sent Events for instant updates
 */
export function useWhatsAppUnread() {
  const [unreadCount, setUnreadCount] = useState(0)
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    let eventSource: EventSource | null = null

    const connect = () => {
      try {
        // TEMP FIX: WhatsAppMessage model not in schema yet
        // Disabled to prevent 500 errors
        // TODO: Add WhatsAppMessage model to schema.prisma
        /*
        // Initial fetch
        fetch('/api/whatsapp/messages')
          .then((res) => res.json())
          .then((data) => {
            const total =
              data.conversations?.reduce(
                (sum: number, conv: { unreadCount: number }) => sum + conv.unreadCount,
                0
              ) || 0
            setUnreadCount(total)
          })
          .catch(() => {
            // Ignore errors
          })
        */

        // Connect to SSE for real-time updates
        eventSource = new EventSource('/api/whatsapp/stream')

        eventSource.onopen = () => {
          setIsConnected(true)
        }

        eventSource.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data)

            if (data.type === 'new_message' && data.data.direction === 'INBOUND') {
              // Increment unread count for incoming messages
              setUnreadCount((prev) => prev + 1)
            }
          } catch (error) {
            // Ignore parse errors
          }
        }

        eventSource.onerror = () => {
          setIsConnected(false)
          eventSource?.close()

          // Reconnect after 10 seconds
          setTimeout(() => {
            connect()
          }, 10000)
        }
      } catch (error) {
        console.error('[useWhatsAppUnread] Error:', error)
      }
    }

    connect()

    return () => {
      if (eventSource) {
        eventSource.close()
      }
    }
  }, [])

  return { unreadCount, isConnected }
}
