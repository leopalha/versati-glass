# 🗄️ ADICIONAR POSTGRESQL NO RAILWAY - 2 MINUTOS

## ✅ JÁ FOI FEITO

- ✅ Projeto "versati-glass" criado no Railway
- ✅ URL: https://railway.com/project/c779d035-e75a-4ef7-a171-224525270b7e

## 📋 PRÓXIMO PASSO: Adicionar PostgreSQL

### OPÇÃO 1: Via Dashboard (RECOMENDADO - 1 MINUTO)

1. **Abra o projeto:**
   https://railway.com/project/c779d035-e75a-4ef7-a171-224525270b7e

2. **Clique em "New Service" (botão roxo)**

3. **Selecione "Database"**

4. **Escolha "PostgreSQL"**

5. **Aguarde ~30 segundos** (Railway cria automaticamente)

6. **Clique no serviço PostgreSQL criado**

7. **Vá na aba "Variables"**

8. **Copie o valor de `DATABASE_URL`** (algo como):

   ```
   postgresql://postgres:senha@região.railway.app:5432/railway
   ```

9. **Volte ao terminal e execute:**
   ```powershell
   vercel env add DATABASE_URL production
   # Cole a URL quando solicitado
   ```

---

### OPÇÃO 2: Via CLI (se preferir)

O comando interativo está esperando. Você pode:

1. Pressionar ENTER para confirmar "Database"
2. O Railway criará o PostgreSQL automaticamente

Mas a Opção 1 é mais visual e confiável.

---

## ⏭️ APÓS ADICIONAR DATABASE_URL

Execute estes comandos finais:

```powershell
# 1. Executar migration
railway run npx prisma migrate deploy

# 2. Redeploy no Vercel
vercel --prod --force

# 3. Testar
# Acesse: https://versati-glass.vercel.app/admin
```

---

## 🎯 RESUMO DO PROGRESSO

```
✅ Projeto Railway criado
✅ 18 variáveis configuradas no Vercel
⏳ Falta: Adicionar PostgreSQL + DATABASE_URL
⏳ Depois: Migration + Redeploy

Tempo restante: ~3 minutos
```

---

**Me avise quando tiver copiado a DATABASE_URL!**
