# 🔐 CONFIGURAR TELA DE CONSENTIMENTO OAUTH - GOOGLE

## 🎯 PROBLEMA

Você criou o OAuth Client ID, mas precisa configurar a **Tela de Consentimento OAuth** primeiro.

---

## 📋 PASSO A PASSO COMPLETO

### Passo 1: Acessar Tela de Consentimento

1. **No Google Cloud Console**, acesse:

   ```
   APIs e Serviços → Tela de consentimento OAuth
   ```

   **OU acesse direto:**

   ```
   https://console.cloud.google.com/apis/credentials/consent
   ```

### Passo 2: Configurar Tipo de Usuário

Você vai ver duas opções:

#### ✅ ESCOLHA: **Externo (External)**

**Por quê?**

- Permite que qualquer pessoa com conta Google faça login
- Perfeito para um site de vidraçaria aberto ao público
- Não precisa de domínio G Suite/Workspace

**Marque:** ☑️ Externo

**Clique em:** CRIAR

---

### Passo 3: Informações do App (Página 1)

#### ✅ Nome do app

```
Versati Glass
```

#### ✅ E-mail de suporte do usuário

```
[SEU EMAIL - exemplo: leonardo.palha@gmail.com]
```

#### Logo do app (OPCIONAL)

```
Deixe em branco por enquanto
```

#### Domínio do app (OPCIONAL)

```
Deixe em branco por enquanto
```

#### Link da página inicial do aplicativo (OPCIONAL)

```
http://localhost:3000
```

(Quando fizer deploy, mude para seu domínio real)

#### Link da política de privacidade do aplicativo (OPCIONAL)

```
http://localhost:3000/privacidade
```

#### Link dos Termos de Serviço (OPCIONAL)

```
http://localhost:3000/termos
```

#### Domínios autorizados

```
localhost
```

(Quando fizer deploy, adicione: `versatiglass.com.br` ou seu domínio)

#### Informações de contato do desenvolvedor

```
[SEU EMAIL - exemplo: leonardo.palha@gmail.com]
```

**Clique em:** SALVAR E CONTINUAR

---

### Passo 4: Escopos (Página 2)

Esta é a parte mais importante! Aqui você define o que o app pode acessar.

#### ✅ ESCOPOS NECESSÁRIOS PARA O VERSATI GLASS:

**Clique em:** ADICIONAR OU REMOVER ESCOPOS

**Na janela que abrir, MARQUE estes escopos:**

1. **✅ .../auth/userinfo.email**
   - Ver o endereço de e-mail principal da sua Conta do Google
   - **OBRIGATÓRIO** - Precisamos do email para criar conta

2. **✅ .../auth/userinfo.profile**
   - Ver suas informações pessoais, incluindo aquelas que você disponibilizou publicamente
   - **OBRIGATÓRIO** - Precisamos de nome e foto do perfil

3. **✅ openid**
   - Autentique-se com sua Conta do Google
   - **OBRIGATÓRIO** - Para login funcionar

#### 🔍 COMO ENCONTRAR ESTES ESCOPOS:

Na janela de seleção de escopos:

1. Use o campo de busca e digite: `userinfo.email`
2. Marque o checkbox: `.../auth/userinfo.email`

3. Digite: `userinfo.profile`
4. Marque o checkbox: `.../auth/userinfo.profile`

5. Digite: `openid`
6. Marque o checkbox: `openid`

**Clique em:** ATUALIZAR (no final da janela de escopos)

**Depois clique em:** SALVAR E CONTINUAR

---

### Passo 5: Usuários de teste (Página 3)

#### 🎯 PARA DESENVOLVIMENTO:

**Adicione usuários de teste** (enquanto o app está em modo "Testing"):

**Clique em:** + ADICIONAR USUÁRIOS

**Adicione estes emails:**

```
leonardo.palha@gmail.com
[Seu email pessoal]
[Emails de quem vai testar o sistema]
```

**Por quê?**

- Em modo "Testing", só esses emails podem fazer login com Google
- Depois que publicar, qualquer pessoa pode usar

**Clique em:** ADICIONAR

**Depois clique em:** SALVAR E CONTINUAR

---

### Passo 6: Resumo (Página 4)

**Apenas revise** as informações e clique em:

**VOLTAR PARA O PAINEL**

---

## ✅ PRONTO!

Agora a Tela de Consentimento OAuth está configurada!

### 🧪 TESTAR AGORA

1. **Reinicie o servidor:**

   ```bash
   # Pressione Ctrl+C para parar
   pnpm dev
   ```

2. **Acesse:**

   ```
   http://localhost:3000/login
   ```

3. **Clique em:** "Continuar com Google"

4. **Selecione sua conta Google**

5. **Deve aparecer a tela de consentimento:**
   - Nome do app: Versati Glass
   - Permissões: Email, Perfil
   - **Clique em:** Continuar

6. **Deve fazer login com sucesso!** ✅

---

## 📊 RESUMO DOS ESCOPOS

| Escopo             | O que faz                      | Por que precisamos     |
| ------------------ | ------------------------------ | ---------------------- |
| `openid`           | Identificação única do usuário | Login básico           |
| `userinfo.email`   | Acesso ao email do usuário     | Criar conta no sistema |
| `userinfo.profile` | Nome e foto do usuário         | Mostrar nome no painel |

---

## ⚠️ MODO TESTING vs PRODUÇÃO

### 🔶 Modo Testing (Atual)

- Só usuários de teste podem fazer login
- Não precisa verificação do Google
- Perfeito para desenvolvimento

### 🟢 Modo Produção (Futuro)

- Qualquer pessoa pode fazer login
- Precisa enviar para verificação do Google
- Quando estiver pronto para lançar

**Para publicar:**

1. Vá em Tela de Consentimento OAuth
2. Clique em "PUBLICAR APLICATIVO"
3. Aguarde verificação do Google (pode levar dias)

---

## ❓ TROUBLESHOOTING

### Erro: "Access blocked: This app's request is invalid"

**Causa:** Tela de consentimento não configurada

**Solução:** Siga os passos acima para configurar

### Erro: "Error 400: redirect_uri_mismatch"

**Causa:** URI de redirecionamento não configurado

**Solução:**

1. Vá em Credenciais → OAuth Client ID
2. Adicione: `http://localhost:3000/api/auth/callback/google`

### Usuário não consegue fazer login

**Causa:** Email não está nos usuários de teste

**Solução:**

1. Vá em Tela de Consentimento OAuth
2. Adicione o email em "Usuários de teste"

---

## ✅ CHECKLIST

- [ ] Acessei Tela de Consentimento OAuth
- [ ] Selecionei "Externo" como tipo de usuário
- [ ] Preenchi nome do app: "Versati Glass"
- [ ] Adicionei meu email de suporte
- [ ] Adicionei escopos: openid, userinfo.email, userinfo.profile
- [ ] Adicionei meu email como usuário de teste
- [ ] Salvei tudo
- [ ] Reiniciei o servidor
- [ ] Testei login com Google
- [ ] Funcionou! 🎉

---

**Depois de configurar, teste o login e me avise se funcionou!**
