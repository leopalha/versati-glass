# 📱 Como Funciona o WhatsApp do Sistema

## 🎯 Conceito Simples

O sistema usa **Twilio** para enviar mensagens WhatsApp automaticamente.

**Você NÃO precisa acessar nada no Twilio!** Tudo funciona automaticamente.

---

## 📊 Como Funciona

### Quando Cliente Cria Orçamento:

1. **Cliente preenche formulário** no site
2. **Sistema cria orçamento** no banco de dados
3. **Sistema envia WhatsApp automático** via Twilio
4. **Mensagem chega no SEU WhatsApp pessoal**

### Fluxo da Mensagem:

```
Sistema Versati Glass
        ↓
    Twilio API
        ↓
Número Twilio: +1 820 732 0393
        ↓
Seu WhatsApp: +55 21 99535-4010
```

---

## 📱 ONDE VER AS MENSAGENS

### No Seu WhatsApp Pessoal:

1. **Abra o WhatsApp** no seu celular (+55 21 99535-4010)

2. **Procure conversa de:** `+1 820 732 0393`
   - Esse é o número do Twilio (remetente)
   - É um número americano

3. **As mensagens vão ter este formato:**

```
📋 Novo Orçamento - Versati Glass

Número: ORC-2025-0013
Cliente: Leonardo Palha
Itens: 1
Total: R$ 1.500,00

📞 Contato: +5521995354010
📍 Barra da Tijuca, Rio de Janeiro

🔗 Ver no painel admin
```

---

## 🧪 COMO TESTAR

### Opção 1: Criar Orçamento pelo Site

1. Acesse: http://localhost:3000/orcamento
2. Preencha todas as etapas
3. Clique em "Enviar Orçamento"
4. **Verifique seu WhatsApp!**

### Opção 2: Via Script de Teste

```bash
node criar-orcamento-teste-real.mjs
```

Isso cria um orçamento de teste e envia WhatsApp automaticamente.

---

## 🔍 VERIFICAR SE MENSAGEM FOI ENVIADA

### Pelo Console Twilio (Opcional):

Se quiser confirmar que a mensagem foi enviada:

1. Acesse: https://console.twilio.com/
2. Login com as credenciais do Twilio
3. Vá em "Monitor" → "Logs" → "Messaging"
4. Veja todas as mensagens enviadas

**Mas você NÃO precisa fazer isso!** As mensagens chegam automaticamente no seu WhatsApp.

---

## 📊 MENSAGENS QUE VOCÊ VAI RECEBER

### 1. Novo Orçamento Criado

Toda vez que alguém cria orçamento no site.

### 2. Novo Agendamento

Quando cliente agenda visita/instalação.

### 3. Orçamento Aprovado

Quando cliente aceita orçamento (mensagem vai para o cliente, não para você).

---

## ⚙️ CONFIGURAÇÃO ATUAL

```env
TWILIO_WHATSAPP_NUMBER="whatsapp:+18207320393"  (Remetente)
NEXT_PUBLIC_COMPANY_WHATSAPP="+5521995354010"   (Você)
```

**Está tudo configurado! Você só precisa abrir seu WhatsApp.**

---

## ❓ FAQ

### Q: Preciso instalar algum app do Twilio?

**A:** NÃO! Use seu WhatsApp normal.

### Q: Onde vejo as mensagens?

**A:** No seu WhatsApp pessoal (+55 21 99535-4010).

### Q: De qual número vem a mensagem?

**A:** Do número americano do Twilio: +1 820 732 0393

### Q: Posso responder essas mensagens?

**A:** Tecnicamente sim, mas é melhor não. São notificações automáticas.

### Q: Como sei se está funcionando?

**A:** Execute `node test-whatsapp.mjs` e veja se recebe a mensagem.

### Q: Quanto custa?

**A:** R$ 0,026 por mensagem (~R$ 3-20/mês).
No sandbox do Twilio é GRÁTIS.

### Q: Preciso acessar o Twilio para ver algo?

**A:** NÃO! Tudo chega no seu WhatsApp automaticamente.

---

## ✅ CHECKLIST

- [x] Twilio configurado
- [x] Seu número (+5521995354010) configurado
- [x] Mensagem de teste enviada
- [ ] Você verificou seu WhatsApp?
- [ ] Encontrou a mensagem vinda de +1 820 732 0393?

---

## 🎯 PRÓXIMO PASSO

**AGORA:** Abra seu WhatsApp e procure mensagens de +1 820 732 0393!

Se não encontrar, execute:

```bash
node test-whatsapp.mjs
```

E aguarde alguns segundos.

---

**💡 DICA:** Salve o número +1 820 732 0393 como "Versati Glass - Notificações" no seu WhatsApp para facilitar!
