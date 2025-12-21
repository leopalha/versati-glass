# Solução: Erro Turbopack - Privilégios de Symlink

## ❌ Erro Completo:

```
FATAL: An unexpected Turbopack error occurred.
Error [TurbopackInternalError]: create symlink to ../../../node_modules/.pnpm/...
Caused by:
- O cliente não tem o privilégio necessário. (os error 1314)
```

## 🔧 Soluções (em ordem de preferência)

### ✅ Solução 1: Executar PowerShell como Administrador (RECOMENDADO)

1. Feche o terminal atual
2. Clique com botão direito no **Windows Terminal** ou **PowerShell**
3. Selecione **"Executar como administrador"**
4. Navegue até o projeto:
   ```powershell
   cd "D:\VERSATI GLASS"
   ```
5. Execute normalmente:
   ```powershell
   pnpm run dev
   ```

**Por que funciona?**

- Administradores têm privilégio para criar symlinks no Windows
- Turbopack precisa de symlinks para otimização de módulos

---

### ✅ Solução 2: Limpar Cache e Reinstalar

Execute na ordem:

```powershell
# 1. Parar qualquer processo Node.js rodando
# (Ctrl+C se houver)

# 2. Limpar cache do Next.js
Remove-Item -Recurse -Force .next

# 3. Limpar node_modules
Remove-Item -Recurse -Force node_modules

# 4. Limpar cache do pnpm
pnpm store prune

# 5. Reinstalar dependências
pnpm install

# 6. Tentar novamente
pnpm run dev
```

---

### ✅ Solução 3: Desabilitar Turbopack Temporariamente

**Opção A: Via Script PowerShell**

```powershell
.\dev-no-turbo.ps1
```

**Opção B: Via Comando Direto**

```powershell
$env:TURBOPACK = "0"
pnpm run dev
```

**Opção C: Criar arquivo .env.local**

```bash
# Adicione ao .env.local
TURBOPACK=0
```

⚠️ **Desvantagem**: Desenvolvimento será mais lento sem Turbopack

---

### ✅ Solução 4: Habilitar Modo Desenvolvedor no Windows

Isso permite criar symlinks sem ser administrador:

1. Abra **Configurações** do Windows
2. Vá em **Atualização e Segurança** > **Para desenvolvedores**
3. Ative **Modo de desenvolvedor**
4. Reinicie o computador
5. Tente `pnpm run dev` novamente

---

### ✅ Solução 5: Usar npm ou yarn (alternativa)

Se o problema persistir com pnpm:

```powershell
# Limpar
Remove-Item -Recurse -Force node_modules
Remove-Item -Recurse -Force .next

# Usar npm
npm install
npm run dev

# OU usar yarn
yarn install
yarn dev
```

---

## 🎯 Solução Recomendada para Produção

Para deploy (Vercel, Netlify, Railway):

✅ **Não há problema** - Os servidores já têm privilégios necessários
✅ Build funciona normalmente: `pnpm run build`
✅ Produção não usa Turbopack (apenas dev)

---

## 📝 Scripts Disponíveis

Adicionei script helper para desenvolvimento:

```powershell
# Desenvolvimento com Turbopack (padrão - requer admin)
pnpm run dev

# Desenvolvimento SEM Turbopack (não requer admin)
.\dev-no-turbo.ps1
```

---

## 🔍 Verificar se Funcionou

Quando iniciar corretamente, você verá:

```
▲ Next.js 16.1.0-canary.12
- Local:         http://localhost:3000
- Network:       http://172.21.192.1:3000
✓ Starting...
✓ Ready in 2.3s
```

Sem mensagens de erro de symlink.

---

## 💡 Dica Extra

Se precisar desenvolver frequentemente:

1. **Configure um atalho** do PowerShell que sempre abre como Admin
2. OU **Use WSL2** (Linux no Windows) - não tem esse problema
3. OU **Use Modo Desenvolvedor** do Windows (Solução 4)

---

**Status**: Este é um problema conhecido do Windows + pnpm + Turbopack
**Referência**: https://github.com/vercel/next.js/discussions/48324
