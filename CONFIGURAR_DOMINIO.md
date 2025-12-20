# 🌐 CONFIGURAR DOMÍNIO www.versatiglass.com.br

## ⚠️ SITUAÇÃO ATUAL

O domínio `versatiglass.com.br` e `www.versatiglass.com.br` já estão atribuídos a **outro projeto** no Vercel.

---

## 🎯 OPÇÕES PARA RESOLVER:

### OPÇÃO 1: Transferir Domínio do Projeto Antigo (RECOMENDADO)

#### Passo 1: Identificar projeto antigo

1. Acesse: https://vercel.com/leopalhas-projects
2. Procure por um projeto que tenha o domínio `versatiglass.com.br`
3. Anote o nome do projeto

#### Passo 2: Remover domínio do projeto antigo

**Via Dashboard:**
1. Abra o projeto antigo
2. Vá em **Settings** → **Domains**
3. Encontre `versatiglass.com.br` e `www.versatiglass.com.br`
4. Clique em **...** → **Remove**
5. Confirme a remoção

**Via CLI:**
```powershell
# Listar todos os projetos
vercel projects ls

# Mudar para o projeto antigo (substitua NOME_PROJETO_ANTIGO)
vercel switch

# Remover domínios
vercel domains rm versatiglass.com.br
vercel domains rm www.versatiglass.com.br
```

#### Passo 3: Adicionar domínio ao projeto novo

```powershell
# Voltar para versati-glass
cd "d:\VERSATI GLASS"

# Adicionar domínios
vercel domains add versatiglass.com.br
vercel domains add www.versatiglass.com.br
```

---

### OPÇÃO 2: Configurar DNS Diretamente

Se preferir manter o projeto antigo mas atualizar DNS:

1. **Deletar o projeto antigo inteiro**:
   ```powershell
   # Listar projetos
   vercel projects ls

   # Deletar projeto antigo
   vercel remove NOME_PROJETO_ANTIGO
   ```

2. **Adicionar domínios ao projeto novo**:
   ```powershell
   vercel domains add versatiglass.com.br
   vercel domains add www.versatiglass.com.br
   ```

---

### OPÇÃO 3: Usar Domínio Vercel Temporário

Enquanto resolve o domínio customizado, o site está disponível em:

```
https://versati-glass.vercel.app
https://versati-glass-9brpvxjxi-leopalhas-projects.vercel.app
```

---

## 📝 CONFIGURAÇÃO DNS (APÓS ADICIONAR DOMÍNIO)

Depois de adicionar o domínio ao projeto, configure no provedor DNS:

### Para versatiglass.com.br (root)
```
Type: A
Name: @
Value: 76.76.21.21
```

### Para www.versatiglass.com.br
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

---

## 🚀 SCRIPT AUTOMATIZADO

Crie um arquivo `transferir-dominio.ps1`:

```powershell
# 1. Listar projetos para encontrar o antigo
vercel projects ls

# 2. Pergunte qual projeto tem o domínio
Write-Host "Qual o nome do projeto antigo com o domínio?" -ForegroundColor Yellow
$oldProject = Read-Host

# 3. Remover domínios do projeto antigo
Write-Host "Removendo domínios do projeto antigo..." -ForegroundColor Yellow
vercel domains rm versatiglass.com.br --scope=$oldProject --yes
vercel domains rm www.versatiglass.com.br --scope=$oldProject --yes

# 4. Adicionar ao projeto novo
Write-Host "Adicionando domínios ao projeto versati-glass..." -ForegroundColor Yellow
vercel domains add versatiglass.com.br
vercel domains add www.versatiglass.com.br

Write-Host "✅ Domínios transferidos!" -ForegroundColor Green
```

---

## ✅ VERIFICAR CONFIGURAÇÃO

Após adicionar os domínios:

```powershell
# Ver domínios do projeto
vercel domains ls

# Ver status do domínio
vercel domains inspect versatiglass.com.br
vercel domains inspect www.versatiglass.com.br
```

---

## 🔍 TROUBLESHOOTING

### Erro: "Domain is already assigned"
- O domínio ainda está em outro projeto
- Remova primeiro do projeto antigo
- Ou delete o projeto antigo completamente

### Domínio não aparece após adicionar
- Aguarde alguns segundos
- Execute: `vercel domains ls` novamente

### SSL não ativa automaticamente
- A Vercel gera SSL automaticamente em ~1 minuto
- Verifique em: Settings → Domains

---

## 📊 COMANDOS ÚTEIS

```powershell
# Listar todos os projetos
vercel projects ls

# Ver domínios de um projeto específico
vercel domains ls --scope=NOME_PROJETO

# Remover domínio
vercel domains rm DOMINIO

# Adicionar domínio
vercel domains add DOMINIO

# Inspecionar domínio
vercel domains inspect DOMINIO
```

---

## 🎯 PRÓXIMO PASSO

**Execute agora:**

```powershell
# 1. Listar projetos para encontrar o antigo
vercel projects ls
```

Depois me diga qual projeto tem o domínio e eu ajudo a transferir!

---

**Criado:** 19 Dezembro 2024
**Sistema:** Versati Glass
**Objetivo:** Transferir domínio para novo deploy
