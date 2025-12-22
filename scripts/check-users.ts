import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Checking users in database...\n')

  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      password: true,
      authProvider: true,
    },
    orderBy: { createdAt: 'desc' },
    take: 10,
  })

  console.log('Users found:', users.length)
  console.log('---')

  for (const user of users) {
    console.log(`
Email: ${user.email}
Name: ${user.name}
Role: ${user.role}
Has Password: ${!!user.password}
Auth Provider: ${user.authProvider || 'CREDENTIALS'}
---`)
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
