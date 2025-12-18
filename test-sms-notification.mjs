/**
 * Teste SMS - Twilio (sem WhatsApp)
 *
 * Este script testa notificações via SMS usando o número Twilio existente.
 * Útil para validar integração enquanto aguarda WhatsApp Business API.
 */

import { config } from 'dotenv'
import twilio from 'twilio'

// Carregar variáveis de ambiente
config()

const ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID
const AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN
const SMS_NUMBER = '+18207320393' // Número SMS da conta
const TEST_PHONE = process.env.NEXT_PUBLIC_COMPANY_WHATSAPP || '+5521999999999'

console.log('📱 Teste de Notificação SMS - Versati Glass\n')
console.log('═══════════════════════════════════════════\n')

// Validar configuração
console.log('🔧 Configuração Twilio SMS')
console.log('─────────────────────────────────────────')
console.log('✅ TWILIO_ACCOUNT_SID:', ACCOUNT_SID ? `${ACCOUNT_SID.substring(0, 10)}...` : '❌ NÃO CONFIGURADO')
console.log('✅ TWILIO_AUTH_TOKEN:', AUTH_TOKEN ? `${AUTH_TOKEN.substring(0, 8)}...` : '❌ NÃO CONFIGURADO')
console.log('✅ SMS_NUMBER:', SMS_NUMBER)
console.log('✅ TEST_PHONE:', TEST_PHONE)
console.log('')

// Validar credenciais
if (!ACCOUNT_SID || !AUTH_TOKEN) {
  console.error('❌ ERRO: Credenciais Twilio não configuradas no .env')
  process.exit(1)
}

// Validar número de teste
if (TEST_PHONE === '+5521999999999') {
  console.warn('⚠️ AVISO: Usando número de teste genérico.')
  console.warn('   Para testar com seu número real, atualize NEXT_PUBLIC_COMPANY_WHATSAPP no .env\n')
}

// Criar cliente Twilio
const client = twilio(ACCOUNT_SID, AUTH_TOKEN)

// Mensagem de teste (sem emojis para SMS)
const testMessage = `TESTE - Notificacao Versati Glass

Novo Orcamento #ORC-2024-0001
Cliente: Joao Silva
Itens: 2
Valor: R$ 1.500,00

Acesse o painel admin para revisar.

---
Versati Glass - Vidros Premium
Este e um teste de integracao SMS.`

console.log('📤 Enviando SMS de teste...')
console.log('─────────────────────────────────────────')
console.log(`De: ${SMS_NUMBER}`)
console.log(`Para: ${TEST_PHONE}`)
console.log('')
console.log('Mensagem:')
console.log(testMessage)
console.log('')

try {
  const message = await client.messages.create({
    from: SMS_NUMBER,
    to: TEST_PHONE,
    body: testMessage,
  })

  console.log('═══════════════════════════════════════════')
  console.log('✅ SUCESSO! SMS enviado!\n')
  console.log('📊 Detalhes:')
  console.log('─────────────────────────────────────────')
  console.log('  Message SID:', message.sid)
  console.log('  Status:', message.status)
  console.log('  Direction:', message.direction)

  if (message.dateCreated) {
    const date = new Date(message.dateCreated)
    console.log('  Data/Hora:', date.toLocaleString('pt-BR'))
  }

  if (message.price) {
    console.log('  Preço:', `USD ${message.price}`)
  }

  console.log('')
  console.log('💡 Verifique seu celular agora!')
  console.log('')
  console.log('📋 Monitoramento:')
  console.log('   Twilio Console: https://console.twilio.com/us1/monitor/logs/sms')
  console.log('')
  console.log('═══════════════════════════════════════════')

} catch (error) {
  console.log('═══════════════════════════════════════════')
  console.error('❌ ERRO ao enviar SMS\n')
  console.error('📋 Detalhes do erro:')
  console.error('─────────────────────────────────────────')
  console.error('  Código:', error.code)
  console.error('  Mensagem:', error.message)

  if (error.moreInfo) {
    console.error('  Mais info:', error.moreInfo)
  }

  console.error('')
  console.error('🔍 Possíveis causas:')
  console.error('─────────────────────────────────────────')

  if (error.code === 21211) {
    console.error('  ⚠️ Número de destino inválido')
    console.error('     - Certifique-se que o número está no formato internacional (+5521...)')
  } else if (error.code === 21408) {
    console.error('  ⚠️ Permissão para enviar SMS não habilitada')
    console.error('     - Verifique se o número está verificado no Twilio')
  } else if (error.code === 21606) {
    console.error('  ⚠️ Número não pode receber SMS')
    console.error('     - Número pode estar bloqueado ou inválido')
  } else {
    console.error('  ⚠️ Erro desconhecido')
    console.error('     - Verifique credenciais e saldo da conta Twilio')
  }

  console.error('')
  console.error('═══════════════════════════════════════════')
  process.exit(1)
}
