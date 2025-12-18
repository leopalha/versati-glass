import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'
import { logger } from '@/lib/logger'

/**
 * POST /api/upload
 * Faz upload de imagem (apenas ADMIN/STAFF)
 *
 * NOTA: Esta é uma implementação simples para desenvolvimento.
 * Em produção, recomenda-se usar Vercel Blob, Cloudinary ou S3.
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

    // Gerar nome único
    const timestamp = Date.now()
    const randomStr = Math.random().toString(36).substring(2, 8)
    const ext = file.name.split('.').pop()
    const filename = `${timestamp}-${randomStr}.${ext}`

    // Criar pasta de uploads se não existir
    const uploadsDir = join(process.cwd(), 'public', 'uploads', 'products')
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true })
    }

    // Salvar arquivo
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const filepath = join(uploadsDir, filename)
    await writeFile(filepath, buffer)

    // Retornar URL pública
    const url = `/uploads/products/${filename}`

    return NextResponse.json({
      url,
      filename,
      size: file.size,
      type: file.type,
    })
  } catch (error) {
    logger.error('[UPLOAD_ERROR]', error)
    return NextResponse.json({ error: 'Erro ao fazer upload' }, { status: 500 })
  }
}
