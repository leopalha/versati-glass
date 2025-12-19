import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function findCustomer() {
  try {
    console.log('🔍 Procurando customer@versatiglass.com...\n')

    const user = await prisma.user.findUnique({
      where: { email: 'customer@versatiglass.com' },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        password: true,
        emailVerified: true,
        createdAt: true,
      },
    })

    if (user) {
      console.log('✅ Usuário encontrado!')
      console.log('ID:', user.id)
      console.log('Email:', user.email)
      console.log('Nome:', user.name)
      console.log('Role:', user.role)
      console.log('Senha:', user.password ? '✅ Tem senha' : '❌ Sem senha')
      console.log('Email Verificado:', user.emailVerified || 'Não')
      console.log('Criado em:', user.createdAt)
    } else {
      console.log('❌ Usuário NÃO encontrado!')
      console.log('\nVerificando variações do email...')

      const variations = [
        'customer@versatiglass.com',
        'customer@versatiglass.com.br',
        'admin@versatiglass.com',
      ]

      for (const email of variations) {
        const found = await prisma.user.findUnique({
          where: { email },
          select: { email: true, name: true },
        })
        if (found) {
          console.log(`  ✅ ${email} - ${found.name}`)
        } else {
          console.log(`  ❌ ${email}`)
        }
      }
    }

  } finally {
    await prisma.$disconnect()
  }
}

findCustomer()
