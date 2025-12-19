/**
 * Reorganizar imagens CORRETAMENTE
 * - Produtos → public/images/products/[categoria]/
 * - Arquitetura → public/images/gallery/
 * - Site → public/images/site/[tipo]/
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const SOURCE_DIR = path.join(__dirname, '_arquivo')
const PRODUCTS_DIR = path.join(__dirname, 'public', 'images', 'products')
const GALLERY_DIR = path.join(__dirname, 'public', 'images', 'gallery')
const SITE_DIR = path.join(__dirname, 'public', 'images', 'site')

// Classificação das imagens (mesma do analyze-images-detailed.mjs)
const IMAGE_CLASSIFICATION = {
  PRODUTOS: {
    BOX: ['box-de-vidro-para-banheiro-2.webp'],
    ESPELHOS: [
      'decorative-wall-mirrors-14.webp',
      'espelho-grande-13.webp',
      'espelho-grande-37.webp',
      'espelho-grande-51.webp',
      'espelho-grande-57.jpg',
      'espelho-para-sala-13.webp',
      'nouvelle-affiche-miroir-autocollant-de-mur.jpg',
    ],
    DIVISORIAS: [
      'DIVISORIA-DE-ESCRITORIO-SITE-e1575370609135.jpg',
      'division-de-oficina.jpg',
      'division-interior-vidrio-decorado.jpg',
      'dormakaba-americas-interior-glass-wall-system-for-conference-room-design.jpeg',
    ],
    GUARDA_CORPO: [
      'Barandilla-2.jpg',
      'escalera-despues1-1024x768.jpg',
    ],
    CORTINAS_VIDRO: [
      'cortina-cristal-1.jpg',
      'cortina-cristal-2.jpg',
    ],
    PERGOLADOS: [
      'Cobertura-em-Vidro-Temperado-Laminado-com-DuPontTM-SentryGlas.jpg',
      'cobertura-em-vidro-temperado-D_NQ_NP_761910-MLB25588707292_052017-F.jpg',
    ],
    FECHAMENTOS: ['envidraçamento-de-sacada.jpg'],
    JANELAS: ['ventana-aluminio-sabadell.jpg'],
    TAMPOS: [
      'cristal-para-mesa.jpg',
      'cristal-para-mesa-de-interior-2.jpg',
      'tables-cedar-1186z.jpg',
      'mesas-vital-gallery-31.jpg',
    ],
    VIDROS: [
      'cristal-para-puerta-interior.jpg',
      'cristales-a-medida.jpg',
      'cristales-a-medida-1.png',
      'cristales-a-medida-2.png',
      'cristales-a-medida-en-Sabadell1.png',
      'cristales-a-medida-en-Sabadell2.png',
      'cristales-a-medida-Terrassa-2.png',
      'cristaleria-Terrassa-2.png',
      'vidracaria-qual-tipo-de-vidro-escolher1.png',
      'Vidro-Refletivo-Champagne-Habitat-Cebrace.jpg',
      'VIDRO_TEMPERADO.jpg',
      'tipos-de-vidro.jpeg',
    ],
    PELICULAS: ['bg_peliculas_decorativas_01.jpg'],
    FACHADAS: [
      'fachada-pele-de-vidro.jpg',
      'tipos-de-vidros-para-fachada.jpg',
      'entenda-como-projetar-fachadas-de-casas-com-vidro.jpeg',
      'Tipos-de-vidros-para-fachada.jpg',
    ],
  },

  ARQUITETURA: [
    'architecture-1048092_1920-1536x1152.jpg',
    'building-91228_1920.jpg',
    'shopping-arcade-1214815_1920.jpg',
    'shopping-mall-906734_1920-1536x1043.jpg',
    'showcase-g01b6a45e8_1920.jpg',
    'store-832188_1920-1536x1024.jpg',
    'urban-2004494_1920.jpg',
    'AdobeStock_342435973-2048x1365.jpeg',
    'CO-Adaptive-B50-PHOTO-PeterDressel-07.jpg',
    'IMG_1185-1024x768.jpg',
    'clientsc-1536x1024.jpeg',
    '1458733345_----20151201---0006.jpg',
    '1906202006155368523519.jpg',
    '2017-09-22-PHOTO-00000709.jpg',
    '2017-09-22-PHOTO-00000710.jpg',
    'c86c550d351994b41133454897befe88.jpg',
    'Comment-souscrire-aux-parts-de-la-SCPI-Novapierre-Allemagne-e1590971305682.webp',
    'fotos-blogs-pau-29.png',
    '3ea6ae_5d57b8a1d2f44d39be32546f4b5cb913~mv2.jpg',
  ],

  SITE: {
    LOGOS: [
      'versati glass.png',
      'versati glass.svg',
      'versati glass branco.png',
      'versati glass branco.svg',
      'vitrinne.svg',
    ],
    ICONES: [
      'Instagram.png',
      'WhatsApp.png',
      'WI-FI.png',
      'vCard.png',
    ],
    DESIGNS: [
      'Design sem nome.png',
      'Design sem nome (1).png',
      'Diseno-sin-titulo-25.png',
      'Inserir um pouquinho de texto.png',
      'Inserir um pouquinho de texto (1).png',
      'Inserir um pouquinho de texto (2).png',
      'Inserir um pouquinho de texto (3).png',
      'Inserir um pouquinho de texto (4).png',
      'Inserir um pouquinho de texto (5).png',
      'slider-1-1536x743.jpg',
      '217.png',
      '98.png',
    ],
    SCREENSHOTS: [
      'IMG_1346.PNG',
      'IMG_1347.PNG',
      'IMG_1348.PNG',
      'IMG_1349.PNG',
      'IMG_1350.PNG',
      '123-2023-06-14T115259.023-5-1536x1086.png',
      '123-2023-06-14T115316.282-1.png',
      '123-2023-06-15T094321.458-1536x1086.png',
      '123-2023-06-15T094330.826.png',
    ],
    OUTROS: [
      'apparel-1850804_1920.jpg',
      'R.jpeg',
      'R (1).jpeg',
      'R (2).jpeg',
      'R (3).jpeg',
      'R (4).jpeg',
      'R (5).jpeg',
      'R (6).jpeg',
      'R (7).jpeg',
      'R (8).jpeg',
      'R (9).jpeg',
      'R (10).jpeg',
    ],
  },
}

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
}

function sanitizeName(filename) {
  const ext = path.extname(filename)
  const baseName = path.basename(filename, ext)
  return baseName
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .substring(0, 50) + ext.toLowerCase()
}

async function reorganizeImages() {
  console.log('\n🔄 REORGANIZANDO IMAGENS CORRETAMENTE\n')
  console.log('─'.repeat(60))

  // Limpar diretórios antigos
  console.log('\n🗑️  Limpando organização anterior...')
  if (fs.existsSync(PRODUCTS_DIR)) {
    fs.rmSync(PRODUCTS_DIR, { recursive: true, force: true })
  }
  if (fs.existsSync(GALLERY_DIR)) {
    fs.rmSync(GALLERY_DIR, { recursive: true, force: true })
  }
  if (fs.existsSync(SITE_DIR)) {
    fs.rmSync(SITE_DIR, { recursive: true, force: true })
  }

  // Criar estrutura
  console.log('📁 Criando nova estrutura...\n')

  // 1. PRODUTOS
  console.log('📦 PRODUTOS:')
  Object.entries(IMAGE_CLASSIFICATION.PRODUTOS).forEach(([categoria, arquivos]) => {
    const categoryDir = path.join(PRODUCTS_DIR, categoria.toLowerCase().replace(/_/g, '-'))
    ensureDir(categoryDir)

    arquivos.forEach(file => {
      const sourcePath = path.join(SOURCE_DIR, file)
      if (!fs.existsSync(sourcePath)) {
        console.log(`  ⚠️  Não encontrado: ${file}`)
        return
      }

      const sanitized = sanitizeName(file)
      const targetPath = path.join(categoryDir, sanitized)

      try {
        fs.copyFileSync(sourcePath, targetPath)
        console.log(`  ✅ ${categoria}: ${file}`)
      } catch (error) {
        console.log(`  ❌ Erro ao copiar ${file}:`, error.message)
      }
    })
  })

  // 2. ARQUITETURA/GALERIA
  console.log('\n🏛️  GALERIA (Arquitetura):')
  ensureDir(GALLERY_DIR)
  IMAGE_CLASSIFICATION.ARQUITETURA.forEach(file => {
    const sourcePath = path.join(SOURCE_DIR, file)
    if (!fs.existsSync(sourcePath)) {
      console.log(`  ⚠️  Não encontrado: ${file}`)
      return
    }

    const sanitized = sanitizeName(file)
    const targetPath = path.join(GALLERY_DIR, sanitized)

    try {
      fs.copyFileSync(sourcePath, targetPath)
      console.log(`  ✅ ${file}`)
    } catch (error) {
      console.log(`  ❌ Erro ao copiar ${file}:`, error.message)
    }
  })

  // 3. SITE/INSTITUCIONAL
  console.log('\n🌐 SITE/INSTITUCIONAL:')
  Object.entries(IMAGE_CLASSIFICATION.SITE).forEach(([tipo, arquivos]) => {
    const typeDir = path.join(SITE_DIR, tipo.toLowerCase())
    ensureDir(typeDir)

    arquivos.forEach(file => {
      const sourcePath = path.join(SOURCE_DIR, file)
      if (!fs.existsSync(sourcePath)) {
        console.log(`  ⚠️  Não encontrado: ${file}`)
        return
      }

      const sanitized = sanitizeName(file)
      const targetPath = path.join(typeDir, sanitized)

      try {
        fs.copyFileSync(sourcePath, targetPath)
        console.log(`  ✅ ${tipo}: ${file}`)
      } catch (error) {
        console.log(`  ❌ Erro ao copiar ${file}:`, error.message)
      }
    })
  })

  console.log('\n' + '─'.repeat(60))
  console.log('\n✅ Reorganização completa!')
  console.log('\n📊 ESTRUTURA CRIADA:')
  console.log('  public/images/products/     → Produtos de vidro (12 categorias)')
  console.log('  public/images/gallery/      → Arquitetura e referências')
  console.log('  public/images/site/         → Logos, ícones, designs, screenshots')
  console.log('\n')
}

reorganizeImages().catch(console.error)
