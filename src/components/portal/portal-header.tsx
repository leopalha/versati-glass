'use client'

import { useSession } from 'next-auth/react'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { NotificationBell } from '@/components/notifications/notification-bell'

interface PortalHeaderProps {
  title: string
  subtitle?: string
  action?: React.ReactNode
}

export function PortalHeader({ title, subtitle, action }: PortalHeaderProps) {
  const { data: session } = useSession()

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-neutral-700 bg-neutral-900/95 px-6 backdrop-blur">
      <div>
        <h1 className="font-display text-xl font-bold text-white">{title}</h1>
        {subtitle && <p className="text-sm text-neutral-400">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-4">
        {/* Action button (optional) */}
        {action && <div>{action}</div>}
        {/* Search */}
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
          <Input type="search" placeholder="Buscar..." className="w-64 pl-10" />
        </div>

        {/* Notifications */}
        <NotificationBell />

        {/* User info */}
        <div className="hidden items-center gap-3 sm:flex">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gold-500/20">
            <span className="text-sm font-semibold text-gold-500">
              {session?.user?.name?.charAt(0).toUpperCase() || 'U'}
            </span>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-white">{session?.user?.name || 'Usuario'}</p>
            <p className="text-xs text-neutral-400">Cliente</p>
          </div>
        </div>
      </div>
    </header>
  )
}
