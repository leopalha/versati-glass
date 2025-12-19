import 'dotenv/config'

console.log('📧 Testando integração Resend Email...\n')

const config = {
  apiKey: process.env.RESEND_API_KEY,
  emailFrom: process.env.EMAIL_FROM,
  appUrl: process.env.NEXT_PUBLIC_APP_URL,
}

console.log('RESEND_API_KEY:', config.apiKey ? '✅ Configurado' : '❌ Não configurado')
console.log('EMAIL_FROM:', config.emailFrom || '❌ Não configurado')
console.log('NEXT_PUBLIC_APP_URL:', config.appUrl || '❌ Não configurado')

if (!config.apiKey || !config.emailFrom) {
  console.log('\n❌ Configuração incompleta!')
  console.log('\n📝 Adicione no .env:')
  console.log('RESEND_API_KEY="re_SEU_API_KEY"')
  console.log('EMAIL_FROM="contato@versatiglass.com.br"')
  console.log('\n📚 Veja: SETUP_COMPLETO_INTEGRACOES.md')
  process.exit(1)
}

console.log('\n🧪 Enviando email de teste...\n')

try {
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${config.apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: config.emailFrom,
      to: config.emailFrom, // Envia para você mesmo para teste
      subject: '✅ Teste Versati Glass - Email Funcionando!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #1a1a1a;">🎉 Email Configurado com Sucesso!</h1>
          <p>Parabéns! A integração com Resend está funcionando perfeitamente.</p>
          <p>Agora o sistema Versati Glass pode enviar:</p>
          <ul>
            <li>✅ Confirmações de orçamento</li>
            <li>✅ Notificações de agendamento</li>
            <li>✅ Aprovações de pedidos</li>
            <li>✅ Lembretes automáticos</li>
          </ul>
          <hr style="margin: 20px 0; border: none; border-top: 1px solid #eee;">
          <p style="color: #666; font-size: 14px;">
            Este é um email de teste do sistema Versati Glass<br>
            Enviado em: ${new Date().toLocaleString('pt-BR')}
          </p>
        </div>
      `,
    }),
  })

  const data = await response.json()

  if (response.ok) {
    console.log('✅ Email enviado com sucesso!')
    console.log('   ID:', data.id)
    console.log('   De:', config.emailFrom)
    console.log('   Para:', config.emailFrom)
    console.log('\n📬 Verifique sua caixa de entrada!')
    console.log('   (Pode demorar alguns segundos)')
  } else {
    console.log('❌ Erro ao enviar email:')
    console.log('   Status:', response.status)
    console.log('   Erro:', data.message || data.error)

    if (data.message?.includes('domain')) {
      console.log('\n💡 Dica: Você precisa verificar o domínio no Resend')
      console.log('   Ou use: EMAIL_FROM="onboarding@resend.dev"')
    }
  }
} catch (error) {
  console.log('❌ Erro na requisição:', error.message)
}
