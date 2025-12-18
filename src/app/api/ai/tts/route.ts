/**
 * Text-to-Speech API using OpenAI TTS
 *
 * POST /api/ai/tts
 *
 * Generates natural-sounding speech from text using OpenAI's TTS API.
 * Falls back to a simpler response if TTS is not available.
 */

import { NextRequest, NextResponse } from 'next/server'
import { logger } from '@/lib/logger'

const OPENAI_API_KEY = process.env.OPENAI_API_KEY

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { text, voice = 'nova' } = body

    if (!text || typeof text !== 'string') {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 })
    }

    // Limit text length to prevent abuse (max 4096 characters)
    const truncatedText = text.slice(0, 4096)

    // If OpenAI API key is not configured, return error
    if (!OPENAI_API_KEY) {
      logger.warn('OpenAI API key not configured for TTS')
      return NextResponse.json(
        { error: 'TTS service not configured', fallback: true },
        { status: 503 }
      )
    }

    // Voice options: alloy, echo, fable, onyx, nova, shimmer
    // nova is good for female voice in Portuguese
    const validVoices = ['alloy', 'echo', 'fable', 'onyx', 'nova', 'shimmer']
    const selectedVoice = validVoices.includes(voice) ? voice : 'nova'

    // Call OpenAI TTS API
    const response = await fetch('https://api.openai.com/v1/audio/speech', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'tts-1', // Use tts-1 for faster response, tts-1-hd for better quality
        input: truncatedText,
        voice: selectedVoice,
        response_format: 'mp3',
        speed: 1.0,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      logger.error('OpenAI TTS API error:', { status: response.status, error: errorData })
      return NextResponse.json(
        { error: 'TTS generation failed', details: errorData },
        { status: response.status }
      )
    }

    // Get the audio data
    const audioBuffer = await response.arrayBuffer()

    // Return audio as response
    return new NextResponse(audioBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Length': audioBuffer.byteLength.toString(),
        'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
      },
    })
  } catch (error) {
    logger.error('TTS API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
