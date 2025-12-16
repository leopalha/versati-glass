'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  ShoppingBag,
  FileText,
  Calendar,
  FileImage,
  User,
  Settings,
  LogOut,
  Package,
  Users,
  MessageSquare
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Logo } from '@/components/shared/logo'

// Navegação do Portal do Cliente
const portalNavigation = [
  { name: 'Dashboard', href: '/portal', icon: LayoutDashboard },
  { name: 'Minhas Ordens', href: '/portal/ordens', icon: ShoppingBag },
  { name: 'Orçamentos', href: '/portal/orcamentos', icon: FileText },
  { name: 'Agendamentos', href: '/portal/agenda', icon: Calendar },
  { name: 'Documentos', href: '/portal/documentos', icon: FileImage },
  { name: 'Perfil', href: '/portal/perfil', icon: User },
]

// Navegação do Admin
const adminNavigation = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Ordens', href: '/admin/ordens', icon: ShoppingBag },
  { name: 'Orçamentos', href: '/admin/orcamentos', icon: FileText },
  { name: 'Produtos', href: '/admin/produtos', icon: Package },
  { name: 'Clientes', href: '/admin/clientes', icon: Users },
  { name: 'Agenda', href: '/admin/agenda', icon: Calendar },
  { name: 'Conversas', href: '/admin/conversas', icon: MessageSquare },
  { name: 'Configurações', href: '/admin/config', icon: Settings },
]

interface SidebarProps {
  type?: 'portal' | 'admin'
}

export function Sidebar({ type = 'portal' }: SidebarProps) {
  const pathname = usePathname()
  const navigation = type === 'admin' ? adminNavigation : portalNavigation

  return (
    <div className="flex h-full w-64 flex-col border-r border-neutral-300 bg-neutral-100">
      {/* Logo */}
      <div className="flex h-16 shrink-0 items-center border-b border-neutral-300 px-6">
        <Logo className="h-8 w-auto" />
      </div>

      {/* Navigation */}
      <nav className="flex flex-1 flex-col gap-y-2 overflow-y-auto px-4 py-6">
        <ul role="list" className="flex flex-1 flex-col gap-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={cn(
                    'group flex gap-x-3 rounded-md p-3 text-sm font-medium leading-6 transition-colors',
                    isActive
                      ? 'bg-gold-500/10 text-gold-500'
                      : 'text-neutral-700 hover:text-gold-500 hover:bg-neutral-200'
                  )}
                >
                  <item.icon
                    className={cn(
                      'h-5 w-5 shrink-0',
                      isActive ? 'text-gold-500' : 'text-neutral-500 group-hover:text-gold-500'
                    )}
                    aria-hidden="true"
                  />
                  {item.name}
                </Link>
              </li>
            )
          })}
        </ul>

        {/* Logout */}
        <button
          className="group flex w-full gap-x-3 rounded-md p-3 text-sm font-medium leading-6 text-neutral-700 hover:text-error hover:bg-error/10 transition-colors"
          onClick={() => {
            // Implement logout
            console.log('Logout')
          }}
        >
          <LogOut className="h-5 w-5 shrink-0 text-neutral-500 group-hover:text-error" aria-hidden="true" />
          Sair
        </button>
      </nav>
    </div>
  )
}
