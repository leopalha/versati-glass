# 🎨 COMO EXECUTAR A GERAÇÃO DAS 26 IMAGENS

**Data:** 21/12/2024
**Script:** `generate-product-images.js`

---

## 📋 PRÉ-REQUISITOS

1. ✅ API Key da OpenAI (DALL-E 3)
   - Obtenha em: https://platform.openai.com/api-keys
   - Formato: `sk-proj-...` ou `sk-...`

2. ✅ Créditos na conta OpenAI
   - DALL-E 3 HD (1024x1024): ~$0.080 por imagem
   - 26 imagens × $0.080 = **~$2.08 USD total**

---

## 🚀 PASSO A PASSO

### 1. Configure a API Key

**Windows (PowerShell):**

```powershell
$env:OPENAI_API_KEY="sk-proj-SUA_API_KEY_AQUI"
```

**Windows (CMD):**

```cmd
set OPENAI_API_KEY=sk-proj-SUA_API_KEY_AQUI
```

**Linux/Mac:**

```bash
export OPENAI_API_KEY="sk-proj-SUA_API_KEY_AQUI"
```

### 2. Execute o Script

```bash
node generate-product-images.js
```

### 3. Aguarde a Geração

O script vai:

- ✅ Gerar cada uma das 26 imagens via DALL-E 3
- ✅ Baixar automaticamente
- ✅ Salvar na pasta correta (`public/images/products/{categoria}/`)
- ✅ Mostrar progresso em tempo real
- ✅ Aguardar 2s entre cada request (evitar rate limit)

**Tempo estimado:** ~2-3 minutos

---

## 📊 O QUE O SCRIPT FAZ

### Imagens que serão geradas (26 total):

**BOX (3):**

- ✅ box-para-banheira.jpg
- ✅ box-pivotante.jpg
- ✅ box-comum-tradicional.jpg

**CORTINAS-VIDRO (1):**

- ✅ cortina-vidro-stanley.jpg

**DIVISÓRIAS (2):**

- ✅ divisoria.jpg
- ✅ divisoria-com-porta.jpg

**ESPELHOS (3):**

- ✅ espelho-bronze.jpg
- ✅ espelho-fume.jpg
- ✅ espelho-veneziano.jpg

**FERRAGENS (2):**

- ✅ mola-piso.jpg
- ✅ puxador-tubular.jpg

**GUARDA-CORPO (2):**

- ✅ guarda-corpo-autoportante.jpg
- ✅ guarda-corpo-spider.jpg

**KITS (8):**

- ✅ kit-guarda-corpo.jpg
- ✅ kit-fechamento.jpg
- ✅ kit-prateleiras.jpg
- ✅ kit-espelho-banheiro.jpg
- ✅ kit-box-frontal.jpg
- ✅ kit-basculante.jpg
- ✅ kit-box-canto.jpg
- ✅ kit-porta.jpg

**PERGOLADOS (2):**

- ✅ pergolado-inox.jpg
- ✅ cobertura-controle-solar.jpg

**PORTAS (2):**

- ✅ porta-pivotante.jpg
- ✅ porta-pivotante-premium.jpg

**TAMPOS (2):**

- ✅ tampo-extra-clear.jpg
- ✅ tampo-mesa.jpg

---

## ✅ SAÍDA ESPERADA

```
🚀 GERADOR DE IMAGENS DE PRODUTOS VIA DALL-E 3
================================================

📊 Total de imagens a gerar: 26
🔑 API Key configurada: sk-proj-ab...

⏳ Iniciando geração...

[1/26] Gerando: box/box-para-banheira.jpg
📝 Prompt: Modern glass shower enclosure specifically designed for bathtub...
✅ Imagem gerada! URL: https://oaidalleapiprodscus...
💾 Salvando em: d:\VERSATI GLASS\public\images\products\box\box-para-banheira.jpg
✅ Salvo com sucesso!
⏸️  Aguardando 2s antes da próxima...

[2/26] Gerando: box/box-pivotante.jpg
...
(continua até 26/26)

================================================
📊 RESUMO DA GERAÇÃO
================================================

✅ Sucesso: 26/26
❌ Falhas: 0/26

✅ Imagens geradas com sucesso:
   - box/box-para-banheira.jpg
   - box/box-pivotante.jpg
   - box/box-comum-tradicional.jpg
   ... (todas as 26)

================================================
🎉 TODAS AS 26 IMAGENS FORAM GERADAS COM SUCESSO!
📁 Localizadas em: public/images/products/
```

---

## 🔧 TROUBLESHOOTING

### Erro: "invalid_api_key"

- ❌ API key não configurada ou inválida
- ✅ **Solução:** Verifique se copiou a key completa e configurou a variável de ambiente

### Erro: "insufficient_quota"

- ❌ Sem créditos na conta OpenAI
- ✅ **Solução:** Adicione créditos em https://platform.openai.com/account/billing

### Erro: "rate_limit_exceeded"

- ❌ Muitas requests em pouco tempo
- ✅ **Solução:** O script já aguarda 2s entre cada imagem. Se persistir, aumente o delay.

### Algumas imagens falharam

- ✅ **Solução:** Execute o script novamente. Ele só gerará as que faltam.

---

## 📝 APÓS A GERAÇÃO

Quando o script terminar com sucesso:

### 1. Verificar imagens geradas

```bash
ls public/images/products/box/
ls public/images/products/kits/
# etc...
```

### 2. Executar o seed do banco

```bash
npx tsx prisma/seed-products-complete.ts
```

### 3. Testar no wizard

```bash
npm run dev
# Acessar: http://localhost:3000/orcamento
```

---

## 🎯 GARANTIAS DO SCRIPT

Todos os prompts incluem explicitamente:

- ✅ **"no text"** - SEM texto
- ✅ **"no branding"** - SEM marcas
- ✅ **"no watermarks"** - SEM watermarks
- ✅ **"no labels"** - SEM etiquetas (especialmente KITS)
- ✅ **"professional product photography"** - Qualidade profissional
- ✅ **"1024x1024"** - Resolução alta
- ✅ **"hd quality"** - Qualidade HD

---

## 💰 CUSTO ESTIMADO

- **Modelo:** DALL-E 3 HD
- **Tamanho:** 1024x1024
- **Preço:** $0.080 por imagem
- **Total:** 26 imagens × $0.080 = **$2.08 USD**

---

## 🚀 EXECUTAR AGORA

```bash
# 1. Configure a API key
$env:OPENAI_API_KEY="sk-proj-SUA_KEY_AQUI"

# 2. Execute o script
node generate-product-images.js

# 3. Aguarde ~2-3 minutos

# 4. Verifique o resultado
ls public/images/products/kits/
```

---

**Pronto para executar!** 🚀
