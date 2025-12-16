# 🪝 Git Hooks - Versati Glass

**Data:** 16 Dezembro 2024
**Status:** ✅ Configurado

---

## 📋 Overview

Git hooks automatizados usando **Husky** para garantir qualidade de código antes de commits e pushs.

---

## 🛠️ Ferramentas

### Husky

Gerenciador de Git hooks

### lint-staged

Executa linters apenas em arquivos staged

### Configuração

```json
// package.json
{
  "scripts": {
    "prepare": "husky"
  },
  "lint-staged": {
    "*.{ts,tsx}": ["eslint --fix", "prettier --write"],
    "*.{json,md}": ["prettier --write"]
  }
}
```

---

## 🔍 Hooks Configurados

### 1. Pre-commit

**Arquivo:** `.husky/pre-commit`

**O que faz:**

1. Executa lint-staged (ESLint + Prettier) nos arquivos staged
2. Valida TypeScript (type-check)
3. Executa testes unitários

**Quando:** Antes de cada commit

```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

# Run lint-staged
pnpm lint-staged

# Run type check
pnpm type-check

# Run tests
pnpm test:run
```

**Benefícios:**

- ✅ Código sempre formatado
- ✅ Sem erros de TypeScript
- ✅ Testes passando
- ✅ Previne commits quebrados

---

### 2. Commit-msg

**Arquivo:** `.husky/commit-msg`

**O que faz:**
Valida formato de mensagem de commit seguindo Conventional Commits

**Quando:** Após escrever mensagem de commit

```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

# Validate commit message format
commit_msg=$(cat "$1")

# Pattern: type(scope): message
pattern="^(feat|fix|docs|style|refactor|test|chore)(\([a-z-]+\))?: .+"

if ! echo "$commit_msg" | grep -qE "$pattern"; then
  echo "❌ Invalid commit message format!"
  exit 1
fi
```

**Formato aceito:**

```
type(scope): message

ou

type: message
```

**Tipos válidos:**

- `feat` - Nova funcionalidade
- `fix` - Correção de bug
- `docs` - Alteração na documentação
- `style` - Formatação de código (sem mudança de lógica)
- `refactor` - Refatoração de código
- `test` - Adição ou modificação de testes
- `chore` - Tarefas de manutenção

**Exemplos válidos:**

```bash
git commit -m "feat: add user authentication"
git commit -m "fix(api): resolve database connection issue"
git commit -m "docs: update README with installation steps"
git commit -m "style: format code with prettier"
git commit -m "refactor(auth): simplify login logic"
git commit -m "test: add unit tests for quote service"
git commit -m "chore: update dependencies"
```

**Exemplos inválidos:**

```bash
git commit -m "added feature"           # ❌ Sem tipo
git commit -m "Fix bug"                 # ❌ Tipo em maiúscula
git commit -m "feat:"                   # ❌ Sem mensagem
git commit -m "feature: add login"      # ❌ Tipo inválido
```

---

## 🚀 Instalação

### Primeira vez (já feito)

```bash
# Instalar dependências
pnpm add -D husky lint-staged

# Inicializar Husky
npx husky init

# Hooks já estão configurados
```

### Para novos desenvolvedores

```bash
# Clonar repositório
git clone <repo-url>

# Instalar dependências (vai executar prepare automaticamente)
pnpm install

# Husky está pronto!
```

---

## ⚙️ Configuração

### Desabilitar hooks temporariamente

```bash
# Ignorar pre-commit
git commit -m "feat: urgent fix" --no-verify

# ou
HUSKY=0 git commit -m "feat: urgent fix"
```

**⚠️ Use com cautela! Apenas para emergências.**

### Personalizar lint-staged

```json
// package.json
{
  "lint-staged": {
    "*.{ts,tsx}": [
      "eslint --fix", // Auto-fix ESLint
      "prettier --write", // Format code
      "vitest related --run" // Run related tests
    ],
    "*.{json,md}": [
      "prettier --write" // Format JSON/Markdown
    ],
    "*.css": [
      "stylelint --fix" // Fix CSS issues
    ]
  }
}
```

### Adicionar novos hooks

```bash
# Criar novo hook
npx husky add .husky/pre-push

# Editar conteúdo
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

pnpm test:run
pnpm build
```

---

## 📊 Fluxo de Trabalho

### Commit normal

```bash
# 1. Fazer alterações
vim src/app/page.tsx

# 2. Adicionar ao stage
git add src/app/page.tsx

# 3. Commit
git commit -m "feat: update homepage"
```

**O que acontece:**

1. ✅ ESLint verifica e corrige código
2. ✅ Prettier formata código
3. ✅ TypeScript valida tipos
4. ✅ Testes executam
5. ✅ Mensagem de commit validada
6. ✅ Commit criado

**Se algo falhar:**

```bash
❌ ESLint found errors:
  src/app/page.tsx
    5:1  error  'useState' is not defined  no-undef

Fix errors and try again.
```

---

## 🎯 Benefícios

### Para o time

- ✅ **Código consistente:** Todos seguem mesmo padrão
- ✅ **Menos bugs:** Validações automáticas
- ✅ **Code reviews mais rápidos:** Menos issues de formatação
- ✅ **Histórico limpo:** Commits seguem padrão
- ✅ **CI/CD mais rápido:** Menos builds falhando

### Para o projeto

- ✅ **Qualidade:** Mantém alto padrão de qualidade
- ✅ **Manutenibilidade:** Código mais fácil de manter
- ✅ **Documentação:** Histórico de commits legível
- ✅ **Automação:** Menos trabalho manual
- ✅ **Confiança:** Deploy com segurança

---

## 🔧 Troubleshooting

### Husky não está funcionando

```bash
# Reinstalar hooks
pnpm run prepare

# Verificar permissões (Linux/Mac)
chmod +x .husky/pre-commit
chmod +x .husky/commit-msg
```

### lint-staged muito lento

```json
// Executar apenas ESLint (sem Prettier)
{
  "lint-staged": {
    "*.{ts,tsx}": ["eslint --fix"]
  }
}
```

### Testes falhando no pre-commit

```bash
# Executar testes manualmente
pnpm test:run

# Ver qual teste está falhando
pnpm test

# Corrigir e tentar novamente
git add .
git commit -m "fix: resolve failing test"
```

### Windows line endings (CRLF)

```bash
# Configurar Git para converter automaticamente
git config --global core.autocrlf true

# Normalizar arquivos existentes
git add --renormalize .
```

---

## 📚 Recursos

- [Husky Documentation](https://typicode.github.io/husky/)
- [lint-staged](https://github.com/okonet/lint-staged)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [Git Hooks](https://git-scm.com/book/en/v2/Customizing-Git-Git-Hooks)

---

## 🎓 Exemplos Práticos

### Feature completa

```bash
# Criar branch
git checkout -b feat/user-profile

# Desenvolver
vim src/app/profile/page.tsx

# Commit intermediário
git add src/app/profile/page.tsx
git commit -m "feat(profile): add profile page structure"
# ✅ Hooks executam automaticamente

# Mais desenvolvimento
vim src/app/profile/edit/page.tsx

# Outro commit
git add src/app/profile/edit/page.tsx
git commit -m "feat(profile): add edit profile form"
# ✅ Hooks executam novamente

# Push
git push origin feat/user-profile
```

### Bug fix urgente

```bash
# Criar branch de hotfix
git checkout -b fix/payment-error

# Corrigir
vim src/app/api/payment/route.ts

# Commit
git add src/app/api/payment/route.ts
git commit -m "fix(payment): resolve stripe webhook error"
# ✅ Hooks garantem que fix não quebra nada

# Push
git push origin fix/payment-error
```

### Refactoring

```bash
# Criar branch
git checkout -b refactor/clean-code

# Refatorar múltiplos arquivos
vim src/services/order.ts
vim src/services/quote.ts

# Commit
git add src/services/
git commit -m "refactor(services): extract common logic to utils"
# ✅ Hooks validam que refactoring mantém testes passando

# Push
git push origin refactor/clean-code
```

---

## ⚡ Performance

### Tempo médio por commit

```
lint-staged:     2-5s (apenas arquivos staged)
type-check:      5-10s (full project)
test:run:        10-20s (all tests)
commit-msg:      <1s

Total: ~15-35s por commit
```

### Otimizações

1. **Executar apenas testes relacionados:**

```json
{
  "lint-staged": {
    "*.{ts,tsx}": [
      "vitest related --run" // Apenas testes afetados
    ]
  }
}
```

2. **Cache do TypeScript:**

```bash
# tsc usa cache automaticamente
pnpm type-check  # Mais rápido no segundo run
```

3. **Paralelização:**

```json
{
  "lint-staged": {
    "*.{ts,tsx}": ["eslint --fix", "prettier --write"]
  }
}
// lint-staged executa em paralelo por arquivo
```

---

## ✅ Checklist

- [x] Husky instalado
- [x] lint-staged configurado
- [x] Pre-commit hook criado
- [x] Commit-msg hook criado
- [x] Documentação completa
- [ ] Time treinado
- [ ] Processo documentado no onboarding

---

_Última atualização: 16 Dezembro 2024_
