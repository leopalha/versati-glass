# 📅 Setup Google Calendar Integration - Versati Glass

**Status:** ✅ Código implementado | ⏳ Configuração Google pendente
**Última Atualização:** 17 Dezembro 2024

---

## 🎯 Resumo Rápido

- **Custo:** R$ 0.00 (grátis - API Google Calendar)
- **Tempo de Setup:** 15-20 minutos
- **Benefício:** Agendamentos aparecem automaticamente no Google Calendar da empresa
- **Código:** ✅ 100% implementado

---

## ✅ O Que Já Está Pronto

### Código Implementado

1. **Serviço Google Calendar** ([src/services/google-calendar.ts](src/services/google-calendar.ts))
   - ✅ `createCalendarEvent()` - Cria evento no calendário
   - ✅ `updateCalendarEvent()` - Atualiza evento existente
   - ✅ `cancelCalendarEvent()` - Cancela evento
   - ✅ OAuth2 client setup automático
   - ✅ Tratamento de erros e logs

2. **Integração API**
   - ✅ `POST /api/appointments` - Cria evento ao agendar
   - ✅ Evento formatado com todos os detalhes do cliente
   - ✅ Lembretes automáticos (1 dia, 1 hora, 15 minutos antes)

3. **Tipos de Eventos**
   - ✅ 🔍 **Visita Técnica** - Verde, 2 horas de duração
   - ✅ 🔧 **Instalação** - Azul, 4 horas de duração

4. **Informações no Evento**
   - Nome, telefone e email do cliente
   - Endereço completo
   - Número do orçamento (se houver)
   - Link direto para o agendamento no admin
   - Observações

---

## 🚀 Como Configurar (Passo a Passo)

### Passo 1: Criar Projeto no Google Cloud

1. **Acessar Google Cloud Console:**

   ```
   https://console.cloud.google.com/
   ```

2. **Criar novo projeto:**
   - Clicar em "Select a project" (topo da página)
   - Clicar em "New Project"
   - Nome: `Versati Glass`
   - Clicar em "Create"

3. **Aguardar criação** (~30 segundos)

---

### Passo 2: Ativar Google Calendar API

1. **Ir para Library:**

   ```
   https://console.cloud.google.com/apis/library
   ```

2. **Buscar "Google Calendar API"**

3. **Clicar em "Enable"**

---

### Passo 3: Criar Credenciais OAuth 2.0

1. **Ir para Credentials:**

   ```
   https://console.cloud.google.com/apis/credentials
   ```

2. **Configurar tela de consentimento (se ainda não fez):**
   - Clicar em "Configure Consent Screen"
   - Escolher **"External"** (ou Internal se tiver Google Workspace)
   - App name: `Versati Glass`
   - User support email: seu email
   - Developer contact: seu email
   - Clicar em "Save and Continue"
   - Scopes: deixar padrão, clicar "Save and Continue"
   - Test users: adicionar seu email
   - Clicar em "Save and Continue"

3. **Criar credenciais OAuth:**
   - Voltar para Credentials
   - Clicar em "Create Credentials" → "OAuth client ID"
   - Application type: **"Web application"**
   - Name: `Versati Glass Calendar`
   - Authorized redirect URIs:
     - `http://localhost:3000/api/auth/google/callback`
     - `https://versatiglass.com.br/api/auth/google/callback` (quando tiver domínio)
   - Clicar em "Create"

4. **Copiar credenciais:**
   - Client ID: `XXX.apps.googleusercontent.com`
   - Client Secret: `GOCSPX-XXX`
   - **GUARDAR ESSES VALORES!**

---

### Passo 4: Gerar Refresh Token

Você precisa de um **refresh token** para acessar o calendário sem precisar fazer login toda vez.

**Método 1: OAuth Playground (Mais Fácil)**

1. **Acessar:**

   ```
   https://developers.google.com/oauthplayground/
   ```

2. **Configurar OAuth Playground:**
   - Clicar no ícone de engrenagem (⚙️) no canto superior direito
   - Marcar "Use your own OAuth credentials"
   - Client ID: colar o seu
   - Client Secret: colar o seu
   - Fechar

3. **Autorizar Google Calendar API:**
   - No lado esquerdo, buscar: `https://www.googleapis.com/auth/calendar`
   - Marcar a checkbox
   - Clicar em "Authorize APIs"
   - Fazer login com a conta Google que será dona do calendário
   - Clicar em "Allow"

4. **Trocar auth code por tokens:**
   - Após autorizar, você volta para o Playground
   - Clicar em "Exchange authorization code for tokens"
   - **Copiar o "Refresh token"** que aparece
   - **GUARDAR ESSE VALOR!**

**Método 2: Script Node.js**

Se preferir, use este script:

```javascript
// generate-refresh-token.mjs
import { google } from 'googleapis'
import http from 'http'
import { URL } from 'url'

const CLIENT_ID = 'SEU_CLIENT_ID'
const CLIENT_SECRET = 'SEU_CLIENT_SECRET'
const REDIRECT_URI = 'http://localhost:3000/api/auth/google/callback'

const oauth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI)

const scopes = ['https://www.googleapis.com/auth/calendar']

const authUrl = oauth2Client.generateAuthUrl({
  access_type: 'offline',
  scope: scopes,
  prompt: 'consent',
})

console.log('Abra esta URL no navegador:')
console.log(authUrl)
console.log('\nAguardando callback...')

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://localhost:3000')
  const code = url.searchParams.get('code')

  if (code) {
    const { tokens } = await oauth2Client.getToken(code)
    console.log('\n✅ Refresh Token:')
    console.log(tokens.refresh_token)

    res.writeHead(200, { 'Content-Type': 'text/html' })
    res.end('<h1>Success! Check your terminal for the refresh token.</h1>')
    server.close()
  }
})

server.listen(3000)
```

Execute:

```bash
node generate-refresh-token.mjs
```

---

### Passo 5: Atualizar .env

Adicione as variáveis no arquivo `.env`:

```env
# Google Calendar Integration
GOOGLE_CLIENT_ID="XXX.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="GOCSPX-XXX"
GOOGLE_REFRESH_TOKEN="1//XXX"
GOOGLE_CALENDAR_ID="primary"  # ou ID específico do calendário
```

---

### Passo 6: Testar

1. **Reiniciar aplicação:**

   ```bash
   pnpm dev
   ```

2. **Criar um agendamento de teste:**
   - Login no admin: http://localhost:3000/admin
   - Ir em "Agendamentos"
   - Criar nova visita técnica

3. **Verificar Google Calendar:**
   - Abrir: https://calendar.google.com
   - Deve aparecer o evento criado!

---

## 📋 Checklist de Setup

- [ ] Criar projeto no Google Cloud Console
- [ ] Ativar Google Calendar API
- [ ] Configurar tela de consentimento OAuth
- [ ] Criar credenciais OAuth 2.0
- [ ] Copiar Client ID e Client Secret
- [ ] Gerar Refresh Token (OAuth Playground ou script)
- [ ] Adicionar variáveis no .env
- [ ] Reiniciar aplicação
- [ ] Testar criando agendamento
- [ ] Verificar evento no Google Calendar

---

## 🎨 Como os Eventos Aparecem

### Visita Técnica 🔍

```
Título: 🔍 Visita Técnica - João Silva
Cor: Verde
Duração: 2 horas

Descrição:
Visita técnica para medições e avaliação do projeto.

👤 Cliente: João Silva
📞 Telefone: (21) 99999-8888
📧 Email: joao@email.com
📋 Orçamento: ORC-2024-0001

📍 Endereço: Rua das Flores, 123, Copacabana, Rio de Janeiro - RJ

🔗 Ver detalhes: http://localhost:3000/admin/agendamentos/clxxx

Lembretes:
- 1 dia antes (email)
- 1 hora antes (popup)
- 15 minutos antes (popup)
```

### Instalação 🔧

```
Título: 🔧 Instalação - Maria Santos
Cor: Azul
Duração: 4 horas
(mesma estrutura da visita técnica)
```

---

## 🔍 Troubleshooting

### Erro: "Google Calendar credentials not configured"

**Causa:** Variáveis de ambiente não configuradas

**Solução:**

1. Verificar se `.env` tem todas as 4 variáveis
2. Reiniciar aplicação: `pnpm dev`
3. Verificar logs no console

---

### Erro: "Invalid grant" ou "Token expired"

**Causa:** Refresh token inválido ou expirado

**Solução:**

1. Gerar novo refresh token no OAuth Playground
2. Atualizar `GOOGLE_REFRESH_TOKEN` no `.env`
3. Reiniciar aplicação

---

### Erro: "Insufficient Permission"

**Causa:** Escopo de permissão incorreto

**Solução:**

1. Ao gerar refresh token, usar escopo: `https://www.googleapis.com/auth/calendar`
2. Refazer autorização no OAuth Playground
3. Gerar novo refresh token

---

### Evento não aparece no calendário

**Checklist:**

- [ ] Variáveis `.env` configuradas corretamente
- [ ] Aplicação reiniciada após configurar `.env`
- [ ] Verificar logs no console do server
- [ ] Conta Google correta (mesma do refresh token)
- [ ] Calendar ID correto (use "primary" para calendário principal)

---

## 💡 Dicas

### Usar Calendário Específico

Se quiser usar um calendário diferente do principal:

1. **Criar novo calendário no Google Calendar:**
   - Settings → Add calendar → Create new calendar
   - Nome: "Versati Glass - Agendamentos"

2. **Pegar ID do calendário:**
   - Settings → Calendário criado → Integrate calendar
   - Copiar "Calendar ID" (ex: `xxx@group.calendar.google.com`)

3. **Atualizar `.env`:**
   ```env
   GOOGLE_CALENDAR_ID="xxx@group.calendar.google.com"
   ```

### Compartilhar Calendário com Equipe

1. Google Calendar → Settings → seu calendário
2. "Share with specific people"
3. Adicionar emails da equipe
4. Permissão: "Make changes to events"

---

## 🎯 Próximos Passos (Opcional)

### Implementar Update e Cancel

O código já tem as funções prontas, basta integrar:

**Atualizar evento quando reagendar:**

```typescript
// src/app/api/appointments/[id]/reschedule/route.ts
import { updateCalendarEvent } from '@/services/google-calendar'

// Após atualizar agendamento no banco:
if (appointment.calendarEventId) {
  await updateCalendarEvent(appointment.calendarEventId, {
    scheduledDate: newDate,
    scheduledTime: newTime,
  })
}
```

**Cancelar evento quando cancelar agendamento:**

```typescript
// src/app/api/appointments/[id]/route.ts (DELETE)
import { cancelCalendarEvent } from '@/services/google-calendar'

if (appointment.calendarEventId) {
  await cancelCalendarEvent(appointment.calendarEventId)
}
```

Para isso, precisa adicionar campo no banco:

```prisma
model Appointment {
  // ... campos existentes
  calendarEventId String? // ID do evento no Google Calendar
}
```

---

## 📊 Monitoramento

### Logs

Procure por:

```
[Google Calendar] Event created for appointment
[Google Calendar] Failed to create event
```

### Google Cloud Console

Acessar: https://console.cloud.google.com/apis/dashboard

Ver:

- API calls
- Erros
- Quotas (máximo: 1 milhão requests/dia - grátis)

---

## 💰 Custos

**Google Calendar API:** GRÁTIS

- 1.000.000 requests/dia (quota grátis)
- Versati Glass vai usar ~50-200 requests/dia (criação + updates)
- Equivale a: **0% da quota**

---

**Criado em:** 17 Dezembro 2024
**Autor:** Claude (Agent SDK)
**Versão:** 1.0
