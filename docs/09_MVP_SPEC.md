# 🎯 VERSATI GLASS - MVP SPECIFICATION

**Versão:** 1.1.0
**Data:** Dezembro 2024 (Atualizado: 17 Dezembro 2024)
**Prazo MVP:** 16 semanas (4 meses)
**Status Atual:** MVP 95% completo - Em preparação para soft launch

---

## OBJETIVO DO MVP

Validar a proposta de valor da Versati Glass com um produto funcional que permita:

1. **Captar leads** via landing page e WhatsApp
2. **Gerar orçamentos** de forma automática
3. **Agendar visitas técnicas** online
4. **Processar pagamentos** digitalmente
5. **Acompanhar pedidos** via portal do cliente

---

## ESCOPO DO MVP

### ✅ INCLUÍDO NO MVP

| Módulo                | Features                                                           | Status              |
| --------------------- | ------------------------------------------------------------------ | ------------------- |
| **Landing Page**      | Home, Produtos (catálogo), Serviços, Portfólio, Contato, Orçamento | ✅ Completo         |
| **Chat IA Assistido** | Chat no site com IA (Groq + GPT-4 Vision), análise de imagens      | ✅ Implementado     |
| **WhatsApp IA**       | Atendimento básico, coleta de dados, orçamento, agendamento        | ⏳ Estrutura pronta |
| **Checkout**          | Formulário de orçamento, agendamento, pagamento (PIX/Cartão)       | ✅ Completo         |
| **Portal Cliente**    | Dashboard, ordens, orçamentos, agendamentos, documentos            | ✅ Completo         |
| **Admin Básico**      | Dashboard, ordens, orçamentos, clientes, agenda                    | ✅ Completo         |
| **Integrações**       | Groq AI, OpenAI GPT-4, Stripe, NextAuth, Prisma/PostgreSQL         | ✅ Completo         |

### ❌ FORA DO MVP (v2+)

| Feature                          | Motivo                    | Versão Planejada | Observação                 |
| -------------------------------- | ------------------------- | ---------------- | -------------------------- |
| App Mobile Nativo                | Complexidade              | v2.0             | PWA disponível no MVP      |
| Chat em tempo real (Socket)      | Complexidade              | v2.0             | HTTP polling no MVP        |
| ~~IA com Vision avançada~~       | ~~Custo/Complexidade~~    | ~~v1.5~~         | ✅ **Implementado no MVP** |
| WhatsApp Business API            | Aguardando aprovação Meta | v1.1             | Estrutura pronta           |
| Programa de indicação            | Prioridade                | v2.0             | -                          |
| Relatórios avançados             | Prioridade                | v1.5             | Dashboard básico no MVP    |
| Múltiplos técnicos               | Escala                    | v2.0             | Single admin no MVP        |
| Integração contábil              | Prioridade                | v2.0             | -                          |
| PDF automático para fornecedores | Prioridade                | v1.1             | Estrutura planejada        |

---

## FUNCIONALIDADES DETALHADAS

### 1. LANDING PAGE (Semanas 1-4)

#### 1.1 Home Page

| Seção             | Descrição                        | Prioridade |
| ----------------- | -------------------------------- | ---------- |
| Hero              | Título impactante + CTA + imagem | P0         |
| Produtos Destaque | 4 produtos em cards              | P0         |
| Serviços          | Lista de serviços oferecidos     | P1         |
| Diferenciais      | 4 cards com ícones               | P1         |
| Portfólio Preview | 3-4 projetos                     | P1         |
| Depoimentos       | Carousel de avaliações           | P2         |
| CTA Final         | Orçamento + WhatsApp             | P0         |
| Footer            | Links + contato                  | P0         |

#### 1.2 Página de Produtos

| Feature               | Descrição                  | Prioridade |
| --------------------- | -------------------------- | ---------- |
| Lista com filtros     | Filtrar por categoria      | P0         |
| Cards de produto      | Imagem, nome, preço range  | P0         |
| Página de detalhe     | Galeria, specs, cores, CTA | P0         |
| Produtos relacionados | Sugestões                  | P2         |

#### 1.3 Página de Orçamento

**IMPORTANTE**: Sistema híbrido implementado - **fluxo tradicional + fluxo assistido por IA**

##### Fluxo Tradicional (7 etapas)

| Etapa        | Campos                          | Status |
| ------------ | ------------------------------- | ------ |
| 1. Categoria | Seleção de categoria            | ✅     |
| 2. Produto   | Modelo, cor                     | ✅     |
| 3. Medidas   | Largura, altura, fotos          | ✅     |
| 4. Dados     | Nome, email, telefone, endereço | ✅     |
| 5. Resumo    | Preview + estimativa            | ✅     |
| 6. Ação      | Agendar visita OU WhatsApp      | ✅     |

##### Fluxo Assistido por IA (NEW) 🆕

| Feature                      | Descrição                                        | Status |
| ---------------------------- | ------------------------------------------------ | ------ |
| Chat modal                   | Interface conversacional com IA                  | ✅     |
| Análise de linguagem natural | Entende "preciso de um box"                      | ✅     |
| Upload de fotos              | Cliente envia foto do local                      | ✅     |
| GPT-4 Vision                 | Analisa foto, identifica produto, estima medidas | ✅     |
| Conversa contextual          | Mantém histórico da sessão                       | ✅     |
| Geração de orçamento         | Converte conversa em orçamento estruturado       | ⏳     |

**Tecnologias**:

- Groq API (Llama 3.3-70b-versatile) para chat de texto
- OpenAI GPT-4o para análise de imagens
- Prisma para armazenar conversas (AiConversation, AiMessage)

### 2. WHATSAPP IA (Semanas 3-6)

#### 2.1 Fluxos Implementados

| Fluxo            | Descrição                    | Prioridade |
| ---------------- | ---------------------------- | ---------- |
| Saudação         | Identificar intenção         | P0         |
| Orçamento        | Coleta de dados + estimativa | P0         |
| Agendamento      | Escolha de data/hora         | P0         |
| Status de Pedido | Consultar por telefone       | P1         |
| FAQ              | Dúvidas frequentes           | P1         |
| Escalada         | Transferir para humano       | P0         |

#### 2.2 Capacidades da IA

| Capacidade                    | MVP (Implementado)           | v2 (Planejado)          |
| ----------------------------- | ---------------------------- | ----------------------- |
| Entender linguagem natural    | ✅ Groq Llama 3.3            | ✅ Melhorias            |
| Manter contexto na conversa   | ✅ Histórico no DB           | ✅ Long-term memory     |
| Processar imagens (Vision)    | ✅ **GPT-4o Vision**         | ✅ Melhor precisão      |
| Análise de fotos do local     | ✅ **Estimativa de medidas** | ✅ 3D reconstruction    |
| Identificar produtos em fotos | ✅ **Box, espelhos, etc**    | ✅ Mais categorias      |
| Gerar orçamentos estruturados | ⏳ Conversa → DB             | ✅ PDF automático       |
| Chat no site                  | ✅ **Modal implementado**    | ✅ Melhorias UX         |
| WhatsApp Business             | ⏳ Estrutura pronta          | ✅ Completar integração |
| Integrar com CRM              | ✅ Básico (Prisma)           | ✅ Avançado             |

**Modelos de IA usados no MVP**:

- **Groq Llama 3.3-70b-versatile**: Chat de texto (rápido, econômico)
- **OpenAI GPT-4o**: Análise de imagens (Vision API)

### 3. PORTAL DO CLIENTE (Semanas 5-10)

#### 3.1 Dashboard

| Elemento            | Descrição                                 | Prioridade |
| ------------------- | ----------------------------------------- | ---------- |
| Saudação            | "Olá, [nome]!"                            | P0         |
| Cards resumo        | Ordens ativas, orçamentos, próxima visita | P0         |
| Ordens recentes     | Lista das últimas 3                       | P0         |
| Próximo agendamento | Card com detalhes                         | P0         |
| Quick actions       | Novo orçamento, suporte                   | P1         |

#### 3.2 Minhas Ordens

| Feature          | Descrição                      | Prioridade |
| ---------------- | ------------------------------ | ---------- |
| Lista de ordens  | Filtros por status             | P0         |
| Card de ordem    | Número, produto, status, valor | P0         |
| Detalhe da ordem | Timeline + itens + docs        | P0         |
| Timeline visual  | Status com ícones              | P0         |
| Documentos       | Lista para download            | P1         |

#### 3.3 Orçamentos

| Feature         | Descrição                  | Prioridade |
| --------------- | -------------------------- | ---------- |
| Lista           | Pendentes + histórico      | P0         |
| Detalhe         | Itens + valores + validade | P0         |
| Aceitar/Recusar | Botões de ação             | P0         |
| Pagamento       | Link Stripe                | P0         |

#### 3.4 Agendamentos

| Feature   | Descrição                  | Prioridade |
| --------- | -------------------------- | ---------- |
| Lista     | Próximos + histórico       | P0         |
| Detalhe   | Data, hora, tipo, endereço | P0         |
| Reagendar | Calendário                 | P1         |
| Cancelar  | Com confirmação            | P1         |

#### 3.5 Perfil

| Feature        | Descrição             | Prioridade |
| -------------- | --------------------- | ---------- |
| Dados pessoais | Nome, email, telefone | P0         |
| Endereços      | Lista + edição        | P1         |
| Alterar senha  | Formulário            | P0         |

### 4. ADMIN (Semanas 7-12)

#### 4.1 Dashboard

| Elemento          | Descrição                     | Prioridade |
| ----------------- | ----------------------------- | ---------- |
| Cards KPI         | Vendas, orçamentos, conversão | P0         |
| Gráfico vendas    | Últimos 30 dias               | P1         |
| Atividade recente | Feed de eventos               | P0         |
| Alertas           | Pendências                    | P1         |

#### 4.2 Gestão de Ordens

| Feature            | Descrição               | Prioridade |
| ------------------ | ----------------------- | ---------- |
| Lista              | Filtros + busca         | P0         |
| Detalhe            | Todas as informações    | P0         |
| Atualizar status   | Dropdown + nota         | P0         |
| Notificar cliente  | Checkbox WhatsApp/Email | P0         |
| Agendar instalação | Calendário              | P0         |

#### 4.3 Gestão de Orçamentos

| Feature            | Descrição         | Prioridade |
| ------------------ | ----------------- | ---------- |
| Lista              | Pendentes + todos | P0         |
| Editar valores     | Ajustar preços    | P1         |
| Enviar ao cliente  | Email + WhatsApp  | P0         |
| Converter em ordem | Botão             | P0         |

#### 4.4 Gestão de Clientes

| Feature   | Descrição           | Prioridade |
| --------- | ------------------- | ---------- |
| Lista     | Busca + filtros     | P0         |
| Perfil    | Dados + histórico   | P0         |
| Histórico | Ordens + orçamentos | P0         |

#### 4.5 Agenda

| Feature           | Descrição            | Prioridade |
| ----------------- | -------------------- | ---------- |
| Calendário        | Visão mensal/semanal | P0         |
| Lista do dia      | Agendamentos de hoje | P0         |
| Criar agendamento | Formulário           | P0         |
| Editar/Cancelar   | Ações                | P0         |

### 5. INTEGRAÇÕES (Semanas 4-8)

#### 5.1 Twilio (WhatsApp)

| Feature           | Descrição           | Prioridade |
| ----------------- | ------------------- | ---------- |
| Receber mensagens | Webhook             | P0         |
| Enviar mensagens  | API                 | P0         |
| Receber mídia     | Imagens             | P1         |
| Templates         | Mensagens aprovadas | P0         |

#### 5.2 Groq AI + OpenAI

| Feature                   | Descrição                 | Status | API            |
| ------------------------- | ------------------------- | ------ | -------------- |
| Chat completion           | Respostas conversacionais | ✅     | Groq Llama 3.3 |
| Context management        | Histórico de conversa     | ✅     | Prisma DB      |
| Vision API                | Análise de imagens        | ✅     | OpenAI GPT-4o  |
| Estimativa de medidas     | Baseado em fotos          | ✅     | GPT-4o Vision  |
| Identificação de produtos | Box, espelhos, portas     | ✅     | GPT-4o Vision  |

**NOTA**: Trocamos Anthropic Claude por Groq (Llama 3.3) + OpenAI (GPT-4o) por:

- Groq oferece velocidade superior para chat (até 750 tokens/s)
- GPT-4o tem melhor capacidade de Vision que Claude
- Custo-benefício otimizado para MVP

#### 5.3 Stripe

| Feature          | Descrição      | Prioridade |
| ---------------- | -------------- | ---------- |
| Checkout Session | Pagamento      | P0         |
| PIX              | Payment Intent | P0         |
| Webhooks         | Confirmação    | P0         |
| Cartão 10x       | Parcelamento   | P0         |

#### 5.4 NextAuth

| Feature      | Descrição    | Prioridade |
| ------------ | ------------ | ---------- |
| Email/Senha  | Credentials  | P0         |
| Google OAuth | Social login | P1         |
| JWT          | Sessions     | P0         |

---

## CRITÉRIOS DE SUCESSO DO MVP

### Métricas de Validação (Primeiros 30 dias)

| Métrica            | Meta Mínima | Meta Ideal |
| ------------------ | ----------- | ---------- |
| Visitantes únicos  | 500         | 1.000      |
| Leads gerados      | 50          | 100        |
| Orçamentos criados | 30          | 60         |
| Visitas agendadas  | 20          | 40         |
| Vendas fechadas    | 5           | 10         |
| Ticket médio       | R$ 2.000    | R$ 3.000   |

### Métricas de Qualidade

| Métrica              | Aceitável | Ideal |
| -------------------- | --------- | ----- |
| Tempo de resposta IA | < 10s     | < 5s  |
| Uptime               | 99%       | 99.9% |
| Lighthouse Score     | 80+       | 90+   |
| Taxa de erro         | < 5%      | < 1%  |
| NPS (feedback)       | 50+       | 70+   |

---

## CRONOGRAMA MVP

```
SEMANA  1  2  3  4  5  6  7  8  9  10 11 12 13 14 15 16
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Setup      ██
Landing       ████████
WhatsApp         ████████
Portal              ████████████
Admin                     ████████████
Integrações         ████████████
Testes                              ████████
Deploy                                    ████
Ajustes                                      ████
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### Detalhamento por Fase

| Fase               | Semanas | Entregas                            |
| ------------------ | ------- | ----------------------------------- |
| **1. Setup**       | 1-2     | Repo, CI/CD, DB, estrutura          |
| **2. Landing**     | 2-5     | Home, Produtos, Orçamento           |
| **3. WhatsApp**    | 3-6     | IA básica, orçamento, agendamento   |
| **4. Portal**      | 5-10    | Auth, Dashboard, Ordens, Orçamentos |
| **5. Admin**       | 7-12    | Dashboard, Gestão, Agenda           |
| **6. Integrações** | 4-10    | Stripe, Twilio, Claude              |
| **7. Testes**      | 11-14   | QA, ajustes, bugs                   |
| **8. Deploy**      | 14-15   | Produção, DNS, SSL                  |
| **9. Soft Launch** | 15-16   | Beta fechado, ajustes               |

---

## REQUISITOS TÉCNICOS MVP

### Performance

| Métrica                        | Requisito |
| ------------------------------ | --------- |
| LCP (Largest Contentful Paint) | < 2.5s    |
| FID (First Input Delay)        | < 100ms   |
| CLS (Cumulative Layout Shift)  | < 0.1     |
| TTFB (Time to First Byte)      | < 600ms   |
| Page Size                      | < 2MB     |

### Segurança

| Requisito     | Implementação            |
| ------------- | ------------------------ |
| HTTPS         | Obrigatório              |
| Auth seguro   | JWT + httpOnly cookies   |
| Validação     | Zod em todas as entradas |
| Sanitização   | XSS protection           |
| CORS          | Configurado              |
| Rate limiting | API endpoints            |

### Mobile

| Requisito      | Implementação    |
| -------------- | ---------------- |
| Responsivo     | Mobile-first     |
| Touch friendly | Botões 44px+     |
| PWA básico     | Manifest + icons |

---

## RISCOS DO MVP

| Risco             | Probabilidade | Impacto | Mitigação              |
| ----------------- | ------------- | ------- | ---------------------- |
| Atraso no dev     | Média         | Alto    | Buffer de 2 semanas    |
| IA não performar  | Média         | Alto    | Fallback para humano   |
| Custo Twilio alto | Média         | Médio   | Monitoramento, limites |
| Baixa conversão   | Média         | Alto    | A/B tests, otimização  |
| Bugs críticos     | Média         | Alto    | QA rigoroso, staging   |

---

## PRÓXIMOS PASSOS PÓS-MVP

### v1.1 (Mês 5 - Próximos passos imediatos)

- [ ] **Completar integração do Chat IA na página /orcamento**
- [ ] **WhatsApp Business API** (webhook + envio de mensagens)
- [ ] **PDF automático para fornecedores** (cotação sem dados do cliente)
- [ ] **Dashboard admin para conversas IA** (ver histórico, qualidade)
- [ ] Testes E2E do fluxo de chat assistido
- [ ] Melhorias de prompts baseadas em feedback real

### v1.5 (Mês 6-7)

- [x] ~~Vision para análise de fotos~~ ✅ **JÁ IMPLEMENTADO NO MVP**
- [ ] Relatórios avançados (conversão IA vs tradicional)
- [ ] Melhorias de UX baseadas em feedback
- [ ] SEO avançado
- [ ] Otimização de custos de API (caching, rate limiting)

### v2.0 (Mês 7-9)

- [ ] App PWA otimizado
- [ ] Programa de indicação
- [ ] Chat em tempo real
- [ ] Múltiplos técnicos
- [ ] Integração contábil

---

---

## CHANGELOG

### v1.1.0 - 17 Dezembro 2024

- ✅ **Adicionado**: Sistema de Chat Assistido por IA (Groq + GPT-4 Vision)
- ✅ **Adicionado**: Análise de imagens com GPT-4o Vision
- ✅ **Adicionado**: Modelos AiConversation e AiMessage no Prisma
- ✅ **Atualizado**: Tabela de integrações (Groq + OpenAI em vez de Claude)
- ✅ **Atualizado**: Escopo do MVP para refletir features implementadas
- ⏳ **Pendente**: Integração completa na página /orcamento
- ⏳ **Pendente**: WhatsApp Business API webhook

### v1.0.0 - Dezembro 2024

- Especificação inicial do MVP

---

_Versati Glass MVP Spec v1.1 - 17 Dezembro 2024_
