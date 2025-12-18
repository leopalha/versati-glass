'use client'

/**
 * OMNICHANNEL Sprint 1 - Task 4: Cross-Channel Notification
 *
 * Componente que exibe notificação quando mensagem WhatsApp chega
 * enquanto cliente está no web chat
 */

import { useEffect } from 'react'
import { toast } from 'sonner'
import { MessageSquare, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface CrossChannelNotificationProps {
  message: {
    id: string
    content: string
    timestamp: string
    senderType: string
  }
  onDismiss: () => void
}

export function CrossChannelNotification({
  message,
  onDismiss
}: CrossChannelNotificationProps) {
  useEffect(() => {
    // Exibir toast quando nova mensagem chegar
    const toastId = toast.custom(
      (t) => (
        <div className="bg-green-600 text-white rounded-lg shadow-lg p-4 max-w-md">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              <MessageSquare className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold mb-1">
                📱 Resposta via WhatsApp
              </p>
              <p className="text-sm opacity-90 line-clamp-2">
                {message.content}
              </p>
              <p className="text-xs opacity-75 mt-1">
                {message.senderType === 'AI' ? 'Assistente' : 'Atendente'}
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="flex-shrink-0 h-6 w-6 text-white hover:bg-green-700"
              onClick={() => {
                toast.dismiss(t)
                onDismiss()
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ),
      {
        duration: 10000, // 10s
        position: 'top-right'
      }
    )

    return () => {
      toast.dismiss(toastId)
    }
  }, [message, onDismiss])

  return null // Toast é renderizado pelo sonner
}

/**
 * Hook helper para exibir notificação cross-channel
 */
export function showCrossChannelNotification(
  message: { content: string; senderType: string }
) {
  toast.custom(
    (t) => (
      <div className="bg-green-600 text-white rounded-lg shadow-lg p-4 max-w-md">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            <MessageSquare className="h-5 w-5" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold mb-1">
              📱 Nova resposta via WhatsApp
            </p>
            <p className="text-sm opacity-90 line-clamp-2">
              {message.content}
            </p>
            <p className="text-xs opacity-75 mt-1">
              {message.senderType === 'AI' ? 'Assistente Virtual' : 'Atendente Humano'}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="flex-shrink-0 h-6 w-6 text-white hover:bg-green-700"
            onClick={() => toast.dismiss(t)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    ),
    {
      duration: 10000,
      position: 'top-right'
    }
  )
}
