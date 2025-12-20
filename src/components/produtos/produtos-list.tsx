'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'

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

export function ProdutosList() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  // Filter products based on search and category
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch =
        searchTerm === '' ||
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory

      return matchesSearch && matchesCategory
    })
  }, [searchTerm, selectedCategory])

  return (
    <>
      {/* Filters */}
      <div className="mb-12 grid gap-4 md:grid-cols-2">
        <Input
          type="search"
          placeholder="Buscar produtos..."
          className="w-full"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="border-theme-default bg-theme-elevated text-theme-primary focus:ring-accent-500/20 rounded-md border px-4 py-2 text-sm focus:border-accent-500 focus:outline-none focus:ring-2"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
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

      {/* Results count */}
      <div className="mb-6 text-center">
        <p className="text-theme-muted text-sm">
          {filteredProducts.length === 0
            ? 'Nenhum produto encontrado'
            : `${filteredProducts.length} produto${filteredProducts.length > 1 ? 's' : ''} encontrado${filteredProducts.length > 1 ? 's' : ''}`}
        </p>
      </div>

      {/* Products Grid */}
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {filteredProducts.map((product) => (
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

      {/* Empty state */}
      {filteredProducts.length === 0 && (
        <div className="py-20 text-center">
          <p className="text-theme-muted mb-4 text-lg">
            Nenhum produto encontrado com os filtros selecionados.
          </p>
          <Button
            variant="outline"
            onClick={() => {
              setSearchTerm('')
              setSelectedCategory('all')
            }}
          >
            Limpar Filtros
          </Button>
        </div>
      )}
    </>
  )
}
