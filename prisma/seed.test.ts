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

  // Create test products for Quote Wizard
  const products = [
    {
      name: 'Box para Banheiro Premium',
      slug: 'box-banheiro-premium',
      description: 'Box de vidro temperado 8mm com perfil de alumínio',
      shortDescription: 'Box temperado 8mm',
      category: ProductCategory.BOX,
      subcategory: 'Premium',
      thumbnail: '/images/box-premium.jpg',
      images: ['/images/box-premium.jpg'],
      priceType: PriceType.PER_M2,
      pricePerM2: 450.0,
      colors: ['Incolor', 'Fumê', 'Bronze'],
      finishes: ['Alumínio Branco', 'Alumínio Preto'],
      thicknesses: ['8mm', '10mm'],
      isActive: true,
      isFeatured: true,
    },
    {
      name: 'Vidro Temperado Incolor',
      slug: 'vidro-temperado-incolor',
      description: 'Vidro temperado incolor de alta qualidade',
      shortDescription: 'Vidro temperado',
      category: ProductCategory.BOX,
      subcategory: 'Vidro',
      thumbnail: '/images/vidro-temperado.jpg',
      images: ['/images/vidro-temperado.jpg'],
      priceType: PriceType.PER_M2,
      pricePerM2: 350.0,
      colors: ['Incolor'],
      finishes: ['Polido'],
      thicknesses: ['6mm', '8mm', '10mm'],
      isActive: true,
      isFeatured: false,
    },
    {
      name: 'Espelho Bisotado',
      slug: 'espelho-bisotado',
      description: 'Espelho com acabamento bisotado',
      shortDescription: 'Espelho bisotado 4mm',
      category: ProductCategory.ESPELHOS,
      subcategory: 'Decorativo',
      thumbnail: '/images/espelho.jpg',
      images: ['/images/espelho.jpg'],
      priceType: PriceType.PER_M2,
      pricePerM2: 280.0,
      colors: ['Prata'],
      finishes: ['Bisotado', 'Reto'],
      thicknesses: ['4mm', '6mm'],
      isActive: true,
      isFeatured: true,
    },
    {
      name: 'Guarda-Corpo de Vidro',
      slug: 'guarda-corpo-vidro',
      description: 'Guarda-corpo em vidro temperado 10mm',
      shortDescription: 'Guarda-corpo 10mm',
      category: ProductCategory.FECHAMENTOS,
      subcategory: 'Guarda-Corpo',
      thumbnail: '/images/guarda-corpo.jpg',
      images: ['/images/guarda-corpo.jpg'],
      priceType: PriceType.PER_M2,
      pricePerM2: 650.0,
      colors: ['Incolor', 'Verde'],
      finishes: ['Polido'],
      thicknesses: ['10mm', '12mm'],
      isActive: true,
      isFeatured: true,
    },
    {
      name: 'Porta de Vidro',
      slug: 'porta-vidro',
      description: 'Porta de vidro temperado com ferragens',
      shortDescription: 'Porta temperada',
      category: ProductCategory.PORTAS_JANELAS,
      subcategory: 'Porta',
      thumbnail: '/images/porta-vidro.jpg',
      images: ['/images/porta-vidro.jpg'],
      priceType: PriceType.FIXED,
      basePrice: 2500.0,
      priceRangeMin: 2000.0,
      priceRangeMax: 3500.0,
      colors: ['Incolor', 'Fumê'],
      finishes: ['Cromado', 'Escovado'],
      thicknesses: ['10mm'],
      isActive: true,
      isFeatured: false,
    },
    {
      name: 'Fachada de Vidro',
      slug: 'fachada-vidro',
      description: 'Sistema de fachada em vidro temperado',
      shortDescription: 'Fachada completa',
      category: ProductCategory.FECHAMENTOS,
      subcategory: 'Fachada',
      thumbnail: '/images/fachada.jpg',
      images: ['/images/fachada.jpg'],
      priceType: PriceType.QUOTE_ONLY,
      colors: ['Incolor', 'Refletivo', 'Low-E'],
      finishes: ['Spider Glass', 'Structural Glazing'],
      thicknesses: ['10mm', '12mm', '15mm'],
      isActive: true,
      isFeatured: true,
    },
  ]

  for (const productData of products) {
    await prisma.product.create({ data: productData })
  }

  console.log(`✅ ${products.length} products created for Quote Wizard`)

  // Create a test quote (optional - for quote management tests)
  const quote = await prisma.quote.create({
    data: {
      number: 'ORC-TEST-001',
      userId: customer.id,
      customerName: customer.name,
      customerEmail: customer.email,
      customerPhone: customer.phone,
      serviceStreet: 'Rua Teste',
      serviceNumber: '123',
      serviceNeighborhood: 'Centro',
      serviceCity: 'Rio de Janeiro',
      serviceState: 'RJ',
      serviceZipCode: '20000-000',
      status: 'PENDING',
      totalAmount: 1500.0,
    },
  })

  await prisma.quoteItem.create({
    data: {
      quoteId: quote.id,
      productId: products[0].slug,
      productName: products[0].name,
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
