import Link from 'next/link'
import { Home, Search, ArrowLeft, MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-neutral-950 px-4 text-center">
      {/* Decorative glass effect */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/4 h-80 w-80 rounded-full bg-gold-500/5 blur-3xl" />
        <div className="absolute -bottom-40 right-1/4 h-80 w-80 rounded-full bg-gold-500/5 blur-3xl" />
      </div>

      <div className="relative z-10">
        {/* 404 Number */}
        <h1 className="font-display text-[150px] font-bold leading-none text-gold-500/20 sm:text-[200px]">
          404
        </h1>

        {/* Message */}
        <div className="-mt-8 sm:-mt-12">
          <h2 className="mb-4 font-display text-3xl font-bold text-white sm:text-4xl">
            Pagina nao encontrada
          </h2>
          <p className="mx-auto mb-8 max-w-md text-neutral-400">
            A pagina que voce esta procurando pode ter sido removida, renomeada ou esta
            temporariamente indisponivel.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Button asChild size="lg">
            <Link href="/">
              <Home className="mr-2 h-5 w-5" />
              Voltar ao Inicio
            </Link>
          </Button>

          <Button asChild variant="outline" size="lg">
            <Link href="/produtos">
              <Search className="mr-2 h-5 w-5" />
              Ver Produtos
            </Link>
          </Button>
        </div>

        {/* Additional Links */}
        <div className="mt-12 flex flex-col items-center gap-4 text-sm text-neutral-500 sm:flex-row sm:justify-center">
          <Link href="/orcamento" className="flex items-center gap-1 hover:text-gold-500">
            <ArrowLeft className="h-4 w-4" />
            Solicitar Orcamento
          </Link>
          <span className="hidden sm:inline">|</span>
          <Link
            href="https://wa.me/5521982536229"
            className="flex items-center gap-1 hover:text-green-500"
          >
            <MessageCircle className="h-4 w-4" />
            Falar pelo WhatsApp
          </Link>
        </div>
      </div>
    </div>
  )
}
