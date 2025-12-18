import { PrismaClient, ProductCategory, PriceType } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { config } from 'dotenv'

// Load test environment variables
config({ path: '.env.test' })

const prisma = new PrismaClient()

/**
 * Test seed for E2E tests
 * Creates minimal test data for Quote Wizard and authentication flows
 */
async function main() {
  console.log('🌱 Seeding test database for E2E tests...')

  // Clean existing data (in order due to foreign key constraints)
  await prisma.message.deleteMany()
  await prisma.conversation.deleteMany()
  await prisma.document.deleteMany()
  await prisma.appointment.deleteMany()
  await prisma.orderTimelineEntry.deleteMany()
  await prisma.orderItem.deleteMany()
  await prisma.order.deleteMany()
  await prisma.quoteItem.deleteMany()
  await prisma.quote.deleteMany()
  await prisma.product.deleteMany()
  await prisma.account.deleteMany()
  await prisma.session.deleteMany()
  await prisma.user.deleteMany()

  console.log('✅ Database cleaned')

  // Create test users
  const adminPassword = await bcrypt.hash('admin123', 12)
  const customerPassword = await bcrypt.hash('customer123', 12)

  const admin = await prisma.user.create({
    data: {
      email: 'admin@versatiglass.com',
      password: adminPassword,
      name: 'Admin Test',
      phone: '+5521982536229',
      role: 'ADMIN',
      emailVerified: new Date(),
      street: 'Rua Admin',
      number: '123',
      neighborhood: 'Centro',
      city: 'Rio de Janeiro',
      state: 'RJ',
      zipCode: '20000-000',
    },
  })

  const customer = await prisma.user.create({
    data: {
      email: 'customer@versatiglass.com',
      password: customerPassword,
      name: 'Customer Test',
      phone: '+5521987654321',
      role: 'CUSTOMER',
      emailVerified: new Date(),
      street: 'Rua Cliente',
      number: '456',
      neighborhood: 'Barra',
      city: 'Rio de Janeiro',
      state: 'RJ',
      zipCode: '22000-000',
    },
  })

  console.log('✅ Users created:', { admin: admin.email, customer: customer.email })

  // Create test products for Quote Wizard - Expanded catalog
  const products = [
    // BOX PARA BANHEIRO
    {
      name: 'Box Frontal Incolor 8mm',
      slug: 'box-frontal-incolor-8mm',
      description:
        'Box para banheiro frontal em vidro temperado incolor 8mm com perfil de alumínio branco ou preto. Modelo com 1 folha fixa + 1 porta de correr. Inclui trilhos, puxadores e vedação.',
      shortDescription: 'Box frontal 8mm com perfil alumínio',
      category: ProductCategory.BOX,
      subcategory: 'Box Frontal',
      thumbnail: '/images/products/box-frontal-incolor.jpg',
      images: [
        '/images/products/box-frontal-incolor.jpg',
        '/images/products/box-frontal-perfil.jpg',
      ],
      priceType: PriceType.PER_M2,
      pricePerM2: 420.0,
      colors: ['Incolor'],
      finishes: ['Alumínio Branco', 'Alumínio Preto', 'Alumínio Bronze'],
      thicknesses: ['8mm'],
      isActive: true,
      isFeatured: true,
    },
    {
      name: 'Box de Canto (L) Fumê 8mm',
      slug: 'box-canto-fume-8mm',
      description:
        'Box para banheiro em L (canto) em vidro temperado fumê 8mm. Aproveita dois cantos do banheiro. Configuração: 2 fixas + 2 portas de correr com perfil de alumínio.',
      shortDescription: 'Box de canto fumê com alumínio',
      category: ProductCategory.BOX,
      subcategory: 'Box de Canto',
      thumbnail: '/images/products/box-canto-fume.jpg',
      images: ['/images/products/box-canto-fume.jpg'],
      priceType: PriceType.PER_M2,
      pricePerM2: 480.0,
      colors: ['Fumê', 'Bronze'],
      finishes: ['Alumínio Branco', 'Alumínio Preto'],
      thicknesses: ['8mm', '10mm'],
      isActive: true,
      isFeatured: true,
    },
    {
      name: 'Box de Abrir Incolor 10mm Premium',
      slug: 'box-abrir-incolor-10mm',
      description:
        'Box premium de abrir em vidro temperado incolor 10mm. Sistema com dobradiças em inox escovado. Visual clean e moderno. Abertura total do vão.',
      shortDescription: 'Box de abrir premium 10mm',
      category: ProductCategory.BOX,
      subcategory: 'Box de Abrir',
      thumbnail: '/images/products/box-abrir-premium.jpg',
      images: ['/images/products/box-abrir-premium.jpg'],
      priceType: PriceType.PER_M2,
      pricePerM2: 550.0,
      colors: ['Incolor', 'Extra Clear'],
      finishes: ['Inox Escovado', 'Inox Polido', 'Black Matte'],
      thicknesses: ['10mm'],
      isActive: true,
      isFeatured: true,
    },
    // ESPELHOS
    {
      name: 'Espelho Bisotado 4mm',
      slug: 'espelho-bisotado-4mm',
      description:
        'Espelho prata 4mm com acabamento bisotado nas bordas. Acabamento elegante e sofisticado. Ideal para banheiros e ambientes decorativos.',
      shortDescription: 'Espelho com bisotê decorativo',
      category: ProductCategory.ESPELHOS,
      subcategory: 'Decorativo',
      thumbnail: '/images/products/espelho-bisotado.jpg',
      images: ['/images/products/espelho-bisotado.jpg'],
      priceType: PriceType.PER_M2,
      pricePerM2: 320.0,
      colors: ['Prata'],
      finishes: ['Bisotado', 'Bisotê Duplo'],
      thicknesses: ['4mm', '6mm'],
      isActive: true,
      isFeatured: true,
    },
    {
      name: 'Espelho Bronze 4mm',
      slug: 'espelho-bronze-4mm',
      description:
        'Espelho bronze 4mm. Adiciona sofisticação e contraste aos ambientes. Bordas lapidadas. Ideal para decoração moderna.',
      shortDescription: 'Espelho bronze decorativo',
      category: ProductCategory.ESPELHOS,
      subcategory: 'Decorativo',
      thumbnail: '/images/products/espelho-bronze.jpg',
      images: ['/images/products/espelho-bronze.jpg'],
      priceType: PriceType.PER_M2,
      pricePerM2: 350.0,
      colors: ['Bronze'],
      finishes: ['Lapidado', 'Bisotado'],
      thicknesses: ['4mm'],
      isActive: true,
      isFeatured: false,
    },
    // GUARDA-CORPO
    {
      name: 'Guarda-Corpo Incolor 10mm',
      slug: 'guarda-corpo-incolor-10mm',
      description:
        'Guarda-corpo em vidro temperado laminado incolor 10mm (5+5) conforme NBR 7199. Sistema de fixação com perfil de alumínio. Máxima segurança e transparência.',
      shortDescription: 'Guarda-corpo temperado laminado NBR',
      category: ProductCategory.FECHAMENTOS,
      subcategory: 'Guarda-Corpo',
      thumbnail: '/images/products/guarda-corpo-incolor.jpg',
      images: ['/images/products/guarda-corpo-incolor.jpg'],
      priceType: PriceType.PER_M2,
      pricePerM2: 680.0,
      colors: ['Incolor'],
      finishes: ['Perfil Alumínio', 'Fixação Pontual'],
      thicknesses: ['10mm (5+5 laminado)'],
      isActive: true,
      isFeatured: true,
    },
    {
      name: 'Guarda-Corpo Verde 12mm',
      slug: 'guarda-corpo-verde-12mm',
      description:
        'Guarda-corpo premium em vidro temperado laminado verde 12mm (6+6). Sistema com fixação por pinças (spider glass). Alto padrão.',
      shortDescription: 'Guarda-corpo verde premium spider',
      category: ProductCategory.FECHAMENTOS,
      subcategory: 'Guarda-Corpo',
      thumbnail: '/images/products/guarda-corpo-verde.jpg',
      images: ['/images/products/guarda-corpo-verde.jpg'],
      priceType: PriceType.PER_M2,
      pricePerM2: 850.0,
      colors: ['Verde'],
      finishes: ['Spider Glass (Pinças Inox)', 'Perfil U Inox'],
      thicknesses: ['12mm (6+6 laminado)'],
      isActive: true,
      isFeatured: true,
    },
    // PORTAS
    {
      name: 'Porta de Vidro Pivotante 10mm',
      slug: 'porta-vidro-pivotante-10mm',
      description:
        'Porta de vidro temperado incolor 10mm com sistema pivotante. Inclui ferragens em inox escovado, puxador e fechadura. Medidas: 80cm x 210cm.',
      shortDescription: 'Porta pivotante com ferragens inox',
      category: ProductCategory.PORTAS,
      subcategory: 'Porta Pivotante',
      thumbnail: '/images/products/porta-pivotante.jpg',
      images: ['/images/products/porta-pivotante.jpg'],
      priceType: PriceType.FIXED,
      basePrice: 2800.0,
      priceRangeMin: 2500.0,
      priceRangeMax: 3200.0,
      colors: ['Incolor', 'Fumê', 'Extra Clear'],
      finishes: ['Inox Escovado', 'Inox Polido', 'Black Matte'],
      thicknesses: ['10mm'],
      isActive: true,
      isFeatured: true,
    },
    {
      name: 'Porta de Abrir Temperada 8mm',
      slug: 'porta-abrir-temperada-8mm',
      description:
        'Porta de abrir em vidro temperado 8mm com dobradiças em inox. Sistema tradicional, confiável e elegante. Medidas padrão: 70cm ou 80cm x 210cm.',
      shortDescription: 'Porta de abrir com dobradiças',
      category: ProductCategory.PORTAS,
      subcategory: 'Porta de Abrir',
      thumbnail: '/images/products/porta-abrir.jpg',
      images: ['/images/products/porta-abrir.jpg'],
      priceType: PriceType.FIXED,
      basePrice: 2200.0,
      priceRangeMin: 1900.0,
      priceRangeMax: 2600.0,
      colors: ['Incolor', 'Fumê', 'Bronze'],
      finishes: ['Inox Escovado', 'Cromado'],
      thicknesses: ['8mm', '10mm'],
      isActive: true,
      isFeatured: false,
    },
    // FECHAMENTOS / SACADAS
    {
      name: 'Cortina de Vidro para Sacada',
      slug: 'cortina-vidro-sacada',
      description:
        'Sistema de envidraçamento de sacada com painéis de vidro temperado 8mm. Trilhos em alumínio. Painéis deslizantes e recolhíveis. Proteção contra vento e chuva sem perder a vista.',
      shortDescription: 'Envidraçamento de sacada recolhível',
      category: ProductCategory.FECHAMENTOS,
      subcategory: 'Cortina de Vidro',
      thumbnail: '/images/products/cortina-vidro.jpg',
      images: ['/images/products/cortina-vidro.jpg'],
      priceType: PriceType.PER_M2,
      pricePerM2: 520.0,
      colors: ['Incolor'],
      finishes: ['Trilho Alumínio Branco', 'Trilho Alumínio Preto'],
      thicknesses: ['8mm'],
      isActive: true,
      isFeatured: true,
    },
    {
      name: 'Fachada Estrutural Spider Glass',
      slug: 'fachada-spider-glass',
      description:
        'Sistema de fachada estrutural com vidro laminado temperado e fixação por pinças (spider glass). Visual moderno e clean. Projeto sob medida com engenharia estrutural.',
      shortDescription: 'Fachada premium com pinças inox',
      category: ProductCategory.FECHAMENTOS,
      subcategory: 'Fachada',
      thumbnail: '/images/products/fachada-spider.jpg',
      images: ['/images/products/fachada-spider.jpg'],
      priceType: PriceType.QUOTE_ONLY,
      colors: ['Incolor', 'Verde', 'Refletivo Prata', 'Low-E'],
      finishes: ['Spider Glass', 'Pinças Inox 316'],
      thicknesses: ['10mm (5+5)', '12mm (6+6)', '16mm (8+8)'],
      isActive: true,
      isFeatured: true,
    },
    // TAMPOS E PRATELEIRAS
    {
      name: 'Tampo de Vidro Temperado 10mm',
      slug: 'tampo-vidro-temperado-10mm',
      description:
        'Tampo de mesa em vidro temperado incolor 10mm. Bordas lapidadas e polidas. Ideal para mesas de jantar, centro, escritório. Suporta uso intenso.',
      shortDescription: 'Tampo de mesa temperado lapidado',
      category: ProductCategory.TAMPOS_PRATELEIRAS,
      subcategory: 'Tampo de Mesa',
      thumbnail: '/images/products/tampo-mesa.jpg',
      images: ['/images/products/tampo-mesa.jpg'],
      priceType: PriceType.PER_M2,
      pricePerM2: 380.0,
      colors: ['Incolor', 'Fumê', 'Bronze'],
      finishes: ['Bordas Lapidadas', 'Bordas Bisotadas'],
      thicknesses: ['8mm', '10mm', '12mm'],
      isActive: true,
      isFeatured: false,
    },
    {
      name: 'Prateleira de Vidro 8mm',
      slug: 'prateleira-vidro-8mm',
      description:
        'Prateleira em vidro temperado incolor 8mm com bordas polidas. Inclui suportes cromados. Ideal para estantes, armários, nichos.',
      shortDescription: 'Prateleira com suportes cromados',
      category: ProductCategory.TAMPOS_PRATELEIRAS,
      subcategory: 'Prateleira',
      thumbnail: '/images/products/prateleira.jpg',
      images: ['/images/products/prateleira.jpg'],
      priceType: PriceType.PER_M2,
      pricePerM2: 280.0,
      colors: ['Incolor'],
      finishes: ['Bordas Polidas', 'Suportes Cromados', 'Suportes Inox'],
      thicknesses: ['6mm', '8mm', '10mm'],
      isActive: true,
      isFeatured: false,
    },
  ]

  for (const productData of products) {
    await prisma.product.create({ data: productData })
  }

  console.log(
    `✅ ${products.length} products created (${new Set(products.map((p) => p.category)).size} categories)`
  )

  // Create a test quote (optional - for quote management tests)
  const quote = await prisma.quote.create({
    data: {
      number: 'ORC-TEST-001',
      userId: customer.id,
      customerName: customer.name,
      customerEmail: customer.email,
      customerPhone: customer.phone ?? '',
      serviceStreet: 'Rua Teste',
      serviceNumber: '123',
      serviceNeighborhood: 'Centro',
      serviceCity: 'Rio de Janeiro',
      serviceState: 'RJ',
      serviceZipCode: '20000-000',
      status: 'DRAFT',
      source: 'WEBSITE',
      subtotal: 1500.0,
      total: 1500.0,
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 dias
    },
  })

  await prisma.quoteItem.create({
    data: {
      quoteId: quote.id,
      description: products[0].name,
      quantity: 2,
      unitPrice: 450.0,
      totalPrice: 900.0,
      width: 1.5,
      height: 2.0,
    },
  })

  console.log('✅ Test quote created:', quote.number)

  console.log('\n🎉 Test seed completed successfully!')
  console.log('\n📋 Test Credentials:')
  console.log('   Admin:    admin@versatiglass.com / admin123')
  console.log('   Customer: customer@versatiglass.com / customer123')
  console.log('\n📦 Test Data:')
  console.log(`   Products: ${products.length}`)
  console.log(`   Categories: ${new Set(products.map((p) => p.category)).size}`)
  console.log(`   Quotes: 1`)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error('❌ Error seeding test database:', e)
    await prisma.$disconnect()
    process.exit(1)
  })
