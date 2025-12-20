import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ProdutosList } from '@/components/produtos/produtos-list'

export const metadata: Metadata = {
  title: 'Produtos - Versati Glass',
  description:
    'Conheça nossa linha completa de produtos em vidro: box, espelhos, guarda-corpos, divisórias, fachadas e muito mais.',
}

export default function ProdutosPage() {
  return (
    <div className="bg-theme-primary min-h-screen px-6 py-20">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-theme-primary mb-4 font-display text-5xl font-bold md:text-6xl">
            Nossos Produtos
          </h1>
          <p className="text-theme-muted mx-auto max-w-2xl text-lg">
            Conheça nossa linha completa de soluções em vidro de alto padrão
          </p>
        </div>

        {/* Products List (Client Component) */}
        <ProdutosList />

        {/* CTA */}
        <div className="from-accent-900/20 to-theme-secondary mt-20 rounded-2xl bg-gradient-to-br p-12 text-center">
          <h2 className="text-theme-primary mb-4 font-display text-3xl font-bold md:text-4xl">
            Não Encontrou o Que Procura?
          </h2>
          <p className="text-theme-secondary mb-8 text-lg">
            Trabalhamos com soluções personalizadas para cada projeto
          </p>
          <Button asChild size="lg">
            <Link href="/contato">
              Fale com um Especialista
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
