import { NextRequest, NextResponse } from 'next/server'

const GROQ_API_KEY = process.env.GROQ_API_KEY

export async function POST(request: NextRequest) {
  try {
    const { audioBase64 } = await request.json()

    if (!audioBase64) {
      return NextResponse.json({ error: 'Audio base64 is required' }, { status: 400 })
    }

    if (!GROQ_API_KEY) {
      console.error('[Transcribe API] GROQ_API_KEY not configured')
      return NextResponse.json({ error: 'Transcription service not configured' }, { status: 503 })
    }

    // Extract base64 data (remove data URL prefix if present)
    const base64Data = audioBase64.replace(/^data:audio\/[^;]+;base64,/, '')

    // Convert base64 to buffer
    const audioBuffer = Buffer.from(base64Data, 'base64')

    // Create FormData for the API request
    const formData = new FormData()

    // Create a Blob from the buffer
    const audioBlob = new Blob([audioBuffer], { type: 'audio/webm' })
    formData.append('file', audioBlob, 'audio.webm')
    formData.append('model', 'whisper-large-v3')
    formData.append('language', 'pt')
    formData.append('response_format', 'json')

    // Call Groq API directly
    const response = await fetch('https://api.groq.com/openai/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${GROQ_API_KEY}`,
      },
      body: formData,
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('[Transcribe API] Groq error:', response.status, errorText)
      return NextResponse.json(
        {
          error: 'Transcription failed',
          details: errorText,
        },
        { status: response.status }
      )
    }

    const result = await response.json()

    return NextResponse.json({
      text: result.text || '',
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
