import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { Award, Users, Target, Heart, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

export const metadata: Metadata = {
  title: 'Sobre Nós - Versati Glass',
  description:
    'Conheça a história da Versati Glass, nossa missão, valores e a equipe que transforma projetos em realidade com excelência.',
}

const values = [
  {
    icon: Award,
    title: 'Excelência',
    description:
      'Buscamos a perfeição em cada detalhe, desde o atendimento até a instalação final.',
  },
  {
    icon: Users,
    title: 'Compromisso',
    description:
      'Cumprimos prazos e promessas, garantindo a satisfação total dos nossos clientes.',
  },
  {
    icon: Target,
    title: 'Inovação',
    description:
      'Investimos em tecnologia e técnicas modernas para oferecer as melhores soluções.',
  },
  {
    icon: Heart,
    title: 'Transparência',
    description:
      'Relacionamento honesto e claro com clientes, fornecedores e colaboradores.',
  },
]

const timeline = [
  {
    year: '2009',
    title: 'Fundação',
    description:
      'A Versati Glass nasce com o sonho de elevar o padrão de qualidade em vidraçaria.',
  },
  {
    year: '2012',
    title: 'Expansão',
    description:
      'Ampliação da estrutura e início de projetos comerciais de grande porte.',
  },
  {
    year: '2015',
    title: 'Certificações',
    description:
      'Conquista de certificações técnicas e reconhecimento no mercado.',
  },
  {
    year: '2018',
    title: 'Tecnologia',
    description:
      'Investimento em equipamentos de ponta e sistema de gestão digital.',
  },
  {
    year: '2021',
    title: 'Sustentabilidade',
    description:
      'Implementação de práticas sustentáveis e projetos com vidro reciclável.',
  },
  {
    year: '2024',
    title: 'Excelência Consolidada',
    description:
      'Mais de 3.000 projetos executados com excelência e satisfação garantida.',
  },
]

const stats = [
  { value: '15+', label: 'Anos de Mercado' },
  { value: '3.000+', label: 'Projetos Concluídos' },
  { value: '98%', label: 'Satisfação dos Clientes' },
  { value: '50+', label: 'Colaboradores' },
]

export default function SobrePage() {
  return (
    <div className="min-h-screen bg-neutral-950">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-neutral-900 to-neutral-950 px-6 py-24">
        <div className="absolute inset-0 bg-[url('/images/hero-pattern.svg')] opacity-5" />
        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <h1 className="mb-6 font-display text-5xl font-bold text-white md:text-6xl lg:text-7xl">
            Sobre a Versati Glass
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-neutral-300 md:text-xl">
            15 anos transformando ambientes com excelência, inovação e
            compromisso com a qualidade
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, idx) => (
              <Card key={idx} className="p-8 text-center">
                <p className="mb-2 font-display text-5xl font-bold text-gold-400">
                  {stat.value}
                </p>
                <p className="text-neutral-400">{stat.label}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="bg-neutral-900/50 px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <h2 className="mb-6 font-display text-4xl font-bold text-white md:text-5xl">
                Nossa História
              </h2>
              <div className="space-y-4 text-lg text-neutral-300">
                <p>
                  A Versati Glass nasceu em 2009 do sonho de elevar o padrão de
                  qualidade no mercado de vidraçaria. Com uma equipe pequena mas
                  apaixonada, começamos atendendo residências na Zona Sul do Rio
                  de Janeiro.
                </p>
                <p>
                  Ao longo dos anos, nosso compromisso com a excelência e a
                  satisfação dos clientes nos levou a crescer organicamente.
                  Hoje, somos referência em projetos residenciais e comerciais
                  de alto padrão.
                </p>
                <p>
                  Nossa missão continua a mesma desde o primeiro dia:{' '}
                  <strong className="text-gold-400">
                    transformar ambientes com soluções em vidro que combinam
                    elegância, segurança e durabilidade.
                  </strong>
                </p>
              </div>
            </div>
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-neutral-800">
              <Image
                src="/images/about/equipe.jpg"
                alt="Equipe Versati Glass"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 md:grid-cols-2">
            <Card className="p-8">
              <h3 className="mb-4 font-display text-2xl font-bold text-white">
                Missão
              </h3>
              <p className="text-neutral-300">
                Oferecer soluções em vidro e esquadrias de alto padrão,
                superando expectativas com qualidade, inovação e atendimento
                personalizado. Transformar projetos em realidade com excelência
                em cada detalhe.
              </p>
            </Card>
            <Card className="p-8">
              <h3 className="mb-4 font-display text-2xl font-bold text-white">
                Visão
              </h3>
              <p className="text-neutral-300">
                Ser a vidraçaria de referência no Rio de Janeiro,
                reconhecida pela qualidade premium, inovação constante e
                relacionamento de confiança com nossos clientes e parceiros.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-neutral-900/50 px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <h2 className="mb-4 font-display text-4xl font-bold text-white md:text-5xl">
              Nossos Valores
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-neutral-400">
              Os princípios que guiam cada decisão e ação na Versati Glass
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {values.map((value, idx) => (
              <Card key={idx} className="p-8 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gold-500/10">
                  <value.icon className="h-8 w-8 text-gold-400" />
                </div>
                <h3 className="mb-3 text-xl font-bold text-white">
                  {value.title}
                </h3>
                <p className="text-neutral-400">{value.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <div className="mb-12 text-center">
            <h2 className="mb-4 font-display text-4xl font-bold text-white md:text-5xl">
              Nossa Trajetória
            </h2>
          </div>
          <div className="space-y-8">
            {timeline.map((item, idx) => (
              <div key={idx} className="flex gap-6">
                <div className="flex flex-col items-center">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-gold-500 font-bold text-neutral-950">
                    {item.year.slice(2)}
                  </div>
                  {idx < timeline.length - 1 && (
                    <div className="mt-2 h-full w-0.5 bg-gradient-to-b from-gold-500 to-transparent" />
                  )}
                </div>
                <Card className="mb-8 flex-1 p-6">
                  <p className="mb-2 text-sm text-gold-400">{item.year}</p>
                  <h3 className="mb-2 text-xl font-bold text-white">
                    {item.title}
                  </h3>
                  <p className="text-neutral-400">{item.description}</p>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-4xl rounded-2xl bg-gradient-to-br from-gold-900/20 to-neutral-900 p-12 text-center">
          <h2 className="mb-4 font-display text-3xl font-bold text-white md:text-4xl">
            Faça Parte da Nossa História
          </h2>
          <p className="mb-8 text-lg text-neutral-300">
            Vamos transformar seu projeto juntos
          </p>
          <Button asChild size="lg">
            <Link href="/orcamento">
              Solicitar Orçamento
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
