'use client'

import { useState, useEffect } from 'react'
import { Bell, BellOff, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { usePushNotifications } from '@/hooks/use-push-notifications'
import { useToast } from '@/components/ui/toast/use-toast'

/**
 * Component to prompt users to enable push notifications
 */
export function PushNotificationPrompt() {
  const { isSupported, isSubscribed, subscribe, permission } = usePushNotifications()
  const { toast } = useToast()
  const [isDismissed, setIsDismissed] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Check if user dismissed the prompt before
  useEffect(() => {
    const dismissed = localStorage.getItem('push-notification-prompt-dismissed')
    setIsDismissed(dismissed === 'true')
  }, [])

  // Don't show if:
  // - Not supported
  // - Already subscribed
  // - User dismissed
  // - Permission denied
  if (!isSupported || isSubscribed || isDismissed || permission === 'denied') {
    return null
  }

  const handleEnable = async () => {
    setIsLoading(true)
    try {
      await subscribe()
      toast({
        title: 'Notificações ativadas',
        description: 'Você receberá notificações sobre seus pedidos e mensagens.',
      })
      setIsDismissed(true)
    } catch (error) {
      toast({
        variant: 'error',
        title: 'Erro ao ativar notificações',
        description:
          error instanceof Error ? error.message : 'Não foi possível ativar as notificações',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDismiss = () => {
    localStorage.setItem('push-notification-prompt-dismissed', 'true')
    setIsDismissed(true)
  }

  return (
    <div className="animate-in slide-in-from-bottom-5 fixed bottom-4 right-4 z-50 max-w-sm">
      <div className="rounded-lg border border-gold-500/20 bg-neutral-900 p-4 shadow-xl">
        <div className="mb-3 flex items-start justify-between gap-3">
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-gold-500" />
            <h3 className="font-semibold text-white">Ativar Notificações</h3>
          </div>
          <button
            onClick={handleDismiss}
            className="text-neutral-400 hover:text-white"
            aria-label="Fechar"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <p className="mb-4 text-sm text-neutral-300">
          Receba atualizações instantâneas sobre seus pedidos, mensagens e orçamentos.
        </p>

        <div className="flex gap-2">
          <Button onClick={handleEnable} disabled={isLoading} size="sm" className="flex-1">
            <Bell className="mr-2 h-4 w-4" />
            Ativar
          </Button>
          <Button onClick={handleDismiss} variant="outline" size="sm" className="flex-1">
            Agora não
          </Button>
        </div>
      </div>
    </div>
  )
}
