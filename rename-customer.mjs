import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function renameCustomer() {
  try {
    console.log('🔄 Renomeando customer@versatiglass.com para cliente@versatiglass.com.br...\n')

    // Check if old email exists
    const oldUser = await prisma.user.findUnique({
      where: { email: 'customer@versatiglass.com' },
    })

    if (!oldUser) {
      console.log('❌ Usuário customer@versatiglass.com não encontrado!')
      return
    }

    console.log('✅ Usuário encontrado:')
    console.log('   ID:', oldUser.id)
    console.log('   Nome:', oldUser.name)
    console.log('   Email antigo:', oldUser.email)

    // Check if new email already exists
    const existingNew = await prisma.user.findUnique({
      where: { email: 'cliente@versatiglass.com.br' },
    })

    if (existingNew) {
      console.log('\n⚠️ Email cliente@versatiglass.com.br já existe!')
      console.log('   ID:', existingNew.id)
      console.log('   Deletando usuário antigo customer@versatiglass.com...')

      await prisma.user.delete({
        where: { email: 'customer@versatiglass.com' },
      })

      console.log('✅ Usuário antigo deletado')
      console.log('\n✅ Use cliente@versatiglass.com.br / customer123')
      return
    }

    // Update email
    const updated = await prisma.user.update({
      where: { email: 'customer@versatiglass.com' },
      data: { email: 'cliente@versatiglass.com.br' },
    })

    console.log('\n✅ Usuário renomeado com sucesso!')
    console.log('   Email novo:', updated.email)
    console.log('   ID:', updated.id)
    console.log('\n🎉 Credenciais atualizadas:')
    console.log('   Email: cliente@versatiglass.com.br')
    console.log('   Senha: customer123')

  } finally {
    await prisma.$disconnect()
  }
}

renameCustomer()
