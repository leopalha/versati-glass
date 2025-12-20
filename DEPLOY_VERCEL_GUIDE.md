# 🚀 GUIA DE DEPLOY NO VERCEL

## Status Atual

- ✅ **Código enviado para Vercel**
- ⚠️ **Build falhou** - Falta configurar variáveis de ambiente
- 🔗 **URL provisória:** https://versati-glass-3xhk21bic-leopalhas-projects.vercel.app

## 📋 PRÓXIMOS PASSOS

### 1. Configurar Variáveis de Ambiente no Vercel

Acesse o dashboard do Vercel:

1. Vá para: https://vercel.com/leopalhas-projects/versati-glass
2. Clique em **"Settings"** (configurações)
3. Clique em **"Environment Variables"** no menu lateral

### 2. Adicionar as seguintes variáveis:

#### **DATABASE (OBRIGATÓRIO)**

```
DATABASE_URL=<sua_url_do_railway_postgres>
```

#### **AUTH (OBRIGATÓRIO)**

```
NEXTAUTH_URL=https://versati-glass.vercel.app
NEXTAUTH_SECRET=<seu_secret_aleatorio>
```

Para gerar o secret:

```bash
openssl rand -base64 32
```

#### **GOOGLE AUTH (se usar)**

```
GOOGLE_CLIENT_ID=<seu_google_client_id>
GOOGLE_CLIENT_SECRET=<seu_google_secret>
```

#### **RESEND EMAIL (OBRIGATÓRIO para emails)**

```
RESEND_API_KEY=<sua_chave_resend>
RESEND_FROM_EMAIL=<seu_email@dominio.com>
```

#### **ANTHROPIC/GROQ (para IA)**

```
ANTHROPIC_API_KEY=<sua_chave_anthropic>
GROQ_API_KEY=<sua_chave_groq>
```

#### **TWILIO (WhatsApp - opcional)**

```
TWILIO_ACCOUNT_SID=<seu_twilio_sid>
TWILIO_AUTH_TOKEN=<seu_twilio_token>
TWILIO_PHONE_NUMBER=<seu_numero>
```

#### **OUTRAS (opcionais)**

```
UPLOADTHING_SECRET=<se_usar_uploadthing>
UPLOADTHING_APP_ID=<se_usar_uploadthing>
STRIPE_SECRET_KEY=<se_usar_stripe>
STRIPE_PUBLISHABLE_KEY=<se_usar_stripe>
```

### 3. Executar Migration no Banco

Após configurar as variáveis, execute a migration:

**Opção A - Via Vercel CLI:**

```bash
vercel env pull .env.local
npx prisma migrate deploy
```

**Opção B - Via Railway (recomendado):**

```bash
railway run npx prisma migrate deploy
```

### 4. Fazer Redeploy

Após adicionar as variáveis de ambiente:

1. Volte para a aba **"Deployments"**
2. Clique nos 3 pontinhos do último deploy
3. Clique em **"Redeploy"**

OU via CLI:

```bash
vercel --prod
```

## ✅ CHECKLIST DE DEPLOY

- [ ] Variáveis de ambiente configuradas no Vercel
- [ ] Migration executada no banco de produção
- [ ] Redeploy realizado
- [ ] Site funcionando na URL de produção
- [ ] Teste de login funcionando
- [ ] Teste de criação de orçamento
- [ ] **Teste do sistema de fornecedores** (/admin/fornecedores)

## 🔧 SOLUÇÃO DE PROBLEMAS

### Erro: "Can't reach database server"

- ✅ Verifique se `DATABASE_URL` está configurado
- ✅ Teste a conexão do Railway
- ✅ Certifique-se que o Railway permite conexões externas

### Erro: "NEXTAUTH_URL is not defined"

- ✅ Adicione `NEXTAUTH_URL` nas variáveis de ambiente
- ✅ Use a URL de produção (https://seu-dominio.vercel.app)

### Erro: "Dynamic server usage"

- ✅ **Normal** - Essas páginas usam auth e dados dinâmicos
- ✅ Não atrapalha o funcionamento em runtime

## 📍 URLS IMPORTANTES

- **Dashboard Vercel:** https://vercel.com/leopalhas-projects/versati-glass
- **URL Produção:** https://versati-glass.vercel.app (ou seu domínio customizado)
- **Railway Database:** https://railway.app (seu projeto)

## 🎯 APÓS DEPLOY BEM-SUCEDIDO

1. **Testar Sistema de Fornecedores:**
   - Acesse: https://seu-dominio.vercel.app/admin/fornecedores
   - Crie um fornecedor de teste
   - Teste o fluxo de envio de cotação

2. **Configurar Domínio Customizado (opcional):**
   - Settings → Domains → Add Domain
   - Adicione seu domínio (ex: versatiglass.com.br)

3. **Monitorar Logs:**
   - Deployments → Último deploy → View Function Logs
   - Verificar se há erros em runtime

## 💡 DICA PRO

Use o arquivo `.env.local` que você já tem localmente como referência para as variáveis de ambiente. Copie os valores para o Vercel mantendo os mesmos nomes.

---

**Criado por:** Claude Code Agent
**Data:** 19 Dezembro 2024
**Status:** ⏳ Aguardando configuração de variáveis de ambiente
