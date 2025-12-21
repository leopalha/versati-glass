# 🔑 Credenciais do Sistema Versati Glass

## 📊 Atualizado em: 19/12/2024

---

## ✅ Credenciais Válidas para Login

### 👨‍💼 Administrador

- **Email:** `admin@versatiglass.com.br`
- **Senha:** `admin123`
- **Role:** ADMIN
- **Status:** ✅ Ativo

### 👤 Cliente Principal

- **Email:** `cliente@versatiglass.com.br`
- **Senha:** `cliente123`
- **Role:** CUSTOMER
- **Status:** ✅ Ativo

### 👤 Cliente Exemplo (antigo)

- **Email:** `cliente@example.com`
- **Senha:** `cliente123`
- **Role:** CUSTOMER
- **Status:** ✅ Ativo

---

## 🔐 Login com Google

O sistema agora suporta login com Google OAuth.

**Ao fazer login pela primeira vez com Google:**

- ✅ Usuário será criado automaticamente no banco de dados
- ✅ Role atribuído: CUSTOMER
- ✅ Email será verificado automaticamente
- ✅ Poderá criar orçamentos imediatamente

---

## 📝 Notas Importantes

1. **Emails sempre em lowercase** - O sistema converte emails para minúsculas
2. **Senha mínima** - 6 caracteres
3. **Google OAuth** - Configurado e funcionando
4. **Rate Limiting** - Em desenvolvimento: 50 orçamentos a cada 5 minutos

---

## 🧪 Para Testes

Usuários de teste sem senha (criados durante testes de categorias):

- joao@test.com
- leonardo.palha@gmail.com
- testeportas@test.com
- testejanelas@test.com
- testecortinas_vidro@test.com
- testepergolados@test.com
- testeferragens@test.com

**Nota:** Estes usuários não podem fazer login (sem senha). Foram criados apenas para testes de criação de orçamentos.

---

## 🔧 Comandos Úteis

### Verificar usuários no sistema:

```bash
node -e "import('@prisma/client').then(async ({ PrismaClient }) => { const p = new PrismaClient(); const users = await p.user.findMany({ select: { email: 1, role: 1 }}); console.log(users); await p.\$disconnect(); })"
```

### Resetar senha de usuário:

```bash
node update-cliente-password.mjs
```

### Testar login admin:

```bash
node test-admin-login.mjs
```

---

**Última atualização:** Correção de Foreign Key Constraint + Google OAuth implementado
