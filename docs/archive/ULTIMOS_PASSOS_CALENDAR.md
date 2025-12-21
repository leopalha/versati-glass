# 📅 ÚLTIMOS 2 PASSOS - GOOGLE CALENDAR

## ✅ JÁ FIZEMOS:

1. ✅ Criamos OAuth Client ID
2. ✅ Criamos Service Account
3. ✅ Baixamos arquivo JSON
4. ✅ Atualizamos .env com as credenciais

---

## 🔧 FALTA FAZER (2 PASSOS RÁPIDOS):

### Passo 1: Ativar Google Calendar API

1. **Acesse:**

   ```
   https://console.cloud.google.com/apis/library
   ```

2. **Certifique-se** de estar no projeto: `gen-lang-client-0921238491`

3. **Na barra de pesquisa**, digite:

   ```
   Google Calendar API
   ```

4. **Clique na** Google Calendar API

5. **Clique em:** `ATIVAR` (ou `ENABLE`)

6. **Aguarde** 5-10 segundos até ativar

---

### Passo 2: Compartilhar seu Calendário com a Service Account

1. **Abra o Google Calendar:**

   ```
   https://calendar.google.com
   ```

2. **No lado esquerdo**, encontre **"Meus calendários"**

3. **Passe o mouse** sobre o calendário principal (geralmente tem seu nome ou "Calendário")

4. **Clique nos 3 pontinhos (⋮)** que aparecem

5. **Clique em:** "Configurações e compartilhamento"

6. **Role para baixo** até a seção:

   ```
   Compartilhar com pessoas ou grupos específicos
   ```

7. **Clique em:** "+ Adicionar pessoas ou grupos"

8. **Cole este email:**

   ```
   versati-glass-calendar@gen-lang-client-0921238491.iam.gserviceaccount.com
   ```

9. **Permissão:** Selecione **"Fazer alterações em eventos"**

10. **Clique em:** "Enviar"

---

## ✅ PRONTO!

Depois desses 2 passos, está tudo configurado!

---

## 🧪 TESTAR AGORA

### Teste 1: Google Calendar

Execute no terminal:

```bash
node test-google-calendar.mjs
```

**Resultado esperado:**

```
✅ Conexão com Google Calendar OK
✅ Evento de teste criado
   ID: abc123xyz
   Link: https://calendar.google.com/calendar/event?eid=...
```

### Teste 2: Google OAuth (Login)

1. **Se o servidor não estiver rodando**, inicie:

   ```bash
   pnpm dev
   ```

2. **Acesse:**

   ```
   http://localhost:3000/login
   ```

3. **Clique em:** "Continuar com Google"

4. **Faça login** com sua conta Google

5. **Deve funcionar!** ✅

---

## ⚠️ LEMBRETE

Se o login com Google pedir para você **adicionar usuário de teste**, vá em:

```
https://console.cloud.google.com/apis/credentials/consent
```

E adicione seu email (`leonardo.palha@gmail.com`) em **"Usuários de teste"**.

---

## 📊 RESUMO DO QUE CONFIGURAMOS HOJE:

### Google OAuth (Login com Google)

- ✅ Client ID: 326750104611-ej8pmihco1kmlr96ij165ocbcdrcj7qh.apps.googleusercontent.com
- ✅ Client Secret: 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
- ✅ Escopos: openid, userinfo.email, userinfo.profile
- ⏳ Falta: Configurar Tela de Consentimento (se ainda não fez)

### Google Calendar (Agendamentos Automáticos)

- ✅ Service Account: versati-glass-calendar@gen-lang-client-0921238491.iam.gserviceaccount.com
- ✅ Private Key: Configurada no .env
- ✅ Calendar ID: primary
- ⏳ Falta: Ativar API
- ⏳ Falta: Compartilhar calendário

---

**Faça os 2 passos acima e depois teste com `node test-google-calendar.mjs`!**
