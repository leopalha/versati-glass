# 📋 VERSATI GLASS - PRODUCT REQUIREMENTS DOCUMENT (PRD)

## VISÃO GERAL

**Produto:** Versati Glass - Plataforma Digital Integrada  
**Versão:** 1.0.0  
**Data:** Dezembro 2024  
**Tipo:** Web Application (Next.js) + WhatsApp AI Agent  
**Objetivo:** Ecossistema digital completo para vidraçaria premium que conecta clientes, atendimento automatizado e gestão em tempo real

### URLs Planejadas
- **Frontend:** https://www.versatiglass.com.br (Vercel)
- **Backend API:** https://api.versatiglass.com.br (Railway)
- **WhatsApp:** +55 (21) 98253-6229 (Twilio)

---

## 1. ARQUITETURA DO ECOSSISTEMA

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      VERSATI GLASS ECOSYSTEM                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   ┌──────────────┐    ┌──────────────┐    ┌──────────────┐                 │
│   │   VISITANTE  │    │   CLIENTE    │    │    ADMIN     │                 │
│   │   (Landing)  │    │   (Portal)   │    │   (Gestão)   │                 │
│   └──────┬───────┘    └──────┬───────┘    └──────┬───────┘                 │
│          │                   │                   │                         │
│          └───────────────────┼───────────────────┘                         │
│                              │                                             │
│   ┌──────────────────────────┼──────────────────────────┐                  │
│   │                          │                          │                  │
│   │        ┌─────────────────▼─────────────────┐        │                  │
│   │        │        VERSATI CORE API           │        │                  │
│   │        │                                   │        │                  │
│   │        │  • Produtos & Serviços            │        │                  │
│   │        │  • Orçamentos                     │        │                  │
│   │        │  • Ordens/Pedidos                 │        │                  │
│   │        │  • Agendamentos                   │        │                  │
│   │        │  • Pagamentos (Stripe)            │        │                  │
│   │        │  • Documentos                     │        │                  │
│   │        │  • Notificações                   │        │                  │
│   │        └─────────────────┬─────────────────┘        │                  │
│   │                          │                          │                  │
│   └──────────────────────────┼──────────────────────────┘                  │
│                              │                                             │
│   ┌──────────────────────────┼──────────────────────────┐                  │
│   │                          │                          │                  │
│   │  ┌───────────┐    ┌──────▼──────┐    ┌───────────┐ │                  │
│   │  │  TWILIO   │◄───│  WHATSAPP   │───►│  CLAUDE   │ │                  │
│   │  │  (SMS)    │    │   AGENT     │    │   (AI)    │ │                  │
│   │  └───────────┘    └─────────────┘    └───────────┘ │                  │
│   │                                                     │                  │
│   └─────────────────────────────────────────────────────┘                  │
│                              │                                             │
│                    ┌─────────▼─────────┐                                   │
│                    │    PostgreSQL     │                                   │
│                    │    (Railway)      │                                   │
│                    └───────────────────┘                                   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. MÓDULOS DO SISTEMA

### 2.1 MÓDULO LANDING PAGE (Público)

#### Funcionalidades

| Feature | Descrição | Prioridade | Status |
|---------|-----------|------------|--------|
| Home Hero | Seção impactante com CTA principal | P0 | ⬜ |
| Sobre | História e diferenciais da empresa | P1 | ⬜ |
| Produtos | Catálogo visual de produtos | P0 | ⬜ |
| Serviços | Lista de serviços oferecidos | P0 | ⬜ |
| Portfólio | Galeria de projetos realizados | P1 | ⬜ |
| Depoimentos | Avaliações de clientes | P2 | ⬜ |
| Orçamento | Formulário de solicitação | P0 | ⬜ |
| Contato | Informações e formulário | P0 | ⬜ |
| WhatsApp Float | Botão flutuante WhatsApp | P0 | ⬜ |
| SEO | Meta tags, sitemap, schema | P1 | ⬜ |

#### Páginas

| Página | Rota | Descrição |
|--------|------|-----------|
| Home | `/` | Landing principal |
| Produtos | `/produtos` | Catálogo geral |
| Produto Categoria | `/produtos/[categoria]` | Box, Espelhos, etc. |
| Produto Detalhe | `/produtos/[categoria]/[slug]` | Detalhe do produto |
| Serviços | `/servicos` | Lista de serviços |
| Portfólio | `/portfolio` | Galeria de projetos |
| Projeto Detalhe | `/portfolio/[slug]` | Detalhe do projeto |
| Orçamento | `/orcamento` | Formulário/Checkout |
| Contato | `/contato` | Página de contato |
| Sobre | `/sobre` | Sobre a empresa |

---

### 2.2 MÓDULO CHECKOUT/ORÇAMENTO (Público)

#### Funcionalidades

| Feature | Descrição | Prioridade | Status |
|---------|-----------|------------|--------|
| Seleção de Produtos | Escolher produtos do catálogo | P0 | ⬜ |
| Especificações | Formulário de medidas e detalhes | P0 | ⬜ |
| Upload de Imagens | Enviar fotos do local | P1 | ⬜ |
| Cálculo Automático | Estimativa de valor (produtos padrão) | P0 | ⬜ |
| Agendamento | Marcar visita técnica (sob medida) | P0 | ⬜ |
| Pagamento Online | Stripe (PIX, Cartão) | P0 | ⬜ |
| Criação de Conta | Auto-cadastro após compra | P0 | ⬜ |
| Confirmação | Email + WhatsApp de confirmação | P0 | ⬜ |

#### Fluxo de Checkout

```
┌─────────────────────────────────────────────────────────────────┐
│                    FLUXO DE CHECKOUT                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1. SELEÇÃO                                                     │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ • Escolher categoria (Box, Espelho, etc.)               │   │
│  │ • Selecionar modelo                                     │   │
│  │ • Escolher cor/acabamento                               │   │
│  └────────────────────────────┬────────────────────────────┘   │
│                               │                                 │
│                               ▼                                 │
│  2. ESPECIFICAÇÕES                                              │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ • Inserir medidas (largura x altura)                    │   │
│  │ • Informar localização (CEP)                            │   │
│  │ • Upload de fotos (opcional)                            │   │
│  │ • Observações adicionais                                │   │
│  └────────────────────────────┬────────────────────────────┘   │
│                               │                                 │
│                               ▼                                 │
│  3. TIPO DE ORÇAMENTO                                           │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │         ┌──────────────────┐  ┌──────────────────┐      │   │
│  │         │ PRODUTO PADRÃO   │  │   SOB MEDIDA     │      │   │
│  │         │                  │  │                  │      │   │
│  │         │ Valor fechado    │  │ Faixa de valor   │      │   │
│  │         │ Checkout direto  │  │ Visita técnica   │      │   │
│  │         │                  │  │ obrigatória      │      │   │
│  │         └────────┬─────────┘  └────────┬─────────┘      │   │
│  └──────────────────┼─────────────────────┼────────────────┘   │
│                     │                     │                     │
│           ┌─────────▼─────────┐ ┌─────────▼─────────┐          │
│           │                   │ │                   │          │
│  4A. PAGAMENTO        │ 4B. AGENDAMENTO        │               │
│  ┌────────────────────┴───┐ ┌─┴───────────────────┐            │
│  │ • PIX (5% desc.)       │ │ • Escolher data     │            │
│  │ • Cartão até 10x       │ │ • Escolher horário  │            │
│  │ • Boleto à vista       │ │ • Confirmar visita  │            │
│  └────────────────────────┘ └─────────────────────┘            │
│                     │                     │                     │
│                     └──────────┬──────────┘                     │
│                                │                                │
│                                ▼                                │
│  5. CONFIRMAÇÃO                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ • Criar conta (email + senha temporária)                │   │
│  │ • Enviar email de confirmação                           │   │
│  │ • Enviar WhatsApp de confirmação                        │   │
│  │ • Redirecionar para Portal                              │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

### 2.3 MÓDULO PORTAL DO CLIENTE (Autenticado)

#### Funcionalidades

| Feature | Descrição | Prioridade | Status |
|---------|-----------|------------|--------|
| Dashboard | Visão geral do cliente | P0 | ⬜ |
| Minhas Ordens | Lista de pedidos/serviços | P0 | ⬜ |
| Detalhe da Ordem | Timeline de status | P0 | ⬜ |
| Orçamentos | Orçamentos pendentes/aprovados | P0 | ⬜ |
| Documentos | Contratos, garantias, NFs | P1 | ⬜ |
| Agendamentos | Próximas visitas/instalações | P0 | ⬜ |
| Pagamentos | Histórico e pendências | P1 | ⬜ |
| Perfil | Dados pessoais e endereços | P1 | ⬜ |
| Chat/Suporte | Comunicação com a empresa | P2 | ⬜ |
| Avaliações | Avaliar serviços concluídos | P2 | ⬜ |

#### Páginas do Portal

| Página | Rota | Descrição |
|--------|------|-----------|
| Dashboard | `/portal` | Visão geral |
| Ordens | `/portal/ordens` | Lista de ordens |
| Ordem Detalhe | `/portal/ordens/[id]` | Detalhe com timeline |
| Orçamentos | `/portal/orcamentos` | Lista de orçamentos |
| Orçamento Detalhe | `/portal/orcamentos/[id]` | Detalhe do orçamento |
| Agenda | `/portal/agenda` | Próximas visitas |
| Documentos | `/portal/documentos` | Arquivos |
| Pagamentos | `/portal/pagamentos` | Histórico financeiro |
| Perfil | `/portal/perfil` | Dados do cliente |

#### Status de Ordem (Timeline)

```
┌─────────────────────────────────────────────────────────────────┐
│                    ESTADOS DA ORDEM                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│    ┌──────────────────┐                                        │
│    │ orçamento_enviado│ ← Orçamento criado                     │
│    └────────┬─────────┘                                        │
│             │ (cliente aceita)                                 │
│             ▼                                                  │
│    ┌──────────────────┐                                        │
│    │aguardando_pagamento│ ← Aguardando sinal/pagamento        │
│    └────────┬─────────┘                                        │
│             │ (pagamento confirmado)                           │
│             ▼                                                  │
│    ┌──────────────────┐                                        │
│    │     aprovado     │ ← Ordem aprovada                       │
│    └────────┬─────────┘                                        │
│             │ (entra em produção)                              │
│             ▼                                                  │
│    ┌──────────────────┐                                        │
│    │   em_producao    │ ← Fabricação em andamento              │
│    └────────┬─────────┘                                        │
│             │ (produção concluída)                             │
│             ▼                                                  │
│    ┌──────────────────┐                                        │
│    │  pronto_entrega  │ ← Aguardando instalação                │
│    └────────┬─────────┘                                        │
│             │ (instalação agendada)                            │
│             ▼                                                  │
│    ┌──────────────────┐                                        │
│    │instalacao_agendada│ ← Data marcada                        │
│    └────────┬─────────┘                                        │
│             │ (técnico iniciou)                                │
│             ▼                                                  │
│    ┌──────────────────┐                                        │
│    │    instalando    │ ← Instalação em andamento              │
│    └────────┬─────────┘                                        │
│             │ (instalação finalizada)                          │
│             ▼                                                  │
│    ┌──────────────────┐                                        │
│    │    concluido     │ ← Serviço finalizado                   │
│    └──────────────────┘                                        │
│                                                                 │
│    Estados alternativos:                                        │
│    • cancelado - Ordem cancelada                               │
│    • aguardando_cliente - Pendência do cliente                 │
│    • em_revisao - Ajustes necessários                          │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

### 2.4 MÓDULO AGENTE IA WHATSAPP (24h)

#### Funcionalidades

| Feature | Descrição | Prioridade | Status |
|---------|-----------|------------|--------|
| Atendimento Inicial | Saudação e identificação de necessidade | P0 | ⬜ |
| Coleta de Dados | Perguntas sobre o projeto | P0 | ⬜ |
| Recebimento de Imagens | Processar fotos do local | P0 | ⬜ |
| Geração de Orçamento | Criar estimativa automática | P0 | ⬜ |
| Agendamento | Marcar visita técnica | P0 | ⬜ |
| Envio de Contrato | PDF do contrato para assinatura | P1 | ⬜ |
| Link de Pagamento | Gerar link Stripe | P0 | ⬜ |
| Criação de Conta | Gerar login para portal | P0 | ⬜ |
| FAQ | Responder dúvidas frequentes | P1 | ⬜ |
| Escalada Humana | Transferir para atendente | P0 | ⬜ |
| Status de Ordem | Consultar andamento | P1 | ⬜ |

#### Fluxo de Conversação

```
┌─────────────────────────────────────────────────────────────────┐
│                FLUXO DO AGENTE IA WHATSAPP                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  CLIENTE: "Oi, quero fazer um orçamento"                       │
│                        │                                        │
│                        ▼                                        │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ IA: Olá! 👋 Bem-vindo à Versati Glass!                  │   │
│  │                                                         │   │
│  │ Sou o assistente virtual e vou ajudar você a fazer      │   │
│  │ seu orçamento de forma rápida.                          │   │
│  │                                                         │   │
│  │ O que você precisa?                                     │   │
│  │ 1️⃣ Box para banheiro                                    │   │
│  │ 2️⃣ Espelho                                              │   │
│  │ 3️⃣ Vidro temperado                                      │   │
│  │ 4️⃣ Porta/Janela                                         │   │
│  │ 5️⃣ Fechamento de área                                   │   │
│  │ 6️⃣ Outro                                                │   │
│  └─────────────────────────────────────────────────────────┘   │
│                        │                                        │
│  CLIENTE: "1"          │                                        │
│                        ▼                                        │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ IA: Ótima escolha! Temos vários modelos de box.         │   │
│  │                                                         │   │
│  │ Qual modelo te interessa?                               │   │
│  │ • Elegance (correr)                                     │   │
│  │ • Flex (espaços compactos)                              │   │
│  │ • Comum (abrir)                                         │   │
│  │ • Certo (detalhes em alumínio)                          │   │
│  │ • Não sei ainda                                         │   │
│  └─────────────────────────────────────────────────────────┘   │
│                        │                                        │
│  CLIENTE: "Elegance"   │                                        │
│                        ▼                                        │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ IA: Excelente! O Box Elegance é nosso mais vendido.     │   │
│  │                                                         │   │
│  │ Você sabe as medidas aproximadas do seu banheiro?       │   │
│  │ (Largura x Altura da área do box)                       │   │
│  │                                                         │   │
│  │ Se não souber, pode mandar uma foto que ajuda!          │   │
│  └─────────────────────────────────────────────────────────┘   │
│                        │                                        │
│  CLIENTE: [Envia foto] │                                        │
│                        ▼                                        │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ IA: [Processa imagem com Claude Vision]                 │   │
│  │                                                         │   │
│  │ Consegui ver! Parece um banheiro de aproximadamente     │   │
│  │ 1,20m x 1,90m de altura.                                │   │
│  │                                                         │   │
│  │ Qual cor você prefere para a ferragem?                  │   │
│  │ • Preto                                                 │   │
│  │ • Branco                                                │   │
│  │ • Inox                                                  │   │
│  │ • Bronze                                                │   │
│  └─────────────────────────────────────────────────────────┘   │
│                        │                                        │
│  CLIENTE: "Preto"      │                                        │
│                        ▼                                        │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ IA: Perfeito! Qual é o seu CEP para calcularmos o frete │   │
│  │ e verificar disponibilidade na sua região?              │   │
│  └─────────────────────────────────────────────────────────┘   │
│                        │                                        │
│  CLIENTE: "22745-005"  │                                        │
│                        ▼                                        │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ IA: Ótimo! Você está em Freguesia - atendemos sua região│   │
│  │ com visita técnica GRATUITA! 🎉                         │   │
│  │                                                         │   │
│  │ Preparei seu orçamento:                                 │   │
│  │                                                         │   │
│  │ ══════════════════════════════════════                  │   │
│  │ BOX ELEGANCE - Ferragem Preta                           │   │
│  │ Medidas: ~1,20m x 1,90m                                 │   │
│  │                                                         │   │
│  │ 💰 Valor estimado: R$ 1.800 - R$ 2.200                  │   │
│  │                                                         │   │
│  │ ✅ Inclui: Material + Instalação + 1 ano garantia       │   │
│  │ ✅ Visita técnica gratuita                              │   │
│  │ ══════════════════════════════════════                  │   │
│  │                                                         │   │
│  │ O valor exato depende da medição no local.              │   │
│  │ Quer agendar uma visita técnica?                        │   │
│  └─────────────────────────────────────────────────────────┘   │
│                        │                                        │
│  CLIENTE: "Sim"        │                                        │
│                        ▼                                        │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ IA: Qual dia fica melhor para você?                     │   │
│  │                                                         │   │
│  │ 📅 Horários disponíveis:                                │   │
│  │ • Seg 16/12 - 09:00, 14:00                              │   │
│  │ • Ter 17/12 - 09:00, 11:00, 14:00                       │   │
│  │ • Qua 18/12 - 09:00, 14:00, 16:00                       │   │
│  └─────────────────────────────────────────────────────────┘   │
│                        │                                        │
│  CLIENTE: "Terça 14h"  │                                        │
│                        ▼                                        │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ IA: Agendado! ✅                                        │   │
│  │                                                         │   │
│  │ 📋 RESUMO DO AGENDAMENTO                                │   │
│  │ ─────────────────────────                               │   │
│  │ Data: Terça, 17/12/2024 às 14:00                        │   │
│  │ Serviço: Visita técnica - Box Elegance                  │   │
│  │ Endereço: (precisamos confirmar)                        │   │
│  │                                                         │   │
│  │ Me confirma seu endereço completo e seu nome?           │   │
│  └─────────────────────────────────────────────────────────┘   │
│                        │                                        │
│  CLIENTE: "João Silva, Rua X, 100 - Freguesia"              │   │
│                        ▼                                        │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ IA: Tudo certo, João! 🎉                                │   │
│  │                                                         │   │
│  │ ✅ Visita confirmada para:                              │   │
│  │ 📅 17/12/2024 (terça) às 14:00                          │   │
│  │ 📍 Rua X, 100 - Freguesia                               │   │
│  │                                                         │   │
│  │ Você receberá um lembrete 1 dia antes e 2h antes.       │   │
│  │                                                         │   │
│  │ Criei seu acesso ao nosso portal:                       │   │
│  │ 🔗 www.versatiglass.com.br/portal                       │   │
│  │ 📧 Login: seu-email@email.com                           │   │
│  │ 🔑 Senha: (enviada por email)                           │   │
│  │                                                         │   │
│  │ Lá você pode acompanhar tudo em tempo real!             │   │
│  │                                                         │   │
│  │ Algo mais em que posso ajudar?                          │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

### 2.5 MÓDULO ADMIN (Gestão Interna)

#### Funcionalidades

| Feature | Descrição | Prioridade | Status |
|---------|-----------|------------|--------|
| Dashboard | Métricas e KPIs | P0 | ⬜ |
| Produtos | CRUD de produtos | P0 | ⬜ |
| Serviços | CRUD de serviços | P0 | ⬜ |
| Orçamentos | Gestão de orçamentos | P0 | ⬜ |
| Ordens | Gestão de pedidos/serviços | P0 | ⬜ |
| Clientes | CRM básico | P1 | ⬜ |
| Agenda | Calendário de visitas/instalações | P0 | ⬜ |
| Financeiro | Pagamentos e relatórios | P1 | ⬜ |
| Portfólio | Gestão de projetos/fotos | P1 | ⬜ |
| Configurações | Parâmetros do sistema | P2 | ⬜ |
| Usuários | Gestão de funcionários | P2 | ⬜ |

#### Páginas Admin

| Página | Rota | Descrição |
|--------|------|-----------|
| Dashboard | `/admin` | Visão geral |
| Produtos | `/admin/produtos` | Lista de produtos |
| Produto Editar | `/admin/produtos/[id]` | Edição de produto |
| Serviços | `/admin/servicos` | Lista de serviços |
| Orçamentos | `/admin/orcamentos` | Lista de orçamentos |
| Ordens | `/admin/ordens` | Lista de ordens |
| Ordem Detalhe | `/admin/ordens/[id]` | Detalhe da ordem |
| Clientes | `/admin/clientes` | Lista de clientes |
| Cliente Detalhe | `/admin/clientes/[id]` | Perfil do cliente |
| Agenda | `/admin/agenda` | Calendário |
| Financeiro | `/admin/financeiro` | Relatórios |
| Portfólio | `/admin/portfolio` | Gestão de projetos |
| Config | `/admin/config` | Configurações |

---

## 3. MODELOS DE DADOS

### 3.1 User (Usuário)

```typescript
User = {
  id: string (UUID),
  email: string (unique),
  password: string (hashed),
  name: string,
  phone: string,
  cpfCnpj: string?,
  
  // Endereço principal
  address: {
    street: string,
    number: string,
    complement: string?,
    neighborhood: string,
    city: string,
    state: string,
    zipCode: string,
  },
  
  // Auth
  role: enum ('customer', 'admin', 'staff'),
  emailVerified: boolean,
  phoneVerified: boolean,
  authProvider: enum ('email', 'google'),
  googleId: string?,
  
  // Timestamps
  createdAt: datetime,
  updatedAt: datetime,
  lastLoginAt: datetime?,
  
  // Relações
  orders: Order[],
  quotes: Quote[],
  appointments: Appointment[],
  documents: Document[],
}
```

### 3.2 Product (Produto)

```typescript
Product = {
  id: string (UUID),
  
  // Básico
  name: string,
  slug: string (unique),
  description: string,
  shortDescription: string,
  
  // Categorização
  category: enum ('box', 'espelhos', 'vidros', 'portas_janelas', 'fechamentos', 'outros'),
  subcategory: string?,
  
  // Mídia
  images: string[] (URLs),
  thumbnail: string (URL),
  
  // Preço
  priceType: enum ('fixed', 'per_m2', 'quote_only'),
  basePrice: decimal?,
  pricePerM2: decimal?,
  priceRange: {
    min: decimal,
    max: decimal,
  }?,
  
  // Opções
  colors: string[] ('preto', 'branco', 'inox', 'bronze'),
  finishes: string[]?,
  thicknesses: string[]?,
  
  // Status
  isActive: boolean,
  isFeatured: boolean,
  
  // SEO
  metaTitle: string?,
  metaDescription: string?,
  
  // Timestamps
  createdAt: datetime,
  updatedAt: datetime,
}
```

### 3.3 Quote (Orçamento)

```typescript
Quote = {
  id: string (UUID),
  number: string (unique, ex: "ORC-2024-001"),
  
  // Cliente
  userId: string (FK User),
  customerName: string,
  customerEmail: string,
  customerPhone: string,
  
  // Endereço do serviço
  serviceAddress: {
    street: string,
    number: string,
    complement: string?,
    neighborhood: string,
    city: string,
    state: string,
    zipCode: string,
  },
  
  // Itens
  items: QuoteItem[],
  
  // Valores
  subtotal: decimal,
  discount: decimal,
  total: decimal,
  
  // Status
  status: enum (
    'draft',           // Rascunho
    'sent',            // Enviado ao cliente
    'viewed',          // Cliente visualizou
    'accepted',        // Cliente aceitou
    'rejected',        // Cliente recusou
    'expired',         // Expirou
    'converted',       // Virou ordem
  ),
  
  // Validade
  validUntil: datetime,
  
  // Notas
  internalNotes: string?,
  customerNotes: string?,
  
  // Origem
  source: enum ('website', 'whatsapp', 'phone', 'walkin'),
  
  // Timestamps
  createdAt: datetime,
  updatedAt: datetime,
  sentAt: datetime?,
  viewedAt: datetime?,
  acceptedAt: datetime?,
}

QuoteItem = {
  id: string (UUID),
  quoteId: string (FK Quote),
  productId: string? (FK Product),
  
  // Descrição
  description: string,
  specifications: string?,
  
  // Medidas
  width: decimal?,
  height: decimal?,
  quantity: number,
  
  // Opções
  color: string?,
  finish: string?,
  thickness: string?,
  
  // Valores
  unitPrice: decimal,
  totalPrice: decimal,
  
  // Imagens do cliente
  customerImages: string[] (URLs),
}
```

### 3.4 Order (Ordem de Serviço)

```typescript
Order = {
  id: string (UUID),
  number: string (unique, ex: "OS-2024-001"),
  
  // Origem
  quoteId: string? (FK Quote),
  
  // Cliente
  userId: string (FK User),
  
  // Endereço
  serviceAddress: Address,
  
  // Itens
  items: OrderItem[],
  
  // Valores
  subtotal: decimal,
  discount: decimal,
  installationFee: decimal,
  total: decimal,
  
  // Pagamento
  paymentStatus: enum ('pending', 'partial', 'paid', 'refunded'),
  paymentMethod: enum ('pix', 'credit_card', 'debit_card', 'boleto', 'cash'),
  paidAmount: decimal,
  
  // Status
  status: enum (
    'orcamento_enviado',
    'aguardando_pagamento',
    'aprovado',
    'em_producao',
    'pronto_entrega',
    'instalacao_agendada',
    'instalando',
    'concluido',
    'cancelado',
    'aguardando_cliente',
    'em_revisao',
  ),
  
  // Timeline
  timeline: OrderTimelineEntry[],
  
  // Datas
  estimatedDelivery: datetime?,
  installedAt: datetime?,
  completedAt: datetime?,
  
  // Garantia
  warrantyUntil: datetime?,
  
  // Notas
  internalNotes: string?,
  
  // Timestamps
  createdAt: datetime,
  updatedAt: datetime,
}

OrderItem = {
  id: string (UUID),
  orderId: string (FK Order),
  productId: string? (FK Product),
  
  description: string,
  specifications: string?,
  
  width: decimal?,
  height: decimal?,
  quantity: number,
  
  color: string?,
  finish: string?,
  thickness: string?,
  
  unitPrice: decimal,
  totalPrice: decimal,
  
  status: enum ('pending', 'in_production', 'ready', 'installed'),
}

OrderTimelineEntry = {
  id: string (UUID),
  orderId: string (FK Order),
  
  status: string,
  description: string,
  createdBy: string (userId ou 'system'),
  createdAt: datetime,
}
```

### 3.5 Appointment (Agendamento)

```typescript
Appointment = {
  id: string (UUID),
  
  // Referência
  userId: string (FK User),
  orderId: string? (FK Order),
  quoteId: string? (FK Quote),
  
  // Tipo
  type: enum ('visita_tecnica', 'instalacao', 'manutencao', 'revisao'),
  
  // Data/Hora
  scheduledDate: date,
  scheduledTime: time,
  estimatedDuration: number (minutos),
  
  // Endereço
  address: Address,
  
  // Status
  status: enum (
    'scheduled',      // Agendado
    'confirmed',      // Confirmado pelo cliente
    'in_progress',    // Em andamento
    'completed',      // Concluído
    'cancelled',      // Cancelado
    'rescheduled',    // Reagendado
    'no_show',        // Cliente ausente
  ),
  
  // Técnico
  assignedTo: string? (userId),
  
  // Notas
  notes: string?,
  completionNotes: string?,
  
  // Lembretes
  reminderSentAt: datetime?,
  
  // Timestamps
  createdAt: datetime,
  updatedAt: datetime,
  completedAt: datetime?,
}
```

### 3.6 Document (Documento)

```typescript
Document = {
  id: string (UUID),
  
  // Referência
  userId: string (FK User),
  orderId: string? (FK Order),
  quoteId: string? (FK Quote),
  
  // Tipo
  type: enum ('contrato', 'garantia', 'nota_fiscal', 'orcamento_pdf', 'foto', 'outro'),
  
  // Arquivo
  name: string,
  url: string,
  mimeType: string,
  size: number (bytes),
  
  // Status
  status: enum ('pending', 'signed', 'active', 'expired'),
  
  // Assinatura (se aplicável)
  signedAt: datetime?,
  signedBy: string?,
  signatureUrl: string?,
  
  // Timestamps
  createdAt: datetime,
  updatedAt: datetime,
}
```

### 3.7 Conversation (WhatsApp)

```typescript
Conversation = {
  id: string (UUID),
  
  // Cliente
  userId: string? (FK User),
  phoneNumber: string,
  customerName: string?,
  
  // Status
  status: enum ('active', 'waiting_human', 'closed'),
  assignedTo: string? (userId admin),
  
  // Contexto
  context: JSON, // Dados coletados pela IA
  
  // Mensagens
  messages: Message[],
  
  // Resultado
  quoteId: string? (FK Quote),
  appointmentId: string? (FK Appointment),
  
  // Timestamps
  createdAt: datetime,
  updatedAt: datetime,
  lastMessageAt: datetime,
}

Message = {
  id: string (UUID),
  conversationId: string (FK Conversation),
  
  // Direção
  direction: enum ('inbound', 'outbound'),
  
  // Conteúdo
  type: enum ('text', 'image', 'document', 'audio', 'location'),
  content: string,
  mediaUrl: string?,
  
  // Remetente
  senderType: enum ('customer', 'ai', 'human'),
  senderId: string?,
  
  // Status (outbound)
  status: enum ('sent', 'delivered', 'read', 'failed'),
  
  // Timestamps
  createdAt: datetime,
}
```

---

## 4. INTEGRAÇÕES

### 4.1 Twilio (WhatsApp Business)

| Funcionalidade | Endpoint | Uso |
|----------------|----------|-----|
| Enviar mensagem | POST /messages | Templates e free-form |
| Receber mensagem | Webhook | Mensagens do cliente |
| Receber mídia | Webhook | Imagens, áudio |
| Status de entrega | Webhook | Delivered, read |

**Custo estimado:** R$ 0,05 - R$ 0,15 por mensagem

### 4.2 Anthropic Claude (IA)

| Funcionalidade | Model | Uso |
|----------------|-------|-----|
| Chat | claude-3.5-sonnet | Conversação |
| Vision | claude-3.5-sonnet | Análise de imagens |

**Custo estimado:** R$ 3 - R$ 15 por 1M tokens

### 4.3 Stripe (Pagamentos)

| Funcionalidade | Uso |
|----------------|-----|
| Checkout Session | Pagamento único |
| Payment Intent | Pagamento customizado |
| PIX | Via Payment Intent |
| Webhooks | Confirmação de pagamento |

**Taxa:** 3,99% + R$ 0,39 por transação

### 4.4 NextAuth.js (Autenticação)

| Provider | Uso |
|----------|-----|
| Credentials | Email + Senha |
| Google | OAuth |

### 4.5 Cloudflare R2 / AWS S3 (Storage)

| Funcionalidade | Uso |
|----------------|-----|
| Upload | Imagens de produtos, portfólio |
| Download | Servir arquivos |
| Signed URLs | Documentos privados |

**Custo estimado:** ~R$ 0,015/GB/mês

### 4.6 Cal.com / Google Calendar (Agenda)

| Funcionalidade | Uso |
|----------------|-----|
| Disponibilidade | Slots disponíveis |
| Agendamento | Criar eventos |
| Cancelamento | Cancelar/reagendar |
| Lembretes | Emails automáticos |

---

## 5. API ENDPOINTS

### 5.1 Autenticação

```
POST   /api/auth/register        # Cadastro
POST   /api/auth/login           # Login
POST   /api/auth/logout          # Logout
POST   /api/auth/forgot-password # Esqueci senha
POST   /api/auth/reset-password  # Resetar senha
GET    /api/auth/me              # Usuário atual
PUT    /api/auth/me              # Atualizar perfil
POST   /api/auth/google          # OAuth Google
```

### 5.2 Produtos (Público)

```
GET    /api/products             # Listar produtos
GET    /api/products/:slug       # Detalhe do produto
GET    /api/products/category/:cat # Por categoria
GET    /api/products/featured    # Destaques
```

### 5.3 Orçamentos

```
POST   /api/quotes               # Criar orçamento
GET    /api/quotes               # Listar (cliente)
GET    /api/quotes/:id           # Detalhe
PUT    /api/quotes/:id/accept    # Aceitar
PUT    /api/quotes/:id/reject    # Rejeitar
```

### 5.4 Ordens

```
GET    /api/orders               # Listar (cliente)
GET    /api/orders/:id           # Detalhe
GET    /api/orders/:id/timeline  # Timeline
GET    /api/orders/:id/documents # Documentos
```

### 5.5 Agendamentos

```
GET    /api/appointments/slots   # Slots disponíveis
POST   /api/appointments         # Agendar
GET    /api/appointments         # Listar (cliente)
PUT    /api/appointments/:id     # Reagendar
DELETE /api/appointments/:id     # Cancelar
```

### 5.6 Pagamentos

```
POST   /api/payments/create-session    # Criar sessão Stripe
POST   /api/payments/webhook           # Webhook Stripe
GET    /api/payments/history           # Histórico
```

### 5.7 WhatsApp

```
POST   /api/whatsapp/webhook     # Webhook Twilio
POST   /api/whatsapp/send        # Enviar mensagem
```

### 5.8 Upload

```
POST   /api/upload/image         # Upload de imagem
GET    /api/upload/signed-url    # URL assinada
```

### 5.9 Admin

```
# Produtos
GET    /api/admin/products
POST   /api/admin/products
PUT    /api/admin/products/:id
DELETE /api/admin/products/:id

# Orçamentos
GET    /api/admin/quotes
PUT    /api/admin/quotes/:id
POST   /api/admin/quotes/:id/send

# Ordens
GET    /api/admin/orders
PUT    /api/admin/orders/:id
PUT    /api/admin/orders/:id/status

# Clientes
GET    /api/admin/customers
GET    /api/admin/customers/:id

# Agenda
GET    /api/admin/appointments
PUT    /api/admin/appointments/:id

# Dashboard
GET    /api/admin/dashboard/stats
GET    /api/admin/dashboard/recent

# Relatórios
GET    /api/admin/reports/sales
GET    /api/admin/reports/orders
```

---

## 6. SEGURANÇA

### 6.1 Autenticação

- JWT com refresh tokens
- Senhas hashadas com bcrypt (12 rounds)
- Sessions com httpOnly cookies
- CSRF protection

### 6.2 Autorização

- Role-based access control (RBAC)
- Middleware de autenticação
- Verificação de ownership

### 6.3 Dados

- Validação com Zod em todas as entradas
- Sanitização de inputs
- Prepared statements (Prisma)
- Encryption de dados sensíveis

### 6.4 API

- Rate limiting
- CORS configurado
- HTTPS obrigatório
- Headers de segurança (Helmet)

### 6.5 LGPD

- Consentimento para comunicações
- Política de privacidade
- Direito ao esquecimento
- Exportação de dados

---

## 7. PERFORMANCE

### 7.1 Frontend

- Next.js App Router (Server Components)
- Image Optimization
- Code Splitting
- Lazy Loading
- Service Worker (PWA)

### 7.2 Backend

- Connection pooling (Prisma)
- Query optimization
- Caching (Redis futuro)
- Pagination em todas as listas

### 7.3 Metas

| Métrica | Meta |
|---------|------|
| LCP | < 2.5s |
| FID | < 100ms |
| CLS | < 0.1 |
| TTFB | < 600ms |
| Lighthouse Score | 90+ |

---

## 8. MONITORAMENTO

### 8.1 Logs

- Logs estruturados (JSON)
- Níveis: error, warn, info, debug
- Request ID para rastreamento

### 8.2 Métricas

- Uptime
- Response time
- Error rate
- Active users

### 8.3 Alertas

- Downtime
- Error spikes
- Payment failures
- WhatsApp failures

---

*Versati Glass PRD v1.0 - Dezembro 2024*
