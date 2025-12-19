import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function updatePassword() {
  try {
    const email = 'cliente@versatiglass.com.br'
    const newPassword = 'cliente123'

    console.log(`🔄 Atualizando senha de ${email}...\n`)

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      console.log('❌ Usuário não encontrado!')
      return
    }

    console.log('✅ Usuário encontrado:')
    console.log('   ID:', user.id)
    console.log('   Nome:', user.name)
    console.log('   Email:', user.email)

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10)

    // Update password
    await prisma.user.update({
      where: { email },
      data: { password: hashedPassword },
    })

    console.log('\n✅ Senha atualizada com sucesso!')
    console.log('\n🎉 Credenciais atualizadas:')
    console.log('   Email:', email)
    console.log('   Senha:', newPassword)

  } finally {
    await prisma.$disconnect()
  }
}

updatePassword()
