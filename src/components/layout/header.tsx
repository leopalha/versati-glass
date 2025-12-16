'use client'

import Link from 'next/link'
import { Menu, X, User, LogOut } from 'lucide-react'
import { useState } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Logo } from '@/components/shared/logo'
import { ThemeSwitcher } from '@/components/ui/theme-switcher'
import { cn } from '@/lib/utils'
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
  { name: 'Servicos', href: '/servicos' },
  { name: 'Portfolio', href: '/portfolio' },
  { name: 'Contato', href: '/contato' },
]

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { data: session, status } = useSession()
  const isLoading = status === 'loading'

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' })
  }

  const getInitials = (name?: string | null) => {
    if (!name) return 'U'
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

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
          <a
            href="tel:+5521982536229"
            className="text-header-secondary flex items-center gap-2 text-sm font-medium transition-colors hover:text-accent-400"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
              />
            </svg>
            +55 21 98253-6229
          </a>
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
                        {getInitials(session.user.name)}
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
          >
            <span className="sr-only">Menu</span>
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
                      {getInitials(session.user.name)}
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
                    Minha Conta
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  className="w-full text-error hover:bg-error/10"
                  onClick={handleSignOut}
                >
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
