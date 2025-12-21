# 📅 CONFIGURAR GOOGLE CALENDAR - PASSO A PASSO

## ✅ PARTE 1: OAuth CONCLUÍDO!

As credenciais do OAuth foram atualizadas no `.env`:

- ✅ Client ID: 326750104611-ej8pmihco1kmlr96ij165ocbcdrcj7qh.apps.googleusercontent.com
- ✅ Client Secret: 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

---

## 📋 PARTE 2: GOOGLE CALENDAR SERVICE ACCOUNT

Agora vamos configurar o Calendar para agendamentos automáticos.

### Passo 1: Ir para Service Accounts

1. **No Google Cloud Console**, acesse:

   ```
   Menu (☰) → IAM e Admin → Contas de serviço
   ```

   **OU acesse direto este link:**

   ```
   https://console.cloud.google.com/iam-admin/serviceaccounts
   ```

2. **Certifique-se** de estar no projeto correto (mesmo projeto onde criou o OAuth)

### Passo 2: Criar Service Account

1. Clique no botão **"+ CRIAR CONTA DE SERVIÇO"** (no topo)

2. **Preencha o formulário:**

   **Nome da conta de serviço:**

   ```
   Versati Glass Calendar
   ```

   **ID da conta de serviço:** (vai gerar automaticamente)

   ```
   versati-glass-calendar
   ```

   **Descrição da conta de serviço:**

   ```
   Service Account para gerenciar calendário de agendamentos da Versati Glass
   ```

3. Clique em **"CRIAR E CONTINUAR"**

4. **Etapa 2 (Conceder acesso):**
   - **PULE ESTA ETAPA** - Não precisa dar nenhuma função
   - Clique em **"CONTINUAR"**

5. **Etapa 3 (Conceder acesso aos usuários):**
   - **PULE ESTA ETAPA** também
   - Clique em **"CONCLUIR"**

### Passo 3: Criar Chave JSON

1. **Na lista de Service Accounts**, clique na conta que você acabou de criar
   - Deve aparecer algo como: `versati-glass-calendar@seu-projeto.iam.gserviceaccount.com`

2. Clique na aba **"CHAVES"** (Keys) no topo

3. Clique em **"ADICIONAR CHAVE"** → **"Criar nova chave"**

4. **Tipo de chave:** Selecione **JSON**

5. Clique em **"CRIAR"**

6. **Um arquivo JSON será baixado automaticamente**
   - Nome tipo: `seu-projeto-abc123.json`
   - **GUARDE ESSE ARQUIVO!**

7. **Abra o arquivo JSON** em um editor de texto (Notepad, VSCode, etc.)

8. **Copie estas informações:**
   - `client_email`: O email da service account
   - `private_key`: A chave privada completa

### Passo 4: Ativar Google Calendar API

1. **No Console Google Cloud**, vá em:

   ```
   Menu (☰) → APIs e Serviços → Biblioteca
   ```

   **OU acesse:**

   ```
   https://console.cloud.google.com/apis/library
   ```

2. Na barra de pesquisa, digite: **"Google Calendar API"**

3. Clique na **Google Calendar API**

4. Se não estiver ativada, clique em **"ATIVAR"**

5. Aguarde ativar (leva alguns segundos)

### Passo 5: Compartilhar seu Calendário com a Service Account

1. **Abra o Google Calendar:**

   ```
   https://calendar.google.com
   ```

2. **No lado esquerdo**, encontre **"Meus calendários"**

3. **Passe o mouse** sobre o calendário que quer usar (geralmente o principal)

4. Clique nos **três pontinhos (⋮)** que aparecem

5. Clique em **"Configurações e compartilhamento"**

6. **Role para baixo** até a seção: **"Compartilhar com pessoas ou grupos específicos"**

7. Clique em **"+ Adicionar pessoas ou grupos"**

8. **Cole o email da Service Account**
   - Está no arquivo JSON: campo `client_email`
   - Exemplo: `versati-glass-calendar@projeto-123.iam.gserviceaccount.com`

9. **Permissão:** Selecione **"Fazer alterações em eventos"**

10. Clique em **"Enviar"**

11. **COPIE O ID DO CALENDÁRIO:**
    - Na mesma página de configurações
    - Role até a seção **"Integrar calendário"**
    - Encontre **"ID do calendário"**
    - Copie (geralmente é seu email ou `primary`)

---

## 📝 COLE AS INFORMAÇÕES AQUI

Depois de fazer tudo acima, **cole estas 3 informações**:

### 1. Email da Service Account

```
[COLE AQUI O client_email DO ARQUIVO JSON]
Exemplo: versati-glass-calendar@projeto-123.iam.gserviceaccount.com
```

### 2. ID do Calendário

```
[COLE AQUI O ID DO CALENDARIO]
Exemplo: seu-email@gmail.com ou primary
```

### 3. Private Key (do arquivo JSON)

```
[COLE AQUI O CONTEÚDO COMPLETO DO CAMPO private_key]
Deve começar com: -----BEGIN PRIVATE KEY-----
E terminar com: -----END PRIVATE KEY-----
```

---

## ✅ CHECKLIST

- [ ] Acessei IAM e Admin → Contas de serviço
- [ ] Criei nova Service Account "Versati Glass Calendar"
- [ ] Baixei o arquivo JSON da chave
- [ ] Ativei Google Calendar API
- [ ] Abri Google Calendar
- [ ] Compartilhei calendário com service account email
- [ ] Dei permissão "Fazer alterações em eventos"
- [ ] Copiei ID do calendário
- [ ] Abri o arquivo JSON
- [ ] Copiei client_email, private_key e calendar_id
- [ ] Colei as informações acima

---

**Quando terminar, me envie as 3 informações e vou atualizar o .env automaticamente!**
