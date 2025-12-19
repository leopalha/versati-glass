/**
 * Script para organizar imagens do _arquivo/ por categoria de produto
 * Analisa nomes de arquivos e move/copia para public/images/products/
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const SOURCE_DIR = path.join(__dirname, '_arquivo')
const TARGET_DIR = path.join(__dirname, 'public', 'images', 'products')

// Mapeamento de palavras-chave para categorias
const CATEGORY_KEYWORDS = {
  BOX: [
    'box',
    'banheiro',
    'chuveiro',
    'shower',
    'bath',
  ],
  ESPELHOS: [
    'espelho',
    'mirror',
    'decorative-wall-mirrors',
    'espelho-grande',
    'espelho-para-sala',
  ],
  VIDROS: [
    'vidro',
    'glass',
    'temperado',
    'laminado',
    'cristal',
  ],
  PORTAS: [
    'porta',
    'door',
    'pivotante',
    'correr',
  ],
  JANELAS: [
    'janela',
    'window',
    'basculante',
    'maxim-ar',
    'ventana',
  ],
  GUARDA_CORPO: [
    'guarda-corpo',
    'barandilla',
    'gradil',
    'guarda',
  ],
  CORTINAS_VIDRO: [
    'cortina',
    'envidracamento',
    'cortain',
  ],
  PERGOLADOS: [
    'cobertura',
    'pergola',
    'pergolado',
    'telhado',
  ],
  TAMPOS: [
    'mesa',
    'table',
    'tampo',
    'prateleira',
    'shelf',
  ],
  DIVISORIAS: [
    'divisoria',
    'divisao',
    'partition',
    'escritorio',
    'office',
  ],
  FECHAMENTOS: [
    'fechamento',
    'sacada',
    'varanda',
  ],
  GERAL: [
    'architecture',
    'building',
    'shopping',
    'showcase',
    'store',
    'urban',
    'fachada',
  ],
}

// Função para detectar categoria baseado no nome do arquivo
function detectCategory(filename) {
  const lowerFilename = filename.toLowerCase()

  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    for (const keyword of keywords) {
      if (lowerFilename.includes(keyword)) {
        return category
      }
    }
  }

  return 'OUTROS'
}

// Função para criar estrutura de diretórios
function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
    console.log(`✅ Criado: ${dir}`)
  }
}

// Função principal
async function organizeImages() {
  console.log('🖼️  ORGANIZANDO IMAGENS\n')
  console.log(`📁 Origem: ${SOURCE_DIR}`)
  console.log(`📁 Destino: ${TARGET_DIR}\n`)

  // Garantir que diretório de destino existe
  ensureDir(TARGET_DIR)

  // Listar todos os arquivos de imagem
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.svg']
  const files = fs.readdirSync(SOURCE_DIR).filter(file => {
    const ext = path.extname(file).toLowerCase()
    return imageExtensions.includes(ext)
  })

  console.log(`📊 Total de imagens encontradas: ${files.length}\n`)

  // Estatísticas
  const stats = {}
  const mappings = []

  // Processar cada arquivo
  files.forEach((file, index) => {
    const category = detectCategory(file)

    if (!stats[category]) {
      stats[category] = 0
    }
    stats[category]++

    // Criar diretório da categoria
    const categoryDir = path.join(TARGET_DIR, category.toLowerCase().replace(/_/g, '-'))
    ensureDir(categoryDir)

    // Gerar nome sanitizado
    const ext = path.extname(file)
    const baseName = path.basename(file, ext)
    const sanitizedName = baseName
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, '-')
      .replace(/-+/g, '-')
      .substring(0, 50) // Limitar tamanho

    const newFilename = `${sanitizedName}${ext}`
    const sourcePath = path.join(SOURCE_DIR, file)
    const targetPath = path.join(categoryDir, newFilename)

    // Copiar arquivo (não mover, para manter backup)
    try {
      fs.copyFileSync(sourcePath, targetPath)

      const relativePath = `/images/products/${category.toLowerCase().replace(/_/g, '-')}/${newFilename}`

      mappings.push({
        original: file,
        category,
        newPath: relativePath
      })

      if ((index + 1) % 10 === 0) {
        console.log(`⏳ Processado ${index + 1}/${files.length}...`)
      }
    } catch (error) {
      console.error(`❌ Erro ao copiar ${file}:`, error.message)
    }
  })

  console.log(`\n✅ Processamento completo!\n`)

  // Mostrar estatísticas
  console.log('📊 ESTATÍSTICAS POR CATEGORIA:')
  console.log('─'.repeat(60))
  Object.entries(stats)
    .sort((a, b) => b[1] - a[1])
    .forEach(([category, count]) => {
      console.log(`  ${category.padEnd(20)} ${count} imagens`)
    })

  // Salvar mapeamento em JSON
  const mappingFile = path.join(__dirname, 'image-mappings.json')
  fs.writeFileSync(mappingFile, JSON.stringify(mappings, null, 2))
  console.log(`\n✅ Mapeamento salvo em: image-mappings.json`)

  // Gerar código TypeScript para product-images.ts
  console.log(`\n📝 PRÓXIMO PASSO: Atualizar product-images.ts\n`)

  generateProductImagesCode(stats, mappings)
}

// Gerar código TypeScript sugerido
function generateProductImagesCode(stats, mappings) {
  console.log('// Código sugerido para src/lib/product-images.ts:\n')

  const byCategory = {}
  mappings.forEach(m => {
    if (!byCategory[m.category]) {
      byCategory[m.category] = []
    }
    byCategory[m.category].push(m.newPath)
  })

  Object.entries(byCategory).forEach(([category, images]) => {
    console.log(`// ${category} (${images.length} imagens)`)
    console.log(`'${category}': [`)
    images.slice(0, 6).forEach(img => {  // Max 6 por categoria
      console.log(`  '${img}',`)
    })
    console.log(`],\n`)
  })
}

// Executar
organizeImages().catch(console.error)
