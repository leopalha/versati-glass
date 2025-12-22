import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'
import { logger } from '@/lib/logger'
import { uploadToR2, isR2Configured } from '@/lib/r2-storage'

/**
 * POST /api/upload
 * Faz upload de imagem (apenas ADMIN/STAFF)
 *
 * Em produção: usa Cloudflare R2 (persistente)
 * Em desenvolvimento: usa sistema de arquivos local
 */
export async function POST(request: Request) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    // Apenas admin e staff podem fazer upload
    if (session.user.role !== 'ADMIN' && session.user.role !== 'STAFF') {
      return NextResponse.json({ error: 'Permissão negada' }, { status: 403 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: 'Nenhum arquivo enviado' }, { status: 400 })
    }

    // Verificar tipo
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'Apenas imagens são permitidas' }, { status: 400 })
    }

    // Verificar tamanho (5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'Imagem muito grande (máximo 5MB)' }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Usar R2 se configurado (produção), senão local (desenvolvimento)
    if (isR2Configured()) {
      try {
        logger.info('[UPLOAD] Attempting R2 upload', {
          filename: file.name,
          size: file.size,
          type: file.type,
        })

        const result = await uploadToR2(buffer, file.name, file.type)

        logger.info('[UPLOAD] R2 upload success', { key: result.key, url: result.url })

        return NextResponse.json({
          url: result.url,
          key: result.key,
          size: file.size,
          type: file.type,
          storage: 'r2',
        })
      } catch (r2Error) {
        const errorMessage = r2Error instanceof Error ? r2Error.message : 'Unknown R2 error'
        logger.error('[UPLOAD] R2 upload failed', {
          error: errorMessage,
          stack: r2Error instanceof Error ? r2Error.stack : undefined,
        })
        // Fall through to local storage
      }
    }

    // Fallback: Local storage (desenvolvimento)
    const timestamp = Date.now()
    const randomStr = Math.random().toString(36).substring(2, 8)
    const ext = file.name.split('.').pop()
    const filename = `${timestamp}-${randomStr}.${ext}`

    const uploadsDir = join(process.cwd(), 'public', 'uploads', 'products')
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true })
    }

    const filepath = join(uploadsDir, filename)
    await writeFile(filepath, buffer)

    const url = `/uploads/products/${filename}`

    logger.info('[UPLOAD] Local upload success', { filename })

    return NextResponse.json({
      url,
      filename,
      size: file.size,
      type: file.type,
      storage: 'local',
      warning: 'Arquivo salvo localmente. Configure Cloudflare R2 para persistência em produção.',
    })
  } catch (error) {
    logger.error('[UPLOAD_ERROR]', error)
    return NextResponse.json({ error: 'Erro ao fazer upload' }, { status: 500 })
  }
}
