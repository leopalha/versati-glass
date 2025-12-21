# 📋 Templates WhatsApp - Meta Business Manager

**Guia Completo para Criar Templates Aprovados**

---

## 🔗 Link Direto

**Acesse:** https://business.facebook.com/wa/manage/message-templates/

---

## 📝 TEMPLATE 1: Novo Orçamento (Para Empresa)

### Informações Básicas

- **Template name:** `novo_orcamento`
- **Category:** `UTILITY` (Notificações transacionais)
- **Languages:** Portuguese (BR)

### Header (Cabeçalho)

- **Type:** None (Sem cabeçalho)

### Body (Corpo da Mensagem)

```
🔔 *Novo Orçamento Recebido*

Nº {{1}}
Cliente: {{2}}
Itens: {{3}}

Acesse o painel admin para revisar.
```

### Footer (Rodapé)

```
Versati Glass - Vidros Premium
```

### Buttons (Botões)

- **Type:** None (Sem botões por enquanto)

### Variáveis (Samples)

Para aprovação, você precisa fornecer exemplos:

1. `ORC-2024-0001` (Número do orçamento)
2. `João Silva` (Nome do cliente)
3. `2 itens` (Quantidade de itens)

---

## 📝 TEMPLATE 2: Agendamento Criado (Para Empresa)

### Informações Básicas

- **Template name:** `agendamento_criado`
- **Category:** `UTILITY`
- **Languages:** Portuguese (BR)

### Header

- **Type:** None

### Body

```
📅 *{{1}} Agendada*

Cliente: {{2}}
Data: {{3}} às {{4}}
Endereço: {{5}}

Não esqueça de confirmar presença com o cliente!
```

### Footer

```
Versati Glass
```

### Buttons

- **Type:** None

### Variáveis (Samples)

1. `Visita Técnica` (Tipo de agendamento)
2. `Maria Santos` (Nome do cliente)
3. `25/12/2024` (Data)
4. `14:30` (Hora)
5. `Rua das Flores, 123 - Copacabana` (Endereço)

---

## 📝 TEMPLATE 3: Orçamento Aprovado (Para Cliente)

### Informações Básicas

- **Template name:** `orcamento_aprovado`
- **Category:** `UTILITY`
- **Languages:** Portuguese (BR)

### Header

- **Type:** Text
- **Text:** `✅ Orçamento Aprovado`

### Body

```
Olá {{1}}!

Seu orçamento #{{2}} foi aprovado com sucesso!

Valor total: R$ {{3}}

Próximo passo: {{4}}

Qualquer dúvida, estamos à disposição!
```

### Footer

```
Versati Glass - Vidros Premium
```

### Buttons

- **Type:** Call to action
- **Button 1:**
  - Type: URL
  - Text: `Ver Pedido`
  - URL: `https://versatiglass.com.br/portal/pedidos`

### Variáveis (Samples)

1. `João` (Nome do cliente)
2. `ORC-2024-0001` (Número do orçamento)
3. `1.500,00` (Valor)
4. `aguardando pagamento` (Próxima ação)

---

## 📝 TEMPLATE 4: Lembrete de Agendamento (Para Cliente)

### Informações Básicas

- **Template name:** `lembrete_agendamento`
- **Category:** `UTILITY`
- **Languages:** Portuguese (BR)

### Header

- **Type:** Text
- **Text:** `⏰ Lembrete`

### Body

```
Olá {{1}}!

Lembramos que sua {{2}} está agendada para:

📅 {{3}} às {{4}}
📍 {{5}}

Estaremos aí pontualmente!

Caso precise reagendar, entre em contato o quanto antes.
```

### Footer

```
Versati Glass
```

### Buttons

- **Type:** Quick Reply
- **Button 1:** `Confirmar Presença`
- **Button 2:** `Preciso Reagendar`

### Variáveis (Samples)

1. `Maria` (Nome)
2. `visita técnica` (Tipo)
3. `25/12/2024` (Data)
4. `14:30` (Hora)
5. `Rua das Flores, 123` (Endereço)

---

## 📝 TEMPLATE 5: Atualização de Status (Para Cliente)

### Informações Básicas

- **Template name:** `status_pedido`
- **Category:** `UTILITY`
- **Languages:** Portuguese (BR)

### Header

- **Type:** Text
- **Text:** `📦 Atualização do Pedido`

### Body

```
Olá {{1}}!

Seu pedido #{{2}} foi atualizado.

Status atual: {{3}}

{{4}}

Acompanhe seu pedido pelo portal.
```

### Footer

```
Versati Glass - Vidros Premium
```

### Buttons

- **Type:** Call to action
- **Button 1:**
  - Type: URL
  - Text: `Ver Pedido`
  - URL: `https://versatiglass.com.br/portal/pedidos`

### Variáveis (Samples)

1. `João` (Nome)
2. `PED-2024-0001` (Número do pedido)
3. `Em Produção` (Status)
4. `Seu pedido está sendo fabricado e ficará pronto em 3 dias.` (Mensagem adicional)

---

## 🎯 PASSO A PASSO: Como Criar no Meta Business Manager

### 1. Acessar a Página de Templates

```
https://business.facebook.com/wa/manage/message-templates/
```

### 2. Clicar em "Create Template"

- Botão azul no canto superior direito

### 3. Preencher Informações Básicas

- **Template name:** Usar exatamente os nomes acima (sem espaços, underscore)
- **Category:** Selecionar `UTILITY`
- **Languages:** Selecionar `Portuguese (Brazil)`

### 4. Configurar Componentes

#### Header (Cabeçalho) - Opcional

- Clicar em "+ Add header" se o template tiver
- Escolher tipo: `Text` ou `None`
- Se Text, digitar o texto exato

#### Body (Corpo) - Obrigatório

- Clicar no campo de texto
- Copiar e colar o texto do template
- Quando tiver `{{1}}`, clicar em "Add Variable"
- Repetir para cada variável

#### Footer (Rodapé) - Opcional

- Clicar em "+ Add footer"
- Digitar o texto do rodapé

#### Buttons (Botões) - Opcional

- Clicar em "+ Add buttons"
- Escolher tipo:
  - `Call to action` → Para URLs ou telefone
  - `Quick reply` → Para respostas rápidas
- Configurar cada botão

### 5. Fornecer Samples (Exemplos)

- No final da página, preencher exemplos para cada variável
- Usar os samples fornecidos acima

### 6. Submit for Review

- Clicar em "Submit"
- Aguardar aprovação (15 minutos a 24 horas)

---

## ⏱️ Tempo de Aprovação

**Normal:** 15 minutos a 2 horas
**Máximo:** 24-48 horas

**Você receberá notificação por email quando aprovado.**

---

## 🚨 Dicas Importantes

### ✅ O Que Fazer

- Usar categoria UTILITY para notificações transacionais
- Fornecer samples realistas
- Usar linguagem clara e profissional
- Incluir nome da empresa no footer

### ❌ O Que Evitar

- Não usar linguagem promocional excessiva
- Não pedir dados sensíveis (senhas, cartões)
- Não usar CAPS LOCK excessivo
- Não incluir URLs encurtadas (use URLs completas)

### 📝 Sobre Variáveis

- Máximo de 10 variáveis por template
- Sempre fornecer exemplos válidos
- Variáveis são numeradas: {{1}}, {{2}}, {{3}}...

---

## 🔄 Depois da Aprovação

Quando os templates forem aprovados, você verá o **Template ID**.

**Exemplo:**

- Template Name: `novo_orcamento`
- Template ID: `HX1234567890abcdef` (gerado pelo Meta)

Você pode usar de 2 formas:

### Opção 1: Por Nome (Mais Fácil)

O código já está preparado para funcionar assim. Não precisa mudar nada!

### Opção 2: Por ID (Mais Confiável)

Se quiser usar IDs, atualize em [src/lib/whatsapp-templates.ts](src/lib/whatsapp-templates.ts):

```typescript
export const APPROVED_TEMPLATE_IDS = {
  novo_orcamento: 'HX1234567890abcdef',
  agendamento_criado: 'HX9876543210fedcba',
  // etc...
}
```

---

## 🧪 Testar Depois da Aprovação

Quando templates estiverem aprovados, teste:

```bash
node test-whatsapp-notification.mjs
```

A mensagem agora virá formatada conforme o template aprovado!

---

## 📊 Monitorar Templates

**Ver templates criados:**
https://business.facebook.com/wa/manage/message-templates/

**Ver status:**

- ✅ Approved (Verde) → Pode usar
- ⏳ Pending (Amarelo) → Aguardando aprovação
- ❌ Rejected (Vermelho) → Foi rejeitado, precisa ajustar

**Se rejeitado:**

- Clique no template para ver o motivo
- Ajuste conforme feedback do Meta
- Resubmeta

---

## 🎯 Prioridade de Criação

**Criar AGORA (essenciais):**

1. ✅ `novo_orcamento` → Notifica empresa sobre novos orçamentos
2. ✅ `orcamento_aprovado` → Confirma aprovação para cliente

**Criar DEPOIS (importantes):** 3. `agendamento_criado` → Notifica empresa sobre agendamentos 4. `lembrete_agendamento` → Lembra cliente 24h antes 5. `status_pedido` → Atualiza cliente sobre pedido

---

**Criado em:** 17 Dezembro 2024
**Autor:** Claude (Agent SDK)
**Versão:** 1.0
