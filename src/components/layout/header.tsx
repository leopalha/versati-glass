'use client'

import Link from 'next/link'
import { Menu, X, User, LogOut } from 'lucide-react'
import { useState } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Logo } from '@/components/shared/logo'
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
    <header className="fixed top-0 left-0 right-0 z-40 bg-neutral-50/95 backdrop-blur-sm border-b border-neutral-300">
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
              className="text-sm font-medium text-neutral-700 hover:text-gold-500 transition-colors"
            >
              {item.name}
            </Link>
          ))}
        </div>

        {/* Desktop Actions */}
        <div className="hidden lg:flex lg:items-center lg:gap-x-4">
          {isLoading ? (
            <div className="h-10 w-20 animate-pulse rounded-md bg-neutral-200" />
          ) : session?.user ? (
            <>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={session.user.image || undefined} alt={session.user.name || ''} />
                      <AvatarFallback className="bg-gold-500 text-neutral-950">
                        {getInitials(session.user.name)}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      {session.user.name && (
                        <p className="font-medium text-white">{session.user.name}</p>
                      )}
                      {session.user.email && (
                        <p className="text-xs text-neutral-500">{session.user.email}</p>
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
              <Button variant="ghost" asChild>
                <Link href="/login">Entrar</Link>
              </Button>
              <Button asChild>
                <Link href="/orcamento">Fazer Orcamento</Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="flex lg:hidden">
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-md p-2.5 text-neutral-700"
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
      <div className={cn('lg:hidden', !mobileMenuOpen && 'hidden')}>
        <div className="space-y-1 px-4 pb-3 pt-2">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="block rounded-md px-3 py-2 text-base font-medium text-neutral-700 hover:bg-neutral-200 hover:text-gold-500"
              onClick={() => setMobileMenuOpen(false)}
            >
              {item.name}
            </Link>
          ))}
          <div className="mt-4 space-y-2 px-3">
            {session?.user ? (
              <>
                <div className="mb-4 flex items-center gap-3 rounded-md bg-neutral-200 p-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={session.user.image || undefined} />
                    <AvatarFallback className="bg-gold-500 text-neutral-950">
                      {getInitials(session.user.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-white">{session.user.name}</p>
                    <p className="text-xs text-neutral-500">{session.user.email}</p>
                  </div>
                </div>
                <Button variant="outline" className="w-full" asChild>
                  <Link href={session.user.role === 'ADMIN' ? '/admin' : '/portal'}>
                    Minha Conta
                  </Link>
                </Button>
                <Button variant="ghost" className="w-full text-error" onClick={handleSignOut}>
                  Sair
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/login">Entrar</Link>
                </Button>
                <Button className="w-full" asChild>
                  <Link href="/orcamento">Fazer Orcamento</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
