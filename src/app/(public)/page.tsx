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
    image: '/images/products/box-premium.jpg',
    price: 'A partir de R$ 2.490',
    badge: 'Mais Vendido',
  },
  {
    id: 2,
    name: 'Guarda-Corpo de Vidro',
    description: 'Segurança e elegância com vidro laminado de alta resistência',
    image: '/images/products/guarda-corpo/barandilla-2.jpg',
    price: 'A partir de R$ 890/m',
    badge: 'Premium',
  },
  {
    id: 3,
    name: 'Espelho com LED',
    description: 'Espelhos decorativos com iluminação LED integrada',
    image: '/images/products/espelho-led.jpg',
    price: 'A partir de R$ 890',
    badge: 'Destaque',
  },
  {
    id: 4,
    name: 'Divisória de Vidro',
    description: 'Divisórias para escritórios e ambientes comerciais',
    image: '/images/products/divisoria.jpg',
    price: 'A partir de R$ 690/m²',
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
    image: '/images/portfolio/leblon-1.jpg',
  },
  {
    title: 'Escritório Corporativo - Barra da Tijuca',
    category: 'Comercial',
    image: '/images/portfolio/barra-1.jpg',
  },
  {
    title: 'Cobertura Duplex - Ipanema',
    category: 'Residencial',
    image: '/images/portfolio/ipanema-1.jpg',
  },
]

const testimonials = [
  {
    name: 'Vinícius Fernando',
    role: 'Cliente Google',
    content:
      'Gostaria de expressar minha satisfação e gratidão ao trabalho dessa empresa, recomendo 100%. O atendimento do Arthur e do Léo impecáveis.',
    rating: 5,
  },
  {
    name: 'Kalil Auad',
    role: 'Cliente Google',
    content:
      'Quebrei minha mesa de vidro 10mm, bem na borda, e eles vieram em casa consertar, ficou tudo perfeito e o serviço foi bem rápido, durou em torno de 15 minutos.',
    rating: 5,
  },
  {
    name: 'Celia Araújo',
    role: 'Cliente Google',
    content:
      'FIZ CONTATO COM A EQUIPE DA VERSATI GLASS E FUI ATENDIDA NO MESMO DIA. FOI TRANSFORMADO UM BOX EM DUAS PAREDES DE VIDRO. TODO O MATERIAL REAPROVEITADO. SUPER RECOMENDO.',
    rating: 5,
  },
  {
    name: 'Simone Avaz',
    role: 'Cliente Google',
    content:
      'Uma vidraçaria que me atendeu hoje domingo às 15:40 para fazer uma manutenção dos meus três Box. Serviço ótimo.',
    rating: 5,
  },
  {
    name: 'Cláudio Azevedo',
    role: 'Cliente Google',
    content:
      'Fizemos o serviço de manutenção da cortina de vidro com a equipe da Versati Glass, feito de forma ágil, com excelente atendimento e qualidade técnica! Maravilhosos! Recomendo com força!',
    rating: 5,
  },
  {
    name: 'Angela Alves',
    role: 'Cliente Google',
    content:
      'Estou muito satisfeita com o serviço prestado pela VERSATI GLASS. Instalaram um Box Flex e um Box Elegance, no meu banheiro, além de uma Cortina de Vidro na sacada. A qualidade de todos é excelente.',
    rating: 5,
  },
]

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative flex min-h-[90vh] items-center justify-center overflow-hidden px-6 py-24">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src="/images/hero-bg-principal.jpg"
            alt="Versati Glass - Vidraçaria de Luxo"
            fill
            priority
            className="object-cover"
            quality={90}
          />
          {/* Overlay escuro para legibilidade */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />
          {/* Gradiente de cor sutil */}
          <div className="from-accent-900/20 to-accent-950/30 absolute inset-0 bg-gradient-to-br via-transparent" />
          {/* Pattern texture */}
          <div className="absolute inset-0 bg-[url('/images/hero-pattern.svg')] opacity-[0.03]" />
        </div>
        <div className="relative z-10 mx-auto max-w-7xl text-center">
          <Badge variant="gold" className="animate-fadeIn mb-6">
            Excelência em Vidros e Esquadrias
          </Badge>
          <h1 className="mb-6 font-display text-5xl font-bold leading-tight text-white drop-shadow-lg md:text-7xl lg:text-8xl">
            Transforme Seu Espaço
            <br />
            <span className="text-gradient-accent drop-shadow-md">Com Elegância</span>
          </h1>
          <p className="mx-auto mb-10 max-w-2xl text-lg text-white/90 drop-shadow-md md:text-xl">
            Vidraçaria de alto padrão especializada em projetos residenciais e comerciais. Qualidade
            premium, instalação impecável e atendimento personalizado.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button asChild size="lg" className="w-full shadow-xl hover:shadow-2xl sm:w-auto">
              <Link href="/orcamento">
                Fazer Orçamento Grátis
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="w-full border-2 border-white/90 bg-white/10 text-white backdrop-blur-sm hover:border-white hover:bg-white/20 sm:w-auto"
            >
              <Link href="/portfolio">Ver Portfólio</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="bg-theme-primary px-6 py-20 md:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <h2 className="text-theme-primary mb-4 font-display text-4xl font-bold md:text-5xl">
              Produtos em Destaque
            </h2>
            <p className="text-theme-muted mx-auto max-w-2xl text-lg">
              Conheça nossas soluções mais populares
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {featuredProducts.map((product) => (
              <Card key={product.id} variant="hover" className="group overflow-hidden">
                <div className="bg-theme-elevated relative aspect-square overflow-hidden">
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
                  <h3 className="text-theme-primary mb-2 text-xl font-bold">{product.name}</h3>
                  <p className="text-theme-muted mb-4 text-sm">{product.description}</p>
                  <p className="mb-4 font-semibold text-accent-400">{product.price}</p>
                  <Button asChild variant="outline" className="w-full">
                    <Link href="/produtos">Ver Detalhes</Link>
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
      <section className="bg-theme-secondary/50 px-6 py-20 md:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <h2 className="text-theme-primary mb-4 font-display text-4xl font-bold md:text-5xl">
              Nossos Serviços
            </h2>
            <p className="text-theme-muted mx-auto max-w-2xl text-lg">
              Soluções completas para cada necessidade
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {services.map((service, index) => (
              <Card key={index} className="p-8 text-center">
                <h3 className="text-theme-primary mb-3 text-xl font-bold">{service.title}</h3>
                <p className="text-theme-muted">{service.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Differentials */}
      <section className="bg-theme-primary px-6 py-20 md:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <h2 className="text-theme-primary mb-4 font-display text-4xl font-bold md:text-5xl">
              Por Que Escolher a Versati?
            </h2>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {differentials.map((item, index) => (
              <div key={index} className="text-center">
                <div className="bg-accent-500/10 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
                  <item.icon className="h-8 w-8 text-accent-400" />
                </div>
                <h3 className="text-theme-primary mb-2 text-xl font-bold">{item.title}</h3>
                <p className="text-theme-muted">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio Preview */}
      <section className="bg-theme-secondary/50 px-6 py-20 md:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <h2 className="text-theme-primary mb-4 font-display text-4xl font-bold md:text-5xl">
              Projetos Realizados
            </h2>
            <p className="text-theme-muted mx-auto max-w-2xl text-lg">
              Confira alguns de nossos trabalhos
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {portfolioPreview.map((project, index) => (
              <Card key={index} variant="hover" className="group overflow-hidden">
                <div className="bg-theme-elevated relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="from-theme-primary absolute inset-0 bg-gradient-to-t via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <Badge variant="gold" className="mb-2">
                      {project.category}
                    </Badge>
                    <h3 className="text-theme-primary text-xl font-bold">{project.title}</h3>
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
      <section className="bg-theme-primary px-6 py-20 md:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <h2 className="text-theme-primary mb-4 font-display text-4xl font-bold md:text-5xl">
              O Que Dizem Nossos Clientes
            </h2>
            <div className="mt-4 flex items-center justify-center gap-3">
              <div className="flex items-center gap-2">
                <span className="text-3xl font-bold text-accent-400">4.7</span>
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`h-5 w-5 ${i < 4 ? 'fill-accent-400' : 'fill-accent-400/30'}`}
                      viewBox="0 0 20 20"
                    >
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                  ))}
                </div>
              </div>
              <span className="text-theme-muted">• 37 avaliações</span>
            </div>
            <div className="mt-4">
              <a
                href="https://www.google.com/maps/place/Vidra%C3%A7aria+Versati+Glass+-+Freguesia/@-22.9364724,-43.3355742,17z/data=!3m1!4b1!4m6!3m5!1s0x9bd93c191b96cd:0x68dd340e77a6cce3!8m2!3d-22.9364724!4d-43.3329993!16s%2Fg%2F11v0k46lcq?entry=ttu"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-accent-400 transition-colors hover:text-accent-500 hover:underline"
              >
                Ver todas as 37 avaliações no Google →
              </a>
            </div>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="p-8">
                <div className="mb-4 flex gap-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <svg key={i} className="h-5 w-5 fill-accent-400" viewBox="0 0 20 20">
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                  ))}
                </div>
                <p className="text-theme-secondary mb-6">{testimonial.content}</p>
                <div>
                  <p className="text-theme-primary font-semibold">{testimonial.name}</p>
                  <p className="text-theme-subtle text-sm">{testimonial.role}</p>
                </div>
              </Card>
            ))}
          </div>

          {/* Review CTA */}
          <div className="mt-12 text-center">
            <p className="text-theme-muted mb-6 text-lg">
              Já é nosso cliente? Compartilhe sua experiência!
            </p>
            <Button asChild size="lg" className="bg-accent-500 hover:bg-accent-600">
              <a
                href="https://g.page/r/CeO8t3cONNy9EBM/review"
                target="_blank"
                rel="noopener noreferrer"
              >
                Avaliar no Google
                <ArrowRight className="ml-2 h-5 w-5" />
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="from-accent-900/20 via-theme-secondary to-theme-primary relative overflow-hidden bg-gradient-to-br px-6 py-20 md:py-32">
        <div className="absolute inset-0 bg-[url('/images/cta-pattern.svg')] opacity-5" />
        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <h2 className="text-theme-primary mb-6 font-display text-4xl font-bold md:text-5xl lg:text-6xl">
            Pronto Para Transformar
            <br />
            Seu Projeto?
          </h2>
          <p className="text-theme-secondary mb-10 text-lg md:text-xl">
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
