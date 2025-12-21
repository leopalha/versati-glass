# Configuração de Variáveis de Ambiente - Vercel

## 📋 Acesse o Dashboard da Vercel

1. Vá para: https://vercel.com/leopalhas-projects/versati-glass/settings/environment-variables
2. Ou: Dashboard Vercel → Projeto `versati-glass` → Settings → Environment Variables

---

## 🔑 Variáveis de Ambiente para Adicionar

### ⚠️ CRÍTICAS (Necessárias para a aplicação funcionar)

**DATABASE_URL** (Production, Preview)

```
postgresql://postgres:postgres@localhost:5432/versatiglass
```

⚠️ **IMPORTANTE**: Você precisa substituir por sua URL do Railway ou PostgreSQL em produção!

**NEXTAUTH_URL** (Production)

```
https://versati-glass.vercel.app
```

**NEXTAUTH_URL** (Preview)

```
https://versati-glass-git-$VERCEL_GIT_COMMIT_REF-leopalhas-projects.vercel.app
```

**NEXTAUTH_SECRET** (Production, Preview, Development)

```
h5IWt1KRJQBDUFTKPdByrSBw3MviDEf1x/ebfdEFLic=
```

**AUTH_SECRET** (Production, Preview, Development)

```
h5IWt1KRJQBDUFTKPdByrSBw3MviDEf1x/ebfdEFLic=
```

---

### 🤖 AI Services (Necessárias para Chat IA)

**GROQ_API_KEY** (Production, Preview, Development)

```
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
```

**OPENAI_API_KEY** (Production, Preview, Development)

```
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
```

---

### 📱 WhatsApp (Twilio)

**TWILIO_ACCOUNT_SID** (Production, Preview, Development)

```
AC3c1339fa3ecac14202ae6b810019f0ae
```

**TWILIO_AUTH_TOKEN** (Production, Preview, Development)

```
7f111a7e0eab7f58edc27ec7e326bacc
```

**TWILIO_WHATSAPP_NUMBER** (Production, Preview, Development)

```
+18207320393
```

---

### 🔐 Google OAuth & Calendar

**GOOGLE_CLIENT_ID** (Production, Preview, Development)

```
611018665878-enhh9nsf0biovn1s3tlqh55g9ubf31p3.apps.googleusercontent.com
```

**GOOGLE_CLIENT_SECRET** (Production, Preview, Development)

```
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
```

**GOOGLE_CALENDAR_ID** (Production, Preview, Development)

```
primary
```

---

### 💳 Stripe (Pagamentos)

**STRIPE_SECRET_KEY** (Production, Preview, Development)

```
sk_test_51SVcchB3FKITuv4Srjs27HtsHx6Apm6mKBdQGn39WZvCgrRl9aiDB2PkXz2y7R25COVnJOAMBqfhpXHuTVquC8QE00GySQswkO
```

**NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY** (Production, Preview, Development)

```
pk_test_51SVcchB3FKITuv4SNXYFipOV4Bp2jciQ63sK1l32OsaayMIhfAYxTn40MWwGUUO5MTgMpJM9tIVrUXrgJVqn5mPY00LZQTdiCR
```

---

### 🌐 App URLs (Públicas)

**NEXT_PUBLIC_APP_URL** (Production)

```
https://versati-glass.vercel.app
```

**NEXT_PUBLIC_APP_URL** (Preview)

```
https://versati-glass-git-$VERCEL_GIT_COMMIT_REF-leopalhas-projects.vercel.app
```

**NEXT_PUBLIC_BASE_URL** (Production)

```
https://versati-glass.vercel.app
```

**NEXT_PUBLIC_BASE_URL** (Preview)

```
https://versati-glass-git-$VERCEL_GIT_COMMIT_REF-leopalhas-projects.vercel.app
```

**NEXT_PUBLIC_WHATSAPP_NUMBER** (Production, Preview, Development)

```
+5521982536229
```

**NEXT_PUBLIC_COMPANY_WHATSAPP** (Production, Preview, Development)

```
+5521999999999
```

---

### 📦 Storage (Cloudflare R2)

**R2_PUBLIC_URL** (Production, Preview, Development)

```
https://pub-73a8ecec23ab4848ac8b62215e552c38.r2.dev
```

---

### 🔒 Outros

**CRON_SECRET** (Production)

```
h5IWt1KRJQBDUFTKPdByrSBw3MviDEf1x/ebfdEFLic=
```

(Pode usar o mesmo do NEXTAUTH_SECRET ou gerar um novo)

---

## 🚀 Após Adicionar as Variáveis

1. Vá para: https://vercel.com/leopalhas-projects/versati-glass
2. Clique em "Deployments"
3. Clique em "Redeploy" no último deployment
4. Ou rode: `vercel --prod`

---

## ⚠️ IMPORTANTE - Banco de Dados

A variável `DATABASE_URL` atual aponta para `localhost`, que **NÃO funcionará em produção**!

Você precisa:

1. **Criar banco PostgreSQL no Railway**:
   - Acesse: https://railway.app/
   - New Project → Provision PostgreSQL
   - Copie a `DATABASE_URL`

2. **Ou usar outro serviço**:
   - Supabase (gratuito)
   - Neon (gratuito)
   - Render (gratuito)

3. **Atualizar a variável no Vercel**:
   ```
   DATABASE_URL="postgresql://user:pass@host:5432/db?sslmode=require"
   ```

---

## 📝 Checklist

- [ ] Todas as variáveis CRÍTICAS adicionadas
- [ ] DATABASE_URL atualizada para produção (Railway/Supabase/Neon)
- [ ] NEXTAUTH_URL configurada para produção e preview
- [ ] APIs configuradas (Groq, OpenAI, Twilio)
- [ ] Variáveis NEXT*PUBLIC*\* configuradas
- [ ] Redeploy executado após adicionar variáveis

---

**Mantido por**: Claude Code
**Data**: 2024-12-18
