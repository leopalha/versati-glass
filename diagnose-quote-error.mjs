// Diagnóstico do erro de criação de orçamento
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function diagnose() {
  console.log('🔍 DIAGNÓSTICO: Erro de Criação de Orçamento\n')

  try {
    // 1. Verificar conexão com banco de dados
    console.log('1️⃣ Testando conexão com banco de dados...')
    await prisma.$connect()
    console.log('   ✅ Conexão OK\n')

    // 2. Verificar se tabelas existem
    console.log('2️⃣ Verificando estrutura do banco...')
    const tables = await prisma.$queryRaw`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      ORDER BY table_name
    `
    console.log(`   ✅ Tabelas encontradas: ${tables.length}`)
    console.log('   Tabelas:', tables.map(t => t.table_name).join(', '))
    console.log('')

    // 3. Verificar se tabela Quote existe
    const hasQuote = tables.some(t => t.table_name === 'Quote')
    const hasQuoteItem = tables.some(t => t.table_name === 'QuoteItem')
    const hasUser = tables.some(t => t.table_name === 'User')

    if (!hasQuote) {
      console.log('   ❌ ERRO: Tabela "Quote" não encontrada!')
      console.log('   ⚠️  Rode: pnpm db:push\n')
      return
    }

    if (!hasQuoteItem) {
      console.log('   ❌ ERRO: Tabela "QuoteItem" não encontrada!')
      console.log('   ⚠️  Rode: pnpm db:push\n')
      return
    }

    if (!hasUser) {
      console.log('   ❌ ERRO: Tabela "User" não encontrada!')
      console.log('   ⚠️  Rode: pnpm db:push\n')
      return
    }

    console.log('   ✅ Tabelas necessárias existem\n')

    // 4. Verificar estrutura da tabela Quote
    console.log('3️⃣ Verificando colunas da tabela Quote...')
    const quoteColumns = await prisma.$queryRaw`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'Quote'
      ORDER BY ordinal_position
    `
    console.log(`   ✅ Colunas encontradas: ${quoteColumns.length}`)
    quoteColumns.forEach(col => {
      console.log(`      - ${col.column_name}: ${col.data_type} ${col.is_nullable === 'NO' ? '(obrigatório)' : '(opcional)'}`)
    })
    console.log('')

    // 5. Verificar se há usuários no banco
    console.log('4️⃣ Verificando usuários existentes...')
    const userCount = await prisma.user.count()
    console.log(`   ${userCount > 0 ? '✅' : '⚠️'}  Usuários no banco: ${userCount}`)
    if (userCount === 0) {
      console.log('   ⚠️  Nenhum usuário encontrado. Rode: pnpm db:seed\n')
    } else {
      const users = await prisma.user.findMany({
        select: { id: true, email: true, name: true, role: true }
      })
      users.forEach(u => {
        console.log(`      - ${u.name} (${u.email}) - ${u.role}`)
      })
      console.log('')
    }

    // 6. Verificar produtos
    console.log('5️⃣ Verificando produtos existentes...')
    const productCount = await prisma.product.count()
    console.log(`   ${productCount > 0 ? '✅' : '⚠️'}  Produtos no banco: ${productCount}`)
    if (productCount === 0) {
      console.log('   ⚠️  Nenhum produto encontrado. Rode: pnpm db:seed\n')
    } else {
      console.log('')
    }

    // 7. Testar criação de orçamento simples
    console.log('6️⃣ Testando criação de orçamento...')

    try {
      // Criar usuário de teste se não existir
      let testUser = await prisma.user.findUnique({
        where: { email: 'teste-diagnostico@versatiglass.com' }
      })

      if (!testUser) {
        console.log('   📝 Criando usuário de teste...')
        testUser = await prisma.user.create({
          data: {
            email: 'teste-diagnostico@versatiglass.com',
            name: 'Teste Diagnóstico',
            phone: '21999999999',
            street: 'Rua Teste',
            number: '123',
            neighborhood: 'Centro',
            city: 'Rio de Janeiro',
            state: 'RJ',
            zipCode: '20000000'
          }
        })
        console.log('   ✅ Usuário de teste criado\n')
      }

      // Gerar número de orçamento
      const year = new Date().getFullYear()
      const lastQuote = await prisma.quote.findFirst({
        where: {
          number: {
            startsWith: `ORC-${year}`
          }
        },
        orderBy: { number: 'desc' }
      })

      let nextNumber = 1
      if (lastQuote) {
        const lastNum = parseInt(lastQuote.number.split('-').pop() || '0', 10)
        nextNumber = lastNum + 1
      }
      const quoteNumber = `ORC-${year}-${nextNumber.toString().padStart(4, '0')}`

      console.log(`   📝 Criando orçamento de teste: ${quoteNumber}`)

      const testQuote = await prisma.quote.create({
        data: {
          number: quoteNumber,
          userId: testUser.id,
          customerName: 'Teste Diagnóstico',
          customerEmail: 'teste-diagnostico@versatiglass.com',
          customerPhone: '21999999999',
          serviceStreet: 'Rua Teste',
          serviceNumber: '123',
          serviceNeighborhood: 'Centro',
          serviceCity: 'Rio de Janeiro',
          serviceState: 'RJ',
          serviceZipCode: '20000000',
          subtotal: 1500.00,
          total: 1500.00,
          status: 'DRAFT',
          validUntil: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
          source: 'WEBSITE',
          items: {
            create: [{
              description: 'Box para Banheiro - Teste',
              specifications: '2.0m x 2.0m - Cristal - 8mm',
              width: 2.0,
              height: 2.0,
              quantity: 1,
              unitPrice: 1500.00,
              totalPrice: 1500.00,
              customerImages: []
            }]
          }
        },
        include: {
          items: true
        }
      })

      console.log('   ✅ Orçamento criado com sucesso!')
      console.log(`   ID: ${testQuote.id}`)
      console.log(`   Número: ${testQuote.number}`)
      console.log(`   Total: R$ ${Number(testQuote.total).toFixed(2)}`)
      console.log(`   Itens: ${testQuote.items.length}\n`)

      // Limpar orçamento de teste
      console.log('   🧹 Limpando dados de teste...')
      await prisma.quoteItem.deleteMany({
        where: { quoteId: testQuote.id }
      })
      await prisma.quote.delete({
        where: { id: testQuote.id }
      })
      await prisma.user.delete({
        where: { id: testUser.id }
      })
      console.log('   ✅ Limpeza concluída\n')

      console.log('═'.repeat(60))
      console.log('🎉 DIAGNÓSTICO COMPLETO: Tudo funcionando!')
      console.log('═'.repeat(60))
      console.log('\nO problema pode estar em:')
      console.log('1. Rate limiting (muitas requisições)')
      console.log('2. Validação de dados no frontend')
      console.log('3. Formato incorreto dos dados enviados')
      console.log('\nVerifique os logs do servidor ao tentar criar orçamento.')

    } catch (error) {
      console.log('   ❌ ERRO ao criar orçamento!')
      console.log('\n📋 Detalhes do erro:')
      console.log('Mensagem:', error.message)
      console.log('Stack:', error.stack)

      if (error.code) {
        console.log('Código:', error.code)
      }

      if (error.meta) {
        console.log('Meta:', error.meta)
      }

      console.log('\n⚠️  Este é provavelmente o erro que está acontecendo na API!')
    }

  } catch (error) {
    console.log('\n❌ ERRO FATAL:')
    console.log('Mensagem:', error.message)
    console.log('Stack:', error.stack)

    if (error.code === 'P1001') {
      console.log('\n⚠️  Não foi possível conectar ao banco de dados!')
      console.log('Verifique se PostgreSQL está rodando e se DATABASE_URL está correta.')
    }
  } finally {
    await prisma.$disconnect()
  }
}

diagnose()
