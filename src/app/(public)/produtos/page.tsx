import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'

export const metadata: Metadata = {
  title: 'Produtos - Versati Glass',
  description:
    'Conheça nossa linha completa de produtos em vidro: box, espelhos, guarda-corpos, divisórias, fachadas e muito mais.',
}

const products = [
  {
    id: 1,
    slug: 'box-premium',
    name: 'Box de Vidro Premium',
    category: 'box',
    description: 'Box sob medida com vidro temperado 8mm, perfis em alumínio',
    price: 'A partir de R$ 1.890',
    image: '/images/products/box-premium.jpg',
    badge: 'Mais Vendido',
    features: ['Vidro temperado 8mm', 'Perfis em alumínio', 'Garantia vitalícia'],
  },
  {
    id: 2,
    slug: 'box-incolor',
    name: 'Box Incolor Padrão',
    category: 'box',
    description: 'Box com vidro temperado 8mm incolor, acabamento padrão',
    price: 'A partir de R$ 1.490',
    image: '/images/products/box-incolor.jpg',
    features: ['Vidro temperado 8mm', 'Acabamento padrão', '2 anos de garantia'],
  },
  {
    id: 3,
    slug: 'guarda-corpo-vidro',
    name: 'Guarda-Corpo de Vidro',
    category: 'guarda-corpo',
    description: 'Guarda-corpo com vidro laminado 10mm, fixação por botões',
    price: 'A partir de R$ 890/m',
    image: '/images/products/guarda-corpo.jpg',
    badge: 'Premium',
    features: ['Vidro laminado 10mm', 'Fixação invisível', 'Alta resistência'],
  },
  {
    id: 4,
    slug: 'espelho-led',
    name: 'Espelho com LED Integrado',
    category: 'espelhos',
    description: 'Espelho decorativo com iluminação LED de alta eficiência',
    price: 'A partir de R$ 850',
    image: '/images/products/espelho-led.jpg',
    badge: 'Destaque',
    features: ['Iluminação LED', 'Sensor touch', 'Antiembaçante'],
  },
  {
    id: 5,
    slug: 'espelho-bisotado',
    name: 'Espelho Bisotado',
    category: 'espelhos',
    description: 'Espelho com acabamento bisotado de 2cm em toda borda',
    price: 'A partir de R$ 450',
    image: '/images/products/espelho-bisotado.jpg',
    features: ['Bisotê 2cm', 'Espessura 4mm', 'Fixação inclusa'],
  },
  {
    id: 6,
    slug: 'divisoria-escritorio',
    name: 'Divisória para Escritório',
    category: 'divisorias',
    description: 'Divisória em vidro temperado 10mm com perfis de alumínio',
    price: 'A partir de R$ 690/m²',
    image: '/images/products/divisoria.jpg',
    features: ['Vidro temperado 10mm', 'Perfis de alumínio', 'Acústica'],
  },
  {
    id: 7,
    slug: 'porta-vidro-correr',
    name: 'Porta de Vidro de Correr',
    category: 'portas',
    description: 'Porta de correr com vidro temperado e trilho superior',
    price: 'A partir de R$ 2.190',
    image: '/images/products/porta-correr.jpg',
    features: ['Sistema de trilho', 'Vidro temperado', 'Fechadura inclusa'],
  },
  {
    id: 8,
    slug: 'fachada-comercial',
    name: 'Fachada de Vidro Comercial',
    category: 'fachadas',
    description: 'Fachada estrutural com vidro de controle solar',
    price: 'Sob Consulta',
    image: '/images/products/fachada.jpg',
    badge: 'Corporativo',
    features: ['Controle solar', 'Alta performance', 'Estrutura reforçada'],
  },
  {
    id: 9,
    slug: 'tampo-vidro-mesa',
    name: 'Tampo de Vidro para Mesa',
    category: 'outros',
    description: 'Tampo de vidro temperado com bordas polidas',
    price: 'A partir de R$ 380',
    image: '/images/products/tampo.jpg',
    features: ['Vidro temperado', 'Bordas polidas', 'Sob medida'],
  },
  {
    id: 10,
    slug: 'box-canto',
    name: 'Box de Canto',
    category: 'box',
    description: 'Box de canto com porta de abrir, vidro temperado 8mm',
    price: 'A partir de R$ 1.690',
    image: '/images/products/box-canto.jpg',
    features: ['Vidro temperado 8mm', 'Porta de abrir', 'Dobradiças premium'],
  },
  {
    id: 11,
    slug: 'guarda-corpo-inox',
    name: 'Guarda-Corpo Misto (Vidro + Inox)',
    category: 'guarda-corpo',
    description: 'Guarda-corpo com vidro e corrimão em aço inox',
    price: 'A partir de R$ 1.190/m',
    image: '/images/products/guarda-corpo-inox.jpg',
    features: ['Vidro laminado', 'Corrimão inox', 'Design moderno'],
  },
  {
    id: 12,
    slug: 'janela-maxim-ar',
    name: 'Janela Maxim-Ar de Vidro',
    category: 'outros',
    description: 'Janela maxim-ar com vidro temperado e perfil de alumínio',
    price: 'A partir de R$ 890',
    image: '/images/products/janela.jpg',
    features: ['Abertura maxim-ar', 'Perfil de alumínio', 'Vidro temperado'],
  },
]

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

        {/* Filters */}
        <div className="mb-12 grid gap-4 md:grid-cols-2">
          <Input type="search" placeholder="Buscar produtos..." className="w-full" />
          <select className="border-theme-default bg-theme-elevated text-theme-primary focus:ring-accent-500/20 rounded-md border px-4 py-2 text-sm focus:border-accent-500 focus:outline-none focus:ring-2">
            <option value="all">Todas as Categorias</option>
            <option value="box">Box de Vidro</option>
            <option value="espelhos">Espelhos</option>
            <option value="guarda-corpo">Guarda-Corpos</option>
            <option value="divisorias">Divisórias</option>
            <option value="portas">Portas de Vidro</option>
            <option value="fachadas">Fachadas</option>
            <option value="outros">Outros</option>
          </select>
        </div>

        {/* Products Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <Card key={product.id} variant="hover" className="group overflow-hidden">
              <div className="bg-theme-elevated relative aspect-square overflow-hidden">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                {product.badge && (
                  <Badge variant="gold" className="absolute right-4 top-4">
                    {product.badge}
                  </Badge>
                )}
              </div>
              <div className="p-6">
                <h3 className="text-theme-primary mb-2 text-xl font-bold">{product.name}</h3>
                <p className="text-theme-muted mb-4 text-sm">{product.description}</p>
                <ul className="mb-4 space-y-1">
                  {product.features.map((feature, idx) => (
                    <li key={idx} className="text-theme-subtle text-xs">
                      • {feature}
                    </li>
                  ))}
                </ul>
                <p className="mb-4 text-lg font-semibold text-accent-400">{product.price}</p>
                <div className="grid gap-2">
                  <Button asChild className="w-full">
                    <Link href={`/produtos/${product.slug}`}>
                      Ver Detalhes
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="w-full">
                    <Link href="/orcamento">Solicitar Orçamento</Link>
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

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
