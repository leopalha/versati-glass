'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Mic, MicOff, Volume2, VolumeX, Loader2 } from 'lucide-react'
import { useVoice } from '@/hooks/use-voice'
import { cn } from '@/lib/utils'

interface VoiceChatButtonProps {
  onTranscript: (text: string) => void
  onVoiceStateChange?: (isEnabled: boolean) => void
  autoSpeak?: boolean
  className?: string
}

export function VoiceChatButton({
  onTranscript,
  onVoiceStateChange,
  autoSpeak = false,
  className,
}: VoiceChatButtonProps) {
  const {
    isListening,
    transcript,
    interimTranscript,
    startListening,
    stopListening,
    resetTranscript,
    isSpeaking,
    stopSpeaking,
    isSupported,
    error,
  } = useVoice({
    language: 'pt-BR',
    continuous: false,
    interimResults: true,
  })

  const [isVoiceEnabled, setIsVoiceEnabled] = useState(false)

  // Send transcript when speech ends
  useEffect(() => {
    if (transcript && !isListening) {
      onTranscript(transcript)
      resetTranscript()
    }
  }, [transcript, isListening, onTranscript, resetTranscript])

  // Notify parent of voice state changes
  useEffect(() => {
    if (onVoiceStateChange) {
      onVoiceStateChange(isVoiceEnabled)
    }
  }, [isVoiceEnabled, onVoiceStateChange])

  const toggleListening = () => {
    if (isListening) {
      stopListening()
    } else {
      startListening()
    }
  }

  const toggleVoiceOutput = () => {
    if (isSpeaking) {
      stopSpeaking()
    }
    setIsVoiceEnabled(!isVoiceEnabled)
  }

  if (!isSupported) {
    return null
  }

  return (
    <div className={cn('flex items-center gap-2', className)}>
      {/* Voice Input Button */}
      <Button
        type="button"
        size="sm"
        variant={isListening ? 'default' : 'outline'}
        onClick={toggleListening}
        disabled={isSpeaking}
        className={cn('relative', isListening && 'animate-pulse bg-red-600 hover:bg-red-700')}
        title={isListening ? 'Parar gravacao' : 'Gravar audio'}
      >
        {isListening ? (
          <>
            <MicOff className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">Ouvindo...</span>
          </>
        ) : (
          <>
            <Mic className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">Falar</span>
          </>
        )}
      </Button>

      {/* Voice Output Toggle */}
      <Button
        type="button"
        size="sm"
        variant={isVoiceEnabled ? 'default' : 'outline'}
        onClick={toggleVoiceOutput}
        disabled={isListening}
        title={isVoiceEnabled ? 'Desativar audio' : 'Ativar audio'}
      >
        {isSpeaking ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : isVoiceEnabled ? (
          <Volume2 className="h-4 w-4" />
        ) : (
          <VolumeX className="h-4 w-4" />
        )}
      </Button>

      {/* Interim Transcript Display (mobile hidden) */}
      {interimTranscript && (
        <span className="text-theme-subtle hidden max-w-[200px] truncate text-xs italic md:inline">
          {interimTranscript}
        </span>
      )}

      {/* Error Display (mobile hidden) */}
      {error && (
        <span className="hidden max-w-[200px] truncate text-xs text-red-500 md:inline">
          Erro: {error}
        </span>
      )}
    </div>
  )
}
