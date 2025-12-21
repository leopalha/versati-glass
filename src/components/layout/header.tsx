'use client'

import Link from 'next/link'
import { Menu, X, User, LogOut, ShoppingCart, LayoutDashboard } from 'lucide-react'
import { useState, useCallback, useMemo, useRef, useEffect } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Logo } from '@/components/shared/logo'
import { ThemeSwitcher } from '@/components/ui/theme-switcher'
import { cn } from '@/lib/utils'
import { useQuoteStore } from '@/store/quote-store'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Produtos', href: '/produtos' },
  { name: 'Serviços', href: '/servicos' },
  { name: 'Portfólio', href: '/portfolio' },
  { name: 'Contato', href: '/contato' },
]

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isSigningOut, setIsSigningOut] = useState(false)
  const { data: session, status } = useSession()
  // Mostrar loading durante o carregamento inicial OU durante o logout
  const isLoading = status === 'loading' || isSigningOut
  const { items, setStep } = useQuoteStore()
  const cartItemsCount = items.length

  // Cache das iniciais para evitar mudança visual durante logout
  const cachedInitialsRef = useRef<string>('')

  const handleSignOut = useCallback(async () => {
    setIsSigningOut(true)
    await signOut({ callbackUrl: '/' })
  }, [])

  const getInitials = useCallback((name?: string | null) => {
    if (!name) return ''
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }, [])

  // Atualizar cache das iniciais quando a sessão muda (mas não limpar durante logout)
  useEffect(() => {
    if (session?.user?.name && !isSigningOut) {
      cachedInitialsRef.current = getInitials(session.user.name)
    }
  }, [session?.user?.name, isSigningOut, getInitials])

  // Usar iniciais cacheadas para evitar flash de 'U' durante logout
  const userInitials = useMemo(() => {
    if (isSigningOut) return cachedInitialsRef.current
    return getInitials(session?.user?.name) || cachedInitialsRef.current
  }, [session?.user?.name, getInitials, isSigningOut])

  return (
    <header className="bg-theme-header fixed left-0 right-0 top-0 z-40 border-b border-white/10 backdrop-blur-sm">
      <nav className="container-custom flex items-center justify-between py-4" aria-label="Global">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Logo className="h-8 w-auto" />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex lg:gap-x-8">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-header-secondary text-sm font-medium transition-colors hover:text-accent-400"
            >
              {item.name}
            </Link>
          ))}
        </div>

        {/* Desktop Actions */}
        <div className="hidden lg:flex lg:items-center lg:gap-x-4">
          {/* Cart Button */}
          <Link
            href="/orcamento"
            className="text-header-secondary hover:text-header-primary relative transition-colors"
            onClick={(e) => {
              // Se já estiver na página de orçamento e houver itens, vai para o carrinho
              if (window.location.pathname === '/orcamento' && cartItemsCount > 0) {
                e.preventDefault()
                setStep(4) // Go to cart step
              }
            }}
          >
            <ShoppingCart className="h-6 w-6" />
            {cartItemsCount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-accent-500 text-xs font-bold text-neutral-900">
                {cartItemsCount}
              </span>
            )}
          </Link>

          <ThemeSwitcher variant="dropdown" showLabel={false} />
          {isLoading ? (
            <div className="h-10 w-20 animate-pulse rounded-md bg-white/10" />
          ) : session?.user ? (
            <>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-10 w-10 rounded-full hover:bg-white/10"
                  >
                    <Avatar className="h-10 w-10">
                      <AvatarImage
                        src={session.user.image || undefined}
                        alt={session.user.name || ''}
                      />
                      <AvatarFallback className="bg-accent-500 text-white">
                        {userInitials}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      {session.user.name && (
                        <p className="text-theme-primary font-medium">{session.user.name}</p>
                      )}
                      {session.user.email && (
                        <p className="text-theme-muted text-xs">{session.user.email}</p>
                      )}
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href={session.user.role === 'ADMIN' ? '/admin' : '/portal'}>
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      {session.user.role === 'ADMIN' ? 'Portal do Admin' : 'Portal do Cliente'}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href={session.user.role === 'ADMIN' ? '/admin/perfil' : '/portal/perfil'}>
                      <User className="mr-2 h-4 w-4" />
                      Minha Conta
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="text-error">
                    <LogOut className="mr-2 h-4 w-4" />
                    Sair
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Button
                variant="ghost"
                asChild
                className="text-header-secondary hover:text-header-primary hover:bg-white/10"
              >
                <Link href="/login">Entrar</Link>
              </Button>
              <Button asChild className="bg-[#C9A962] text-black hover:bg-[#B8944E]">
                <Link href="/orcamento">Fazer Orçamento</Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="flex lg:hidden">
          <button
            type="button"
            className="text-header-secondary hover:text-header-primary inline-flex items-center justify-center rounded-md p-2.5"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Menu"
            aria-expanded={mobileMenuOpen}
          >
            <span className="sr-only">Abrir menu de navegação</span>
            {mobileMenuOpen ? (
              <X className="h-6 w-6" aria-hidden="true" />
            ) : (
              <Menu className="h-6 w-6" aria-hidden="true" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <div className={cn('bg-theme-header lg:hidden', !mobileMenuOpen && 'hidden')}>
        <div className="space-y-1 px-4 pb-3 pt-2">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-header-secondary block rounded-md px-3 py-2 text-base font-medium hover:bg-white/10 hover:text-accent-400"
              onClick={() => setMobileMenuOpen(false)}
            >
              {item.name}
            </Link>
          ))}

          {/* Mobile Cart Link */}
          <Link
            href="/orcamento"
            className="text-header-secondary flex items-center justify-between rounded-md px-3 py-2 text-base font-medium hover:bg-white/10 hover:text-accent-400"
            onClick={(e) => {
              if (window.location.pathname === '/orcamento' && cartItemsCount > 0) {
                e.preventDefault()
                setStep(4)
              }
              setMobileMenuOpen(false)
            }}
          >
            <span>Carrinho</span>
            {cartItemsCount > 0 && (
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-accent-500 text-xs font-bold text-neutral-900">
                {cartItemsCount}
              </span>
            )}
          </Link>

          <div className="mt-4 space-y-2 px-3">
            <div className="mb-4 flex items-center justify-between rounded-md bg-white/10 p-3">
              <span className="text-header-secondary text-sm">Tema</span>
              <ThemeSwitcher variant="compact" showLabel={false} />
            </div>
            {session?.user ? (
              <>
                <div className="mb-4 flex items-center gap-3 rounded-md bg-white/10 p-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={session.user.image || undefined} />
                    <AvatarFallback className="bg-accent-500 text-white">
                      {userInitials}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-header-primary font-medium">{session.user.name}</p>
                    <p className="text-header-muted text-xs">{session.user.email}</p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  className="text-header-primary w-full border-white/20 hover:bg-white/10"
                  asChild
                >
                  <Link href={session.user.role === 'ADMIN' ? '/admin' : '/portal'}>
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    {session.user.role === 'ADMIN' ? 'Portal do Admin' : 'Portal do Cliente'}
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  className="text-header-primary w-full border-white/20 hover:bg-white/10"
                  asChild
                >
                  <Link href={session.user.role === 'ADMIN' ? '/admin/perfil' : '/portal/perfil'}>
                    <User className="mr-2 h-4 w-4" />
                    Minha Conta
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-error hover:bg-error/10"
                  onClick={handleSignOut}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sair
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="outline"
                  className="text-header-primary w-full border-white/20 hover:bg-white/10"
                  asChild
                >
                  <Link href="/login">Entrar</Link>
                </Button>
                <Button className="w-full bg-[#C9A962] text-black hover:bg-[#B8944E]" asChild>
                  <Link href="/orcamento">Fazer Orçamento</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
