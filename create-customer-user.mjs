import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function createCustomerUser() {
  try {
    const email = 'customer@versatiglass.com'
    const password = 'customer123'

    // Check if already exists
    const existing = await prisma.user.findUnique({
      where: { email },
    })

    if (existing) {
      console.log('❌ Usuário já existe:', email)
      return
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: 'Customer User',
        role: 'CUSTOMER',
        phone: '(21) 99999-9999',
        emailVerified: new Date(),
      },
    })

    console.log('✅ Usuário criado com sucesso!')
    console.log('📧 Email:', email)
    console.log('🔑 Senha:', password)
    console.log('👤 ID:', user.id)
    console.log('\n🎉 Agora você pode fazer login!')

  } finally {
    await prisma.$disconnect()
  }
}

createCustomerUser()
