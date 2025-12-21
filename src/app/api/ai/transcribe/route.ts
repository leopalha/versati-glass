import { NextRequest, NextResponse } from 'next/server'
import Groq from 'groq-sdk'

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    const { audioBase64 } = await request.json()

    if (!audioBase64) {
      return NextResponse.json({ error: 'Audio base64 is required' }, { status: 400 })
    }

    // Extract base64 data (remove data URL prefix if present)
    const base64Data = audioBase64.replace(/^data:audio\/\w+;base64,/, '')

    // Convert base64 to buffer
    const audioBuffer = Buffer.from(base64Data, 'base64')

    // Create a File-like object for Groq
    const audioFile = new File([audioBuffer], 'audio.webm', { type: 'audio/webm' })

    // Use Groq's Whisper for transcription
    const transcription = await groq.audio.transcriptions.create({
      file: audioFile,
      model: 'whisper-large-v3',
      language: 'pt',
      response_format: 'text',
    })

    return NextResponse.json({
      text: transcription,
      success: true,
    })
  } catch (error) {
    console.error('[Transcribe API] Error:', error)
    return NextResponse.json(
      {
        error: 'Failed to transcribe audio',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
