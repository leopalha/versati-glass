/**
 * Script de Teste - Notificações WhatsApp
 *
 * IMPORTANTE: Antes de executar:
 * 1. Certifique-se que o .env está configurado
 * 2. Para Sandbox: Envie "join shadow-pride" para +1 (415) 523-8886 do WhatsApp
 * 3. Ajuste NEXT_PUBLIC_COMPANY_WHATSAPP para seu número real
 */

import { config } from 'dotenv'
import twilio from 'twilio'

// Carregar variáveis de ambiente
config()

const ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID
const AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN
const WHATSAPP_NUMBER = process.env.TWILIO_WHATSAPP_NUMBER
const COMPANY_NUMBER = process.env.NEXT_PUBLIC_COMPANY_WHATSAPP

console.log('🔧 Configuração Twilio WhatsApp')
console.log('================================\n')

console.log('✅ TWILIO_ACCOUNT_SID:', ACCOUNT_SID ? `${ACCOUNT_SID.substring(0, 10)}...` : '❌ NÃO CONFIGURADO')
console.log('✅ TWILIO_AUTH_TOKEN:', AUTH_TOKEN ? `${AUTH_TOKEN.substring(0, 10)}...` : '❌ NÃO CONFIGURADO')
console.log('✅ TWILIO_WHATSAPP_NUMBER:', WHATSAPP_NUMBER || '❌ NÃO CONFIGURADO')
console.log('✅ NEXT_PUBLIC_COMPANY_WHATSAPP:', COMPANY_NUMBER || '❌ NÃO CONFIGURADO')
console.log()

if (!ACCOUNT_SID || !AUTH_TOKEN || !WHATSAPP_NUMBER || !COMPANY_NUMBER) {
  console.error('❌ Erro: Variáveis de ambiente não configuradas!')
  console.error('\nConfigure no arquivo .env:')
  console.error('TWILIO_ACCOUNT_SID="ACxxxxx"')
  console.error('TWILIO_AUTH_TOKEN="xxxxx"')
  console.error('TWILIO_WHATSAPP_NUMBER="+14155238886"')
  console.error('NEXT_PUBLIC_COMPANY_WHATSAPP="+5521999999999"')
  process.exit(1)
}

const client = twilio(ACCOUNT_SID, AUTH_TOKEN)

// Template de teste
const testMessage = `🔔 *TESTE - Notificação Versati Glass*

Novo Orçamento #ORC-2024-0001
Cliente: João Silva
Itens: 2
Valor: R$ 1.500,00

Acesse o painel admin para revisar.

---
Este é um teste do sistema de notificações.
Se você recebeu esta mensagem, o sistema está funcionando! ✅`

console.log('📤 Enviando mensagem de teste...\n')
console.log('De:', WHATSAPP_NUMBER)
console.log('Para:', COMPANY_NUMBER)
console.log('\nMensagem:')
console.log('---')
console.log(testMessage)
console.log('---\n')

try {
  const message = await client.messages.create({
    from: `whatsapp:${WHATSAPP_NUMBER}`,
    to: `whatsapp:${COMPANY_NUMBER}`,
    body: testMessage,
  })

  console.log('✅ SUCESSO! Mensagem enviada!')
  console.log('\n📊 Detalhes:')
  console.log('  Message SID:', message.sid)
  console.log('  Status:', message.status)
  console.log('  Data/Hora:', message.dateCreated.toLocaleString('pt-BR'))
  console.log('  Preço:', message.price ? `${message.priceUnit} ${message.price}` : 'N/A')
  console.log('\n💡 Verifique seu WhatsApp agora!')

  if (WHATSAPP_NUMBER.includes('14155238886')) {
    console.log('\n⚠️  IMPORTANTE (Sandbox):')
    console.log('   Se não recebeu a mensagem, certifique-se de:')
    console.log('   1. Ter enviado "join shadow-pride" para +1 (415) 523-8886')
    console.log('   2. O número em NEXT_PUBLIC_COMPANY_WHATSAPP está correto')
    console.log('   3. O número está no formato internacional (+5521999999999)')
  }

  console.log('\n🎉 Sistema de notificações WhatsApp configurado com sucesso!')

} catch (error) {
  console.error('❌ ERRO ao enviar mensagem!')
  console.error('\nDetalhes do erro:')
  console.error('  Código:', error.code)
  console.error('  Mensagem:', error.message)

  if (error.code === 21408) {
    console.error('\n💡 Solução:')
    console.error('   Você está usando Sandbox. O destinatário precisa:')
    console.error('   1. Adicionar +1 (415) 523-8886 aos contatos')
    console.error('   2. Enviar mensagem: "join shadow-pride"')
    console.error('   3. Aguardar confirmação do Twilio')
  } else if (error.code === 20003) {
    console.error('\n💡 Solução:')
    console.error('   Credenciais inválidas. Verifique:')
    console.error('   - TWILIO_ACCOUNT_SID')
    console.error('   - TWILIO_AUTH_TOKEN')
  } else if (error.code === 21211) {
    console.error('\n💡 Solução:')
    console.error('   Número de destino inválido.')
    console.error('   Formato correto: +5521999999999 (com +55)')
  }

  console.error('\n📚 Documentação: https://www.twilio.com/docs/whatsapp/quickstart')
  process.exit(1)
}
