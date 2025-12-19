import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function checkProducts() {
  try {
    const products = await prisma.product.findMany({
      orderBy: { category: 'asc' }
    })

    console.log(`\n📊 TOTAL DE PRODUTOS: ${products.length}\n`)

    // Group by category
    const byCategory = {}
    products.forEach(p => {
      if (!byCategory[p.category]) {
        byCategory[p.category] = []
      }
      byCategory[p.category].push(p)
    })

    // Display by category
    Object.entries(byCategory).forEach(([category, items]) => {
      console.log(`\n📁 ${category} (${items.length} produtos)`)
      console.log('─'.repeat(60))
      items.forEach(p => {
        console.log(`  • ${p.name}`)
        console.log(`    - Slug: ${p.slug}`)
        console.log(`    - Preço: R$ ${p.basePrice}`)
        console.log(`    - Descrição: ${p.description?.substring(0, 80) || 'N/A'}...`)
        console.log(`    - Imagem: ${p.image || 'N/A'}`)
        console.log('')
      })
    })

    console.log('\n📈 RESUMO POR CATEGORIA:')
    console.log('─'.repeat(60))
    Object.entries(byCategory).forEach(([category, items]) => {
      console.log(`  ${category}: ${items.length} produtos`)
    })

  } catch (error) {
    console.error('❌ Erro:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkProducts()
