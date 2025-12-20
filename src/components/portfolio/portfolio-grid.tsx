'use client'

import { useState, useMemo } from 'react'
import Image from 'next/image'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

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
    description: 'Divisórias de vidro acústico, fachada frontal e portas de entrada automáticas.',
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

export function PortfolioGrid() {
  const [selectedCategory, setSelectedCategory] = useState('all')

  // Filter projects based on category
  const filteredProjects = useMemo(() => {
    if (selectedCategory === 'all') {
      return projects
    }
    return projects.filter((project) => project.category === selectedCategory)
  }, [selectedCategory])

  return (
    <>
      {/* Filter */}
      <section className="px-6 py-12">
        <div className="mx-auto max-w-7xl">
          <div className="flex justify-center">
            <select
              className="border-theme-default bg-theme-elevated text-theme-primary focus:ring-accent-500/20 w-full max-w-xs rounded-md border px-4 py-2 text-sm focus:border-accent-500 focus:outline-none focus:ring-2"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
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
          {/* Results count */}
          <div className="mb-6 text-center">
            <p className="text-theme-muted text-sm">
              {filteredProjects.length === 0
                ? 'Nenhum projeto encontrado'
                : `${filteredProjects.length} projeto${filteredProjects.length > 1 ? 's' : ''} encontrado${filteredProjects.length > 1 ? 's' : ''}`}
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {filteredProjects.map((project) => (
              <Card key={project.id} variant="hover" className="group overflow-hidden">
                <div className="bg-theme-elevated relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="from-theme-primary absolute inset-0 bg-gradient-to-t via-transparent to-transparent opacity-60" />
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
                  <h3 className="text-theme-primary mb-2 text-xl font-bold">{project.title}</h3>
                  <p className="text-theme-subtle mb-1 text-sm">
                    {project.location} • {project.year}
                  </p>
                  <p className="text-theme-muted mb-4 text-sm">{project.description}</p>
                  <div className="mb-4 flex flex-wrap gap-2">
                    {project.services.map((service, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {service}
                      </Badge>
                    ))}
                  </div>
                  <Button variant="outline" className="w-full" disabled>
                    Ver Projeto Completo (em breve)
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          {/* Empty state */}
          {filteredProjects.length === 0 && (
            <div className="py-20 text-center">
              <p className="text-theme-muted mb-4 text-lg">
                Nenhum projeto encontrado com o filtro selecionado.
              </p>
              <Button variant="outline" onClick={() => setSelectedCategory('all')}>
                Mostrar Todos
              </Button>
            </div>
          )}
        </div>
      </section>
    </>
  )
}
