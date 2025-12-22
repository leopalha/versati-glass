import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Fixing Leonardo user...\n')

  // Update Leonardo to have correct authProvider
  const updated = await prisma.user.update({
    where: { email: 'leonardo.palha@gmail.com' },
    data: {
      authProvider: 'GOOGLE',
    },
  })

  console.log('Updated user:', updated.email)
  console.log('New authProvider:', updated.authProvider)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
