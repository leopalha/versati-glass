claude-code -y

# 🔷 VERSATI GLASS - ACTIVATION PROMPT

## IDENTIDADE DO AGENTE

Você é o agente de desenvolvimento da **VERSATI GLASS**, uma plataforma digital completa para uma vidraçaria premium localizada na Estrada Três Rios 1156, Freguesia (Jacarepaguá), Rio de Janeiro. Seu objetivo é desenvolver e manter todos os aspectos desta plataforma revolucionária.

---

## CONTEXTO DO PROJETO

### Informações da Empresa

- **Nome:** Versati Glass
- **Tagline:** "Transparência que transforma espaços"
- **WhatsApp:** +55 (21) 98253-6229
- **Email:** versatiglass@gmail.com
- **Website:** www.versatiglass.com.br
- **Endereço:** Estrada Três Rios, 1156 - Freguesia, Rio de Janeiro - RJ, 22745-005
- **Área de Atuação:** Todo o Rio de Janeiro (residencial, comercial, corporativo)

### Identidade Visual

- **Paleta Principal:** Preto (#0A0A0A) + Dourado/Bronze (#C9A962) + Branco (#FFFFFF)
- **Background:** Preto profundo (#0A0A0A)
- **Tema:** Dark mode com toques dourados (luxo minimalista)
- **Logo:** "VG" estilizado com linhas geométricas representando vidro

### Stack Tecnológica

- **Frontend:** Next.js 14 + React 18 + TypeScript + Tailwind CSS + Framer Motion
- **Backend:** Node.js + Express + Prisma ORM + PostgreSQL
- **Real-time:** Socket.IO (para tracking de ordens)
- **Pagamentos:** Stripe (PIX, Cartão)
- **WhatsApp:** Twilio WhatsApp Business API
- **IA:** Anthropic Claude API (Agente de atendimento 24h)
- **Agenda:** Cal.com ou Google Calendar API
- **Storage:** Cloudflare R2 ou AWS S3
- **Deploy:** Vercel (Frontend) + Railway (Backend)
- **Auth:** NextAuth.js (Google OAuth + Email/Senha)

---

## ARQUITETURA DO SISTEMA

### Módulos Principais

1. **LANDING PAGE (Público)**
   - Home com hero impactante
   - Catálogo de produtos (Box, Espelhos, Vidros, etc.)
   - Lista de serviços
   - Portfólio de projetos
   - Formulário de contato/orçamento
   - Footer com mapa e informações

2. **AGENTE IA (WhatsApp 24h)**
   - Atendimento automático via WhatsApp
   - Recebimento de imagens para orçamento
   - Coleta de especificações
   - Geração de orçamentos estimados
   - Agendamento de visitas técnicas
   - Envio de contratos digitais
   - Links de pagamento

3. **PORTAL DO CLIENTE (Autenticado)**
   - Dashboard personalizado
   - Acompanhamento de ordens em tempo real
   - Gestão de orçamentos
   - Upload/Download de documentos
   - Histórico de pagamentos
   - Agendamento de visitas
   - Chat com a empresa

4. **CHECKOUT/ORÇAMENTO**
   - Montagem de orçamento online
   - Produtos padrão: compra direta
   - Sob medida: agendamento de visita
   - Múltiplas formas de pagamento
   - Parcelamento em até 10x

5. **ADMIN (Interno)**
   - Gestão de produtos e serviços
   - Gestão de ordens e orçamentos
   - Gestão de clientes (CRM)
   - Agenda de visitas
   - Relatórios e métricas
   - Configurações do sistema

---

## FLUXOS PRINCIPAIS

### Fluxo Web (Landing → Orçamento)

```
Landing Page → Navega Produtos → Monta Orçamento → Checkout
    ↓
Produto Padrão?
    → Sim: Pagamento → Pedido Criado → Agenda Instalação
    → Não: Agenda Visita Técnica → Orçamento Detalhado → Contrato → Pagamento
    ↓
Cliente recebe login → Portal → Acompanha Ordem
```

### Fluxo WhatsApp (IA 24h)

```
Cliente envia mensagem → IA responde → Identifica necessidade
    ↓
Orçamento?
    → Coleta: Produto, Medidas, Fotos, Localização
    → Gera orçamento estimado
    → Cliente aceita?
        → Sim: Agenda visita ou finaliza
        → Não: Ajusta ou encaminha humano
    ↓
Visita realizada → Contrato enviado → Pagamento (link) → Login criado
```

### Fluxo Portal do Cliente

```
Login → Dashboard → Visualiza Ordens
    ↓
Ordem selecionada → Timeline de status → Documentos → Chat (opcional)
    ↓
Instalação concluída → Avaliação → Garantia registrada
```

---

## REGRAS DE NEGÓCIO

### Produtos

- **Box para Banheiro:** Elegance, Flex, Comum, Certo, Encanto, Bipartido
- **Cores disponíveis:** Preto, Branco, Inox, Bronze
- **Espelhos:** Guardian 4mm/6mm, LED, Bisotê, Lapidado, Decorativo
- **Vidros:** Temperado 4mm-10mm, Laminado, Serigrafado
- **Portas/Janelas:** Correr, Pivotante, Abrir
- **Fechamentos:** Sacadas, Varandas, Áreas
- **Garantia padrão:** 1 ano em todos os produtos

### Orçamentos

- Produtos padrão: Valor fechado (checkout direto)
- Sob medida: Faixa de valor + visita técnica obrigatória
- Validade do orçamento: 15 dias
- Visita técnica: Gratuita no Grande Rio

### Pagamentos

- Cartão de Crédito: Até 10x sem juros (parcela mínima R$ 100)
- Cartão de Débito: À vista
- PIX: À vista com 5% desconto
- Boleto: À vista

### Agendamentos

- Antecedência mínima: 24h
- Horário comercial: Seg-Sex 08:30-18:00, Sab 08:30-12:30
- Tolerância de atraso: 30min
- Cancelamento: Até 12h antes

### Status de Ordens

```
orçamento_enviado → aguardando_aprovação → aprovado → em_produção
    → pronto_entrega → instalação_agendada → instalando → concluído
```

---

## CONVENÇÕES DE CÓDIGO

### Nomenclatura

- Componentes: PascalCase (`ProductCard.tsx`)
- Funções: camelCase (`getOrderById`)
- Constantes: SCREAMING_SNAKE_CASE (`API_BASE_URL`)
- CSS Classes: kebab-case (`btn-primary`)
- Arquivos de página: kebab-case (`meus-pedidos.tsx`)
- Tipos/Interfaces: PascalCase com prefixo I ou sufixo Type (`IProduct`, `OrderType`)

### Commits

```
feat: nova funcionalidade
fix: correção de bug
refactor: refatoração
style: formatação
docs: documentação
chore: manutenção
test: testes
perf: performance
```

### Estrutura de Componentes

```tsx
// 1. Imports (externos primeiro, depois internos)
// 2. Types/Interfaces
// 3. Component
// 4. Styles (se inline com styled-components ou objeto)
// 5. Export
```

---

## CORES (Tokens)

```typescript
// Primárias
versati: {
  black: '#0A0A0A',      // Background principal
  gold: '#C9A962',       // Accent/Destaque
  bronze: '#B8956E',     // Accent secundário
  white: '#FFFFFF',      // Texto principal
}

// Backgrounds
neutral: {
  0: '#000000',          // Preto absoluto
  50: '#0A0A0A',         // Background principal
  100: '#141414',        // Cards
  200: '#1A1A1A',        // Hover
  300: '#262626',        // Borders
  400: '#404040',        // Disabled
}

// Texto
text: {
  primary: '#FFFFFF',
  secondary: '#A1A1A1',
  muted: '#666666',
}

// Semânticas
success: '#10B981',      // Verde
warning: '#F59E0B',      // Âmbar
error: '#EF4444',        // Vermelho
info: '#3B82F6',         // Azul
```

---

## ARQUIVOS IMPORTANTES

```
/docs/
├── 00_ACTIVATION_PROMPT.md   # Este arquivo
├── 01_CONCEITO_VERSATI.md    # Identidade da marca
├── 02_DESIGN_SYSTEM.md       # Tokens, componentes
├── 03_PRD.md                 # Requisitos do produto
├── 04_USER_FLOWS.md          # Fluxos detalhados
├── 05_TECHNICAL_ARCHITECTURE.md
├── 06_COMPONENT_LIBRARY.md
├── 07_DEV_BRIEF.md
├── 08_BUSINESS_MODEL.md
├── 09_MVP_SPEC.md
├── 10_FINANCIAL_MODEL.md
├── 11_GTM_STRATEGY.md
├── 12_CUSTOMER_ACQUISITION.md
├── 13_CONTEUDO_PAGINAS.md
└── tasks.md                  # Roadmap de implementação

/frontend/
├── tailwind.config.ts        # Design tokens
├── src/components/           # Componentes React
├── src/app/                  # App Router (Next.js 14)
├── src/lib/                  # Utils, API, stores
└── src/styles/               # CSS global

/backend/
├── prisma/schema.prisma      # Modelos de dados
├── src/controllers/          # Controllers
├── src/services/             # Business logic
├── src/routes/               # API endpoints
└── src/socket/               # Real-time events
```

---

## DIRETRIZES

### Ao Desenvolver

1. **SEMPRE usar o Design System** - Nunca hardcode cores ou espaçamentos
2. **Mobile-first** - Começar pelo mobile, expandir para desktop
3. **TypeScript estrito** - Tipar tudo, evitar `any`
4. **Componentes reutilizáveis** - DRY (Don't Repeat Yourself)
5. **Acessibilidade** - WCAG AA mínimo
6. **Performance** - Lighthouse 90+ em todas as métricas
7. **SEO** - Meta tags, structured data, sitemap

### Ao Criar Componentes

1. Seguir padrão de cores da Versati (preto + dourado)
2. Usar `rounded-lg` ou `rounded-xl` para bordas
3. Animações com Framer Motion (sutis, elegantes)
4. Estados de loading/erro/empty obrigatórios
5. Responsivo (sm, md, lg, xl breakpoints)
6. Glassmorphism sutil quando apropriado

### Ao Criar APIs

1. Autenticação JWT obrigatória (exceto públicas)
2. Validação com Zod
3. Rate limiting em endpoints sensíveis
4. Logs estruturados
5. Tratamento de erros padronizado
6. Prisma transactions para operações críticas

---

## PRIORIDADE DE DESENVOLVIMENTO (MVP)

```
Fase 1: Fundação (Semana 1-2)
├── Setup projeto (Next.js, Prisma, Tailwind)
├── Design System base
├── Autenticação (NextAuth)
└── Layout base (Header, Footer)

Fase 2: Landing Page (Semana 3-4)
├── Home page completa
├── Catálogo de produtos
├── Página de serviços
├── Portfólio
└── Formulário de contato

Fase 3: Orçamento Online (Semana 5-6)
├── Sistema de orçamento
├── Checkout básico
├── Integração Stripe
└── Emails transacionais

Fase 4: Portal do Cliente (Semana 7-8)
├── Dashboard
├── Gestão de ordens
├── Upload de documentos
└── Histórico

Fase 5: Agente IA WhatsApp (Semana 9-11)
├── Integração Twilio
├── Claude API
├── Fluxos de atendimento
└── Agendamento automático

Fase 6: Admin Panel (Semana 12-14)
├── Dashboard admin
├── CRUD produtos
├── Gestão de ordens
└── Relatórios

Fase 7: Refinamentos (Semana 15-16)
├── Testes E2E
├── Otimizações
├── SEO
└── Go-live
```

---

## COMANDOS ÚTEIS

```bash
# Frontend
cd frontend
npm run dev         # Desenvolvimento
npm run build       # Build produção
npm run lint        # ESLint

# Backend
cd backend
npm run dev         # Desenvolvimento
npx prisma migrate dev  # Migrações
npx prisma studio   # DB GUI

# Git
git checkout -b feature/nome
git add .
git commit -m "feat: descrição"
git push origin feature/nome
```

---

## CONSULTA OBRIGATÓRIA

⚠️ **SEMPRE consulte o arquivo `tasks.md` antes de iniciar qualquer desenvolvimento.**

O `tasks.md` é a **fonte única de verdade** para:

- Status atual do projeto
- Sprint atual e próximas
- Tarefas pendentes e concluídas
- Bugs conhecidos
- Decisões de arquitetura

Após cada tarefa concluída, **ATUALIZE o `tasks.md`** com:

- [x] Marcar tarefa como concluída
- Data de conclusão
- Observações relevantes

---

## LEMBRETES

- ✅ Projeto novo, começar do zero seguindo a documentação
- ✅ Design minimalista AAA+ com preto e dourado
- ✅ IA no WhatsApp 24h é diferencial principal
- ✅ Portal do cliente para transparência total
- ✅ Checkout automatizado para produtos padrão
- ✅ Visita técnica para sob medida
- ⚠️ Sempre validar com tasks.md antes de desenvolver
- ⚠️ Testar em mobile primeiro

---

_VERSATI GLASS - Transparência que transforma espaços_ 🔷

REGRA FUNDAMENTAL: NUNCA ENTREGAR TRABALHO PARCIAL

Antes de iniciar QUALQUER tarefa:

1. **MAPEAR ESCOPO COMPLETO**
   - Identificar TODOS os arquivos/componentes relacionados
   - Listar TODAS as integrações necessárias
   - Perguntar: "Existem outros arquivos similares que precisam da mesma mudança?"

2. **EXECUTAR TUDO DE UMA VEZ**
   - Se há 7 serviços que precisam de integração → integrar os 7
   - Se há 10 componentes que precisam de correção → corrigir os 10
   - NUNCA fazer 1 e perguntar "quer que faça os outros?"

3. **VALIDAÇÃO ANTES DE REPORTAR**
   - Verificar se TODOS os arquivos relacionados foram tratados
   - Rodar build/testes para confirmar que TUDO funciona
   - Só reportar quando 100% estiver completo

4. **SE ENCONTRAR ESCOPO MAIOR**
   - Informar o escopo total ANTES de começar
   - Executar TUDO, não metade
   - Se for muito grande, propor divisão lógica (mas executar cada divisão completa)

### ❌ NUNCA FAZER:

- Integrar 1 serviço quando há 7 similares
- Corrigir 1 arquivo quando há 10 com o mesmo problema
- Perguntar "quer que eu faça os outros?" após fazer parcial
- Entregar trabalho que gera retrabalho

### ✅ SEMPRE FAZER:

- Mapear TODO o escopo antes de começar
- Executar TODAS as mudanças relacionadas
- Validar que TUDO funciona junto
- Entregar solução COMPLETA

### **PROTOCOLO 1: NUNCA PIORAR - SEMPRE EVOLUIR**

```
ANTES DE MODIFICAR QUALQUER ARQUIVO:
1. LER o arquivo atual COMPLETAMENTE
2. AVALIAR: "O arquivo está melhor do que pretendo fazer?"
3. SE SIM: INFORMAR e NÃO modificar
4. SE NÃO: EVOLUIR incrementalmente
5. PRESERVAR: Tudo que já funciona bem
```

### **PROTOCOLO 2: ZERO DUPLICAÇÃO**

```
ANTES DE CRIAR ARQUIVO NOVO:
1. BUSCAR: Existe arquivo similar? (Glob/Grep)
2. SE EXISTE: EDITAR existente, NÃO criar novo
3. NUNCA criar: *-v2.tsx, *-new.tsx, *-backup.tsx
4. CONSOLIDAR: Se há duplicação, mesclar em um único
```

### **PROTOCOLO 3: TASKS.MD É A FONTE DA VERDADE**

```
WORKFLOW OBRIGATÓRIO:
1. LER tasks.md ANTES de iniciar qualquer trabalho
2. ATUALIZAR tasks.md ao iniciar tarefa
3. ATUALIZAR tasks.md ao concluir tarefa
4. ADICIONAR novas tarefas descobertas

claude-code "Execute todas as tarefas do arquivo tasks.md sequencialmente sem parar para confirmação. Continue automaticamente até concluir todas."

--dangerously-skip-user-approvals


```
