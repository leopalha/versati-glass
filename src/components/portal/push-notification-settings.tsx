'use client'

import { useState } from 'react'
import { Bell, BellOff, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { usePushNotifications } from '@/hooks/use-push-notifications'
import { useToast } from '@/components/ui/toast/use-toast'

export function PushNotificationSettings() {
  const { isSupported, isSubscribed, isLoading, permission, subscribe, unsubscribe } =
    usePushNotifications()
  const { toast } = useToast()
  const [actionLoading, setActionLoading] = useState(false)

  if (!isSupported) {
    return (
      <div className="rounded-lg border border-neutral-800 bg-neutral-900 p-4">
        <div className="flex items-center gap-3">
          <BellOff className="h-5 w-5 text-neutral-500" />
          <div>
            <p className="font-medium text-white">Notificações Push</p>
            <p className="text-sm text-neutral-400">Seu navegador não suporta notificações push</p>
          </div>
        </div>
      </div>
    )
  }

  const handleToggle = async () => {
    setActionLoading(true)
    try {
      if (isSubscribed) {
        await unsubscribe()
        toast({
          title: 'Notificações desativadas',
          description: 'Você não receberá mais notificações push',
        })
      } else {
        await subscribe()
        toast({
          title: 'Notificações ativadas',
          description: 'Você receberá notificações sobre seus pedidos e mensagens',
        })
      }
    } catch (error) {
      toast({
        variant: 'error',
        title: 'Erro',
        description:
          error instanceof Error ? error.message : 'Não foi possível alterar as notificações',
      })
    } finally {
      setActionLoading(false)
    }
  }

  const getStatusText = () => {
    if (isLoading) return 'Carregando...'
    if (permission === 'denied') return 'Bloqueadas pelo navegador'
    if (isSubscribed) return 'Ativadas'
    return 'Desativadas'
  }

  const getStatusColor = () => {
    if (permission === 'denied') return 'text-red-500'
    if (isSubscribed) return 'text-green-500'
    return 'text-neutral-400'
  }

  return (
    <div className="rounded-lg border border-neutral-800 bg-neutral-900 p-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {isSubscribed ? (
            <Bell className="h-5 w-5 text-gold-500" />
          ) : (
            <BellOff className="h-5 w-5 text-neutral-500" />
          )}
          <div>
            <p className="font-medium text-white">Notificações Push</p>
            <p className={`text-sm ${getStatusColor()}`}>{getStatusText()}</p>
          </div>
        </div>

        {permission !== 'denied' && (
          <Button
            onClick={handleToggle}
            disabled={isLoading || actionLoading}
            variant={isSubscribed ? 'outline' : 'default'}
            size="sm"
          >
            {actionLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processando...
              </>
            ) : isSubscribed ? (
              <>
                <BellOff className="mr-2 h-4 w-4" />
                Desativar
              </>
            ) : (
              <>
                <Bell className="mr-2 h-4 w-4" />
                Ativar
              </>
            )}
          </Button>
        )}
      </div>

      {permission === 'denied' && (
        <div className="mt-3 rounded-md bg-red-900/20 p-3">
          <p className="text-xs text-red-300">
            As notificações foram bloqueadas. Para ativá-las, você precisa permitir notificações nas
            configurações do navegador.
          </p>
        </div>
      )}

      {!isSubscribed && permission !== 'denied' && (
        <div className="mt-3 rounded-md bg-gold-900/20 p-3">
          <p className="text-xs text-gold-300">
            Receba atualizações instantâneas sobre seus pedidos, mensagens e orçamentos diretamente
            no seu dispositivo.
          </p>
        </div>
      )}
    </div>
  )
}
