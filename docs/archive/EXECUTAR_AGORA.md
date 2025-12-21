# 🚀 EXECUTAR AGORA - Setup Completo Versati Glass

## ⚡ Guia Rápido - Siga estes passos na ordem

### ✅ PASSO 1: Setup Railway (PostgreSQL)

Abra o terminal e execute:

```bash
setup-railway.bat
```

**O que este script faz:**

1. ✅ Faz login no Railway (vai abrir o browser)
2. ✅ Cria projeto "versatiglass"
3. ✅ Provisiona PostgreSQL
4. ✅ Obtém DATABASE_URL e salva em `railway-vars.json`
5. ✅ Executa migrations no banco
6. ✅ (Opcional) Executa seed inicial

**Tempo estimado:** 2-3 minutos

---

### ✅ PASSO 2: Configurar Variáveis de Ambiente na Vercel

Depois que o Railway estiver pronto, execute:

```bash
setup-vercel-complete.bat
```

**O que este script faz:**

1. ✅ Adiciona DATABASE_URL (você vai colar do railway-vars.json)
2. ✅ Adiciona todas as 20+ variáveis de ambiente automaticamente
3. ✅ Faz redeploy em produção
4. ✅ Testa a aplicação

**Tempo estimado:** 3-5 minutos

---

### ✅ PASSO 3: Verificar Deploy

Acesse: **https://versati-glass.vercel.app**

Teste:

- [ ] Homepage carrega
- [ ] Login/Registro funciona
- [ ] Chat IA responde
- [ ] Upload de imagem funciona
- [ ] Wizard de orçamento completo

---

## 📋 Checklist Rápido

```
[ ] 1. Executei setup-railway.bat
[ ] 2. Railway criou o banco PostgreSQL
[ ] 3. Arquivo railway-vars.json foi gerado
[ ] 4. Migrations executadas com sucesso
[ ] 5. Executei setup-vercel-complete.bat
[ ] 6. Variáveis de ambiente adicionadas (20+)
[ ] 7. Deploy em produção concluído
[ ] 8. Aplicação acessível em versatiglass.vercel.app
[ ] 9. Login/Registro funcionando
[ ] 10. Chat IA respondendo
```

---

## 🆘 Se algo der errado

### Erro no Railway:

```bash
# Ver logs
railway logs

# Ver variáveis
railway variables

# Relink ao projeto
railway link
```

### Erro na Vercel:

```bash
# Ver logs
vercel logs

# Ver variáveis configuradas
vercel env ls

# Redeploy manual
vercel --prod
```

### Erro nas Migrations:

```bash
# Executar migrations manualmente
railway run pnpm prisma migrate deploy

# Ver status do banco
railway run pnpm prisma migrate status

# Abrir Prisma Studio
railway run pnpm db:studio
```

---

## 📝 Arquivos Importantes

Após executar os scripts, você terá:

- ✅ `railway-vars.json` - Variáveis do Railway (DATABASE_URL)
- ✅ `.env.railway` - Variáveis em formato .env
- ✅ Banco PostgreSQL em produção no Railway
- ✅ Aplicação deployada na Vercel
- ✅ Todas as variáveis de ambiente configuradas

---

## 🎯 Fluxo Completo em 3 Comandos

```bash
# 1. Setup Railway (PostgreSQL)
setup-railway.bat

# 2. Setup Vercel (Variáveis + Deploy)
setup-vercel-complete.bat

# 3. Testar
start https://versati-glass.vercel.app
```

**Pronto! 🚀**

---

## 🔧 Configuração Manual (se preferir)

### Opção A: Railway UI

1. Acesse: https://railway.app/
2. Dashboard → New Project → Provision PostgreSQL
3. Settings → Connect → Copie DATABASE_URL
4. Use no setup-vercel-complete.bat

### Opção B: Vercel UI

1. Acesse: https://vercel.com/leopalhas-projects/versati-glass/settings/environment-variables
2. Siga as instruções em `VERCEL_ENV_SETUP.md`
3. Adicione cada variável manualmente
4. Redeploy via Dashboard

---

## 📞 Links Úteis

**Railway:**

- Dashboard: https://railway.app/dashboard
- Documentação: https://docs.railway.app/

**Vercel:**

- Projeto: https://vercel.com/leopalhas-projects/versati-glass
- Env Vars: https://vercel.com/leopalhas-projects/versati-glass/settings/environment-variables
- Deployments: https://vercel.com/leopalhas-projects/versati-glass/deployments

**Aplicação:**

- Production: https://versati-glass.vercel.app
- Admin: https://versati-glass.vercel.app/admin/login
- Portal: https://versati-glass.vercel.app/portal

---

## ⏱️ Tempo Total Estimado

- Setup Railway: **2-3 minutos**
- Setup Vercel: **3-5 minutos**
- Deploy & Teste: **2-3 minutos**

**Total: ~10 minutos** ⚡

---

## 🎉 Após Concluir

Sua aplicação estará:

- ✅ Deployada em produção
- ✅ Com banco PostgreSQL configurado
- ✅ Com todas as integrações ativas
- ✅ Pronta para receber usuários!

**Próximos passos:**

1. Configurar webhooks (Twilio, Stripe)
2. Adicionar domínio customizado (opcional)
3. Configurar monitoring
4. Testar todos os fluxos

---

**Comece agora:** Execute `setup-railway.bat` no terminal! 🚀
