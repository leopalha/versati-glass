#!/usr/bin/env node
import { PrismaClient } from '@prisma/client'
import { config } from 'dotenv'

// Load .env.test
config({ path: '.env.test' })

const connectionStrings = [
  process.env.DATABASE_URL, // From .env.test
  'postgresql://postgres@localhost:5432/versatiglass', // No password
  'postgresql://postgres:@localhost:5432/versatiglass', // Empty password
  'postgresql://postgres:admin@localhost:5432/versatiglass', // Common default
  'postgresql://postgres:root@localhost:5432/versatiglass', // Common default
  'postgresql://postgres:postgres@localhost:5432/postgres', // Default postgres DB
]

console.log('🔍 Testing PostgreSQL connections...\n')

for (let i = 0; i < connectionStrings.length; i++) {
  const connStr = connectionStrings[i]
  console.log(`[${i + 1}/${connectionStrings.length}] Testing: ${connStr?.replace(/:[^:@]+@/, ':****@')}`)

  try {
    const prisma = new PrismaClient({
      datasources: {
        db: {
          url: connStr
        }
      },
      log: []
    })

    await prisma.$connect()
    console.log(`✅ SUCCESS! Connection works!\n`)
    console.log(`Working connection string:`)
    console.log(connStr)
    console.log(`\nUpdate your .env.test with this value.`)

    await prisma.$disconnect()
    process.exit(0)
  } catch (error) {
    console.log(`❌ Failed: ${error.message.split('\n')[0]}\n`)
  }
}

console.log('❌ All connection attempts failed.')
console.log('\n📋 Next steps:')
console.log('1. Check PostgreSQL is running: netstat -an | findstr "5432"')
console.log('2. Find your PostgreSQL password in installation notes')
console.log('3. Or reset PostgreSQL password using pgAdmin')
console.log('4. Update DATABASE_URL in .env.test with correct credentials')

process.exit(1)
