import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import {
  Home,
  Building2,
  Wrench,
  FileText,
  ArrowRight,
  Check,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

export const metadata: Metadata = {
  title: 'Serviços - Versati Glass',
  description:
    'Conheça nossos serviços especializados: projetos residenciais, comerciais, manutenção e consultoria técnica em vidros e esquadrias.',
}

const services = [
  {
    icon: Home,
    title: 'Projetos Residenciais',
    description:
      'Soluções completas em vidro para sua casa com qualidade premium e acabamento impecável.',
    features: [
      'Box de banheiro sob medida',
      'Espelhos decorativos e funcionais',
      'Guarda-corpos para escadas e sacadas',
      'Divisórias de ambientes',
      'Portas e janelas de vidro',
      'Coberturas e telhados de vidro',
    ],
    image: '/images/services/residencial.jpg',
    cta: 'Ver Projetos Residenciais',
  },
  {
    icon: Building2,
    title: 'Projetos Comerciais',
    description:
      'Soluções corporativas de alto padrão para escritórios, lojas e empreendimentos comerciais.',
    features: [
      'Fachadas de vidro estruturais',
      'Divisórias para escritórios',
      'Portas automáticas de vidro',
      'Vitrines e expositores',
      'Envidraçamento de mezaninos',
      'Projetos especiais customizados',
    ],
    image: '/images/services/comercial.jpg',
    cta: 'Ver Projetos Comerciais',
  },
  {
    icon: Wrench,
    title: 'Manutenção e Reparo',
    description:
      'Assistência técnica especializada para manter seus vidros sempre em perfeito estado.',
    features: [
      'Troca de borrachas de vedação',
      'Regulagem de portas e janelas',
      'Substituição de vidros quebrados',
      'Polimento e limpeza profissional',
      'Instalação de películas',
      'Manutenção preventiva',
    ],
    image: '/images/services/manutencao.jpg',
    cta: 'Solicitar Manutenção',
  },
  {
    icon: FileText,
    title: 'Consultoria Técnica',
    description:
      'Apoio especializado para arquitetos, engenheiros e construtores na especificação de vidros.',
    features: [
      'Análise de viabilidade técnica',
      'Especificação de materiais',
      'Cálculo estrutural',
      'Orientação sobre normas ABNT',
      'Suporte em projetos complexos',
      'Orçamentos detalhados',
    ],
    image: '/images/services/consultoria.jpg',
    cta: 'Falar com Consultor',
  },
]

const process = [
  {
    step: '01',
    title: 'Contato Inicial',
    description:
      'Entre em contato conosco pelo WhatsApp, site ou telefone. Nossa equipe responde em até 2 horas.',
  },
  {
    step: '02',
    title: 'Visita Técnica',
    description:
      'Agendamos uma visita gratuita para medições precisas e análise do projeto.',
  },
  {
    step: '03',
    title: 'Orçamento Detalhado',
    description:
      'Elaboramos um orçamento completo com todas as especificações e prazos.',
  },
  {
    step: '04',
    title: 'Produção',
    description:
      'Após aprovação, iniciamos a produção com materiais premium e controle de qualidade rigoroso.',
  },
  {
    step: '05',
    title: 'Instalação',
    description:
      'Nossa equipe especializada realiza a instalação com precisão e cuidado.',
  },
  {
    step: '06',
    title: 'Pós-Venda',
    description:
      'Garantia estendida e suporte técnico para qualquer necessidade futura.',
  },
]

const differentials = [
  'Atendimento personalizado em todas as etapas',
  'Equipe técnica altamente qualificada',
  'Materiais de primeira qualidade',
  'Prazos cumpridos rigorosamente',
  'Garantia estendida em todos os serviços',
  'Suporte pós-venda especializado',
]

export default function ServicosPage() {
  return (
    <div className="min-h-screen bg-neutral-950">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-neutral-900 to-neutral-950 px-6 py-24">
        <div className="absolute inset-0 bg-[url('/images/hero-pattern.svg')] opacity-5" />
        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <h1 className="mb-6 font-display text-5xl font-bold text-white md:text-6xl lg:text-7xl">
            Nossos Serviços
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-neutral-300 md:text-xl">
            Soluções completas em vidro e esquadrias com excelência em cada
            detalhe
          </p>
        </div>
      </section>

      {/* Services */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="space-y-20">
            {services.map((service, idx) => (
              <div
                key={idx}
                className={`grid gap-12 lg:grid-cols-2 ${
                  idx % 2 === 1 ? 'lg:flex-row-reverse' : ''
                }`}
              >
                <div className={idx % 2 === 1 ? 'lg:order-2' : ''}>
                  <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gold-500/10">
                    <service.icon className="h-8 w-8 text-gold-400" />
                  </div>
                  <h2 className="mb-4 font-display text-3xl font-bold text-white md:text-4xl">
                    {service.title}
                  </h2>
                  <p className="mb-8 text-lg text-neutral-300">
                    {service.description}
                  </p>
                  <ul className="mb-8 space-y-3">
                    {service.features.map((feature, featureIdx) => (
                      <li key={featureIdx} className="flex items-start gap-3">
                        <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-gold-400" />
                        <span className="text-neutral-300">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button asChild size="lg">
                    <Link href="/orcamento">
                      {service.cta}
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                </div>
                <div
                  className={`relative aspect-[4/3] overflow-hidden rounded-2xl bg-neutral-800 ${
                    idx % 2 === 1 ? 'lg:order-1' : ''
                  }`}
                >
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="bg-neutral-900/50 px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <h2 className="mb-4 font-display text-4xl font-bold text-white md:text-5xl">
              Como Funciona
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-neutral-400">
              Nosso processo é simples, transparente e focado na sua satisfação
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {process.map((item, idx) => (
              <Card key={idx} className="p-8">
                <div className="mb-4 text-5xl font-bold text-gold-400/20">
                  {item.step}
                </div>
                <h3 className="mb-3 text-xl font-bold text-white">
                  {item.title}
                </h3>
                <p className="text-neutral-400">{item.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Differentials */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <div className="mb-12 text-center">
            <h2 className="mb-4 font-display text-4xl font-bold text-white md:text-5xl">
              Por Que Escolher a Versati?
            </h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {differentials.map((item, idx) => (
              <div key={idx} className="flex items-start gap-4">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gold-500/10">
                  <Check className="h-5 w-5 text-gold-400" />
                </div>
                <p className="pt-1 text-lg text-neutral-300">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-4xl rounded-2xl bg-gradient-to-br from-gold-900/20 to-neutral-900 p-12 text-center">
          <h2 className="mb-4 font-display text-3xl font-bold text-white md:text-4xl">
            Pronto Para Começar Seu Projeto?
          </h2>
          <p className="mb-8 text-lg text-neutral-300">
            Entre em contato e receba um orçamento personalizado em até 24 horas
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/orcamento">
                Solicitar Orçamento
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/contato">Falar com Especialista</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
