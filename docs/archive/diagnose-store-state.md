# Diagnóstico do Estado do Quote Store

## Problema Relatado

- **Erro**: `POST http://localhost:3000/api/quotes 500 (Internal Server Error)`
- **Localização**: `step-final-summary.tsx:106`
- **Contexto**: Quando usuário clica em "Enviar Orçamento" na etapa final

## Teste da API Diretamente

✅ **API FUNCIONA CORRETAMENTE**

- Teste direto com `node test-quote-creation.mjs` → **200 OK**
- Quote criado com sucesso: `ORC-2025-0001`
- Isso confirma que o backend está funcionando

## Possíveis Causas do Erro no Browser

### 1. Dados Inválidos no Store

O erro pode estar acontecendo porque:

**a) Items sem medidas (width/height)**

- Na categoria SERVICOS, width/height são opcionais
- Mas o cálculo em `step-final-summary.tsx:66` faz: `area = item.width * item.height`
- Se `width` ou `height` forem `undefined`, isso resultará em `NaN`

**b) Campos obrigatórios faltando no customerData**

- API exige: name, email, phone, street, number, neighborhood, city, state, zipCode
- Se algum campo estiver vazio, a validação Zod falhará

**c) Items com productId inválido**

- Se productId começar com 'custom-', o frontend não envia (linha 135)
- Mas a descrição pode estar vazia

### 2. Estrutura dos Items Enviados

O frontend envia na linha 120-148:

```typescript
items: items.map((item) => {
  const estimate = calculateItemEstimate(item)
  const baseItem: any = {
    description: item.description || `${item.productName} - ${item.width}m x ${item.height}m`,
    specifications: `${item.width}m x ${item.height}m${...}`,
    width: item.width,          // ⚠️ Pode ser undefined
    height: item.height,         // ⚠️ Pode ser undefined
    quantity: item.quantity,
    unitPrice: estimate / item.quantity,  // ⚠️ Pode ser NaN
    totalPrice: estimate,                  // ⚠️ Pode ser NaN
    customerImages: item.images || [],
  }
  // ...
})
```

### 3. Validação do Backend

Backend valida com Zod (route.ts:11-39):

- `width`: `z.number().min(0.01).max(100).optional()`
- `height`: `z.number().min(0.01).max(100).optional()`
- `unitPrice`: `z.number().min(0).max(1000000)`
- `totalPrice`: `z.number().min(0).max(100000000)`

**❌ PROBLEMA IDENTIFICADO**:

- Se `estimate` for `NaN`, então `unitPrice = NaN / quantity = NaN`
- Zod rejeitará `NaN` para campos numéricos
- Isso causaria erro 400 (validação), mas o usuário reportou 500

### 4. Possível Erro 500

Um erro 500 indica erro no servidor, não validação. Possíveis causas:

**a) Erro de Banco de Dados**

- Schema do Prisma pode estar diferente
- Campos obrigatórios faltando
- Relacionamentos quebrados

**b) Erro na criação do usuário (linha 173-187)**

- Se já existir um usuário com mesmo email mas dados conflitantes
- Se validação de email falhar

**c) Erro no WhatsApp notification (linha 268-290)**

- Mas este está em "fire and forget", não deveria bloquear

## Próximos Passos para Diagnóstico

### Para o Usuário Executar:

1. **Abrir o DevTools (F12)** no navegador
2. **Ir para aba Console**
3. **Ir para aba Network**
4. **Tentar criar um orçamento** até chegar no erro
5. **Capturar**:
   - Screenshot do erro no Console
   - Clicar na request `POST /api/quotes` na aba Network
   - Copiar o **Payload** (Request Payload)
   - Copiar a **Response** (mesmo que seja erro)

6. **No terminal onde está rodando `pnpm dev`**:
   - Copiar os logs de erro que aparecem
   - Procurar por linhas com `[API /quotes POST]` ou `error`

### Teste Alternativo:

1. **Abrir** `http://localhost:3000/test-browser-quote.html`
2. **Clicar** no botão "Run Test"
3. **Verificar** se o teste passa ou falha no ambiente do browser

### Verificar Estado do Store:

No console do browser, na página de orçamento, executar:

```javascript
// Extrair estado do localStorage
const store = JSON.parse(localStorage.getItem('versati-quote'))
console.log('Store state:', store)

// Verificar items
console.log('Items:', store.state.items)

// Verificar customerData
console.log('Customer:', store.state.customerData)

// Procurar por problemas
store.state.items.forEach((item, i) => {
  if (!item.width || !item.height) {
    console.warn(`Item ${i} sem medidas:`, item)
  }
  if (!item.description) {
    console.warn(`Item ${i} sem descrição:`, item)
  }
})
```

## Hipóteses Priorizadas

1. **🔥 MAIS PROVÁVEL**: CustomerData incompleto ou inválido
   - Algum campo obrigatório está vazio
   - Email ou telefone em formato inválido
   - Estado sem 2 letras (ex: "R" ao invés de "RJ")

2. **⚠️ PROVÁVEL**: Items com NaN nos preços
   - Width/height undefined causando cálculo errado
   - Validação Zod rejeitando NaN

3. **🤔 POSSÍVEL**: Erro de banco de dados
   - Schema desatualizado
   - Migrations não rodadas
   - Conexão perdida

4. **📋 INVESTIGAR**: Estado do Prisma
   - Rodar `npx prisma db push` para garantir schema atualizado
   - Verificar se todas as tabelas existem
   - Testar conexão com banco

## Solução Temporária

Adicionar tratamento de erro melhor em `step-final-summary.tsx`:

```typescript
const estimate = calculateItemEstimate(item)

// Validar se estimate é válido
if (isNaN(estimate) || !isFinite(estimate)) {
  console.error('Estimate inválido para item:', item)
  throw new Error(`Item "${item.productName}" possui medidas inválidas`)
}
```

E melhorar o log de erro no backend para retornar mais informações.
