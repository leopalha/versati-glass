import Groq from 'groq-sdk'
import { logger } from '@/lib/logger'

let groqInstance: Groq | null = null

function getGroq(): Groq {
  if (!groqInstance) {
    if (!process.env.GROQ_API_KEY) {
      throw new Error('Missing GROQ_API_KEY environment variable')
    }
    groqInstance = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    })
  }
  return groqInstance
}

// System prompt para o agente de atendimento da Versati Glass
const SYSTEM_PROMPT = `Voce e a Ana, assistente virtual da Versati Glass, uma vidracaria premium do Rio de Janeiro especializada em box para banheiro, espelhos, vidros temperados, portas e janelas de vidro.

PERSONALIDADE:
- Amigavel, profissional e prestativa
- Fala de forma natural em portugues brasileiro
- Usa emojis com moderacao para ser mais acolhedora
- E paciente e atenciosa com os clientes

SERVICOS DA VERSATI GLASS:
1. BOX PARA BANHEIRO
   - Box de correr (mais popular)
   - Box de abrir
   - Box Elegance (premium)
   - Box Flex (espacos compactos)
   - Cores de ferragem: Preto, Branco, Inox, Bronze, Dourado
   - Espessura: 8mm temperado

2. ESPELHOS
   - Espelhos comuns (Guardian 4mm)
   - Espelhos com LED
   - Espelhos bisote/lapidados
   - Sob medida

3. VIDROS TEMPERADOS
   - Tampos de mesa
   - Prateleiras
   - Divisorias
   - Coberturas

4. PORTAS E JANELAS
   - Portas de abrir/correr
   - Janelas blindex
   - Fechamentos de varanda

PRECOS APROXIMADOS (para referencia):
- Box simples: R$ 1.400 - R$ 1.900
- Box Elegance: R$ 1.800 - R$ 2.500
- Espelho 4mm: R$ 180/m²
- Vidro temperado 8mm: R$ 250/m²

AREA DE ATENDIMENTO:
- Rio de Janeiro e Grande Rio
- Zona Oeste, Zona Norte, Zona Sul, Centro, Barra, Niteroi

FLUXO DE ATENDIMENTO - IMPORTANTE SEGUIR NESTA ORDEM:
1. IDENTIFICACAO INICIAL - Identificar tipo de servico (box, espelho, vidro, porta, etc)
2. PERGUNTAS QUALIFICADORAS - Faca MUITAS perguntas para entender EXATAMENTE o que o cliente quer:
   - Para BOX: Qual tipo? (correr, abrir, elegance, flex). Tem banheira ou so chuveiro? Quanto mede o vao? Preferencia de cor de ferragem?
   - Para ESPELHOS: Onde vai instalar? (banheiro, sala, quarto). Quer com LED? Quer bisote/lapidacao? Tamanho aproximado?
   - Para VIDROS: Para que uso? (mesa, prateleira, divisoria, cobertura). Espessura necessaria? Precisa ser temperado?
   - Para PORTAS/JANELAS: Interno ou externo? De correr ou abrir? Tamanho do vao?
3. DETALHAMENTO DE CARACTERISTICAS - Cores, acabamentos, preferencias esteticas
4. MEDICAO - Pergunte medidas aproximadas OU oferca visita tecnica
5. LOCALIZACAO - Confirme se esta na area de atendimento (RJ e Grande Rio)
6. DADOS DE CONTATO - Apenas quando tiver TODOS os detalhes acima: nome, telefone, endereco
7. FINALIZACAO - Gerar orcamento ou agendar visita

REGRAS CRITICAS:
- NAO PULE ETAPAS! Faca TODAS as perguntas qualificadoras ANTES de pedir dados de contato
- NUNCA invente precos exatos, sempre diga que e uma estimativa
- SEMPRE oferca a opcao de visita tecnica gratuita para medicao precisa
- Se nao souber responder algo tecnico, diga que um especialista entrara em contato
- Horario de atendimento: Seg-Sex 8h-18h, Sab 8h-12h
- Para emergencias ou duvidas complexas, ofereca falar com um atendente humano
- Faca NO MINIMO 5-7 perguntas qualificadoras antes de coletar dados de contato

FORMATO DE RESPOSTA:
- Respostas curtas e diretas (max 3-4 frases por mensagem)
- Use quebras de linha para organizar
- Faca UMA pergunta por vez para nao confundir o cliente
- Seja especifica nas perguntas para filtrar bem o que o cliente quer`

export interface ConversationMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

export interface AIResponse {
  message: string
  shouldEscalate: boolean
  extractedData?: {
    name?: string
    phone?: string
    email?: string
    address?: string
    product?: string
    measurements?: string
    appointmentDate?: string
    appointmentTime?: string
  }
}

export async function generateAIResponse(
  userMessage: string,
  conversationHistory: ConversationMessage[] = [],
  customerContext?: {
    name?: string
    previousOrders?: number
    lastProduct?: string
  }
): Promise<AIResponse> {
  const groq = getGroq()

  // Build context-aware system prompt
  let contextualSystemPrompt = SYSTEM_PROMPT

  if (customerContext?.name) {
    contextualSystemPrompt += `\n\nCONTEXTO DO CLIENTE:
- Nome: ${customerContext.name}
- Pedidos anteriores: ${customerContext.previousOrders || 0}
${customerContext.lastProduct ? `- Ultimo produto: ${customerContext.lastProduct}` : ''}`
  }

  // Build messages array
  const messages: ConversationMessage[] = [
    { role: 'system', content: contextualSystemPrompt },
    ...conversationHistory.slice(-10), // Keep last 10 messages for context
    { role: 'user', content: userMessage },
  ]

  try {
    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile', // Best Llama model for conversation
      messages: messages.map((m) => ({
        role: m.role,
        content: m.content,
      })),
      temperature: 0.7,
      max_tokens: 500,
      top_p: 0.9,
    })

    const responseMessage = completion.choices[0]?.message?.content || ''

    // Check if should escalate to human
    const shouldEscalate =
      userMessage.toLowerCase().includes('falar com humano') ||
      userMessage.toLowerCase().includes('atendente') ||
      userMessage.toLowerCase().includes('reclamacao') ||
      userMessage.toLowerCase().includes('problema grave') ||
      responseMessage.toLowerCase().includes('atendente humano')

    // Try to extract data from conversation
    const extractedData = extractDataFromMessage(userMessage, responseMessage)

    return {
      message: responseMessage,
      shouldEscalate,
      extractedData,
    }
  } catch (error) {
    logger.error('Groq API error:', error)

    // Determine appropriate fallback based on user message
    const fallbackMessage = getFallbackResponse(userMessage)

    return {
      message: fallbackMessage,
      shouldEscalate: false,
    }
  }
}

// Fallback responses when AI is unavailable
function getFallbackResponse(userMessage: string): string {
  const lowerMessage = userMessage.toLowerCase()

  // Greeting
  if (lowerMessage.match(/^(oi|ola|bom dia|boa tarde|boa noite|opa|eae|hey|hi)/)) {
    const hour = new Date().getHours()
    const greeting = hour < 12 ? 'Bom dia' : hour < 18 ? 'Boa tarde' : 'Boa noite'
    return `${greeting}! 😊 Sou a Ana, assistente da Versati Glass. Estamos com uma pequena instabilidade no sistema, mas posso ajudar! Para orcamentos, acesse nosso site ou fale com um atendente pelo (21) 98253-6229.`
  }

  // Price/Quote inquiry
  if (lowerMessage.match(/(preco|valor|quanto custa|orcamento|custo)/)) {
    return `Para orcamentos precisos, oferecemos visita tecnica gratuita! 📋\n\nVoce pode:\n1. Solicitar pelo site: versatiglass.com.br/orcamento\n2. Ligar: (21) 98253-6229\n\nAssim garantimos o melhor preco para voce!`
  }

  // Product inquiry
  if (lowerMessage.match(/(box|banheiro|espelho|vidro|porta|janela)/)) {
    return `Trabalhamos com:\n\n• Box para banheiro (correr, abrir, Elegance)\n• Espelhos (comum, LED, bisote)\n• Vidros temperados\n• Portas e janelas\n\nPara detalhes e orcamentos, acesse versatiglass.com.br ou ligue (21) 98253-6229 📞`
  }

  // Schedule/Visit
  if (lowerMessage.match(/(agendar|visita|marcar|horario)/)) {
    return `Para agendar uma visita tecnica gratuita:\n\n📞 Ligue: (21) 98253-6229\n🌐 Acesse: versatiglass.com.br/orcamento\n\nAtendemos de Seg-Sex 8h-18h e Sab 8h-12h!`
  }

  // Location/Service area
  if (lowerMessage.match(/(atende|regiao|zona|bairro|onde|local)/)) {
    return `Atendemos todo Rio de Janeiro e Grande Rio:\n\n• Zona Sul, Norte, Oeste e Centro\n• Barra da Tijuca\n• Niteroi e regiao\n\nFale conosco: (21) 98253-6229`
  }

  // Default fallback
  return `Desculpe, estou com uma pequena dificuldade tecnica no momento. 😊\n\nPara atendimento imediato:\n📞 (21) 98253-6229\n🌐 versatiglass.com.br\n\nOu aguarde que um atendente entrara em contato!`
}

// Helper to extract structured data from messages
function extractDataFromMessage(
  userMessage: string,
  _aiResponse: string
): AIResponse['extractedData'] {
  const data: AIResponse['extractedData'] = {}

  // Extract phone number
  const phoneMatch = userMessage.match(/(?:\+?55\s?)?(?:\(?0?\d{2}\)?[\s.-]?)?\d{4,5}[\s.-]?\d{4}/)
  if (phoneMatch) {
    data.phone = phoneMatch[0].replace(/\D/g, '')
  }

  // Extract email
  const emailMatch = userMessage.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/)
  if (emailMatch) {
    data.email = emailMatch[0]
  }

  // Extract CEP
  const cepMatch = userMessage.match(/\d{5}-?\d{3}/)
  if (cepMatch) {
    data.address = cepMatch[0]
  }

  // Extract measurements (e.g., "1.20 x 1.90", "120x190", "1,2m por 1,9m")
  const measurementMatch = userMessage.match(
    /(\d+[,.]?\d*)\s*[xX×]\s*(\d+[,.]?\d*)|(\d+[,.]?\d*)\s*(?:m|metros?)?\s*(?:por|x)\s*(\d+[,.]?\d*)/i
  )
  if (measurementMatch) {
    data.measurements = measurementMatch[0]
  }

  // Detect product interest
  const productKeywords = {
    box: ['box', 'banheiro', 'blindex'],
    espelho: ['espelho', 'mirror'],
    vidro: ['vidro', 'temperado', 'mesa', 'prateleira'],
    porta: ['porta', 'janela', 'fechamento'],
  }

  for (const [product, keywords] of Object.entries(productKeywords)) {
    if (keywords.some((kw) => userMessage.toLowerCase().includes(kw))) {
      data.product = product
      break
    }
  }

  return Object.keys(data).length > 0 ? data : undefined
}

// Generate a greeting message based on time of day
export function generateGreeting(customerName?: string): string {
  const hour = new Date().getHours()
  let greeting: string

  if (hour < 12) {
    greeting = 'Bom dia'
  } else if (hour < 18) {
    greeting = 'Boa tarde'
  } else {
    greeting = 'Boa noite'
  }

  if (customerName) {
    return `${greeting}, ${customerName}! 😊 Sou a Ana, assistente virtual da Versati Glass. Como posso ajudar voce hoje?`
  }

  return `${greeting}! 😊 Sou a Ana, assistente virtual da Versati Glass. Como posso ajudar voce hoje?`
}

// Generate quote summary message
export function generateQuoteSummary(quote: {
  number: string
  product: string
  measurements: string
  estimatedPrice: number
  validUntil: Date
}): string {
  return `📋 *Resumo do seu Orcamento*

Numero: ${quote.number}
Produto: ${quote.product}
Medidas: ${quote.measurements}
Valor estimado: R$ ${quote.estimatedPrice.toFixed(2)}
Valido ate: ${quote.validUntil.toLocaleDateString('pt-BR')}

Este valor e uma estimativa. Para confirmacao do preco final, recomendamos agendar uma visita tecnica gratuita.

Deseja agendar a visita? 📅`
}

// Generate appointment confirmation message
export function generateAppointmentConfirmation(appointment: {
  date: string
  time: string
  address: string
  technician?: string
}): string {
  return `✅ *Visita Tecnica Agendada!*

📅 Data: ${appointment.date}
🕐 Horario: ${appointment.time}
📍 Endereco: ${appointment.address}
${appointment.technician ? `👷 Tecnico: ${appointment.technician}` : ''}

Enviaremos um lembrete 24h antes.
Se precisar reagendar, e so avisar!`
}
