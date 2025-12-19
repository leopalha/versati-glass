// Verifica o status da última mensagem enviada
import 'dotenv/config'

const messageSid = 'SMf08d91430b2b07b5f5f618159f06ff36' // Última mensagem enviada

console.log('🔍 Verificando status da mensagem no Twilio...\n')
console.log(`Message SID: ${messageSid}\n`)

try {
  const auth = Buffer.from(
    `${process.env.TWILIO_ACCOUNT_SID}:${process.env.TWILIO_AUTH_TOKEN}`
  ).toString('base64')

  const response = await fetch(
    `https://api.twilio.com/2010-04-01/Accounts/${process.env.TWILIO_ACCOUNT_SID}/Messages/${messageSid}.json`,
    {
      method: 'GET',
      headers: {
        Authorization: `Basic ${auth}`,
      },
    }
  )

  const data = await response.json()

  if (response.ok) {
    console.log('📊 DETALHES DA MENSAGEM:\n')
    console.log(`De: ${data.from}`)
    console.log(`Para: ${data.to}`)
    console.log(`Status: ${data.status}`)
    console.log(`Preço: ${data.price || 'Grátis (Sandbox)'}`)
    console.log(`Data/Hora: ${data.date_sent || data.date_created}`)
    console.log(`Erro: ${data.error_message || 'Nenhum'}`)
    console.log(`Código de erro: ${data.error_code || 'Nenhum'}`)

    console.log('\n' + '═'.repeat(60) + '\n')

    // Interpretar status
    console.log('📋 INTERPRETAÇÃO DO STATUS:\n')

    switch (data.status) {
      case 'queued':
        console.log('⏳ STATUS: QUEUED (Na fila)')
        console.log('   A mensagem está na fila do Twilio aguardando processamento.')
        console.log('   Isso é normal e deve processar em alguns segundos.')
        break

      case 'sending':
        console.log('📤 STATUS: SENDING (Enviando)')
        console.log('   A mensagem está sendo enviada agora.')
        break

      case 'sent':
        console.log('✅ STATUS: SENT (Enviada)')
        console.log('   A mensagem foi enviada com sucesso!')
        console.log('   Verifique seu WhatsApp.')
        break

      case 'delivered':
        console.log('🎉 STATUS: DELIVERED (Entregue)')
        console.log('   A mensagem foi ENTREGUE ao WhatsApp!')
        console.log('   Ela DEVE estar no seu celular agora.')
        break

      case 'undelivered':
        console.log('❌ STATUS: UNDELIVERED (Não entregue)')
        console.log('   A mensagem NÃO foi entregue.')
        console.log(`   Motivo: ${data.error_message}`)
        console.log('\n💡 POSSÍVEIS CAUSAS:')
        console.log('   1. Número não autorizado no Sandbox')
        console.log('   2. Número inválido')
        console.log('   3. WhatsApp não instalado')
        break

      case 'failed':
        console.log('❌ STATUS: FAILED (Falhou)')
        console.log('   A mensagem falhou ao ser enviada.')
        console.log(`   Motivo: ${data.error_message}`)
        console.log(`   Código: ${data.error_code}`)
        break

      default:
        console.log(`⚠️ STATUS: ${data.status.toUpperCase()}`)
        console.log('   Status desconhecido ou em processamento.')
    }

    // Verificar erro específico de número não autorizado
    if (data.error_code === 21608 || data.error_message?.includes('not authorized')) {
      console.log('\n' + '⚠️'.repeat(30) + '\n')
      console.log('🔴 PROBLEMA IDENTIFICADO: Número não autorizado no Sandbox!\n')
      console.log('SOLUÇÃO:')
      console.log('1. Acesse: https://console.twilio.com/us1/develop/sms/try-it-out/whatsapp-learn')
      console.log('2. Copie o código "join xxxxx"')
      console.log('3. No seu celular, envie WhatsApp para +1 415 523 8886')
      console.log('4. Envie exatamente: join xxxxx')
      console.log('5. Aguarde confirmação')
      console.log('6. Execute novamente: node test-whatsapp.mjs\n')
      console.log('📖 Guia completo: AUTORIZAR_NUMERO_TWILIO.md\n')
    }

    console.log('\n' + '═'.repeat(60) + '\n')
    console.log('📞 Para autorizar seu número no Sandbox:')
    console.log('   Leia o arquivo: AUTORIZAR_NUMERO_TWILIO.md\n')
  } else {
    console.log('❌ Erro ao consultar mensagem:', data.message)
    console.log('Detalhes:', data)
  }
} catch (error) {
  console.log('❌ Erro na requisição:', error.message)
}
