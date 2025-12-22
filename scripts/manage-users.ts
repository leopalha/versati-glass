import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('=== Current Users ===\n')

  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      password: true,
      authProvider: true,
    },
  })

  users.forEach((u) => {
    console.log(`Email: ${u.email}`)
    console.log(`  Name: ${u.name}`)
    console.log(`  Role: ${u.role}`)
    console.log(`  Has Password: ${!!u.password}`)
    console.log(`  Auth Provider: ${u.authProvider}`)
    console.log('')
  })

  // Check if cliente@versatiglass.com.br exists
  const clienteVersati = users.find((u) => u.email === 'cliente@versatiglass.com.br')

  if (!clienteVersati) {
    console.log('Creating cliente@versatiglass.com.br...')
    const bcrypt = await import('bcryptjs')
    const hashedPassword = await bcrypt.default.hash('cliente123', 12)

    await prisma.user.create({
      data: {
        email: 'cliente@versatiglass.com.br',
        name: 'Cliente Versati',
        password: hashedPassword,
        role: 'CUSTOMER',
        authProvider: 'EMAIL',
      },
    })
    console.log('Created cliente@versatiglass.com.br with password: cliente123')
  }

  // Remove test customers (keep only the ones we need)
  const emailsToKeep = [
    'admin@versatiglass.com.br',
    'cliente@versatiglass.com.br',
    'leonardo.palha@gmail.com',
  ]

  const usersToDelete = users.filter((u) => !emailsToKeep.includes(u.email))

  if (usersToDelete.length > 0) {
    console.log('\n=== Removing test users ===')
    for (const user of usersToDelete) {
      console.log(`Deleting: ${user.email}`)
      try {
        await prisma.user.delete({ where: { id: user.id } })
      } catch (e) {
        console.log(`  Could not delete (may have related data)`)
      }
    }
  }

  console.log('\n=== Final Users ===\n')
  const finalUsers = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      password: true,
      authProvider: true,
    },
  })

  finalUsers.forEach((u) => {
    console.log(`Email: ${u.email}`)
    console.log(`  Name: ${u.name}`)
    console.log(`  Role: ${u.role}`)
    console.log(`  Has Password: ${!!u.password}`)
    console.log(`  Auth Provider: ${u.authProvider}`)
    console.log('')
  })
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
