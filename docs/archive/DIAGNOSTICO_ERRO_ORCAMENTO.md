# 🔍 Diagnóstico: Erro de Criação de Orçamento

## Situação Atual

**Erro Reportado:**

```
POST http://localhost:3000/api/quotes 500 (Internal Server Error)
[QUOTE SUBMIT ERROR] Error: Erro ao criar orcamento
```

**Local:** `step-final-summary.tsx:106`

## ✅ O que JÁ FUNCIONA

1. **API Backend - 100% Funcional**
   - ✅ Teste direto com `node test-quote-creation.mjs` → **200 OK**
   - ✅ Quote criado com sucesso: `ORC-2025-0001`
   - ✅ Banco de dados acessível
   - ✅ Validação Zod funcionando
   - ✅ Criação de usuário funcionando

2. **Banco de Dados - OK**
   - ✅ 2 quotes já criadas
   - ✅ Todas as tabelas existem
   - ✅ Conexão estável

## ❓ Por que FUNCIONA no teste mas FALHA no browser?

A API funciona perfeitamente quando testada diretamente, mas falha quando o usuário clica em "Enviar Orçamento" no wizard. Isso significa que **o problema está nos dados sendo enviados pelo frontend**.

## 🎯 Ferramentas de Diagnóstico Criadas

### 1. Ferramenta de Debug no Browser

**Como usar:**

1. Abra o navegador em `http://localhost:3000/debug-quote.html`
2. Clique em "📊 Carregar Estado do Store"
3. Clique em "✅ Validar Dados"
4. Clique em "🧪 Simular Envio"

Esta ferramenta vai:

- ✅ Mostrar exatamente o que está no carrinho
- ✅ Validar se todos os campos obrigatórios estão preenchidos
- ✅ Identificar problemas (medidas faltando, dados inválidos, etc.)
- ✅ Simular o envio exatamente como o wizard faz
- ✅ Mostrar o erro exato que a API retorna

### 2. Teste de API Direto

```bash
node test-quote-creation.mjs
```

Este teste **já passou**, confirmando que a API está funcionando.

### 3. Teste de Tabela do Banco

```bash
node test-quote-table.mjs
```

Este teste **já passou**, confirmando que o banco está OK.

## 🔍 Possíveis Causas do Erro

### Causa #1: Dados do Cliente Incompletos (MAIS PROVÁVEL)

**Sintomas:**

- Campo obrigatório vazio
- Email ou telefone em formato inválido
- Estado sem 2 letras (ex: "R" ao invés de "RJ")
- CEP mal formatado

**Como verificar:**

1. Use a ferramenta de debug: `http://localhost:3000/debug-quote.html`
2. Procure por mensagens como:
   - ❌ Cliente: "state" vazio
   - ❌ Email inválido
   - ❌ Estado inválido (deve ter 2 letras)

**Como corrigir:**

- O formulário de dados do cliente tem validação, mas pode estar permitindo valores inválidos
- Verifique se todos os campos estão preenchidos antes de avançar

### Causa #2: Items com Medidas Inválidas

**Sintomas:**

- `width` ou `height` undefined/null/0
- Cálculo de área resultando em NaN
- Preços (unitPrice/totalPrice) com valor NaN

**Como verificar:**

1. Use a ferramenta de debug
2. Procure por mensagens como:
   - ❌ Item 1: Largura ausente
   - ❌ Item 1: Altura ausente
   - ❌ Item 1: Área = NaN

**Como corrigir:**

- Certifique-se de preencher largura e altura para todos os itens
- Para categoria SERVICOS, medidas são opcionais

### Causa #3: Erro no Servidor (500)

**Por que 500 e não 400?**

- Erro 400 = Validação falhou (dados inválidos)
- Erro 500 = Erro interno do servidor

**Possíveis causas de erro 500:**

1. Erro ao criar usuário duplicado
2. Erro de relacionamento no banco de dados
3. Erro em algum middleware
4. Erro na notificação WhatsApp (improvável, pois é fire-and-forget)

## 📋 Passo a Passo para Resolver

### Etapa 1: Capturar o Erro Real

**No Browser (Chrome/Edge/Firefox):**

1. Abra o DevTools (F12)
2. Vá para aba **Console**
3. Vá para aba **Network**
4. Tente criar um orçamento até aparecer o erro
5. Na aba Network, clique na requisição `POST /api/quotes` (estará em vermelho)
6. Copie:
   - **Request Payload** (na aba Payload)
   - **Response** (na aba Response ou Preview)
   - **Status Code**

**No Terminal onde está rodando `pnpm dev`:**

1. Procure por linhas com `[API /quotes POST]` ou `error`
2. Copie TODO o stack trace do erro
3. Procure especialmente por:
   ```
   [API /quotes POST] Validation failed
   [API /quotes POST] Failed to create quote
   ```

### Etapa 2: Usar Ferramenta de Debug

1. **Abra:** `http://localhost:3000/debug-quote.html`
2. **Clique:** "📊 Carregar Estado do Store"
3. **Clique:** "✅ Validar Dados"
4. **Analise:** os erros mostrados em vermelho
5. **Clique:** "🧪 Simular Envio"
6. **Compare:** o erro na ferramenta com o erro no wizard

Se a ferramenta **passar** mas o wizard **falhar**, o problema pode estar em:

- Alguma etapa do wizard modificando os dados
- Algum middleware bloqueando
- Estado do store sendo corrompido

Se a ferramenta também **falhar**, você verá exatamente qual campo está causando o erro.

### Etapa 3: Corrigir o Problema

**Se o erro for de validação (detalhes retornados):**

```json
{
  "error": "Dados invalidos",
  "details": {
    "fieldErrors": {
      "customerEmail": ["Email invalido"],
      "serviceState": ["Estado deve ter 2 caracteres"]
    }
  }
}
```

→ Corrija os campos indicados no formulário

**Se o erro for genérico:**

```json
{
  "error": "Erro ao criar orcamento"
}
```

→ Veja os logs do servidor (terminal) para descobrir a causa raiz

## 🚀 Próximos Passos

### Imediato:

1. ✅ Execute `http://localhost:3000/debug-quote.html`
2. ✅ Identifique qual campo está causando o erro
3. ✅ Capture os logs do servidor quando o erro acontecer

### Se ainda não resolver:

1. Compartilhe comigo:
   - Screenshot da ferramenta de debug mostrando os erros
   - Payload completo que está sendo enviado
   - Response completa da API
   - Logs do servidor (terminal)

2. Ou execute este comando e me envie o resultado:

```bash
# No console do browser (F12 → Console), cole isto:
const store = JSON.parse(localStorage.getItem('versati-quote'))
console.log(JSON.stringify(store.state, null, 2))
```

## 📂 Arquivos Criados

1. **`test-quote-creation.mjs`** - Testa API diretamente (✅ PASSOU)
2. **`test-quote-table.mjs`** - Testa acesso ao banco (✅ PASSOU)
3. **`public/debug-quote.html`** - Ferramenta visual de debug (🎯 USE ESTA!)
4. **`diagnose-store-state.md`** - Guia técnico de diagnóstico
5. **`DIAGNOSTICO_ERRO_ORCAMENTO.md`** - Este arquivo

## 💡 Dica Rápida

Se você está com pressa e quer testar se a API está funcionando:

```bash
# Execute isto:
node test-quote-creation.mjs
```

Se mostrar `✅ SUCCESS! Quote created: ORC-2025-XXXX`, então o problema está 100% nos dados sendo enviados pelo frontend.

Use a ferramenta de debug para descobrir exatamente o que está errado:

```
http://localhost:3000/debug-quote.html
```

---

**Status:** ⏳ Aguardando você executar a ferramenta de debug e compartilhar o resultado

**Backend:** ✅ Funcionando perfeitamente
**Banco de Dados:** ✅ OK
**Frontend:** ❓ Aguardando diagnóstico
