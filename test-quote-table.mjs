import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function testQuoteTable() {
  try {
    console.log('🔍 Testing quote table access...\n')

    // Test 1: Count quotes
    const count = await prisma.quote.count()
    console.log('✅ Quote table accessible!')
    console.log(`📊 Current quote count: ${count}\n`)

    // Test 2: Get last quote
    const lastQuote = await prisma.quote.findFirst({
      orderBy: { createdAt: 'desc' },
      include: { items: true }
    })

    if (lastQuote) {
      console.log('📄 Last quote:')
      console.log(`   Number: ${lastQuote.number}`)
      console.log(`   Customer: ${lastQuote.customerName}`)
      console.log(`   Items: ${lastQuote.items.length}`)
      console.log(`   Total: R$ ${lastQuote.total}`)
      console.log(`   Created: ${lastQuote.createdAt.toLocaleString('pt-BR')}`)
    } else {
      console.log('ℹ️  No quotes in database yet')
    }

    await prisma.$disconnect()
    process.exit(0)
  } catch (error) {
    console.error('❌ ERROR:', error.message)
    console.error('📋 Details:', error)
    await prisma.$disconnect()
    process.exit(1)
  }
}

testQuoteTable()
