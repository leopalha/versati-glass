import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const userId = 'd2803795-a185-4e9d-a019-0d95d7304313'

async function checkUser() {
  try {
    console.log('🔍 Verificando usuário do log...')
    console.log('User ID:', userId)

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true, role: true },
    })

    if (user) {
      console.log('✅ Usuário encontrado:', user)
    } else {
      console.log('❌ Usuário NÃO encontrado!')

      // Listar usuários existentes
      const users = await prisma.user.findMany({
        select: { id: true, name: true, email: true, role: true },
        take: 10,
      })
      console.log('\n📋 Usuários disponíveis no banco:')
      users.forEach((u) => console.log(`  - ${u.email} (${u.role}) - ID: ${u.id}`))
    }
  } finally {
    await prisma.$disconnect()
  }
}

checkUser()
