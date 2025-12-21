# 🔗 CONFIGURAR REPOSITÓRIO REMOTO GIT

## 🎯 OBJETIVO

Conectar seu projeto ao GitHub para que o Vercel faça deploy automático quando você fizer push.

---

## 📋 PASSO A PASSO

### OPÇÃO 1: Criar Repositório no GitHub (RECOMENDADO)

#### 1. Criar repositório no GitHub

1. Acesse: https://github.com/new
2. **Repository name:** `versati-glass`
3. **Description:** `Sistema completo de gestão para Versati Glass`
4. **Visibility:** Private (recomendado)
5. ✅ **NÃO** marque "Add a README file"
6. ✅ **NÃO** marque "Add .gitignore"
7. ✅ **NÃO** marque "Choose a license"
8. Clique em **"Create repository"**

#### 2. Adicionar remote ao projeto local

Copie a URL SSH ou HTTPS que aparece na página do repositório criado.

**Se usar HTTPS (mais fácil):**

```powershell
git remote add origin https://github.com/SEU_USUARIO/versati-glass.git
git branch -M main
git push -u origin main
```

**Se usar SSH (mais seguro):**

```powershell
git remote add origin git@github.com:SEU_USUARIO/versati-glass.git
git branch -M main
git push -u origin main
```

#### 3. Fazer push dos commits

```powershell
git push -u origin main
```

---

### OPÇÃO 2: Usar GitHub CLI (se tiver instalado)

```powershell
# Instalar GitHub CLI (se não tiver)
winget install GitHub.cli

# Fazer login
gh auth login

# Criar repositório e fazer push
gh repo create versati-glass --private --source=. --push
```

---

## 🔐 CONFIGURAR CREDENCIAIS

### Se o Git pedir suas credenciais:

**Para HTTPS:**

- Username: seu usuário do GitHub
- Password: **Personal Access Token** (não a senha)

**Como criar Personal Access Token:**

1. Acesse: https://github.com/settings/tokens
2. Clique em "Generate new token" → "Generate new token (classic)"
3. Nome: `Versati Glass Deploy`
4. Scopes necessários:
   - ✅ `repo` (Full control of private repositories)
5. Clique em "Generate token"
6. **COPIE O TOKEN** (só aparece uma vez!)
7. Use este token como senha no Git

---

## 🚀 CONECTAR VERCEL AO GITHUB

Após fazer push para o GitHub:

### 1. Abrir projeto no Vercel

Acesse: https://vercel.com/leopalhas-projects/versati-glass/settings/git

### 2. Conectar ao repositório

1. Clique em **"Connect Git Repository"**
2. Selecione **GitHub**
3. Autorize o Vercel a acessar seus repositórios
4. Selecione **`versati-glass`**
5. Clique em **"Connect"**

### 3. Configurar Auto Deploy

Na página de configurações:

- ✅ **Production Branch:** `main`
- ✅ **Auto Deploy:** Enabled
- ✅ **Comments on Pull Requests:** Enabled (opcional)

---

## ✅ TESTAR DEPLOY AUTOMÁTICO

Faça uma pequena alteração e teste:

```powershell
# 1. Fazer uma alteração
echo "# Versati Glass" > TEST.md

# 2. Commit
git add TEST.md
git commit -m "test: Testar deploy automático"

# 3. Push
git push

# 4. Verificar no Vercel
# Acesse: https://vercel.com/leopalhas-projects/versati-glass/deployments
# Você verá um novo deployment sendo criado automaticamente!
```

---

## 📊 VANTAGENS DO DEPLOY AUTOMÁTICO

✅ **Push → Deploy:** Cada push para `main` faz deploy automaticamente
✅ **Preview Deploys:** PRs criam deploys de preview
✅ **Rollback fácil:** Pode voltar para qualquer deploy anterior
✅ **Histórico completo:** Todo histórico de deploys no Vercel
✅ **CI/CD integrado:** Testes e builds automáticos

---

## 🔧 COMANDOS ÚTEIS

```powershell
# Ver repositórios remotos configurados
git remote -v

# Adicionar remote
git remote add origin URL_DO_REPOSITORIO

# Mudar URL do remote
git remote set-url origin NOVA_URL

# Remover remote
git remote remove origin

# Ver status
git status

# Ver histórico
git log --oneline -10

# Push para remote
git push origin main

# Pull do remote
git pull origin main
```

---

## 🆘 TROUBLESHOOTING

### Erro: "remote origin already exists"

```powershell
# Remover e adicionar novamente
git remote remove origin
git remote add origin SUA_URL
```

### Erro: "Permission denied (publickey)"

- Você está usando SSH mas não tem chave SSH configurada
- Solução: Use HTTPS ou configure SSH key

### Erro: "Authentication failed"

- Você está usando HTTPS com senha antiga
- Solução: Use Personal Access Token como senha

### Erro ao fazer push

```powershell
# Forçar push (cuidado!)
git push -u origin main --force
```

---

## 📝 PRÓXIMOS PASSOS

Após configurar o remote:

1. ✅ Git remote configurado
2. ✅ Push para GitHub
3. ✅ Conectar Vercel ao GitHub
4. ⏳ Adicionar DATABASE_URL
5. ⏳ Adicionar PostgreSQL no Railway
6. ⏳ Push final → Deploy automático!

---

**COMECE AGORA:** https://github.com/new
