import 'dotenv/config'

console.log('📱 Testando integração WhatsApp (Twilio)...\n')

const config = {
  accountSid: process.env.TWILIO_ACCOUNT_SID,
  authToken: process.env.TWILIO_AUTH_TOKEN,
  whatsappNumber: process.env.TWILIO_WHATSAPP_NUMBER,
  companyWhatsapp: process.env.NEXT_PUBLIC_COMPANY_WHATSAPP,
}

console.log('TWILIO_ACCOUNT_SID:', config.accountSid ? '✅ ' + config.accountSid : '❌ Não configurado')
console.log('TWILIO_AUTH_TOKEN:', config.authToken ? '✅ Configurado' : '❌ Não configurado')
console.log('TWILIO_WHATSAPP_NUMBER:', config.whatsappNumber || '❌ Não configurado')
console.log('NEXT_PUBLIC_COMPANY_WHATSAPP:', config.companyWhatsapp || '❌ Não configurado')

if (!config.accountSid || !config.authToken || !config.whatsappNumber || !config.companyWhatsapp) {
  console.log('\n❌ Configuração incompleta!')
  console.log('\n📝 Todas as variáveis já estão no .env!')
  console.log('   Verifique se o servidor foi reiniciado')
  process.exit(1)
}

console.log('\n🧪 Enviando mensagem de teste...\n')

try {
  const message = `✅ *Teste Versati Glass*

Parabéns! A integração WhatsApp está funcionando!

Agora o sistema pode enviar:
✅ Notificações de novos orçamentos
✅ Confirmações de agendamento
✅ Atualizações de status
✅ Lembretes automáticos

_Enviado em: ${new Date().toLocaleString('pt-BR')}_`

  const params = new URLSearchParams({
    To: `whatsapp:${config.companyWhatsapp}`,
    From: config.whatsappNumber,
    Body: message,
  })

  const response = await fetch(
    `https://api.twilio.com/2010-04-01/Accounts/${config.accountSid}/Messages.json`,
    {
      method: 'POST',
      headers: {
        Authorization:
          'Basic ' +
          Buffer.from(`${config.accountSid}:${config.authToken}`).toString('base64'),
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    }
  )

  const data = await response.json()

  if (response.ok) {
    console.log('✅ Mensagem enviada com sucesso!')
    console.log('   SID:', data.sid)
    console.log('   Status:', data.status)
    console.log('   De:', data.from)
    console.log('   Para:', data.to)
    console.log('   Preço:', data.price || 'Grátis (Sandbox)')
    console.log('\n📱 Verifique seu WhatsApp!')
    console.log('   Número:', config.companyWhatsapp)

    if (data.status === 'queued' || data.status === 'sent') {
      console.log('\n⏳ A mensagem foi enviada para a fila do Twilio')
      console.log('   Pode demorar alguns segundos para chegar')
    }
  } else {
    console.log('❌ Erro ao enviar mensagem:')
    console.log('   Status:', response.status)
    console.log('   Código:', data.code)
    console.log('   Mensagem:', data.message)

    if (data.code === 21211) {
      console.log('\n💡 Número inválido!')
      console.log('   Verifique NEXT_PUBLIC_COMPANY_WHATSAPP no .env')
      console.log('   Formato correto: +5521999999999')
    }

    if (data.code === 21608) {
      console.log('\n💡 Número não autorizado no Sandbox!')
      console.log('   Você precisa:')
      console.log('   1. Acessar: https://console.twilio.com/us1/develop/sms/try-it-out/whatsapp-learn')
      console.log('   2. Enviar mensagem do seu WhatsApp para o número Twilio')
      console.log('   3. Seguir instruções para validar')
    }

    if (data.code === 20003) {
      console.log('\n💡 Falha na autenticação!')
      console.log('   Verifique TWILIO_ACCOUNT_SID e TWILIO_AUTH_TOKEN')
    }
  }
} catch (error) {
  console.log('❌ Erro na requisição:', error.message)
}
