'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  Package,
  FileText,
  Calendar,
  Users,
  MessageSquare,
  ShoppingBag,
  LogOut,
  ChevronLeft,
  Menu,
  Settings,
} from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'

const menuItems = [
  {
    href: '/admin',
    label: 'Dashboard',
    icon: LayoutDashboard,
  },
  {
    href: '/admin/pedidos',
    label: 'Pedidos',
    icon: Package,
  },
  {
    href: '/admin/orcamentos',
    label: 'Orcamentos',
    icon: FileText,
  },
  {
    href: '/admin/agendamentos',
    label: 'Agendamentos',
    icon: Calendar,
  },
  {
    href: '/admin/clientes',
    label: 'Clientes',
    icon: Users,
  },
  {
    href: '/admin/conversas',
    label: 'Conversas',
    icon: MessageSquare,
  },
  {
    href: '/admin/produtos',
    label: 'Produtos',
    icon: ShoppingBag,
  },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  const handleSignOut = () => {
    signOut({ callbackUrl: '/' })
  }

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className="bg-theme-elevated fixed left-4 top-4 z-40 rounded-lg p-2 lg:hidden"
      >
        <Menu className="h-5 w-5 text-white" />
      </button>

      {/* Mobile overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'border-theme-default bg-theme-secondary fixed left-0 top-0 z-50 flex h-screen flex-col border-r transition-all duration-300',
          isCollapsed ? 'w-20' : 'w-64',
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Logo */}
        <div className="border-theme-default flex h-16 items-center justify-between border-b px-4">
          {!isCollapsed && (
            <Link href="/admin" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-500">
                <span className="font-display text-lg font-bold text-black">V</span>
              </div>
              <span className="text-theme-primary font-display text-lg font-semibold">Admin</span>
            </Link>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="text-theme-muted hover:bg-theme-elevated hover:text-theme-primary hidden rounded-lg p-2 lg:block"
          >
            <ChevronLeft
              className={cn('h-5 w-5 transition-transform', isCollapsed && 'rotate-180')}
            />
          </button>
          <button
            onClick={() => setIsMobileOpen(false)}
            className="text-theme-muted hover:bg-theme-elevated hover:text-theme-primary rounded-lg p-2 lg:hidden"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 overflow-y-auto p-4">
          {menuItems.map((item) => {
            const isActive =
              pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href))

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileOpen(false)}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-accent-500/10 text-accent-500'
                    : 'text-theme-muted hover:bg-theme-elevated hover:text-theme-primary'
                )}
              >
                <item.icon className="h-5 w-5 flex-shrink-0" />
                {!isCollapsed && <span>{item.label}</span>}
              </Link>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="border-theme-default border-t p-4">
          <Link
            href="/admin/configuracoes"
            className={cn(
              'text-theme-muted hover:bg-theme-elevated hover:text-theme-primary mb-2 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium',
              isCollapsed && 'justify-center'
            )}
          >
            <Settings className="h-5 w-5" />
            {!isCollapsed && <span>Configuracoes</span>}
          </Link>
          <Button
            variant="ghost"
            onClick={handleSignOut}
            className={cn(
              'text-theme-muted w-full justify-start hover:bg-red-500/10 hover:text-red-500',
              isCollapsed && 'justify-center'
            )}
          >
            <LogOut className="h-5 w-5" />
            {!isCollapsed && <span className="ml-3">Sair</span>}
          </Button>
        </div>
      </aside>
    </>
  )
}
