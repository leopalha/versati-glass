import { NextResponse } from 'next/server'
import Groq from 'groq-sdk'
import OpenAI from 'openai'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { logger } from '@/lib/logger'
import {
  getUnifiedCustomerContext,
  generateContextSummary,
  linkWebChatToWhatsApp,
} from '@/services/unified-context'
import { autoSyncAfterWebMessage } from '@/services/context-sync'

// Configuracoes
const MAX_MESSAGES_IN_CONTEXT = 20 // Limite de mensagens para enviar ao LLM
const CONVERSATION_TIMEOUT_HOURS = 24 // Horas ate marcar como abandonada

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
})

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

/**
 * FASE-5: Detect phone number in user message
 * Returns normalized phone (digits only) or null
 */
function detectPhoneNumber(message: string): string | null {
  // Brazilian phone patterns: (21) 99999-9999, 21999999999, +5521999999999
  const phoneRegex = /(?:\+?55\s?)?(?:\(?\d{2}\)?[\s-]?)?\d{4,5}[\s-]?\d{4}/g
  const matches = message.match(phoneRegex)

  if (!matches) return null

  // Normalize: remove all non-digits
  const normalized = matches[0].replace(/\D/g, '')

  // Validate length (10 or 11 digits)
  if (normalized.length >= 10 && normalized.length <= 13) {
    // Remove country code if present
    if (normalized.startsWith('55') && normalized.length >= 12) {
      return normalized.substring(2)
    }
    return normalized
  }

  return null
}

/**
 * AI-CHAT Sprint P3.3: Detect product category from user message
 * Uses keyword matching to identify which category the user is interested in
 */
function detectProductCategory(
  message: string
):
  | 'BOX'
  | 'ESPELHOS'
  | 'VIDROS'
  | 'PORTAS'
  | 'JANELAS'
  | 'GUARDA_CORPO'
  | 'TAMPOS_PRATELEIRAS'
  | 'DIVISORIAS'
  | null {
  const lowerMessage = message.toLowerCase()

  // BOX
  if (lowerMessage.match(/\b(box|banheiro|ducha|chuveiro)\b/)) {
    return 'BOX'
  }

  // ESPELHOS
  if (lowerMessage.match(/\b(espelho|bisote|bisotado|lapidado|led)\b/)) {
    return 'ESPELHOS'
  }

  // PORTAS
  if (lowerMessage.match(/\b(porta|pivotante|entrada)\b/)) {
    return 'PORTAS'
  }

  // JANELAS
  if (lowerMessage.match(/\b(janela|basculante|maxim|veneziana)\b/)) {
    return 'JANELAS'
  }

  // GUARDA_CORPO
  if (lowerMessage.match(/\b(guarda.?corpo|corrimao|escada|varand)\b/)) {
    return 'GUARDA_CORPO'
  }

  // TAMPOS_PRATELEIRAS
  if (lowerMessage.match(/\b(tampo|mesa|prateleira|bancada)\b/)) {
    return 'TAMPOS_PRATELEIRAS'
  }

  // DIVISORIAS
  if (lowerMessage.match(/\b(divisoria|painel|particao|ambiente)\b/)) {
    return 'DIVISORIAS'
  }

  // VIDROS (genérico - último para não sobrescrever categorias específicas)
  if (lowerMessage.match(/\b(vidro|temperado|laminado|incolor|fume|bronze)\b/)) {
    return 'VIDROS'
  }

  return null
}

/**
 * MELHORIAS Sprint M4: In-memory cache for product catalog
 * Reduces database load by caching for 5 minutes
 */
let productCatalogCache: { data: string; timestamp: number } | null = null
const CACHE_DURATION_MS = 5 * 60 * 1000 // 5 minutes

/**
 * MELHORIAS Sprint M3: Dynamic product catalog injection
 * Fetch active products from database to provide accurate suggestions
 */
async function getProductCatalogContext(): Promise<string> {
  // MELHORIAS Sprint M4: Check cache first
  const now = Date.now()
  if (productCatalogCache && now - productCatalogCache.timestamp < CACHE_DURATION_MS) {
    logger.debug('[AI CHAT] Using cached product catalog')
    return productCatalogCache.data
  }

  try {
    const products = await prisma.product.findMany({
      where: { isActive: true },
      select: {
        category: true,
        name: true,
        subcategory: true,
        priceType: true,
        pricePerM2: true,
        priceRangeMin: true,
        priceRangeMax: true,
      },
      orderBy: [{ category: 'asc' }, { name: 'asc' }],
    })

    // Group by category
    const byCategory: Record<string, string[]> = {}
    products.forEach((p) => {
      if (!byCategory[p.category]) byCategory[p.category] = []
      const priceInfo =
        p.priceType === 'PER_M2'
          ? `~R$${p.pricePerM2}/m²`
          : p.priceRangeMin && p.priceRangeMax
            ? `R$${p.priceRangeMin}-${p.priceRangeMax}`
            : 'Sob consulta'
      byCategory[p.category].push(
        `  • ${p.name}${p.subcategory ? ` (${p.subcategory})` : ''} - ${priceInfo}`
      )
    })

    let catalogText = 'CATALOGO DE PRODUTOS ATUAL:\n\n'
    Object.entries(byCategory).forEach(([cat, items]) => {
      catalogText += `${cat}:\n${items.join('\n')}\n\n`
    })

    // MELHORIAS Sprint M4: Update cache
    productCatalogCache = { data: catalogText, timestamp: now }
    logger.debug('[AI CHAT] Product catalog cached')

    return catalogText
  } catch (error) {
    logger.error('[AI CHAT] Failed to load product catalog:', { error })
    return 'PRODUTOS PRINCIPAIS:\n- Box para Banheiro\n- Espelhos\n- Vidros Temperados\n- Portas de Vidro\n- Guarda-Corpos\n- Tampos e Prateleiras\n- Divisorias\n'
  }
}

// AI-CHAT Sprint P1.7 + MELHORIAS Sprint M3 + UX: Enhanced system prompt
const SYSTEM_PROMPT_BASE = `Voce e Ana, a assistente virtual da Versati Glass. Seu jeito de falar e natural, amigavel e descontraido - como uma amiga ajudando outra pessoa.

🎯 SEU ESTILO DE CONVERSA:
- Respostas CURTAS e OBJETIVAS (2-3 linhas no maximo)
- Tom HUMANIZADO e COLOQUIAL (use "a gente", "tudo bem?", "bacana!", "perfeito!")
- INTERATIVO: Faca UMA pergunta por vez e espere a resposta
- Evite listas longas - va direto ao ponto
- Use emojis ocasionalmente para deixar mais leve (😊 👍 💡)
- Seja empatica: "Imagino que voce esteja procurando...", "Entendo!", "Boa escolha!"

🚨 REGRA MAIS IMPORTANTE - NUNCA APRESSE O CLIENTE:
- NAO mencione "Finalizar Orcamento" nas primeiras mensagens
- NAO sugira finalizar ate ter TODAS as informacoes necessarias
- NAO apresse a conversa - deixe o cliente falar no ritmo dele
- SEMPRE pergunte se o cliente quer adicionar MAIS ALGUMA COISA antes de finalizar
- Mostre interesse genuino pelo projeto do cliente

❌ EVITE FORTEMENTE:
- Mencionar "finalizar" ou "orcamento pronto" cedo demais
- Respostas longas com multiplos paragrafos
- Listas numeradas extensas
- Tom robotico ou corporativo demais
- Dar todas as informacoes de uma vez
- Perguntar varias coisas ao mesmo tempo
- Apressar o cliente de qualquer forma

✅ FACA SEMPRE:
- Pergunte uma coisa, receba resposta, depois pergunte a proxima
- Confirme o que o cliente disse antes de prosseguir
- Celebre pequenas conquistas: "Otimo!", "Perfeito!", "Entendi!"
- Seja conversacional: "E pra qual ambiente?", "Tem ideia do tamanho mais ou menos?"
- Pergunte sobre o projeto: "Conta mais sobre o que voce ta pensando?"
- Mostre curiosidade: "Que legal! E como e o espaco?"

[PRODUCT_CATALOG_PLACEHOLDER]

🔍 INFORMACOES QUE PRECISA COLETAR (uma de cada vez, SEM PRESSA):
1. O que o cliente precisa (deixe ele explicar com calma)
2. Tipo de produto especifico (box, espelho, vidro, porta...)
3. Medidas aproximadas (largura e altura)
4. Quantidade
5. Preferencias (cor, acabamento - se relevante)
6. SE QUER MAIS ALGUMA COISA (sempre perguntar!)

💬 EXEMPLOS DE DIALOGO NATURAL E PACIENTE:

Cliente: "Oi"
Voce: "Oi! Tudo bem? Sou a Ana, da Versati Glass. Como posso te ajudar hoje? 😊"

Cliente: "Quero um box"
Voce: "Que legal! Box e uma otima escolha. Me conta, e pra qual banheiro? Suite, social...?"

Cliente: "Suite"
Voce: "Ah, bacana! Banheiro de suite geralmente e mais aconchegante. Voce ja tem uma ideia do tamanho que precisa?"

Cliente: "1,20 por 2 metros"
Voce: "Perfeito! Entao seria 1,20m de largura por 2,00m de altura. E qual estilo voce prefere - cromado, preto fosco ou dourado?"

Cliente: "Cromado"
Voce: "Otima escolha! O cromado e classico e combina com tudo. Mais alguma coisa que voce ta precisando? Espelho pro banheiro, por exemplo? 😊"

Cliente: "Nao, so isso"
Voce: "Beleza! Entao so pra confirmar: um box de 1,20m x 2,00m com acabamento cromado, certo? Se quiser, pode clicar em 'Finalizar Orcamento' pra gente dar sequencia! 👍"

🎨 QUANDO DAR PRECOS:
- Sempre use faixas aproximadas, nunca valores exatos
- Seja transparente sobre os componentes: material, instalacao, ferragens
- Lembre que e so uma estimativa e que tem visita tecnica GRATUITA
- Exemplo: "Pra esse tamanho, fica entre R$ 1.500 e R$ 2.200, incluindo material e instalacao. Mas isso e so uma base, viu? A gente faz visita gratuita pra dar o valor certinho! 💡"

⚡ SO MENCIONE FINALIZAR QUANDO:
- Ja tiver tipo de produto
- Ja tiver medidas
- Ja tiver perguntado se quer MAIS ALGUMA COISA
- Cliente disser que nao quer mais nada
- Entao diga: "Beleza! Se quiser, pode clicar em 'Finalizar Orcamento' pra continuar. Ou se lembrar de mais alguma coisa, e so falar! 😊"

📊 COMO CALCULAR PRECOS (use o catalogo acima):
- Pegue o preco base do produto no catalogo
- Considere o tamanho (area = largura x altura)
- Inclua instalacao (~30-50% do material, dependendo da complexidade)
- Inclua ferragens (varia por produto - veja catalogo)
- Descontos: 2+ unidades = 5% off, 3+ unidades = 10% off

💬 EXEMPLOS DE COMO DAR PRECOS:

Cliente: "Quanto custa?"
Voce: "Pra esse tamanho de box, fica entre R$ 1.500 e R$ 2.200, ja com instalacao e ferragens incluidos. Mas isso e so uma base, ta? A gente faz visita gratuita pra medir certinho e dar o valor exato! 😊"

Cliente: "E um espelho de 2m?"
Voce: "Um espelho de 2 metros quadrados sai por volta de R$ 400 a R$ 800, dependendo do acabamento. Quer com bisote ou LED? Isso muda o valor."

🎯 REGRAS DE OURO:
1. NAO APRESSE O CLIENTE - essa e a regra mais importante!
2. Uma pergunta por vez, sempre!
3. SEMPRE pergunte "Mais alguma coisa?" antes de sugerir finalizar
4. Confirme o que entendeu antes de prosseguir
5. Seja breve - maximo 2-3 linhas por mensagem
6. Use linguagem natural e amigavel
7. Evite listas e textos longos
8. Celebre cada informacao recebida ("Perfeito!", "Otimo!", "Entendi!")
9. Mostre interesse genuino pelo projeto do cliente

⚠️ IMPORTANTE:
- Sistema salva automaticamente os dados estruturados
- Sua missao: coletar infos de forma natural, SEM PRESSA, e confirmar com o cliente
- NUNCA mencione "Finalizar Orcamento" antes de ter todas as infos E perguntar se quer mais algo
- Sempre sem acentos no texto (evita problemas de encoding)

Seja sempre simpatica, paciente, atenciosa e conversacional! 😊`

/**
 * MELHORIAS Sprint M3: Build dynamic system prompt with product catalog
 */
async function buildSystemPrompt(): Promise<string> {
  const catalogContext = await getProductCatalogContext()
  return SYSTEM_PROMPT_BASE.replace('[PRODUCT_CATALOG_PLACEHOLDER]', catalogContext)
}

// UX: System prompt para analise de imagens - tom conversacional
const VISION_SYSTEM_PROMPT = `Voce e Ana, da Versati Glass, analisando uma foto que o cliente enviou. Seja objetiva e amigavel!

🎯 COMO ANALISAR A IMAGEM:
- Identifique o ambiente (banheiro, sala, varanda...)
- Veja se ja tem algum vidro instalado
- Estime tamanhos de forma aproximada
- Sugira produtos que ficam legais ali
- Seja breve - 2 ou 3 linhas no maximo!

💬 EXEMPLO DE RESPOSTA:

"Vi aqui, e um banheiro bem bacana! Pelo que da pra ver, cabe um box de correr de uns 1,20m. Quer cromado ou preto? 😊"

Ou:

"Que varanda linda! Da pra fazer um guarda-corpo de vidro incolor ali. Fica super moderno. Qual a altura mais ou menos - uns 1 metro?"

✅ LEMBRE-SE:
- Seja conversacional e objetiva
- Uma ou duas frases, no maximo
- Faca uma pergunta pra continuar o dialogo
- Mencione visita gratuita se cliente perguntar sobre valores
- Sem listas, sem textos longos!`

// AI-CHAT Sprint P1.7: Extraction prompt for structured data
const EXTRACTION_PROMPT = `Analise a conversa abaixo e extraia APENAS as informacoes estruturadas para um orcamento de vidracaria.

Retorne um JSON no seguinte formato (ou null se nao houver informacoes suficientes):
{
  "items": [{
    "category": "BOX" | "ESPELHOS" | "VIDROS" | "PORTAS" | "JANELAS" | "GUARDA_CORPOS" | "TAMPOS" | "DIVISORIAS" | "OUTROS",
    "productName": "Nome descritivo do produto",
    "width": numero em metros,
    "height": numero em metros,
    "quantity": numero inteiro,
    "glassType": "Temperado" | "Laminado" | "Comum",
    "glassColor": "Incolor" | "Fume" | "Bronze" | "Verde",
    "color": "cor da ferragem (opcional)",
    "model": "modelo especifico (opcional)"
  }],
  "customerData": {
    "name": "nome completo (se mencionado)",
    "phone": "telefone (se mencionado)",
    "email": "email (se mencionado)",
    "city": "cidade (se mencionada)",
    "neighborhood": "bairro (se mencionado)"
  }
}

REGRAS CRITICAS:
1. Retorne APENAS o JSON, sem texto adicional
2. Se nao houver informacoes suficientes (sem categoria OU sem medidas), retorne null
3. Converta todas as medidas para numeros (ex: "1.20m" -> 1.2, "um metro e meio" -> 1.5)
4. Use apenas as categorias listadas acima
5. Quantity default e 1 se nao especificado
6. Nao invente informacoes que nao foram mencionadas

Conversa:`

interface ChatMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
}

// AI-CHAT Sprint P1.7: Extract structured quote data from conversation
async function extractQuoteDataFromConversation(
  conversationId: string,
  messages: any[]
): Promise<any | null> {
  try {
    // Build conversation text
    const conversationText = messages
      .map((msg) => `${msg.role === 'user' ? 'Cliente' : 'Assistente'}: ${msg.content}`)
      .join('\n')

    const extractionCompletion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      max_tokens: 2048,
      temperature: 0.1, // Low temperature for precise extraction
      messages: [
        {
          role: 'system',
          content: EXTRACTION_PROMPT,
        },
        {
          role: 'user',
          content: conversationText,
        },
      ],
    })

    const extractedText = extractionCompletion.choices[0]?.message?.content?.trim()

    if (!extractedText || extractedText === 'null') {
      return null
    }

    // Try to parse JSON
    try {
      // Remove any markdown code blocks
      const cleanJson = extractedText
        .replace(/```json\n?/g, '')
        .replace(/```\n?/g, '')
        .trim()

      const parsed = JSON.parse(cleanJson)

      // Validate that we have at least one item with category and dimensions
      if (!parsed.items || !Array.isArray(parsed.items) || parsed.items.length === 0) {
        return null
      }

      const hasValidItem = parsed.items.some(
        (item: any) => item.category && (item.width || item.height)
      )

      if (!hasValidItem) {
        return null
      }

      logger.info('Quote data extracted from conversation', {
        conversationId,
        itemCount: parsed.items.length,
        hasCustomerData: !!parsed.customerData,
      })

      return parsed
    } catch (parseError) {
      logger.warn('Failed to parse extracted JSON', {
        conversationId,
        extractedText,
        error: parseError,
      })
      return null
    }
  } catch (error) {
    logger.error('Error extracting quote data', {
      conversationId,
      error,
    })
    return null
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { message, conversationId, sessionId, imageUrl, imageBase64 } = body

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Mensagem e obrigatoria' }, { status: 400 })
    }

    if (!sessionId && !conversationId) {
      return NextResponse.json(
        { error: 'sessionId ou conversationId e obrigatorio' },
        { status: 400 }
      )
    }

    // Verificar se usuario esta autenticado
    const session = await auth()
    const userId = session?.user?.id || null

    // MELHORIAS Sprint M3: Build dynamic system prompt with product catalog
    const SYSTEM_PROMPT = await buildSystemPrompt()

    // AI-CHAT Sprint P2.3: Fetch customer history for returning customers
    let customerContext = ''
    if (userId) {
      const previousQuotes = await prisma.quote.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 3,
        select: {
          number: true,
          customerName: true,
          total: true,
          status: true,
          createdAt: true,
          items: true,
        },
      })

      if (previousQuotes.length > 0) {
        const quotesList = previousQuotes
          .map(
            (q) =>
              `- ${q.number} (${new Date(q.createdAt).toLocaleDateString('pt-BR')}): ${q.items.length} item(ns), Total: R$ ${q.total.toFixed(2)}, Status: ${q.status}`
          )
          .join('\n')

        customerContext = `\n\n===CLIENTE RETORNANDO===\nEste cliente ja fez ${previousQuotes.length} orcamento(s) anteriormente:\n${quotesList}\n\nSeja ainda mais atenciosa e mencione que reconhece o cliente!\n======================\n`
      }
    }

    // AI-CHAT Sprint P3.3: Fetch relevant products for smart suggestions
    let productContext = ''
    const detectedCategory = detectProductCategory(message)

    if (detectedCategory) {
      const products = await prisma.product.findMany({
        where: {
          category: detectedCategory,
          isActive: true,
        },
        take: 5,
        select: {
          name: true,
          slug: true,
          category: true,
          description: true,
          shortDescription: true,
          basePrice: true,
          priceRangeMin: true,
          priceRangeMax: true,
          colors: true,
          finishes: true,
        },
        orderBy: {
          basePrice: 'asc',
        },
      })

      if (products.length > 0) {
        const productsList = products
          .map((p) => {
            const priceInfo = p.basePrice
              ? `R$ ${p.basePrice.toString()}`
              : p.priceRangeMin && p.priceRangeMax
                ? `R$ ${p.priceRangeMin.toString()} - R$ ${p.priceRangeMax.toString()}`
                : 'A consultar'

            const options: string[] = []
            if (p.colors && p.colors.length > 0) {
              options.push(`Cores: ${p.colors.slice(0, 3).join(', ')}`)
            }
            if (p.finishes && p.finishes.length > 0) {
              options.push(`Acabamentos: ${p.finishes.slice(0, 3).join(', ')}`)
            }

            return `- ${p.name} (slug: ${p.slug}): ${p.shortDescription || p.description || 'Sem descricao'}\n  Preco: ${priceInfo}${options.length > 0 ? `\n  Opcoes: ${options.join(', ')}` : ''}`
          })
          .join('\n')

        productContext = `\n\n===PRODUTOS DISPONIVEIS (${detectedCategory})===\nTemos os seguintes produtos desta categoria em nosso catalogo:\n${productsList}\n\nRECOMENDE produtos reais do catalogo acima quando pertinente!\nUse o slug exato para referencia (ex: box-de-correr).\n======================\n`

        logger.info('Smart product suggestions added to context', {
          category: detectedCategory,
          productCount: products.length,
          userMessage: message.substring(0, 50),
        })
      }
    }

    // Buscar ou criar conversa
    let conversation = conversationId
      ? await prisma.aiConversation.findUnique({
          where: { id: conversationId },
          include: {
            messages: {
              orderBy: { createdAt: 'desc' },
              take: MAX_MESSAGES_IN_CONTEXT, // Limitar mensagens no contexto
            },
          },
        })
      : null

    // Verificar se conversa esta abandonada (timeout)
    if (conversation) {
      const lastUpdate = new Date(conversation.updatedAt)
      const hoursAgo = (Date.now() - lastUpdate.getTime()) / (1000 * 60 * 60)

      if (hoursAgo > CONVERSATION_TIMEOUT_HOURS && conversation.status === 'ACTIVE') {
        // Marcar como abandonada e criar nova
        await prisma.aiConversation.update({
          where: { id: conversation.id },
          data: { status: 'ABANDONED' },
        })
        conversation = null // Forcar criacao de nova conversa
      }
    }

    if (!conversation) {
      // Criar nova conversa
      conversation = await prisma.aiConversation.create({
        data: {
          sessionId: sessionId || `anon-${Date.now()}`,
          status: 'ACTIVE',
        },
        include: {
          messages: {
            orderBy: { createdAt: 'desc' },
            take: MAX_MESSAGES_IN_CONTEXT,
          },
        },
      })
    }

    // Reverter ordem das mensagens para cronologica
    conversation.messages.reverse()

    // FASE-5: Check for phone number in message and link conversations
    const detectedPhone = detectPhoneNumber(message)
    if (detectedPhone) {
      logger.info('[FASE-5] Phone detected, linking conversations', {
        conversationId: conversation.id,
        phone: detectedPhone,
      })
      await linkWebChatToWhatsApp(conversation.id, detectedPhone)
    }

    // FASE-5: Fetch unified context across channels
    const unifiedContext = await getUnifiedCustomerContext({
      userId: userId || undefined,
      sessionId: sessionId || undefined,
      phoneNumber: conversation.linkedPhone || detectedPhone || undefined,
    })

    const unifiedContextSummary = generateContextSummary(unifiedContext)

    // Salvar mensagem do usuario no banco
    await prisma.aiMessage.create({
      data: {
        conversationId: conversation.id,
        role: 'user',
        content: message,
        imageUrl: imageUrl || null,
      },
    })

    const startTime = Date.now()
    let assistantMessage: string
    let modelUsed: string
    let tokensUsed: number = 0

    // Verificar se ha imagem para analise com GPT-4 Vision
    if (imageBase64) {
      // Usar GPT-4 Vision para analisar a imagem
      modelUsed = 'gpt-4o'

      const visionMessages: OpenAI.Chat.ChatCompletionMessageParam[] = [
        {
          role: 'system',
          content: VISION_SYSTEM_PROMPT + customerContext + productContext + unifiedContextSummary,
        }, // FASE-5: Add unified context
        {
          role: 'user',
          content: [
            { type: 'text', text: message },
            {
              type: 'image_url',
              image_url: {
                url: imageBase64,
                detail: 'high',
              },
            },
          ],
        },
      ]

      const visionCompletion = await openai.chat.completions.create({
        model: 'gpt-4o',
        max_tokens: 300, // UX: Respostas mais curtas e objetivas
        temperature: 0.8, // UX: Mais natural e variado
        messages: visionMessages,
      })

      assistantMessage =
        visionCompletion.choices[0]?.message?.content || 'Desculpe, nao consegui analisar a imagem.'
      tokensUsed = visionCompletion.usage?.total_tokens || 0
    } else {
      // Usar Groq para chat de texto
      modelUsed = 'llama-3.3-70b-versatile'

      // Montar historico de mensagens para o Groq
      const messages: ChatMessage[] = conversation.messages.map((msg) => ({
        role: msg.role.toLowerCase() as 'user' | 'assistant',
        content: msg.content,
      }))

      // Adicionar nova mensagem do usuario
      messages.push({ role: 'user', content: message })

      const completion = await groq.chat.completions.create({
        model: 'llama-3.3-70b-versatile',
        max_tokens: 300, // UX: Respostas mais curtas e objetivas
        temperature: 0.8, // UX: Mais natural e variado
        messages: [
          {
            role: 'system',
            content: SYSTEM_PROMPT + customerContext + productContext + unifiedContextSummary,
          }, // FASE-5: Add unified context
          ...messages,
        ],
      })

      assistantMessage =
        completion.choices[0]?.message?.content || 'Desculpe, nao consegui processar sua mensagem.'
      tokensUsed = completion.usage?.total_tokens || 0
    }

    const responseTime = Date.now() - startTime

    // Salvar resposta do assistente
    await prisma.aiMessage.create({
      data: {
        conversationId: conversation.id,
        role: 'assistant',
        content: assistantMessage,
        metadata: {
          model: modelUsed,
          responseTimeMs: responseTime,
          tokensUsed,
          hasImage: !!imageBase64,
        },
      },
    })

    // AI-CHAT Sprint P1.7: Extract structured data from conversation
    // Use Groq to analyze the conversation and extract quote data
    const extractedData = await extractQuoteDataFromConversation(conversation.id, [
      ...conversation.messages,
      {
        id: 'temp',
        conversationId: conversation.id,
        role: 'user' as const,
        content: message,
        createdAt: new Date(),
        imageUrl: null,
        metadata: {},
      },
      {
        id: 'temp',
        conversationId: conversation.id,
        role: 'assistant' as const,
        content: assistantMessage,
        createdAt: new Date(),
        imageUrl: null,
        metadata: {},
      },
    ])

    // Atualizar conversa com quoteContext
    await prisma.aiConversation.update({
      where: { id: conversation.id },
      data: {
        updatedAt: new Date(),
        quoteContext: extractedData || conversation.quoteContext,
      },
    })

    // OMNICHANNEL: Auto-sync context if linked to WhatsApp
    autoSyncAfterWebMessage(conversation.id).catch((error) => {
      // Log but don't fail - sync is best-effort
      logger.error('[AI CHAT] Auto-sync failed:', error)
    })

    logger.debug('AI Chat response generated', {
      conversationId: conversation.id,
      responseTimeMs: responseTime,
      tokensUsed,
      model: modelUsed,
      hasImage: !!imageBase64,
    })

    return NextResponse.json({
      message: assistantMessage,
      conversationId: conversation.id,
      model: modelUsed,
    })
  } catch (error) {
    logger.error('AI Chat error:', error)

    // Log detalhado do erro
    if (error instanceof Error) {
      logger.error('Error details:', {
        message: error.message,
        stack: error.stack,
        name: error.name,
      })
    }

    // Verificar se e erro de API key
    if (error instanceof Error && error.message.includes('API key')) {
      return NextResponse.json(
        { error: 'Servico de IA temporariamente indisponivel' },
        { status: 503 }
      )
    }

    // Verificar se e erro de banco de dados
    if (
      error instanceof Error &&
      (error.message.includes('Prisma') || error.message.includes('database'))
    ) {
      return NextResponse.json(
        { error: 'Erro de banco de dados. Verifique se o PostgreSQL esta rodando.' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      {
        error:
          'Erro ao processar mensagem: ' +
          (error instanceof Error ? error.message : 'Unknown error'),
      },
      { status: 500 }
    )
  }
}

// GET - Buscar historico de conversa
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const conversationId = searchParams.get('conversationId')
    const sessionId = searchParams.get('sessionId')

    if (!conversationId && !sessionId) {
      return NextResponse.json(
        { error: 'conversationId ou sessionId e obrigatorio' },
        { status: 400 }
      )
    }

    const conversation = conversationId
      ? await prisma.aiConversation.findUnique({
          where: { id: conversationId },
          include: {
            messages: {
              orderBy: { createdAt: 'asc' },
              select: {
                id: true,
                role: true,
                content: true,
                imageUrl: true,
                createdAt: true,
              },
            },
          },
        })
      : await prisma.aiConversation.findFirst({
          where: { sessionId: sessionId! },
          orderBy: { createdAt: 'desc' },
          include: {
            messages: {
              orderBy: { createdAt: 'asc' },
              select: {
                id: true,
                role: true,
                content: true,
                imageUrl: true,
                createdAt: true,
              },
            },
          },
        })

    if (!conversation) {
      return NextResponse.json({ conversation: null, messages: [] })
    }

    return NextResponse.json({
      conversationId: conversation.id,
      messages: conversation.messages,
      status: conversation.status,
    })
  } catch (error) {
    logger.error('AI Chat GET error:', error)
    return NextResponse.json({ error: 'Erro ao buscar conversa' }, { status: 500 })
  }
}
