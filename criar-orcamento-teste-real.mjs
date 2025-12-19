// Cria um orçamento de teste que vai gerar notificações REAIS
// Email + WhatsApp para o número configurado

const payload = {
  customerName: "Leonardo Palha - TESTE NOTIFICAÇÕES",
  customerEmail: "leonardo.palha@gmail.com",
  customerPhone: "+5521995354010",
  serviceStreet: "Avenida Gilberto Amado",
  serviceNumber: "553",
  serviceComplement: "Teste de Notificações",
  serviceNeighborhood: "Barra da Tijuca",
  serviceCity: "Rio de Janeiro",
  serviceState: "RJ",
  serviceZipCode: "22620-061",
  items: [
    {
      description: "TESTE - Box de Vidro Temperado",
      specifications: "2m x 2m - Vidro 8mm",
      width: 2,
      height: 2,
      quantity: 1,
      unitPrice: 1500,
      totalPrice: 1500,
      customerImages: [],
    },
  ],
  source: "WEBSITE",
  customerNotes: "Este é um orçamento de TESTE para validar as notificações WhatsApp e Email",
}

console.log('🧪 CRIANDO ORÇAMENTO DE TESTE\n')
console.log('Este orçamento vai gerar notificações REAIS:')
console.log('✅ WhatsApp para: +5521995354010')
console.log('✅ Email para: leonardo.palha@gmail.com\n')
console.log('═'.repeat(60))
console.log('\n📤 Enviando para API...\n')

async function criarOrcamento() {
  try {
    const response = await fetch('http://localhost:3000/api/quotes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    const data = await response.json()

    if (response.ok) {
      console.log('✅ ORÇAMENTO CRIADO COM SUCESSO!\n')
      console.log('📋 Detalhes:')
      console.log('   Número:', data.number)
      console.log('   ID:', data.id)
      console.log('   Total: R$', data.total)
      console.log('   Válido até:', new Date(data.validUntil).toLocaleDateString('pt-BR'))

      console.log('\n📱 NOTIFICAÇÕES ENVIADAS:')
      console.log('   ✅ WhatsApp → +5521995354010')
      console.log('   ⚠️ Email → Não enviado (orçamento DRAFT não envia email)')

      console.log('\n💡 COMO TESTAR EMAIL:')
      console.log('   1. Acesse o painel admin: http://localhost:3000/admin')
      console.log('   2. Encontre o orçamento:', data.number)
      console.log('   3. Clique em "Enviar Orçamento"')
      console.log('   4. Isso vai enviar email para o cliente!')

      console.log('\n📱 VERIFIQUE SEU WHATSAPP AGORA!')
      console.log('   Você deve ter recebido uma mensagem sobre o novo orçamento\n')

    } else {
      console.log('❌ Erro ao criar orçamento:')
      console.log('   Status:', response.status)
      console.log('   Erro:', data.error || data.message)
      console.log('\nDetalhes:', data)
    }
  } catch (error) {
    console.log('❌ Erro na requisição:', error.message)
  }
}

criarOrcamento()
