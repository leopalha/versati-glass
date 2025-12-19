import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function testAdminLogin() {
  const emails = ['admin@versatiglass.com', 'admin@versatiglass.com.br']
  const testPassword = 'admin123'

  for (const email of emails) {
    console.log(`\n🔍 Testing admin login for: ${email}`)
    console.log(`📝 Test password: ${testPassword}`)
    console.log('─'.repeat(50))

    // Find user
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    })

    if (!user) {
      console.log('❌ User not found in database!')
      continue
    }

  console.log('✅ User found:')
  console.log(`   ID: ${user.id}`)
  console.log(`   Name: ${user.name}`)
  console.log(`   Email: ${user.email}`)
  console.log(`   Role: ${user.role}`)
  console.log(`   Has password: ${!!user.password}`)

  if (!user.password) {
    console.log('❌ User has no password set!')
    return
  }

  // Test password
  const isValid = await bcrypt.compare(testPassword, user.password)
  console.log(`\n🔑 Password test result: ${isValid ? '✅ VALID' : '❌ INVALID'}`)

  if (!isValid) {
    console.log('\n💡 The password in the database is different from "admin123"')
    console.log('   Resetting password to "admin123"...')

    const hashedPassword = await bcrypt.hash(testPassword, 10)
    await prisma.user.update({
      where: { email: email.toLowerCase() },
      data: { password: hashedPassword },
    })

    console.log('✅ Password reset successful!')
    console.log(`   You can now login with:`)
    console.log(`   Email: ${email}`)
    console.log(`   Password: ${testPassword}`)
  } else {
    console.log('\n✅ Password is correct!')
    console.log(`   Email: ${email}`)
    console.log(`   Password: ${testPassword}`)
  }

  console.log('─'.repeat(50))
  console.log('✅ Test completed\n')
  }
}

testAdminLogin()
  .catch((e) => {
    console.error('❌ Error:', e)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
