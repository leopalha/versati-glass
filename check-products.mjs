import { PrismaClient } from '@prisma/client'
import { config } from 'dotenv'

// Load test environment
config({ path: '.env.test' })

const prisma = new PrismaClient()

async function checkProducts() {
  console.log('🔍 Checking products in database...\n')
  console.log('DATABASE_URL:', process.env.DATABASE_URL)

  try {
    // Count all products
    const totalProducts = await prisma.product.count()
    console.log(`\n📦 Total products: ${totalProducts}`)

    // Count BOX products
    const boxProducts = await prisma.product.count({
      where: { category: 'BOX' }
    })
    console.log(`📦 BOX products: ${boxProducts}`)

    // List BOX products
    const products = await prisma.product.findMany({
      where: { category: 'BOX' },
      select: {
        id: true,
        name: true,
        category: true,
        isActive: true,
        slug: true,
      }
    })

    console.log('\n📋 BOX Products:')
    products.forEach(p => {
      console.log(`  - ${p.name} (${p.slug}) - Active: ${p.isActive}`)
    })

    // Test API query
    console.log('\n🔍 Testing API-like query...')
    const apiResult = await prisma.product.findMany({
      where: {
        category: 'BOX',
        isActive: true,
      },
      select: {
        id: true,
        name: true,
        slug: true,
      }
    })
    console.log(`API would return ${apiResult.length} products`)

  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkProducts()
