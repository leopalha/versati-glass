import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export const metadata: Metadata = {
  title: 'Portfólio - Versati Glass',
  description:
    'Conheça nossos projetos realizados em residências e estabelecimentos comerciais de alto padrão.',
}


const projects = [
  {
    id: 1,
    title: 'Residência Alto Padrão - Leblon',
    category: 'residencial',
    location: 'Leblon, Rio de Janeiro',
    year: '2024',
    description:
      'Box de banheiro premium com vidro temperado incolor, guarda-corpo de vidro para escada interna e espelhos decorativos com LED.',
    image: '/images/portfolio/leblon-1.jpg',
    images: [
      '/images/portfolio/leblon-1.jpg',
      '/images/portfolio/leblon-2.jpg',
      '/images/portfolio/leblon-3.jpg',
    ],
    services: ['Box Premium', 'Guarda-Corpo', 'Espelhos LED'],
  },
  {
    id: 2,
    title: 'Escritório Corporativo - Barra da Tijuca',
    category: 'comercial',
    location: 'Barra da Tijuca, Rio de Janeiro',
    year: '2024',
    description:
      'Divisórias de vidro para salas de reunião, portas de vidro temperado e fachada de vidro com controle solar.',
    image: '/images/portfolio/barra-1.jpg',
    images: [
      '/images/portfolio/barra-1.jpg',
      '/images/portfolio/barra-2.jpg',
      '/images/portfolio/barra-3.jpg',
    ],
    services: ['Divisórias', 'Fachada de Vidro', 'Portas de Vidro'],
  },
  {
    id: 3,
    title: 'Cobertura Duplex - Ipanema',
    category: 'residencial',
    location: 'Ipanema, Rio de Janeiro',
    year: '2023',
    description:
      'Guarda-corpo de vidro para sacada com vista para o mar, box de banheiro com acabamento premium e cobertura de vidro para área gourmet.',
    image: '/images/portfolio/ipanema-1.jpg',
    images: [
      '/images/portfolio/ipanema-1.jpg',
      '/images/portfolio/ipanema-2.jpg',
      '/images/portfolio/ipanema-3.jpg',
    ],
    services: ['Guarda-Corpo', 'Box Premium', 'Cobertura de Vidro'],
  },
  {
    id: 4,
    title: 'Loja de Luxo - Shopping da Gávea',
    category: 'comercial',
    location: 'Gávea, Rio de Janeiro',
    year: '2023',
    description:
      'Fachada de vidro temperado, portas automáticas e vitrines com iluminação integrada.',
    image: '/images/portfolio/gavea-1.jpg',
    images: [
      '/images/portfolio/gavea-1.jpg',
      '/images/portfolio/gavea-2.jpg',
      '/images/portfolio/gavea-3.jpg',
    ],
    services: ['Fachada', 'Portas Automáticas', 'Vitrines'],
  },
  {
    id: 5,
    title: 'Apartamento Moderno - Botafogo',
    category: 'residencial',
    location: 'Botafogo, Rio de Janeiro',
    year: '2023',
    description:
      'Divisória de vidro para home office, espelhos decorativos e box de banheiro com vidro fumê.',
    image: '/images/portfolio/botafogo-1.jpg',
    images: [
      '/images/portfolio/botafogo-1.jpg',
      '/images/portfolio/botafogo-2.jpg',
      '/images/portfolio/botafogo-3.jpg',
    ],
    services: ['Divisórias', 'Espelhos', 'Box'],
  },
  {
    id: 6,
    title: 'Sede Corporativa - Centro',
    category: 'corporativo',
    location: 'Centro, Rio de Janeiro',
    year: '2023',
    description:
      'Projeto completo de envidraçamento incluindo fachada, divisórias de escritório e salas de reunião.',
    image: '/images/portfolio/centro-1.jpg',
    images: [
      '/images/portfolio/centro-1.jpg',
      '/images/portfolio/centro-2.jpg',
      '/images/portfolio/centro-3.jpg',
    ],
    services: ['Fachada', 'Divisórias', 'Projeto Corporativo'],
  },
  {
    id: 7,
    title: 'Casa de Praia - Joatinga',
    category: 'residencial',
    location: 'Joatinga, Rio de Janeiro',
    year: '2022',
    description:
      'Envidraçamento completo com fachada de vidro, guarda-corpo e cobertura de piscina.',
    image: '/images/portfolio/joatinga-1.jpg',
    images: [
      '/images/portfolio/joatinga-1.jpg',
      '/images/portfolio/joatinga-2.jpg',
      '/images/portfolio/joatinga-3.jpg',
    ],
    services: ['Fachada', 'Guarda-Corpo', 'Cobertura'],
  },
  {
    id: 8,
    title: 'Restaurante Premium - Lagoa',
    category: 'comercial',
    location: 'Lagoa, Rio de Janeiro',
    year: '2022',
    description:
      'Divisórias de vidro acústico, fachada frontal e portas de entrada automáticas.',
    image: '/images/portfolio/lagoa-1.jpg',
    images: [
      '/images/portfolio/lagoa-1.jpg',
      '/images/portfolio/lagoa-2.jpg',
      '/images/portfolio/lagoa-3.jpg',
    ],
    services: ['Divisórias Acústicas', 'Fachada', 'Portas Automáticas'],
  },
  {
    id: 9,
    title: 'Mansão Contemporânea - São Conrado',
    category: 'residencial',
    location: 'São Conrado, Rio de Janeiro',
    year: '2022',
    description:
      'Projeto completo incluindo fachada de vidro, guarda-corpos, box de banheiros e espelhos.',
    image: '/images/portfolio/sao-conrado-1.jpg',
    images: [
      '/images/portfolio/sao-conrado-1.jpg',
      '/images/portfolio/sao-conrado-2.jpg',
      '/images/portfolio/sao-conrado-3.jpg',
    ],
    services: ['Fachada', 'Guarda-Corpo', 'Box', 'Espelhos'],
  },
]

export default function PortfolioPage() {
  return (
    <div className="min-h-screen bg-neutral-950">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-neutral-900 to-neutral-950 px-6 py-24">
        <div className="absolute inset-0 bg-[url('/images/hero-pattern.svg')] opacity-5" />
        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <h1 className="mb-6 font-display text-5xl font-bold text-white md:text-6xl lg:text-7xl">
            Portfólio
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-neutral-300 md:text-xl">
            Conheça alguns dos nossos projetos realizados com excelência e
            dedicação
          </p>
        </div>
      </section>

      {/* Filter */}
      <section className="px-6 py-12">
        <div className="mx-auto max-w-7xl">
          <div className="flex justify-center">
            <select className="w-full max-w-xs rounded-md border border-neutral-300 bg-neutral-250 px-4 py-2 text-sm text-white focus:border-gold-500 focus:outline-none focus:ring-2 focus:ring-gold-500/20">
              <option value="all">Todos os Projetos</option>
              <option value="residencial">Residencial</option>
              <option value="comercial">Comercial</option>
              <option value="corporativo">Corporativo</option>
            </select>
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="px-6 pb-20">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <Card key={project.id} variant="hover" className="group overflow-hidden">
                <div className="relative aspect-[4/3] overflow-hidden bg-neutral-800">
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-transparent opacity-60" />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <Badge variant="gold" className="mb-2">
                      {project.category === 'residencial'
                        ? 'Residencial'
                        : project.category === 'comercial'
                          ? 'Comercial'
                          : 'Corporativo'}
                    </Badge>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="mb-2 text-xl font-bold text-white">
                    {project.title}
                  </h3>
                  <p className="mb-1 text-sm text-neutral-500">
                    {project.location} • {project.year}
                  </p>
                  <p className="mb-4 text-sm text-neutral-400">
                    {project.description}
                  </p>
                  <div className="mb-4 flex flex-wrap gap-2">
                    {project.services.map((service, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {service}
                      </Badge>
                    ))}
                  </div>
                  <Button asChild variant="outline" className="w-full">
                    <Link href={`/portfolio/${project.id}`}>
                      Ver Projeto Completo
                    </Link>
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-4xl rounded-2xl bg-gradient-to-br from-gold-900/20 to-neutral-900 p-12 text-center">
          <h2 className="mb-4 font-display text-3xl font-bold text-white md:text-4xl">
            Quer Ver Seu Projeto Aqui?
          </h2>
          <p className="mb-8 text-lg text-neutral-300">
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
