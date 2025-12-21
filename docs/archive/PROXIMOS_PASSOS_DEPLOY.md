# 🚀 Próximos Passos - Deploy Versati Glass

## ✅ O que já está feito

- ✅ Deploy na Vercel concluído
- ✅ Domínio configurado: **https://versati-glass.vercel.app**
- ✅ Aplicação no ar (deployment ID: dpl_CjJKaajWawxhvRuPvzyYYz3UAB8Q)

---

## 🔴 URGENTE - Faça AGORA

### 1️⃣ Configurar Banco de Dados PostgreSQL em Produção

Atualmente a DATABASE_URL aponta para localhost. Você precisa de um banco PostgreSQL em produção.

#### Opção A: Railway (Recomendado - Fácil)

```bash
# 1. Acesse https://railway.app/
# 2. Login com GitHub
# 3. New Project → Provision PostgreSQL
# 4. Copie a DATABASE_URL fornecida
# 5. Adicione no Vercel:
vercel env add DATABASE_URL production
# Cole a URL copiada: postgresql://user:pass@host.railway.app:5432/db
```

#### Opção B: Supabase (Gratuito)

```bash
# 1. Acesse https://supabase.com/
# 2. Create New Project
# 3. Vá em Settings → Database
# 4. Copie a Connection String (URI)
# 5. Adicione no Vercel:
vercel env add DATABASE_URL production
```

#### Opção C: Neon (Gratuito - Serverless)

```bash
# 1. Acesse https://neon.tech/
# 2. Sign up e crie projeto
# 3. Copie a Connection String
# 4. Adicione no Vercel:
vercel env add DATABASE_URL production
```

---

### 2️⃣ Adicionar Variáveis de Ambiente no Vercel

**Via Dashboard** (Mais Fácil):

1. Acesse: https://vercel.com/leopalhas-projects/versati-glass/settings/environment-variables

2. Clique em "Add New" e adicione cada variável abaixo:

**Críticas** (aplicação não funciona sem):

```env
# Auth (OBRIGATÓRIO)
NEXTAUTH_URL = https://versati-glass.vercel.app (Environment: Production)
NEXTAUTH_SECRET = h5IWt1KRJQBDUFTKPdByrSBw3MviDEf1x/ebfdEFLic= (All Environments)
AUTH_SECRET = h5IWt1KRJQBDUFTKPdByrSBw3MviDEf1x/ebfdEFLic= (All Environments)

# Database (OBRIGATÓRIO - usar URL do Railway/Supabase/Neon)
DATABASE_URL = postgresql://... (All Environments)

# IA Chat (OBRIGATÓRIO - sem isso o chat não funciona)
GROQ_API_KEY = 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 (All Environments)

# IA Vision (OBRIGATÓRIO - sem isso análise de imagem não funciona)
OPENAI_API_KEY = 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 (All Environments)
```

**Importantes** (features não funcionam sem):

```env
# WhatsApp
TWILIO_ACCOUNT_SID = AC3c1339fa3ecac14202ae6b810019f0ae (All Environments)
TWILIO_AUTH_TOKEN = 7f111a7e0eab7f58edc27ec7e326bacc (All Environments)
TWILIO_WHATSAPP_NUMBER = +18207320393 (All Environments)

# Google OAuth & Calendar
GOOGLE_CLIENT_ID = 611018665878-enhh9nsf0biovn1s3tlqh55g9ubf31p3.apps.googleusercontent.com (All Environments)
GOOGLE_CLIENT_SECRET = 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 (All Environments)
GOOGLE_CALENDAR_ID = primary (All Environments)

# Stripe Payments
STRIPE_SECRET_KEY = sk_test_51SVcchB3FKITuv4Srjs27HtsHx6Apm6mKBdQGn39WZvCgrRl9aiDB2PkXz2y7R25COVnJOAMBqfhpXHuTVquC8QE00GySQswkO (All Environments)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY = pk_test_51SVcchB3FKITuv4SNXYFipOV4Bp2jciQ63sK1l32OsaayMIhfAYxTn40MWwGUUO5MTgMpJM9tIVrUXrgJVqn5mPY00LZQTdiCR (All Environments)
```

**Públicas** (NEXT*PUBLIC*\*):

```env
NEXT_PUBLIC_APP_URL = https://versati-glass.vercel.app (Production)
NEXT_PUBLIC_BASE_URL = https://versati-glass.vercel.app (Production)
NEXT_PUBLIC_WHATSAPP_NUMBER = +5521982536229 (All Environments)
NEXT_PUBLIC_COMPANY_WHATSAPP = +5521999999999 (All Environments)
```

**Opcionais**:

```env
R2_PUBLIC_URL = https://pub-73a8ecec23ab4848ac8b62215e552c38.r2.dev (All Environments)
CRON_SECRET = h5IWt1KRJQBDUFTKPdByrSBw3MviDEf1x/ebfdEFLic= (Production)
```

---

### 3️⃣ Executar Migrations no Banco de Produção

Depois de configurar DATABASE_URL:

#### Se usar Railway:

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login e link
railway login
railway link

# Executar migrations
railway run pnpm prisma migrate deploy

# (Opcional) Seed inicial
railway run pnpm db:seed
```

#### Se usar outro serviço:

```bash
# Set DATABASE_URL temporariamente
$env:DATABASE_URL="postgresql://user:pass@host:5432/db" # PowerShell
# ou
export DATABASE_URL="postgresql://user:pass@host:5432/db" # Bash

# Executar migrations
pnpm prisma migrate deploy

# (Opcional) Seed inicial
pnpm db:seed
```

---

### 4️⃣ Redeploy na Vercel

Depois de adicionar todas as variáveis de ambiente:

```bash
# Via CLI
vercel --prod

# Ou via Dashboard:
# 1. https://vercel.com/leopalhas-projects/versati-glass/deployments
# 2. Clique nos "..." do último deployment
# 3. "Redeploy"
```

---

### 5️⃣ Testar Aplicação

Acesse: https://versati-glass.vercel.app

Teste:

- [ ] Homepage carrega
- [ ] Login/Registro funcionam
- [ ] Chat IA responde (teste: "Olá, preciso de um orçamento")
- [ ] Upload de imagem funciona
- [ ] Wizard de orçamento completo
- [ ] Portal do cliente (criar conta e login)
- [ ] Admin dashboard (login com admin)

---

## 🟡 Importante - Curto Prazo

### 6️⃣ Configurar Webhooks

#### Twilio WhatsApp:

```
1. Acesse: https://console.twilio.com/
2. Messaging → Settings → WhatsApp Sandbox
3. "When a message comes in":
   POST https://versati-glass.vercel.app/api/whatsapp/webhook
```

#### Stripe (quando ativar pagamentos):

```
1. Acesse: https://dashboard.stripe.com/webhooks
2. Add endpoint:
   https://versati-glass.vercel.app/api/payments/webhook
3. Selecione eventos:
   - checkout.session.completed
   - payment_intent.succeeded
   - payment_intent.failed
4. Copie STRIPE_WEBHOOK_SECRET e adicione no Vercel
```

---

### 7️⃣ Configurar Domínio Customizado (Opcional)

Se você tem um domínio (ex: versatiglass.com.br):

```bash
# 1. Adicionar domínio no Vercel
# Dashboard → Settings → Domains → Add

# 2. Configurar DNS (no seu provedor de domínio):
# Type: CNAME
# Name: @ (ou www)
# Value: cname.vercel-dns.com

# 3. Aguardar propagação (1-48h)
```

---

## 🟢 Opcional - Melhorias Futuras

### 8️⃣ Monitoring & Analytics

```bash
# Vercel Analytics (gratuito)
# Já ativado automaticamente

# UptimeRobot (gratuito)
# 1. https://uptimerobot.com/
# 2. Add Monitor → URL: https://versati-glass.vercel.app
# 3. Configurar alertas por email

# Sentry (error tracking)
# 1. https://sentry.io/
# 2. Create Project → Next.js
# 3. Follow integration guide
```

---

### 9️⃣ CI/CD com GitHub Actions

Criar `.github/workflows/ci.yml`:

```yaml
name: CI
on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'pnpm'
      - run: pnpm install
      - run: pnpm lint
      - run: pnpm type-check
      - run: pnpm build
```

---

### 🔟 Staging Environment

```bash
# 1. Criar branch 'develop'
git checkout -b develop
git push origin develop

# 2. No Vercel Dashboard:
# Settings → Git → Production Branch → main
# Agora 'develop' vai para preview automaticamente

# 3. (Opcional) Adicionar domínio staging:
# staging.versatiglass.com.br → develop branch
```

---

## 📋 Checklist Rápido

Marque conforme for completando:

### Essencial (Faça AGORA):

- [ ] Criar PostgreSQL em produção (Railway/Supabase/Neon)
- [ ] Adicionar DATABASE_URL no Vercel
- [ ] Adicionar NEXTAUTH_SECRET no Vercel
- [ ] Adicionar AUTH_SECRET no Vercel
- [ ] Adicionar GROQ_API_KEY no Vercel
- [ ] Adicionar OPENAI_API_KEY no Vercel
- [ ] Executar migrations no banco de produção
- [ ] Redeploy: `vercel --prod`
- [ ] Testar aplicação em https://versati-glass.vercel.app

### Importante (Faça hoje):

- [ ] Adicionar todas as outras variáveis de ambiente
- [ ] Configurar Twilio WhatsApp webhook
- [ ] Testar fluxo completo de orçamento
- [ ] Testar chat IA
- [ ] Testar portal do cliente
- [ ] Testar admin dashboard

### Pode fazer depois:

- [ ] Configurar Stripe webhook
- [ ] Adicionar domínio customizado
- [ ] Configurar monitoring (UptimeRobot)
- [ ] Configurar CI/CD
- [ ] Setup staging environment

---

## 🆘 Precisa de Ajuda?

### Documentação Criada:

1. `DEPLOY_STATUS.md` - Status completo do deploy
2. `VERCEL_ENV_SETUP.md` - Guia detalhado de variáveis de ambiente
3. `setup-vercel-env.bat` - Script para adicionar env vars (Windows)
4. `docs/18_DEPLOY_GUIDE.md` - Guia completo de deploy

### Comandos Úteis:

```bash
# Ver logs
vercel logs

# Ver variáveis configuradas
vercel env ls

# Adicionar variável
vercel env add NOME_VARIAVEL production

# Deploy
vercel --prod

# Ver deployments
vercel ls
```

### Links Importantes:

- **Aplicação**: https://versati-glass.vercel.app
- **Dashboard**: https://vercel.com/leopalhas-projects/versati-glass
- **Env Vars**: https://vercel.com/leopalhas-projects/versati-glass/settings/environment-variables
- **Deployments**: https://vercel.com/leopalhas-projects/versati-glass/deployments

---

## 🎯 Ordem de Prioridade

**1º - CRÍTICO (sem isso a aplicação não funciona):**

- DATABASE_URL
- NEXTAUTH_SECRET / AUTH_SECRET
- GROQ_API_KEY
- OPENAI_API_KEY

**2º - IMPORTANTE (features não funcionam):**

- Twilio WhatsApp (para chat)
- Google OAuth (para login social)
- Stripe (para pagamentos)

**3º - RECOMENDADO (melhora experiência):**

- Domínio customizado
- Monitoring
- Analytics

**4º - OPCIONAL (boas práticas):**

- CI/CD
- Staging environment
- Error tracking

---

**Comece por**: Configurar DATABASE_URL e adicionar as 6 variáveis críticas de Auth + IA.

Depois de fazer isso, a aplicação já vai estar 80% funcional! 🚀

---

**Mantido por**: Claude Code
**Data**: 2024-12-18
