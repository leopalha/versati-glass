import 'dotenv/config'
import { google } from 'googleapis'

console.log('📅 Testando integração Google Calendar...\n')

const config = {
  calendarId: process.env.GOOGLE_CALENDAR_ID,
  serviceAccountEmail: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
  privateKey: process.env.GOOGLE_PRIVATE_KEY,
}

console.log('GOOGLE_CALENDAR_ID:', config.calendarId || '❌ Não configurado')
console.log('GOOGLE_SERVICE_ACCOUNT_EMAIL:', config.serviceAccountEmail || '❌ Não configurado')
console.log('GOOGLE_PRIVATE_KEY:', config.privateKey ? '✅ Configurado' : '❌ Não configurado')

if (!config.calendarId || !config.serviceAccountEmail || !config.privateKey) {
  console.log('\n❌ Configuração incompleta!')
  console.log('\n📝 Você precisa:')
  console.log('1. Criar Service Account no Google Cloud')
  console.log('2. Habilitar Google Calendar API')
  console.log('3. Baixar arquivo JSON da chave')
  console.log('4. Compartilhar calendário com Service Account')
  console.log('5. Adicionar variáveis no .env')
  console.log('\n📚 Veja: SETUP_COMPLETO_INTEGRACOES.md (Passo 2)')
  process.exit(1)
}

console.log('\n🧪 Criando evento de teste no calendário...\n')

try {
  // Create OAuth2 client
  const auth = new google.auth.JWT({
    email: config.serviceAccountEmail,
    key: config.privateKey.replace(/\\n/g, '\n'),
    scopes: ['https://www.googleapis.com/auth/calendar'],
  })

  const calendar = google.calendar({ version: 'v3', auth })

  // Create test event
  const event = {
    summary: '✅ Teste Versati Glass - Calendar Funcionando!',
    description: 'Este é um evento de teste criado automaticamente pelo sistema Versati Glass.\n\n' +
                 '🎉 A integração está funcionando!\n\n' +
                 `Criado em: ${new Date().toLocaleString('pt-BR')}`,
    location: 'Escritório Versati Glass',
    start: {
      dateTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // Daqui 2 horas
      timeZone: 'America/Sao_Paulo',
    },
    end: {
      dateTime: new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString(), // Duração: 1 hora
      timeZone: 'America/Sao_Paulo',
    },
    colorId: '10', // Verde
    reminders: {
      useDefault: false,
      overrides: [
        { method: 'popup', minutes: 15 },
      ],
    },
  }

  const response = await calendar.events.insert({
    calendarId: config.calendarId,
    requestBody: event,
  })

  console.log('✅ Evento criado com sucesso!')
  console.log('   ID:', response.data.id)
  console.log('   Título:', response.data.summary)
  console.log('   Início:', new Date(response.data.start.dateTime).toLocaleString('pt-BR'))
  console.log('   Link:', response.data.htmlLink)
  console.log('\n📅 Abra seu Google Calendar para ver o evento!')
  console.log('   https://calendar.google.com')
  console.log('\n💡 Você pode deletar este evento de teste manualmente')

} catch (error) {
  console.log('❌ Erro ao criar evento:')
  console.log('   Mensagem:', error.message)

  if (error.message.includes('invalid_grant')) {
    console.log('\n💡 Possíveis causas:')
    console.log('   - GOOGLE_PRIVATE_KEY está incorreto')
    console.log('   - Service Account Email está errado')
    console.log('   - Falta quebras de linha (\\n) na chave')
  }

  if (error.message.includes('notFound')) {
    console.log('\n💡 Possíveis causas:')
    console.log('   - GOOGLE_CALENDAR_ID está incorreto')
    console.log('   - Calendário não foi compartilhado com Service Account')
  }

  if (error.message.includes('forbidden') || error.message.includes('insufficientPermissions')) {
    console.log('\n💡 Possíveis causas:')
    console.log('   - Calendário não foi compartilhado com Service Account')
    console.log('   - Permissões insuficientes (precisa "Make changes to events")')
    console.log('   - Google Calendar API não está habilitada')
  }

  console.log('\n📚 Veja: SETUP_COMPLETO_INTEGRACOES.md para mais detalhes')
  console.log('\n🔍 Erro completo:')
  console.log(error)
}
