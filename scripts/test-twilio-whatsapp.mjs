#!/usr/bin/env node
/**
 * Script de teste para integração Twilio WhatsApp
 *
 * Testa:
 * 1. Conexão com Twilio
 * 2. Validação de credenciais
 * 3. Envio de mensagem de teste (Sandbox)
 *
 * Uso: node scripts/test-twilio-whatsapp.mjs
 */

import { config } from 'dotenv'
import twilio from 'twilio'

// Carregar variáveis de ambiente
config()

const ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID
const AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN
const WHATSAPP_NUMBER = process.env.TWILIO_WHATSAPP_NUMBER

console.log('🧪 Testando Integração Twilio WhatsApp\n')
console.log('=' .repeat(60))

// Validar credenciais
if (!ACCOUNT_SID || !AUTH_TOKEN || !WHATSAPP_NUMBER) {
  console.error('❌ ERRO: Credenciais Twilio não encontradas no .env')
  console.log('\n📋 Variáveis necessárias:')
  console.log('  - TWILIO_ACCOUNT_SID')
  console.log('  - TWILIO_AUTH_TOKEN')
  console.log('  - TWILIO_WHATSAPP_NUMBER')
  process.exit(1)
}

console.log('✅ Credenciais encontradas:')
console.log(`   Account SID: ${ACCOUNT_SID}`)
console.log(`   Auth Token: ${AUTH_TOKEN.substring(0, 8)}...`)
console.log(`   WhatsApp Number: ${WHATSAPP_NUMBER}\n`)

// Inicializar cliente Twilio
const client = twilio(ACCOUNT_SID, AUTH_TOKEN)

async function testConnection() {
  console.log('🔌 Testando conexão com Twilio...')

  try {
    const account = await client.api.accounts(ACCOUNT_SID).fetch()
    console.log(`✅ Conectado com sucesso!`)
    console.log(`   Account Name: ${account.friendlyName}`)
    console.log(`   Status: ${account.status}`)
    console.log(`   Type: ${account.type}\n`)
    return true
  } catch (error) {
    console.error('❌ Erro ao conectar:', error.message)
    return false
  }
}

async function checkPhoneNumber() {
  console.log('📞 Verificando número WhatsApp...')

  try {
    const phoneNumbers = await client.incomingPhoneNumbers.list({ limit: 20 })

    const targetNumber = WHATSAPP_NUMBER.replace(/\D/g, '')
    const found = phoneNumbers.find(p =>
      p.phoneNumber.replace(/\D/g, '').includes(targetNumber.substring(targetNumber.length - 10))
    )

    if (found) {
      console.log(`✅ Número encontrado: ${found.phoneNumber}`)
      console.log(`   Friendly Name: ${found.friendlyName}`)
      console.log(`   Capabilities:`)
      console.log(`   - SMS: ${found.capabilities.sms}`)
      console.log(`   - MMS: ${found.capabilities.mms}`)
      console.log(`   - Voice: ${found.capabilities.voice}\n`)
      return true
    } else {
      console.log(`⚠️  Número ${WHATSAPP_NUMBER} não encontrado na conta`)
      console.log('   Isto é NORMAL se você está usando o Sandbox\n')
      return false
    }
  } catch (error) {
    console.error('❌ Erro ao verificar número:', error.message)
    return false
  }
}

async function checkWhatsAppSandbox() {
  console.log('🏖️  Verificando WhatsApp Sandbox...')

  try {
    // Endpoint não documentado mas funcional
    const response = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${ACCOUNT_SID}/Sandbox.json`,
      {
        headers: {
          'Authorization': 'Basic ' + Buffer.from(`${ACCOUNT_SID}:${AUTH_TOKEN}`).toString('base64')
        }
      }
    )

    if (response.ok) {
      const data = await response.json()
      console.log('✅ Sandbox ativo!')
      console.log(`   Número: ${data.phone_number || '+1 415 523 8886'}`)
      console.log(`   Código de ativação: "join <palavra-chave>"\n`)
      return true
    } else {
      console.log('⚠️  Não foi possível verificar o Sandbox\n')
      return false
    }
  } catch (error) {
    console.log('⚠️  Não foi possível verificar o Sandbox:', error.message, '\n')
    return false
  }
}

async function testSendMessage(testMode = true) {
  if (testMode) {
    console.log('📨 MODO TESTE: Não enviando mensagem real')
    console.log('   Para enviar uma mensagem de teste:')
    console.log('   1. Primeiro, ative o Sandbox no seu celular:')
    console.log('      - Adicione +1 415 523 8886 no WhatsApp')
    console.log('      - Envie: "join electricity-about"')
    console.log('   2. Execute: node scripts/test-twilio-whatsapp.mjs --send\n')
    return false
  }

  console.log('📨 Enviando mensagem de teste...')
  console.log('⚠️  IMPORTANTE: Você deve ter ativado o Sandbox primeiro!\n')

  const readline = await import('readline')
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  })

  return new Promise((resolve) => {
    rl.question('Digite o número de destino (ex: +5521999999999): ', async (phone) => {
      rl.close()

      if (!phone || phone.length < 10) {
        console.log('❌ Número inválido\n')
        resolve(false)
        return
      }

      try {
        const message = await client.messages.create({
          from: `whatsapp:${WHATSAPP_NUMBER}`,
          to: `whatsapp:${phone}`,
          body: '🧪 Teste de integração Twilio WhatsApp - Versati Glass\n\nSe você recebeu esta mensagem, a integração está funcionando corretamente! ✅'
        })

        console.log(`✅ Mensagem enviada com sucesso!`)
        console.log(`   SID: ${message.sid}`)
        console.log(`   Status: ${message.status}`)
        console.log(`   Para: ${message.to}`)
        console.log(`   De: ${message.from}\n`)
        resolve(true)
      } catch (error) {
        console.error('❌ Erro ao enviar mensagem:', error.message)

        if (error.code === 63007) {
          console.log('\n💡 DICA: Este erro significa que o número não está no Sandbox.')
          console.log('   Solução: Envie "join electricity-about" para +1 415 523 8886\n')
        }

        resolve(false)
      }
    })
  })
}

async function displayInstructions() {
  console.log('=' .repeat(60))
  console.log('📋 PRÓXIMOS PASSOS\n')

  console.log('🏖️  PARA TESTES (Sandbox):')
  console.log('   1. Abra WhatsApp no seu celular')
  console.log('   2. Adicione o número: +1 415 523 8886')
  console.log('   3. Envie a mensagem: "join electricity-about"')
  console.log('   4. Teste enviando mensagens para esse número\n')

  console.log('🚀 PARA PRODUÇÃO (Número Real):')
  console.log('   1. Acesse: https://console.twilio.com/us1/develop/sms/senders/whatsapp-senders')
  console.log(`   2. Submeta o número ${WHATSAPP_NUMBER} para aprovação`)
  console.log('   3. Crie templates de mensagem no Facebook Business Manager')
  console.log('   4. Aguarde aprovação da Meta (24-72h)')
  console.log('   5. Configure o Webhook:')
  console.log('      URL: https://seu-dominio.com/api/whatsapp/webhook')
  console.log('      Method: POST\n')

  console.log('📱 USAR NO CELULAR:')
  console.log('   ❌ NÃO é possível usar o número Twilio no WhatsApp Business App')
  console.log('   ✅ Use o painel admin do Versati Glass para gerenciar conversas')
  console.log('   ✅ O sistema responde automaticamente via IA\n')

  console.log('🔗 LINKS ÚTEIS:')
  console.log('   - Twilio Console: https://console.twilio.com')
  console.log('   - WhatsApp Senders: https://console.twilio.com/us1/develop/sms/senders/whatsapp-senders')
  console.log('   - Documentação: https://www.twilio.com/docs/whatsapp')
  console.log('=' .repeat(60) + '\n')
}

// Executar testes
async function main() {
  const sendMessage = process.argv.includes('--send')

  const connected = await testConnection()
  if (!connected) {
    console.log('❌ Teste falhou: Não foi possível conectar ao Twilio\n')
    process.exit(1)
  }

  await checkPhoneNumber()
  await checkWhatsAppSandbox()
  await testSendMessage(sendMessage)
  await displayInstructions()

  console.log('✅ Teste concluído!\n')
}

main().catch(console.error)
