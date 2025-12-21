# 🚀 Setup Completo - Todas as Integrações

**Data:** 19/12/2024 01:15
**Tempo Total Estimado:** 20-25 minutos
**Custo:** R$ 0,00 (TUDO GRÁTIS!)

---

## ✅ Status Atual

| Integração           | Status             | Ação Necessária                     |
| -------------------- | ------------------ | ----------------------------------- |
| 📱 WhatsApp (Twilio) | ✅ **FUNCIONANDO** | Nenhuma - Já configurado!           |
| 🔐 Google OAuth      | ✅ **FUNCIONANDO** | Nenhuma - Já configurado!           |
| 📧 Email (Resend)    | ❌ Faltando        | Configurar API Key (5 min)          |
| 📅 Google Calendar   | ⚠️ Parcial         | Configurar Service Account (15 min) |

---

## 📧 PASSO 1: Configurar Resend Email (5 minutos)

### O que você ganha:

- ✅ Emails profissionais para clientes
- ✅ Confirmação de orçamentos
- ✅ Notificação de agendamentos
- ✅ **GRÁTIS até 3.000 emails/mês**

### Passo a Passo:

1. **Criar conta gratuita:**
   - Acesse: https://resend.com/signup
   - Cadastre-se com seu email
   - Confirme o email

2. **Obter API Key:**
   - Após login, clique em "API Keys" no menu
   - Clique em "Create API Key"
   - Nome: `Versati Glass Production`
   - Permissions: `Send emails`
   - Copie a chave que aparece (começa com `re_`)

3. **Verificar domínio (OPCIONAL mas recomendado):**
   - Se quiser enviar como `contato@versatiglass.com.br`:
     - Vá em "Domains" → "Add Domain"
     - Siga as instruções para adicionar registros DNS
   - Se NÃO quiser verificar agora:
     - Use `onboarding@resend.dev` (100 emails/dia)
     - Emails vão para `onboarding@resend.dev` mas cliente vê remetente correto

4. **Adicionar no .env:**

   ```env
   # Email Configuration (Resend)
   RESEND_API_KEY="re_SEU_API_KEY_AQUI"
   EMAIL_FROM="contato@versatiglass.com.br"  # ou "onboarding@resend.dev"
   ```

5. **Reiniciar servidor:**

   ```bash
   # Parar servidor (Ctrl+C)
   pnpm dev
   ```

6. **Testar:**
   ```bash
   node test-email.mjs
   ```

✅ **Pronto! Emails configurados!**

---

## 📅 PASSO 2: Configurar Google Calendar (15 minutos)

### O que você ganha:

- ✅ Agendamentos aparecem automaticamente no Google Calendar
- ✅ Lembretes automáticos
- ✅ Nunca mais perder uma visita/instalação
- ✅ **TOTALMENTE GRÁTIS**

### Passo a Passo DETALHADO:

#### 2.1. Criar Projeto no Google Cloud (3 min)

1. **Acessar Google Cloud Console:**
   - URL: https://console.cloud.google.com/
   - Faça login com sua conta Google (@versatiglass.com.br ou pessoal)

2. **Criar novo projeto:**
   - Clique no dropdown de projetos (canto superior esquerdo)
   - Clique em "New Project"
   - Nome: `Versati Glass Calendar`
   - Location: `No organization`
   - Clique em "CREATE"
   - Aguarde ~30 segundos

3. **Selecionar o projeto:**
   - No dropdown de projetos, selecione "Versati Glass Calendar"

#### 2.2. Habilitar Google Calendar API (2 min)

1. **Acessar APIs & Services:**
   - Menu (☰) → "APIs & Services" → "Library"

2. **Buscar Calendar API:**
   - Digite "Google Calendar API" na busca
   - Clique em "Google Calendar API"
   - Clique em "ENABLE"
   - Aguarde aparecer "API enabled"

#### 2.3. Criar Service Account (5 min)

1. **Acessar Service Accounts:**
   - Menu (☰) → "IAM & Admin" → "Service Accounts"
   - Clique em "+ CREATE SERVICE ACCOUNT"

2. **Criar a conta:**
   - **Service account name:** `versati-calendar-bot`
   - **Service account ID:** versati-calendar-bot (auto-preenchido)
   - **Description:** "Bot para criar eventos no Google Calendar"
   - Clique em "CREATE AND CONTINUE"

3. **Definir permissões:**
   - **Role:** Basic → Editor
   - Clique em "CONTINUE"
   - Clique em "DONE"

4. **Criar chave JSON:**
   - Na lista de Service Accounts, clique em `versati-calendar-bot@...`
   - Vá na aba "KEYS"
   - Clique em "ADD KEY" → "Create new key"
   - Tipo: JSON
   - Clique em "CREATE"
   - **Um arquivo JSON será baixado** → GUARDE BEM ESSE ARQUIVO!

#### 2.4. Compartilhar Calendário (2 min)

1. **Abrir Google Calendar:**
   - URL: https://calendar.google.com

2. **Criar calendário dedicado (OPCIONAL):**
   - Se quiser um calendário separado para agendamentos:
     - Clique em "+" ao lado de "Other calendars"
     - "Create new calendar"
     - Nome: "Versati Glass - Agendamentos"
     - Description: "Agendamentos de visitas e instalações"
     - Time zone: (GMT-03:00) Brasília
     - Clique em "Create calendar"
   - Se quiser usar o calendário principal:
     - Pode pular esta etapa

3. **Compartilhar com Service Account:**
   - Clique em "⚙" ao lado do calendário
   - Clique em "Settings and sharing"
   - Role até "Share with specific people or groups"
   - Clique em "+ Add people and groups"
   - Cole o email da Service Account (está no arquivo JSON baixado, campo `client_email`)
     - Ex: `versati-calendar-bot@versati-glass-calendar.iam.gserviceaccount.com`
   - Permissions: "Make changes to events"
   - Clique em "Send"

4. **Copiar Calendar ID:**
   - Ainda em "Settings and sharing"
   - Role até "Integrate calendar"
   - Copie o "Calendar ID"
     - Se for calendário principal: geralmente é seu email
     - Se criou novo: algo como `abc123@group.calendar.google.com`

#### 2.5. Adicionar no .env (3 min)

1. **Abrir o arquivo JSON baixado**
   - Procure os campos:
     - `client_email` → GOOGLE_SERVICE_ACCOUNT_EMAIL
     - `private_key` → GOOGLE_PRIVATE_KEY

2. **Adicionar no .env:**

   ```env
   # Google Calendar Integration
   GOOGLE_CALENDAR_ID="SEU_CALENDAR_ID_AQUI"  # ou "primary" para calendário principal
   GOOGLE_SERVICE_ACCOUNT_EMAIL="versati-calendar-bot@...iam.gserviceaccount.com"
   GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nSUA_CHAVE_AQUI\n-----END PRIVATE KEY-----\n"
   ```

   ⚠️ **ATENÇÃO na GOOGLE_PRIVATE_KEY:**
   - Copie TODO o valor do campo `private_key` do JSON
   - Mantenha as aspas duplas
   - Mantenha os `\n` (quebras de linha)
   - Exemplo correto:
     ```env
     GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhki...\n-----END PRIVATE KEY-----\n"
     ```

3. **Reiniciar servidor:**

   ```bash
   # Parar servidor (Ctrl+C)
   pnpm dev
   ```

4. **Testar:**
   ```bash
   node test-google-calendar.mjs
   ```

✅ **Pronto! Google Calendar configurado!**

---

## 🧪 PASSO 3: Testar TUDO (5 minutos)

### 3.1. Testar Email

```bash
node test-email.mjs
```

**Resultado esperado:**

- ✅ Email enviado com sucesso
- ✅ Você recebe o email na caixa de entrada

### 3.2. Testar Google Calendar

```bash
node test-google-calendar.mjs
```

**Resultado esperado:**

- ✅ Evento criado no Google Calendar
- ✅ Você vê o evento no calendar.google.com

### 3.3. Testar WhatsApp (já funciona!)

```bash
node test-whatsapp.mjs
```

**Resultado esperado:**

- ✅ Mensagem enviada via Twilio
- ⚠️ Pode precisar validar número no sandbox Twilio

### 3.4. Testar Fluxo Completo

1. **Criar orçamento no site:**
   - Acesse: http://localhost:3000/orcamento
   - Preencha todas as etapas
   - Envie

2. **Verificar:**
   - ✅ Orçamento aparece no admin
   - ✅ Email chega para o cliente
   - ✅ WhatsApp chega para a empresa (você)

3. **Agendar visita:**
   - No painel admin, agende uma visita
   - Verificar:
     - ✅ Evento aparece no Google Calendar
     - ✅ Email de confirmação chega para o cliente
     - ✅ WhatsApp chega para a empresa

✅ **TUDO FUNCIONANDO!**

---

## 📝 Resumo das Variáveis .env

Ao final, seu `.env` deve ter:

```env
# Email (Resend)
RESEND_API_KEY="re_..."
EMAIL_FROM="contato@versatiglass.com.br"

# Google Calendar
GOOGLE_CALENDAR_ID="primary"  # ou ID do calendário criado
GOOGLE_SERVICE_ACCOUNT_EMAIL="versati-calendar-bot@...iam.gserviceaccount.com"
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# WhatsApp (Twilio) - JÁ CONFIGURADO ✅
TWILIO_ACCOUNT_SID="AC3c1339fa3ecac14202ae6b810019f0ae"
TWILIO_AUTH_TOKEN="7f111a7e0eab7f58edc27ec7e326bacc"
TWILIO_WHATSAPP_NUMBER="+18207320393"
NEXT_PUBLIC_COMPANY_WHATSAPP="+5521999999999"
```

---

## ❓ Troubleshooting

### Email não chega:

- Verificar RESEND_API_KEY está correto
- Verificar EMAIL_FROM está correto
- Checar spam/lixo eletrônico
- Ver logs do servidor

### Google Calendar não cria evento:

- Verificar se compartilhou calendário com Service Account
- Verificar se GOOGLE_PRIVATE_KEY tem as aspas e `\n` corretos
- Ver logs do servidor

### WhatsApp não envia:

- Número precisa estar validado no Twilio Sandbox
- Para produção, precisa requisitar número verificado

---

## 🎯 Próximos Passos DEPOIS de Configurar

1. **Testar em Produção:**
   - Deploy na Vercel/Railway
   - Testar todas as integrações

2. **Monitorar:**
   - Ver logs de emails enviados no Resend
   - Ver eventos criados no Google Calendar
   - Ver mensagens enviadas no Twilio Console

3. **Melhorias Futuras:**
   - Personalizar templates de email
   - Adicionar mais lembretes
   - Integrar com CRM

---

**🎉 Após seguir estes passos, TODAS as integrações estarão funcionando 100%!**
