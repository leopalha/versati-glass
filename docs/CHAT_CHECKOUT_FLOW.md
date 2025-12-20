# Fluxo: Chat → Checkout → Persistência

## 📋 Resumo do Fluxo

Este documento explica como funciona o fluxo completo desde o chat assistido até o checkout, e onde as conversas ficam armazenadas.

## 🔄 Fluxo Completo

### 1. Cliente Inicia Orçamento no Chat

- Cliente acessa o site e abre o chat assistido
- IA coleta informações sobre produtos, medidas, etc.
- Progresso é mostrado em tempo real (0-100%)

### 2. Cliente Clica em "Ir para Checkout"

- **Quando aparece**: Quando `quoteProgress >= 40%` (produto e medidas definidos)
- **O que acontece**:
  1. ✅ Envia mensagem para IA: "Quero finalizar meu orçamento e ir para o checkout"
  2. ✅ IA responde com mensagem de confirmação
  3. ✅ Aguarda 2 segundos para usuário ler resposta
  4. ✅ **Minimiza o chat automaticamente**
  5. ✅ **Redireciona para `/orcamento`** (página de checkout)

### 3. Cliente no Checkout

- Cliente preenche dados de contato
- Cliente escolhe produtos do catálogo
- Cliente agenda instalação
- Cliente finaliza orçamento

### 4. Cliente Tem Dúvida Durante Checkout

- ✅ Chat permanece disponível (minimizado)
- ✅ Cliente pode expandir e fazer perguntas
- ✅ IA mantém contexto da conversa anterior
- ✅ Após esclarecer, cliente pode voltar ao checkout

## 💾 Onde as Conversas Ficam Salvas

### Database: `AiConversation` (Prisma Schema)

```prisma
model AiConversation {
  id                 String   @id @default(uuid())
  sessionId          String   @unique

  // Informações do Cliente
  customerName       String?
  customerEmail      String?
  customerPhone      String?

  // Contexto do Orçamento
  quoteContext       Json?     // Dados do orçamento em progresso

  // Vinculação com Quote final
  quoteId            String?   @unique
  quote              Quote?    @relation(fields: [quoteId], references: [id])

  // Status da conversa
  status             String    @default("ACTIVE")
  // ACTIVE | QUOTE_GENERATED | ABANDONED | CLOSED

  // Mensagens
  messages           AiMessage[]

  // Timestamps
  createdAt          DateTime  @default(now())
  updatedAt          DateTime  @updatedAt
  lastMessageAt      DateTime  @default(now())
}
```

### Acesso no Admin

#### 1. **Conversas IA** (`/admin/conversas-ia`)

- ✅ Mostra todas as conversas do chat do site
- ✅ Filtros por status:
  - **Ativas**: Conversas em andamento
  - **Com Orçamento**: Conversas que geraram orçamento
  - **Abandonadas**: Conversas sem conclusão
  - **Fechadas**: Conversas finalizadas
- ✅ Cada conversa mostra:
  - Nome/email/telefone do cliente (se fornecido)
  - Última mensagem
  - Quantidade de mensagens
  - Quantidade de imagens enviadas
  - Horário da última atualização

#### 2. **Detalhes da Conversa** (`/admin/conversas-ia/[id]`)

- ✅ Timeline completa de mensagens
- ✅ Contexto do orçamento (quoteContext)
- ✅ Link para o orçamento gerado (se houver)
- ✅ Informações do cliente

#### 3. **WhatsApp** (`/admin/whatsapp`)

- ✅ Conversas iniciadas via WhatsApp
- ✅ Modelo separado: `Conversation` (não `AiConversation`)
- ✅ Pode ser vinculado ao mesmo `Quote`

## 🔗 Integração Chat ↔ Quote

### Quando o Orçamento é Gerado

1. **Durante o Chat**:

   ```typescript
   quoteContext = {
     items: [
       { category: 'BOX', width: 1.5, height: 2.0, ... }
     ],
     customerInfo: { name, email, phone },
     measurements: { ... }
   }
   ```

2. **Ao Finalizar no Checkout**:
   - `AiConversation.status` → `"QUOTE_GENERATED"`
   - `AiConversation.quoteId` → ID do Quote criado
   - `Quote.conversationId` → ID da conversa AI (se aplicável)

3. **No Admin**:
   - Admin pode ver conversa completa que gerou o orçamento
   - Pode ver orçamento a partir da conversa
   - Pode ver conversa a partir do orçamento

## 📊 Estados da Conversa

| Status            | Descrição             | Quando Ocorre           |
| ----------------- | --------------------- | ----------------------- |
| `ACTIVE`          | Conversa em andamento | Padrão ao iniciar       |
| `QUOTE_GENERATED` | Orçamento foi criado  | Após finalizar checkout |
| `ABANDONED`       | Cliente abandonou     | Inatividade > 30min     |
| `CLOSED`          | Conversa encerrada    | Admin ou sistema fecha  |

## 🔍 Como Rastrear uma Conversa

### Por SessionID (Cliente Anônimo)

```typescript
const conversation = await prisma.aiConversation.findUnique({
  where: { sessionId: 'session-123-456' },
  include: { messages: true, quote: true },
})
```

### Por Email (Cliente Identificado)

```typescript
const conversations = await prisma.aiConversation.findMany({
  where: { customerEmail: 'cliente@email.com' },
  include: { messages: true, quote: true },
})
```

### Por Quote (Orçamento Gerado)

```typescript
const conversation = await prisma.aiConversation.findUnique({
  where: { quoteId: 'quote-id-123' },
  include: { messages: true },
})
```

## 🎯 Benefícios do Sistema

1. ✅ **Continuidade**: Cliente pode continuar conversa após ir para checkout
2. ✅ **Rastreabilidade**: Admin vê todo histórico da jornada
3. ✅ **Contexto**: IA mantém contexto mesmo após redirecionamento
4. ✅ **Omnichannel**: Mesmo cliente pode ter conversas no Chat e WhatsApp
5. ✅ **Analytics**: Métricas de conversão e abandono disponíveis

## 🚀 Próximas Melhorias Sugeridas

- [ ] Unificar conversas Chat + WhatsApp do mesmo cliente
- [ ] Notificar admin quando conversa ativa tem novo orçamento
- [ ] Auto-fechar conversas abandonadas após X dias
- [ ] Exportar conversas em PDF para análise
- [ ] Dashboard com taxa de conversão Chat → Quote
