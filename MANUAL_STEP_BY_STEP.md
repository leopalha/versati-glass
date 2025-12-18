# 📖 Manual Passo a Passo - Setup Completo

Se preferir fazer manualmente ao invés de usar os scripts automáticos.

---

## 🗄️ PARTE 1: Setup Railway (PostgreSQL)

### Passo 1.1: Login

```bash
railway login
```

Vai abrir o browser → Faça login com GitHub

### Passo 1.2: Criar Projeto

```bash
railway init --name versatiglass
```

Responda as perguntas:

- ✅ Create new project
- ✅ Name: versatiglass

### Passo 1.3: Adicionar PostgreSQL

```bash
railway add --database postgres
```

Aguarde ~30 segundos para provisionar.

### Passo 1.4: Ver Variáveis

```bash
railway variables
```

Procure por `DATABASE_URL` e **copie o valor completo**.

Exemplo:

```
postgresql://postgres:senha123@containers-us-west-123.railway.app:5432/railway
```

### Passo 1.5: Executar Migrations

```bash
railway run pnpm prisma migrate deploy
```

Se tudo correr bem, você verá:

```
✔ Applied migration(s)...
```

### Passo 1.6: (Opcional) Executar Seed

```bash
railway run pnpm db:seed
```

Isso vai popular o banco com:

- 1 usuário admin
- 1 usuário cliente de teste
- 13 produtos de exemplo
- Alguns orçamentos de exemplo

---

## ⚙️ PARTE 2: Configurar Vercel (Variáveis de Ambiente)

### Passo 2.1: Adicionar DATABASE_URL

```bash
vercel env add DATABASE_URL
```

Quando perguntar:

- **Value**: Cole a DATABASE_URL do Railway (passo 1.4)
- **Environment**: Selecione `Production` e `Preview` (use setas + espaço)

### Passo 2.2: Adicionar NEXTAUTH_URL (Production)

```bash
vercel env add NEXTAUTH_URL
```

- **Value**: `https://versati-glass.vercel.app`
- **Environment**: `Production` apenas

### Passo 2.3: Adicionar NEXTAUTH_SECRET

```bash
vercel env add NEXTAUTH_SECRET
```

- **Value**: `h5IWt1KRJQBDUFTKPdByrSBw3MviDEf1x/ebfdEFLic=`
- **Environment**: Todos (Production, Preview, Development)

### Passo 2.4: Adicionar AUTH_SECRET

```bash
vercel env add AUTH_SECRET
```

- **Value**: `h5IWt1KRJQBDUFTKPdByrSBw3MviDEf1x/ebfdEFLic=`
- **Environment**: Todos (Production, Preview, Development)

### Passo 2.5: Adicionar GROQ_API_KEY

```bash
vercel env add GROQ_API_KEY
```

- **Value**: `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`
- **Environment**: Todos

### Passo 2.6: Adicionar OPENAI_API_KEY

```bash
vercel env add OPENAI_API_KEY
```

- **Value**: `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`
- **Environment**: Todos

### Passo 2.7: Adicionar TWILIO_ACCOUNT_SID

```bash
vercel env add TWILIO_ACCOUNT_SID
```

- **Value**: `AC3c1339fa3ecac14202ae6b810019f0ae`
- **Environment**: Todos

### Passo 2.8: Adicionar TWILIO_AUTH_TOKEN

```bash
vercel env add TWILIO_AUTH_TOKEN
```

- **Value**: `7f111a7e0eab7f58edc27ec7e326bacc`
- **Environment**: Todos

### Passo 2.9: Adicionar TWILIO_WHATSAPP_NUMBER

```bash
vercel env add TWILIO_WHATSAPP_NUMBER
```

- **Value**: `+18207320393`
- **Environment**: Todos

### Passo 2.10: Adicionar GOOGLE_CLIENT_ID

```bash
vercel env add GOOGLE_CLIENT_ID
```

- **Value**: `611018665878-enhh9nsf0biovn1s3tlqh55g9ubf31p3.apps.googleusercontent.com`
- **Environment**: Todos

### Passo 2.11: Adicionar GOOGLE_CLIENT_SECRET

```bash
vercel env add GOOGLE_CLIENT_SECRET
```

- **Value**: `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`
- **Environment**: Todos

### Passo 2.12: Adicionar GOOGLE_CALENDAR_ID

```bash
vercel env add GOOGLE_CALENDAR_ID
```

- **Value**: `primary`
- **Environment**: Todos

### Passo 2.13: Adicionar STRIPE_SECRET_KEY

```bash
vercel env add STRIPE_SECRET_KEY
```

- **Value**: `sk_test_51SVcchB3FKITuv4Srjs27HtsHx6Apm6mKBdQGn39WZvCgrRl9aiDB2PkXz2y7R25COVnJOAMBqfhpXHuTVquC8QE00GySQswkO`
- **Environment**: Todos

### Passo 2.14: Adicionar NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY

```bash
vercel env add NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
```

- **Value**: `pk_test_51SVcchB3FKITuv4SNXYFipOV4Bp2jciQ63sK1l32OsaayMIhfAYxTn40MWwGUUO5MTgMpJM9tIVrUXrgJVqn5mPY00LZQTdiCR`
- **Environment**: Todos

### Passo 2.15: Adicionar NEXT_PUBLIC_APP_URL (Production)

```bash
vercel env add NEXT_PUBLIC_APP_URL
```

- **Value**: `https://versati-glass.vercel.app`
- **Environment**: Production apenas

### Passo 2.16: Adicionar NEXT_PUBLIC_BASE_URL (Production)

```bash
vercel env add NEXT_PUBLIC_BASE_URL
```

- **Value**: `https://versati-glass.vercel.app`
- **Environment**: Production apenas

### Passo 2.17: Adicionar NEXT_PUBLIC_WHATSAPP_NUMBER

```bash
vercel env add NEXT_PUBLIC_WHATSAPP_NUMBER
```

- **Value**: `+5521982536229`
- **Environment**: Todos

### Passo 2.18: Adicionar NEXT_PUBLIC_COMPANY_WHATSAPP

```bash
vercel env add NEXT_PUBLIC_COMPANY_WHATSAPP
```

- **Value**: `+5521999999999`
- **Environment**: Todos

### Passo 2.19: Adicionar R2_PUBLIC_URL

```bash
vercel env add R2_PUBLIC_URL
```

- **Value**: `https://pub-73a8ecec23ab4848ac8b62215e552c38.r2.dev`
- **Environment**: Todos

### Passo 2.20: Adicionar CRON_SECRET

```bash
vercel env add CRON_SECRET
```

- **Value**: `h5IWt1KRJQBDUFTKPdByrSBw3MviDEf1x/ebfdEFLic=`
- **Environment**: Production apenas

### Passo 2.21: (Opcional) Adicionar DEEPSEEK_API_KEY

```bash
vercel env add DEEPSEEK_API_KEY
```

- **Value**: `sk-bd4fcea553014e8d92d0afba35342638`
- **Environment**: Todos

---

## 🚀 PARTE 3: Deploy Final

### Passo 3.1: Verificar Variáveis Configuradas

```bash
vercel env ls
```

Você deve ver todas as ~21 variáveis listadas.

### Passo 3.2: Fazer Deploy em Produção

```bash
vercel --prod
```

Aguarde 2-3 minutos para o build completar.

### Passo 3.3: Verificar Deploy

```bash
vercel ls
```

O primeiro item da lista deve estar:

```
● Ready     Production
```

---

## ✅ PARTE 4: Testar Aplicação

### Passo 4.1: Acessar Homepage

```bash
start https://versati-glass.vercel.app
```

Ou acesse manualmente no browser.

### Passo 4.2: Testar Registro

1. Clique em "Registro"
2. Preencha o formulário
3. Crie uma conta de teste

### Passo 4.3: Testar Chat IA

1. Na homepage, clique no botão de chat
2. Digite: "Olá, preciso de um orçamento para vidro temperado"
3. Verifique se a IA responde

### Passo 4.4: Testar Wizard de Orçamento

1. Clique em "Solicitar Orçamento"
2. Siga o wizard completo
3. Envie fotos (teste análise de imagem com OpenAI)

### Passo 4.5: Testar Portal do Cliente

1. Faça login com a conta criada
2. Acesse: https://versati-glass.vercel.app/portal
3. Veja orçamentos, pedidos, etc

### Passo 4.6: Testar Admin Dashboard

1. Faça logout
2. Login com admin:
   - Email: `admin@versatiglass.com.br`
   - Senha: `admin123456` (se rodou seed)
3. Acesse: https://versati-glass.vercel.app/admin
4. Teste dashboard, clientes, orçamentos, etc

---

## 🔧 PARTE 5: Configurar Webhooks

### Passo 5.1: Twilio WhatsApp Webhook

1. Acesse: https://console.twilio.com/
2. Messaging → Settings → WhatsApp Sandbox
3. "When a message comes in":
   ```
   POST https://versati-glass.vercel.app/api/whatsapp/webhook
   ```
4. Save

### Passo 5.2: Stripe Webhook (quando ativar pagamentos)

1. Acesse: https://dashboard.stripe.com/webhooks
2. Add endpoint:
   ```
   https://versati-glass.vercel.app/api/payments/webhook
   ```
3. Select events:
   - `checkout.session.completed`
   - `payment_intent.succeeded`
   - `payment_intent.failed`
4. Copie o `Signing secret` (whsec\_...)
5. Adicione na Vercel:
   ```bash
   vercel env add STRIPE_WEBHOOK_SECRET
   ```
   Value: `whsec_...`
   Environment: Production, Preview

---

## 📊 PARTE 6: Verificação Final

### Checklist Completo

```
RAILWAY:
[x] Login no Railway
[x] Projeto "versatiglass" criado
[x] PostgreSQL provisionado
[x] DATABASE_URL obtida
[x] Migrations executadas
[x] Seed executado (opcional)

VERCEL:
[x] DATABASE_URL adicionada
[x] NEXTAUTH_URL + SECRET adicionadas
[x] AUTH_SECRET adicionada
[x] GROQ_API_KEY adicionada
[x] OPENAI_API_KEY adicionada
[x] Twilio vars adicionadas (3)
[x] Google vars adicionadas (3)
[x] Stripe vars adicionadas (2)
[x] NEXT_PUBLIC_ vars adicionadas (4)
[x] R2_PUBLIC_URL adicionada
[x] CRON_SECRET adicionada
[x] Deploy em produção concluído
[x] Status: ● Ready

TESTES:
[x] Homepage acessível
[x] Login/Registro funciona
[x] Chat IA responde
[x] Upload de imagem analisa
[x] Wizard de orçamento completo
[x] Portal do cliente acessa
[x] Admin dashboard acessa

WEBHOOKS:
[x] Twilio WhatsApp configurado
[ ] Stripe configurado (quando ativar)

OPCIONAL:
[ ] Domínio customizado
[ ] Monitoring (UptimeRobot)
[ ] Analytics configurado
[ ] CI/CD configurado
```

---

## 🎉 Pronto!

Sua aplicação está:

- ✅ **100% funcional em produção**
- ✅ Com banco de dados PostgreSQL
- ✅ Com todas as integrações ativas
- ✅ Pronta para receber usuários reais

**URL Production**: https://versati-glass.vercel.app

---

## 📞 Comandos Úteis para Manutenção

### Railway:

```bash
# Ver logs do banco
railway logs

# Conectar ao banco via CLI
railway run psql

# Abrir Prisma Studio (visualizar dados)
railway run pnpm db:studio

# Executar migrations futuras
railway run pnpm prisma migrate deploy

# Backup manual
railway run pg_dump > backup.sql
```

### Vercel:

```bash
# Ver logs em tempo real
vercel logs --follow

# Ver variáveis
vercel env ls

# Remover variável
vercel env rm NOME_VARIAVEL

# Novo deploy
vercel --prod

# Rollback (promover deployment anterior)
vercel rollback https://versati-glass-xxx.vercel.app
```

### Local:

```bash
# Conectar ao banco de produção localmente
railway run pnpm db:studio

# Testar build local
pnpm build
pnpm start

# Executar migrations localmente
railway run pnpm prisma migrate dev
```

---

**Tempo Total**: ~15-20 minutos fazendo manualmente

**Preferência**: Use os scripts `setup-railway.bat` e `setup-vercel-complete.bat` para fazer tudo em ~5 minutos! ⚡

---

**Mantido por**: Claude Code
**Data**: 2024-12-18
