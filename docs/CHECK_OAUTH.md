# 🔍 Verificação Necessária - Google OAuth

## Problema Identificado:

A URL do NextAuth estava incorreta: `vercel.app` ao invés de `versatiglass.com.br`

## ✅ Correções Aplicadas:

1. NEXTAUTH_URL atualizada para: `https://versatiglass.com.br`
2. Redeploy em andamento

## 🔧 Próximo Passo MANUAL (Google Console):

Você precisa atualizar a URI de redirecionamento no Google Cloud Console:

### 1. Acesse:

https://console.cloud.google.com/apis/credentials

### 2. Selecione o projeto "Versati Glass"

### 3. Clique no OAuth 2.0 Client ID:

`326750104611-ej8pmihco1kmlr96ij165ocbcdrcj7qh.apps.googleusercontent.com`

### 4. Em "Authorized redirect URIs", adicione/atualize:

```
https://versatiglass.com.br/api/auth/callback/google
```

### 5. IMPORTANTE - Remova ou mantenha apenas:

- ❌ `https://versati-glass.vercel.app/api/auth/callback/google` (REMOVER)
- ✅ `https://versatiglass.com.br/api/auth/callback/google` (MANTER)
- ✅ `http://localhost:3000/api/auth/callback/google` (MANTER para dev)

### 6. Clique em "SAVE"

## 🎯 Após salvar:

O login do Google funcionará corretamente em `versatiglass.com.br/login`

## ⏱️ Tempo Estimado:

2 minutos
