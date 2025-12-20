import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { PortfolioGrid } from '@/components/portfolio/portfolio-grid'

export const metadata: Metadata = {
  title: 'Portfólio - Versati Glass',
  description:
    'Conheça nossos projetos realizados em residências e estabelecimentos comerciais de alto padrão.',
}

export default function PortfolioPage() {
  return (
    <div className="bg-theme-primary min-h-screen">
      {/* Hero */}
      <section className="from-theme-secondary to-theme-primary relative overflow-hidden bg-gradient-to-b px-6 py-24">
        <div className="absolute inset-0 bg-[url('/images/hero-pattern.svg')] opacity-5" />
        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <h1 className="text-theme-primary mb-6 font-display text-5xl font-bold md:text-6xl lg:text-7xl">
            Portfólio
          </h1>
          <p className="text-theme-muted mx-auto max-w-2xl text-lg md:text-xl">
            Conheça alguns dos nossos projetos realizados com excelência e dedicação
          </p>
        </div>
      </section>

      {/* Portfolio Grid (Client Component) */}
      <PortfolioGrid />

      {/* CTA */}
      <section className="px-6 py-20">
        <div className="from-accent-900/20 to-theme-secondary mx-auto max-w-4xl rounded-2xl bg-gradient-to-br p-12 text-center">
          <h2 className="text-theme-primary mb-4 font-display text-3xl font-bold md:text-4xl">
            Quer Ver Seu Projeto Aqui?
          </h2>
          <p className="text-theme-secondary mb-8 text-lg">
            Entre em contato e transforme sua ideia em realidade
          </p>
          <Button asChild size="lg">
            <Link href="/orcamento">
              Fazer Orçamento Grátis
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
