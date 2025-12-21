'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useToast } from '@/components/ui/toast/use-toast'
import { cn } from '@/lib/utils'
import {
  MessageCircle,
  X,
  Send,
  Loader2,
  Bot,
  User,
  ChevronDown,
  ChevronUp,
  Minimize2,
  Maximize2,
  Image as ImageIcon,
  X as XIcon,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  Package,
  Ruler,
  UserCircle,
  Circle,
  Trash2,
  XCircle,
  Calendar,
  ExternalLink,
} from 'lucide-react'
import { logger } from '@/lib/logger'

// LocalStorage key for chat persistence
const CHAT_STORAGE_KEY = 'versati-chat-session'

// Interface for persisted chat data
interface PersistedChatData {
  messages: Message[]
  conversationId: string | null
  quoteContext: any
  quoteProgress: number
  timestamp: number
}

// Helper: Save chat to localStorage
function saveChatToStorage(data: PersistedChatData) {
  try {
    localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(data))
  } catch (error) {
    console.warn('Failed to save chat to localStorage:', error)
  }
}

// Helper: Load chat from localStorage
function loadChatFromStorage(): PersistedChatData | null {
  try {
    const stored = localStorage.getItem(CHAT_STORAGE_KEY)
    if (!stored) return null

    const data = JSON.parse(stored) as PersistedChatData

    // Expire after 24 hours
    const EXPIRATION_MS = 24 * 60 * 60 * 1000
    if (Date.now() - data.timestamp > EXPIRATION_MS) {
      localStorage.removeItem(CHAT_STORAGE_KEY)
      return null
    }

    return data
  } catch (error) {
    console.warn('Failed to load chat from localStorage:', error)
    return null
  }
}

// Helper: Clear chat from localStorage
function clearChatStorage() {
  try {
    localStorage.removeItem(CHAT_STORAGE_KEY)
  } catch (error) {
    console.warn('Failed to clear chat from localStorage:', error)
  }
}
import { motion, AnimatePresence } from 'framer-motion'
import { useQuoteStore } from '@/store/quote-store'
import type { AiQuoteData } from '@/store/quote-store'
import { getQuoteContextCompletion, getProgressDetails, type ProgressDetail } from '@/lib/ai-quote-transformer'
import { VoiceChatButton } from '@/components/chat/voice-chat-button'
import { useVoice } from '@/hooks/use-voice'
import { useCrossChannelUpdates } from '@/hooks/use-cross-channel-updates'
import { showCrossChannelNotification } from '@/components/chat/cross-channel-notification'
import { QuoteTransitionModal } from '@/components/chat/quote-transition-modal'
import { RegisterConfirmModal } from '@/components/chat/register-confirm-modal'
import {
  CollapsibleProductSuggestions,
  CollapsibleMultiCategoryProductSuggestions,
  type ProductSuggestion,
} from '@/components/chat/product-suggestion-card'
import { useSession, signIn } from 'next-auth/react'

interface Message {
  id: string
  role: 'USER' | 'ASSISTANT' | 'PRODUCT_SUGGESTIONS'
  content: string
  createdAt: string
  imageUrl?: string
  measurements?: {
    width?: number
    height?: number
    referenceObject?: string
    confidence: 'low' | 'medium' | 'high'
    needsCalibration: boolean
    calibrationHelp?: string
  }
  calendarLinks?: {
    google: string
    outlook: string
    office365: string
  }
  // Product suggestions data (for role: 'PRODUCT_SUGGESTIONS')
  productData?: {
    products: ProductSuggestion[]
    category: string
    categories: string[]
    isCollapsed: boolean
  }
}

interface ChatAssistidoProps {
  className?: string
  initialOpen?: boolean
  position?: 'bottom-right' | 'bottom-left'
  onClose?: () => void
  showInitially?: boolean
}

export function ChatAssistido({
  className,
  initialOpen = false,
  position = 'bottom-right',
  onClose,
  showInitially = false,
}: ChatAssistidoProps) {
  const router = useRouter()
  const { toast } = useToast()
  const { data: session, status: sessionStatus } = useSession()
  const importFromAI = useQuoteStore((state) => state.importFromAI)

  const [isOpen, setIsOpen] = useState(initialOpen || showInitially)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [conversationId, setConversationId] = useState<string | null>(null)
  const [sessionId] = useState(
    () => `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  )
  const [selectedImage, setSelectedImage] = useState<{
    file: File
    preview: string
    base64: string
  } | null>(null)
  const [isUploadingImage, setIsUploadingImage] = useState(false)

  // AI-CHAT Sprint P1.6: Quote export state
  const [canExportQuote, setCanExportQuote] = useState(false)
  const [isExportingQuote, setIsExportingQuote] = useState(false)

  // AI-CHAT Sprint P3.2: Progress tracking state
  const [quoteProgress, setQuoteProgress] = useState(0)
  const [quoteContext, setQuoteContext] = useState<any>(null)

  // AI-CHAT Sprint P2.3: Transition modal state
  const [showTransitionModal, setShowTransitionModal] = useState(false)
  const [pendingQuoteData, setPendingQuoteData] = useState<AiQuoteData | null>(null)

  // Register confirmation modal state
  const [showRegisterModal, setShowRegisterModal] = useState(false)
  const [isRegisterLoading, setIsRegisterLoading] = useState(false)

  // AI-CHAT Sprint P2.4: Product suggestions state
  // MELHORADO: Suporta multiplas categorias simultaneamente
  const [productSuggestions, setProductSuggestions] = useState<ProductSuggestion[]>([])
  const [suggestedCategory, setSuggestedCategory] = useState<string | null>(null)
  const [suggestedCategories, setSuggestedCategories] = useState<string[]>([]) // Multiplas categorias
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([])

  // Voice feature state
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(false)
  const { speak, stopSpeaking, isSpeaking } = useVoice({ language: 'pt-BR' })

  // Progress bar minimize state
  const [isProgressMinimized, setIsProgressMinimized] = useState(false)

  // Progress confirmation state - only show after user confirms
  const [progressConfirmed, setProgressConfirmed] = useState(false)

  // OMNICHANNEL Sprint 1 - Task 4: Cross-channel notifications
  // Memoize onUpdate to prevent infinite loop
  const handleCrossChannelUpdate = useCallback((message: any) => {
    // Exibir notificação toast
    showCrossChannelNotification({
      content: message.content,
      senderType: message.senderType,
    })

    // Adicionar mensagem à timeline do chat (apenas se não existir)
    setMessages((prev) => {
      // Check if message already exists by ID
      const messageExists = prev.some((msg) => msg.id === message.id)
      if (messageExists) {
        return prev // Don't add duplicate
      }

      return [
        ...prev,
        {
          id: message.id,
          role: 'ASSISTANT',
          content: `📱 *Resposta via WhatsApp:*\n\n${message.content}`,
          createdAt: message.timestamp,
        },
      ]
    })
  }, [])

  useCrossChannelUpdates({
    conversationId: conversationId || undefined,
    enabled: isOpen && !!conversationId,
    onUpdate: handleCrossChannelUpdate,
    pollingInterval: 10000, // 10 segundos
  })

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const hasRestoredRef = useRef(false)

  // GAP.6: Restore chat from localStorage on mount
  useEffect(() => {
    if (hasRestoredRef.current) return
    hasRestoredRef.current = true

    const savedData = loadChatFromStorage()
    if (savedData && savedData.messages.length > 0) {
      // Filter out imageUrl from messages (blob URLs don't persist)
      const cleanMessages = savedData.messages.map((msg) => ({
        ...msg,
        imageUrl: undefined,
      }))
      setMessages(cleanMessages)
      if (savedData.conversationId) {
        setConversationId(savedData.conversationId)
      }
      if (savedData.quoteContext) {
        setQuoteContext(savedData.quoteContext)
      }
      if (savedData.quoteProgress) {
        setQuoteProgress(savedData.quoteProgress)
      }
    }
  }, [])

  // GAP.6: Save chat to localStorage when state changes
  useEffect(() => {
    // Don't save if no messages or only welcome message
    if (messages.length <= 1) return

    saveChatToStorage({
      messages,
      conversationId,
      quoteContext,
      quoteProgress,
      timestamp: Date.now(),
    })
  }, [messages, conversationId, quoteContext, quoteProgress])

  // GAP.6: Clear chat history function
  const handleClearHistory = useCallback(() => {
    clearChatStorage()
    setMessages([])
    setConversationId(null)
    setQuoteContext(null)
    setQuoteProgress(0)
    setCanExportQuote(false)
    setProductSuggestions([])
    setSuggestedCategory(null)
    setSuggestedCategories([])
    setSelectedProductIds([])
    // Re-show welcome message
    setMessages([
      {
        id: 'welcome',
        role: 'ASSISTANT',
        content:
          'Ola! Sou o assistente virtual da Versati Glass. Como posso ajudar voce hoje? Posso tirar duvidas sobre nossos produtos ou ajudar a fazer um orcamento.',
        createdAt: new Date().toISOString(),
      },
    ])
  }, [])

  // Auto-scroll para ultima mensagem
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, scrollToBottom])

  // Focus no input quando abre
  useEffect(() => {
    if (isOpen && !isMinimized) {
      inputRef.current?.focus()
    }
  }, [isOpen, isMinimized])

  // Mensagem inicial de boas-vindas (only if no restored messages)
  useEffect(() => {
    // Wait for restoration to complete before showing welcome
    if (isOpen && messages.length === 0 && hasRestoredRef.current) {
      setMessages([
        {
          id: 'welcome',
          role: 'ASSISTANT',
          content:
            'Ola! Sou o assistente virtual da Versati Glass. Como posso ajudar voce hoje? Posso tirar duvidas sobre nossos produtos ou ajudar a fazer um orcamento.',
          createdAt: new Date().toISOString(),
        },
      ])
    }
  }, [isOpen, messages.length])

  // Auto-speak AI responses when voice is enabled
  useEffect(() => {
    if (!isVoiceEnabled || !messages.length) return

    const lastMessage = messages[messages.length - 1]
    if (lastMessage.role === 'ASSISTANT' && !isSpeaking && !isLoading) {
      // Speak the last AI response
      speak(lastMessage.content, {
        rate: 1.0,
        pitch: 1.0,
        volume: 1.0,
      })
    }
  }, [messages, isVoiceEnabled, speak, isSpeaking, isLoading])

  // Stop speaking when voice is disabled
  useEffect(() => {
    if (!isVoiceEnabled && isSpeaking) {
      stopSpeaking()
    }
  }, [isVoiceEnabled, isSpeaking, stopSpeaking])

  // Handler para selecionar imagem
  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validar tipo
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    if (!allowedTypes.includes(file.type)) {
      alert('Formato nao suportado. Use JPG, PNG, WebP ou GIF.')
      return
    }

    // Validar tamanho (10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('Imagem muito grande. Maximo 10MB.')
      return
    }

    setIsUploadingImage(true)

    try {
      // Converter para base64
      const reader = new FileReader()
      reader.onloadend = () => {
        const base64 = reader.result as string
        setSelectedImage({
          file,
          preview: URL.createObjectURL(file),
          base64,
        })
        setIsUploadingImage(false)
      }
      reader.readAsDataURL(file)
    } catch {
      alert('Erro ao processar imagem.')
      setIsUploadingImage(false)
    }

    // Limpar input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  // Remover imagem selecionada
  const removeSelectedImage = () => {
    if (selectedImage?.preview) {
      URL.revokeObjectURL(selectedImage.preview)
    }
    setSelectedImage(null)
  }

  // AI-CHAT Sprint P2.4: Fetch product suggestions based on category
  // MELHORADO: Adiciona produtos como mensagem inline no chat
  const fetchProductSuggestions = useCallback(async (category: string) => {
    try {
      const response = await fetch(`/api/ai/products/suggestions?category=${category}&limit=3`)

      if (response.ok) {
        const data = await response.json()

        if (data.success && data.products.length > 0) {
          // Adiciona produtos sem duplicar ao estado global
          setProductSuggestions((prev) => {
            const existingIds = prev.map((p) => p.id)
            const newProducts = data.products.filter(
              (p: ProductSuggestion) => !existingIds.includes(p.id)
            )
            return [...prev, ...newProducts]
          })
          setSuggestedCategory(category)
          // Adiciona categoria a lista de sugeridas
          setSuggestedCategories((prev) => {
            if (!prev.includes(category)) {
              return [...prev, category]
            }
            return prev
          })

          // NOVO: Adiciona como mensagem inline para que suba com a conversa
          const suggestionMessage: Message = {
            id: `suggestions-${category}-${Date.now()}`,
            role: 'PRODUCT_SUGGESTIONS',
            content: `Sugestoes de ${category}`,
            createdAt: new Date().toISOString(),
            productData: {
              products: data.products,
              category: category,
              categories: [category],
              isCollapsed: false,
            },
          }

          // Verifica se ja existe mensagem de sugestao para essa categoria
          setMessages((prev) => {
            const existingSuggestion = prev.find(
              (m) => m.role === 'PRODUCT_SUGGESTIONS' && m.productData?.category === category
            )
            if (existingSuggestion) {
              // Atualiza a mensagem existente com novos produtos
              return prev.map((m) =>
                m.id === existingSuggestion.id
                  ? {
                      ...m,
                      productData: {
                        ...m.productData!,
                        products: [...m.productData!.products, ...data.products.filter(
                          (p: ProductSuggestion) => !m.productData!.products.some(ep => ep.id === p.id)
                        )],
                      },
                    }
                  : m
              )
            }
            // Adiciona nova mensagem de sugestao
            return [...prev, suggestionMessage]
          })

          // Scroll para mostrar as sugestoes
          setTimeout(() => scrollToBottom(), 100)
        }
      }
    } catch (error) {
      console.error('Error fetching product suggestions:', error)
    }
  }, [scrollToBottom])

  // Buscar sugestoes para TODAS as categorias detectadas nos items
  const fetchAllProductSuggestions = useCallback(
    async (items: any[]) => {
      if (!items || items.length === 0) return

      // Extrair categorias unicas
      const categories = [...new Set(items.map((item) => item.category).filter(Boolean))]

      // Buscar produtos para cada categoria que ainda nao foi sugerida
      for (const category of categories) {
        if (!suggestedCategories.includes(category)) {
          await fetchProductSuggestions(category)
        }
      }
    },
    [suggestedCategories, fetchProductSuggestions]
  )

  // AI-CHAT Sprint P2.4: Handle product selection
  // MELHORADO: Colapsa card apos selecao e sobe com a conversa
  const handleSelectProduct = useCallback(
    async (product: ProductSuggestion) => {
      logger.debug('[CHAT] Product selected:', { name: product.name })

      // Adiciona a lista (nao remove se ja selecionado - acumula)
      setSelectedProductIds((prev) => {
        if (prev.includes(product.id)) {
          // Se ja esta selecionado, remove (toggle)
          return prev.filter((id) => id !== product.id)
        }
        return [...prev, product.id]
      })

      // NOVO: Colapsa a mensagem de sugestao da categoria desse produto
      setMessages((prev) =>
        prev.map((msg) => {
          if (
            msg.role === 'PRODUCT_SUGGESTIONS' &&
            msg.productData?.category === product.category
          ) {
            return {
              ...msg,
              productData: {
                ...msg.productData!,
                isCollapsed: true,
              },
            }
          }
          return msg
        })
      )

      // Mensagem clara de adicao ao orcamento
      // Inclui slug e categoria para facilitar extracao pelo LLM
      const selectionMessage = `Quero adicionar: ${product.name} (categoria: ${product.category}, slug: ${product.slug})`

      // Add user message immediately
      const userMessage: Message = {
        id: `user-${Date.now()}`,
        role: 'USER',
        content: selectionMessage,
        createdAt: new Date().toISOString(),
      }

      setMessages((prev) => [...prev, userMessage])
      setIsLoading(true)

      // Scroll to bottom to show new message
      setTimeout(() => scrollToBottom(), 100)

      try {
        logger.debug('[CHAT] Sending product selection to API...')
        const response = await fetch('/api/ai/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: selectionMessage,
            conversationId,
            sessionId,
            imageBase64: null,
            imageUrl: null,
          }),
        })

        if (!response.ok) {
          throw new Error('Erro ao enviar mensagem')
        }

        const data = await response.json()
        logger.debug('[CHAT] AI response received')

        // Update conversationId if new conversation
        if (data.conversationId && !conversationId) {
          setConversationId(data.conversationId)
        }

        const assistantMessage: Message = {
          id: `assistant-${Date.now()}`,
          role: 'ASSISTANT',
          content: data.message,
          createdAt: new Date().toISOString(),
        }

        setMessages((prev) => [...prev, assistantMessage])

        // MELHORADO: Atualiza progresso imediatamente apos selecionar produto
        // (nao espera 2 segundos do useEffect)
        setTimeout(() => checkExportStatus(), 500)
      } catch (error) {
        console.error('[CHAT] Error sending product selection:', error)
        // Add error message
        setMessages((prev) => [
          ...prev,
          {
            id: `error-${Date.now()}`,
            role: 'ASSISTANT',
            content:
              'Desculpe, ocorreu um erro. Por favor, tente novamente ou entre em contato pelo WhatsApp.',
            createdAt: new Date().toISOString(),
          },
        ])
      } finally {
        setIsLoading(false)
      }
    },
    [conversationId, sessionId, scrollToBottom]
  )

  // AI-CHAT Sprint P1.6 + P3.2: Check export status and update progress
  const checkExportStatus = useCallback(async () => {
    if (!conversationId && !sessionId) return

    try {
      const params = new URLSearchParams()
      if (conversationId) {
        params.set('conversationId', conversationId)
      } else {
        params.set('sessionId', sessionId)
      }

      const response = await fetch(`/api/ai/chat/export-quote?${params}`)
      if (response.ok) {
        const data = await response.json()
        setCanExportQuote(data.canExport || false)

        // AI-CHAT Sprint P3.2: Update progress tracking
        if (data.quoteContext) {
          setQuoteContext(data.quoteContext)
          const completion = getQuoteContextCompletion(data.quoteContext)
          setQuoteProgress(completion)

          // AI-CHAT Sprint P2.4: Fetch product suggestions for ALL categories detected
          // MELHORADO: Suporta multiplos produtos (ex: "quero porta e espelho")
          if (data.quoteContext.items && data.quoteContext.items.length > 0) {
            fetchAllProductSuggestions(data.quoteContext.items)
          }
        }
      }
    } catch (error) {
      console.error('Error checking export status:', error)
    }
  }, [conversationId, sessionId, fetchAllProductSuggestions])

  // AI-CHAT Sprint P1.6: Check export status after each AI response
  useEffect(() => {
    if (messages.length > 1) {
      // Check 2 seconds after last message (give time for quoteContext to update)
      const timer = setTimeout(checkExportStatus, 2000)
      return () => clearTimeout(timer)
    }
  }, [messages, checkExportStatus])

  // AI-CHAT Sprint P1.6 + P2.1 + P2.3: Handle quote finalization
  const handleFinalizeQuote = async () => {
    if (!conversationId && !sessionId) {
      alert('Erro: Nenhuma conversa ativa')
      return
    }

    setIsExportingQuote(true)

    try {
      // Step 1: Export quote data for wizard
      const exportResponse = await fetch('/api/ai/chat/export-quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationId,
          sessionId,
        }),
      })

      if (!exportResponse.ok) {
        const error = await exportResponse.json()
        throw new Error(error.message || 'Erro ao exportar orçamento')
      }

      const { data } = await exportResponse.json()
      const quoteData = data as AiQuoteData

      // Step 2: Save pending data
      setPendingQuoteData(quoteData)
      setIsExportingQuote(false)

      // Step 3: Check if user is logged in
      // If not logged in, show register modal first
      if (!session?.user) {
        setShowRegisterModal(true)
      } else {
        // User is logged in, show transition modal directly
        setShowTransitionModal(true)
      }
    } catch (error) {
      console.error('Error finalizing quote:', error)
      alert(
        error instanceof Error
          ? error.message
          : 'Erro ao finalizar orçamento. Por favor, tente novamente.'
      )
      setIsExportingQuote(false)
    }
  }

  // Handle quick registration from modal
  const handleQuickRegister = async (email: string, password: string) => {
    if (!pendingQuoteData?.customerData) {
      throw new Error('Dados do cliente nao encontrados')
    }

    setIsRegisterLoading(true)

    try {
      const customerData = pendingQuoteData.customerData

      // Call quick-register API
      const response = await fetch('/api/auth/quick-register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: customerData.name || 'Cliente',
          email,
          password,
          phone: customerData.phone,
          cpfCnpj: customerData.cpfCnpj,
          street: customerData.street,
          number: customerData.number,
          complement: customerData.complement,
          neighborhood: customerData.neighborhood,
          city: customerData.city,
          state: customerData.state,
          zipCode: customerData.zipCode,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erro ao criar conta')
      }

      // Auto sign-in after registration
      const signInResult = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (signInResult?.error) {
        console.warn('Auto sign-in failed:', signInResult.error)
        // Continue anyway - user can login later
      }

      toast({
        title: 'Conta criada com sucesso!',
        description: 'Verifique seu email para confirmar o cadastro.',
        variant: 'success',
      })

      // Close register modal and show transition modal
      setShowRegisterModal(false)
      setShowTransitionModal(true)
    } finally {
      setIsRegisterLoading(false)
    }
  }

  // Continue as guest (no registration)
  const handleContinueAsGuest = () => {
    setShowRegisterModal(false)
    setShowTransitionModal(true)
  }

  // Cancel registration modal
  const handleCancelRegister = () => {
    setShowRegisterModal(false)
    // Don't clear pendingQuoteData - user might want to try again
  }

  // AI-CHAT Sprint P2.3: Confirm transition and proceed to wizard
  const handleConfirmTransition = async () => {
    if (!pendingQuoteData) return

    setIsExportingQuote(true)

    try {
      // Step 1: Auto-create Quote in database (P2.1)
      let quoteCreated = false
      let quoteNumber = ''
      try {
        const autoQuoteResponse = await fetch('/api/quotes/from-ai', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            conversationId,
            sessionId,
          }),
        })

        if (autoQuoteResponse.ok) {
          const autoQuoteData = await autoQuoteResponse.json()
          quoteCreated = true
          quoteNumber = autoQuoteData.quote?.number || ''
          logger.info('[CHAT] Quote auto-created', { quoteNumber: autoQuoteData.quote?.number })
        } else {
          const errorData = await autoQuoteResponse.json().catch(() => ({}))
          logger.warn('[CHAT] Failed to auto-create quote', { error: errorData })
        }
      } catch (autoQuoteError) {
        logger.warn('[CHAT] Auto-quote creation error', { error: autoQuoteError })
      }

      // Step 2: Import data into quote store
      importFromAI(pendingQuoteData)

      // Step 3: Close modal and chat
      setShowTransitionModal(false)
      setPendingQuoteData(null)

      if (onClose) {
        onClose()
      } else {
        setIsOpen(false)
      }

      // Step 4: Show success feedback via toast/alert
      if (quoteCreated) {
        // Success - show feedback before navigation
        toast({
          title: 'Orcamento enviado com sucesso!',
          description: quoteNumber
            ? `Numero do orcamento: ${quoteNumber}. Voce recebera uma resposta em breve.`
            : 'Nossa equipe entrara em contato em breve.',
          variant: 'success',
        })
      }

      // Step 5: Navigate to quote wizard (Step 4 - Item Review)
      router.push('/orcamento')
    } catch (error) {
      console.error('Error proceeding to wizard:', error)
      toast({
        title: 'Erro ao enviar orcamento',
        description: 'Por favor, tente novamente ou entre em contato pelo WhatsApp.',
        variant: 'error',
      })
    } finally {
      setIsExportingQuote(false)
    }
  }

  // AI-CHAT Sprint P2.3: Cancel transition and return to chat
  const handleCancelTransition = () => {
    setShowTransitionModal(false)
    setPendingQuoteData(null)
    setIsExportingQuote(false)
  }

  // Handle "add more items" - close modal and return to chat
  const handleAddMoreItems = () => {
    setShowTransitionModal(false)
    setPendingQuoteData(null)
    setIsExportingQuote(false)
    // Add a message indicating the user wants to add more
    setMessages((prev) => [
      ...prev,
      {
        id: `user-addmore-${Date.now()}`,
        role: 'USER',
        content: 'Quero adicionar mais itens ao meu orcamento.',
        createdAt: new Date().toISOString(),
      },
    ])
    // The AI will respond naturally to this request
    setInput('')
    setTimeout(() => {
      inputRef.current?.focus()
    }, 100)
  }

  const sendMessage = async () => {
    if ((!input.trim() && !selectedImage) || isLoading) return

    const messageContent =
      input.trim() || (selectedImage ? 'Analise esta imagem do meu espaco, por favor.' : '')

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'USER',
      content: messageContent,
      createdAt: new Date().toISOString(),
      imageUrl: selectedImage?.preview,
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')
    const imageToSend = selectedImage
    setSelectedImage(null)
    setIsLoading(true)

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: messageContent,
          conversationId,
          sessionId,
          imageBase64: imageToSend?.base64 || null,
          imageUrl: imageToSend?.preview || null,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        // Handle specific error types
        if (response.status === 429) {
          throw new Error(data.message || 'Limite de mensagens excedido. Aguarde um momento.')
        } else if (response.status === 503) {
          throw new Error(
            'Servico de IA temporariamente indisponivel. Tente novamente em instantes.'
          )
        } else if (response.status === 500) {
          throw new Error(data.error || 'Erro interno do servidor. Por favor, tente novamente.')
        }
        throw new Error(data.error || 'Erro ao enviar mensagem')
      }

      // Atualizar conversationId se for nova conversa
      if (data.conversationId && !conversationId) {
        setConversationId(data.conversationId)
      }

      // Check if user confirmed to show progress widget
      if (data.shouldShowProgress) {
        setProgressConfirmed(true)
      }

      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: 'ASSISTANT',
        content: data.message,
        createdAt: new Date().toISOString(),
        measurements: data.measurements, // Include measurements if available
        calendarLinks: data.calendarLinks || undefined, // Include calendar links if scheduling confirmed
      }

      setMessages((prev) => [...prev, assistantMessage])

      // Show toast if scheduling was detected
      if (data.schedulingDetected && data.calendarLinks) {
        toast({
          title: 'Visita agendada! 📅',
          description: 'Use os links abaixo para adicionar ao seu calendario.',
          variant: 'success',
        })
      }

      // NOVO: Se o assistente menciona "Finalizar" ou "Checkout", maximizar o painel de progresso
      const finalizePhrases = [
        'finalizar',
        'checkout',
        'clica no botao',
        'botao abaixo',
        'ali embaixo',
        'ir para checkout',
        'finalizar orcamento',
        'tudo certo',
      ]
      const assistantContent = data.message.toLowerCase()
      const mentionsFinalize = finalizePhrases.some((phrase) => assistantContent.includes(phrase))
      if (mentionsFinalize) {
        setIsProgressMinimized(false) // Maximiza o painel para mostrar o botao
      }

      // MELHORADO: Atualiza progresso rapidamente apos cada mensagem
      // (nao espera 2 segundos do useEffect)
      setTimeout(() => checkExportStatus(), 500)
    } catch (error) {
      // Adicionar mensagem de erro com detalhes
      const errorMessage =
        error instanceof Error ? error.message : 'Desculpe, ocorreu um erro inesperado.'

      console.error('[AI Chat] Error:', error)

      setMessages((prev) => [
        ...prev,
        {
          id: `error-${Date.now()}`,
          role: 'ASSISTANT',
          content: `${errorMessage} Por favor, tente novamente ou entre em contato pelo WhatsApp.`,
          createdAt: new Date().toISOString(),
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  // Use onKeyDown instead of deprecated onKeyPress for better mobile support
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const positionClasses = {
    'bottom-right': 'right-4 sm:right-6',
    'bottom-left': 'left-4 sm:left-6',
  }

  // Botao flutuante quando fechado
  if (!isOpen) {
    return (
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0, opacity: 0 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className={cn(
          'fixed bottom-20 z-40 flex items-center gap-2 rounded-full bg-accent-500 px-4 py-3 text-neutral-900 shadow-lg',
          positionClasses[position],
          className
        )}
        aria-label="Abrir chat assistido"
      >
        <Sparkles className="h-5 w-5 animate-pulse" />
        <span className="hidden font-medium sm:inline">Precisa de ajuda?</span>
      </motion.button>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      transition={{ duration: 0.2 }}
    >
      <Card
        className={cn(
          'fixed z-50 flex flex-col shadow-2xl transition-all duration-300',
          positionClasses[position],
          // Responsivo: fullscreen no mobile, fixed size no desktop
          // Usa env(safe-area-inset-bottom) para dispositivos com notch
          isMinimized
            ? 'bottom-4 h-14 w-72'
            : 'bottom-0 left-0 right-0 h-[100dvh] w-full pb-[env(safe-area-inset-bottom)] sm:bottom-4 sm:left-auto sm:right-4 sm:h-[600px] sm:max-h-[85vh] sm:w-[400px] sm:rounded-lg sm:pb-0',
          // Remover border radius no mobile fullscreen
          !isMinimized && 'rounded-none sm:rounded-lg',
          className
        )}
      >
        {/* Header */}
        <div
          className={cn(
            'flex items-center justify-between bg-accent-500 px-4 py-3',
            isMinimized ? 'rounded-t-lg' : 'rounded-none sm:rounded-t-lg'
          )}
        >
          <div className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-neutral-900" />
            <span className="font-medium text-neutral-900">Assistente Versati</span>
          </div>
          <div className="flex items-center gap-1">
            {/* GAP.6: Clear history button - only show when there are messages */}
            {messages.length > 1 && (
              <button
                onClick={handleClearHistory}
                className="rounded p-1 text-neutral-900 transition-colors hover:bg-accent-400"
                aria-label="Limpar histórico"
                title="Limpar conversa"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            )}
            {/* Minimizar - esconder no mobile quando fullscreen */}
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="hidden rounded p-1 text-neutral-900 transition-colors hover:bg-accent-400 sm:block"
              aria-label={isMinimized ? 'Expandir chat' : 'Minimizar chat'}
            >
              {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
            </button>
            <button
              onClick={() => {
                if (onClose) {
                  onClose()
                } else {
                  setIsOpen(false)
                }
              }}
              className="rounded p-2 text-neutral-900 transition-colors hover:bg-accent-400 sm:p-1"
              aria-label="Fechar chat"
            >
              <X className="h-5 w-5 sm:h-4 sm:w-4" />
            </button>
          </div>
        </div>

        {/* Conteudo (escondido quando minimizado) */}
        {!isMinimized && (
          <>
            {/* Mensagens */}
            <div className="bg-theme-primary flex-1 space-y-4 overflow-y-auto p-4">
              <AnimatePresence mode="popLayout">
                {messages.map((msg, index) => {
                  // Renderizacao especial para mensagens de sugestao de produtos
                  if (msg.role === 'PRODUCT_SUGGESTIONS' && msg.productData) {
                    const { products, category, categories, isCollapsed } = msg.productData

                    // Handler para toggle do collapse
                    const handleToggleCollapse = () => {
                      setMessages((prev) =>
                        prev.map((m) =>
                          m.id === msg.id
                            ? {
                                ...m,
                                productData: {
                                  ...m.productData!,
                                  isCollapsed: !m.productData!.isCollapsed,
                                },
                              }
                            : m
                        )
                      )
                    }

                    // Usa componente multi-categoria se tiver mais de uma
                    if (categories.length > 1) {
                      return (
                        <CollapsibleMultiCategoryProductSuggestions
                          key={msg.id}
                          products={products}
                          onSelectProduct={handleSelectProduct}
                          selectedProductIds={selectedProductIds}
                          isCollapsed={isCollapsed}
                          onToggleCollapse={handleToggleCollapse}
                        />
                      )
                    }

                    return (
                      <CollapsibleProductSuggestions
                        key={msg.id}
                        products={products}
                        onSelectProduct={handleSelectProduct}
                        selectedProductIds={selectedProductIds}
                        category={category}
                        isCollapsed={isCollapsed}
                        onToggleCollapse={handleToggleCollapse}
                      />
                    )
                  }

                  // Renderizacao normal para USER e ASSISTANT
                  return (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2, delay: index === messages.length - 1 ? 0 : 0 }}
                    className={cn(
                      'flex gap-2',
                      msg.role === 'USER' ? 'justify-end' : 'justify-start'
                    )}
                  >
                    {msg.role === 'ASSISTANT' && (
                      <div className="bg-accent-500/20 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full">
                        <Bot className="h-4 w-4 text-accent-500" />
                      </div>
                    )}
                    <div
                      className={cn(
                        'max-w-[80%] overflow-hidden rounded-lg px-3 py-2 text-sm',
                        msg.role === 'USER'
                          ? 'bg-accent-500 text-neutral-900'
                          : 'bg-theme-secondary text-theme-primary'
                      )}
                    >
                      {msg.imageUrl && (
                        <img
                          src={msg.imageUrl}
                          alt="Imagem enviada"
                          className="mb-2 h-auto max-w-full rounded-md"
                          style={{ maxHeight: '150px' }}
                        />
                      )}
                      <p className="whitespace-pre-wrap break-words">{msg.content}</p>
                      {/* Display measurements if available */}
                      {msg.measurements && (msg.measurements.width || msg.measurements.height) && (
                        <div className="border-accent-500/30 bg-accent-500/10 mt-2 space-y-1 rounded border p-2 text-xs">
                          <div className="font-semibold text-accent-600">
                            📐 Medidas detectadas:
                          </div>
                          {msg.measurements.width && (
                            <div>
                              Largura: <span className="font-mono">{msg.measurements.width}m</span>
                            </div>
                          )}
                          {msg.measurements.height && (
                            <div>
                              Altura: <span className="font-mono">{msg.measurements.height}m</span>
                            </div>
                          )}
                          {msg.measurements.referenceObject && (
                            <div className="text-neutral-600">
                              ✓ Baseado em: {msg.measurements.referenceObject}
                            </div>
                          )}
                          {/* Confidence indicator */}
                          <div className="flex items-center gap-1">
                            {msg.measurements.confidence === 'high' && (
                              <span className="text-green-600">🟢 Alta precisão</span>
                            )}
                            {msg.measurements.confidence === 'medium' && (
                              <span className="text-yellow-600">🟡 Precisão média</span>
                            )}
                            {msg.measurements.confidence === 'low' && (
                              <span className="text-red-600">🔴 Precisão baixa</span>
                            )}
                          </div>
                          {/* Calibration help */}
                          {msg.measurements.needsCalibration &&
                            msg.measurements.calibrationHelp && (
                              <div className="mt-1 text-neutral-600">
                                📏 {msg.measurements.calibrationHelp}
                              </div>
                            )}
                        </div>
                      )}
                      {/* Display calendar links if scheduling confirmed */}
                      {msg.calendarLinks && (
                        <div className="mt-3 space-y-2 rounded-lg border border-green-500/30 bg-green-500/10 p-3">
                          <div className="flex items-center gap-2 font-semibold text-green-400">
                            <Calendar className="h-4 w-4" />
                            Adicione ao seu calendario:
                          </div>
                          <div className="flex flex-wrap gap-2">
                            <a
                              href={msg.calendarLinks.google}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1 rounded-md bg-white/10 px-2 py-1 text-xs font-medium text-white transition-colors hover:bg-white/20"
                            >
                              <ExternalLink className="h-3 w-3" />
                              Google
                            </a>
                            <a
                              href={msg.calendarLinks.outlook}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1 rounded-md bg-white/10 px-2 py-1 text-xs font-medium text-white transition-colors hover:bg-white/20"
                            >
                              <ExternalLink className="h-3 w-3" />
                              Outlook
                            </a>
                            <a
                              href={msg.calendarLinks.office365}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1 rounded-md bg-white/10 px-2 py-1 text-xs font-medium text-white transition-colors hover:bg-white/20"
                            >
                              <ExternalLink className="h-3 w-3" />
                              Office 365
                            </a>
                          </div>
                          <p className="text-xs text-green-300/70">
                            Clique para adicionar ao seu calendario
                          </p>
                        </div>
                      )}
                    </div>
                    {msg.role === 'USER' && (
                      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-neutral-600">
                        <User className="h-4 w-4 text-neutral-300" />
                      </div>
                    )}
                  </motion.div>
                  )
                })}
              </AnimatePresence>

              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start gap-2"
                >
                  <div className="bg-accent-500/20 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full">
                    <Bot className="h-4 w-4 text-accent-500" />
                  </div>
                  <div className="bg-theme-secondary rounded-lg px-4 py-3">
                    <div className="flex items-center gap-1">
                      <motion.span
                        className="h-2 w-2 rounded-full bg-accent-500"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                      />
                      <motion.span
                        className="h-2 w-2 rounded-full bg-accent-500"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                      />
                      <motion.span
                        className="h-2 w-2 rounded-full bg-accent-500"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Cards de produtos agora sao renderizados inline como mensagens */}
              {/* Isso faz com que subam junto com a conversa */}

              <div ref={messagesEndRef} />
            </div>

            {/* AI-CHAT Sprint P2.2: Progress Indicator */}
            {/* Mostra quando progresso > 0 - nao esconder em 100% para manter botao visivel */}
            {quoteProgress > 0 && (
              <div className="border-theme-default bg-theme-elevated border-t p-3">
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-2"
                >
                  {/* Progress Bar - Header with Minimize Button */}
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-theme-muted font-medium">
                      {quoteProgress >= 100 ? 'Orcamento completo!' : 'Progresso do orcamento'}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className={`font-bold ${quoteProgress >= 100 ? 'text-green-500' : 'text-accent-500'}`}>
                        {quoteProgress >= 100 ? 'Pronto!' : `${quoteProgress}%`}
                      </span>
                      <button
                        onClick={() => setIsProgressMinimized(!isProgressMinimized)}
                        className="hover:bg-accent-500/10 rounded p-1 text-accent-500 transition-colors"
                        aria-label={
                          isProgressMinimized ? 'Expandir progresso' : 'Minimizar progresso'
                        }
                        title={isProgressMinimized ? 'Expandir progresso' : 'Minimizar progresso'}
                      >
                        {isProgressMinimized ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronUp className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Progress details - only show when not minimized */}
                  {!isProgressMinimized && (
                    <>
                      <div className="bg-theme-default h-2 overflow-hidden rounded-full">
                        <motion.div
                          className={`h-full ${quoteProgress >= 100 ? 'bg-green-500' : 'bg-accent-500'}`}
                          initial={{ width: 0 }}
                          animate={{ width: `${quoteProgress}%` }}
                          transition={{ duration: 0.5, ease: 'easeOut' }}
                        />
                      </div>

                      {/* Dynamic Completion Checklist based on category */}
                      {(() => {
                        const progressDetails = getProgressDetails(quoteContext)
                        const allFields = [
                          ...progressDetails.productFields.filter(f => f.required || f.completed),
                          ...progressDetails.contactFields.filter(f => f.required || f.completed),
                        ]

                        // Se nao tem campos, mostra o basico
                        if (allFields.length === 0) {
                          return (
                            <div className="mt-3 space-y-1.5">
                              <div className="flex items-center gap-2 text-xs">
                                <Circle className="text-theme-muted h-3.5 w-3.5 flex-shrink-0" />
                                <span className="text-theme-muted">
                                  <Package className="mr-1 inline h-3 w-3" />
                                  Aguardando selecao de produto
                                </span>
                              </div>
                            </div>
                          )
                        }

                        return (
                          <div className="mt-3 space-y-1.5">
                            {/* Campos do produto */}
                            {progressDetails.productFields
                              .filter(f => f.required || f.completed)
                              .map((field) => (
                                <div key={field.key} className="flex items-center gap-2 text-xs">
                                  {field.completed ? (
                                    <CheckCircle2 className="h-3.5 w-3.5 flex-shrink-0 text-accent-500" />
                                  ) : (
                                    <Circle className={cn(
                                      "h-3.5 w-3.5 flex-shrink-0",
                                      field.required ? "text-amber-400" : "text-theme-muted"
                                    )} />
                                  )}
                                  <span className={field.completed ? 'text-theme-primary' : 'text-theme-muted'}>
                                    {field.label}
                                    {field.required && !field.completed && (
                                      <span className="ml-1 text-amber-400">*</span>
                                    )}
                                  </span>
                                </div>
                              ))}

                            {/* Separador se tem campos de contato */}
                            {progressDetails.contactFields.some(f => f.required || f.completed) && (
                              <div className="border-theme-default my-2 border-t" />
                            )}

                            {/* Campos de contato */}
                            {progressDetails.contactFields
                              .filter(f => f.required || f.completed)
                              .map((field) => (
                                <div key={field.key} className="flex items-center gap-2 text-xs">
                                  {field.completed ? (
                                    <CheckCircle2 className="h-3.5 w-3.5 flex-shrink-0 text-accent-500" />
                                  ) : (
                                    <Circle className={cn(
                                      "h-3.5 w-3.5 flex-shrink-0",
                                      field.required ? "text-amber-400" : "text-theme-muted"
                                    )} />
                                  )}
                                  <span className={field.completed ? 'text-theme-primary' : 'text-theme-muted'}>
                                    <UserCircle className="mr-1 inline h-3 w-3" />
                                    {field.label}
                                    {field.required && !field.completed && (
                                      <span className="ml-1 text-amber-400">*</span>
                                    )}
                                  </span>
                                </div>
                              ))}
                          </div>
                        )
                      })()}

                      {/* Action Buttons */}
                      <div className="mt-4 flex flex-col gap-2">
                        {/* Go to Checkout - show when progress >= 40% */}
                        {quoteProgress >= 40 && (
                          <Button
                            onClick={async () => {
                              setIsLoading(true)

                              try {
                                // 1. Add system message (no AI response needed)
                                const checkoutMessage: Message = {
                                  id: `checkout-${Date.now()}`,
                                  role: 'ASSISTANT',
                                  content:
                                    'Perfeito! Vou redirecionar você para o checkout agora. 🛒',
                                  createdAt: new Date().toISOString(),
                                }
                                setMessages((prev) => [...prev, checkoutMessage])
                                setTimeout(() => scrollToBottom(), 100)

                                // 2. Minimize quote progress
                                setIsProgressMinimized(true)

                                // 3. Try to export quote data from conversation
                                let quoteData = null
                                try {
                                  const exportResponse = await fetch('/api/ai/chat/export-quote', {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({ conversationId, sessionId }),
                                  })

                                  if (exportResponse.ok) {
                                    const result = await exportResponse.json()
                                    quoteData = result.data
                                  }
                                } catch (exportError) {
                                  console.warn(
                                    '[CHAT] Export failed, using local context:',
                                    exportError
                                  )
                                }

                                // 4. Fallback: use local quoteContext if export failed
                                if (!quoteData && quoteContext) {
                                  // Transform local context to quote data format
                                  const { transformAiContextToQuoteData } =
                                    await import('@/lib/ai-quote-transformer')
                                  quoteData = transformAiContextToQuoteData(quoteContext)
                                }

                                // 5. Import to wizard store if we have data
                                if (quoteData && quoteData.items && quoteData.items.length > 0) {
                                  importFromAI(quoteData)
                                }

                                // 6. Minimize chat
                                setIsMinimized(true)

                                // 7. Navigate to wizard (will open at appropriate step)
                                router.push('/orcamento')
                              } catch (error) {
                                console.error('[CHAT] Checkout redirect failed:', error)

                                // Fallback: just navigate to orcamento page
                                setIsMinimized(true)
                                router.push('/orcamento')

                                toast({
                                  variant: 'default',
                                  title: 'Redirecionando...',
                                  description: 'Continue seu orçamento na página de produtos.',
                                })
                              } finally {
                                setIsLoading(false)
                              }
                            }}
                            variant="outline"
                            size="sm"
                            className="hover:bg-accent-500/10 w-full border-accent-500 text-accent-500"
                            disabled={isLoading}
                          >
                            <ArrowRight className="mr-2 h-4 w-4" />
                            Finalizar e Ir para Checkout
                          </Button>
                        )}

                        {/* Cancel/Reset Quote */}
                        <Button
                          onClick={async () => {
                            if (confirm('Tem certeza que deseja cancelar este orçamento?')) {
                              // IMEDIATAMENTE limpar todos os estados para evitar exibicao incorreta
                              setQuoteContext(null)
                              setQuoteProgress(0)
                              setCanExportQuote(false)
                              setProductSuggestions([])
                              setSuggestedCategory(null)
                              setSuggestedCategories([])
                              setSelectedProductIds([])
                              setIsProgressMinimized(true)

                              // Remover mensagens de sugestao de produtos do historico
                              setMessages((prev) =>
                                prev.filter((m) => m.role !== 'PRODUCT_SUGGESTIONS')
                              )

                              // Add cancellation message
                              const cancelMessage: Message = {
                                id: `user-${Date.now()}`,
                                role: 'USER',
                                content: 'Quero cancelar este orçamento e começar de novo',
                                createdAt: new Date().toISOString(),
                              }

                              setMessages((prev) => [...prev, cancelMessage])
                              setIsLoading(true)

                              setTimeout(() => scrollToBottom(), 100)

                              try {
                                // Send message to AI to restart conversation
                                const response = await fetch('/api/ai/chat', {
                                  method: 'POST',
                                  headers: { 'Content-Type': 'application/json' },
                                  body: JSON.stringify({
                                    message: 'Quero cancelar este orçamento e começar de novo',
                                    conversationId,
                                    sessionId,
                                    imageBase64: null,
                                    imageUrl: null,
                                  }),
                                })

                                if (!response.ok) {
                                  throw new Error('Erro ao enviar mensagem')
                                }

                                const data = await response.json()

                                const assistantMessage: Message = {
                                  id: `assistant-${Date.now()}`,
                                  role: 'ASSISTANT',
                                  content: data.message,
                                  createdAt: new Date().toISOString(),
                                }

                                setMessages((prev) => [...prev, assistantMessage])

                                // Speak response if voice enabled
                                if (isVoiceEnabled && data.message) {
                                  speak(data.message)
                                }
                              } catch (error) {
                                console.error('[CHAT] Error restarting conversation:', error)
                                setMessages((prev) => [
                                  ...prev,
                                  {
                                    id: `error-${Date.now()}`,
                                    role: 'ASSISTANT',
                                    content:
                                      'Tudo bem! Vamos começar de novo. Como posso ajudá-lo com seu novo orçamento?',
                                    createdAt: new Date().toISOString(),
                                  },
                                ])
                              } finally {
                                setIsLoading(false)
                              }
                            }
                          }}
                          variant="outline"
                          size="sm"
                          className="w-full border-red-500/50 text-red-400 hover:bg-red-500/10"
                        >
                          <XCircle className="mr-2 h-4 w-4" />
                          Cancelar Orçamento
                        </Button>
                      </div>

                      {/* Hint message */}
                      {quoteProgress < 70 && (
                        <p className="text-theme-subtle mt-3 text-xs">
                          💡 Continue conversando para completar seu orçamento...
                        </p>
                      )}
                    </>
                  )}
                </motion.div>
              </div>
            )}

            {/* AI-CHAT Sprint P1.6: Finalize Quote Button */}
            {canExportQuote && (
              <div className="border-theme-default bg-accent-500/5 border-t p-3">
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <Button
                    onClick={handleFinalizeQuote}
                    disabled={isExportingQuote}
                    className="w-full bg-accent-500 py-2.5 font-medium text-neutral-900 hover:bg-accent-600"
                  >
                    {isExportingQuote ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Preparando orçamento...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="mr-2 h-4 w-4" />
                        Finalizar Orçamento
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                  <p className="text-theme-subtle mt-2 text-center text-xs">
                    Revise os itens coletados e prossiga com o orçamento
                  </p>
                </motion.div>
              </div>
            )}

            {/* Input - sticky at bottom with safe area padding on mobile */}
            <div className="border-theme-default bg-theme-secondary sticky bottom-0 rounded-b-lg border-t p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:pb-3">
              {/* Input de arquivo oculto */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                onChange={handleImageSelect}
                className="hidden"
                aria-label="Selecionar imagem"
              />

              {/* Preview da imagem selecionada */}
              {selectedImage && (
                <div className="relative mb-3 inline-block">
                  <img
                    src={selectedImage.preview}
                    alt="Imagem selecionada"
                    className="h-20 w-auto rounded-md border border-neutral-600"
                  />
                  <button
                    onClick={removeSelectedImage}
                    className="absolute -right-2 -top-2 rounded-full bg-red-500 p-1 text-white transition-colors hover:bg-red-600"
                    aria-label="Remover imagem"
                  >
                    <XIcon className="h-3 w-3" />
                  </button>
                </div>
              )}

              {/* Botões de ação no topo */}
              <div className="mb-2 flex items-center justify-center gap-2">
                {/* Botao de anexar imagem */}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isLoading || isUploadingImage}
                  className="bg-theme-elevated text-theme-subtle flex items-center gap-2 rounded-lg border border-neutral-600 px-3 py-2 text-sm transition-colors hover:border-accent-500 hover:text-accent-500 disabled:opacity-50"
                  aria-label="Anexar imagem"
                  title="Enviar foto do espaço para análise"
                >
                  {isUploadingImage ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <ImageIcon className="h-4 w-4" />
                  )}
                  <span className="hidden sm:inline">Imagem</span>
                </button>

                {/* Voice Chat Button */}
                <VoiceChatButton
                  onTranscript={(text) => {
                    setInput(text)
                    // Auto-send voice messages
                    setTimeout(() => {
                      if (text.trim()) {
                        sendMessage()
                      }
                    }, 500)
                  }}
                  onVoiceStateChange={setIsVoiceEnabled}
                  className="flex-shrink-0"
                />
              </div>

              {/* Input de texto e botão enviar */}
              <div className="flex items-center gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={
                    selectedImage ? 'Descreva o que precisa...' : 'Digite sua mensagem...'
                  }
                  disabled={isLoading}
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="sentences"
                  enterKeyHint="send"
                  className="bg-theme-elevated text-theme-primary placeholder:text-theme-subtle flex-1 rounded-lg border border-neutral-600 px-4 py-2.5 text-base focus:border-accent-500 focus:outline-none disabled:opacity-50"
                />
                <Button
                  size="sm"
                  onClick={sendMessage}
                  disabled={(!input.trim() && !selectedImage) || isLoading}
                  className="flex-shrink-0 touch-manipulation px-4 py-3 sm:py-2.5"
                  aria-label="Enviar mensagem"
                >
                  {isLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin sm:h-4 sm:w-4" />
                  ) : (
                    <Send className="h-5 w-5 sm:h-4 sm:w-4" />
                  )}
                </Button>
              </div>

              <p className="text-theme-subtle mt-2 text-center text-xs">
                Powered by Groq AI + GPT-4 Vision
              </p>
            </div>
          </>
        )}
      </Card>

      {/* Register Confirmation Modal - shown before transition if not logged in */}
      <RegisterConfirmModal
        isOpen={showRegisterModal}
        customerData={pendingQuoteData?.customerData || null}
        onConfirmRegister={handleQuickRegister}
        onContinueAsGuest={handleContinueAsGuest}
        onCancel={handleCancelRegister}
        isLoading={isRegisterLoading}
      />

      {/* AI-CHAT Sprint P2.3: Transition Modal */}
      <QuoteTransitionModal
        isOpen={showTransitionModal}
        quoteData={pendingQuoteData}
        onConfirm={handleConfirmTransition}
        onCancel={handleCancelTransition}
        onAddMore={handleAddMoreItems}
        isLoading={isExportingQuote}
      />
    </motion.div>
  )
}
