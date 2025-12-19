import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function checkCredentials() {
  try {
    console.log('🔍 Verificando usuários com senhas...\n')

    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        password: true,
      },
      orderBy: { email: 'asc' },
    })

    console.log(`📋 Total de usuários: ${users.length}\n`)

    for (const user of users) {
      const hasPassword = !!user.password
      console.log(`📧 ${user.email}`)
      console.log(`   Nome: ${user.name}`)
      console.log(`   Role: ${user.role}`)
      console.log(`   Senha: ${hasPassword ? '✅ Tem senha' : '❌ Sem senha'}`)

      if (hasPassword && user.email === 'customer@versatiglass.com') {
        // Test the password 'customer123'
        const isValid = await bcrypt.compare('customer123', user.password)
        console.log(`   Teste customer123: ${isValid ? '✅ VÁLIDA' : '❌ INVÁLIDA'}`)
      }

      console.log()
    }

    // Test common credentials
    console.log('\n🧪 Testando credenciais comuns:\n')

    const testCreds = [
      { email: 'admin@versatiglass.com.br', password: 'admin123' },
      { email: 'cliente@example.com', password: 'cliente123' },
      { email: 'leonardo.palha@gmail.com', password: 'senha123' },
    ]

    for (const cred of testCreds) {
      const user = await prisma.user.findUnique({
        where: { email: cred.email },
        select: { password: true, role: true },
      })

      if (user && user.password) {
        const isValid = await bcrypt.compare(cred.password, user.password)
        console.log(`${cred.email} / ${cred.password}`)
        console.log(`   ${isValid ? '✅ VÁLIDA' : '❌ INVÁLIDA'} (${user.role})`)
      } else if (user) {
        console.log(`${cred.email} - ⚠️ SEM SENHA`)
      } else {
        console.log(`${cred.email} - ❌ NÃO EXISTE`)
      }
      console.log()
    }

  } finally {
    await prisma.$disconnect()
  }
}

checkCredentials()
