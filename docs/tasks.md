# 📋 VERSATI GLASS - TASKS (ROADMAP)

**Versão:** 1.0.0  
**Última atualização:** Dezembro 2024  
**Prazo MVP:** 16 semanas

---

## LEGENDA

- ⬜ Não iniciado
- 🔄 Em progresso
- ✅ Concluído
- ⏸️ Pausado
- ❌ Cancelado

**Prioridades:**
- 🔴 P0 - Crítico (bloqueia lançamento)
- 🟠 P1 - Alta (essencial para MVP)
- 🟡 P2 - Média (importante mas não bloqueia)
- 🟢 P3 - Baixa (nice to have)

---

## FASE 1: SETUP (Semanas 1-2)

### 1.1 Infraestrutura

| ID | Task | Prioridade | Status | Responsável |
|----|------|------------|--------|-------------|
| 1.1.1 | Criar repositório GitHub | 🔴 P0 | ⬜ | Dev |
| 1.1.2 | Configurar monorepo (pnpm workspaces) | 🔴 P0 | ⬜ | Dev |
| 1.1.3 | Setup Next.js 14 com App Router | 🔴 P0 | ⬜ | Dev |
| 1.1.4 | Configurar TypeScript | 🔴 P0 | ⬜ | Dev |
| 1.1.5 | Configurar Tailwind CSS | 🔴 P0 | ⬜ | Dev |
| 1.1.6 | Configurar ESLint + Prettier | 🟠 P1 | ⬜ | Dev |
| 1.1.7 | Setup Husky (pre-commit hooks) | 🟡 P2 | ⬜ | Dev |
| 1.1.8 | Criar arquivo .env.example | 🔴 P0 | ⬜ | Dev |

### 1.2 Banco de Dados

| ID | Task | Prioridade | Status | Responsável |
|----|------|------------|--------|-------------|
| 1.2.1 | Criar conta Railway | 🔴 P0 | ⬜ | Dev |
| 1.2.2 | Provisionar PostgreSQL | 🔴 P0 | ⬜ | Dev |
| 1.2.3 | Configurar Prisma ORM | 🔴 P0 | ⬜ | Dev |
| 1.2.4 | Criar schema inicial (todos os models) | 🔴 P0 | ⬜ | Dev |
| 1.2.5 | Rodar primeira migration | 🔴 P0 | ⬜ | Dev |
| 1.2.6 | Criar seed com dados de exemplo | 🟠 P1 | ⬜ | Dev |

### 1.3 Deploy

| ID | Task | Prioridade | Status | Responsável |
|----|------|------------|--------|-------------|
| 1.3.1 | Criar projeto no Vercel | 🔴 P0 | ⬜ | Dev |
| 1.3.2 | Conectar repositório GitHub | 🔴 P0 | ⬜ | Dev |
| 1.3.3 | Configurar variáveis de ambiente | 🔴 P0 | ⬜ | Dev |
| 1.3.4 | Configurar domínio personalizado | 🟠 P1 | ⬜ | Dev |
| 1.3.5 | Configurar SSL | 🔴 P0 | ⬜ | Dev |
| 1.3.6 | Configurar ambiente de staging | 🟡 P2 | ⬜ | Dev |

### 1.4 Design System Base

| ID | Task | Prioridade | Status | Responsável |
|----|------|------------|--------|-------------|
| 1.4.1 | Configurar tokens no Tailwind (cores, fontes) | 🔴 P0 | ⬜ | Dev |
| 1.4.2 | Importar fontes (Cormorant, Outfit, Inter) | 🔴 P0 | ⬜ | Dev |
| 1.4.3 | Criar utilitário cn() para classes | 🔴 P0 | ⬜ | Dev |
| 1.4.4 | Instalar dependências (Radix, Framer, Lucide) | 🔴 P0 | ⬜ | Dev |

---

## FASE 2: COMPONENTES UI (Semanas 2-3)

### 2.1 Primitivos

| ID | Task | Prioridade | Status | Responsável |
|----|------|------------|--------|-------------|
| 2.1.1 | Componente Button | 🔴 P0 | ⬜ | Dev |
| 2.1.2 | Componente Input | 🔴 P0 | ⬜ | Dev |
| 2.1.3 | Componente Select | 🔴 P0 | ⬜ | Dev |
| 2.1.4 | Componente Textarea | 🟠 P1 | ⬜ | Dev |
| 2.1.5 | Componente Checkbox | 🟠 P1 | ⬜ | Dev |
| 2.1.6 | Componente Radio | 🟠 P1 | ⬜ | Dev |
| 2.1.7 | Componente Card | 🔴 P0 | ⬜ | Dev |
| 2.1.8 | Componente Badge | 🔴 P0 | ⬜ | Dev |
| 2.1.9 | Componente Modal (Dialog) | 🔴 P0 | ⬜ | Dev |
| 2.1.10 | Componente Toast | 🔴 P0 | ⬜ | Dev |
| 2.1.11 | Componente Tabs | 🟠 P1 | ⬜ | Dev |
| 2.1.12 | Componente Dropdown Menu | 🟠 P1 | ⬜ | Dev |
| 2.1.13 | Componente Avatar | 🟠 P1 | ⬜ | Dev |
| 2.1.14 | Componente Skeleton | 🟠 P1 | ⬜ | Dev |

### 2.2 Layout

| ID | Task | Prioridade | Status | Responsável |
|----|------|------------|--------|-------------|
| 2.2.1 | Componente Header | 🔴 P0 | ⬜ | Dev |
| 2.2.2 | Componente Footer | 🔴 P0 | ⬜ | Dev |
| 2.2.3 | Componente Sidebar (Portal/Admin) | 🔴 P0 | ⬜ | Dev |
| 2.2.4 | Componente PageHeader | 🟠 P1 | ⬜ | Dev |
| 2.2.5 | Componente Container | 🟠 P1 | ⬜ | Dev |

### 2.3 Shared

| ID | Task | Prioridade | Status | Responsável |
|----|------|------------|--------|-------------|
| 2.3.1 | Componente Logo | 🔴 P0 | ⬜ | Dev |
| 2.3.2 | Componente EmptyState | 🟠 P1 | ⬜ | Dev |
| 2.3.3 | Componente LoadingSpinner | 🔴 P0 | ⬜ | Dev |
| 2.3.4 | Componente ErrorBoundary | 🟠 P1 | ⬜ | Dev |
| 2.3.5 | Componente WhatsAppButton (floating) | 🔴 P0 | ⬜ | Dev |

---

## FASE 3: LANDING PAGE (Semanas 2-5)

### 3.1 Páginas Públicas

| ID | Task | Prioridade | Status | Responsável |
|----|------|------------|--------|-------------|
| 3.1.1 | Layout público (header + footer) | 🔴 P0 | ⬜ | Dev |
| 3.1.2 | Página Home - Hero | 🔴 P0 | ⬜ | Dev |
| 3.1.3 | Página Home - Produtos Destaque | 🔴 P0 | ⬜ | Dev |
| 3.1.4 | Página Home - Diferenciais | 🟠 P1 | ⬜ | Dev |
| 3.1.5 | Página Home - Como Funciona | 🟠 P1 | ⬜ | Dev |
| 3.1.6 | Página Home - Portfólio Preview | 🟡 P2 | ⬜ | Dev |
| 3.1.7 | Página Home - Depoimentos | 🟡 P2 | ⬜ | Dev |
| 3.1.8 | Página Home - CTA Final | 🔴 P0 | ⬜ | Dev |
| 3.1.9 | Página Produtos - Lista/Filtros | 🔴 P0 | ⬜ | Dev |
| 3.1.10 | Página Produtos - Cards | 🔴 P0 | ⬜ | Dev |
| 3.1.11 | Página Produto Detalhe | 🔴 P0 | ⬜ | Dev |
| 3.1.12 | Página Serviços | 🟠 P1 | ⬜ | Dev |
| 3.1.13 | Página Portfólio | 🟡 P2 | ⬜ | Dev |
| 3.1.14 | Página Contato | 🟠 P1 | ⬜ | Dev |
| 3.1.15 | Página Sobre | 🟡 P2 | ⬜ | Dev |

### 3.2 SEO e Performance

| ID | Task | Prioridade | Status | Responsável |
|----|------|------------|--------|-------------|
| 3.2.1 | Configurar metadata (Next.js) | 🔴 P0 | ⬜ | Dev |
| 3.2.2 | Implementar sitemap.xml | 🟠 P1 | ⬜ | Dev |
| 3.2.3 | Implementar robots.txt | 🟠 P1 | ⬜ | Dev |
| 3.2.4 | Configurar Open Graph | 🟠 P1 | ⬜ | Dev |
| 3.2.5 | Otimizar imagens (next/image) | 🔴 P0 | ⬜ | Dev |
| 3.2.6 | Implementar lazy loading | 🟠 P1 | ⬜ | Dev |

---

## FASE 4: AUTENTICAÇÃO (Semanas 3-4)

### 4.1 NextAuth Setup

| ID | Task | Prioridade | Status | Responsável |
|----|------|------------|--------|-------------|
| 4.1.1 | Instalar e configurar NextAuth.js | 🔴 P0 | ⬜ | Dev |
| 4.1.2 | Configurar Prisma Adapter | 🔴 P0 | ⬜ | Dev |
| 4.1.3 | Implementar Credentials Provider | 🔴 P0 | ⬜ | Dev |
| 4.1.4 | Implementar Google OAuth | 🟡 P2 | ⬜ | Dev |
| 4.1.5 | Configurar middleware de proteção | 🔴 P0 | ⬜ | Dev |

### 4.2 Páginas de Auth

| ID | Task | Prioridade | Status | Responsável |
|----|------|------------|--------|-------------|
| 4.2.1 | Página Login | 🔴 P0 | ⬜ | Dev |
| 4.2.2 | Página Cadastro | 🔴 P0 | ⬜ | Dev |
| 4.2.3 | Página Esqueci Senha | 🟠 P1 | ⬜ | Dev |
| 4.2.4 | Página Resetar Senha | 🟠 P1 | ⬜ | Dev |
| 4.2.5 | Fluxo de verificação de email | 🟡 P2 | ⬜ | Dev |

### 4.3 APIs de Auth

| ID | Task | Prioridade | Status | Responsável |
|----|------|------------|--------|-------------|
| 4.3.1 | POST /api/auth/register | 🔴 P0 | ⬜ | Dev |
| 4.3.2 | GET /api/auth/me | 🔴 P0 | ⬜ | Dev |
| 4.3.3 | PUT /api/auth/me | 🟠 P1 | ⬜ | Dev |
| 4.3.4 | POST /api/auth/forgot-password | 🟠 P1 | ⬜ | Dev |
| 4.3.5 | POST /api/auth/reset-password | 🟠 P1 | ⬜ | Dev |

---

## FASE 5: ORÇAMENTO E CHECKOUT (Semanas 4-6)

### 5.1 Wizard de Orçamento

| ID | Task | Prioridade | Status | Responsável |
|----|------|------------|--------|-------------|
| 5.1.1 | Componente QuoteWizard (container) | 🔴 P0 | ⬜ | Dev |
| 5.1.2 | Step 1: Categoria | 🔴 P0 | ⬜ | Dev |
| 5.1.3 | Step 2: Produto/Modelo | 🔴 P0 | ⬜ | Dev |
| 5.1.4 | Step 3: Medidas + Upload fotos | 🔴 P0 | ⬜ | Dev |
| 5.1.5 | Step 4: Dados do cliente | 🔴 P0 | ⬜ | Dev |
| 5.1.6 | Step 5: Resumo | 🔴 P0 | ⬜ | Dev |
| 5.1.7 | Step 6: Agendamento | 🔴 P0 | ⬜ | Dev |
| 5.1.8 | Página de confirmação | 🔴 P0 | ⬜ | Dev |
| 5.1.9 | Store Zustand para orçamento | 🔴 P0 | ⬜ | Dev |

### 5.2 APIs de Orçamento

| ID | Task | Prioridade | Status | Responsável |
|----|------|------------|--------|-------------|
| 5.2.1 | GET /api/products | 🔴 P0 | ⬜ | Dev |
| 5.2.2 | GET /api/products/:slug | 🔴 P0 | ⬜ | Dev |
| 5.2.3 | POST /api/quotes | 🔴 P0 | ⬜ | Dev |
| 5.2.4 | GET /api/quotes/:id | 🔴 P0 | ⬜ | Dev |
| 5.2.5 | PUT /api/quotes/:id/accept | 🔴 P0 | ⬜ | Dev |
| 5.2.6 | POST /api/upload | 🔴 P0 | ⬜ | Dev |

### 5.3 Pagamentos (Stripe)

| ID | Task | Prioridade | Status | Responsável |
|----|------|------------|--------|-------------|
| 5.3.1 | Criar conta Stripe | 🔴 P0 | ⬜ | Dev |
| 5.3.2 | Configurar lib Stripe | 🔴 P0 | ⬜ | Dev |
| 5.3.3 | POST /api/payments/create-session | 🔴 P0 | ⬜ | Dev |
| 5.3.4 | POST /api/payments/webhook | 🔴 P0 | ⬜ | Dev |
| 5.3.5 | Implementar PIX | 🔴 P0 | ⬜ | Dev |
| 5.3.6 | Implementar Cartão (10x) | 🔴 P0 | ⬜ | Dev |
| 5.3.7 | Página de sucesso/falha pagamento | 🔴 P0 | ⬜ | Dev |

---

## FASE 6: WHATSAPP IA (Semanas 3-6)

### 6.1 Twilio Setup

| ID | Task | Prioridade | Status | Responsável |
|----|------|------------|--------|-------------|
| 6.1.1 | Criar conta Twilio | 🔴 P0 | ⬜ | Dev |
| 6.1.2 | Configurar WhatsApp Business | 🔴 P0 | ⬜ | Dev |
| 6.1.3 | Configurar webhook URL | 🔴 P0 | ⬜ | Dev |
| 6.1.4 | Aprovar templates de mensagem | 🔴 P0 | ⬜ | Dev |

### 6.2 Claude IA

| ID | Task | Prioridade | Status | Responsável |
|----|------|------------|--------|-------------|
| 6.2.1 | Criar conta Anthropic | 🔴 P0 | ⬜ | Dev |
| 6.2.2 | Configurar lib Claude | 🔴 P0 | ⬜ | Dev |
| 6.2.3 | Criar system prompt do agente | 🔴 P0 | ⬜ | Dev |
| 6.2.4 | Implementar gerenciamento de contexto | 🔴 P0 | ⬜ | Dev |
| 6.2.5 | Implementar fluxo de orçamento | 🔴 P0 | ⬜ | Dev |
| 6.2.6 | Implementar fluxo de agendamento | 🔴 P0 | ⬜ | Dev |
| 6.2.7 | Implementar escalação para humano | 🔴 P0 | ⬜ | Dev |

### 6.3 APIs WhatsApp

| ID | Task | Prioridade | Status | Responsável |
|----|------|------------|--------|-------------|
| 6.3.1 | POST /api/whatsapp/webhook | 🔴 P0 | ⬜ | Dev |
| 6.3.2 | POST /api/whatsapp/send | 🔴 P0 | ⬜ | Dev |
| 6.3.3 | Service: WhatsAppService | 🔴 P0 | ⬜ | Dev |
| 6.3.4 | Service: AIService | 🔴 P0 | ⬜ | Dev |
| 6.3.5 | Service: ConversationService | 🔴 P0 | ⬜ | Dev |

---

## FASE 7: PORTAL DO CLIENTE (Semanas 5-10)

### 7.1 Layout e Dashboard

| ID | Task | Prioridade | Status | Responsável |
|----|------|------------|--------|-------------|
| 7.1.1 | Layout Portal (sidebar + header) | 🔴 P0 | ⬜ | Dev |
| 7.1.2 | Página Dashboard | 🔴 P0 | ⬜ | Dev |
| 7.1.3 | Cards de resumo | 🔴 P0 | ⬜ | Dev |
| 7.1.4 | Lista de ordens recentes | 🔴 P0 | ⬜ | Dev |
| 7.1.5 | Próximo agendamento | 🟠 P1 | ⬜ | Dev |

### 7.2 Ordens

| ID | Task | Prioridade | Status | Responsável |
|----|------|------------|--------|-------------|
| 7.2.1 | Página lista de ordens | 🔴 P0 | ⬜ | Dev |
| 7.2.2 | Filtros e busca | 🟠 P1 | ⬜ | Dev |
| 7.2.3 | Página detalhe da ordem | 🔴 P0 | ⬜ | Dev |
| 7.2.4 | Componente Timeline | 🔴 P0 | ⬜ | Dev |
| 7.2.5 | Lista de itens | 🔴 P0 | ⬜ | Dev |
| 7.2.6 | Documentos da ordem | 🟠 P1 | ⬜ | Dev |

### 7.3 Orçamentos

| ID | Task | Prioridade | Status | Responsável |
|----|------|------------|--------|-------------|
| 7.3.1 | Página lista de orçamentos | 🔴 P0 | ⬜ | Dev |
| 7.3.2 | Página detalhe do orçamento | 🔴 P0 | ⬜ | Dev |
| 7.3.3 | Ação: Aceitar orçamento | 🔴 P0 | ⬜ | Dev |
| 7.3.4 | Ação: Recusar orçamento | 🟠 P1 | ⬜ | Dev |
| 7.3.5 | Fluxo de pagamento | 🔴 P0 | ⬜ | Dev |

### 7.4 Agendamentos

| ID | Task | Prioridade | Status | Responsável |
|----|------|------------|--------|-------------|
| 7.4.1 | Página lista de agendamentos | 🔴 P0 | ⬜ | Dev |
| 7.4.2 | Detalhe do agendamento | 🔴 P0 | ⬜ | Dev |
| 7.4.3 | Ação: Reagendar | 🟠 P1 | ⬜ | Dev |
| 7.4.4 | Ação: Cancelar | 🟠 P1 | ⬜ | Dev |

### 7.5 Documentos e Perfil

| ID | Task | Prioridade | Status | Responsável |
|----|------|------------|--------|-------------|
| 7.5.1 | Página de documentos | 🟠 P1 | ⬜ | Dev |
| 7.5.2 | Download de documentos | 🟠 P1 | ⬜ | Dev |
| 7.5.3 | Página de perfil | 🔴 P0 | ⬜ | Dev |
| 7.5.4 | Edição de dados | 🔴 P0 | ⬜ | Dev |
| 7.5.5 | Alteração de senha | 🔴 P0 | ⬜ | Dev |

### 7.6 APIs do Portal

| ID | Task | Prioridade | Status | Responsável |
|----|------|------------|--------|-------------|
| 7.6.1 | GET /api/orders | 🔴 P0 | ⬜ | Dev |
| 7.6.2 | GET /api/orders/:id | 🔴 P0 | ⬜ | Dev |
| 7.6.3 | GET /api/appointments | 🔴 P0 | ⬜ | Dev |
| 7.6.4 | GET /api/appointments/slots | 🔴 P0 | ⬜ | Dev |
| 7.6.5 | POST /api/appointments | 🔴 P0 | ⬜ | Dev |
| 7.6.6 | GET /api/documents | 🟠 P1 | ⬜ | Dev |

---

## FASE 8: ADMIN (Semanas 7-12)

### 8.1 Layout e Dashboard

| ID | Task | Prioridade | Status | Responsável |
|----|------|------------|--------|-------------|
| 8.1.1 | Layout Admin | 🔴 P0 | ⬜ | Dev |
| 8.1.2 | Dashboard com KPIs | 🔴 P0 | ⬜ | Dev |
| 8.1.3 | Gráfico de vendas | 🟠 P1 | ⬜ | Dev |
| 8.1.4 | Feed de atividades | 🟠 P1 | ⬜ | Dev |
| 8.1.5 | Alertas e notificações | 🟠 P1 | ⬜ | Dev |

### 8.2 Gestão de Ordens

| ID | Task | Prioridade | Status | Responsável |
|----|------|------------|--------|-------------|
| 8.2.1 | Lista de ordens (admin) | 🔴 P0 | ⬜ | Dev |
| 8.2.2 | Filtros avançados | 🔴 P0 | ⬜ | Dev |
| 8.2.3 | Detalhe da ordem (admin) | 🔴 P0 | ⬜ | Dev |
| 8.2.4 | Atualizar status | 🔴 P0 | ⬜ | Dev |
| 8.2.5 | Notificar cliente | 🔴 P0 | ⬜ | Dev |
| 8.2.6 | Agendar instalação | 🔴 P0 | ⬜ | Dev |

### 8.3 Gestão de Orçamentos

| ID | Task | Prioridade | Status | Responsável |
|----|------|------------|--------|-------------|
| 8.3.1 | Lista de orçamentos (admin) | 🔴 P0 | ⬜ | Dev |
| 8.3.2 | Criar orçamento manual | 🟠 P1 | ⬜ | Dev |
| 8.3.3 | Editar valores | 🟠 P1 | ⬜ | Dev |
| 8.3.4 | Enviar ao cliente | 🔴 P0 | ⬜ | Dev |
| 8.3.5 | Converter em ordem | 🔴 P0 | ⬜ | Dev |

### 8.4 Gestão de Clientes

| ID | Task | Prioridade | Status | Responsável |
|----|------|------------|--------|-------------|
| 8.4.1 | Lista de clientes | 🔴 P0 | ⬜ | Dev |
| 8.4.2 | Perfil do cliente | 🔴 P0 | ⬜ | Dev |
| 8.4.3 | Histórico completo | 🔴 P0 | ⬜ | Dev |
| 8.4.4 | Editar cliente | 🟠 P1 | ⬜ | Dev |

### 8.5 Agenda

| ID | Task | Prioridade | Status | Responsável |
|----|------|------------|--------|-------------|
| 8.5.1 | Calendário visual | 🔴 P0 | ⬜ | Dev |
| 8.5.2 | Visão diária/semanal/mensal | 🔴 P0 | ⬜ | Dev |
| 8.5.3 | Criar agendamento | 🔴 P0 | ⬜ | Dev |
| 8.5.4 | Editar/cancelar | 🔴 P0 | ⬜ | Dev |
| 8.5.5 | Configurar horários disponíveis | 🟠 P1 | ⬜ | Dev |

### 8.6 Produtos

| ID | Task | Prioridade | Status | Responsável |
|----|------|------------|--------|-------------|
| 8.6.1 | Lista de produtos | 🔴 P0 | ⬜ | Dev |
| 8.6.2 | CRUD de produtos | 🔴 P0 | ⬜ | Dev |
| 8.6.3 | Upload de imagens | 🔴 P0 | ⬜ | Dev |
| 8.6.4 | Ativar/desativar | 🔴 P0 | ⬜ | Dev |

### 8.7 Conversas WhatsApp

| ID | Task | Prioridade | Status | Responsável |
|----|------|------------|--------|-------------|
| 8.7.1 | Lista de conversas | 🔴 P0 | ⬜ | Dev |
| 8.7.2 | Visualizar conversa | 🔴 P0 | ⬜ | Dev |
| 8.7.3 | Assumir conversa | 🔴 P0 | ⬜ | Dev |
| 8.7.4 | Responder manualmente | 🔴 P0 | ⬜ | Dev |
| 8.7.5 | Devolver para IA | 🔴 P0 | ⬜ | Dev |

### 8.8 APIs Admin

| ID | Task | Prioridade | Status | Responsável |
|----|------|------------|--------|-------------|
| 8.8.1 | GET /api/admin/dashboard | 🔴 P0 | ⬜ | Dev |
| 8.8.2 | PUT /api/admin/orders/:id/status | 🔴 P0 | ⬜ | Dev |
| 8.8.3 | CRUD /api/admin/products | 🔴 P0 | ⬜ | Dev |
| 8.8.4 | GET /api/admin/customers | 🔴 P0 | ⬜ | Dev |
| 8.8.5 | GET /api/admin/conversations | 🔴 P0 | ⬜ | Dev |
| 8.8.6 | POST /api/admin/conversations/:id/reply | 🔴 P0 | ⬜ | Dev |

---

## FASE 9: NOTIFICAÇÕES (Semanas 8-10)

### 9.1 Email (Resend)

| ID | Task | Prioridade | Status | Responsável |
|----|------|------------|--------|-------------|
| 9.1.1 | Configurar Resend | 🔴 P0 | ⬜ | Dev |
| 9.1.2 | Templates de email (React Email) | 🔴 P0 | ⬜ | Dev |
| 9.1.3 | Email: Confirmação orçamento | 🔴 P0 | ⬜ | Dev |
| 9.1.4 | Email: Orçamento enviado | 🔴 P0 | ⬜ | Dev |
| 9.1.5 | Email: Pedido aprovado | 🔴 P0 | ⬜ | Dev |
| 9.1.6 | Email: Instalação agendada | 🔴 P0 | ⬜ | Dev |
| 9.1.7 | Email: Instalação concluída | 🔴 P0 | ⬜ | Dev |
| 9.1.8 | Email: Recuperação de senha | 🟠 P1 | ⬜ | Dev |

### 9.2 WhatsApp Templates

| ID | Task | Prioridade | Status | Responsável |
|----|------|------------|--------|-------------|
| 9.2.1 | Template: Orçamento enviado | 🔴 P0 | ⬜ | Dev |
| 9.2.2 | Template: Pedido aprovado | 🔴 P0 | ⬜ | Dev |
| 9.2.3 | Template: Instalação agendada | 🔴 P0 | ⬜ | Dev |
| 9.2.4 | Template: Lembrete 24h | 🟠 P1 | ⬜ | Dev |
| 9.2.5 | Template: Instalação concluída | 🔴 P0 | ⬜ | Dev |

---

## FASE 10: TESTES E QA (Semanas 11-14)

### 10.1 Testes

| ID | Task | Prioridade | Status | Responsável |
|----|------|------------|--------|-------------|
| 10.1.1 | Setup Jest | 🟠 P1 | ⬜ | Dev |
| 10.1.2 | Testes unitários - Services | 🟠 P1 | ⬜ | Dev |
| 10.1.3 | Testes de integração - APIs | 🟠 P1 | ⬜ | Dev |
| 10.1.4 | Testes E2E - Fluxos críticos | 🟡 P2 | ⬜ | Dev |

### 10.2 QA Manual

| ID | Task | Prioridade | Status | Responsável |
|----|------|------------|--------|-------------|
| 10.2.1 | Testar fluxo de orçamento completo | 🔴 P0 | ⬜ | QA |
| 10.2.2 | Testar fluxo WhatsApp | 🔴 P0 | ⬜ | QA |
| 10.2.3 | Testar portal do cliente | 🔴 P0 | ⬜ | QA |
| 10.2.4 | Testar admin | 🔴 P0 | ⬜ | QA |
| 10.2.5 | Testar pagamentos | 🔴 P0 | ⬜ | QA |
| 10.2.6 | Testar responsividade | 🔴 P0 | ⬜ | QA |
| 10.2.7 | Testar acessibilidade | 🟠 P1 | ⬜ | QA |

---

## FASE 11: DEPLOY E LANÇAMENTO (Semanas 14-16)

### 11.1 Preparação

| ID | Task | Prioridade | Status | Responsável |
|----|------|------------|--------|-------------|
| 11.1.1 | Revisar todas as variáveis de ambiente | 🔴 P0 | ⬜ | Dev |
| 11.1.2 | Configurar domínio produção | 🔴 P0 | ⬜ | Dev |
| 11.1.3 | Configurar Google Analytics | 🔴 P0 | ⬜ | Dev |
| 11.1.4 | Configurar Meta Pixel | 🔴 P0 | ⬜ | Dev |
| 11.1.5 | Configurar Google Tag Manager | 🟠 P1 | ⬜ | Dev |
| 11.1.6 | Verificar performance (Lighthouse) | 🔴 P0 | ⬜ | Dev |
| 11.1.7 | Configurar monitoring (Vercel) | 🟠 P1 | ⬜ | Dev |

### 11.2 Soft Launch

| ID | Task | Prioridade | Status | Responsável |
|----|------|------------|--------|-------------|
| 11.2.1 | Deploy em produção | 🔴 P0 | ⬜ | Dev |
| 11.2.2 | Testar com usuários beta | 🔴 P0 | ⬜ | PO |
| 11.2.3 | Coletar feedback | 🔴 P0 | ⬜ | PO |
| 11.2.4 | Corrigir bugs críticos | 🔴 P0 | ⬜ | Dev |

### 11.3 Lançamento

| ID | Task | Prioridade | Status | Responsável |
|----|------|------------|--------|-------------|
| 11.3.1 | Ativar campanhas de ads | 🔴 P0 | ⬜ | Marketing |
| 11.3.2 | Publicar nas redes sociais | 🔴 P0 | ⬜ | Marketing |
| 11.3.3 | Configurar Google Meu Negócio | 🔴 P0 | ⬜ | Marketing |
| 11.3.4 | Monitorar métricas | 🔴 P0 | ⬜ | Todos |

---

## BACKLOG (Pós-MVP)

### v1.5 (Mês 5-6)

| ID | Task | Prioridade |
|----|------|------------|
| B.1 | Vision (análise de fotos via IA) | 🟡 P2 |
| B.2 | Relatórios e analytics avançados | 🟡 P2 |
| B.3 | Programa de indicação | 🟡 P2 |
| B.4 | Blog integrado | 🟢 P3 |
| B.5 | Chat em tempo real | 🟡 P2 |

### v2.0 (Mês 7-9)

| ID | Task | Prioridade |
|----|------|------------|
| B.6 | App PWA otimizado | 🟡 P2 |
| B.7 | Múltiplos técnicos/equipes | 🟡 P2 |
| B.8 | Integração contábil | 🟢 P3 |
| B.9 | API pública para parceiros | 🟢 P3 |
| B.10 | Expansão multi-região | 🟢 P3 |

---

## RESUMO DE PROGRESSO

| Fase | Total Tasks | Concluídas | % |
|------|-------------|------------|---|
| 1. Setup | 22 | 0 | 0% |
| 2. Componentes UI | 19 | 0 | 0% |
| 3. Landing Page | 21 | 0 | 0% |
| 4. Autenticação | 13 | 0 | 0% |
| 5. Orçamento/Checkout | 18 | 0 | 0% |
| 6. WhatsApp IA | 14 | 0 | 0% |
| 7. Portal Cliente | 22 | 0 | 0% |
| 8. Admin | 28 | 0 | 0% |
| 9. Notificações | 13 | 0 | 0% |
| 10. Testes/QA | 11 | 0 | 0% |
| 11. Deploy/Lançamento | 14 | 0 | 0% |
| **TOTAL MVP** | **195** | **0** | **0%** |

---

*Última atualização: Dezembro 2024*
