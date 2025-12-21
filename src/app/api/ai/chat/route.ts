import { NextResponse } from 'next/server'
import Groq from 'groq-sdk'
import OpenAI from 'openai'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { logger } from '@/lib/logger'
import { rateLimit, RATE_LIMITS } from '@/lib/rate-limit'
import {
  getUnifiedCustomerContext,
  generateContextSummary,
  linkWebChatToWhatsApp,
} from '@/services/unified-context'
import { autoSyncAfterWebMessage } from '@/services/context-sync'
import {
  generateAllCalendarLinks,
  createVersatiAppointmentEvent,
  formatCalendarLinksMessage,
} from '@/lib/calendar-links'

// Configuracoes
const MAX_MESSAGES_IN_CONTEXT = 20 // Limite de mensagens para enviar ao LLM
const CONVERSATION_TIMEOUT_HOURS = 24 // Horas ate marcar como abandonada
const MAX_RETRIES = 3 // Numero maximo de tentativas
const INITIAL_RETRY_DELAY = 1000 // 1 segundo

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
})

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

/**
 * Retry helper with exponential backoff
 */
async function withRetry<T>(
  fn: () => Promise<T>,
  maxRetries: number = MAX_RETRIES,
  initialDelay: number = INITIAL_RETRY_DELAY
): Promise<T> {
  let lastError: Error | null = null

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error))

      // Check if it's a connection error (retryable)
      const isRetryable =
        lastError.message.includes('Connection error') ||
        lastError.message.includes('ECONNRESET') ||
        lastError.message.includes('ETIMEDOUT') ||
        lastError.message.includes('fetch failed') ||
        lastError.message.includes('network')

      if (!isRetryable || attempt === maxRetries - 1) {
        throw lastError
      }

      // Exponential backoff
      const delay = initialDelay * Math.pow(2, attempt)
      logger.warn(`[AI CHAT] Retry attempt ${attempt + 1}/${maxRetries} after ${delay}ms`, {
        error: lastError.message,
      })
      await new Promise((resolve) => setTimeout(resolve, delay))
    }
  }

  throw lastError
}

/**
 * Detecta intencao de agendamento na mensagem
 */
function detectSchedulingIntent(message: string): boolean {
  const lowerMessage = message.toLowerCase()
  const schedulingKeywords = [
    'agendar',
    'agendamento',
    'marcar',
    'visita',
    'visita tecnica',
    'visita técnica',
    'medicao',
    'medir',
    'instalacao',
    'instalar',
    'quando pode',
    'quando voces podem',
    'horario',
    'horário',
    'data',
    'dia disponivel',
    'qual dia',
    'pode vir',
    'mandar alguem',
    'enviar tecnico',
  ]
  return schedulingKeywords.some((keyword) => lowerMessage.includes(keyword))
}

/**
 * Detecta se cliente esta confirmando um agendamento
 * Ex: "pode ser dia 23 as 10h", "segunda feira 14h", "amanha de manha"
 */
function detectSchedulingConfirmation(message: string): {
  hasConfirmation: boolean
  dayOfWeek?: string
  time?: string
  dateHint?: string
} {
  const lowerMessage = message.toLowerCase()

  // Detectar dias da semana
  const daysOfWeek = ['segunda', 'terca', 'quarta', 'quinta', 'sexta']
  const dayMatch = daysOfWeek.find((day) => lowerMessage.includes(day))

  // Detectar horarios (8h, 10:00, 14 horas, etc)
  const timeRegex = /(\d{1,2})\s*(?:h|:00|horas?|hrs?)?/i
  const timeMatch = lowerMessage.match(timeRegex)

  // Detectar referencias de data
  const dateHints = ['amanha', 'hoje', 'proxima semana', 'semana que vem']
  const dateHint = dateHints.find((hint) => lowerMessage.includes(hint))

  // Detectar dia numerico (dia 23, 15/01, etc)
  const dayNumberRegex = /dia\s*(\d{1,2})/i
  const dayNumberMatch = lowerMessage.match(dayNumberRegex)

  const hasConfirmation = !!(
    dayMatch ||
    timeMatch ||
    dateHint ||
    dayNumberMatch ||
    lowerMessage.includes('pode ser') ||
    lowerMessage.includes('ok') ||
    lowerMessage.includes('confirmo') ||
    lowerMessage.includes('beleza')
  )

  return {
    hasConfirmation,
    dayOfWeek: dayMatch,
    time: timeMatch ? `${timeMatch[1]}:00` : undefined,
    dateHint: dateHint || (dayNumberMatch ? `dia ${dayNumberMatch[1]}` : undefined),
  }
}

/**
 * Detecta CEP na mensagem e busca endereco via ViaCEP
 * Retorna os dados do endereco se encontrado
 */
async function detectAndFetchCep(message: string): Promise<{
  hasCep: boolean
  cep?: string
  address?: {
    street: string
    neighborhood: string
    city: string
    state: string
    zipCode: string
  }
  error?: string
}> {
  // Regex para detectar CEP (com ou sem hifen)
  const cepRegex = /\b(\d{5})-?(\d{3})\b/
  const match = message.match(cepRegex)

  if (!match) {
    return { hasCep: false }
  }

  const cep = `${match[1]}${match[2]}` // Remove hifen se houver

  try {
    const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
    })

    if (!response.ok) {
      return { hasCep: true, cep, error: 'Erro ao buscar CEP' }
    }

    const data = await response.json()

    if (data.erro) {
      return { hasCep: true, cep, error: 'CEP nao encontrado' }
    }

    return {
      hasCep: true,
      cep,
      address: {
        street: data.logradouro || '',
        neighborhood: data.bairro || '',
        city: data.localidade || '',
        state: data.uf || '',
        zipCode: cep,
      },
    }
  } catch (error) {
    logger.error('[CEP] Error fetching address:', error)
    return { hasCep: true, cep, error: 'Erro ao buscar CEP' }
  }
}

/**
 * Converte descricao de dia para Date object
 * Ex: "quarta-feira", "dia 23", "amanha", "segunda"
 */
function parseSchedulingDate(dayDescription: string): Date | null {
  const today = new Date()
  const lowerDay = dayDescription.toLowerCase()

  // Mapeamento de dias da semana
  const daysMap: Record<string, number> = {
    domingo: 0,
    segunda: 1,
    terca: 2,
    quarta: 3,
    quinta: 4,
    sexta: 5,
    sabado: 6,
  }

  // Verificar "amanha" ou "hoje"
  if (lowerDay.includes('amanha')) {
    const tomorrow = new Date(today)
    tomorrow.setDate(today.getDate() + 1)
    return tomorrow
  }

  if (lowerDay.includes('hoje')) {
    return today
  }

  // Verificar dia da semana
  for (const [dayName, dayNum] of Object.entries(daysMap)) {
    if (lowerDay.includes(dayName)) {
      const result = new Date(today)
      const currentDay = today.getDay()
      let daysToAdd = dayNum - currentDay

      // Se o dia ja passou essa semana, vai pra proxima
      if (daysToAdd <= 0) {
        daysToAdd += 7
      }

      result.setDate(today.getDate() + daysToAdd)
      return result
    }
  }

  // Verificar "dia X" (numero do dia)
  const dayNumberMatch = lowerDay.match(/dia\s*(\d{1,2})/)
  if (dayNumberMatch) {
    const dayNumber = parseInt(dayNumberMatch[1])
    const result = new Date(today)

    // Se o dia ja passou esse mes, vai pro proximo mes
    if (dayNumber <= today.getDate()) {
      result.setMonth(result.getMonth() + 1)
    }

    result.setDate(dayNumber)
    return result
  }

  // Tentar parse direto de data (DD/MM ou DD-MM)
  const dateMatch = lowerDay.match(/(\d{1,2})[/-](\d{1,2})/)
  if (dateMatch) {
    const day = parseInt(dateMatch[1])
    const month = parseInt(dateMatch[2]) - 1 // Meses em JS sao 0-indexed
    const result = new Date(today.getFullYear(), month, day)

    // Se a data ja passou, vai pro proximo ano
    if (result < today) {
      result.setFullYear(result.getFullYear() + 1)
    }

    return result
  }

  return null
}

/**
 * Gera lista de horarios disponiveis para os proximos dias
 */
function generateAvailableSlots(): string {
  const slots: string[] = []
  const workingHours = ['08:00', '10:00', '14:00', '16:00']
  const dayNames = ['Domingo', 'Segunda', 'Terca', 'Quarta', 'Quinta', 'Sexta', 'Sabado']

  const today = new Date()

  for (let i = 1; i <= 5; i++) {
    const date = new Date(today)
    date.setDate(date.getDate() + i)

    const dayOfWeek = date.getDay()
    // Pular sabado e domingo
    if (dayOfWeek === 0 || dayOfWeek === 6) continue

    const dayName = dayNames[dayOfWeek]
    const dateStr = date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })

    slots.push(`• ${dayName} (${dateStr}): ${workingHours.join(', ')}`)
  }

  return slots.join('\n')
}

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
7. NOME do cliente (pergunte de forma natural: "E qual seu nome pra gente registrar?")
8. TELEFONE do cliente (pergunte: "Me passa seu WhatsApp pra gente entrar em contato?")

📱 COLETA PROGRESSIVA DE DADOS DO CLIENTE - MUITO IMPORTANTE:

FASE 1 - DADOS BASICOS (antes do checkout):
- Nome: "Qual seu nome pra eu registrar aqui?"
- Telefone: "Me passa seu WhatsApp pra nossa equipe entrar em contato?"

Isso e OBRIGATORIO antes de finalizar. Sem nome e telefone, nao direcione pro checkout!

FASE 2 - DADOS COMPLETOS (quando cliente confirmar que quer finalizar):
Apos ter nome e telefone, pergunte DE FORMA NATURAL:
- CPF/CNPJ: "Pra emitir a nota fiscal, qual seu CPF? (ou CNPJ se for empresa)"
- CEP (PRIMEIRO!): "Qual o CEP do local de instalacao?"
- IMPORTANTE: O sistema busca automaticamente o endereco pelo CEP! Quando o cliente informar o CEP, voce recebera os dados do endereco (rua, bairro, cidade, estado).
- Complemento/Numero: "E qual o numero e complemento? (ex: 123, apto 401)"

FLUXO DE CEP - MUITO IMPORTANTE:
1. Pergunte o CEP: "Qual o CEP do local?"
2. Cliente informa CEP (ex: "22041080" ou "22041-080")
3. Confirme o endereco buscado: "Ah, Rua Figueiredo Magalhaes, Copacabana - RJ. Qual o numero?"
4. Cliente informa numero/complemento
5. Pronto! Dados completos.

SE O CEP FOR INVALIDO: "Hmm, nao encontrei esse CEP. Pode verificar e me passar novamente?"

DICA: Se o cliente ja mencionou bairro/cidade durante a conversa (ex: "moro em Copacabana"), ainda pergunte o CEP pra confirmar e pegar endereco completo.

Exemplo de fluxo COMPLETO:
1. Cliente: "Quero um box 1,50 x 1,90"
2. Voce: "Perfeito! Box de 1,50m x 1,90m. Qual acabamento - cromado, preto ou dourado?"
3. Cliente: "Cromado"
4. Voce: "Otimo! Mais alguma coisa ou e so isso?"
5. Cliente: "So isso"
6. Voce: "Beleza! Pra registrar, qual seu nome?"
7. Cliente: "Joao"
8. Voce: "Prazer, Joao! Me passa seu WhatsApp?"
9. Cliente: "21999999999"
10. Voce: "Perfeito! Pra emitir nota e agendar instalacao, qual seu CPF?"
11. Cliente: "123.456.789-00"
12. Voce: "Anotado! Qual o CEP do local de instalacao?"
13. Cliente: "22041-080"
14. Voce: "Rua Figueiredo Magalhaes, Copacabana - Rio de Janeiro/RJ. Qual o numero e apartamento?"
15. Cliente: "123, apto 401"
16. Voce: "Show, Joao! Tudo certo. Clica no botao 'Finalizar' ali embaixo! 👇"

🎯 QUANDO CLIENTE DESCREVE UM PRODUTO (ex: "quero um vidro 2x2"):
O sistema mostra cards de sugestao automaticamente. Sua resposta deve:

1. CONFIRMAR o que ele quer: "Perfeito! Um vidro de 2m x 2m."
2. PERGUNTAR SE QUER ADICIONAR: "Quer adicionar o Vidro Temperado Incolor ao seu orcamento?"
3. NAO apenas mostrar opcoes - seja proativo e sugira o produto mais adequado!

EXEMPLOS:
Cliente: "Quero um vidro 2 por 2 pro quarto"
Voce: "Otimo! Um vidro de 2m x 2m pro quarto. O Vidro Temperado 8mm Incolor e perfeito pra isso! Quer adicionar ao orcamento? 😊"

Cliente: "Preciso de um espelho pro banheiro"
Voce: "Legal! Espelho pro banheiro. O Espelho Bisotado e muito popular, mas tambem temos com LED se preferir algo mais moderno. Qual te interessa mais?"

IMPORTANTE: Se o cliente ja deu medidas, JA ADICIONE ao orcamento e confirme:
Cliente: "Quero um box 1,50 x 1,90"
Voce: "Perfeito! Ja anotei: Box de 1,50m x 1,90m. Qual acabamento - cromado, preto ou dourado?"

🎯 QUANDO CLIENTE SELECIONA PRODUTO VIA CARDS:
Quando a mensagem for "Quero adicionar: [PRODUTO]" ou "Me interessei pelo [PRODUTO]":

MUITO IMPORTANTE: Quando cliente clica no card, ele JA DECIDIU que quer esse produto!
- NAO pergunte "quer adicionar?" - ele ja clicou!
- CONFIRME a adicao: "Adicionei o [PRODUTO] ao seu orcamento! 👍"
- VA DIRETO para medidas: "Qual o tamanho que voce precisa?"

PRIMEIRO PRODUTO:
1. Confirme: "Otima escolha! Adicionei o [PRODUTO] ao seu orcamento."
2. Pergunte medidas: "Qual o tamanho que voce precisa? (largura x altura)"
3. Pergunte acabamento/cor se relevante
4. Pergunte: "Quer adicionar mais algum produto ou e so isso?"

QUANDO CLIENTE ADICIONA MAIS PRODUTOS:
Se ja tem produtos no orcamento e cliente seleciona outro:
1. Confirme a adicao: "Adicionei o [NOVO PRODUTO] ao seu orcamento! 👍"
2. Pergunte medidas do novo produto: "Qual o tamanho desse?"
3. Depois: "Mais alguma coisa ou podemos finalizar?"

EXEMPLO DE MULTIPLOS PRODUTOS:
Cliente: "Quero adicionar: Box Frontal Simples"
Voce: "Otima escolha! Box Frontal e o mais vendido. Qual o tamanho do vao? (largura x altura)"
Cliente: "1,20 x 1,90"
Voce: "Perfeito! 1,20m x 1,90m. Quer adicionar mais algum produto?"
Cliente: "Quero adicionar: Espelho LED"
Voce: "Show! Adicionei o Espelho LED tambem! Qual o tamanho do espelho?"
Cliente: "0,80 x 1,00"
Voce: "Anotado! Entao temos: Box 1,20x1,90 + Espelho LED 0,80x1,00. Mais alguma coisa?"
Cliente: "So isso"
Voce: "Beleza! Pra registrar, qual seu nome?"

IMPORTANTE: Sempre confirme o que ja tem no orcamento quando cliente adiciona mais itens!

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
1. Uma pergunta por vez, sempre!
2. Pergunte "Mais alguma coisa?" UMA VEZ apos coletar as infos principais
3. Seja breve - maximo 2-3 linhas por mensagem
4. Use linguagem natural e amigavel
5. Celebre cada informacao recebida ("Perfeito!", "Otimo!", "Entendi!")

🚨 DETECCAO DE FINALIZACAO - MUITO IMPORTANTE:
Quando o cliente disser QUALQUER uma dessas frases, OFEREÇA CHECKOUT IMEDIATAMENTE:
- "so isso", "e isso", "apenas isso", "nao preciso de mais nada"
- "nao", "nao quero", "nao preciso", "ta bom assim"
- "pode finalizar", "quero finalizar", "vamos fechar"
- "ja decidi", "e so isso mesmo", "pronto"
- "sim" (em resposta a "so isso?")
- "confirma", "pode confirmar", "isso mesmo"
- "finalizar", "checkout", "prosseguir", "continuar"
- "fechar pedido", "fazer pedido", "quero comprar"

⚡ RESPOSTA QUANDO CLIENTE QUER FINALIZAR:
ANTES de mandar pro checkout, verifique:
1. Tem produto definido? Se nao: "Qual produto voce precisa?"
2. Tem medidas? Se nao: "Quais as medidas (largura x altura)?"
3. Tem NOME do cliente? Se nao: "Qual seu nome pra eu registrar?"
4. Tem TELEFONE? Se nao: "Me passa seu WhatsApp pra gente entrar em contato?"

SO direcione pro checkout quando tiver TUDO:
"Perfeito, [NOME]! Clica no botao 'Finalizar e Ir para Checkout' ali embaixo! 👇"

Se falta algo, pergunte de forma natural:
- Falta medidas: "Pra gente finalizar, so me passa as medidas (largura x altura). 📐"
- Falta nome: "Qual seu nome pra eu registrar aqui?"
- Falta telefone: "Me passa seu WhatsApp pra nossa equipe te contatar?"

Ou se ele pedir visita tecnica/agendamento:
Use os horarios disponiveis abaixo e ofereca opcoes! Nao mande pro WhatsApp - agende aqui mesmo!

❌ NAO FACA ISSO quando cliente quer finalizar:
- NAO pergunte "so pra confirmar..."
- NAO repita os itens do orcamento
- NAO pergunte se quer mais alguma coisa DE NOVO
- NAO diga "entendi, entao voce precisa de..."
- APENAS direcione pro checkout!
- NAO mande pro WhatsApp se pode resolver aqui no chat!

⚠️ IMPORTANTE:
- Sistema salva automaticamente os dados estruturados
- Pergunte "mais alguma coisa?" apenas UMA VEZ
- Quando cliente responder que nao quer mais nada, VA DIRETO pro checkout
- Sempre sem acentos no texto (evita problemas de encoding)

📅 AGENDAMENTO DE VISITA TECNICA:
Quando cliente quiser agendar visita tecnica ou medicao, siga este fluxo:

1. Pergunte qual dia/horario funciona melhor pra ele
2. Ofereca opcoes dos horarios disponiveis (veja [SCHEDULING_SLOTS_PLACEHOLDER])
3. Quando ele escolher, confirme dia e horario
4. Pergunte o endereco completo (rua, numero, bairro, cidade)
5. Apos ter tudo, diga: "Pronto! Agendado pra [DIA] as [HORA]. Vou mandar os links pra voce adicionar no seu calendario!"

Exemplo de conversa de agendamento:

Cliente: "Quero marcar visita tecnica"
Voce: "Otimo! A visita tecnica e gratuita 😊 Qual dia funciona melhor pra voce? Temos horarios disponiveis de segunda a sexta, das 8h as 17h!"

Cliente: "Pode ser quarta de manha"
Voce: "Perfeito! Quarta-feira de manha. Prefere 8h ou 10h?"

Cliente: "10h"
Voce: "Show! Quarta as 10h entao. Me passa o endereco completo pra visita? Rua, numero, bairro e cidade."

Cliente: "Rua das Flores 123, Copacabana, Rio de Janeiro"
Voce: "Tudo certo! Agendado: Quarta-feira as 10h na Rua das Flores 123, Copacabana. Anotei aqui! O tecnico vai entrar em contato um dia antes pra confirmar. 📅✅"

REGRAS DE AGENDAMENTO:
- Horarios: 08:00, 10:00, 14:00, 16:00 (segunda a sexta)
- Duracao: 2 horas para visita tecnica
- Visita tecnica e GRATUITA - reforce isso!
- Sempre confirme endereco completo antes de finalizar
- Mencione que o tecnico confirma um dia antes

[SCHEDULING_SLOTS_PLACEHOLDER]

Seja sempre simpatica, paciente, atenciosa e conversacional! 😊`

/**
 * MELHORIAS Sprint M3: Build dynamic system prompt with product catalog
 */
async function buildSystemPrompt(): Promise<string> {
  const catalogContext = await getProductCatalogContext()
  const schedulingSlots = generateAvailableSlots()

  return SYSTEM_PROMPT_BASE.replace('[PRODUCT_CATALOG_PLACEHOLDER]', catalogContext).replace(
    '[SCHEDULING_SLOTS_PLACEHOLDER]',
    `\n📅 HORARIOS DISPONIVEIS ESTA SEMANA:\n${schedulingSlots}\n`
  )
}

// UX: System prompt para analise de imagens com estimativa de medidas
const VISION_SYSTEM_PROMPT = `Voce e Ana, da Versati Glass, especialista em analisar fotos e ESTIMAR MEDIDAS para orcamentos de vidros.

📐 COMO ESTIMAR MEDIDAS (SUA PRINCIPAL FUNCAO):
1. Use objetos de referencia na imagem para calcular:
   - Portas padrao: ~2,10m altura x 0,80m largura
   - Interruptor de luz: ~1,10m do chao
   - Tomadas: ~0,30m do chao
   - Azulejos: tipicamente 30x30cm, 45x45cm ou 60x60cm
   - Pia de banheiro: ~0,85m de altura
   - Vaso sanitario: ~0,40m de altura
   - Pessoa em pe: media 1,70m
   - Janela residencial: ~1,20m x 1,00m tipicamente
   - Bancada de cozinha: ~0,90m de altura

2. SEMPRE forneca estimativas em metros:
   - "Olhando as proporcoes, esse vao parece ter uns 1,20m de largura por 1,90m de altura"
   - "Pela referencia da porta, estimo 2,50m de largura total"
   - "Comparando com o azulejo, a area do box deve ter cerca de 1,00m x 1,80m"

3. Indique o nivel de confianca:
   - "Com base na porta, tenho boa confianca que sao uns 1,50m"
   - "Fica dificil precisar sem referencia, mas chuto entre 0,80m e 1,00m"

🎯 FLUXO DE ANALISE:
1. Identifique o ambiente (banheiro, sala, varanda...)
2. Localize objetos de referencia (porta, azulejo, pia, etc.)
3. ESTIME as medidas do espaco onde vai o vidro
4. Sugira o produto adequado com as medidas estimadas
5. Pergunte se as medidas fazem sentido pro cliente

💬 EXEMPLOS DE RESPOSTAS BEM ESTRUTURADAS:

"Vi aqui seu banheiro! Pela porta ao lado, estimo que o vao do box tem uns 1,20m de largura e 1,90m de altura. Um box de correr inox ficaria otimo. Essas medidas fazem sentido? 📐"

"Linda varanda! Usando o piso como referencia (parecem ser 60x60), calculo uns 4 metros de largura. Pra um guarda-corpo de 1 metro de altura, ficaria show! Bate com o que voce tem ai?"

"Pelo vaso sanitario como referencia, o espaco tem aproximadamente 0,90m de largura. Um espelho de 0,60m x 0,80m cairia bem em cima dessa pia. O que acha?"

⚠️ IMPORTANTE:
- SEMPRE tente estimar medidas - e sua funcao principal!
- Use multiplas referencias quando possivel
- Seja honesta sobre incertezas
- Confirme com o cliente se as medidas parecem corretas
- Mencione que a visita tecnica gratuita confirma tudo certinho

✅ LEMBRE-SE:
- Seja conversacional e objetiva
- Maximo 3-4 linhas por mensagem
- SEMPRE inclua estimativa de medidas quando possivel
- Pergunte se as medidas fazem sentido
- Faca uma pergunta pra continuar o dialogo`

// AI-CHAT Sprint P1.7: Extraction prompt for structured data
const EXTRACTION_PROMPT = `Analise a conversa abaixo e extraia TODAS as informacoes estruturadas para um orcamento de vidracaria.

IMPORTANTE: Extraia TODOS os produtos mencionados na conversa, incluindo:
- Produtos descritos pelo cliente (ex: "quero um vidro 2x2")
- Produtos selecionados via card (ex: "Quero adicionar: Vidro Temperado 8mm (categoria: VIDROS, slug: vidro-temperado-8mm)")

Retorne um JSON no seguinte formato (ou null se nao houver informacoes suficientes):
{
  "items": [{
    "category": "BOX" | "ESPELHOS" | "VIDROS" | "PORTAS" | "JANELAS" | "GUARDA_CORPO" | "CORTINAS_VIDRO" | "PERGOLADOS" | "TAMPOS_PRATELEIRAS" | "DIVISORIAS" | "FECHAMENTOS" | "FACHADAS" | "FERRAGENS" | "KITS" | "SERVICOS" | "OUTROS",
    "productName": "Nome descritivo do produto",
    "productSlug": "slug do produto (se informado na mensagem)",
    "width": numero em metros,
    "height": numero em metros,
    "quantity": numero inteiro,
    "thickness": "espessura do vidro (ex: 4mm, 6mm, 8mm, 10mm)",
    "glassType": "Temperado" | "Laminado" | "Comum",
    "glassColor": "Incolor" | "Fume" | "Bronze" | "Verde",
    "color": "cor da ferragem (opcional)",
    "model": "modelo especifico (opcional)"
  }],
  "customerData": {
    "name": "nome completo (se mencionado)",
    "phone": "telefone (se mencionado)",
    "email": "email (se mencionado)",
    "cpfCnpj": "CPF ou CNPJ (se mencionado, apenas numeros)",
    "street": "rua/logradouro (se mencionado)",
    "number": "numero da casa/apartamento (se mencionado)",
    "complement": "complemento/apartamento (se mencionado)",
    "neighborhood": "bairro (se mencionado)",
    "city": "cidade (se mencionada)",
    "state": "estado/UF (se mencionado, ex: RJ, SP)",
    "zipCode": "CEP (se mencionado, apenas numeros)"
  },
  "scheduling": {
    "wantsVisit": true | false,
    "preferredDay": "dia da semana ou data (se mencionado)",
    "preferredTime": "horario preferido (se mencionado)",
    "address": {
      "street": "rua (se mencionado)",
      "number": "numero (se mencionado)",
      "neighborhood": "bairro (se mencionado)",
      "city": "cidade (se mencionado)"
    },
    "confirmed": true | false
  }
}

REGRAS CRITICAS:
1. Retorne APENAS o JSON, sem texto adicional
2. Extraia TODOS os produtos mencionados - mesmo que ainda nao tenham medidas!
3. Converta todas as medidas para numeros (ex: "1.20m" -> 1.2, "um metro e meio" -> 1.5)
4. Use apenas as categorias listadas acima
5. Quantity default e 1 se nao especificado
6. Nao invente informacoes que nao foram mencionadas
7. Se cliente disse "Quero adicionar: [PRODUTO]", extraia esse produto como um item SEPARADO
8. Cada produto mencionado deve ser um item diferente no array, NAO junte em um so
9. Se tiver medidas diferentes, sao produtos diferentes (ex: "vidro 2x2" e "vidro 1x1" = 2 items)

EXEMPLO de multiplos produtos:
Cliente: "quero um vidro 2x2 pro quarto"
Assistente: "Perfeito! ..."
Cliente: "Quero adicionar: Vidro Temperado 8mm (categoria: VIDROS, slug: vidro-temperado-8mm)"
Assistente: "Adicionei! Qual o tamanho?"
Cliente: "1 por 1"

Resultado esperado:
{
  "items": [
    { "category": "VIDROS", "productName": "Vidro para quarto", "width": 2, "height": 2 },
    { "category": "VIDROS", "productName": "Vidro Temperado 8mm", "productSlug": "vidro-temperado-8mm", "width": 1, "height": 1 }
  ]
}

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

    // Use OpenAI for extraction (more reliable than Groq for structured data)
    const extractionCompletion = await withRetry(() =>
      openai.chat.completions.create({
        model: 'gpt-4o-mini',
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
    )

    const extractedText = extractionCompletion.choices[0]?.message?.content?.trim()

    logger.info('[EXTRACTION] Raw response from LLM', {
      conversationId,
      extractedText: extractedText?.substring(0, 500),
    })

    if (!extractedText || extractedText === 'null') {
      logger.info('[EXTRACTION] No data extracted (null or empty)')
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

      // MELHORADO: Aceitar itens com apenas categoria OU medidas
      // Isso permite progresso inicial quando cliente menciona produto
      const hasItems = parsed.items && Array.isArray(parsed.items) && parsed.items.length > 0
      const hasValidItem = hasItems && parsed.items.some(
        (item: any) => item.category || item.productName || item.width || item.height
      )
      const hasCustomerData = parsed.customerData && (
        parsed.customerData.name ||
        parsed.customerData.phone ||
        parsed.customerData.email ||
        parsed.customerData.street ||
        parsed.customerData.city
      )

      // Retornar dados se tiver items (mesmo parciais) OU dados do cliente
      if (!hasValidItem && !hasCustomerData) {
        logger.info('[EXTRACTION] No valid items or customer data found', {
          conversationId,
          hasItems,
          hasValidItem,
          hasCustomerData,
          parsedItems: parsed.items,
        })
        return null
      }

      logger.info('Quote data extracted from conversation', {
        conversationId,
        itemCount: parsed.items?.length || 0,
        hasCustomerData: !!hasCustomerData,
        hasValidItem,
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
    // Rate limiting - 30 messages per hour for chat
    const rateLimitResult = await rateLimit(request, RATE_LIMITS.lenient)

    if (!rateLimitResult.success) {
      const resetIn = Math.ceil(rateLimitResult.reset - Date.now() / 1000)

      logger.warn('[API /ai/chat POST] Rate limit exceeded', {
        ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
        reset: rateLimitResult.reset,
      })

      return NextResponse.json(
        {
          error: 'Muitas mensagens',
          message: `Você excedeu o limite de mensagens. Tente novamente em ${resetIn} segundos.`,
        },
        { status: 429 }
      )
    }

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

    // Buscar conversa existente - primeiro por ID, depois por sessionId
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

    // Se nao encontrou por conversationId, buscar por sessionId
    if (!conversation && sessionId) {
      conversation = await prisma.aiConversation.findFirst({
        where: {
          sessionId: sessionId,
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

    // Verificar se conversa esta abandonada (timeout)
    if (conversation) {
      const lastUpdate = new Date(conversation.updatedAt)
      const hoursAgo = (Date.now() - lastUpdate.getTime()) / (1000 * 60 * 60)

      if (hoursAgo > CONVERSATION_TIMEOUT_HOURS && conversation.status === 'ACTIVE') {
        // Marcar como abandonada - mas nao criar nova ainda
        await prisma.aiConversation.update({
          where: { id: conversation.id },
          data: { status: 'ABANDONED' },
        })
        conversation = null // Forcar criacao de nova conversa com novo sessionId
      }
    }

    if (!conversation) {
      // Criar nova conversa com sessionId unico
      // Se sessionId ja existe (abandonada), gerar novo sessionId
      const uniqueSessionId = sessionId ? `${sessionId}-${Date.now()}` : `anon-${Date.now()}`

      conversation = await prisma.aiConversation.create({
        data: {
          sessionId: uniqueSessionId,
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

    // CEP Detection and Address Lookup
    let cepContext = ''
    const cepResult = await detectAndFetchCep(message)
    if (cepResult.hasCep) {
      if (cepResult.address) {
        // CEP valido - adicionar endereco ao contexto
        cepContext = `\n\n[SISTEMA: CEP ${cepResult.cep} detectado. Endereco encontrado: ${cepResult.address.street}, ${cepResult.address.neighborhood}, ${cepResult.address.city}/${cepResult.address.state}. Confirme o endereco com o cliente e pergunte o numero/complemento.]\n`

        logger.info('[CEP] Address found', {
          conversationId: conversation.id,
          cep: cepResult.cep,
          city: cepResult.address.city,
          state: cepResult.address.state,
        })
      } else if (cepResult.error) {
        // CEP invalido - informar ao agente
        cepContext = `\n\n[SISTEMA: CEP ${cepResult.cep} informado pelo cliente nao foi encontrado. Peca para o cliente verificar e informar novamente.]\n`

        logger.warn('[CEP] Invalid CEP', {
          conversationId: conversation.id,
          cep: cepResult.cep,
          error: cepResult.error,
        })
      }
    }

    // FASE-5: Fetch unified context across channels
    const unifiedContext = await getUnifiedCustomerContext({
      userId: userId || undefined,
      sessionId: sessionId || undefined,
      phoneNumber: conversation.customerPhone || detectedPhone || undefined,
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

      // Use withRetry for connection resilience
      const visionCompletion = await withRetry(() =>
        openai.chat.completions.create({
          model: 'gpt-4o',
          max_tokens: 500, // Aumentado para incluir estimativas de medidas detalhadas
          temperature: 0.7, // Mais preciso para estimativas de medidas
          messages: visionMessages,
        })
      )

      assistantMessage =
        visionCompletion.choices[0]?.message?.content || 'Desculpe, nao consegui analisar a imagem.'
      tokensUsed = visionCompletion.usage?.total_tokens || 0
    } else {
      // Montar historico de mensagens
      const messages: ChatMessage[] = conversation.messages.map((msg) => ({
        role: msg.role.toLowerCase() as 'user' | 'assistant',
        content: msg.content,
      }))

      // Adicionar nova mensagem do usuario
      messages.push({ role: 'user', content: message })

      // Tentar Groq primeiro, fallback para OpenAI se falhar
      try {
        modelUsed = 'llama-3.3-70b-versatile'

        const completion = await withRetry(() =>
          groq.chat.completions.create({
            model: 'llama-3.3-70b-versatile',
            max_tokens: 300,
            temperature: 0.8,
            messages: [
              {
                role: 'system',
                content: SYSTEM_PROMPT + customerContext + productContext + unifiedContextSummary + cepContext,
              },
              ...messages,
            ],
          })
        )

        assistantMessage =
          completion.choices[0]?.message?.content ||
          'Desculpe, nao consegui processar sua mensagem.'
        tokensUsed = completion.usage?.total_tokens || 0
      } catch (groqError) {
        // Fallback para OpenAI GPT-4o-mini se Groq falhar
        logger.warn('[AI CHAT] Groq failed, falling back to OpenAI', {
          error: groqError instanceof Error ? groqError.message : 'Unknown error',
        })

        modelUsed = 'gpt-4o-mini'

        const openaiMessages: OpenAI.Chat.ChatCompletionMessageParam[] = [
          {
            role: 'system',
            content: SYSTEM_PROMPT + customerContext + productContext + unifiedContextSummary + cepContext,
          },
          ...messages.map((msg) => ({
            role: msg.role as 'user' | 'assistant',
            content: msg.content,
          })),
        ]

        const completion = await withRetry(() =>
          openai.chat.completions.create({
            model: 'gpt-4o-mini',
            max_tokens: 300,
            temperature: 0.8,
            messages: openaiMessages,
          })
        )

        assistantMessage =
          completion.choices[0]?.message?.content ||
          'Desculpe, nao consegui processar sua mensagem.'
        tokensUsed = completion.usage?.total_tokens || 0
      }
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
    let extractedData = await extractQuoteDataFromConversation(conversation.id, [
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

    // Enrich extracted data with CEP lookup results
    if (cepResult.hasCep && cepResult.address && extractedData) {
      extractedData = {
        ...extractedData,
        customerData: {
          ...extractedData.customerData,
          street: cepResult.address.street || extractedData.customerData?.street,
          neighborhood: cepResult.address.neighborhood || extractedData.customerData?.neighborhood,
          city: cepResult.address.city || extractedData.customerData?.city,
          state: cepResult.address.state || extractedData.customerData?.state,
          zipCode: cepResult.address.zipCode || extractedData.customerData?.zipCode,
        },
      }

      logger.info('[CEP] Enriched extractedData with address', {
        conversationId: conversation.id,
        city: cepResult.address.city,
      })
    }

    // Detectar se usuario quer cancelar/reiniciar o orcamento
    const isCancellation = message.toLowerCase().match(
      /\b(cancelar|reiniciar|começar de novo|comecar de novo|desistir|novo orçamento|novo orcamento)\b/
    )

    // MELHORADO: Mesclar dados extraidos com contexto anterior
    // Isso garante que dados do cliente (nome, telefone) nao sejam perdidos
    // e que multiplos produtos sejam ACUMULADOS (nao substituidos)
    let mergedQuoteContext = extractedData || conversation.quoteContext

    if (extractedData && conversation.quoteContext) {
      const existingContext = conversation.quoteContext as any

      // CORRECAO: Acumular items em vez de substituir
      // Usa productName + category como chave unica para evitar duplicatas
      // Cria copia do array para evitar mutacao
      let mergedItems = [...(existingContext.items || [])]

      if (extractedData.items?.length > 0) {
        for (const newItem of extractedData.items) {
          // Verifica se item ja existe (mesmo produto/categoria com medidas similares)
          const existingIndex = mergedItems.findIndex((existing: any) => {
            const sameProduct = (
              (existing.productName && newItem.productName &&
               existing.productName.toLowerCase() === newItem.productName.toLowerCase()) ||
              (existing.category === newItem.category &&
               existing.width === newItem.width &&
               existing.height === newItem.height)
            )
            return sameProduct
          })

          if (existingIndex >= 0) {
            // Atualiza item existente com novos dados (merge)
            mergedItems[existingIndex] = {
              ...mergedItems[existingIndex],
              ...newItem,
            }
          } else {
            // Adiciona novo item
            mergedItems.push(newItem)
          }
        }
      }

      mergedQuoteContext = {
        // Items acumulados
        items: mergedItems,
        // Mesclar customerData (manter dados anteriores, sobrescrever com novos)
        customerData: {
          ...existingContext.customerData,
          ...extractedData.customerData,
        },
        // Mesclar scheduling
        scheduling: extractedData.scheduling || existingContext.scheduling,
      }

      logger.debug('[AI CHAT] Merged quoteContext', {
        conversationId: conversation.id,
        existingItemCount: existingContext.items?.length || 0,
        newItemCount: extractedData.items?.length || 0,
        mergedItemCount: mergedItems.length,
        hasExistingCustomer: !!existingContext.customerData,
        hasNewCustomer: !!extractedData.customerData,
      })
    }

    // Atualizar conversa com quoteContext
    // Se cancelamento, limpar quoteContext para nao exibir progresso/finalizar
    await prisma.aiConversation.update({
      where: { id: conversation.id },
      data: {
        updatedAt: new Date(),
        quoteContext: isCancellation ? null : mergedQuoteContext,
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

    // Verificar se ha agendamento confirmado para gerar links de calendario
    let calendarLinks = null
    if (
      extractedData?.scheduling?.confirmed &&
      extractedData?.scheduling?.preferredDay &&
      extractedData?.scheduling?.preferredTime &&
      extractedData?.scheduling?.address
    ) {
      try {
        // Calcular data do agendamento
        const scheduledDate = parseSchedulingDate(extractedData.scheduling.preferredDay)
        const scheduledTime = extractedData.scheduling.preferredTime

        if (scheduledDate) {
          const address = [
            extractedData.scheduling.address.street,
            extractedData.scheduling.address.number,
            extractedData.scheduling.address.neighborhood,
            extractedData.scheduling.address.city,
          ]
            .filter(Boolean)
            .join(', ')

          const eventData = createVersatiAppointmentEvent({
            type: 'TECHNICAL_VISIT',
            scheduledDate,
            scheduledTime,
            address,
            customerName: extractedData.customerData?.name,
          })

          calendarLinks = generateAllCalendarLinks(eventData)

          logger.info('[AI CHAT] Calendar links generated for scheduling', {
            conversationId: conversation.id,
            scheduledDate: scheduledDate.toISOString(),
            scheduledTime,
          })
        }
      } catch (calendarError) {
        logger.warn('[AI CHAT] Failed to generate calendar links', {
          error: calendarError,
        })
      }
    }

    return NextResponse.json({
      message: assistantMessage,
      conversationId: conversation.id,
      model: modelUsed,
      quoteContext: isCancellation ? null : mergedQuoteContext,
      calendarLinks: calendarLinks
        ? {
            google: calendarLinks.google,
            outlook: calendarLinks.outlook,
            office365: calendarLinks.office365,
          }
        : null,
      schedulingDetected: extractedData?.scheduling?.wantsVisit || false,
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

    // Verificar se e erro de conexao (Groq/OpenAI)
    if (
      error instanceof Error &&
      (error.message.includes('Connection error') ||
        error.message.includes('ECONNRESET') ||
        error.message.includes('fetch failed'))
    ) {
      return NextResponse.json(
        {
          error:
            'Nosso assistente esta com dificuldade de conexao. Tente novamente em alguns segundos.',
        },
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
          'Desculpe, ocorreu um erro ao processar sua mensagem. Tente novamente ou entre em contato pelo WhatsApp.',
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
