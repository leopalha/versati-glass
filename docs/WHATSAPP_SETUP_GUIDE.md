# 📱 Guia de Configuração WhatsApp - Versati Glass

## 🎯 Objetivo

Configurar o número Twilio **+1 820-732-0393** para enviar/receber mensagens WhatsApp automaticamente via plataforma Versati Glass.

---

## ⚠️ IMPORTANTE: Entenda a Diferença

### WhatsApp Business App (Celular) ❌

- Aplicativo instalado no celular
- Usa número de telefone normal
- **NÃO funciona com número Twilio**
- Limite: ~256 mensagens/dia

### WhatsApp Business API (Twilio) ✅

- **NÃO tem aplicativo de celular**
- Funciona via código/API
- Integrado ao sistema Versati Glass
- Sem limite de mensagens
- **É o que você está usando!**

---

## 📋 Status Atual

### ✅ Configurado

- [x] Conta Twilio criada
- [x] Número +1 820-732-0393 adquirido
- [x] Credenciais no arquivo `.env`
- [x] Código de integração implementado
- [x] Endpoints de API prontos

### ⏳ Pendente

- [ ] Ativação do número para WhatsApp (aprovação Meta)
- [ ] Configuração de webhook
- [ ] Criação de templates de mensagem
- [ ] Teste em produção

---

## 🚀 Opção 1: TESTE RÁPIDO (Sandbox)

**Use isto para testar HOJE mesmo no seu celular!**

### Passo 1: Ativar Sandbox no Celular

1. Abra WhatsApp no seu celular
2. Adicione o número: **+1 415 523 8886** (Sandbox do Twilio)
3. Envie a mensagem exata: **"join electricity-about"**
4. Você receberá confirmação: "You are all set!"

### Passo 2: Testar Integração

```bash
# Executar script de teste
node scripts/test-twilio-whatsapp.mjs

# Para enviar mensagem de teste
node scripts/test-twilio-whatsapp.mjs --send
```

### Passo 3: Testar no Sistema

1. Inicie o servidor dev:

```bash
pnpm dev
```

2. Envie uma mensagem para **+1 415 523 8886** do seu celular
3. O webhook receberá (se configurado) ou você pode testar via admin

### ⚠️ Limitações do Sandbox

- ❌ Apenas números que enviaram "join" podem receber mensagens
- ❌ Número é compartilhado (outras pessoas usam o mesmo)
- ✅ Perfeito para testes e desenvolvimento

---

## 🏆 Opção 2: PRODUÇÃO (Número Real)

**Para usar o número +1 820-732-0393 em produção**

### Passo 1: Submeter Número para Aprovação WhatsApp

1. Acesse: https://console.twilio.com/us1/develop/sms/senders/whatsapp-senders

2. Clique em **"Request to enable WhatsApp"**

3. Selecione o número: **+1 820-732-0393**

4. Preencha o formulário:
   - **Business Name**: Versati Glass
   - **Business Description**: Vidraçaria especializada em Box para Banheiro, Espelhos, Portas, Janelas e Fachadas de Vidro
   - **Business Website**: (seu domínio)
   - **Business Profile**: Sua foto de perfil
   - **About**: Descrição da empresa

5. Submeta e aguarde aprovação (24-72 horas)

### Passo 2: Criar Templates de Mensagem

**Enquanto aguarda aprovação**, crie templates no Facebook Business Manager:

1. Acesse: https://business.facebook.com/wa/manage/message-templates/

2. Crie templates para:

#### Template: Orçamento Enviado

```
Nome: quote_sent
Categoria: UTILITY
Idioma: pt_BR

Mensagem:
Olá {{1}}!

Seu orçamento #{{2}} foi enviado.
Valor: R$ {{3}}
Válido até: {{4}}

Acesse seu portal para ver os detalhes:
{{5}}

Dúvidas? Responda esta mensagem!
```

#### Template: Pedido Aprovado

```
Nome: order_approved
Categoria: UTILITY
Idioma: pt_BR

Mensagem:
Olá {{1}}!

Seu pedido #{{2}} foi aprovado!
Previsão de entrega: {{3}}

Acompanhe o status pelo portal:
{{4}}
```

#### Template: Lembrete de Agendamento

```
Nome: appointment_reminder
Categoria: UTILITY
Idioma: pt_BR

Mensagem:
Olá {{1}}!

Amanhã, {{2}} às {{3}}, nossa equipe estará em seu endereço para {{4}}.

Endereço: {{5}}

Precisa reagendar? Responda esta mensagem!
```

3. Aguarde aprovação dos templates (1-2 dias)

### Passo 3: Configurar Webhook

Após aprovação do número:

1. Acesse: https://console.twilio.com/us1/develop/sms/settings/whatsapp-sandbox

2. Configure:
   - **WHEN A MESSAGE COMES IN**
     - URL: `https://seu-dominio.com/api/whatsapp/webhook`
     - Method: `POST`

3. Salve

### Passo 4: Atualizar .env

```bash
# Atualizar para usar número real (já está configurado)
TWILIO_WHATSAPP_NUMBER="+18207320393"
```

### Passo 5: Deploy e Teste

1. Faça deploy da aplicação

2. Teste enviando mensagem do seu celular para: **+1 820-732-0393**

3. Verifique no painel admin se a conversa foi criada

---

## 🔧 Verificar Configuração Atual

### 1. Testar Conexão Twilio

```bash
node scripts/test-twilio-whatsapp.mjs
```

Resultado esperado:

```
✅ Conectado com sucesso!
   Account Name: Versati Glass
   Status: active
   Type: Full

📞 Verificando número WhatsApp...
✅ Número encontrado: +18207320393
```

### 2. Verificar Variáveis de Ambiente

```bash
# Verificar .env
cat .env | grep TWILIO
```

Deve mostrar:

```
TWILIO_ACCOUNT_SID="AC3c1339fa3ecac14202ae6b810019f0ae"
TWILIO_AUTH_TOKEN="7f111a7e0eab7f58edc27ec7e326bacc"
TWILIO_WHATSAPP_NUMBER="+18207320393"
```

### 3. Testar Endpoint de Webhook

```bash
# Com servidor rodando (pnpm dev)
curl http://localhost:3000/api/whatsapp/webhook
```

Deve retornar:

```json
{ "status": "ok", "service": "Versati Glass WhatsApp" }
```

---

## 📱 Como Funciona na Prática

### Fluxo Cliente → Sistema

1. **Cliente envia mensagem** para +1 820-732-0393
2. **Twilio recebe** e envia webhook para `/api/whatsapp/webhook`
3. **Sistema processa** via IA (Groq Llama)
4. **IA responde** automaticamente ao cliente
5. **Admin vê conversa** no painel `/admin/conversas-ia`
6. **Admin pode intervir** e responder manualmente

### Fluxo Sistema → Cliente

1. **Sistema detecta evento** (orçamento enviado, pedido aprovado, etc)
2. **Notificação dispara** via `sendTemplateMessage()`
3. **Twilio envia WhatsApp** usando template aprovado
4. **Cliente recebe** mensagem formatada

---

## 🆘 Solução de Problemas

### Erro: "Invalid Twilio signature"

**Causa**: Webhook não está validando corretamente
**Solução**:

- Em desenvolvimento, a validação está desabilitada
- Em produção, verifique a URL do webhook

### Erro: "Failed to send message" (Code 63007)

**Causa**: Número não está no Sandbox
**Solução**:

- Envie "join electricity-about" para +1 415 523 8886
- Ou aguarde aprovação do número real

### Erro: "Missing Twilio credentials"

**Causa**: Variáveis de ambiente não carregadas
**Solução**:

```bash
# Verificar se .env existe
ls -la .env

# Reiniciar servidor
pnpm dev
```

### Mensagens não chegam no celular

**Causa**: Sandbox não ativado OU número não aprovado
**Solução**:

- **Sandbox**: Ative com "join electricity-about"
- **Produção**: Aguarde aprovação da Meta

### IA não responde

**Causa**: Groq API key não configurada OU erro no webhook
**Solução**:

```bash
# Verificar logs do servidor
# Verificar se GROQ_API_KEY está no .env
cat .env | grep GROQ
```

---

## 📊 Comparação: Sandbox vs Produção

| Recurso               | Sandbox            | Produção          |
| --------------------- | ------------------ | ----------------- |
| **Tempo para ativar** | Imediato           | 2-5 dias          |
| **Número**            | +1 415 523 8886    | +1 820-732-0393   |
| **Restrições**        | Só quem fez "join" | Qualquer número   |
| **Templates**         | Não precisa        | Precisa aprovação |
| **Custo**             | Grátis             | ~$0.005/msg       |
| **Limite**            | Ilimitado (teste)  | Ilimitado         |
| **Webhook**           | Configurável       | Configurável      |

---

## ✅ Checklist de Deploy

### Antes do Deploy

- [ ] Número aprovado pela Meta/WhatsApp
- [ ] Templates criados e aprovados
- [ ] Webhook testado em staging
- [ ] GROQ_API_KEY configurada
- [ ] Variáveis de ambiente validadas

### Deploy

- [ ] Deploy da aplicação
- [ ] Atualizar webhook URL no Twilio
- [ ] Testar envio de mensagem real
- [ ] Testar recebimento de mensagem
- [ ] Verificar IA respondendo
- [ ] Testar templates de notificação

### Pós-Deploy

- [ ] Monitorar logs do webhook
- [ ] Verificar conversas no admin
- [ ] Testar com cliente real (opt-in)
- [ ] Documentar número para equipe
- [ ] Treinar equipe no painel admin

---

## 🎓 Treinamento Equipe

### Para usar o sistema WhatsApp:

1. **Acesse**: https://seu-dominio.com/admin/conversas-ia

2. **Você verá**:
   - Lista de conversas ativas
   - Histórico de mensagens
   - Status (IA respondendo / Humano assumiu)

3. **Para assumir conversa**:
   - Clique na conversa
   - Clique em "Assumir conversa"
   - Digite sua resposta
   - A IA para de responder automaticamente

4. **Para voltar para IA**:
   - Clique em "Retornar para IA"
   - A IA volta a responder automaticamente

---

## 🔗 Links Úteis

- **Twilio Console**: https://console.twilio.com
- **WhatsApp Senders**: https://console.twilio.com/us1/develop/sms/senders/whatsapp-senders
- **Documentação Twilio**: https://www.twilio.com/docs/whatsapp
- **Facebook Business Manager**: https://business.facebook.com
- **Message Templates**: https://business.facebook.com/wa/manage/message-templates/
- **Pricing**: https://www.twilio.com/whatsapp/pricing

---

## 📞 Contato Suporte Twilio

- **Support**: https://support.twilio.com
- **Community**: https://www.twilio.com/community
- **Phone**: +1 (888) 926-0420

---

**Última atualização**: 18 Dez 2024
**Versão**: 1.0.0
