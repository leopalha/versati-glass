import { PrismaClient, ProductCategory, PriceType } from '@prisma/client'

const prisma = new PrismaClient()

const products = [
  {
    name: 'Box de Vidro Premium',
    slug: 'box-premium',
    description:
      'Box sob medida com vidro temperado 8mm de alta qualidade, perfis em alumínio anodizado e acabamento impecável. Ideal para banheiros modernos e sofisticados.',
    shortDescription: 'Box sob medida com vidro temperado 8mm, perfis em alumínio',
    category: ProductCategory.BOX,
    images: ['/images/products/box-premium.jpg'],
    thumbnail: '/images/products/box-premium.jpg',
    priceType: PriceType.FIXED,
    priceRangeMin: 1890,
    colors: ['Incolor', 'Verde', 'Fumê', 'Bronze'],
    finishes: ['Alumínio anodizado'],
    thicknesses: ['8mm'],
    isActive: true,
  },
  {
    name: 'Box Incolor Padrão',
    slug: 'box-incolor',
    description:
      'Box com vidro temperado 8mm incolor, acabamento padrão de alta qualidade. Ótima relação custo-benefício para seu banheiro.',
    shortDescription: 'Box com vidro temperado 8mm incolor, acabamento padrão',
    category: ProductCategory.BOX,
    images: ['/images/products/box-incolor.jpg'],
    thumbnail: '/images/products/box-incolor.jpg',
    priceType: PriceType.FIXED,
    priceRangeMin: 1490,
    colors: ['Incolor'],
    finishes: ['Alumínio padrão'],
    thicknesses: ['8mm'],
    isActive: true,
  },
  {
    name: 'Guarda-Corpo de Vidro',
    slug: 'guarda-corpo-vidro',
    description:
      'Guarda-corpo em vidro laminado 10mm com fixação por botões de inox. Segurança máxima combinada com design minimalista e elegante.',
    shortDescription: 'Guarda-corpo com vidro laminado 10mm, fixação por botões',
    category: ProductCategory.GUARDA_CORPO,
    images: ['/images/products/guarda-corpo.jpg'],
    thumbnail: '/images/products/guarda-corpo.jpg',
    priceType: PriceType.PER_M2,
    pricePerM2: 890,
    colors: ['Incolor', 'Verde', 'Fumê'],
    finishes: ['Botões de inox'],
    thicknesses: ['10mm laminado'],
    isActive: true,
  },
  {
    name: 'Espelho com LED Integrado',
    slug: 'espelho-led',
    description:
      'Espelho decorativo premium com iluminação LED de alta eficiência energética, sensor touch e função antiembaçante. Perfeito para banheiros modernos.',
    shortDescription: 'Espelho decorativo com iluminação LED de alta eficiência',
    category: ProductCategory.ESPELHOS,
    images: ['/images/products/espelho-led.jpg'],
    thumbnail: '/images/products/espelho-led.jpg',
    priceType: PriceType.FIXED,
    priceRangeMin: 850,
    colors: ['Incolor'],
    finishes: ['Bisotado 1cm', 'LED integrado'],
    thicknesses: ['5mm'],
    isActive: true,
  },
  {
    name: 'Espelho Bisotado',
    slug: 'espelho-bisotado',
    description:
      'Espelho com acabamento bisotado de 2cm em toda borda. Elegância clássica para qualquer ambiente.',
    shortDescription: 'Espelho com acabamento bisotado de 2cm em toda borda',
    category: ProductCategory.ESPELHOS,
    images: ['/images/products/espelho-bisotado.jpg'],
    thumbnail: '/images/products/espelho-bisotado.jpg',
    priceType: PriceType.FIXED,
    priceRangeMin: 450,
    colors: ['Incolor'],
    finishes: ['Bisotê 2cm'],
    thicknesses: ['4mm'],
    isActive: true,
  },
  {
    name: 'Divisória para Escritório',
    slug: 'divisoria-escritorio',
    description:
      'Divisória em vidro temperado 10mm com perfis de alumínio. Solução ideal para ambientes corporativos modernos.',
    shortDescription: 'Divisória em vidro temperado 10mm com perfis de alumínio',
    category: ProductCategory.DIVISORIAS,
    images: ['/images/products/divisoria.jpg'],
    thumbnail: '/images/products/divisoria.jpg',
    priceType: PriceType.PER_M2,
    pricePerM2: 690,
    colors: ['Incolor', 'Fumê'],
    finishes: ['Alumínio anodizado'],
    thicknesses: ['10mm'],
    isActive: true,
  },
  {
    name: 'Porta de Vidro de Correr',
    slug: 'porta-vidro-correr',
    description:
      'Porta de correr com vidro temperado e trilho superior. Design moderno e funcional.',
    shortDescription: 'Porta de correr com vidro temperado e trilho superior',
    category: ProductCategory.PORTAS,
    images: ['/images/products/porta-correr.jpg'],
    thumbnail: '/images/products/porta-correr.jpg',
    priceType: PriceType.FIXED,
    priceRangeMin: 2190,
    colors: ['Incolor', 'Fumê', 'Bronze'],
    finishes: ['Trilho superior', 'Puxadores inox'],
    thicknesses: ['8mm'],
    isActive: true,
  },
  {
    name: 'Fachada de Vidro Comercial',
    slug: 'fachada-comercial',
    description:
      'Fachada estrutural com vidro de controle solar. Solução completa para projetos corporativos.',
    shortDescription: 'Fachada estrutural com vidro de controle solar',
    category: ProductCategory.VIDROS,
    images: ['/images/products/fachada.jpg'],
    thumbnail: '/images/products/fachada.jpg',
    priceType: PriceType.QUOTE_ONLY,
    colors: ['Controle solar', 'Refletivo'],
    finishes: ['Sistema estrutural'],
    thicknesses: ['Sob projeto'],
    isActive: true,
  },
  {
    name: 'Tampo de Vidro para Mesa',
    slug: 'tampo-vidro-mesa',
    description:
      'Tampo de vidro temperado com bordas polidas. Sob medida para sua mesa.',
    shortDescription: 'Tampo de vidro temperado com bordas polidas',
    category: ProductCategory.TAMPOS_PRATELEIRAS,
    images: ['/images/products/tampo.jpg'],
    thumbnail: '/images/products/tampo.jpg',
    priceType: PriceType.FIXED,
    priceRangeMin: 380,
    colors: ['Incolor', 'Fumê'],
    finishes: ['Bordas polidas'],
    thicknesses: ['6mm', '8mm', '10mm'],
    isActive: true,
  },
  {
    name: 'Box de Canto',
    slug: 'box-canto',
    description:
      'Box de canto com porta de abrir, vidro temperado 8mm. Aproveitamento ideal para banheiros pequenos.',
    shortDescription: 'Box de canto com porta de abrir, vidro temperado 8mm',
    category: ProductCategory.BOX,
    images: ['/images/products/box-canto.jpg'],
    thumbnail: '/images/products/box-canto.jpg',
    priceType: PriceType.FIXED,
    priceRangeMin: 1690,
    colors: ['Incolor', 'Verde', 'Fumê'],
    finishes: ['Dobradiças premium'],
    thicknesses: ['8mm'],
    isActive: true,
  },
  {
    name: 'Guarda-Corpo Misto (Vidro + Inox)',
    slug: 'guarda-corpo-inox',
    description:
      'Guarda-corpo com vidro laminado e corrimão em aço inox. Design moderno e seguro.',
    shortDescription: 'Guarda-corpo com vidro e corrimão em aço inox',
    category: ProductCategory.GUARDA_CORPO,
    images: ['/images/products/guarda-corpo-inox.jpg'],
    thumbnail: '/images/products/guarda-corpo-inox.jpg',
    priceType: PriceType.PER_M2,
    pricePerM2: 1190,
    colors: ['Incolor', 'Verde'],
    finishes: ['Corrimão inox escovado'],
    thicknesses: ['10mm laminado'],
    isActive: true,
  },
  {
    name: 'Janela Maxim-Ar de Vidro',
    slug: 'janela-maxim-ar',
    description:
      'Janela maxim-ar com vidro temperado e perfil de alumínio. Ventilação controlada e segura.',
    shortDescription: 'Janela maxim-ar com vidro temperado e perfil de alumínio',
    category: ProductCategory.JANELAS,
    images: ['/images/products/janela.jpg'],
    thumbnail: '/images/products/janela.jpg',
    priceType: PriceType.FIXED,
    priceRangeMin: 890,
    colors: ['Branco', 'Preto', 'Natural'],
    finishes: ['Alumínio anodizado'],
    thicknesses: ['6mm'],
    isActive: true,
  },
]

async function main() {
  console.log('🌱 Iniciando seed de produtos...')

  // Limpar produtos existentes
  await prisma.product.deleteMany({})
  console.log('✅ Produtos existentes removidos')

  // Criar produtos
  for (const product of products) {
    await prisma.product.create({
      data: product,
    })
    console.log(`✅ Criado: ${product.name}`)
  }

  console.log('🎉 Seed concluído! 12 produtos criados.')
}

main()
  .catch((e) => {
    console.error('❌ Erro no seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
