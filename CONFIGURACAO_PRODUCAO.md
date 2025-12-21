# Configuracao de Producao - Versati Glass

## Variaveis de Ambiente Necessarias no Vercel

### 1. Autenticacao (OBRIGATORIO)

```
NEXTAUTH_URL=https://versati-glass.vercel.app
NEXTAUTH_SECRET=<gerar com: openssl rand -base64 32>
AUTH_SECRET=<mesmo valor do NEXTAUTH_SECRET>
```

### 2. Banco de Dados (OBRIGATORIO)

```
DATABASE_URL=postgresql://user:pass@host:port/database
```

### 3. IA / Chat (OBRIGATORIO para chat funcionar)

```
GROQ_API_KEY=gsk_...
OPENAI_API_KEY=sk-... (opcional, fallback)
```

### 4. Google OAuth (OBRIGATORIO para login com Google)

```
GOOGLE_CLIENT_ID=xxxxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-xxxxx
```

**IMPORTANTE:** No Google Cloud Console:

1. Adicione as URIs de redirect autorizadas:
   - `https://versati-glass.vercel.app/api/auth/callback/google`
   - `https://versati-glass.vercel.app`
2. Adicione os dominios autorizados:
   - `versati-glass.vercel.app`

### 5. Google Calendar (OPCIONAL - para agendamentos no calendario)

**REQUER Service Account, NAO OAuth normal!**

```
GOOGLE_SERVICE_ACCOUNT_EMAIL=service-account@project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
GOOGLE_CALENDAR_ID=primary (ou ID do calendario especifico)
```

**Como configurar:**

1. No Google Cloud Console, va em IAM & Admin > Service Accounts
2. Crie uma Service Account
3. Baixe a chave JSON
4. Extraia `client_email` para GOOGLE_SERVICE_ACCOUNT_EMAIL
5. Extraia `private_key` para GOOGLE_PRIVATE_KEY
6. No Google Calendar, compartilhe o calendario com o email da Service Account

### 6. Email (OBRIGATORIO para notificacoes por email)

```
RESEND_API_KEY=re_xxxxx
EMAIL_FROM=Versati Glass <noreply@seudominio.com>
```

**IMPORTANTE:**

- `onboarding@resend.dev` so funciona para teste
- Para producao, verifique um dominio no Resend e use `noreply@seudominio.com`

### 7. WhatsApp via Twilio (OPCIONAL - para notificacoes WhatsApp)

```
TWILIO_ACCOUNT_SID=ACxxxxx
TWILIO_AUTH_TOKEN=xxxxx
TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886
NEXT_PUBLIC_COMPANY_WHATSAPP=+5521999999999
```

**Como configurar:**

1. Crie conta no Twilio
2. Ative WhatsApp Business API
3. Configure o Sandbox ou um numero Business
4. Para producao, solicite aprovacao de templates

### 8. Stripe (OPCIONAL - para pagamentos)

```
STRIPE_PUBLISHABLE_KEY=pk_live_xxxxx
STRIPE_SECRET_KEY=sk_live_xxxxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxxxx
```

### 9. URLs da Aplicacao

```
NEXT_PUBLIC_APP_URL=https://versati-glass.vercel.app
```

---

## Checklist de Verificacao

### Chat IA

- [ ] GROQ_API_KEY configurada e valida
- [ ] Testar enviando mensagem no chat
- [ ] Verificar se respostas estao chegando

### Login Google

- [ ] GOOGLE_CLIENT_ID e GOOGLE_CLIENT_SECRET configurados
- [ ] URIs de redirect configuradas no Google Cloud Console
- [ ] Testar login com conta Google

### Agendamentos

- [ ] Se usar Google Calendar: configurar Service Account
- [ ] Se usar Email: configurar RESEND_API_KEY e dominio
- [ ] Se usar WhatsApp: configurar Twilio

### Email

- [ ] Dominio verificado no Resend
- [ ] EMAIL_FROM usando dominio verificado
- [ ] Testar envio de email

---

## Problemas Comuns

### Chat nao funciona no Vercel

1. Verificar GROQ_API_KEY esta configurada
2. Verificar se a API key e valida
3. Olhar logs no Vercel Dashboard > Functions > Logs

### Login Google nao funciona

1. Verificar NEXTAUTH_URL esta correto
2. Verificar URIs de redirect no Google Cloud Console
3. Verificar GOOGLE_CLIENT_ID e SECRET estao corretos

### Emails nao chegam

1. Verificar RESEND_API_KEY
2. Verificar EMAIL_FROM usa dominio verificado
3. Verificar pasta de spam

### Google Calendar nao funciona

1. Precisa de Service Account, NAO OAuth normal
2. Calendario deve estar compartilhado com email da Service Account
3. GOOGLE_PRIVATE_KEY deve ter quebras de linha corretas (\n)

### WhatsApp nao funciona

1. Verificar credenciais Twilio
2. Verificar numero esta no formato correto (whatsapp:+xxxxx)
3. Para Sandbox: destinatario deve ter optado in
4. Para producao: templates devem estar aprovados

---

## Deploy

```bash
# Via Vercel CLI
vercel --prod

# Ou via Git push (se CI configurado)
git push origin main
```

Apos deploy, verificar:

1. Site abre normalmente
2. Login funciona
3. Chat responde
4. Agendamentos funcionam (se configurado)
