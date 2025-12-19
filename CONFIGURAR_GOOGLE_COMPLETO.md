# 🔧 CONFIGURAR GOOGLE OAUTH + CALENDAR - GUIA COMPLETO

**Objetivo:** Configurar novas credenciais Google OAuth e Google Calendar para o projeto Versati Glass

---

## 📋 PARTE 1: GOOGLE OAUTH (Login com Google)

### Passo 1.1: Configurar OAuth Client ID

Você já está na tela certa! Preencha assim:

#### Tipo de aplicativo
```
✅ Aplicativo da Web (Web application)
```

#### Nome
```
Versati Glass - Produção
```
Ou qualquer nome que identifique o projeto.

#### Origens JavaScript autorizadas
Adicione DUAS URLs:

**Para desenvolvimento:**
```
http://localhost:3000
```

**Para produção (quando fizer deploy):**
```
https://seu-dominio.vercel.app
```
ou
```
https://versatiglass.com.br
```

#### URIs de redirecionamento autorizados
Adicione DOIS URIs:

**Para desenvolvimento:**
```
http://localhost:3000/api/auth/callback/google
```

**Para produção (quando fizer deploy):**
```
https://seu-dominio.vercel.app/api/auth/callback/google
```
ou
```
https://versatiglass.com.br/api/auth/callback/google
```

### Passo 1.2: Salvar e Copiar Credenciais

1. Clique em **"CRIAR"**
2. Vai aparecer uma tela com:
   - **ID do cliente** (algo como: `123456789-abc.apps.googleusercontent.com`)
   - **Chave secreta do cliente** (algo como: `GOCSPX-abc123...`)

3. **COPIE ESSES DOIS VALORES!** Você vai precisar deles.

---

## 📋 PARTE 2: GOOGLE CALENDAR SERVICE ACCOUNT

### Passo 2.1: Criar Service Account

1. No Console Google Cloud, vá em:
   ```
   Menu (☰) → IAM e Admin → Contas de serviço
   ```

   Ou acesse direto:
   ```
   https://console.cloud.google.com/iam-admin/serviceaccounts
   ```

2. Clique em **"+ CRIAR CONTA DE SERVIÇO"**

3. Preencha:
   - **Nome:** `Versati Glass Calendar`
   - **ID:** `versati-calendar` (vai gerar automaticamente)
   - **Descrição:** `Service Account para gerenciar calendário de agendamentos`

4. Clique em **"CRIAR E CONTINUAR"**

5. **Pular** a etapa de permissões (não precisa) → Clique **"CONTINUAR"**

6. **Pular** a etapa de acesso de usuários → Clique **"CONCLUIR"**

### Passo 2.2: Criar Chave JSON

1. Na lista de contas de serviço, clique na que você acabou de criar

2. Vá na aba **"CHAVES"** (Keys)

3. Clique em **"ADICIONAR CHAVE"** → **"Criar nova chave"**

4. Selecione **"JSON"**

5. Clique em **"CRIAR"**

6. Um arquivo JSON será baixado automaticamente (tipo: `versati-glass-xxxxxx.json`)

7. **GUARDE ESSE ARQUIVO!** Você vai precisar dele.

### Passo 2.3: Ativar Google Calendar API

1. No Console Google Cloud, vá em:
   ```
   Menu (☰) → APIs e Serviços → Biblioteca
   ```

   Ou acesse:
   ```
   https://console.cloud.google.com/apis/library
   ```

2. Pesquise por: **"Google Calendar API"**

3. Clique na API

4. Clique em **"ATIVAR"** (se ainda não estiver ativada)

### Passo 2.4: Compartilhar Calendário

1. Abra o **Google Calendar** (https://calendar.google.com)

2. No lado esquerdo, encontre **"Meus calendários"**

3. Clique nos **3 pontinhos** ao lado do calendário que quer usar

4. Clique em **"Configurações e compartilhamento"**

5. Role até a seção **"Compartilhar com pessoas ou grupos específicos"**

6. Clique em **"+ Adicionar pessoas ou grupos"**

7. Cole o **email da Service Account**:
   - Você encontra no arquivo JSON baixado, campo `client_email`
   - Exemplo: `versati-calendar@projeto-123.iam.gserviceaccount.com`

8. Permissão: Selecione **"Fazer alterações em eventos"**

9. Clique em **"Enviar"**

10. **COPIE O ID DO CALENDÁRIO:**
    - Na mesma página de configurações
    - Role até **"Integrar calendário"**
    - Copie o **"ID do calendário"**
    - Exemplo: `abc123@group.calendar.google.com` ou `primary`

---

## 📋 PARTE 3: ATUALIZAR .env

Agora vamos atualizar o arquivo `.env` com as novas credenciais:

### Passo 3.1: Abrir o arquivo .env

```bash
# No seu editor, abra:
d:\VERSATI GLASS\.env
```

### Passo 3.2: Atualizar credenciais OAuth

Encontre estas linhas e SUBSTITUA pelos valores que você copiou:

```env
# Google OAuth (Login com Google)
GOOGLE_CLIENT_ID="SEU-ID-DO-CLIENTE.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="SUA-CHAVE-SECRETA"
```

**Exemplo:**
```env
GOOGLE_CLIENT_ID="123456789-abc123def456.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="GOCSPX-abc123xyz789"
```

### Passo 3.3: Atualizar credenciais Calendar

Encontre estas linhas e SUBSTITUA:

```env
# Google Calendar
GOOGLE_CALENDAR_ID="SEU-ID-DO-CALENDARIO"
GOOGLE_SERVICE_ACCOUNT_EMAIL="SEU-EMAIL@projeto.iam.gserviceaccount.com"
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----"
```

**Como preencher:**

1. **GOOGLE_CALENDAR_ID:**
   - Cole o ID do calendário que você copiou
   - Exemplo: `abc123@group.calendar.google.com`
   - Ou use `primary` para seu calendário principal

2. **GOOGLE_SERVICE_ACCOUNT_EMAIL:**
   - Abra o arquivo JSON baixado
   - Copie o valor do campo `client_email`
   - Exemplo: `versati-calendar@projeto-123.iam.gserviceaccount.com`

3. **GOOGLE_PRIVATE_KEY:**
   - Abra o arquivo JSON baixado
   - Copie TODO o conteúdo do campo `private_key`
   - **IMPORTANTE:** Mantenha as aspas duplas e os `\n`
   - Exemplo:
   ```env
   GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEF...\n-----END PRIVATE KEY-----\n"
   ```

### Passo 3.4: Salvar .env

Salve o arquivo `.env` com as novas credenciais.

---

## 📋 PARTE 4: TESTAR CONFIGURAÇÕES

### Teste 4.1: Testar Google OAuth

1. Pare o servidor se estiver rodando (Ctrl+C)

2. Inicie novamente:
   ```bash
   pnpm dev
   ```

3. Acesse:
   ```
   http://localhost:3000/login
   ```

4. Clique em **"Continuar com Google"**

5. Faça login com sua conta Google

6. **Deve funcionar!** Se logar com sucesso, OAuth está OK ✅

### Teste 4.2: Testar Google Calendar

Execute o script de teste:

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

---

## 🔍 VERIFICAÇÃO VISUAL

### Checklist OAuth

- [ ] Criei OAuth Client ID no Google Cloud
- [ ] Adicionei `http://localhost:3000` nas origens autorizadas
- [ ] Adicionei `http://localhost:3000/api/auth/callback/google` nos URIs de redirecionamento
- [ ] Copiei Client ID e Client Secret
- [ ] Atualizei GOOGLE_CLIENT_ID no .env
- [ ] Atualizei GOOGLE_CLIENT_SECRET no .env
- [ ] Testei login com Google no site

### Checklist Calendar

- [ ] Criei Service Account no Google Cloud
- [ ] Baixei arquivo JSON da chave
- [ ] Ativei Google Calendar API
- [ ] Compartilhei calendário com Service Account
- [ ] Copiei ID do calendário
- [ ] Atualizei GOOGLE_CALENDAR_ID no .env
- [ ] Atualizei GOOGLE_SERVICE_ACCOUNT_EMAIL no .env
- [ ] Atualizei GOOGLE_PRIVATE_KEY no .env
- [ ] Executei `node test-google-calendar.mjs`

---

## ❓ TROUBLESHOOTING

### Erro: "redirect_uri_mismatch"

**Causa:** URI de redirecionamento não configurado corretamente

**Solução:**
1. Volte no Google Cloud Console
2. Vá em APIs e Serviços → Credenciais
3. Clique no OAuth Client ID
4. Certifique-se que tem:
   ```
   http://localhost:3000/api/auth/callback/google
   ```
5. Aguarde 5 minutos para propagar
6. Teste novamente

### Erro: "invalid_client"

**Causa:** Client ID ou Secret incorretos

**Solução:**
1. Verifique se copiou corretamente do Google Cloud
2. Verifique se não tem espaços extras no .env
3. Reinicie o servidor: Ctrl+C e `pnpm dev`

### Erro Calendar: "401 Unauthorized"

**Causa:** Service Account não tem acesso ao calendário

**Solução:**
1. Abra Google Calendar
2. Compartilhe o calendário novamente
3. Certifique-se de dar permissão "Fazer alterações em eventos"
4. Aguarde 1-2 minutos
5. Teste novamente

### Erro Calendar: "Invalid private key"

**Causa:** Private key mal formatada no .env

**Solução:**
1. Abra o JSON baixado
2. Copie o campo `private_key` INTEIRO
3. Cole no .env entre aspas duplas
4. Certifique-se que tem `\n` entre as linhas
5. Exemplo correto:
   ```env
   GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nLINHA1\nLINHA2\n-----END PRIVATE KEY-----\n"
   ```

---

## 📝 EXEMPLO COMPLETO .env

```env
# Google OAuth
GOOGLE_CLIENT_ID="123456789-abc123def456.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="GOCSPX-abc123xyz789"

# Google Calendar
GOOGLE_CALENDAR_ID="primary"
GOOGLE_SERVICE_ACCOUNT_EMAIL="versati-calendar@projeto-123.iam.gserviceaccount.com"
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...\n-----END PRIVATE KEY-----\n"
```

---

## ✅ PRÓXIMOS PASSOS

Depois de configurar tudo:

1. ✅ Login com Google funcionando
2. ✅ Calendar criando eventos
3. 🚀 Sistema 100% pronto com todas as integrações!

---

**Precisa de ajuda em algum passo? Me avise e te guio!**
