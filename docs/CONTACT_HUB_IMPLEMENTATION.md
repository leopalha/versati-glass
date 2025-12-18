# Contact Hub - Widget Unificado de Contato

**Data:** 17 Dezembro 2024
**Status:** ✅ Implementado
**Objetivo:** Unificar Assistente IA + WhatsApp em widget único e elegante

---

## 📱 Visão Geral

O **Contact Hub** substitui os botões separados de Chat IA e WhatsApp por uma solução unificada que:

- Exibe ambas opções de contato empilhadas verticalmente
- Aparece em **todas as páginas públicas** (não só orçamento)
- Evita sobreposição de botões flutuantes
- Prepara o terreno para **Fase 5: WhatsApp Integration**

---

## 🎨 Design

### Estado Fechado (Padrão)

Dois botões flutuantes empilhados no **canto inferior direito**:

```
┌─────────────────────────┐
│  🤖  Assistente         │  ← Amarelo/Dourado + Pulse
│      Versati Glass      │
└─────────────────────────┘
┌─────────────────────────┐
│  💬  WhatsApp           │  ← Verde WhatsApp
│      Fale conosco       │
└─────────────────────────┘
```

### Estado Expandido - AI Chat

Abre o chat assistido (componente existente) em fullscreen mobile ou card flutuante desktop.

### Estado Expandido - WhatsApp

Mostra menu com 4 opções contextuais:

- 📋 Solicitar Orçamento
- 📅 Agendar Visita
- ❓ Tirar Dúvidas
- 💬 Conversar

---

## 📂 Arquitetura

### Arquivo Principal

**`src/components/shared/contact-hub.tsx`** (280 linhas)

```typescript
interface ContactHubProps {
  showOnPages?: 'all' | 'public' | 'orcamento'
}

type ActiveView = 'closed' | 'ai-chat' | 'whatsapp-menu'

export function ContactHub({ showOnPages = 'all' }: ContactHubProps) {
  const [activeView, setActiveView] = useState<ActiveView>('closed')
  // ...
}
```

### Estados

1. **`closed`** - Mostra botões empilhados
2. **`ai-chat`** - Abre chat IA (via ChatAssistido)
3. **`whatsapp-menu`** - Abre menu de opções WhatsApp

### Integrações

**Chat IA:**

```tsx
{
  activeView === 'ai-chat' && (
    <ChatAssistido onClose={() => setActiveView('closed')} showInitially={true} />
  )
}
```

**WhatsApp:**

```tsx
const openWhatsApp = (context?: string) => {
  const message = context
    ? `Olá! Estou vindo do site da Versati Glass. ${context}`
    : 'Olá! Estou vindo do site da Versati Glass.'

  const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`
  window.open(url, '_blank')
}
```

---

## 🔧 Modificações Necessárias

### 1. ChatAssistido Component

**Arquivo:** `src/components/chat/chat-assistido.tsx`

**Novas Props:**

```typescript
interface ChatAssistidoProps {
  // ... existing props
  onClose?: () => void // ← NOVO
  showInitially?: boolean // ← NOVO
}
```

**Lógica de Fechamento:**

```typescript
// Usar callback personalizado se fornecido
onClick={() => {
  if (onClose) {
    onClose()
  } else {
    setIsOpen(false)
  }
}}
```

### 2. Public Layout

**Arquivo:** `src/app/(public)/layout.tsx`

**Antes:**

```tsx
<WhatsAppButton />
<ChatAssistido />
```

**Depois:**

```tsx
<ContactHub showOnPages="all" />
```

### 3. Página de Orçamento

**Arquivo:** `src/app/(public)/orcamento/page.tsx`

**Removido:**

```tsx
<ChatAssistido position="bottom-left" />
```

Agora o chat está disponível globalmente via ContactHub!

---

## 🎯 Vantagens

### 1. UX Melhorada

- ✅ Sem sobreposição de botões
- ✅ Opções claras e organizadas
- ✅ Transições suaves (Framer Motion)

### 2. Acessibilidade Global

- ✅ Assistente IA em **todas as páginas** (não só orçamento)
- ✅ WhatsApp acessível de qualquer lugar
- ✅ Contexto preservado ao trocar de canal

### 3. Preparação para Fase 5

- ✅ Estrutura pronta para compartilhar contexto entre canais
- ✅ SessionID pode ser passado para WhatsApp via URL
- ✅ Base para continuidade cross-channel

---

## 🚀 Fase 5: WhatsApp Integration (Preparação)

### Contexto Atual

**Sistemas Separados:**

- `AiConversation` (Chat Web) - sessionId, quoteContext
- `Conversation` (WhatsApp) - phoneNumber, messages

### Objetivo Fase 5

**Unificação:**

```typescript
// 1. Add linking fields
model AiConversation {
  // ...
  whatsappConversationId String? @unique
}

model Conversation {
  // ...
  websiteChatId String? @unique
}

// 2. Create unified context service
export async function getUnifiedCustomerContext(
  phoneNumber?: string,
  userId?: string,
  sessionId?: string
) {
  // Merge context from both systems
  // Return unified conversation history
}

// 3. Pass sessionId to WhatsApp
const openWhatsApp = (context?: string) => {
  const params = new URLSearchParams({
    text: context,
    session: sessionId, // ← Para continuar conversa
  })

  window.open(`https://wa.me/${number}?${params}`, '_blank')
}
```

### Fluxo Cross-Channel

```
1. Cliente inicia chat web → sessionId gerado
   ↓
2. Cliente clica "WhatsApp" no ContactHub
   ↓
3. URL inclui sessionId: wa.me/...?session=xyz
   ↓
4. Webhook WhatsApp detecta session parameter
   ↓
5. Backend busca AiConversation por sessionId
   ↓
6. Cria link: AiConversation ↔ Conversation
   ↓
7. IA no WhatsApp tem contexto completo da conversa web
   ↓
8. Cliente pode alternar entre canais sem perder contexto
```

---

## 📊 Estatísticas

**Novos Arquivos:**

- `src/components/shared/contact-hub.tsx` (280 linhas)
- `docs/CONTACT_HUB_IMPLEMENTATION.md` (este arquivo)

**Modificados:**

- `src/components/chat/chat-assistido.tsx` (+15 linhas - props onClose/showInitially)
- `src/app/(public)/layout.tsx` (substituição WhatsAppButton → ContactHub)
- `src/app/(public)/orcamento/page.tsx` (remoção ChatAssistido duplicado)

**Total:** 1 arquivo novo, 3 modificados, ~300 linhas

---

## 🎨 Visual Reference

### Botões Empilhados (Closed State)

**Assistente IA:**

- Background: `bg-gradient-to-r from-accent-500 to-gold-500` (amarelo/dourado)
- Ícone: `Bot` (lucide-react)
- Pulse verde no canto (indicador "online")
- Label: "Assistente / Versati Glass"

**WhatsApp:**

- Background: `bg-[#25D366]` (verde oficial WhatsApp)
- Ícone: SVG logo WhatsApp
- Label: "WhatsApp / Fale conosco"

### Menu WhatsApp (Expanded)

Card flutuante com:

- Header verde WhatsApp
- 4 opções com ícones
- Footer com link para AI Chat
- Animação scale + fade (Framer Motion)

---

## 🧪 Testes Necessários

### Manual Testing

1. **Desktop:**
   - [ ] Botões aparecem no canto direito
   - [ ] Clique em "Assistente" abre chat IA
   - [ ] Clique em "WhatsApp" abre menu
   - [ ] Opções do menu abrem WhatsApp com contexto correto
   - [ ] Fechar chat retorna ao estado closed

2. **Mobile:**
   - [ ] Chat IA abre em fullscreen
   - [ ] Botões não sobrepõem conteúdo
   - [ ] WhatsApp redireciona para app móvel
   - [ ] Transições suaves

3. **Cross-Page:**
   - [ ] ContactHub aparece em todas páginas públicas
   - [ ] Estado persiste ao navegar (se chat aberto)
   - [ ] SessionId mantido durante sessão

### Automated Testing (Future)

```typescript
describe('ContactHub', () => {
  it('should show both buttons in closed state', () => {
    // ...
  })

  it('should open AI chat on assistant button click', () => {
    // ...
  })

  it('should open WhatsApp menu on whatsapp button click', () => {
    // ...
  })

  it('should call onClose when chat is closed', () => {
    // ...
  })
})
```

---

## 📝 Notas de Implementação

### Environment Variables

Necessário em `.env`:

```bash
NEXT_PUBLIC_WHATSAPP_NUMBER="+5521XXXXXXXXX"
```

### Fallback

Se `NEXT_PUBLIC_WHATSAPP_NUMBER` não estiver definido, usa número padrão de teste.

### Performance

- ContactHub é client component ('use client')
- Renderiza em todas páginas públicas
- Lazy loading do ChatAssistido (só quando aberto)

---

## 🔗 Links Relacionados

- [AI-CHAT Implementation Summary](./AI_CHAT_IMPLEMENTATION_SUMMARY.md)
- [Sprint AI-CHAT Plan](../starry-percolating-raccoon.md)
- [Tasks Tracker](./tasks.md)

---

**Implementado por:** Claude Agent SDK
**Data:** 17 Dezembro 2024
**Status:** ✅ Pronto para uso
