import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Shield, Award, Clock, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export const metadata: Metadata = {
  title: 'Versati Glass - Vidraçaria de Luxo e Esquadrias de Alta Performance',
  description:
    'Vidraçaria de alto padrão especializada em projetos residenciais e comerciais. Box, espelhos, divisórias, fachadas e soluções personalizadas com excelência.',
  keywords: [
    'vidraçaria',
    'box de vidro',
    'espelhos',
    'guarda-corpo de vidro',
    'fachada de vidro',
    'divisória de vidro',
    'esquadrias',
    'vidros temperados',
    'vidros laminados',
  ],
  openGraph: {
    title: 'Versati Glass - Vidraçaria de Luxo',
    description: 'Soluções em vidro de alto padrão para seu projeto',
    type: 'website',
  },
}

const featuredProducts = [
  {
    id: 1,
    name: 'Box de Vidro Premium',
    description: 'Box sob medida com vidro temperado 8mm, acabamento impecável',
    image: '/images/box-premium.jpg',
    price: 'A partir de R$ 1.890',
    badge: 'Mais Vendido',
  },
  {
    id: 2,
    name: 'Guarda-Corpo de Vidro',
    description: 'Segurança e elegância com vidro laminado de alta resistência',
    image: '/images/guarda-corpo.jpg',
    price: 'A partir de R$ 890/m',
    badge: 'Premium',
  },
  {
    id: 3,
    name: 'Espelho Decorativo',
    description: 'Espelhos personalizados com iluminação LED integrada',
    image: '/images/espelho.jpg',
    price: 'A partir de R$ 650',
    badge: 'Destaque',
  },
  {
    id: 4,
    name: 'Fachada de Vidro',
    description: 'Fachadas comerciais com estrutura de alta performance',
    image: '/images/fachada.jpg',
    price: 'Sob Consulta',
    badge: 'Corporativo',
  },
]

const services = [
  {
    title: 'Projetos Residenciais',
    description: 'Box, espelhos, divisórias e guarda-corpos para sua casa',
  },
  {
    title: 'Projetos Comerciais',
    description: 'Fachadas, portas e soluções corporativas de alto padrão',
  },
  {
    title: 'Manutenção e Reparo',
    description: 'Assistência técnica especializada para seus vidros',
  },
  {
    title: 'Consultoria Técnica',
    description: 'Apoio para arquitetos e engenheiros em especificações',
  },
]

const differentials = [
  {
    icon: Shield,
    title: 'Garantia Vitalícia',
    description: 'Todos os produtos com garantia estendida',
  },
  {
    icon: Award,
    title: '15 Anos de Experiência',
    description: 'Tradição e excelência em cada projeto',
  },
  {
    icon: Clock,
    title: 'Instalação Rápida',
    description: 'Prazos cumpridos com precisão',
  },
  {
    icon: Sparkles,
    title: 'Acabamento Impecável',
    description: 'Atenção aos mínimos detalhes',
  },
]

const portfolioPreview = [
  {
    title: 'Residência Alto Padrão - Leblon',
    category: 'Residencial',
    image: '/images/portfolio/leblon.jpg',
  },
  {
    title: 'Escritório Corporativo - Barra',
    category: 'Comercial',
    image: '/images/portfolio/barra.jpg',
  },
  {
    title: 'Cobertura Duplex - Ipanema',
    category: 'Residencial',
    image: '/images/portfolio/ipanema.jpg',
  },
]

const testimonials = [
  {
    name: 'Ana Paula Silveira',
    role: 'Arquiteta',
    content:
      'A Versati Glass superou todas as expectativas. O acabamento é impecável e o atendimento é excepcional.',
    rating: 5,
  },
  {
    name: 'Roberto Mendes',
    role: 'Proprietário',
    content:
      'Instalaram o box do meu banheiro em tempo recorde. Qualidade premium e equipe muito profissional.',
    rating: 5,
  },
  {
    name: 'Mariana Costa',
    role: 'Designer de Interiores',
    content:
      'Trabalho com a Versati em todos os meus projetos. Confiabilidade e qualidade garantidas.',
    rating: 5,
  },
]

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative flex min-h-[90vh] items-center justify-center overflow-hidden bg-gradient-to-b from-neutral-900 to-neutral-950 px-6 py-24">
        <div className="absolute inset-0 bg-[url('/images/hero-pattern.svg')] opacity-5" />
        <div className="relative z-10 mx-auto max-w-7xl text-center">
          <Badge variant="gold" className="mb-6 animate-fadeIn">
            Excelência em Vidros e Esquadrias
          </Badge>
          <h1 className="mb-6 font-display text-5xl font-bold leading-tight text-white md:text-7xl lg:text-8xl">
            Transforme Seu Espaço
            <br />
            <span className="bg-gradient-to-r from-gold-400 to-gold-600 bg-clip-text text-transparent">
              Com Elegância
            </span>
          </h1>
          <p className="mx-auto mb-10 max-w-2xl text-lg text-neutral-300 md:text-xl">
            Vidraçaria de alto padrão especializada em projetos residenciais e
            comerciais. Qualidade premium, instalação impecável e atendimento
            personalizado.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button asChild size="lg" className="w-full sm:w-auto">
              <Link href="/orcamento">
                Fazer Orçamento Grátis
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
              <Link href="/portfolio">Ver Portfólio</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="px-6 py-20 md:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <h2 className="mb-4 font-display text-4xl font-bold text-white md:text-5xl">
              Produtos em Destaque
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-neutral-700">
              Conheça nossas soluções mais populares
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {featuredProducts.map((product) => (
              <Card key={product.id} variant="hover" className="group overflow-hidden">
                <div className="relative aspect-square overflow-hidden bg-neutral-800">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <Badge variant="gold" className="absolute right-4 top-4">
                    {product.badge}
                  </Badge>
                </div>
                <div className="p-6">
                  <h3 className="mb-2 text-xl font-bold text-white">
                    {product.name}
                  </h3>
                  <p className="mb-4 text-sm text-neutral-700">
                    {product.description}
                  </p>
                  <p className="mb-4 font-semibold text-gold-400">
                    {product.price}
                  </p>
                  <Button asChild variant="outline" className="w-full">
                    <Link href={`/produtos/${product.id}`}>Ver Detalhes</Link>
                  </Button>
                </div>
              </Card>
            ))}
          </div>
          <div className="mt-12 text-center">
            <Button asChild size="lg" variant="outline">
              <Link href="/produtos">
                Ver Todos os Produtos
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="bg-neutral-900/50 px-6 py-20 md:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <h2 className="mb-4 font-display text-4xl font-bold text-white md:text-5xl">
              Nossos Serviços
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-neutral-700">
              Soluções completas para cada necessidade
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {services.map((service, index) => (
              <Card key={index} className="p-8 text-center">
                <h3 className="mb-3 text-xl font-bold text-white">
                  {service.title}
                </h3>
                <p className="text-neutral-700">{service.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Differentials */}
      <section className="px-6 py-20 md:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <h2 className="mb-4 font-display text-4xl font-bold text-white md:text-5xl">
              Por Que Escolher a Versati?
            </h2>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {differentials.map((item, index) => (
              <div key={index} className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gold-500/10">
                  <item.icon className="h-8 w-8 text-gold-400" />
                </div>
                <h3 className="mb-2 text-xl font-bold text-white">
                  {item.title}
                </h3>
                <p className="text-neutral-700">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio Preview */}
      <section className="bg-neutral-900/50 px-6 py-20 md:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <h2 className="mb-4 font-display text-4xl font-bold text-white md:text-5xl">
              Projetos Realizados
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-neutral-700">
              Confira alguns de nossos trabalhos
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {portfolioPreview.map((project, index) => (
              <Card key={index} variant="hover" className="group overflow-hidden">
                <div className="relative aspect-[4/3] overflow-hidden bg-neutral-800">
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <Badge variant="gold" className="mb-2">
                      {project.category}
                    </Badge>
                    <h3 className="text-xl font-bold text-white">
                      {project.title}
                    </h3>
                  </div>
                </div>
              </Card>
            ))}
          </div>
          <div className="mt-12 text-center">
            <Button asChild size="lg" variant="outline">
              <Link href="/portfolio">
                Ver Portfólio Completo
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="px-6 py-20 md:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <h2 className="mb-4 font-display text-4xl font-bold text-white md:text-5xl">
              O Que Dizem Nossos Clientes
            </h2>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="p-8">
                <div className="mb-4 flex gap-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <svg
                      key={i}
                      className="h-5 w-5 fill-gold-400"
                      viewBox="0 0 20 20"
                    >
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                  ))}
                </div>
                <p className="mb-6 text-neutral-300">{testimonial.content}</p>
                <div>
                  <p className="font-semibold text-white">{testimonial.name}</p>
                  <p className="text-sm text-neutral-600">{testimonial.role}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative overflow-hidden bg-gradient-to-br from-gold-900/20 via-neutral-900 to-neutral-950 px-6 py-20 md:py-32">
        <div className="absolute inset-0 bg-[url('/images/cta-pattern.svg')] opacity-5" />
        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <h2 className="mb-6 font-display text-4xl font-bold text-white md:text-5xl lg:text-6xl">
            Pronto Para Transformar
            <br />
            Seu Projeto?
          </h2>
          <p className="mb-10 text-lg text-neutral-300 md:text-xl">
            Receba um orçamento personalizado em até 24 horas.
            <br />
            Atendimento especializado e sem compromisso.
          </p>
          <Button asChild size="lg" className="text-lg">
            <Link href="/orcamento">
              Solicitar Orçamento Gratuito
              <ArrowRight className="ml-2 h-6 w-6" />
            </Link>
          </Button>
        </div>
      </section>
    </>
  )
}
