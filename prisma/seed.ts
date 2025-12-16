import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seed...')

  // Limpar dados existentes
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

  // Criar usuários
  const adminPassword = await bcrypt.hash('admin123', 12)
  const admin = await prisma.user.create({
    data: {
      email: 'admin@versatiglass.com.br',
      password: adminPassword,
      name: 'Administrador',
      phone: '+5521982536229',
      role: 'ADMIN',
      emailVerified: new Date(),
    },
  })

  const customerPassword = await bcrypt.hash('cliente123', 12)
  const customer = await prisma.user.create({
    data: {
      email: 'cliente@example.com',
      password: customerPassword,
      name: 'João Silva',
      phone: '+5521987654321',
      role: 'CUSTOMER',
      emailVerified: new Date(),
      street: 'Rua Exemplo',
      number: '100',
      neighborhood: 'Freguesia',
      city: 'Rio de Janeiro',
      state: 'RJ',
      zipCode: '22745-005',
    },
  })

  console.log('✅ Usuários criados')

  // Criar produtos
  const products = await Promise.all([
    // BOX
    prisma.product.create({
      data: {
        name: 'Box Elegance',
        slug: 'box-elegance',
        description:
          'Box de correr com roldanas modernas e design sofisticado. Perfeito para banheiros de todos os tamanhos.',
        shortDescription: 'Box de correr premium',
        category: 'BOX',
        subcategory: 'Correr',
        images: ['/products/box-elegance-1.jpg', '/products/box-elegance-2.jpg'],
        thumbnail: '/products/box-elegance-thumb.jpg',
        priceType: 'QUOTE_ONLY',
        priceRangeMin: 1800,
        priceRangeMax: 2500,
        colors: ['Preto', 'Branco', 'Inox', 'Bronze'],
        finishes: [],
        thicknesses: ['8mm'],
        isActive: true,
        isFeatured: true,
        metaTitle: 'Box Elegance - Vidraçaria Versati Glass',
        metaDescription: 'Box de correr premium para seu banheiro. Orçamento online.',
      },
    }),
    prisma.product.create({
      data: {
        name: 'Box Flex',
        slug: 'box-flex',
        description:
          'Solução inovadora para espaços compactos. Maximiza o uso do banheiro sem comprometer o design.',
        shortDescription: 'Ideal para espaços pequenos',
        category: 'BOX',
        subcategory: 'Especial',
        images: ['/products/box-flex-1.jpg'],
        thumbnail: '/products/box-flex-thumb.jpg',
        priceType: 'QUOTE_ONLY',
        priceRangeMin: 1600,
        priceRangeMax: 2200,
        colors: ['Preto', 'Branco', 'Inox'],
        finishes: [],
        thicknesses: ['8mm'],
        isActive: true,
        isFeatured: true,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Box Comum',
        slug: 'box-comum',
        description:
          'Box de abrir tradicional com design clean e funcional. Excelente custo-benefício.',
        shortDescription: 'Box de abrir tradicional',
        category: 'BOX',
        subcategory: 'Abrir',
        images: ['/products/box-comum-1.jpg'],
        thumbnail: '/products/box-comum-thumb.jpg',
        priceType: 'QUOTE_ONLY',
        priceRangeMin: 1400,
        priceRangeMax: 1900,
        colors: ['Preto', 'Branco', 'Inox', 'Bronze'],
        finishes: [],
        thicknesses: ['8mm'],
        isActive: true,
        isFeatured: false,
      },
    }),
    // ESPELHOS
    prisma.product.create({
      data: {
        name: 'Espelho Guardian 4mm',
        slug: 'espelho-guardian-4mm',
        description:
          'Espelho de alta qualidade Guardian 4mm. Ideal para qualquer ambiente.',
        shortDescription: 'Espelho padrão premium',
        category: 'ESPELHOS',
        subcategory: 'Padrão',
        images: ['/products/espelho-4mm-1.jpg'],
        thumbnail: '/products/espelho-4mm-thumb.jpg',
        priceType: 'PER_M2',
        pricePerM2: 180,
        colors: [],
        finishes: ['Liso', 'Lapidado', 'Bisotê'],
        thicknesses: ['4mm'],
        isActive: true,
        isFeatured: false,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Espelho com LED',
        slug: 'espelho-com-led',
        description:
          'Espelho moderno com iluminação LED integrada. Perfeito para banheiros e closets.',
        shortDescription: 'Espelho iluminado',
        category: 'ESPELHOS',
        subcategory: 'LED',
        images: ['/products/espelho-led-1.jpg'],
        thumbnail: '/products/espelho-led-thumb.jpg',
        priceType: 'QUOTE_ONLY',
        priceRangeMin: 800,
        priceRangeMax: 2500,
        colors: [],
        finishes: [],
        thicknesses: ['4mm'],
        isActive: true,
        isFeatured: true,
      },
    }),
    // VIDROS
    prisma.product.create({
      data: {
        name: 'Vidro Temperado 8mm',
        slug: 'vidro-temperado-8mm',
        description: 'Vidro temperado de 8mm para diversas aplicações.',
        shortDescription: 'Vidro temperado padrão',
        category: 'VIDROS',
        subcategory: 'Temperado',
        images: ['/products/vidro-8mm-1.jpg'],
        thumbnail: '/products/vidro-8mm-thumb.jpg',
        priceType: 'PER_M2',
        pricePerM2: 250,
        colors: ['Transparente', 'Fumê', 'Verde'],
        finishes: [],
        thicknesses: ['8mm'],
        isActive: true,
        isFeatured: false,
      },
    }),
  ])

  console.log('✅ Produtos criados')

  // Criar orçamento de exemplo
  const quote = await prisma.quote.create({
    data: {
      number: 'ORC-2024-0001',
      userId: customer.id,
      customerName: customer.name,
      customerEmail: customer.email,
      customerPhone: customer.phone || '(21) 98765-4321',
      serviceStreet: 'Rua Exemplo',
      serviceNumber: '100',
      serviceNeighborhood: 'Freguesia',
      serviceCity: 'Rio de Janeiro',
      serviceState: 'RJ',
      serviceZipCode: '22745-005',
      subtotal: 2000,
      discount: 0,
      total: 2000,
      status: 'SENT',
      validUntil: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 dias
      source: 'WEBSITE',
      items: {
        create: [
          {
            productId: products[0].id,
            description: 'Box Elegance - Ferragem Preta',
            specifications: '1,20m x 1,90m',
            width: 1.2,
            height: 1.9,
            quantity: 1,
            color: 'Preto',
            unitPrice: 2000,
            totalPrice: 2000,
            customerImages: [],
          },
        ],
      },
    },
  })

  console.log('✅ Orçamento criado')

  // Criar ordem de exemplo
  const order = await prisma.order.create({
    data: {
      number: 'OS-2024-0001',
      userId: customer.id,
      quoteId: quote.id,
      serviceStreet: 'Rua Exemplo',
      serviceNumber: '100',
      serviceNeighborhood: 'Freguesia',
      serviceCity: 'Rio de Janeiro',
      serviceState: 'RJ',
      serviceZipCode: '22745-005',
      subtotal: 2000,
      installationFee: 200,
      total: 2200,
      paymentStatus: 'PAID',
      paymentMethod: 'PIX',
      paidAmount: 2200,
      status: 'EM_PRODUCAO',
      estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 dias
      warrantyUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 ano
      items: {
        create: [
          {
            productId: products[0].id,
            description: 'Box Elegance - Ferragem Preta',
            specifications: '1,20m x 1,90m',
            width: 1.2,
            height: 1.9,
            quantity: 1,
            color: 'Preto',
            unitPrice: 2000,
            totalPrice: 2000,
            status: 'IN_PRODUCTION',
          },
        ],
      },
      timeline: {
        create: [
          {
            status: 'ORCAMENTO_ENVIADO',
            description: 'Orçamento enviado ao cliente',
            createdBy: 'system',
            createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
          },
          {
            status: 'APROVADO',
            description: 'Cliente aprovou o orçamento',
            createdBy: customer.id,
            createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          },
          {
            status: 'EM_PRODUCAO',
            description: 'Produção iniciada',
            createdBy: admin.id,
            createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
          },
        ],
      },
    },
  })

  console.log('✅ Ordem criada')

  // Criar agendamento
  const appointment = await prisma.appointment.create({
    data: {
      userId: customer.id,
      orderId: order.id,
      type: 'INSTALACAO',
      scheduledDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
      scheduledTime: '14:00',
      estimatedDuration: 180,
      addressStreet: 'Rua Exemplo',
      addressNumber: '100',
      addressNeighborhood: 'Freguesia',
      addressCity: 'Rio de Janeiro',
      addressState: 'RJ',
      addressZipCode: '22745-005',
      status: 'SCHEDULED',
      assignedToId: admin.id,
    },
  })

  console.log('✅ Agendamento criado')

  console.log('🎉 Seed concluído com sucesso!')
  console.log('\n📊 Resumo:')
  console.log(`- ${products.length} produtos`)
  console.log(`- 2 usuários (admin + cliente)`)
  console.log(`- 1 orçamento`)
  console.log(`- 1 ordem`)
  console.log(`- 1 agendamento`)
  console.log('\n🔐 Credenciais:')
  console.log('Admin: admin@versatiglass.com.br / admin123')
  console.log('Cliente: cliente@example.com / cliente123')
}

main()
  .catch((e) => {
    console.error('❌ Erro no seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
