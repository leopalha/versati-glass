import 'dotenv/config'

console.log('🔍 Verificando configuração Twilio WhatsApp...\n')

const config = {
  accountSid: process.env.TWILIO_ACCOUNT_SID,
  authToken: process.env.TWILIO_AUTH_TOKEN,
  whatsappNumber: process.env.TWILIO_WHATSAPP_NUMBER,
  companyWhatsapp: process.env.NEXT_PUBLIC_COMPANY_WHATSAPP,
}

console.log('TWILIO_ACCOUNT_SID:', config.accountSid ? '✅ ' + config.accountSid : '❌ Não configurado')
console.log('TWILIO_AUTH_TOKEN:', config.authToken ? '✅ Configurado (oculto)' : '❌ Não configurado')
console.log('TWILIO_WHATSAPP_NUMBER:', config.whatsappNumber || '❌ Não configurado')
console.log('NEXT_PUBLIC_COMPANY_WHATSAPP:', config.companyWhatsapp || '❌ Não configurado')

console.log('\n📊 Status:')
if (config.accountSid && config.authToken && config.whatsappNumber && config.companyWhatsapp) {
  console.log('✅ Twilio WhatsApp está COMPLETAMENTE configurado!')
  console.log('\n🧪 Testando conexão com Twilio...')

  // Test Twilio connection
  try {
    const response = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${config.accountSid}.json`,
      {
        headers: {
          Authorization: 'Basic ' + Buffer.from(`${config.accountSid}:${config.authToken}`).toString('base64'),
        },
      }
    )

    if (response.ok) {
      const data = await response.json()
      console.log('✅ Conexão com Twilio bem-sucedida!')
      console.log('   Account Name:', data.friendly_name)
      console.log('   Status:', data.status)
    } else {
      console.log('❌ Erro na conexão:', response.status, response.statusText)
    }
  } catch (error) {
    console.log('❌ Erro ao testar conexão:', error.message)
  }
} else {
  console.log('❌ Twilio WhatsApp está PARCIALMENTE configurado')
  console.log('   Variáveis faltando no .env')
}
