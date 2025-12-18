/**
 * Product Images Library
 *
 * Reference images for glass products to help users visualize options
 * Images are placeholder URLs - replace with actual product photos
 */

export interface ProductImage {
  id: string
  url: string
  alt: string
  category: string
  subcategory?: string
  description?: string
}

// ============================================================================
// IMAGE DATABASE
// ============================================================================

/**
 * Box models reference images
 */
export const BOX_IMAGES: ProductImage[] = [
  {
    id: 'box-frontal',
    url: '/images/products/box-frontal.jpg',
    alt: 'Box Frontal em Vidro Temperado',
    category: 'BOX',
    subcategory: 'FRONTAL',
    description: 'Box frontal com 1 ou 2 folhas de correr',
  },
  {
    id: 'box-canto',
    url: '/images/products/box-canto.jpg',
    alt: 'Box de Canto em Vidro Temperado',
    category: 'BOX',
    subcategory: 'CANTO',
    description: 'Box de canto em L com portas de correr',
  },
  {
    id: 'box-articulado',
    url: '/images/products/box-articulado.jpg',
    alt: 'Box Articulado com Dobradiças',
    category: 'BOX',
    subcategory: 'ARTICULADO',
    description: 'Box com porta de abrir em dobradiças',
  },
]

/**
 * Mirror types reference images
 */
export const MIRROR_IMAGES: ProductImage[] = [
  {
    id: 'mirror-comum',
    url: '/images/products/espelho-comum.jpg',
    alt: 'Espelho Comum sem Moldura',
    category: 'ESPELHOS',
    subcategory: 'COMUM',
    description: 'Espelho tradicional com borda polida',
  },
  {
    id: 'mirror-bronze',
    url: '/images/products/espelho-bronze.jpg',
    alt: 'Espelho Bronze',
    category: 'ESPELHOS',
    subcategory: 'BRONZE',
    description: 'Espelho com tonalidade bronze',
  },
  {
    id: 'mirror-bisote',
    url: '/images/products/espelho-bisote.jpg',
    alt: 'Espelho com Bisotê',
    category: 'ESPELHOS',
    description: 'Espelho com acabamento bisotê nas bordas',
  },
  {
    id: 'mirror-led',
    url: '/images/products/espelho-led.jpg',
    alt: 'Espelho com LED',
    category: 'ESPELHOS',
    description: 'Espelho com iluminação LED integrada',
  },
]

/**
 * Door types reference images
 */
export const DOOR_IMAGES: ProductImage[] = [
  {
    id: 'door-abrir',
    url: '/images/products/porta-abrir.jpg',
    alt: 'Porta de Abrir em Vidro Temperado',
    category: 'PORTAS',
    subcategory: 'ABRIR',
    description: 'Porta de abrir com dobradiças',
  },
  {
    id: 'door-correr',
    url: '/images/products/porta-correr.jpg',
    alt: 'Porta de Correr em Vidro',
    category: 'PORTAS',
    subcategory: 'CORRER',
    description: 'Porta de correr sobre trilho',
  },
  {
    id: 'door-pivotante',
    url: '/images/products/porta-pivotante.jpg',
    alt: 'Porta Pivotante em Vidro',
    category: 'PORTAS',
    subcategory: 'PIVOTANTE',
    description: 'Porta pivotante com eixo central ou deslocado',
  },
  {
    id: 'door-camarao',
    url: '/images/products/porta-camarao.jpg',
    alt: 'Porta Camarão',
    category: 'PORTAS',
    subcategory: 'CAMARAO',
    description: 'Porta sanfonada tipo camarão',
  },
]

/**
 * Window types reference images
 */
export const WINDOW_IMAGES: ProductImage[] = [
  {
    id: 'window-fixa',
    url: '/images/products/janela-fixa.jpg',
    alt: 'Janela Fixa',
    category: 'JANELAS',
    subcategory: 'FIXA',
    description: 'Janela fixa sem abertura',
  },
  {
    id: 'window-maximar',
    url: '/images/products/janela-maximar.jpg',
    alt: 'Janela Maxim-Ar',
    category: 'JANELAS',
    subcategory: 'MAXIM_AR',
    description: 'Janela maxim-ar com abertura para fora',
  },
  {
    id: 'window-basculante',
    url: '/images/products/janela-basculante.jpg',
    alt: 'Janela Basculante',
    category: 'JANELAS',
    subcategory: 'BASCULANTE',
    description: 'Janela basculante horizontal',
  },
  {
    id: 'window-correr',
    url: '/images/products/janela-correr.jpg',
    alt: 'Janela de Correr',
    category: 'JANELAS',
    subcategory: 'CORRER',
    description: 'Janela de correr com 2 ou mais folhas',
  },
]

/**
 * Guard rail systems reference images
 */
export const GUARD_RAIL_IMAGES: ProductImage[] = [
  {
    id: 'guardrail-vidro',
    url: '/images/products/guarda-corpo-vidro.jpg',
    alt: 'Guarda-Corpo em Vidro Laminado',
    category: 'GUARDA_CORPO',
    subcategory: 'VIDRO',
    description: 'Guarda-corpo de vidro com perfis de alumínio',
  },
  {
    id: 'guardrail-inox',
    url: '/images/products/guarda-corpo-inox.jpg',
    alt: 'Guarda-Corpo Inox com Vidro',
    category: 'GUARDA_CORPO',
    subcategory: 'INOX',
    description: 'Guarda-corpo com estrutura em inox e vidro',
  },
  {
    id: 'guardrail-corrimao',
    url: '/images/products/guarda-corpo-corrimao.jpg',
    alt: 'Guarda-Corpo com Corrimão',
    category: 'GUARDA_CORPO',
    description: 'Guarda-corpo com corrimão superior em inox',
  },
]

/**
 * Glass curtain systems reference images
 */
export const GLASS_CURTAIN_IMAGES: ProductImage[] = [
  {
    id: 'curtain-varanda',
    url: '/images/products/cortina-vidro-varanda.jpg',
    alt: 'Cortina de Vidro para Varanda',
    category: 'CORTINAS_VIDRO',
    description: 'Sistema de cortina de vidro retrátil',
  },
  {
    id: 'curtain-completa',
    url: '/images/products/cortina-vidro-completa.jpg',
    alt: 'Cortina de Vidro Instalada',
    category: 'CORTINAS_VIDRO',
    description: 'Cortina de vidro com todas as folhas fechadas',
  },
]

/**
 * Pergola/Roof systems reference images
 */
export const PERGOLA_IMAGES: ProductImage[] = [
  {
    id: 'pergola-vidro',
    url: '/images/products/pergola-vidro.jpg',
    alt: 'Pergolado em Vidro Laminado',
    category: 'PERGOLADOS',
    description: 'Cobertura em vidro com estrutura de alumínio',
  },
  {
    id: 'pergola-estrutura',
    url: '/images/products/pergola-estrutura.jpg',
    alt: 'Estrutura de Pergolado',
    category: 'PERGOLADOS',
    description: 'Detalhes da estrutura e fixação do pergolado',
  },
]

/**
 * Table tops and shelves reference images
 */
export const SHELF_IMAGES: ProductImage[] = [
  {
    id: 'tampo-mesa',
    url: '/images/products/tampo-mesa-vidro.jpg',
    alt: 'Tampo de Mesa em Vidro Temperado',
    category: 'TAMPOS_PRATELEIRAS',
    subcategory: 'TAMPO',
    description: 'Tampo de mesa redondo ou retangular',
  },
  {
    id: 'prateleira-vidro',
    url: '/images/products/prateleira-vidro.jpg',
    alt: 'Prateleira de Vidro',
    category: 'TAMPOS_PRATELEIRAS',
    subcategory: 'PRATELEIRA',
    description: 'Prateleira de vidro com suportes invisíveis',
  },
]

/**
 * Partition systems reference images
 */
export const PARTITION_IMAGES: ProductImage[] = [
  {
    id: 'divisoria-piso-teto',
    url: '/images/products/divisoria-piso-teto.jpg',
    alt: 'Divisória Piso-Teto',
    category: 'DIVISORIAS',
    subcategory: 'PISO_TETO',
    description: 'Divisória de vidro piso-teto com perfis',
  },
  {
    id: 'divisoria-porta',
    url: '/images/products/divisoria-porta.jpg',
    alt: 'Divisória com Porta',
    category: 'DIVISORIAS',
    subcategory: 'COM_PORTA',
    description: 'Divisória de vidro com porta integrada',
  },
]

/**
 * Closure systems reference images
 */
export const CLOSURE_IMAGES: ProductImage[] = [
  {
    id: 'fechamento-varanda',
    url: '/images/products/fechamento-varanda.jpg',
    alt: 'Fechamento de Varanda',
    category: 'FECHAMENTOS',
    subcategory: 'VARANDA',
    description: 'Fechamento completo de varanda em vidro',
  },
  {
    id: 'fechamento-piscina',
    url: '/images/products/fechamento-piscina.jpg',
    alt: 'Fechamento de Piscina',
    category: 'FECHAMENTOS',
    subcategory: 'PISCINA',
    description: 'Fechamento de área de piscina para segurança',
  },
]

/**
 * Hardware reference images
 */
export const HARDWARE_IMAGES: ProductImage[] = [
  {
    id: 'hardware-dobradica',
    url: '/images/products/dobradica.jpg',
    alt: 'Dobradiças para Vidro',
    category: 'FERRAGENS',
    subcategory: 'DOBRADICA',
    description: 'Dobradiças para porta de vidro',
  },
  {
    id: 'hardware-puxador',
    url: '/images/products/puxador.jpg',
    alt: 'Puxadores Diversos',
    category: 'FERRAGENS',
    subcategory: 'PUXADOR',
    description: 'Puxadores tubulares e tipo H',
  },
  {
    id: 'hardware-fechadura',
    url: '/images/products/fechadura.jpg',
    alt: 'Fechaduras para Vidro',
    category: 'FERRAGENS',
    subcategory: 'FECHADURA',
    description: 'Fechaduras e trincos para porta de vidro',
  },
]

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Get all images for a specific category
 */
export function getImagesForCategory(category: string): ProductImage[] {
  const allImages = [
    ...BOX_IMAGES,
    ...MIRROR_IMAGES,
    ...DOOR_IMAGES,
    ...WINDOW_IMAGES,
    ...GUARD_RAIL_IMAGES,
    ...GLASS_CURTAIN_IMAGES,
    ...PERGOLA_IMAGES,
    ...SHELF_IMAGES,
    ...PARTITION_IMAGES,
    ...CLOSURE_IMAGES,
    ...HARDWARE_IMAGES,
  ]

  return allImages.filter((img) => img.category === category)
}

/**
 * Get images for a specific subcategory/model
 */
export function getImagesForSubcategory(category: string, subcategory: string): ProductImage[] {
  return getImagesForCategory(category).filter((img) => img.subcategory === subcategory)
}

/**
 * Get a single image by ID
 */
export function getImageById(id: string): ProductImage | undefined {
  const allImages = [
    ...BOX_IMAGES,
    ...MIRROR_IMAGES,
    ...DOOR_IMAGES,
    ...WINDOW_IMAGES,
    ...GUARD_RAIL_IMAGES,
    ...GLASS_CURTAIN_IMAGES,
    ...PERGOLA_IMAGES,
    ...SHELF_IMAGES,
    ...PARTITION_IMAGES,
    ...CLOSURE_IMAGES,
    ...HARDWARE_IMAGES,
  ]

  return allImages.find((img) => img.id === id)
}

/**
 * Get random sample images for a category (for gallery)
 */
export function getSampleImages(category: string, count: number = 3): ProductImage[] {
  const images = getImagesForCategory(category)
  const shuffled = [...images].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, Math.min(count, images.length))
}
