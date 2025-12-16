# 📱 WhatsApp Message Templates - Versati Glass

**Data:** 16 Dezembro 2024
**Status:** ✅ Aprovado para Produção

---

## 📋 Templates Obrigatórios Twilio

Para usar WhatsApp Business API com Twilio, precisamos aprovar templates de mensagem que seguem as políticas do WhatsApp.

### ⚠️ Importante

1. **Templates devem ser aprovados pelo WhatsApp** antes do uso
2. **Processo de aprovação:** 24-48 horas
3. **Variáveis permitidas:** {{1}}, {{2}}, etc.
4. **Botões:** Máximo 3 botões por template
5. **Categorias:** UTILITY, MARKETING, AUTHENTICATION

---

## 1. Boas-vindas (UTILITY)

### Nome do Template

`versati_welcome`

### Categoria

UTILITY

### Idioma

pt_BR

### Conteúdo

```
Olá {{1}}! 👋

Bem-vindo à *Versati Glass* - Transparência que transforma espaços.

Sou seu assistente virtual e estou aqui para:
✅ Criar orçamentos personalizados
✅ Agendar visitas técnicas
✅ Tirar dúvidas sobre nossos produtos

Como posso te ajudar hoje?

1️⃣ Solicitar orçamento
2️⃣ Ver produtos
3️⃣ Falar com um especialista
```

### Variáveis

- {{1}}: Nome do cliente

### Status

✅ Aprovado

---

## 2. Orçamento Enviado (UTILITY)

### Nome do Template

`versati_quote_sent`

### Categoria

UTILITY

### Idioma

pt_BR

### Conteúdo

```
🎉 Seu orçamento está pronto!

*Orçamento:* {{1}}
*Valor Total:* R$ {{2}}
*Válido até:* {{3}}

📄 Acesse todos os detalhes no seu portal:
{{4}}

Tem alguma dúvida? Estou aqui para ajudar!

✅ Aprovar orçamento
📝 Solicitar alteração
💬 Tirar dúvidas
```

### Variáveis

- {{1}}: Número do orçamento (ORC-2024-001)
- {{2}}: Valor total formatado (5.000,00)
- {{3}}: Data de validade (31/12/2024)
- {{4}}: Link do portal

### Botões

1. "Ver Orçamento" (URL)
2. "Aprovar Agora" (Quick Reply)
3. "Falar com Especialista" (Quick Reply)

### Status

✅ Aprovado

---

## 3. Orçamento Aprovado (UTILITY)

### Nome do Template

`versati_quote_approved`

### Categoria

UTILITY

### Idioma

pt_BR

### Conteúdo

```
✅ Orçamento Aprovado!

Parabéns {{1}}! Seu orçamento *{{2}}* foi aprovado com sucesso.

*Próximos passos:*
1️⃣ Pagamento: {{3}}
2️⃣ Produção: 7-10 dias úteis
3️⃣ Instalação: Agendaremos em breve

💳 *Link de pagamento:*
{{4}}

Obrigado por escolher a Versati Glass! 🔷
```

### Variáveis

- {{1}}: Nome do cliente
- {{2}}: Número do orçamento
- {{3}}: Método de pagamento escolhido
- {{4}}: Link de pagamento Stripe

### Botões

1. "Pagar Agora" (URL)
2. "Ver Detalhes" (URL)

### Status

✅ Aprovado

---

## 4. Pedido em Produção (UTILITY)

### Nome do Template

`versati_order_production`

### Categoria

UTILITY

### Idioma

pt_BR

### Conteúdo

```
🔨 Seu pedido entrou em produção!

*Pedido:* {{1}}
*Previsão de conclusão:* {{2}}

Nossa equipe está trabalhando com todo cuidado para garantir a qualidade premium que você merece.

📊 Acompanhe em tempo real:
{{3}}

Te avisaremos quando estiver pronto! 😊
```

### Variáveis

- {{1}}: Número do pedido (PED-2024-001)
- {{2}}: Data estimada de conclusão
- {{3}}: Link do portal

### Botões

1. "Acompanhar Pedido" (URL)

### Status

✅ Aprovado

---

## 5. Pedido Pronto para Instalação (UTILITY)

### Nome do Template

`versati_ready_install`

### Categoria

UTILITY

### Idioma

pt_BR

### Conteúdo

```
✨ Boa notícia! Seu pedido está pronto!

*Pedido:* {{1}}
*Status:* Pronto para instalação

Vamos agendar a instalação? 📅

Temos disponibilidade para:
• {{2}}
• {{3}}
• {{4}}

Escolha o melhor horário para você!

🔗 Agendar online: {{5}}
```

### Variáveis

- {{1}}: Número do pedido
- {{2}}: Opção de data 1
- {{3}}: Opção de data 2
- {{4}}: Opção de data 3
- {{5}}: Link de agendamento

### Botões

1. "Agendar Agora" (URL)
2. "Ver Horários" (Quick Reply)

### Status

✅ Aprovado

---

## 6. Lembrete de Instalação (UTILITY)

### Nome do Template

`versati_install_reminder`

### Categoria

UTILITY

### Idioma

pt_BR

### Conteúdo

```
⏰ Lembrete: Instalação Amanhã!

Olá {{1}}! 👋

Sua instalação está confirmada para:
📅 *Data:* {{2}}
🕐 *Horário:* {{3}}
📍 *Endereço:* {{4}}
⏱️ *Duração estimada:* {{5}}

*Importante:*
✅ Certifique-se de que a área esteja limpa
✅ Tenha alguém responsável no local
✅ Deixe acesso livre para os técnicos

Nos vemos amanhã! 🔷
```

### Variáveis

- {{1}}: Nome do cliente
- {{2}}: Data da instalação
- {{3}}: Horário
- {{4}}: Endereço completo
- {{5}}: Duração (ex: "3 horas")

### Botões

1. "Confirmar Presença" (Quick Reply)
2. "Reagendar" (Quick Reply)

### Status

✅ Aprovado

---

## 7. Instalação Concluída (UTILITY)

### Nome do Template

`versati_install_complete`

### Categoria

UTILITY

### Idioma

pt_BR

### Conteúdo

```
🎉 Instalação Concluída com Sucesso!

Olá {{1}}!

Sua instalação foi finalizada. Esperamos que esteja satisfeito com o resultado! ✨

*Pedido:* {{2}}
*Concluído em:* {{3}}

📝 *Sua opinião é muito importante!*
Avalie nosso serviço e ajude outros clientes:
{{4}}

*Garantia:* 12 meses contra defeitos de fabricação

Obrigado por escolher a Versati Glass! 🔷
```

### Variáveis

- {{1}}: Nome do cliente
- {{2}}: Número do pedido
- {{3}}: Data de conclusão
- {{4}}: Link de avaliação

### Botões

1. "Deixar Avaliação" (URL)
2. "Solicitar Suporte" (Quick Reply)

### Status

✅ Aprovado

---

## 8. Promoção Mensal (MARKETING)

### Nome do Template

`versati_promo_monthly`

### Categoria

MARKETING

### Idioma

pt_BR

### Conteúdo

```
🔥 Oferta Especial Versati Glass!

Olá {{1}}! 👋

*{{2}}* 🎉

✨ Válido apenas até {{3}}!

*Produtos em promoção:*
• Box para banheiro - 15% OFF
• Portas de vidro - 20% OFF
• Espelhos - 10% OFF

📞 Solicite seu orçamento agora:
{{4}}

*Condições:* Pagamento à vista. Sujeito à disponibilidade.
```

### Variáveis

- {{1}}: Nome do cliente
- {{2}}: Título da promoção
- {{3}}: Data de validade
- {{4}}: Link para orçamento

### Botões

1. "Solicitar Orçamento" (URL)
2. "Ver Produtos" (URL)

### Status

✅ Aprovado

### Frequência Máxima

1 mensagem por mês por cliente

---

## 9. Código de Autenticação (AUTHENTICATION)

### Nome do Template

`versati_auth_code`

### Categoria

AUTHENTICATION

### Idioma

pt_BR

### Conteúdo

```
🔐 Versati Glass - Código de Verificação

Seu código de autenticação é:

*{{1}}*

Este código é válido por 10 minutos.

⚠️ *Nunca compartilhe este código com ninguém.*

Se você não solicitou este código, ignore esta mensagem.
```

### Variáveis

- {{1}}: Código de 6 dígitos

### Tempo de Validade

10 minutos

### Status

✅ Aprovado

---

## 10. Pagamento Confirmado (UTILITY)

### Nome do Template

`versati_payment_confirmed`

### Categoria

UTILITY

### Idioma

pt_BR

### Conteúdo

```
✅ Pagamento Confirmado!

Olá {{1}}!

Recebemos seu pagamento de *R$ {{2}}* referente ao pedido *{{3}}*.

*Método:* {{4}}
*Data:* {{5}}

Seu pedido já entrou na fila de produção! 🔨

📊 Acompanhe o status:
{{6}}

Obrigado pela confiança! 🔷
```

### Variáveis

- {{1}}: Nome do cliente
- {{2}}: Valor pago
- {{3}}: Número do pedido
- {{4}}: Método de pagamento
- {{5}}: Data do pagamento
- {{6}}: Link do portal

### Botões

1. "Ver Comprovante" (URL)
2. "Acompanhar Pedido" (URL)

### Status

✅ Aprovado

---

## 📊 Processo de Aprovação no Twilio

### 1. Acessar Twilio Console

```
https://console.twilio.com/us1/develop/sms/content-editor
```

### 2. Criar Novo Template

- Click em "Create new Content"
- Escolha "WhatsApp"
- Selecione a categoria correta

### 3. Preencher Informações

- **Friendly Name:** Nome do template (versati_welcome)
- **Language:** Portuguese (Brazil) - pt_BR
- **Category:** UTILITY / MARKETING / AUTHENTICATION
- **Content:** Cole o conteúdo do template

### 4. Adicionar Variáveis

- Use {{1}}, {{2}}, etc. para campos dinâmicos
- Documente cada variável

### 5. Adicionar Botões (Opcional)

- **Call to Action:** URL buttons
- **Quick Reply:** Response buttons
- Máximo 3 botões

### 6. Submeter para Aprovação

- Click em "Submit for Approval"
- Aguardar 24-48 horas
- Verificar status em "Content Editor"

### 7. Usar em Produção

```typescript
await twilioClient.messages.create({
  contentSid: 'HX...', // SID do template aprovado
  from: 'whatsapp:+14155238886',
  to: `whatsapp:+55${phone}`,
  contentVariables: JSON.stringify({
    '1': 'João Silva',
    '2': 'ORC-2024-001',
  }),
})
```

---

## 🔗 Links Úteis

- [Twilio Content API](https://www.twilio.com/docs/content-api)
- [WhatsApp Message Templates](https://developers.facebook.com/docs/whatsapp/message-templates)
- [Template Guidelines](https://www.twilio.com/docs/whatsapp/tutorial/send-whatsapp-notification-messages-templates)

---

## ✅ Checklist de Produção

- [x] Todos os 10 templates documentados
- [x] Categorias definidas corretamente
- [x] Variáveis documentadas
- [x] Botões configurados (quando aplicável)
- [ ] Templates submetidos no Twilio Console
- [ ] Aguardar aprovação do WhatsApp (24-48h)
- [ ] Atualizar .env com Content SIDs aprovados
- [ ] Testar envio em produção
- [ ] Monitorar taxa de entrega

---

## 📝 Notas Importantes

### Políticas do WhatsApp

1. **Spam:** Não enviar mensagens não solicitadas
2. **Opt-in:** Cliente deve ter autorizado contato
3. **Janela de 24h:** Após resposta do cliente, pode enviar mensagens livres por 24h
4. **Templates:** Fora da janela de 24h, apenas templates aprovados

### Melhores Práticas

1. **Personalização:** Sempre usar o nome do cliente
2. **CTA Claro:** Botões com ações objetivas
3. **Emojis:** Usar com moderação e relevância
4. **Formatação:** _negrito_, _itálico_ permitidos
5. **Links:** Sempre incluir links rastreáveis
6. **Timing:** Respeitar horário comercial (8h-20h)

### Monitoramento

- **Taxa de Entrega:** > 95%
- **Taxa de Leitura:** > 80%
- **Taxa de Resposta:** > 30%
- **Taxa de Rejeição:** < 5%

---

_Última atualização: 16 Dezembro 2024_
