import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { readFile, writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'
import { logger } from '@/lib/logger'

const SETTINGS_DIR = join(process.cwd(), 'data')
const SETTINGS_FILE = join(SETTINGS_DIR, 'availability.json')

export async function GET() {
  try {
    const session = await auth()

    if (!session?.user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    // Tentar carregar configuração salva
    if (existsSync(SETTINGS_FILE)) {
      const data = await readFile(SETTINGS_FILE, 'utf-8')
      const config = JSON.parse(data)
      return NextResponse.json({ config })
    }

    // Retornar configuração padrão
    return NextResponse.json({
      config: {
        monday: { enabled: true, start: '08:00', end: '18:00' },
        tuesday: { enabled: true, start: '08:00', end: '18:00' },
        wednesday: { enabled: true, start: '08:00', end: '18:00' },
        thursday: { enabled: true, start: '08:00', end: '18:00' },
        friday: { enabled: true, start: '08:00', end: '18:00' },
        saturday: { enabled: false, start: '08:00', end: '12:00' },
        sunday: { enabled: false, start: '08:00', end: '12:00' },
        slotDuration: 120,
        bufferTime: 30,
      },
    })
  } catch (error) {
    logger.error('Erro ao carregar configuração:', error)
    return NextResponse.json({ error: 'Erro ao carregar configuração' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth()

    // Apenas admins podem alterar configurações
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const config = await request.json()

    // Criar diretório se não existir
    if (!existsSync(SETTINGS_DIR)) {
      await mkdir(SETTINGS_DIR, { recursive: true })
    }

    // Salvar configuração
    await writeFile(SETTINGS_FILE, JSON.stringify(config, null, 2), 'utf-8')

    return NextResponse.json({
      message: 'Configuração salva com sucesso',
      config,
    })
  } catch (error) {
    logger.error('Erro ao salvar configuração:', error)
    return NextResponse.json({ error: 'Erro ao salvar configuração' }, { status: 500 })
  }
}
