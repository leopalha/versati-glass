'use client'

import { useState, useEffect, useCallback, useRef } from 'react'

// Speech Recognition Types
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList
  resultIndex: number
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string
  message: string
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean
  interimResults: boolean
  lang: string
  start: () => void
  stop: () => void
  abort: () => void
  onresult: (event: SpeechRecognitionEvent) => void
  onerror: (event: SpeechRecognitionErrorEvent) => void
  onend: () => void
  onstart: () => void
}

interface SpeechRecognitionConstructor {
  new (): SpeechRecognition
}

declare global {
  interface Window {
    SpeechRecognition: SpeechRecognitionConstructor
    webkitSpeechRecognition: SpeechRecognitionConstructor
  }
}

export interface VoiceOptions {
  language?: string
  continuous?: boolean
  interimResults?: boolean
}

export interface SpeechSynthesisOptions {
  voice?: string
  rate?: number
  pitch?: number
  volume?: number
  useOpenAI?: boolean // Use OpenAI TTS for natural voice
}

export function useVoice(options: VoiceOptions = {}) {
  const { language = 'pt-BR', continuous = false, interimResults = true } = options

  // STT State
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [interimTranscript, setInterimTranscript] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSupported, setIsSupported] = useState(false)

  // TTS State
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([])
  const [useNaturalVoice, setUseNaturalVoice] = useState(true) // Default to OpenAI TTS

  const recognitionRef = useRef<SpeechRecognition | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // Check browser support
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    const speechSynthesisSupported = 'speechSynthesis' in window

    setIsSupported(!!SpeechRecognition && speechSynthesisSupported)

    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition()
      recognitionRef.current.continuous = continuous
      recognitionRef.current.interimResults = interimResults
      recognitionRef.current.lang = language

      recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
        let interimText = ''
        let finalText = ''

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcriptPiece = event.results[i][0].transcript
          if (event.results[i].isFinal) {
            finalText += transcriptPiece + ' '
          } else {
            interimText += transcriptPiece
          }
        }

        setInterimTranscript(interimText)
        if (finalText) {
          setTranscript((prev) => prev + finalText)
        }
      }

      recognitionRef.current.onerror = (event: SpeechRecognitionErrorEvent) => {
        setError(event.error)
        setIsListening(false)
      }

      recognitionRef.current.onend = () => {
        setIsListening(false)
      }

      recognitionRef.current.onstart = () => {
        setIsListening(true)
        setError(null)
      }
    }

    // Load available voices for TTS
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices()
      setAvailableVoices(voices)
    }

    loadVoices()
    if (window.speechSynthesis) {
      window.speechSynthesis.onvoiceschanged = loadVoices
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop()
        } catch (e) {
          // Ignore errors on cleanup
        }
      }
    }
  }, [language, continuous, interimResults])

  // STT Functions
  const startListening = useCallback(() => {
    if (!recognitionRef.current) {
      setError('Reconhecimento de voz nao suportado')
      return
    }

    try {
      setTranscript('')
      setInterimTranscript('')
      setError(null)
      recognitionRef.current.start()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
    }
  }, [])

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop()
      } catch (e) {
        // Ignore if already stopped
      }
    }
  }, [])

  const resetTranscript = useCallback(() => {
    setTranscript('')
    setInterimTranscript('')
  }, [])

  // TTS Functions - OpenAI TTS for natural voice
  const speakWithOpenAI = useCallback(async (text: string, voice: string = 'nova') => {
    try {
      setIsSpeaking(true)
      setError(null)

      const response = await fetch('/api/ai/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, voice }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        // If TTS service unavailable, fall back to browser
        if (errorData.fallback) {
          return false
        }
        throw new Error(errorData.error || 'TTS error')
      }

      // Create audio from blob
      const audioBlob = await response.blob()
      const audioUrl = URL.createObjectURL(audioBlob)

      // Stop any previous audio
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.src = ''
      }

      // Create and play new audio
      const audio = new Audio(audioUrl)
      audioRef.current = audio

      audio.onended = () => {
        setIsSpeaking(false)
        URL.revokeObjectURL(audioUrl)
      }

      audio.onerror = () => {
        setIsSpeaking(false)
        setError('Erro ao reproduzir audio')
        URL.revokeObjectURL(audioUrl)
      }

      await audio.play()
      return true
    } catch (err) {
      setIsSpeaking(false)
      console.warn('OpenAI TTS failed, falling back to browser:', err)
      return false
    }
  }, [])

  // TTS Functions - Browser fallback
  const speakWithBrowser = useCallback(
    (text: string, options: SpeechSynthesisOptions = {}) => {
      if (!('speechSynthesis' in window)) {
        setError('Sintese de voz nao suportada')
        return
      }

      // Cancel any ongoing speech
      window.speechSynthesis.cancel()

      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = language

      // Find Brazilian Portuguese voice
      let selectedVoice = availableVoices.find(
        (v) => v.lang === 'pt-BR' && v.name.includes(options.voice || '')
      )

      // Fallback to any pt-BR voice
      if (!selectedVoice) {
        selectedVoice = availableVoices.find((v) => v.lang === 'pt-BR')
      }

      if (selectedVoice) {
        utterance.voice = selectedVoice
      }

      utterance.rate = options.rate || 1.0
      utterance.pitch = options.pitch || 1.0
      utterance.volume = options.volume || 1.0

      utterance.onstart = () => setIsSpeaking(true)
      utterance.onend = () => setIsSpeaking(false)
      utterance.onerror = () => {
        setIsSpeaking(false)
        setError('Erro na sintese de voz')
      }

      window.speechSynthesis.speak(utterance)
    },
    [language, availableVoices]
  )

  // Main speak function - tries OpenAI first, falls back to browser
  const speak = useCallback(
    async (text: string, options: SpeechSynthesisOptions = {}) => {
      // If useOpenAI explicitly set to false, use browser only
      if (options.useOpenAI === false || !useNaturalVoice) {
        speakWithBrowser(text, options)
        return
      }

      // Try OpenAI TTS first
      const success = await speakWithOpenAI(text, options.voice || 'nova')

      // Fall back to browser TTS if OpenAI fails
      if (!success) {
        speakWithBrowser(text, options)
      }
    },
    [useNaturalVoice, speakWithOpenAI, speakWithBrowser]
  )

  const stopSpeaking = useCallback(() => {
    // Stop OpenAI audio
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.src = ''
    }
    // Stop browser speech synthesis
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()
    }
    setIsSpeaking(false)
  }, [])

  const pauseSpeaking = useCallback(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.pause()
    }
  }, [])

  const resumeSpeaking = useCallback(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.resume()
    }
  }, [])

  // Get pt-BR voices only
  const ptBRVoices = availableVoices.filter((v) => v.lang === 'pt-BR')

  return {
    // STT
    isListening,
    transcript,
    interimTranscript,
    startListening,
    stopListening,
    resetTranscript,

    // TTS
    isSpeaking,
    speak,
    stopSpeaking,
    pauseSpeaking,
    resumeSpeaking,
    availableVoices: ptBRVoices,

    // Natural Voice (OpenAI TTS)
    useNaturalVoice,
    setUseNaturalVoice,

    // Common
    isSupported,
    error,
  }
}
