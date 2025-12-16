import { Logo } from '@/components/shared/logo'
import Link from 'next/link'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-theme-primary flex min-h-screen flex-col">
      {/* Header */}
      <header className="border-theme-default flex h-16 items-center justify-center border-b px-6">
        <Link href="/">
          <Logo className="h-8 w-auto" />
        </Link>
      </header>

      {/* Content */}
      <main className="flex flex-1 items-center justify-center px-6 py-12">{children}</main>

      {/* Footer */}
      <footer className="border-theme-default border-t py-6 text-center">
        <p className="text-theme-subtle text-sm">
          &copy; {new Date().getFullYear()} Versati Glass. Todos os direitos reservados.
        </p>
      </footer>
    </div>
  )
}
