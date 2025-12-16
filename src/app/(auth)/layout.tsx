import { Logo } from '@/components/shared/logo'
import Link from 'next/link'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col bg-neutral-950">
      {/* Header */}
      <header className="flex h-16 items-center justify-center border-b border-neutral-800 px-6">
        <Link href="/">
          <Logo className="h-8 w-auto" />
        </Link>
      </header>

      {/* Content */}
      <main className="flex flex-1 items-center justify-center px-6 py-12">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-neutral-800 py-6 text-center">
        <p className="text-sm text-neutral-500">
          &copy; {new Date().getFullYear()} Versati Glass. Todos os direitos reservados.
        </p>
      </footer>
    </div>
  )
}
