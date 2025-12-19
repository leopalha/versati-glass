import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Todas as categorias que devem estar disponíveis
const expectedCategories = [
  'BOX',
  'ESPELHOS',
  'VIDROS',
  'PORTAS',
  'JANELAS',
  'GUARDA_CORPO',
  'CORTINAS_VIDRO',
  'PERGOLADOS',
  'TAMPOS_PRATELEIRAS',
  'DIVISORIAS',
  'FECHAMENTOS',
  'FERRAGENS',
  'KITS',
  'SERVICOS',
  'OUTROS'
]

async function testCategories() {
  try {
    console.log('🧪 Testing Product Categories...\n')

    // Contar produtos por categoria
    const categoryCounts = {}

    for (const category of expectedCategories) {
      const count = await prisma.product.count({
        where: { category }
      })
      categoryCounts[category] = count
    }

    console.log('📊 Produtos por categoria:')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')

    let totalProducts = 0
    expectedCategories.forEach(cat => {
      const count = categoryCounts[cat]
      totalProducts += count
      const icon = count > 0 ? '✅' : '⚠️ '
      console.log(`${icon} ${cat.padEnd(20)} ${count} produto(s)`)
    })

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log(`📦 TOTAL: ${totalProducts} produtos\n`)

    // Verificar se podemos criar quote para categoria problemática
    console.log('🧪 Testando criação de quote para GUARDA_CORPO...')

    // Buscar um produto de GUARDA_CORPO
    const guardaCorpoProduct = await prisma.product.findFirst({
      where: { category: 'GUARDA_CORPO' }
    })

    if (guardaCorpoProduct) {
      console.log(`✅ Produto encontrado: ${guardaCorpoProduct.name}`)
      console.log(`   ID: ${guardaCorpoProduct.id}`)
      console.log(`   Categoria: ${guardaCorpoProduct.category}`)
    } else {
      console.log('⚠️  Nenhum produto GUARDA_CORPO encontrado no banco')
    }

    await prisma.$disconnect()
    process.exit(0)
  } catch (error) {
    console.error('❌ ERROR:', error.message)
    await prisma.$disconnect()
    process.exit(1)
  }
}

testCategories()
