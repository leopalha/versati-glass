# 🔄 VERSATI GLASS - USER FLOWS

**Versão:** 1.0.0  
**Data:** Dezembro 2024  
**Sincronizado com:** PRD v1.0.0

---

## ÍNDICE

1. [Fluxos do Visitante](#1-fluxos-do-visitante)
2. [Fluxos do Cliente](#2-fluxos-do-cliente)
3. [Fluxos do WhatsApp](#3-fluxos-do-whatsapp)
4. [Fluxos Administrativos](#4-fluxos-administrativos)
5. [Mapeamento de Páginas](#5-mapeamento-de-páginas)
6. [Estados e Transições](#6-estados-e-transições)

---

## LEGENDA

| Símbolo | Significado |
|---------|-------------|
| ⬜ | Não implementado |
| 🔄 | Em desenvolvimento |
| ✅ | Implementado |
| ⚠️ | Parcialmente implementado |
| 🔴 | Crítico / Bloqueante |

---

## 1. FLUXOS DO VISITANTE

### 1.1 Navegação na Landing Page

```
┌─────────────────────────────────────────────────────────────────┐
│                    JORNADA DO VISITANTE                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  [Visitante acessa o site]                                     │
│              │                                                  │
│              ▼                                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                      HOME PAGE                           │   │
│  │                                                         │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐     │   │
│  │  │    Hero     │  │  Produtos   │  │  Serviços   │     │   │
│  │  │  + CTA      │  │  Destaque   │  │             │     │   │
│  │  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘     │   │
│  │         │                │                │            │   │
│  │  ┌──────┴────────────────┴────────────────┴──────┐     │   │
│  │  │              AÇÕES DO VISITANTE               │     │   │
│  │  └───────────────────────┬───────────────────────┘     │   │
│  └──────────────────────────┼───────────────────────────────┘   │
│                             │                                   │
│           ┌─────────────────┼─────────────────┐                │
│           │                 │                 │                │
│           ▼                 ▼                 ▼                │
│    ┌────────────┐    ┌────────────┐    ┌────────────┐         │
│    │  Ver       │    │  Solicitar │    │  Contato   │         │
│    │  Produtos  │    │  Orçamento │    │  WhatsApp  │         │
│    └─────┬──────┘    └─────┬──────┘    └─────┬──────┘         │
│          │                 │                 │                 │
│          ▼                 ▼                 ▼                 │
│    /produtos         /orcamento        WhatsApp               │
│                                        (IA 24h)               │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 1.2 Navegação de Produtos

```
┌─────────────────────────────────────────────────────────────────┐
│                    FLUXO DE PRODUTOS                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  /produtos                                                      │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                 CATÁLOGO DE PRODUTOS                     │   │
│  │                                                         │   │
│  │  Filtros:                                               │   │
│  │  [Box] [Espelhos] [Vidros] [Portas] [Fechamentos]       │   │
│  │                                                         │   │
│  │  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐       │   │
│  │  │ Produto │ │ Produto │ │ Produto │ │ Produto │       │   │
│  │  │  Card   │ │  Card   │ │  Card   │ │  Card   │       │   │
│  │  └────┬────┘ └────┬────┘ └────┬────┘ └────┬────┘       │   │
│  └───────┼──────────────────────────────────────────────────┘   │
│          │                                                      │
│          ▼ (click no card)                                     │
│                                                                 │
│  /produtos/[categoria]/[slug]                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │              PÁGINA DE PRODUTO                           │   │
│  │                                                         │   │
│  │  ┌──────────────────┐  ┌──────────────────────────┐    │   │
│  │  │                  │  │  Nome do Produto         │    │   │
│  │  │     GALERIA      │  │  Descrição               │    │   │
│  │  │    DE IMAGENS    │  │                          │    │   │
│  │  │                  │  │  Cores: ○ ○ ○ ○          │    │   │
│  │  │                  │  │                          │    │   │
│  │  └──────────────────┘  │  Preço: A partir de R$X  │    │   │
│  │                        │                          │    │   │
│  │                        │  [SOLICITAR ORÇAMENTO]   │    │   │
│  │                        │  [FALAR NO WHATSAPP]     │    │   │
│  │                        └──────────────────────────┘    │   │
│  │                                                         │   │
│  │  ══════════════════════════════════════════════════    │   │
│  │                                                         │   │
│  │  ESPECIFICAÇÕES TÉCNICAS                               │   │
│  │  • Material: Vidro temperado 8mm                       │   │
│  │  • Garantia: 1 ano                                     │   │
│  │  • Cores disponíveis: Preto, Branco, Inox, Bronze      │   │
│  │                                                         │   │
│  │  ══════════════════════════════════════════════════    │   │
│  │                                                         │   │
│  │  PRODUTOS RELACIONADOS                                 │   │
│  │  ┌─────────┐ ┌─────────┐ ┌─────────┐                  │   │
│  │  │ Related │ │ Related │ │ Related │                  │   │
│  │  └─────────┘ └─────────┘ └─────────┘                  │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 1.3 Solicitação de Orçamento (Web)

```
┌─────────────────────────────────────────────────────────────────┐
│                 FLUXO DE ORÇAMENTO (WEB)                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ETAPA 1: SELEÇÃO DE PRODUTOS                                  │
│  /orcamento                                                     │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  O que você precisa?                                     │   │
│  │                                                         │   │
│  │  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐       │   │
│  │  │   Box   │ │ Espelho │ │  Vidro  │ │  Porta  │       │   │
│  │  │ 🛁      │ │ 🪞      │ │ 🪟      │ │ 🚪      │       │   │
│  │  └────┬────┘ └─────────┘ └─────────┘ └─────────┘       │   │
│  └───────┼──────────────────────────────────────────────────┘   │
│          │ (seleciona Box)                                     │
│          ▼                                                      │
│                                                                 │
│  ETAPA 2: MODELO E OPÇÕES                                      │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  Qual modelo de Box?                                     │   │
│  │                                                         │   │
│  │  ○ Elegance (correr)    ○ Flex (compacto)              │   │
│  │  ○ Comum (abrir)        ○ Certo (detalhes alumínio)    │   │
│  │                                                         │   │
│  │  Cor da ferragem:                                       │   │
│  │  ● Preto  ○ Branco  ○ Inox  ○ Bronze                   │   │
│  │                                                         │   │
│  │  [PRÓXIMO]                                              │   │
│  └─────────────────────────────────────────────────────────┘   │
│          │                                                      │
│          ▼                                                      │
│                                                                 │
│  ETAPA 3: MEDIDAS E FOTOS                                      │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  Medidas do local (aproximadas):                        │   │
│  │                                                         │   │
│  │  Largura: [____] cm    Altura: [____] cm               │   │
│  │                                                         │   │
│  │  □ Não sei as medidas (visita técnica obrigatória)     │   │
│  │                                                         │   │
│  │  Fotos do local (opcional):                             │   │
│  │  ┌─────────┐ ┌─────────┐ ┌─────────┐                   │   │
│  │  │  + Add  │ │         │ │         │                   │   │
│  │  │  Foto   │ │         │ │         │                   │   │
│  │  └─────────┘ └─────────┘ └─────────┘                   │   │
│  │                                                         │   │
│  │  Observações:                                           │   │
│  │  [________________________________________]             │   │
│  │                                                         │   │
│  │  [PRÓXIMO]                                              │   │
│  └─────────────────────────────────────────────────────────┘   │
│          │                                                      │
│          ▼                                                      │
│                                                                 │
│  ETAPA 4: DADOS E ENDEREÇO                                     │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  Seus dados:                                             │   │
│  │                                                         │   │
│  │  Nome: [____________________]                           │   │
│  │  Email: [____________________]                          │   │
│  │  Telefone: [____________________]                       │   │
│  │                                                         │   │
│  │  Endereço do serviço:                                   │   │
│  │  CEP: [________]  [Buscar]                              │   │
│  │  Rua: [____________________] Nº: [____]                 │   │
│  │  Complemento: [____________________]                    │   │
│  │  Bairro: [____________] Cidade: [____________]          │   │
│  │                                                         │   │
│  │  [PRÓXIMO]                                              │   │
│  └─────────────────────────────────────────────────────────┘   │
│          │                                                      │
│          ▼                                                      │
│                                                                 │
│  ETAPA 5: RESUMO E AÇÃO                                        │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  Resumo do seu orçamento:                               │   │
│  │                                                         │   │
│  │  ══════════════════════════════════════════════════    │   │
│  │  Box Elegance - Ferragem Preta                          │   │
│  │  Medidas: 120cm x 190cm                                 │   │
│  │                                                         │   │
│  │  💰 VALOR ESTIMADO: R$ 1.800 - R$ 2.200                │   │
│  │  (valor exato após medição técnica)                     │   │
│  │  ══════════════════════════════════════════════════    │   │
│  │                                                         │   │
│  │  Como deseja prosseguir?                                │   │
│  │                                                         │   │
│  │  ┌────────────────────────────────────────────────┐    │   │
│  │  │  📅 AGENDAR VISITA TÉCNICA GRATUITA            │    │   │
│  │  │  Um técnico irá até você para medição exata    │    │   │
│  │  └────────────────────────────────────────────────┘    │   │
│  │                                                         │   │
│  │  ┌────────────────────────────────────────────────┐    │   │
│  │  │  💬 FALAR COM CONSULTOR NO WHATSAPP            │    │   │
│  │  │  Tire suas dúvidas em tempo real               │    │   │
│  │  └────────────────────────────────────────────────┘    │   │
│  └─────────────────────────────────────────────────────────┘   │
│          │                                                      │
│          ▼ (Agendar visita)                                    │
│                                                                 │
│  ETAPA 6: AGENDAMENTO                                          │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  Escolha a data e horário:                              │   │
│  │                                                         │   │
│  │  ┌─────────────────────────────────────────────────┐   │   │
│  │  │             DEZEMBRO 2024                       │   │   │
│  │  │  Dom  Seg  Ter  Qua  Qui  Sex  Sab             │   │   │
│  │  │                           [16] [17] [18]       │   │   │
│  │  │  [19] [20] [21] [22] [23] [24] ...             │   │   │
│  │  └─────────────────────────────────────────────────┘   │   │
│  │                                                         │   │
│  │  Horários disponíveis para 17/12:                       │   │
│  │  ○ 09:00  ○ 10:00  ● 14:00  ○ 15:00  ○ 16:00          │   │
│  │                                                         │   │
│  │  [CONFIRMAR AGENDAMENTO]                                │   │
│  └─────────────────────────────────────────────────────────┘   │
│          │                                                      │
│          ▼                                                      │
│                                                                 │
│  ETAPA 7: CONFIRMAÇÃO                                          │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  ✅ Visita Agendada com Sucesso!                        │   │
│  │                                                         │   │
│  │  📅 Data: Terça, 17/12/2024 às 14:00                   │   │
│  │  📍 Local: Rua X, 100 - Freguesia                      │   │
│  │                                                         │   │
│  │  Criamos seu acesso ao portal:                          │   │
│  │  🔗 www.versatiglass.com.br/portal                     │   │
│  │  📧 Senha enviada para seu email                        │   │
│  │                                                         │   │
│  │  Você receberá lembretes por WhatsApp e email.          │   │
│  │                                                         │   │
│  │  [IR PARA O PORTAL]   [VOLTAR À HOME]                  │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Mapeamento Técnico - Fluxo de Orçamento:**

| Etapa | Componentes | API Calls | Stores |
|-------|-------------|-----------|--------|
| 1. Seleção | `CategorySelector` | GET /products/categories | `quoteStore` |
| 2. Modelo | `ProductSelector`, `ColorPicker` | GET /products/:category | `quoteStore` |
| 3. Medidas | `MeasureInput`, `ImageUpload` | POST /upload/image | `quoteStore` |
| 4. Dados | `ContactForm`, `AddressForm` | GET /cep/:cep | `quoteStore` |
| 5. Resumo | `QuoteSummary` | POST /quotes | `quoteStore` |
| 6. Agenda | `Calendar`, `TimeSlots` | GET /appointments/slots | `appointmentStore` |
| 7. Confirmação | `ConfirmationCard` | POST /appointments | - |

---

## 2. FLUXOS DO CLIENTE

### 2.1 Autenticação

```
┌─────────────────────────────────────────────────────────────────┐
│                    FLUXO DE LOGIN                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  /auth/login                                                    │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                                                         │   │
│  │          [LOGO VERSATI GLASS]                           │   │
│  │                                                         │   │
│  │          Acesse sua conta                               │   │
│  │                                                         │   │
│  │          Email: [____________________]                  │   │
│  │          Senha: [____________________]                  │   │
│  │                                                         │   │
│  │          [        ENTRAR        ]                       │   │
│  │                                                         │   │
│  │          ─────────── ou ───────────                     │   │
│  │                                                         │   │
│  │          [  G  Entrar com Google  ]                     │   │
│  │                                                         │   │
│  │          [Esqueci minha senha]                          │   │
│  │                                                         │   │
│  │          Não tem conta? [Criar conta]                   │   │
│  │                                                         │   │
│  └─────────────────────────────────────────────────────────┘   │
│                        │                                        │
│                 ┌──────┴──────┐                                │
│                 │             │                                │
│          Email/Senha    Google OAuth                           │
│                 │             │                                │
│                 ▼             ▼                                │
│          POST /auth/login   POST /auth/google                  │
│                 │             │                                │
│                 └──────┬──────┘                                │
│                        │                                        │
│                        ▼                                        │
│          Redirect → /portal (cliente) ou /admin (staff)        │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 2.2 Portal - Dashboard

```
┌─────────────────────────────────────────────────────────────────┐
│                    DASHBOARD DO CLIENTE                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  /portal                                                        │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  ┌──────────────────────────────────────────────────┐   │   │
│  │  │  👤 Olá, João!                          [Sair]   │   │   │
│  │  └──────────────────────────────────────────────────┘   │   │
│  │                                                         │   │
│  │  ┌─────────────────────────────────────────────────┐   │   │
│  │  │  NAVEGAÇÃO                                       │   │   │
│  │  │  • Dashboard (atual)                             │   │   │
│  │  │  • Minhas Ordens                                 │   │   │
│  │  │  • Orçamentos                                    │   │   │
│  │  │  • Agendamentos                                  │   │   │
│  │  │  • Documentos                                    │   │   │
│  │  │  • Pagamentos                                    │   │   │
│  │  │  • Meu Perfil                                    │   │   │
│  │  └─────────────────────────────────────────────────┘   │   │
│  │                                                         │   │
│  │  ══════════════════════════════════════════════════    │   │
│  │                                                         │   │
│  │  📊 RESUMO                                             │   │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐  │   │
│  │  │ Ordens   │ │Orçamentos│ │ Próxima  │ │Pagamentos│  │   │
│  │  │ Ativas   │ │ Pendentes│ │ Visita   │ │ Pendentes│  │   │
│  │  │    2     │ │    1     │ │  17/12   │ │ R$ 500   │  │   │
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘  │   │
│  │                                                         │   │
│  │  ══════════════════════════════════════════════════    │   │
│  │                                                         │   │
│  │  📋 ORDENS RECENTES                                    │   │
│  │  ┌─────────────────────────────────────────────────┐   │   │
│  │  │ OS-2024-015  │ Box Elegance │ Em Produção │ →   │   │   │
│  │  │ OS-2024-014  │ Espelho LED  │ Instalando  │ →   │   │   │
│  │  └─────────────────────────────────────────────────┘   │   │
│  │                                                         │   │
│  │  ══════════════════════════════════════════════════    │   │
│  │                                                         │   │
│  │  📅 PRÓXIMO AGENDAMENTO                                │   │
│  │  ┌─────────────────────────────────────────────────┐   │   │
│  │  │ Visita Técnica                                   │   │   │
│  │  │ 📅 17/12/2024 às 14:00                          │   │   │
│  │  │ 📍 Rua X, 100 - Freguesia                       │   │   │
│  │  │                                                  │   │   │
│  │  │ [Reagendar]  [Cancelar]                         │   │   │
│  │  └─────────────────────────────────────────────────┘   │   │
│  │                                                         │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 2.3 Portal - Detalhe da Ordem

```
┌─────────────────────────────────────────────────────────────────┐
│                    DETALHE DA ORDEM                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  /portal/ordens/[id]                                           │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                                                         │   │
│  │  ← Voltar para Ordens                                   │   │
│  │                                                         │   │
│  │  ══════════════════════════════════════════════════    │   │
│  │                                                         │   │
│  │  ORDEM OS-2024-015                                      │   │
│  │  Status: 🔵 Em Produção                                 │   │
│  │                                                         │   │
│  │  ══════════════════════════════════════════════════    │   │
│  │                                                         │   │
│  │  TIMELINE                                               │   │
│  │                                                         │   │
│  │  ✅ 10/12 - Orçamento aprovado                         │   │
│  │     │                                                   │   │
│  │  ✅ 11/12 - Pagamento confirmado                       │   │
│  │     │                                                   │   │
│  │  ✅ 12/12 - Entrada em produção                        │   │
│  │     │       "Seu box está sendo fabricado"             │   │
│  │     │                                                   │   │
│  │  🔵 Em andamento - Produção                            │   │
│  │     │       Previsão: 16/12                            │   │
│  │     │                                                   │   │
│  │  ⬜ Aguardando - Pronto para entrega                   │   │
│  │     │                                                   │   │
│  │  ⬜ Aguardando - Instalação agendada                   │   │
│  │     │                                                   │   │
│  │  ⬜ Aguardando - Instalação                            │   │
│  │     │                                                   │   │
│  │  ⬜ Aguardando - Concluído                             │   │
│  │                                                         │   │
│  │  ══════════════════════════════════════════════════    │   │
│  │                                                         │   │
│  │  ITENS DO PEDIDO                                        │   │
│  │  ┌─────────────────────────────────────────────────┐   │   │
│  │  │ Box Elegance - Preto                            │   │   │
│  │  │ 120cm x 190cm                                    │   │   │
│  │  │ Quantidade: 1                                    │   │   │
│  │  │ Valor: R$ 1.950,00                              │   │   │
│  │  └─────────────────────────────────────────────────┘   │   │
│  │                                                         │   │
│  │  ══════════════════════════════════════════════════    │   │
│  │                                                         │   │
│  │  DOCUMENTOS                                             │   │
│  │  📄 Contrato.pdf          [Baixar]                     │   │
│  │  📄 Garantia.pdf          [Baixar]                     │   │
│  │                                                         │   │
│  │  ══════════════════════════════════════════════════    │   │
│  │                                                         │   │
│  │  PAGAMENTO                                              │   │
│  │  Total: R$ 1.950,00                                    │   │
│  │  Pago: R$ 1.950,00 ✅                                  │   │
│  │  Método: PIX                                            │   │
│  │                                                         │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 3. FLUXOS DO WHATSAPP

### 3.1 Fluxo Completo de Orçamento via IA

```
┌─────────────────────────────────────────────────────────────────┐
│              FLUXO WHATSAPP - ORÇAMENTO                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ESTADO: inicio                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  CLIENTE: "Olá" / "Oi" / "Bom dia"                      │   │
│  │                        ↓                                 │   │
│  │  IA: Saudação + Menu de opções                          │   │
│  │      1. Fazer orçamento                                  │   │
│  │      2. Acompanhar pedido                               │   │
│  │      3. Falar com atendente                             │   │
│  └─────────────────────────────────────────────────────────┘   │
│                        │                                        │
│                        ▼ (opção 1)                             │
│                                                                 │
│  ESTADO: coleta_categoria                                      │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  IA: "O que você precisa?"                              │   │
│  │      Lista de categorias                                 │   │
│  │                        ↓                                 │   │
│  │  CLIENTE: "Box" ou número da opção                      │   │
│  └─────────────────────────────────────────────────────────┘   │
│                        │                                        │
│                        ▼                                        │
│                                                                 │
│  ESTADO: coleta_modelo                                         │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  IA: "Qual modelo de box?"                              │   │
│  │      Lista de modelos                                    │   │
│  │                        ↓                                 │   │
│  │  CLIENTE: "Elegance"                                    │   │
│  └─────────────────────────────────────────────────────────┘   │
│                        │                                        │
│                        ▼                                        │
│                                                                 │
│  ESTADO: coleta_cor                                            │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  IA: "Qual cor da ferragem?"                            │   │
│  │      • Preto • Branco • Inox • Bronze                   │   │
│  │                        ↓                                 │   │
│  │  CLIENTE: "Preto"                                       │   │
│  └─────────────────────────────────────────────────────────┘   │
│                        │                                        │
│                        ▼                                        │
│                                                                 │
│  ESTADO: coleta_medidas                                        │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  IA: "Sabe as medidas? (largura x altura)"              │   │
│  │      "Pode mandar uma foto também!"                     │   │
│  │                        ↓                                 │   │
│  │  CLIENTE: [Envia foto] ou "120cm x 190cm"               │   │
│  │                        ↓                                 │   │
│  │  IA: [Processa com Vision se foto]                      │   │
│  │      "Consegui identificar ~120cm x 190cm"              │   │
│  └─────────────────────────────────────────────────────────┘   │
│                        │                                        │
│                        ▼                                        │
│                                                                 │
│  ESTADO: coleta_cep                                            │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  IA: "Qual seu CEP?"                                    │   │
│  │                        ↓                                 │   │
│  │  CLIENTE: "22745-005"                                   │   │
│  │                        ↓                                 │   │
│  │  IA: [Valida região de atendimento]                     │   │
│  │      "Freguesia - atendemos! ✅"                        │   │
│  └─────────────────────────────────────────────────────────┘   │
│                        │                                        │
│                        ▼                                        │
│                                                                 │
│  ESTADO: apresenta_orcamento                                   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  IA: "Seu orçamento:"                                   │   │
│  │      Box Elegance - Preto                               │   │
│  │      120cm x 190cm                                       │   │
│  │      💰 R$ 1.800 - R$ 2.200                            │   │
│  │      "Quer agendar visita técnica?"                     │   │
│  │                        ↓                                 │   │
│  │  CLIENTE: "Sim"                                         │   │
│  └─────────────────────────────────────────────────────────┘   │
│                        │                                        │
│                        ▼                                        │
│                                                                 │
│  ESTADO: coleta_agenda                                         │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  IA: "Horários disponíveis:"                            │   │
│  │      [Lista de slots]                                    │   │
│  │                        ↓                                 │   │
│  │  CLIENTE: "Terça 14h"                                   │   │
│  └─────────────────────────────────────────────────────────┘   │
│                        │                                        │
│                        ▼                                        │
│                                                                 │
│  ESTADO: coleta_dados                                          │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  IA: "Me confirma seu nome completo e endereço?"        │   │
│  │                        ↓                                 │   │
│  │  CLIENTE: "João Silva, Rua X 100 Freguesia"             │   │
│  │                        ↓                                 │   │
│  │  IA: [Extrai dados com NLP]                             │   │
│  └─────────────────────────────────────────────────────────┘   │
│                        │                                        │
│                        ▼                                        │
│                                                                 │
│  ESTADO: confirmacao_final                                     │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  IA: "Tudo certo! ✅"                                   │   │
│  │      📅 17/12 às 14:00                                  │   │
│  │      📍 Rua X, 100 - Freguesia                          │   │
│  │                                                          │   │
│  │      "Criei seu acesso ao portal:"                      │   │
│  │      🔗 Link + credenciais                              │   │
│  │                                                          │   │
│  │  [Sistema: cria Quote, Appointment, User]               │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 3.2 Fluxo de Consulta de Pedido

```
┌─────────────────────────────────────────────────────────────────┐
│              FLUXO WHATSAPP - CONSULTA PEDIDO                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  CLIENTE: "Quero ver meu pedido"                               │
│                        │                                        │
│                        ▼                                        │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  IA: [Busca cliente pelo telefone]                      │   │
│  │                                                          │   │
│  │  Se encontrado:                                          │   │
│  │  "Encontrei seus pedidos:"                               │   │
│  │  1. OS-2024-015 - Box Elegance - Em Produção            │   │
│  │  2. OS-2024-014 - Espelho - Concluído                   │   │
│  │  "Qual você quer consultar?"                            │   │
│  │                                                          │   │
│  │  Se não encontrado:                                      │   │
│  │  "Não encontrei pedidos neste número."                   │   │
│  │  "Qual é o número da sua ordem? (ex: OS-2024-015)"      │   │
│  └─────────────────────────────────────────────────────────┘   │
│                        │                                        │
│                        ▼ (seleciona pedido)                    │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  IA: "📋 Ordem OS-2024-015"                             │   │
│  │                                                          │   │
│  │      Box Elegance - Preto                               │   │
│  │      120cm x 190cm                                       │   │
│  │                                                          │   │
│  │      Status: 🔵 Em Produção                             │   │
│  │      Previsão: 16/12 (2 dias)                           │   │
│  │                                                          │   │
│  │      Próximo passo: Agendamento de instalação           │   │
│  │                                                          │   │
│  │      "Posso ajudar em mais alguma coisa?"               │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 3.3 Escalada para Humano

```
┌─────────────────────────────────────────────────────────────────┐
│              FLUXO WHATSAPP - ESCALADA HUMANA                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Triggers de escalada:                                         │
│  • Cliente pede atendente humano                               │
│  • IA não consegue responder 3x seguidas                       │
│  • Assunto sensível (reclamação, cancelamento)                 │
│  • Negociação de preço/desconto                                │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  CLIENTE: "Quero falar com uma pessoa"                  │   │
│  │                        ↓                                 │   │
│  │  IA: "Entendido! Vou transferir você para nossa         │   │
│  │       equipe de atendimento."                           │   │
│  │                                                          │   │
│  │       "Um momento, por favor... ⏳"                      │   │
│  │                                                          │   │
│  │  [Sistema: status = 'waiting_human']                    │   │
│  │  [Sistema: notifica admin via email/push]               │   │
│  └─────────────────────────────────────────────────────────┘   │
│                        │                                        │
│                        ▼                                        │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  [Atendente assume a conversa no painel admin]          │   │
│  │                                                          │   │
│  │  ATENDENTE: "Olá João! Aqui é a Maria da Versati.       │   │
│  │              Como posso te ajudar?"                      │   │
│  │                                                          │   │
│  │  [Conversa continua com humano]                         │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 4. FLUXOS ADMINISTRATIVOS

### 4.1 Gestão de Ordens

```
┌─────────────────────────────────────────────────────────────────┐
│              FLUXO ADMIN - GESTÃO DE ORDENS                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  /admin/ordens                                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  LISTA DE ORDENS                                        │   │
│  │                                                         │   │
│  │  Filtros: [Todos ▼] [Em produção ▼] [Buscar...]        │   │
│  │                                                         │   │
│  │  ┌───────────────────────────────────────────────────┐ │   │
│  │  │ OS-2024-015 │ João │ Box │ Em Produção │ R$1.950  │ │   │
│  │  │ OS-2024-014 │ Maria│ Esp │ Instalando  │ R$800    │ │   │
│  │  │ OS-2024-013 │ Pedro│ Port│ Ag. Pagto   │ R$3.200  │ │   │
│  │  └───────────────────────────────────────────────────┘ │   │
│  └─────────────────────────────────────────────────────────┘   │
│                        │                                        │
│                        ▼ (click na ordem)                      │
│                                                                 │
│  /admin/ordens/[id]                                            │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  DETALHES DA ORDEM OS-2024-015                          │   │
│  │                                                         │   │
│  │  Cliente: João Silva                                    │   │
│  │  Telefone: (21) 98253-6229                             │   │
│  │  Email: joao@email.com                                  │   │
│  │                                                         │   │
│  │  ══════════════════════════════════════════════════    │   │
│  │                                                         │   │
│  │  Status atual: Em Produção                              │   │
│  │                                                         │   │
│  │  Atualizar status:                                      │   │
│  │  [Pronto para Entrega ▼]  [ATUALIZAR]                  │   │
│  │                                                         │   │
│  │  Notificar cliente: ☑ WhatsApp ☑ Email                 │   │
│  │                                                         │   │
│  │  ══════════════════════════════════════════════════    │   │
│  │                                                         │   │
│  │  AÇÕES                                                  │   │
│  │  [Agendar Instalação]  [Enviar Contrato]               │   │
│  │  [Gerar Link Pagamento]  [Adicionar Nota]              │   │
│  │                                                         │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 5. MAPEAMENTO DE PÁGINAS

### 5.1 Páginas Públicas

| Página | Rota | Componentes Principais |
|--------|------|------------------------|
| Home | `/` | `Hero`, `ProductHighlights`, `Services`, `Portfolio`, `Testimonials`, `Contact` |
| Produtos | `/produtos` | `CategoryFilter`, `ProductGrid`, `ProductCard` |
| Produto Categoria | `/produtos/[cat]` | `CategoryHeader`, `ProductGrid` |
| Produto Detalhe | `/produtos/[cat]/[slug]` | `ProductGallery`, `ProductInfo`, `RelatedProducts` |
| Serviços | `/servicos` | `ServiceList`, `ServiceCard` |
| Portfólio | `/portfolio` | `PortfolioGrid`, `LightboxGallery` |
| Projeto | `/portfolio/[slug]` | `ProjectGallery`, `ProjectDetails` |
| Orçamento | `/orcamento` | `QuoteWizard`, `Steps`, `ProductSelector` |
| Contato | `/contato` | `ContactForm`, `Map`, `ContactInfo` |
| Sobre | `/sobre` | `AboutContent`, `Team`, `Values` |

### 5.2 Páginas de Autenticação

| Página | Rota | Componentes |
|--------|------|-------------|
| Login | `/auth/login` | `LoginForm`, `SocialLogin` |
| Cadastro | `/auth/cadastro` | `RegisterForm` |
| Esqueci Senha | `/auth/esqueci-senha` | `ForgotPasswordForm` |
| Resetar Senha | `/auth/resetar-senha` | `ResetPasswordForm` |

### 5.3 Páginas do Portal (Cliente)

| Página | Rota | Componentes |
|--------|------|-------------|
| Dashboard | `/portal` | `DashboardStats`, `RecentOrders`, `NextAppointment` |
| Ordens | `/portal/ordens` | `OrderList`, `OrderFilters` |
| Ordem Detalhe | `/portal/ordens/[id]` | `OrderTimeline`, `OrderItems`, `OrderDocuments` |
| Orçamentos | `/portal/orcamentos` | `QuoteList` |
| Orçamento Detalhe | `/portal/orcamentos/[id]` | `QuoteDetails`, `QuoteActions` |
| Agenda | `/portal/agenda` | `AppointmentList`, `Calendar` |
| Documentos | `/portal/documentos` | `DocumentList`, `DocumentViewer` |
| Pagamentos | `/portal/pagamentos` | `PaymentHistory`, `PendingPayments` |
| Perfil | `/portal/perfil` | `ProfileForm`, `AddressManager` |

### 5.4 Páginas Admin

| Página | Rota | Componentes |
|--------|------|-------------|
| Dashboard | `/admin` | `AdminStats`, `RevenueChart`, `RecentActivity` |
| Produtos | `/admin/produtos` | `ProductTable`, `ProductForm` |
| Serviços | `/admin/servicos` | `ServiceTable`, `ServiceForm` |
| Orçamentos | `/admin/orcamentos` | `QuoteTable`, `QuoteActions` |
| Ordens | `/admin/ordens` | `OrderTable`, `OrderFilters` |
| Ordem Detalhe | `/admin/ordens/[id]` | `OrderManagement`, `StatusUpdater` |
| Clientes | `/admin/clientes` | `CustomerTable`, `CustomerSearch` |
| Cliente Detalhe | `/admin/clientes/[id]` | `CustomerProfile`, `CustomerHistory` |
| Agenda | `/admin/agenda` | `FullCalendar`, `AppointmentModal` |
| Financeiro | `/admin/financeiro` | `FinancialReports`, `PaymentTable` |
| Portfólio | `/admin/portfolio` | `PortfolioManager`, `ImageUploader` |
| Configurações | `/admin/config` | `SettingsForm`, `IntegrationSettings` |

---

## 6. ESTADOS E TRANSIÇÕES

### 6.1 Estados de Orçamento (Quote)

```
                    ┌──────────────────────────────────────────────┐
                    │              ESTADOS DO ORÇAMENTO            │
                    └──────────────────────────────────────────────┘

         ┌──────────────┐
         │    draft     │ ← Rascunho (admin criando)
         └──────┬───────┘
                │ (admin envia)
                ▼
         ┌──────────────┐
         │     sent     │ ← Enviado ao cliente
         └──────┬───────┘
                │ (cliente abre)
                ▼
         ┌──────────────┐
         │    viewed    │ ← Cliente visualizou
         └──────┬───────┘
                │
       ┌────────┼────────┐
       │        │        │
       ▼        │        ▼
┌──────────┐    │  ┌──────────┐
│ accepted │    │  │ rejected │
└────┬─────┘    │  └──────────┘
     │          │
     │          ▼
     │   ┌──────────────┐
     │   │   expired    │ ← Passou da validade
     │   └──────────────┘
     │
     ▼
┌──────────────┐
│  converted   │ ← Virou Order
└──────────────┘
```

### 6.2 Estados de Ordem (Order)

```
                    ┌──────────────────────────────────────────────┐
                    │              ESTADOS DA ORDEM                │
                    └──────────────────────────────────────────────┘

         ┌────────────────────┐
         │ orcamento_enviado  │ ← Criada a partir de quote
         └─────────┬──────────┘
                   │ (cliente aceita)
                   ▼
         ┌────────────────────┐
         │aguardando_pagamento│ ← Aguardando pagamento
         └─────────┬──────────┘
                   │ (pagamento OK)
                   ▼
         ┌────────────────────┐
         │      aprovado      │ ← Pagamento confirmado
         └─────────┬──────────┘
                   │ (inicia produção)
                   ▼
         ┌────────────────────┐
         │    em_producao     │ ← Fabricando
         └─────────┬──────────┘
                   │ (produção concluída)
                   ▼
         ┌────────────────────┐
         │   pronto_entrega   │ ← Aguardando agendar
         └─────────┬──────────┘
                   │ (agenda instalação)
                   ▼
         ┌────────────────────┐
         │instalacao_agendada │ ← Data marcada
         └─────────┬──────────┘
                   │ (técnico inicia)
                   ▼
         ┌────────────────────┐
         │     instalando     │ ← Em instalação
         └─────────┬──────────┘
                   │ (finaliza)
                   ▼
         ┌────────────────────┐
         │      concluido     │ ← Serviço entregue
         └────────────────────┘


         Estados alternativos (podem ocorrer em qualquer ponto):

         ┌────────────────────┐
         │     cancelado      │ ← Cliente/empresa cancelou
         └────────────────────┘

         ┌────────────────────┐
         │ aguardando_cliente │ ← Pendência do cliente
         └────────────────────┘

         ┌────────────────────┐
         │     em_revisao     │ ← Ajustes necessários
         └────────────────────┘
```

### 6.3 Estados de Agendamento (Appointment)

```
         ┌──────────────┐
         │  scheduled   │ ← Agendado
         └──────┬───────┘
                │ (cliente confirma)
                ▼
         ┌──────────────┐
         │  confirmed   │ ← Confirmado
         └──────┬───────┘
                │ (técnico inicia)
                ▼
         ┌──────────────┐
         │ in_progress  │ ← Em andamento
         └──────┬───────┘
                │ (finaliza)
                ▼
         ┌──────────────┐
         │  completed   │ ← Concluído
         └──────────────┘


         Estados alternativos:

         ┌──────────────┐
         │  cancelled   │ ← Cancelado
         └──────────────┘

         ┌──────────────┐
         │ rescheduled  │ ← Reagendado
         └──────────────┘

         ┌──────────────┐
         │   no_show    │ ← Cliente ausente
         └──────────────┘
```

---

*Versati Glass User Flows v1.0 - Dezembro 2024*
