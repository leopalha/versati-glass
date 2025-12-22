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
  Mic,
  Square,
  Play,
  Volume2,
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
import {
  getQuoteContextCompletion,
  getProgressDetails,
  type ProgressDetail,
} from '@/lib/ai-quote-transformer'
// VoiceChatButton removed - using native audio recording instead
import { useCrossChannelUpdates } from '@/hooks/use-cross-channel-updates'
import { showCrossChannelNotification } from '@/components/chat/cross-channel-notification'
import { QuoteTransitionModal } from '@/components/chat/quote-transition-modal'
import { RegisterConfirmModal } from '@/components/chat/register-confirm-modal'
// Product suggestion imports removed - using conversational flow instead
import { useSession, signIn } from 'next-auth/react'

interface Message {
  id: string
  role: 'USER' | 'ASSISTANT'
  content: string
  createdAt: string
  imageUrl?: string
  imageUrls?: string[] // Support for multiple images
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
  // Audio support for TTS playback
  audioUrl?: string
}

interface ChatAssistidoProps {
  className?: string
  initialOpen?: boolean
  position?: 'bottom-right' | 'bottom-left'
  onClose?: () => void
  showInitially?: boolean
  autoOpenDuration?: number // Duration in ms to auto-open and then minimize (e.g., 3000 for 3 seconds)
}

export function ChatAssistido({
  className,
  initialOpen = false,
  position = 'bottom-right',
  onClose,
  showInitially = false,
  autoOpenDuration,
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
  // Support for multiple images (up to 10)
  const [selectedImages, setSelectedImages] = useState<
    Array<{
      file: File
      preview: string
      base64: string
    }>
  >([])
  const MAX_IMAGES = 10
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

  // Logged user data from API
  const [loggedUserData, setLoggedUserData] = useState<{
    name?: string
    email?: string
    phone?: string
    street?: string
    number?: string
    complement?: string
    neighborhood?: string
    city?: string
    state?: string
    zipCode?: string
    cpfCnpj?: string
  } | null>(null)

  // Product suggestions removed - using conversational flow instead

  // Old voice feature removed - now using per-message audio playback

  // Progress bar minimize state
  const [isProgressMinimized, setIsProgressMinimized] = useState(false)

  // Progress confirmation state - only show after user confirms
  const [progressConfirmed, setProgressConfirmed] = useState(false)

  // Audio recording state
  const [isRecording, setIsRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  const [audioPreviewUrl, setAudioPreviewUrl] = useState<string | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null)

  // Audio playback state for agent messages
  const [playingMessageId, setPlayingMessageId] = useState<string | null>(null)
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null)

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
    // Re-show welcome message
    setMessages([
      {
        id: 'welcome',
        role: 'ASSISTANT',
        content:
          'Oi! Sou a Ana, da Versati Glass 😊\n\nPosso te ajudar a fazer um orçamento ou tirar dúvidas sobre nossos produtos.\n\n📸 Dica: Se quiser, pode me enviar fotos do local - assim consigo entender melhor o que você precisa!',
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
            'Oi! Sou a Ana, da Versati Glass 😊\n\nPosso te ajudar a fazer um orçamento ou tirar dúvidas sobre nossos produtos.\n\n📸 Dica: Se quiser, pode me enviar fotos do local - assim consigo entender melhor o que você precisa!',
          createdAt: new Date().toISOString(),
        },
      ])
    }
  }, [isOpen, messages.length])

  // Auto-open and minimize after duration (for homepage greeting)
  const autoOpenTriggeredRef = useRef(false)
  useEffect(() => {
    if (autoOpenDuration && !autoOpenTriggeredRef.current) {
      autoOpenTriggeredRef.current = true

      // Open immediately
      setIsOpen(true)
      setIsMinimized(false)

      // Minimize after the duration
      const timer = setTimeout(() => {
        setIsMinimized(true)
      }, autoOpenDuration)

      return () => clearTimeout(timer)
    }
  }, [autoOpenDuration])

  // Old auto-speak removed - now using per-message play button

  // Handler para selecionar múltiplas imagens
  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    const remainingSlots = MAX_IMAGES - selectedImages.length

    if (remainingSlots <= 0) {
      alert(`Máximo de ${MAX_IMAGES} imagens permitido.`)
      return
    }

    const filesToProcess = Array.from(files).slice(0, remainingSlots)
    setIsUploadingImage(true)

    try {
      const newImages = await Promise.all(
        filesToProcess.map(async (file) => {
          // Validar tipo
          if (!allowedTypes.includes(file.type)) {
            console.warn(`Formato não suportado: ${file.name}`)
            return null
          }
          // Validar tamanho (10MB)
          if (file.size > 10 * 1024 * 1024) {
            console.warn(`Imagem muito grande: ${file.name}`)
            return null
          }

          return new Promise<{ file: File; preview: string; base64: string } | null>((resolve) => {
            const reader = new FileReader()
            reader.onloadend = () => {
              resolve({
                file,
                preview: URL.createObjectURL(file),
                base64: reader.result as string,
              })
            }
            reader.onerror = () => resolve(null)
            reader.readAsDataURL(file)
          })
        })
      )

      const validImages = newImages.filter((img): img is NonNullable<typeof img> => img !== null)
      if (validImages.length > 0) {
        setSelectedImages((prev) => [...prev, ...validImages])
      }
      if (validImages.length < filesToProcess.length) {
        alert('Algumas imagens não puderam ser processadas (formato ou tamanho inválido).')
      }
    } catch {
      alert('Erro ao processar imagens.')
    } finally {
      setIsUploadingImage(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  // Remover uma imagem específica
  const removeImage = (index: number) => {
    setSelectedImages((prev) => {
      const imageToRemove = prev[index]
      if (imageToRemove?.preview) {
        URL.revokeObjectURL(imageToRemove.preview)
      }
      return prev.filter((_, i) => i !== index)
    })
  }

  // Remover todas as imagens
  const removeAllImages = () => {
    selectedImages.forEach((img) => {
      if (img.preview) {
        URL.revokeObjectURL(img.preview)
      }
    })
    setSelectedImages([])
  }

  // Start audio recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      audioChunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' })
        setAudioBlob(audioBlob)
        const url = URL.createObjectURL(audioBlob)
        setAudioPreviewUrl(url)

        // Stop all tracks
        stream.getTracks().forEach((track) => track.stop())
      }

      mediaRecorder.start(100)
      setIsRecording(true)
      setRecordingTime(0)

      // Start timer
      recordingTimerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1)
      }, 1000)
    } catch (error) {
      console.error('Error starting recording:', error)
      toast({
        title: 'Erro ao gravar',
        description: 'Permita o acesso ao microfone para gravar.',
        variant: 'error',
      })
    }
  }

  // Stop audio recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)

      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current)
        recordingTimerRef.current = null
      }
    }
  }

  // Cancel/remove recorded audio
  const removeAudio = () => {
    if (audioPreviewUrl) {
      URL.revokeObjectURL(audioPreviewUrl)
    }
    setAudioBlob(null)
    setAudioPreviewUrl(null)
    setRecordingTime(0)
  }

  // Format recording time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  // Send audio message (transcribe and send)
  const sendAudioMessage = async () => {
    if (!audioBlob) return

    setIsLoading(true)

    try {
      // Convert blob to base64
      const reader = new FileReader()
      const base64Promise = new Promise<string>((resolve) => {
        reader.onloadend = () => resolve(reader.result as string)
        reader.readAsDataURL(audioBlob)
      })
      const audioBase64 = await base64Promise

      // Add user message with audio indicator
      const userMessage: Message = {
        id: `user-${Date.now()}`,
        role: 'USER',
        content: '🎤 Mensagem de voz enviada...',
        createdAt: new Date().toISOString(),
      }
      setMessages((prev) => [...prev, userMessage])
      removeAudio()

      // Send to transcription API
      const response = await fetch('/api/ai/transcribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ audioBase64 }),
      })

      if (!response.ok) {
        throw new Error('Erro ao transcrever audio')
      }

      const { text } = await response.json()

      // Update user message with transcribed text
      setMessages((prev) =>
        prev.map((msg) => (msg.id === userMessage.id ? { ...msg, content: `🎤 "${text}"` } : msg))
      )

      // Now send the transcribed text to AI
      const aiResponse = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          conversationId,
          sessionId,
          imageBase64: null,
          imageUrl: null,
        }),
      })

      const aiData = await aiResponse.json()

      if (!aiResponse.ok) {
        throw new Error(aiData.error || 'Erro ao processar mensagem')
      }

      // Update conversationId if new
      if (aiData.conversationId && !conversationId) {
        setConversationId(aiData.conversationId)
      }

      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: 'ASSISTANT',
        content: aiData.message,
        createdAt: new Date().toISOString(),
      }

      setMessages((prev) => [...prev, assistantMessage])

      // Check progress
      setTimeout(() => checkExportStatus(), 500)
    } catch (error) {
      console.error('[Audio] Error:', error)
      setMessages((prev) => [
        ...prev,
        {
          id: `error-${Date.now()}`,
          role: 'ASSISTANT',
          content: 'Desculpe, nao consegui processar seu audio. Tente digitar sua mensagem.',
          createdAt: new Date().toISOString(),
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  // Text-to-speech for agent messages using OpenAI TTS (natural female voice)
  const playMessageAudio = async (messageId: string, content: string) => {
    // If already playing this message, stop it
    if (playingMessageId === messageId) {
      if (audioPlayerRef.current) {
        audioPlayerRef.current.pause()
        audioPlayerRef.current.currentTime = 0
        audioPlayerRef.current = null
      }
      setPlayingMessageId(null)
      return
    }

    // Stop any currently playing audio
    if (audioPlayerRef.current) {
      audioPlayerRef.current.pause()
      audioPlayerRef.current = null
    }

    setPlayingMessageId(messageId)

    try {
      // Use OpenAI TTS API for natural female voice (nova)
      const response = await fetch('/api/ai/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: content,
          voice: 'nova', // Natural female voice
        }),
      })

      if (!response.ok) {
        throw new Error('TTS failed')
      }

      // Get audio blob and create URL
      const audioBlob = await response.blob()
      const audioUrl = URL.createObjectURL(audioBlob)

      // Create audio element and play
      const audio = new Audio(audioUrl)
      audioPlayerRef.current = audio

      audio.onended = () => {
        URL.revokeObjectURL(audioUrl)
        audioPlayerRef.current = null
        setPlayingMessageId(null)
      }

      audio.onerror = () => {
        URL.revokeObjectURL(audioUrl)
        audioPlayerRef.current = null
        setPlayingMessageId(null)
      }

      await audio.play()
    } catch (error) {
      console.error('Error playing audio:', error)
      setPlayingMessageId(null)

      // Fallback to browser TTS if API fails
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel()
        const utterance = new SpeechSynthesisUtterance(content)
        utterance.lang = 'pt-BR'
        utterance.rate = 1.0
        utterance.onend = () => setPlayingMessageId(null)
        utterance.onerror = () => setPlayingMessageId(null)
        window.speechSynthesis.speak(utterance)
      }
    }
  }

  // Stop message audio playback
  const stopMessageAudio = () => {
    if (audioPlayerRef.current) {
      audioPlayerRef.current.pause()
      audioPlayerRef.current.currentTime = 0
      audioPlayerRef.current = null
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()
    }
    setPlayingMessageId(null)
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current)
      }
      if (audioPreviewUrl) {
        URL.revokeObjectURL(audioPreviewUrl)
      }
      if (audioPlayerRef.current) {
        audioPlayerRef.current.pause()
        audioPlayerRef.current = null
      }
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel()
      }
    }
  }, [audioPreviewUrl])

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
        }
      }
    } catch (error) {
      console.error('Error checking export status:', error)
    }
  }, [conversationId, sessionId])

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
    if ((!input.trim() && selectedImages.length === 0) || isLoading) return

    const hasImages = selectedImages.length > 0
    const messageContent =
      input.trim() || (hasImages ? 'Analise estas imagens do meu espaco, por favor.' : '')

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'USER',
      content: messageContent,
      createdAt: new Date().toISOString(),
      imageUrl: hasImages ? selectedImages[0]?.preview : undefined,
      imageUrls: hasImages ? selectedImages.map((img) => img.preview) : undefined,
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')
    const imagesToSend = [...selectedImages]
    removeAllImages()
    setIsLoading(true)

    try {
      // Send the first image for AI analysis (API currently supports single image)
      // Future: can extend API to support multiple images
      const primaryImage = imagesToSend[0]
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: messageContent,
          conversationId,
          sessionId,
          imageBase64: primaryImage?.base64 || null,
          imageUrl: primaryImage?.preview || null,
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

      // Capturar dados do usuario logado (se houver)
      if (data.loggedUserData) {
        setLoggedUserData(data.loggedUserData)
      }

      // IMPORTANTE: Atualiza progresso imediatamente da resposta da API
      // Se tiver dados do usuario logado, mesclar com o quoteContext
      if (data.quoteContext) {
        const updatedContext = { ...data.quoteContext }

        // Preencher dados do cliente se estiver logado e o contexto ainda nao tiver
        if (data.loggedUserData && data.isLoggedIn) {
          updatedContext.customerData = {
            ...updatedContext.customerData,
            name: updatedContext.customerData?.name || data.loggedUserData.name,
            email: updatedContext.customerData?.email || data.loggedUserData.email,
            phone: updatedContext.customerData?.phone || data.loggedUserData.phone,
            cpfCnpj: updatedContext.customerData?.cpfCnpj || data.loggedUserData.cpfCnpj,
            street: updatedContext.customerData?.street || data.loggedUserData.street,
            number: updatedContext.customerData?.number || data.loggedUserData.number,
            complement: updatedContext.customerData?.complement || data.loggedUserData.complement,
            neighborhood:
              updatedContext.customerData?.neighborhood || data.loggedUserData.neighborhood,
            city: updatedContext.customerData?.city || data.loggedUserData.city,
            state: updatedContext.customerData?.state || data.loggedUserData.state,
            zipCode: updatedContext.customerData?.zipCode || data.loggedUserData.zipCode,
          }
        }

        setQuoteContext(updatedContext)
        const completion = getQuoteContextCompletion(updatedContext)
        setQuoteProgress(completion)
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
                        {/* Show multiple images or single image */}
                        {msg.imageUrls && msg.imageUrls.length > 0 ? (
                          <div className="mb-2 flex flex-wrap gap-1">
                            {msg.imageUrls.map((url, idx) => (
                              <img
                                key={idx}
                                src={url}
                                alt={`Imagem ${idx + 1}`}
                                className="h-auto max-w-full rounded-md"
                                style={{ maxHeight: msg.imageUrls!.length > 1 ? '80px' : '150px' }}
                              />
                            ))}
                          </div>
                        ) : msg.imageUrl ? (
                          <img
                            src={msg.imageUrl}
                            alt="Imagem enviada"
                            className="mb-2 h-auto max-w-full rounded-md"
                            style={{ maxHeight: '150px' }}
                          />
                        ) : null}
                        <p className="whitespace-pre-wrap break-words">{msg.content}</p>

                        {/* Audio play button for agent messages */}
                        {msg.role === 'ASSISTANT' && msg.content && msg.id !== 'welcome' && (
                          <button
                            onClick={() => {
                              if (playingMessageId === msg.id) {
                                stopMessageAudio()
                              } else {
                                playMessageAudio(msg.id, msg.content)
                              }
                            }}
                            className={cn(
                              'mt-2 flex items-center gap-1.5 rounded-md px-2 py-1 text-xs transition-colors',
                              playingMessageId === msg.id
                                ? 'bg-accent-500/30 text-accent-400'
                                : 'text-theme-muted bg-white/10 hover:bg-white/20 hover:text-accent-400'
                            )}
                            aria-label={
                              playingMessageId === msg.id ? 'Parar audio' : 'Ouvir mensagem'
                            }
                          >
                            {playingMessageId === msg.id ? (
                              <>
                                <Square className="h-3 w-3" />
                                <span>Parar</span>
                              </>
                            ) : (
                              <>
                                <Volume2 className="h-3 w-3" />
                                <span>Ouvir</span>
                              </>
                            )}
                          </button>
                        )}

                        {/* Display measurements if available */}
                        {msg.measurements &&
                          (msg.measurements.width || msg.measurements.height) && (
                            <div className="border-accent-500/30 bg-accent-500/10 mt-2 space-y-1 rounded border p-2 text-xs">
                              <div className="font-semibold text-accent-600">
                                📐 Medidas detectadas:
                              </div>
                              {msg.measurements.width && (
                                <div>
                                  Largura:{' '}
                                  <span className="font-mono">{msg.measurements.width}m</span>
                                </div>
                              )}
                              {msg.measurements.height && (
                                <div>
                                  Altura:{' '}
                                  <span className="font-mono">{msg.measurements.height}m</span>
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
                      <span
                        className={`font-bold ${quoteProgress >= 100 ? 'text-green-500' : 'text-accent-500'}`}
                      >
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
                          ...progressDetails.productFields.filter((f) => f.required || f.completed),
                          ...progressDetails.contactFields.filter((f) => f.required || f.completed),
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
                              .filter((f) => f.required || f.completed)
                              .map((field) => (
                                <div key={field.key} className="flex items-center gap-2 text-xs">
                                  {field.completed ? (
                                    <CheckCircle2 className="h-3.5 w-3.5 flex-shrink-0 text-accent-500" />
                                  ) : (
                                    <Circle
                                      className={cn(
                                        'h-3.5 w-3.5 flex-shrink-0',
                                        field.required ? 'text-amber-400' : 'text-theme-muted'
                                      )}
                                    />
                                  )}
                                  <span
                                    className={
                                      field.completed ? 'text-theme-primary' : 'text-theme-muted'
                                    }
                                  >
                                    {field.label}
                                    {field.required && !field.completed && (
                                      <span className="ml-1 text-amber-400">*</span>
                                    )}
                                  </span>
                                </div>
                              ))}

                            {/* Separador se tem campos de contato */}
                            {progressDetails.contactFields.some(
                              (f) => f.required || f.completed
                            ) && <div className="border-theme-default my-2 border-t" />}

                            {/* Campos de contato */}
                            {progressDetails.contactFields
                              .filter((f) => f.required || f.completed)
                              .map((field) => (
                                <div key={field.key} className="flex items-center gap-2 text-xs">
                                  {field.completed ? (
                                    <CheckCircle2 className="h-3.5 w-3.5 flex-shrink-0 text-accent-500" />
                                  ) : (
                                    <Circle
                                      className={cn(
                                        'h-3.5 w-3.5 flex-shrink-0',
                                        field.required ? 'text-amber-400' : 'text-theme-muted'
                                      )}
                                    />
                                  )}
                                  <span
                                    className={
                                      field.completed ? 'text-theme-primary' : 'text-theme-muted'
                                    }
                                  >
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
                        {/* Cancel/Reset Quote */}
                        <Button
                          onClick={async () => {
                            if (confirm('Tem certeza que deseja cancelar este orçamento?')) {
                              // IMEDIATAMENTE limpar todos os estados para evitar exibicao incorreta
                              setQuoteContext(null)
                              setQuoteProgress(0)
                              setCanExportQuote(false)
                              setIsProgressMinimized(true)

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
            {/* Só mostra quando o orçamento está 100% completo */}
            {quoteProgress >= 100 && (
              <div className="border-theme-default bg-accent-500/5 border-t p-3">
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <Button
                    onClick={async () => {
                      setIsLoading(true)
                      try {
                        // Adiciona mensagem de checkout
                        const checkoutMessage: Message = {
                          id: `checkout-${Date.now()}`,
                          role: 'ASSISTANT',
                          content: 'Perfeito! Vou redirecionar você para o checkout agora. 🛒',
                          createdAt: new Date().toISOString(),
                        }
                        setMessages((prev) => [...prev, checkoutMessage])
                        setTimeout(() => scrollToBottom(), 100)
                        setIsProgressMinimized(true)

                        // Tenta exportar os dados do orçamento - prioriza contexto local
                        let quoteData = null

                        // PRIMEIRO: Usa contexto local se disponível (mais confiável)
                        if (quoteContext) {
                          try {
                            const { transformAiContextToQuoteData } =
                              await import('@/lib/ai-quote-transformer')
                            quoteData = transformAiContextToQuoteData(quoteContext)
                            console.log('[CHAT] Using local quoteContext:', quoteData)
                          } catch (transformError) {
                            console.warn('[CHAT] Transform failed:', transformError)
                          }
                        }

                        // SEGUNDO: Se contexto local falhou, tenta API
                        if (!quoteData) {
                          try {
                            const exportResponse = await fetch('/api/ai/chat/export-quote', {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ conversationId, sessionId }),
                            })
                            if (exportResponse.ok) {
                              const result = await exportResponse.json()
                              quoteData = result.data
                              console.log('[CHAT] Using API export:', quoteData)
                            } else {
                              console.warn(
                                '[CHAT] API export returned error, continuing without data'
                              )
                            }
                          } catch (exportError) {
                            console.warn('[CHAT] Export API failed:', exportError)
                          }
                        }

                        // Importa os dados para o wizard store se tiver dados válidos
                        if (quoteData && quoteData.items && quoteData.items.length > 0) {
                          importFromAI(quoteData)
                          console.log('[CHAT] Quote data imported to store')
                        } else {
                          console.log('[CHAT] No quote data to import, redirecting anyway')
                        }

                        // Minimiza o chat e redireciona
                        setIsMinimized(true)
                        router.push('/orcamento')
                      } catch (error) {
                        console.error('[CHAT] Checkout redirect failed:', error)
                        // Mesmo com erro, redireciona
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
                    disabled={isLoading}
                    className="w-full bg-accent-500 py-2.5 font-medium text-neutral-900 hover:bg-accent-600"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Preparando orçamento...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="mr-2 h-4 w-4" />
                        Finalizar e Ir para Checkout
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                  <p className="text-theme-subtle mt-2 text-center text-xs">
                    Clique para revisar e confirmar seu orçamento
                  </p>
                </motion.div>
              </div>
            )}

            {/* Input - sticky at bottom with safe area padding on mobile */}
            <div className="border-theme-default bg-theme-secondary sticky bottom-0 rounded-b-lg border-t p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:pb-3">
              {/* Input de arquivo oculto - suporta múltiplas imagens */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                onChange={handleImageSelect}
                multiple
                className="hidden"
                aria-label="Selecionar imagens"
              />

              {/* Preview do audio gravado */}
              {audioPreviewUrl && (
                <div className="bg-theme-elevated mb-3 flex items-center gap-2 rounded-lg p-2">
                  <audio src={audioPreviewUrl} className="hidden" />
                  <div className="flex flex-1 items-center gap-2">
                    <Mic className="h-4 w-4 text-accent-500" />
                    <span className="text-theme-primary text-sm">
                      Audio gravado ({formatTime(recordingTime)})
                    </span>
                  </div>
                  <button
                    onClick={sendAudioMessage}
                    disabled={isLoading}
                    className="rounded-full bg-accent-500 p-2 text-neutral-900 transition-colors hover:bg-accent-600 disabled:opacity-50"
                    aria-label="Enviar audio"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                  <button
                    onClick={removeAudio}
                    className="rounded-full bg-red-500/20 p-2 text-red-400 transition-colors hover:bg-red-500/30"
                    aria-label="Cancelar audio"
                  >
                    <XIcon className="h-4 w-4" />
                  </button>
                </div>
              )}

              {/* Indicador de gravacao em andamento */}
              {isRecording && (
                <div className="mb-3 flex items-center gap-2 rounded-lg bg-red-500/20 p-2">
                  <div className="h-3 w-3 animate-pulse rounded-full bg-red-500" />
                  <span className="flex-1 text-sm text-red-400">
                    Gravando... {formatTime(recordingTime)}
                  </span>
                  <button
                    onClick={stopRecording}
                    className="rounded-full bg-red-500 p-2 text-white transition-colors hover:bg-red-600"
                    aria-label="Parar gravacao"
                  >
                    <Square className="h-4 w-4" />
                  </button>
                </div>
              )}

              {/* Preview das imagens selecionadas - grid */}
              {selectedImages.length > 0 && (
                <div className="mb-3">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-theme-muted text-xs">
                      {selectedImages.length} de {MAX_IMAGES} imagens
                    </span>
                    <button
                      onClick={removeAllImages}
                      className="text-xs text-red-400 transition-colors hover:text-red-300"
                    >
                      Remover todas
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {selectedImages.map((img, index) => (
                      <div key={index} className="relative">
                        <img
                          src={img.preview}
                          alt={`Imagem ${index + 1}`}
                          className="h-16 w-16 rounded-md border border-neutral-600 object-cover"
                        />
                        <button
                          onClick={() => removeImage(index)}
                          className="absolute -right-1 -top-1 rounded-full bg-red-500 p-0.5 text-white transition-colors hover:bg-red-600"
                          aria-label={`Remover imagem ${index + 1}`}
                        >
                          <XIcon className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                    {selectedImages.length < MAX_IMAGES && (
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="flex h-16 w-16 items-center justify-center rounded-md border-2 border-dashed border-neutral-600 text-neutral-500 transition-colors hover:border-accent-500 hover:text-accent-500"
                        aria-label="Adicionar mais imagens"
                      >
                        <ImageIcon className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Botões de ação no topo */}
              <div className="mb-2 flex items-center justify-center gap-2">
                {/* Botao de anexar imagem */}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isLoading || isUploadingImage || isRecording}
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

                {/* Botao de gravar audio - estilo WhatsApp */}
                <button
                  onClick={isRecording ? stopRecording : startRecording}
                  disabled={isLoading || !!audioPreviewUrl}
                  className={cn(
                    'flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors disabled:opacity-50',
                    isRecording
                      ? 'border-red-500 bg-red-500 text-white hover:bg-red-600'
                      : 'bg-theme-elevated text-theme-subtle border-neutral-600 hover:border-accent-500 hover:text-accent-500'
                  )}
                  aria-label={isRecording ? 'Parar gravação' : 'Gravar áudio'}
                  title={isRecording ? 'Parar gravação' : 'Gravar mensagem de voz'}
                >
                  {isRecording ? <Square className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                  <span className="hidden sm:inline">
                    {isRecording ? formatTime(recordingTime) : 'Audio'}
                  </span>
                </button>
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
                    selectedImages.length > 0
                      ? 'Descreva o que precisa...'
                      : 'Digite sua mensagem...'
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
                  disabled={(!input.trim() && selectedImages.length === 0) || isLoading}
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
