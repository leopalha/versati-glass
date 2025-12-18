import { NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'
import { logger } from '@/lib/logger'

/**
 * POST /api/ai/chat/upload
 * Upload de imagem para analise do chat AI
 *
 * Permite uploads de visitantes (sem autenticacao)
 * Retorna URL e base64 para uso com GPT-4 Vision
 */
export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: 'Nenhum arquivo enviado' }, { status: 400 })
    }

    // Verificar tipo - apenas imagens
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Formato de imagem nao suportado. Use JPG, PNG, WebP ou GIF.' },
        { status: 400 }
      )
    }

    // Verificar tamanho (10MB para imagens de alta resolucao)
    const maxSize = 10 * 1024 * 1024
    if (file.size > maxSize) {
      return NextResponse.json({ error: 'Imagem muito grande. Maximo 10MB.' }, { status: 400 })
    }

    // Gerar nome unico
    const timestamp = Date.now()
    const randomStr = Math.random().toString(36).substring(2, 8)
    const ext = file.name.split('.').pop() || 'jpg'
    const filename = `chat-${timestamp}-${randomStr}.${ext}`

    // Criar pasta de uploads se nao existir
    const uploadsDir = join(process.cwd(), 'public', 'uploads', 'chat')
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true })
    }

    // Converter para buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Salvar arquivo
    const filepath = join(uploadsDir, filename)
    await writeFile(filepath, buffer)

    // Gerar base64 para GPT-4 Vision
    const base64 = buffer.toString('base64')
    const mimeType = file.type

    // URL publica
    const url = `/uploads/chat/${filename}`

    logger.debug('Chat image uploaded', {
      filename,
      size: file.size,
      type: file.type,
    })

    return NextResponse.json({
      success: true,
      url,
      base64: `data:${mimeType};base64,${base64}`,
      filename,
      size: file.size,
      mimeType,
    })
  } catch (error) {
    logger.error('Chat upload error:', error)
    return NextResponse.json({ error: 'Erro ao fazer upload da imagem' }, { status: 500 })
  }
}
