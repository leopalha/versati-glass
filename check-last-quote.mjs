import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function checkLastQuote() {
  try {
    const quote = await prisma.quote.findFirst({
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            street: true,
            number: true,
            complement: true,
            neighborhood: true,
            city: true,
            state: true,
            zipCode: true,
          }
        },
        items: true,
      }
    })

    if (!quote) {
      console.log('❌ Nenhum orçamento encontrado')
      return
    }

    console.log('\n📋 ÚLTIMO ORÇAMENTO:\n')
    console.log(`ID: ${quote.id}`)
    console.log(`Número: ${quote.number}`)
    console.log(`Status: ${quote.status}`)
    console.log(`Total: R$ ${quote.total}`)
    console.log(`Criado em: ${quote.createdAt}`)
    console.log(`\n👤 USUÁRIO:`)
    console.log(`  Nome: ${quote.user?.name || 'N/A'}`)
    console.log(`  Email: ${quote.user?.email || 'N/A'}`)
    console.log(`  Telefone: ${quote.user?.phone || 'N/A'}`)
    console.log(`\n📍 ENDEREÇO:`)
    console.log(`  Rua: ${quote.user?.street || '❌ NÃO SALVO'}`)
    console.log(`  Número: ${quote.user?.number || '❌ NÃO SALVO'}`)
    console.log(`  Complemento: ${quote.user?.complement || 'N/A'}`)
    console.log(`  Bairro: ${quote.user?.neighborhood || '❌ NÃO SALVO'}`)
    console.log(`  Cidade: ${quote.user?.city || '❌ NÃO SALVO'}`)
    console.log(`  Estado: ${quote.user?.state || '❌ NÃO SALVO'}`)
    console.log(`  CEP: ${quote.user?.zipCode || '❌ NÃO SALVO'}`)
    console.log(`\n📦 ITENS (${quote.items.length}):`)
    quote.items.forEach((item, i) => {
      console.log(`  ${i + 1}. ${item.name} - R$ ${item.total}`)
    })

  } catch (error) {
    console.error('❌ Erro:', error.message)
  } finally {
    await prisma.$disconnect()
  }
}

checkLastQuote()
