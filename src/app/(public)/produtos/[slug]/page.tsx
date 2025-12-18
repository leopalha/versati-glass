import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { ArrowRight, Check, Shield, Clock, Award } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ShareButtons } from '@/components/shared/share-buttons'

type Props = {
  params: { slug: string }
}

// Mock database - replace with actual Prisma query
const products = {
  'box-premium': {
    id: 1,
    slug: 'box-premium',
    name: 'Box de Vidro Premium',
    category: 'Box de Vidro',
    description:
      'Box sob medida com vidro temperado 8mm de alta qualidade, perfis em alumínio anodizado e acabamento impecável. Ideal para banheiros modernos e sofisticados.',
    price: 'A partir de R$ 1.890',
    image: '/images/products/box-premium.jpg',
    badge: 'Mais Vendido',
    features: [
      'Vidro temperado 8mm de alta resistência',
      'Perfis em alumínio anodizado',
      'Garantia vitalícia contra defeitos de fabricação',
      'Borrachas de vedação premium',
      'Instalação profissional inclusa',
      'Projeto sob medida',
    ],
    specifications: [
      { label: 'Espessura do Vidro', value: '8mm temperado' },
      { label: 'Perfis', value: 'Alumínio anodizado' },
      { label: 'Cores Disponíveis', value: 'Incolor, Verde, Fumê, Bronze' },
      { label: 'Tipos de Abertura', value: 'Correr, Abrir, Fixa' },
      { label: 'Prazo de Instalação', value: '5-7 dias úteis' },
      { label: 'Garantia', value: 'Vitalícia' },
    ],
    relatedProducts: [2, 10],
  },
  'guarda-corpo-vidro': {
    id: 3,
    slug: 'guarda-corpo-vidro',
    name: 'Guarda-Corpo de Vidro',
    category: 'Guarda-Corpo',
    description:
      'Guarda-corpo em vidro laminado 10mm com fixação por botões de inox. Segurança máxima combinada com design minimalista e elegante.',
    price: 'A partir de R$ 890/m',
    image: '/images/products/guarda-corpo.jpg',
    badge: 'Premium',
    features: [
      'Vidro laminado 10mm (5+5) de alta resistência',
      'Fixação invisível por botões de inox',
      'Corrimão opcional em inox escovado',
      'Certificação ABNT NBR 14718',
      'Suporta até 300kg por metro linear',
      'Instalação com equipe especializada',
    ],
    specifications: [
      { label: 'Espessura do Vidro', value: '10mm laminado (5+5)' },
      { label: 'Fixação', value: 'Botões de inox' },
      { label: 'Altura Padrão', value: '1,10m' },
      { label: 'Cores Disponíveis', value: 'Incolor, Verde, Fumê' },
      { label: 'Certificação', value: 'ABNT NBR 14718' },
      { label: 'Garantia', value: '5 anos' },
    ],
    relatedProducts: [11],
  },
  'espelho-led': {
    id: 4,
    slug: 'espelho-led',
    name: 'Espelho com LED Integrado',
    category: 'Espelhos',
    description:
      'Espelho decorativo premium com iluminação LED de alta eficiência energética, sensor touch e função antiembaçante. Perfeito para banheiros modernos.',
    price: 'A partir de R$ 850',
    image: '/images/products/espelho-led.jpg',
    badge: 'Destaque',
    features: [
      'Iluminação LED de alta eficiência (30.000h de vida útil)',
      'Sensor touch on/off',
      'Função antiembaçante',
      'Espelho bisotado 1cm',
      'Instalação plug & play',
      'Disponível em diversas dimensões',
    ],
    specifications: [
      { label: 'Tipo de LED', value: 'Branco frio (6000K)' },
      { label: 'Consumo', value: '12W' },
      { label: 'Voltagem', value: 'Bivolt automático' },
      { label: 'Espessura', value: '5mm' },
      { label: 'Bisotê', value: '1cm em toda borda' },
      { label: 'Garantia', value: '2 anos' },
    ],
    relatedProducts: [5],
  },
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = products[params.slug as keyof typeof products]

  if (!product) {
    return {
      title: 'Produto não encontrado - Versati Glass',
    }
  }

  return {
    title: `${product.name} - Versati Glass`,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: [product.image],
    },
  }
}

export default function ProductDetailPage({ params }: Props) {
  const product = products[params.slug as keyof typeof products]

  if (!product) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-neutral-950 px-6 py-20">
      <div className="mx-auto max-w-7xl">
        {/* Breadcrumb */}
        <nav className="mb-8 text-sm text-neutral-500">
          <Link href="/" className="hover:text-gold-400">
            Home
          </Link>
          {' / '}
          <Link href="/produtos" className="hover:text-gold-400">
            Produtos
          </Link>
          {' / '}
          <span className="text-white">{product.name}</span>
        </nav>

        {/* Product Detail */}
        <div className="grid gap-12 lg:grid-cols-2">
          {/* Image */}
          <div className="relative aspect-square overflow-hidden rounded-2xl bg-neutral-800">
            <Image src={product.image} alt={product.name} fill className="object-cover" priority />
            {product.badge && (
              <Badge variant="gold" className="absolute right-6 top-6">
                {product.badge}
              </Badge>
            )}
          </div>

          {/* Info */}
          <div>
            <div className="mb-4 flex items-center justify-between">
              <Badge variant="outline">{product.category}</Badge>
              <ShareButtons title={product.name} description={product.description} />
            </div>
            <h1 className="mb-4 font-display text-4xl font-bold text-white md:text-5xl">
              {product.name}
            </h1>
            <p className="mb-6 text-lg text-neutral-400">{product.description}</p>
            <p className="mb-8 text-3xl font-bold text-gold-400">{product.price}</p>

            {/* Features */}
            <div className="mb-8">
              <h3 className="mb-4 text-xl font-bold text-white">Características</h3>
              <ul className="space-y-3">
                {product.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-gold-400" />
                    <span className="text-neutral-400">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* CTAs */}
            <div className="grid gap-4">
              <Button asChild size="lg" className="w-full">
                <Link href="/orcamento">
                  Solicitar Orçamento Grátis
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="w-full">
                <Link href="/contato">Falar com Especialista</Link>
              </Button>
            </div>

            {/* Trust Badges */}
            <div className="mt-8 grid grid-cols-3 gap-4">
              <div className="text-center">
                <Shield className="mx-auto mb-2 h-8 w-8 text-gold-400" />
                <p className="text-xs text-neutral-400">Garantia Estendida</p>
              </div>
              <div className="text-center">
                <Clock className="mx-auto mb-2 h-8 w-8 text-gold-400" />
                <p className="text-xs text-neutral-400">Instalação Rápida</p>
              </div>
              <div className="text-center">
                <Award className="mx-auto mb-2 h-8 w-8 text-gold-400" />
                <p className="text-xs text-neutral-400">15 Anos de Mercado</p>
              </div>
            </div>
          </div>
        </div>

        {/* Specifications */}
        <Card className="mt-12 p-8">
          <h2 className="mb-6 font-display text-2xl font-bold text-white">
            Especificações Técnicas
          </h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {product.specifications.map((spec, idx) => (
              <div key={idx} className="border-l-2 border-gold-400 pl-4">
                <p className="text-sm text-neutral-500">{spec.label}</p>
                <p className="font-semibold text-white">{spec.value}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* Related Products */}
        <div className="mt-20">
          <h2 className="mb-8 text-center font-display text-3xl font-bold text-white">
            Produtos Relacionados
          </h2>
          <div className="grid gap-8 md:grid-cols-2">
            {/* Placeholder for related products */}
            <Card variant="hover" className="p-6">
              <p className="text-center text-neutral-500">Produtos relacionados em breve</p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
