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
    description: 'Cumprimos prazos e promessas, garantindo a satisfação total dos nossos clientes.',
  },
  {
    icon: Target,
    title: 'Inovação',
    description: 'Investimos em tecnologia e técnicas modernas para oferecer as melhores soluções.',
  },
  {
    icon: Heart,
    title: 'Transparência',
    description: 'Relacionamento honesto e claro com clientes, fornecedores e colaboradores.',
  },
]

const timeline = [
  {
    year: '2009',
    title: 'Fundação',
    description: 'A Versati Glass nasce com o sonho de elevar o padrão de qualidade em vidraçaria.',
  },
  {
    year: '2012',
    title: 'Expansão',
    description: 'Ampliação da estrutura e início de projetos comerciais de grande porte.',
  },
  {
    year: '2015',
    title: 'Certificações',
    description: 'Conquista de certificações técnicas e reconhecimento no mercado.',
  },
  {
    year: '2018',
    title: 'Tecnologia',
    description: 'Investimento em equipamentos de ponta e sistema de gestão digital.',
  },
  {
    year: '2021',
    title: 'Sustentabilidade',
    description: 'Implementação de práticas sustentáveis e projetos com vidro reciclável.',
  },
  {
    year: '2024',
    title: 'Excelência Consolidada',
    description: 'Mais de 3.000 projetos executados com excelência e satisfação garantida.',
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
    <div className="bg-theme-primary min-h-screen">
      {/* Hero */}
      <section className="from-theme-secondary to-theme-primary relative overflow-hidden bg-gradient-to-b px-6 py-24">
        <div className="absolute inset-0 bg-[url('/images/hero-pattern.svg')] opacity-5" />
        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <h1 className="text-theme-primary mb-6 font-display text-5xl font-bold md:text-6xl lg:text-7xl">
            Sobre a Versati Glass
          </h1>
          <p className="text-theme-elevated mx-auto max-w-2xl text-lg md:text-xl">
            15 anos transformando ambientes com excelência, inovação e compromisso com a qualidade
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, idx) => (
              <Card key={idx} className="p-8 text-center">
                <p className="mb-2 font-display text-5xl font-bold text-accent-400">{stat.value}</p>
                <p className="text-theme-default">{stat.label}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="bg-theme-secondary/50 px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <h2 className="text-theme-primary mb-6 font-display text-4xl font-bold md:text-5xl">
                Nossa História
              </h2>
              <div className="text-theme-elevated space-y-4 text-lg">
                <p>
                  A Versati Glass nasceu em 2009 do sonho de elevar o padrão de qualidade no mercado
                  de vidraçaria. Com uma equipe pequena mas apaixonada, começamos atendendo
                  residências na Zona Sul do Rio de Janeiro.
                </p>
                <p>
                  Ao longo dos anos, nosso compromisso com a excelência e a satisfação dos clientes
                  nos levou a crescer organicamente. Hoje, somos referência em projetos residenciais
                  e comerciais de alto padrão.
                </p>
                <p>
                  Nossa missão continua a mesma desde o primeiro dia:{' '}
                  <strong className="text-accent-400">
                    transformar ambientes com soluções em vidro que combinam elegância, segurança e
                    durabilidade.
                  </strong>
                </p>
              </div>
            </div>
            <div className="bg-theme-elevated relative aspect-[4/3] overflow-hidden rounded-2xl">
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
              <h3 className="text-theme-primary mb-4 font-display text-2xl font-bold">Missão</h3>
              <p className="text-theme-elevated">
                Oferecer soluções em vidro e esquadrias de alto padrão, superando expectativas com
                qualidade, inovação e atendimento personalizado. Transformar projetos em realidade
                com excelência em cada detalhe.
              </p>
            </Card>
            <Card className="p-8">
              <h3 className="text-theme-primary mb-4 font-display text-2xl font-bold">Visão</h3>
              <p className="text-theme-elevated">
                Ser a vidraçaria de referência no Rio de Janeiro, reconhecida pela qualidade
                premium, inovação constante e relacionamento de confiança com nossos clientes e
                parceiros.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-theme-secondary/50 px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <h2 className="text-theme-primary mb-4 font-display text-4xl font-bold md:text-5xl">
              Nossos Valores
            </h2>
            <p className="text-theme-default mx-auto max-w-2xl text-lg">
              Os princípios que guiam cada decisão e ação na Versati Glass
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {values.map((value, idx) => (
              <Card key={idx} className="p-8 text-center">
                <div className="bg-accent-500/10 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
                  <value.icon className="h-8 w-8 text-accent-400" />
                </div>
                <h3 className="text-theme-primary mb-3 text-xl font-bold">{value.title}</h3>
                <p className="text-theme-default">{value.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <div className="mb-12 text-center">
            <h2 className="text-theme-primary mb-4 font-display text-4xl font-bold md:text-5xl">
              Nossa Trajetória
            </h2>
          </div>
          <div className="space-y-8">
            {timeline.map((item, idx) => (
              <div key={idx} className="flex gap-6">
                <div className="flex flex-col items-center">
                  <div className="text-theme-primary flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-accent-500 font-bold">
                    {item.year.slice(2)}
                  </div>
                  {idx < timeline.length - 1 && (
                    <div className="mt-2 h-full w-0.5 bg-gradient-to-b from-accent-500 to-transparent" />
                  )}
                </div>
                <Card className="mb-8 flex-1 p-6">
                  <p className="mb-2 text-sm text-accent-400">{item.year}</p>
                  <h3 className="text-theme-primary mb-2 text-xl font-bold">{item.title}</h3>
                  <p className="text-theme-default">{item.description}</p>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-20">
        <div className="from-accent-900/20 to-theme-secondary mx-auto max-w-4xl rounded-2xl bg-gradient-to-br p-12 text-center">
          <h2 className="text-theme-primary mb-4 font-display text-3xl font-bold md:text-4xl">
            Faça Parte da Nossa História
          </h2>
          <p className="text-theme-elevated mb-8 text-lg">Vamos transformar seu projeto juntos</p>
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
