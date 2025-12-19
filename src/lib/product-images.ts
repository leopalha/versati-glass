/**
 * Product Images Library - ATUALIZADO COM IMAGENS REAIS
 *
 * Reference images for glass products to help users visualize options
 * Images organizadas por categoria em /public/images/products/
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
// IMAGE DATABASE - IMAGENS REAIS
// ============================================================================

/**
 * Box models reference images
 */
export const BOX_IMAGES: ProductImage[] = [
  {
    id: 'box-banheiro-1',
    url: '/images/products/box/box-de-vidro-para-banheiro-2.webp',
    alt: 'Box de Vidro para Banheiro',
    category: 'BOX',
    description: 'Box frontal de vidro temperado com perfis de alumínio',
  },
]

/**
 * Mirror types reference images
 */
export const MIRROR_IMAGES: ProductImage[] = [
  {
    id: 'espelho-decorativo-1',
    url: '/images/products/espelhos/decorative-wall-mirrors-14.webp',
    alt: 'Espelho Decorativo de Parede',
    category: 'ESPELHOS',
    subcategory: 'DECORATIVO',
    description: 'Espelho decorativo com moldura sofisticada',
  },
  {
    id: 'espelho-grande-1',
    url: '/images/products/espelhos/espelho-grande-13.webp',
    alt: 'Espelho Grande para Sala',
    category: 'ESPELHOS',
    description: 'Espelho grande ideal para ambientes amplos',
  },
  {
    id: 'espelho-grande-2',
    url: '/images/products/espelhos/espelho-grande-37.webp',
    alt: 'Espelho Grande Bisotado',
    category: 'ESPELHOS',
    subcategory: 'BISOTE',
    description: 'Espelho grande com acabamento bisotê',
  },
  {
    id: 'espelho-grande-3',
    url: '/images/products/espelhos/espelho-grande-51.webp',
    alt: 'Espelho Grande Moderno',
    category: 'ESPELHOS',
    description: 'Espelho grande com design contemporâneo',
  },
  {
    id: 'espelho-grande-4',
    url: '/images/products/espelhos/espelho-grande-57.jpg',
    alt: 'Espelho Grande Retangular',
    category: 'ESPELHOS',
    description: 'Espelho retangular grande para parede',
  },
  {
    id: 'espelho-sala-1',
    url: '/images/products/espelhos/espelho-para-sala-13.webp',
    alt: 'Espelho para Sala de Estar',
    category: 'ESPELHOS',
    description: 'Espelho decorativo ideal para sala',
  },
]

/**
 * Door types reference images - PLACEHOLDERS (adicionar fotos reais)
 */
export const DOOR_IMAGES: ProductImage[] = [
  {
    id: 'door-placeholder-1',
    url: '/images/products/geral/architecture-1048092-1920-1536x1152.jpg',
    alt: 'Porta de Vidro em Projeto Arquitetônico',
    category: 'PORTAS',
    description: 'Exemplo de porta de vidro em ambiente comercial',
  },
]

/**
 * Window types reference images
 */
export const WINDOW_IMAGES: ProductImage[] = [
  {
    id: 'janela-aluminio-1',
    url: '/images/products/janelas/ventana-aluminio-sabadell.jpg',
    alt: 'Janela de Alumínio e Vidro',
    category: 'JANELAS',
    subcategory: 'CORRER',
    description: 'Janela de correr em alumínio com vidro temperado',
  },
]

/**
 * Guard rail systems reference images
 */
export const GUARD_RAIL_IMAGES: ProductImage[] = [
  {
    id: 'guarda-corpo-1',
    url: '/images/products/guarda-corpo/barandilla-2.jpg',
    alt: 'Guarda-Corpo em Vidro e Inox',
    category: 'GUARDA_CORPO',
    subcategory: 'INOX',
    description: 'Guarda-corpo moderno com vidro laminado e estrutura inox',
  },
]

/**
 * Glass curtain systems reference images
 */
export const GLASS_CURTAIN_IMAGES: ProductImage[] = [
  {
    id: 'cortina-vidro-1',
    url: '/images/products/vidros/cortina-cristal-1.jpg',
    alt: 'Cortina de Vidro para Varanda',
    category: 'CORTINAS_VIDRO',
    description: 'Sistema de cortina de vidro retrátil para varanda',
  },
  {
    id: 'cortina-vidro-2',
    url: '/images/products/vidros/cortina-cristal-2.jpg',
    alt: 'Cortina de Vidro Instalada',
    category: 'CORTINAS_VIDRO',
    description: 'Cortina de vidro com folhas em operação',
  },
]

/**
 * Pergola/Roof systems reference images
 */
export const PERGOLA_IMAGES: ProductImage[] = [
  {
    id: 'cobertura-vidro-1',
    url: '/images/products/vidros/cobertura-em-vidro-temperado-laminado-com-duponttm.jpg',
    alt: 'Cobertura em Vidro Temperado Laminado',
    category: 'PERGOLADOS',
    description: 'Cobertura premium com vidro laminado DuPont SentryGlas',
  },
  {
    id: 'cobertura-vidro-2',
    url: '/images/products/vidros/cobertura-em-vidro-temperado-d-nq-np-761910-mlb255.jpg',
    alt: 'Pergolado em Vidro Temperado',
    category: 'PERGOLADOS',
    description: 'Estrutura de pergolado com cobertura em vidro',
  },
]

/**
 * Table tops and shelves reference images
 */
export const SHELF_IMAGES: ProductImage[] = [
  {
    id: 'tampo-mesa-1',
    url: '/images/products/tampos/tables-cedar-1186z.jpg',
    alt: 'Tampo de Mesa em Vidro',
    category: 'TAMPOS_PRATELEIRAS',
    subcategory: 'TAMPO',
    description: 'Tampo de mesa em vidro temperado',
  },
  {
    id: 'mesa-vidro-1',
    url: '/images/products/tampos/mesas-vital-gallery-31.jpg',
    alt: 'Mesa com Tampo de Vidro',
    category: 'TAMPOS_PRATELEIRAS',
    subcategory: 'TAMPO',
    description: 'Mesa decorativa com tampo de vidro',
  },
  {
    id: 'cristal-mesa-1',
    url: '/images/products/vidros/cristal-para-mesa.jpg',
    alt: 'Cristal para Mesa',
    category: 'TAMPOS_PRATELEIRAS',
    subcategory: 'TAMPO',
    description: 'Tampo de cristal temperado para mesa',
  },
  {
    id: 'cristal-mesa-2',
    url: '/images/products/vidros/cristal-para-mesa-de-interior-2.jpg',
    alt: 'Cristal para Mesa de Interior',
    category: 'TAMPOS_PRATELEIRAS',
    subcategory: 'TAMPO',
    description: 'Tampo de cristal para ambientes internos',
  },
]

/**
 * Partition systems reference images
 */
export const PARTITION_IMAGES: ProductImage[] = [
  {
    id: 'divisoria-escritorio-1',
    url: '/images/products/divisorias/divisoria-de-escritorio-site-e1575370609135.jpg',
    alt: 'Divisória de Escritório em Vidro',
    category: 'DIVISORIAS',
    subcategory: 'ESCRITORIO',
    description: 'Divisória de vidro para ambientes corporativos',
  },
]

/**
 * Closure systems reference images
 */
export const CLOSURE_IMAGES: ProductImage[] = [
  {
    id: 'fechamento-sacada-1',
    url: '/images/products/fechamentos/envidra-amento-de-sacada.jpg',
    alt: 'Fechamento de Sacada em Vidro',
    category: 'FECHAMENTOS',
    subcategory: 'SACADA',
    description: 'Envidraçamento completo de sacada',
  },
]

/**
 * Vidros diversos - Exemplos de produtos e aplicações
 */
export const GLASS_EXAMPLES: ProductImage[] = [
  {
    id: 'cristal-porta-1',
    url: '/images/products/vidros/cristal-para-puerta-interior.jpg',
    alt: 'Cristal para Porta Interior',
    category: 'VIDROS',
    description: 'Vidro temperado para porta interna',
  },
  {
    id: 'cristales-medida-1',
    url: '/images/products/vidros/cristales-a-medida.jpg',
    alt: 'Cristais sob Medida',
    category: 'VIDROS',
    description: 'Vidros temperados cortados sob medida',
  },
  {
    id: 'cristales-medida-2',
    url: '/images/products/vidros/cristales-a-medida-1.png',
    alt: 'Vidros Personalizados',
    category: 'VIDROS',
    description: 'Vidros personalizados para diversos projetos',
  },
  {
    id: 'cristales-medida-3',
    url: '/images/products/vidros/cristales-a-medida-2.png',
    alt: 'Vidros Sob Encomenda',
    category: 'VIDROS',
    description: 'Vidros fabricados sob encomenda',
  },
]

/**
 * Imagens gerais - Arquitetura e Aplicações
 */
export const GENERAL_IMAGES: ProductImage[] = [
  {
    id: 'arquitetura-vidro-1',
    url: '/images/products/geral/architecture-1048092-1920-1536x1152.jpg',
    alt: 'Arquitetura com Vidro',
    category: 'GERAL',
    description: 'Projeto arquitetônico moderno com vidro',
  },
  {
    id: 'fachada-comercial-1',
    url: '/images/products/geral/building-91228-1920.jpg',
    alt: 'Fachada Comercial em Vidro',
    category: 'GERAL',
    description: 'Edifício comercial com fachada de vidro',
  },
  {
    id: 'shopping-1',
    url: '/images/products/geral/shopping-arcade-1214815-1920.jpg',
    alt: 'Shopping com Vidro',
    category: 'GERAL',
    description: 'Galeria de shopping com cobertura em vidro',
  },
  {
    id: 'shopping-mall-1',
    url: '/images/products/geral/shopping-mall-906734-1920-1536x1043.jpg',
    alt: 'Shopping Center',
    category: 'GERAL',
    description: 'Interior de shopping com estruturas de vidro',
  },
  {
    id: 'vitrine-1',
    url: '/images/products/geral/showcase-g01b6a45e8-1920.jpg',
    alt: 'Vitrine de Vidro',
    category: 'GERAL',
    description: 'Vitrine comercial em vidro temperado',
  },
  {
    id: 'loja-1',
    url: '/images/products/geral/store-832188-1920-1536x1024.jpg',
    alt: 'Fachada de Loja',
    category: 'GERAL',
    description: 'Fachada de loja com vidro e iluminação',
  },
  {
    id: 'urban-1',
    url: '/images/products/geral/urban-2004494-1920.jpg',
    alt: 'Arquitetura Urbana',
    category: 'GERAL',
    description: 'Projeto urbano com vidro estrutural',
  },
]

/**
 * Hardware reference images - PLACEHOLDERS (adicionar fotos reais)
 */
export const HARDWARE_IMAGES: ProductImage[] = [
  // Aguardando fotos reais de ferragens
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
    ...GLASS_EXAMPLES,
    ...GENERAL_IMAGES,
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
    ...GLASS_EXAMPLES,
    ...GENERAL_IMAGES,
    ...HARDWARE_IMAGES,
  ]

  return allImages.find((img) => img.id === id)
}

/**
 * Get random sample images for a category (for gallery)
 */
export function getSampleImages(category: string, count: number = 3): ProductImage[] {
  const images = getImagesForCategory(category)

  // Se não tiver imagens específicas, usar imagens gerais
  if (images.length === 0) {
    return GENERAL_IMAGES.slice(0, Math.min(count, GENERAL_IMAGES.length))
  }

  const shuffled = [...images].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, Math.min(count, images.length))
}

/**
 * Get fallback images when category has no specific images
 */
export function getFallbackImages(count: number = 3): ProductImage[] {
  return GENERAL_IMAGES.slice(0, Math.min(count, GENERAL_IMAGES.length))
}
