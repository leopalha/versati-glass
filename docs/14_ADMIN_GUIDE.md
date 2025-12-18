# 📋 VERSATI GLASS - ADMIN GUIDE

**Versão:** 1.0.0  
**Data:** Dezembro 2024  
**Objetivo:** Manual de operação do painel administrativo

---

## 1. ACESSO AO ADMIN

### 1.1 URL de Acesso

```
Produção: https://versatiglass.com.br/admin
Staging: https://staging.versatiglass.com.br/admin
```

### 1.2 Credenciais

| Perfil    | Permissões                              |
| --------- | --------------------------------------- |
| **Admin** | Acesso total a todas as funcionalidades |
| **Staff** | Gestão de ordens, orçamentos e agenda   |

### 1.3 Primeiro Acesso

1. Acesse a URL do admin
2. Use as credenciais fornecidas
3. Altere sua senha no primeiro acesso
4. Configure seu perfil

---

## 2. DASHBOARD

### 2.1 Visão Geral

O dashboard apresenta uma visão consolidada do negócio:

```
┌─────────────────────────────────────────────────────────┐
│                    DASHBOARD ADMIN                       │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  KPIs PRINCIPAIS                                        │
│  ┌───────────┐ ┌───────────┐ ┌───────────┐ ┌─────────┐ │
│  │ Vendas    │ │ Orçamentos│ │ Leads     │ │ Agenda  │ │
│  │ R$ 45.000 │ │    23     │ │    67     │ │   5     │ │
│  │ ↑ 12%     │ │ pendentes │ │ novos     │ │ hoje    │ │
│  └───────────┘ └───────────┘ └───────────┘ └─────────┘ │
│                                                         │
│  ATIVIDADE RECENTE                                      │
│  • Novo orçamento #123 - Maria (há 5 min)              │
│  • Pagamento confirmado #120 - João (há 15 min)        │
│  • Instalação concluída #115 - Ana (há 1h)             │
│                                                         │
│  ALERTAS                                                │
│  ⚠️ 3 orçamentos expiram hoje                          │
│  ⚠️ 1 instalação pendente de confirmação               │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### 2.2 Métricas Disponíveis

| Métrica      | Período   | Descrição             |
| ------------ | --------- | --------------------- |
| Vendas       | Mês atual | Faturamento total     |
| Orçamentos   | Pendentes | Aguardando resposta   |
| Leads        | Novos     | Últimos 7 dias        |
| Agenda       | Hoje      | Compromissos do dia   |
| Conversão    | Mês       | Taxa de fechamento    |
| Ticket Médio | Mês       | Valor médio por venda |

---

## 3. GESTÃO DE ORDENS

### 3.1 Lista de Ordens

**Filtros disponíveis:**

- Status (todos, em produção, agendados, etc.)
- Data (período)
- Cliente (busca por nome/telefone)
- Produto (categoria)

**Ações rápidas:**

- 👁️ Ver detalhes
- ✏️ Editar
- 📱 Enviar WhatsApp
- 📧 Enviar email

### 3.2 Status das Ordens

| Status               | Cor | Descrição                       | Ação Seguinte       |
| -------------------- | --- | ------------------------------- | ------------------- |
| Orçamento Enviado    | 🔵  | Aguardando aprovação do cliente | Aguardar pagamento  |
| Aguardando Pagamento | 🟡  | Cliente aceitou, falta pagar    | Confirmar pagamento |
| Aprovado             | 🟢  | Pagamento confirmado            | Iniciar produção    |
| Em Produção          | 🟠  | Fabricando o produto            | Marcar como pronto  |
| Pronto para Entrega  | 🔵  | Produto finalizado              | Agendar instalação  |
| Instalação Agendada  | 🟣  | Data marcada                    | Iniciar instalação  |
| Instalando           | 🟠  | Equipe no local                 | Concluir            |
| Concluído            | ✅  | Finalizado                      | -                   |
| Cancelado            | ⛔  | Ordem cancelada                 | -                   |

### 3.3 Detalhes da Ordem

```
┌─────────────────────────────────────────────────────────┐
│  ORDEM #VG-2024-0025                                    │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  CLIENTE                                                │
│  Nome: Maria Silva                                      │
│  WhatsApp: (21) 99999-9999                             │
│  Email: maria@email.com                                 │
│  Endereço: Rua ABC, 123 - Barra da Tijuca              │
│                                                         │
│  ITENS                                                  │
│  ┌────────────────────────────────────────────────┐    │
│  │ Box Elegance - Incolor                         │    │
│  │ 120cm x 190cm                                  │    │
│  │ Qtd: 1 | Valor: R$ 2.500,00                   │    │
│  └────────────────────────────────────────────────┘    │
│                                                         │
│  VALORES                                                │
│  Subtotal: R$ 2.500,00                                 │
│  Desconto: R$ 125,00 (PIX 5%)                          │
│  Total: R$ 2.375,00                                    │
│                                                         │
│  PAGAMENTO                                              │
│  Status: ✅ Pago                                        │
│  Método: PIX                                            │
│  Data: 15/12/2024 14:30                                │
│                                                         │
│  AÇÕES                                                  │
│  [Atualizar Status] [Enviar Mensagem] [Agendar]        │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### 3.4 Atualizando Status

1. Acesse a ordem
2. Clique em "Atualizar Status"
3. Selecione o novo status
4. Adicione uma nota (opcional)
5. Marque "Notificar cliente" se desejar
6. Confirme

**Notificações automáticas:**

- WhatsApp: Mensagem template
- Email: Email transacional
- Portal: Atualização no timeline

### 3.5 Timeline da Ordem

```
📅 TIMELINE

15/12/2024 14:30 ──── ✅ Pagamento confirmado
                      Sistema

15/12/2024 10:15 ──── 📝 Orçamento aceito pelo cliente
                      Cliente via Portal

14/12/2024 16:00 ──── 📧 Orçamento enviado
                      Admin (João)

14/12/2024 15:30 ──── 🏠 Visita técnica realizada
                      Técnico (Carlos)
                      Nota: Medidas confirmadas, cliente
                      escolheu modelo Elegance
```

---

## 4. GESTÃO DE ORÇAMENTOS

### 4.1 Novo Orçamento (Manual)

1. Clique em "Novo Orçamento"
2. Preencha dados do cliente
3. Adicione itens
4. Configure valores
5. Revise e envie

### 4.2 Orçamentos Pendentes

Lista de orçamentos aguardando:

- Resposta do cliente
- Aprovação interna
- Ajuste de valores

**Ações:**

- Reenviar orçamento
- Editar valores
- Entrar em contato
- Marcar como perdido

### 4.3 Validade

- Padrão: 7 dias
- Pode ser ajustado por orçamento
- Sistema alerta sobre expirações

---

## 5. GESTÃO DE CLIENTES

### 5.1 Lista de Clientes

**Busca por:**

- Nome
- Email
- Telefone
- CPF/CNPJ

**Filtros:**

- Com ordens ativas
- Novos (últimos 30 dias)
- Inativos (sem interação há 6+ meses)

### 5.2 Perfil do Cliente

```
┌─────────────────────────────────────────────────────────┐
│  CLIENTE: Maria Silva                                   │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  DADOS                                                  │
│  Email: maria@email.com                                 │
│  WhatsApp: (21) 99999-9999                             │
│  CPF: 123.456.789-00                                   │
│  Cliente desde: 01/06/2024                             │
│                                                         │
│  ENDEREÇOS                                              │
│  🏠 Principal: Rua ABC, 123 - Barra da Tijuca          │
│  🏢 Trabalho: Av. XYZ, 456 - Centro                    │
│                                                         │
│  HISTÓRICO                                              │
│  ├── #VG-2024-0025 | Box Elegance | R$ 2.375 | ✅     │
│  ├── #VG-2024-0010 | Espelho LED  | R$ 890   | ✅     │
│  └── #VG-2024-0005 | Consulta     | -        | ❌     │
│                                                         │
│  ESTATÍSTICAS                                           │
│  Total gasto: R$ 3.265,00                              │
│  Ordens: 2                                              │
│  Ticket médio: R$ 1.632,50                             │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## 6. AGENDA

### 6.1 Visão de Calendário

- **Mensal:** Visão geral do mês
- **Semanal:** Detalhes da semana
- **Diária:** Compromissos do dia

### 6.2 Tipos de Agendamento

| Tipo           | Cor        | Duração Padrão |
| -------------- | ---------- | -------------- |
| Visita Técnica | 🔵 Azul    | 1 hora         |
| Instalação     | 🟢 Verde   | 2-4 horas      |
| Manutenção     | 🟠 Laranja | 1 hora         |
| Revisão        | 🟣 Roxo    | 30 min         |

### 6.3 Novo Agendamento

1. Selecione a data no calendário
2. Escolha o horário disponível
3. Selecione o tipo
4. Vincule a uma ordem (se aplicável)
5. Adicione notas
6. Confirme

### 6.4 Horários Disponíveis

**Configuração padrão:**

- Segunda a Sexta: 08:30 - 18:00
- Sábado: 08:30 - 12:30
- Domingo: Fechado

**Slots:**

- Manhã: 08:30, 10:00, 11:30
- Tarde: 14:00, 15:30, 17:00

### 6.5 Notificações

**Cliente recebe:**

- Confirmação do agendamento
- Lembrete 24h antes
- Lembrete 2h antes
- Confirmação de conclusão

**Admin recebe:**

- Novos agendamentos
- Cancelamentos
- Reagendamentos

---

## 7. CONVERSAS WHATSAPP

### 7.1 Painel de Conversas

```
┌─────────────────────────────────────────────────────────┐
│  CONVERSAS WHATSAPP                                     │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  FILTROS: [Todas] [Ativas] [Aguardando] [Humano]       │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │ 🟢 Maria Silva        (21) 99999-9999           │   │
│  │ Última: "Qual o prazo de entrega?"  há 2 min   │   │
│  │ Status: Atendimento IA                          │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │ 🟡 João Santos        (21) 88888-8888           │   │
│  │ Última: "Preciso falar com alguém"  há 15 min  │   │
│  │ Status: Aguardando Humano ⚠️                    │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### 7.2 Assumir Conversa

Quando a IA escala para humano:

1. Conversa aparece com flag "Aguardando Humano"
2. Clique em "Assumir"
3. Você passa a responder diretamente
4. IA fica em standby
5. Ao finalizar, clique em "Devolver para IA"

### 7.3 Histórico

Toda conversa mantém histórico completo:

- Mensagens do cliente
- Respostas da IA
- Intervenções humanas
- Contexto coletado

### 7.4 Estados de Conversação IA

| Estado            | Descrição                      | Ação Necessária              |
| ----------------- | ------------------------------ | ---------------------------- |
| **ACTIVE**        | Cliente interagindo com IA     | Nenhuma - IA gerenciando     |
| **IDLE**          | Sem interação há >30min        | Nenhuma - aguardando retorno |
| **WAITING_HUMAN** | Cliente solicitou atendente    | ⚠️ Assumir conversa          |
| **ESCALATED**     | IA não conseguiu resolver      | ⚠️ Revisar e assumir         |
| **HUMAN_ACTIVE**  | Atendente humano respondendo   | Finalizar quando resolver    |
| **CONVERTED**     | Gerou orçamento/agendamento    | Acompanhar no CRM            |
| **ARCHIVED**      | Conversa antiga (>24h inativa) | Nenhuma - histórico          |

### 7.5 Métricas de IA

**Dashboard de Performance** (`/admin/ai-metrics`):

```
┌─────────────────────────────────────────────────────────┐
│  PERFORMANCE DA IA - ÚLTIMOS 30 DIAS                    │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  CONVERSAS                                              │
│  Total: 487 conversas                                   │
│  Média/dia: 16.2                                        │
│                                                         │
│  TAXA DE CONVERSÃO                                      │
│  ████████████████░░░░  42% → Orçamento gerado          │
│  Target: >40%  ✅                                       │
│                                                         │
│  TAXA DE ESCALAÇÃO                                      │
│  ███░░░░░░░░░░░░░░░░  12% → Humano assumiu             │
│  Target: <15%  ✅                                       │
│                                                         │
│  TEMPO MÉDIO DE CONVERSA                                │
│  ⏱️ 4.2 minutos                                         │
│  Target: 3-5min  ✅                                     │
│                                                         │
│  SATISFAÇÃO (pós-conversa)                              │
│  ⭐⭐⭐⭐⭐  4.7/5.0                                      │
│  Target: >4.5  ✅                                       │
│                                                         │
│  TOP INTENTS IDENTIFICADOS                              │
│  1. Orçamento Box (42%)                                 │
│  2. Consulta de Preço (28%)                             │
│  3. Status de Pedido (15%)                              │
│  4. Agendamento (10%)                                   │
│  5. Outros (5%)                                         │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### 7.6 Quando Assumir uma Conversa

**Situações que requerem intervenção humana:**

✅ **Assumir imediatamente:**

- Cliente solicitou explicitamente ("falar com atendente")
- Reclamação ou insatisfação detectada
- Negociação de preço/desconto
- Problema técnico ou urgência crítica
- IA não conseguiu resolver após 3 tentativas
- Cliente confuso ou frustrado

⏸️ **Pode aguardar:**

- Cliente apenas explorando (ainda não decidiu)
- Perguntas simples que IA está respondendo bem
- Conversa no início (coleta de informações)

❌ **Não assumir:**

- IA está coletando dados básicos (nome, telefone, etc)
- Cliente respondendo perguntas normalmente
- Conversa fluindo sem problemas

### 7.7 Boas Práticas ao Atender

**Ao assumir uma conversa:**

1. **Leia o histórico completo** - Entenda o contexto antes de responder
2. **Apresente-se** - "Olá! Aqui é [Nome] da Versati Glass. Como posso ajudar?"
3. **Reconheça o contexto** - "Vi que você está interessado em um box elegance..."
4. **Seja pessoal e empático** - Use o nome do cliente
5. **Resolva rapidamente** - Cliente já esperou, seja objetivo
6. **Documente** - Adicione notas internas se necessário
7. **Finalize adequadamente** - Confirme se resolveu tudo antes de devolver à IA

**Exemplo de transição suave:**

```
[IA]: O cliente solicitou falar com um atendente humano.

[VOCÊ]: Olá Maria! Aqui é a Juliana da Versati Glass 😊
       Vi que você está interessada no Box Elegance.
       Em que posso ajudar especificamente?

[CLIENTE]: Queria saber se consigo desconto...

[VOCÊ]: Com certeza! Para compras à vista conseguimos...
```

### 7.8 Análise de Imagens pela IA

Quando cliente envia foto do banheiro/local:

**IA automaticamente analisa:**

- Tipo de produto necessário (box, espelho, etc)
- Medidas aproximadas (largura x altura)
- Acabamentos visíveis (revestimentos, cores)
- Recomendações de produto

**Você pode revisar:**

- Acesse a conversa
- Clique na imagem enviada
- Veja "Análise da IA" no painel lateral
- Corrija se necessário antes de confirmar orçamento

```
┌─────────────────────────────────────────────────────────┐
│  ANÁLISE DE IMAGEM                                      │
├─────────────────────────────────────────────────────────┤
│  📷 banheiro-cliente.jpg                                │
│                                                         │
│  IDENTIFICADO:                                          │
│  ✓ Box frontal para banheira                           │
│  ✓ Dimensões: ~1.20m (L) x 1.90m (A)                   │
│  ✓ Revestimento claro (porcelanato)                    │
│  ✓ Sem obstáculos aparentes                            │
│                                                         │
│  RECOMENDAÇÃO:                                          │
│  Box de Correr (economiza espaço)                      │
│  Ferragem: Preto ou Inox (combina)                     │
│  Valor estimado: R$ 1.600 - R$ 2.100                   │
│                                                         │
│  CONFIANÇA: 92%  ⭐⭐⭐⭐⭐                              │
│                                                         │
│  [Aprovar Análise]  [Editar]  [Reprocessar]            │
└─────────────────────────────────────────────────────────┘
```

### 7.9 Dados Extraídos pela IA

A IA extrai automaticamente informações estruturadas:

**Dados coletados:**

- Nome do cliente
- Telefone
- Endereço (CEP + Rua)
- Tipo de produto desejado
- Modelo/preferências (cor, tamanho)
- Medidas aproximadas
- Urgência/prazo
- Budget estimado

**Você pode:**

- Revisar dados extraídos em "Resumo da Conversa"
- Corrigir informações incorretas
- Completar campos faltantes
- Criar orçamento diretamente dos dados extraídos

```
┌─────────────────────────────────────────────────────────┐
│  DADOS EXTRAÍDOS - Conversa #1234                       │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  CLIENTE:                                               │
│  Nome: João Silva                        [Editar]      │
│  Telefone: (21) 98253-6229              [Editar]      │
│  Email: joao.silva@email.com            [Editar]      │
│                                                         │
│  ENDEREÇO:                                              │
│  CEP: 22745-005                         [Editar]      │
│  Rua: Estrada Rodrigues Caldas, 100     [Editar]      │
│  Bairro: Freguesia                      [Editar]      │
│  Cidade: Rio de Janeiro - RJ            [Editar]      │
│                                                         │
│  PRODUTO:                                               │
│  Tipo: Box para Banheiro                [Editar]      │
│  Modelo: Elegance                       [Editar]      │
│  Cor Ferragem: Preto                    [Editar]      │
│  Medidas: 120cm x 190cm (aproximado)    [Editar]      │
│                                                         │
│  CONTEXTO:                                              │
│  Urgência: Normal                       [Editar]      │
│  Budget: R$ 1.500 - R$ 2.000            [Editar]      │
│  Observações: "Precisa agendar visita"  [Editar]      │
│                                                         │
│  [Criar Orçamento]  [Criar Cliente]  [Agendar Visita] │
└─────────────────────────────────────────────────────────┘
```

### 7.10 Troubleshooting

**Problemas comuns e soluções:**

| Problema           | Causa                      | Solução                                   |
| ------------------ | -------------------------- | ----------------------------------------- |
| IA não responde    | Rate limit excedido (Groq) | Aguardar 1 min ou usar fallback           |
| IA responde errado | Contexto perdido           | Resetar conversa ou assumir               |
| Cliente confuso    | IA não entendeu pergunta   | Assumir e esclarecer                      |
| Imagem não analisa | Erro OpenAI API            | Verificar logs, pedir para reenviar       |
| Conversa travada   | Timeout na API             | Recarregar painel                         |
| Dados incorretos   | IA extraiu errado          | Corrigir manualmente antes de criar quote |

**Logs de IA** (`/admin/ai-logs`):

- Ver todas chamadas à API
- Identificar erros de integração
- Monitorar uso de tokens
- Audit trail completo

### 7.11 Configurações da IA

**Ajustes disponíveis** (`/admin/config/ai`):

| Configuração          | Valor Padrão | Descrição                               |
| --------------------- | ------------ | --------------------------------------- |
| **Max Tokens**        | 800          | Limite de tokens por resposta           |
| **Temperature**       | 0.7          | Criatividade (0=factual, 1=criativo)    |
| **Timeout Idle**      | 30 min       | Tempo para marcar conversa como IDLE    |
| **Auto-escalate**     | Após 3 erros | Quando transferir para humano           |
| **Fallback Mode**     | Enabled      | Usar respostas padrão se IA falhar      |
| **Vision Confidence** | 85%          | Confiança mínima para análise de imagem |

**System Prompts:**

- Editar personalidade da "Ana"
- Adicionar conhecimento específico de produtos
- Ajustar tom de voz
- Configurar respostas padrão para situações comuns

---

## 8. FINANCEIRO

### 8.1 Visão Geral

```
┌─────────────────────────────────────────────────────────┐
│  FINANCEIRO - DEZEMBRO 2024                             │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  RECEITAS                                               │
│  ┌─────────────────────────────────────────────────┐   │
│  │ Vendas confirmadas    R$ 45.000,00              │   │
│  │ A receber             R$ 12.500,00              │   │
│  │ Total esperado        R$ 57.500,00              │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  POR MÉTODO                                             │
│  PIX................ R$ 25.000 (55%)                   │
│  Cartão............ R$ 15.000 (33%)                   │
│  Boleto............ R$ 5.000  (12%)                   │
│                                                         │
│  PAGAMENTOS PENDENTES                                   │
│  #VG-2024-0030 | R$ 3.500 | Vence: 20/12              │
│  #VG-2024-0028 | R$ 2.200 | Vence: 18/12              │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### 8.2 Confirmação Manual de Pagamento

Para pagamentos que não são automáticos (boleto, depósito):

1. Acesse a ordem
2. Clique em "Confirmar Pagamento"
3. Selecione o método
4. Informe valor e data
5. Anexe comprovante (opcional)
6. Confirme

---

## 9. PRODUTOS

### 9.1 Catálogo

Gestão do catálogo de produtos:

- Adicionar novos produtos
- Editar informações
- Ativar/desativar
- Gerenciar imagens

### 9.2 Campos do Produto

| Campo           | Descrição          | Obrigatório |
| --------------- | ------------------ | ----------- |
| Nome            | Nome do produto    | ✅          |
| Slug            | URL amigável       | ✅          |
| Categoria       | Box, Espelho, etc. | ✅          |
| Descrição       | Texto completo     | ✅          |
| Descrição Curta | Resumo             | ✅          |
| Imagens         | Galeria            | ✅ (min 1)  |
| Tipo de Preço   | Fixo, m², Consulta | ✅          |
| Preço Base      | Valor inicial      | Depende     |
| Cores           | Opções disponíveis | ❌          |
| Ativo           | Visível no site    | ✅          |
| Destaque        | Aparece na home    | ❌          |

---

## 10. CONFIGURAÇÕES

### 10.1 Empresa

- Nome da empresa
- CNPJ
- Endereço
- Telefones
- Emails
- Redes sociais

### 10.2 Horários

- Horário de funcionamento
- Slots de agendamento
- Feriados

### 10.3 Notificações

- Templates de WhatsApp
- Templates de Email
- Configurações de envio

### 10.4 Usuários

- Adicionar usuários
- Gerenciar permissões
- Resetar senhas

### 10.5 Integrações

- Twilio (WhatsApp)
- Stripe (Pagamentos)
- Google Calendar

---

## 11. BOAS PRÁTICAS

### 11.1 Atendimento

✅ **Faça:**

- Responda rapidamente (< 5 min)
- Personalize as mensagens
- Confirme informações importantes
- Documente tudo no sistema

❌ **Evite:**

- Deixar cliente sem resposta
- Prometer prazos impossíveis
- Esquecer de atualizar status
- Usar linguagem informal demais

### 11.2 Gestão de Ordens

✅ **Faça:**

- Atualize status em tempo real
- Notifique o cliente de mudanças
- Mantenha timeline atualizada
- Anexe documentos relevantes

❌ **Evite:**

- Status desatualizado
- Falta de comunicação
- Perder documentos
- Ignorar alertas

### 11.3 Agenda

✅ **Faça:**

- Confirme agendamentos com antecedência
- Reserve tempo de deslocamento
- Tenha backup para imprevistos
- Registre notas pós-atendimento

❌ **Evite:**

- Overbooking
- Atrasos frequentes
- Não confirmar presença
- Esquecer de atualizar status

---

## 12. SUPORTE

### 12.1 Problemas Comuns

| Problema                | Solução                              |
| ----------------------- | ------------------------------------ |
| Não consigo logar       | Verifique credenciais, limpe cache   |
| Página não carrega      | Atualize a página, verifique conexão |
| WhatsApp não envia      | Verifique status do Twilio           |
| Pagamento não confirmou | Verifique webhooks do Stripe         |

### 12.2 Contato

**Suporte Técnico:**

- Email: suporte@versatiglass.com.br
- WhatsApp: (21) 98253-6229

---

_Versati Glass Admin Guide v1.0 - Dezembro 2024_
