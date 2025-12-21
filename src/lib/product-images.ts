/**
 * Product Images Library - ATUALIZADO COM IMAGENS REAIS (ORGANIZAÇÃO CORRETA)
 *
 * Reference images for glass products to help users visualize options
 *
 * Estrutura:
 * - public/images/products/ - Imagens de produtos de vidro (41 imagens)
 * - public/images/gallery/  - Arquitetura e referências (19 imagens)
 * - public/images/site/     - Logos, ícones, designs, screenshots (42 imagens)
 */

import { logger } from '@/lib/logger'

export interface ProductImage {
  id: string
  url: string
  alt: string
  category: string
  subcategory?: string
  description?: string
}

// ============================================================================
// IMAGE DATABASE - IMAGENS REAIS (PATHS CORRETOS)
// ============================================================================

/**
 * Box models reference images - COMPLETO (22 imagens)
 */
export const BOX_IMAGES: ProductImage[] = [
  {
    id: 'box-1',
    url: '/images/products/box/box-articulado-2-folhas.jpg',
    alt: 'Box articulado 2 folhas',
    category: 'BOX',
    description: 'Box articulado com 2 folhas',
  },
  {
    id: 'box-2',
    url: '/images/products/box/box-articulado-2.jpg',
    alt: 'Box articulado',
    category: 'BOX',
    description: 'Box com abertura articulada',
  },
  {
    id: 'box-3',
    url: '/images/products/box/box-articulado-4.jpg',
    alt: 'Box articulado 4 folhas',
    category: 'BOX',
    description: 'Box articulado com 4 folhas',
  },
  {
    id: 'box-4',
    url: '/images/products/box/box-banheira.jpg',
    alt: 'Box para banheira',
    category: 'BOX',
    description: 'Box especial para banheira',
  },
  {
    id: 'box-5',
    url: '/images/products/box/box-canto-inox.jpg',
    alt: 'Box de canto inox',
    category: 'BOX',
    description: 'Box de canto com acabamento inox',
  },
  {
    id: 'box-6',
    url: '/images/products/box/box-canto-l.jpg',
    alt: 'Box de canto em L',
    category: 'BOX',
    description: 'Box em formato L',
  },
  {
    id: 'box-7',
    url: '/images/products/box/box-canto.jpg',
    alt: 'Box de canto',
    category: 'BOX',
    description: 'Box de canto padrão',
  },
  {
    id: 'box-8',
    url: '/images/products/box/box-cristal-dobradicas.jpg',
    alt: 'Box cristal com dobradiças',
    category: 'BOX',
    description: 'Box cristal com dobradiças',
  },
  {
    id: 'box-9',
    url: '/images/products/box/box-cristal.jpg',
    alt: 'Box cristal',
    category: 'BOX',
    description: 'Box em vidro cristal',
  },
  {
    id: 'box-10',
    url: '/images/products/box/box-de-abrir.jpg',
    alt: 'Box de abrir',
    category: 'BOX',
    description: 'Box com abertura tradicional',
  },
  {
    id: 'box-11',
    url: '/images/products/box/box-de-vidro-para-banheiro-2.webp',
    alt: 'Box de vidro para banheiro',
    category: 'BOX',
    description: 'Box frontal de vidro temperado',
  },
  {
    id: 'box-12',
    url: '/images/products/box/box-elegance-premium.jpg',
    alt: 'Box Elegance Premium',
    category: 'BOX',
    subcategory: 'ELEGANCE',
    description: 'Box linha Elegance premium',
  },
  {
    id: 'box-13',
    url: '/images/products/box/box-elegance.jpg',
    alt: 'Box Elegance',
    category: 'BOX',
    subcategory: 'ELEGANCE',
    description: 'Box linha Elegance',
  },
  {
    id: 'box-14',
    url: '/images/products/box/box-frontal-2-folhas.jpg',
    alt: 'Box frontal 2 folhas',
    category: 'BOX',
    description: 'Box frontal com 2 folhas',
  },
  {
    id: 'box-15',
    url: '/images/products/box/box-frontal-4-folhas.jpg',
    alt: 'Box frontal 4 folhas',
    category: 'BOX',
    description: 'Box frontal com 4 folhas',
  },
  {
    id: 'box-16',
    url: '/images/products/box/box-frontal-duplo.jpg',
    alt: 'Box frontal duplo',
    category: 'BOX',
    description: 'Box frontal duplo',
  },
  {
    id: 'box-17',
    url: '/images/products/box/box-frontal-simples.jpg',
    alt: 'Box frontal simples',
    category: 'BOX',
    description: 'Box frontal simples',
  },
  {
    id: 'box-18',
    url: '/images/products/box/box-incolor.jpg',
    alt: 'Box incolor',
    category: 'BOX',
    description: 'Box em vidro incolor',
  },
  {
    id: 'box-19',
    url: '/images/products/box/box-para-banheira.jpg',
    alt: 'Box para banheira',
    category: 'BOX',
    description: 'Box especial para banheira',
  },
  {
    id: 'box-20',
    url: '/images/products/box/box-pivotante.jpg',
    alt: 'Box pivotante',
    category: 'BOX',
    description: 'Box com abertura pivotante',
  },
  {
    id: 'box-21',
    url: '/images/products/box/box-premium.jpg',
    alt: 'Box premium',
    category: 'BOX',
    description: 'Box linha premium',
  },
  {
    id: 'box-22',
    url: '/images/products/box/box-walk-in.jpg',
    alt: 'Box walk-in',
    category: 'BOX',
    description: 'Box walk-in sem porta',
  },
]

/**
 * Mirror types reference images
 */
export const MIRROR_IMAGES: ProductImage[] = [
  {
    id: 'espelhos-1',
    url: '/images/products/espelhos/decorative-wall-mirrors-14.webp',
    alt: 'Espelho decorativo de parede',
    category: 'ESPELHOS',
    description: 'Espelho decorativo com moldura sofisticada',
  },
  {
    id: 'espelhos-2',
    url: '/images/products/espelhos/espelho-bisotado.jpg',
    alt: 'Espelho bisotado',
    category: 'ESPELHOS',
    description: 'Espelho com acabamento bisotê',
  },
  {
    id: 'espelhos-3',
    url: '/images/products/espelhos/espelho-bronze.jpg',
    alt: 'Espelho bronze',
    category: 'ESPELHOS',
    description: 'Espelho com tonalidade bronze',
  },
  {
    id: 'espelhos-4',
    url: '/images/products/espelhos/espelho-camarim.jpg',
    alt: 'Espelho camarim',
    category: 'ESPELHOS',
    description: 'Espelho estilo camarim com iluminação',
  },
  {
    id: 'espelhos-5',
    url: '/images/products/espelhos/espelho-fume.jpg',
    alt: 'Espelho fumê',
    category: 'ESPELHOS',
    description: 'Espelho fumê para decoração',
  },
  {
    id: 'espelhos-6',
    url: '/images/products/espelhos/espelho-grande-13.webp',
    alt: 'Espelho grande para sala',
    category: 'ESPELHOS',
    description: 'Espelho grande ideal para ambientes amplos',
  },
  {
    id: 'espelhos-7',
    url: '/images/products/espelhos/espelho-grande-37.webp',
    alt: 'Espelho grande bisotado',
    category: 'ESPELHOS',
    description: 'Espelho grande com acabamento bisotê',
  },
  {
    id: 'espelhos-8',
    url: '/images/products/espelhos/espelho-grande-51.webp',
    alt: 'Espelho grande moderno',
    category: 'ESPELHOS',
    description: 'Espelho grande com design contemporâneo',
  },
  {
    id: 'espelhos-9',
    url: '/images/products/espelhos/espelho-grande-57.jpg',
    alt: 'Espelho grande retangular',
    category: 'ESPELHOS',
    description: 'Espelho retangular grande para parede',
  },
  {
    id: 'espelhos-10',
    url: '/images/products/espelhos/espelho-jateado.jpg',
    alt: 'Espelho jateado',
    category: 'ESPELHOS',
    description: 'Espelho com acabamento jateado',
  },
  {
    id: 'espelhos-11',
    url: '/images/products/espelhos/espelho-led.jpg',
    alt: 'Espelho com LED',
    category: 'ESPELHOS',
    description: 'Espelho com iluminação LED integrada',
  },
  {
    id: 'espelhos-12',
    url: '/images/products/espelhos/espelho-para-sala-13.webp',
    alt: 'Espelho para sala de estar',
    category: 'ESPELHOS',
    description: 'Espelho decorativo ideal para sala',
  },
  {
    id: 'espelhos-13',
    url: '/images/products/espelhos/espelho-veneziano.jpg',
    alt: 'Espelho veneziano',
    category: 'ESPELHOS',
    description: 'Espelho estilo veneziano clássico',
  },
  {
    id: 'espelhos-14',
    url: '/images/products/espelhos/nouvelle-affiche-miroir-autocollant-de-mur.jpg',
    alt: 'Espelho adesivo decorativo',
    category: 'ESPELHOS',
    description: 'Espelho adesivo moderno para decoração',
  },
]

/**
 * Door types reference images
 */
export const DOOR_IMAGES: ProductImage[] = [
  {
    id: 'portas-1',
    url: '/images/products/portas/porta-abrir-inteirica.jpg',
    alt: 'Porta de abrir inteirica',
    category: 'PORTAS',
    description: 'Porta de vidro de abrir inteirica',
  },
  {
    id: 'portas-2',
    url: '/images/products/portas/porta-abrir.jpg',
    alt: 'Porta de abrir',
    category: 'PORTAS',
    description: 'Porta de vidro de abrir',
  },
  {
    id: 'portas-3',
    url: '/images/products/portas/porta-automatica.jpg',
    alt: 'Porta automática',
    category: 'PORTAS',
    description: 'Porta automática em vidro',
  },
  {
    id: 'portas-4',
    url: '/images/products/portas/porta-camarao.jpg',
    alt: 'Porta camarão',
    category: 'PORTAS',
    description: 'Porta camarão de vidro',
  },
  {
    id: 'portas-5',
    url: '/images/products/portas/porta-correr.jpg',
    alt: 'Porta de correr',
    category: 'PORTAS',
    description: 'Porta de vidro de correr',
  },
  {
    id: 'portas-6',
    url: '/images/products/portas/porta-pivotante-premium.jpg',
    alt: 'Porta pivotante premium',
    category: 'PORTAS',
    description: 'Porta pivotante linha premium',
  },
  {
    id: 'portas-7',
    url: '/images/products/portas/porta-pivotante.jpg',
    alt: 'Porta pivotante',
    category: 'PORTAS',
    description: 'Porta pivotante em vidro',
  },
]

/**
 * Window types reference images
 */
export const WINDOW_IMAGES: ProductImage[] = [
  {
    id: 'janelas-1',
    url: '/images/products/janelas/janela-basculante.jpg',
    alt: 'Janela basculante',
    category: 'JANELAS',
    description: 'Janela basculante em vidro',
  },
  {
    id: 'janelas-2',
    url: '/images/products/janelas/janela-correr.jpg',
    alt: 'Janela de correr',
    category: 'JANELAS',
    description: 'Janela de correr em vidro',
  },
  {
    id: 'janelas-3',
    url: '/images/products/janelas/janela-guilhotina.jpg',
    alt: 'Janela guilhotina',
    category: 'JANELAS',
    description: 'Janela guilhotina em vidro',
  },
  {
    id: 'janelas-4',
    url: '/images/products/janelas/janela-maxim-ar.jpg',
    alt: 'Janela maxim-ar',
    category: 'JANELAS',
    description: 'Janela maxim-ar em vidro',
  },
  {
    id: 'janelas-5',
    url: '/images/products/janelas/janela-pivotante.jpg',
    alt: 'Janela pivotante',
    category: 'JANELAS',
    description: 'Janela pivotante em vidro',
  },
  {
    id: 'janelas-6',
    url: '/images/products/janelas/janela.jpg',
    alt: 'Janela de vidro',
    category: 'JANELAS',
    description: 'Janela em vidro temperado',
  },
  {
    id: 'janelas-7',
    url: '/images/products/janelas/ventana-aluminio-sabadell.jpg',
    alt: 'Janela de alumínio e vidro',
    category: 'JANELAS',
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
    alt: 'Guarda-corpo em vidro e inox',
    category: 'GUARDA_CORPO',
    description: 'Guarda-corpo moderno com vidro laminado e estrutura inox',
  },
  {
    id: 'guarda-corpo-2',
    url: '/images/products/guarda-corpo/escalera-despues1-1024x768.jpg',
    alt: 'Guarda-corpo para escada',
    category: 'GUARDA_CORPO',
    description: 'Guarda-corpo de vidro para escada interna',
  },
  {
    id: 'guarda-corpo-3',
    url: '/images/products/guarda-corpo/gradil-inox.jpg',
    alt: 'Gradil inox',
    category: 'GUARDA_CORPO',
    description: 'Gradil em inox e vidro',
  },
  {
    id: 'guarda-corpo-4',
    url: '/images/products/guarda-corpo/guarda-corpo-autoportante-inox.jpg',
    alt: 'Guarda-corpo autoportante inox',
    category: 'GUARDA_CORPO',
    description: 'Guarda-corpo autoportante em inox',
  },
  {
    id: 'guarda-corpo-5',
    url: '/images/products/guarda-corpo/guarda-corpo-autoportante.jpg',
    alt: 'Guarda-corpo autoportante',
    category: 'GUARDA_CORPO',
    description: 'Sistema autoportante de guarda-corpo',
  },
  {
    id: 'guarda-corpo-6',
    url: '/images/products/guarda-corpo/guarda-corpo-bottons.jpg',
    alt: 'Guarda-corpo com bottons',
    category: 'GUARDA_CORPO',
    description: 'Guarda-corpo fixado com bottons',
  },
  {
    id: 'guarda-corpo-7',
    url: '/images/products/guarda-corpo/guarda-corpo-inox.jpg',
    alt: 'Guarda-corpo inox',
    category: 'GUARDA_CORPO',
    description: 'Guarda-corpo em inox polido',
  },
  {
    id: 'guarda-corpo-8',
    url: '/images/products/guarda-corpo/guarda-corpo-spider.jpg',
    alt: 'Guarda-corpo spider',
    category: 'GUARDA_CORPO',
    description: 'Guarda-corpo sistema spider',
  },
  {
    id: 'guarda-corpo-9',
    url: '/images/products/guarda-corpo/guarda-corpo-torres.jpg',
    alt: 'Guarda-corpo com torres',
    category: 'GUARDA_CORPO',
    description: 'Guarda-corpo com sistema de torres',
  },
  {
    id: 'guarda-corpo-10',
    url: '/images/products/guarda-corpo/guarda-corpo.jpg',
    alt: 'Guarda-corpo',
    category: 'GUARDA_CORPO',
    description: 'Guarda-corpo em vidro temperado',
  },
]

/**
 * Glass curtain systems reference images
 */
export const GLASS_CURTAIN_IMAGES: ProductImage[] = [
  {
    id: 'cortinas-vidro-1',
    url: '/images/products/cortinas-vidro/cortina-automatizada.jpg',
    alt: 'Cortina automatizada',
    category: 'CORTINAS_VIDRO',
    description: 'Sistema automatizado de cortina de vidro',
  },
  {
    id: 'cortinas-vidro-2',
    url: '/images/products/cortinas-vidro/cortina-cristal-1.jpg',
    alt: 'Cortina de vidro para varanda',
    category: 'CORTINAS_VIDRO',
    description: 'Sistema de cortina de vidro retrátil para varanda',
  },
  {
    id: 'cortinas-vidro-3',
    url: '/images/products/cortinas-vidro/cortina-cristal-2.jpg',
    alt: 'Cortina de vidro instalada',
    category: 'CORTINAS_VIDRO',
    description: 'Cortina de vidro com folhas em operação',
  },
  {
    id: 'cortinas-vidro-4',
    url: '/images/products/cortinas-vidro/cortina-europeu-premium.jpg',
    alt: 'Cortina europeu premium',
    category: 'CORTINAS_VIDRO',
    description: 'Sistema europeu premium de cortina de vidro',
  },
  {
    id: 'cortinas-vidro-5',
    url: '/images/products/cortinas-vidro/cortina-europeu.jpg',
    alt: 'Cortina europeu',
    category: 'CORTINAS_VIDRO',
    description: 'Sistema europeu de cortina de vidro',
  },
  {
    id: 'cortinas-vidro-6',
    url: '/images/products/cortinas-vidro/cortina-stanley.jpg',
    alt: 'Cortina stanley',
    category: 'CORTINAS_VIDRO',
    description: 'Sistema Stanley de cortina de vidro',
  },
  {
    id: 'cortinas-vidro-7',
    url: '/images/products/cortinas-vidro/cortina-vidro-europeu.jpg',
    alt: 'Cortina vidro europeu',
    category: 'CORTINAS_VIDRO',
    description: 'Cortina de vidro sistema europeu',
  },
  {
    id: 'cortinas-vidro-8',
    url: '/images/products/cortinas-vidro/cortina-vidro-premium.jpg',
    alt: 'Cortina vidro premium',
    category: 'CORTINAS_VIDRO',
    description: 'Cortina de vidro linha premium',
  },
  {
    id: 'cortinas-vidro-9',
    url: '/images/products/cortinas-vidro/cortina-vidro-stanley.jpg',
    alt: 'Cortina vidro stanley',
    category: 'CORTINAS_VIDRO',
    description: 'Cortina de vidro sistema Stanley',
  },
]

/**
 * Pergola/Roof systems reference images
 */
export const PERGOLA_IMAGES: ProductImage[] = [
  {
    id: 'pergolados-1',
    url: '/images/products/pergolados/cobertura-controle-solar.jpg',
    alt: 'Cobertura controle solar',
    category: 'PERGOLADOS',
    description: 'Cobertura com vidro de controle solar',
  },
  {
    id: 'pergolados-2',
    url: '/images/products/pergolados/cobertura-em-vidro-temperado-d-nq-np-761910-mlb255.jpg',
    alt: 'Pergolado em vidro temperado',
    category: 'PERGOLADOS',
    description: 'Estrutura de pergolado com cobertura em vidro',
  },
  {
    id: 'pergolados-3',
    url: '/images/products/pergolados/cobertura-em-vidro-temperado-laminado-com-duponttm.jpg',
    alt: 'Cobertura em vidro temperado laminado',
    category: 'PERGOLADOS',
    description: 'Cobertura premium com vidro laminado DuPont SentryGlas',
  },
  {
    id: 'pergolados-4',
    url: '/images/products/pergolados/cobertura-laminado.jpg',
    alt: 'Cobertura laminado',
    category: 'PERGOLADOS',
    description: 'Cobertura em vidro laminado',
  },
  {
    id: 'pergolados-5',
    url: '/images/products/pergolados/cobertura-vidro-laminado.jpg',
    alt: 'Cobertura vidro laminado',
    category: 'PERGOLADOS',
    description: 'Sistema de cobertura em vidro laminado',
  },
  {
    id: 'pergolados-6',
    url: '/images/products/pergolados/pergolado-aco-inox.jpg',
    alt: 'Pergolado aço inox',
    category: 'PERGOLADOS',
    description: 'Pergolado com estrutura em aço inox',
  },
  {
    id: 'pergolados-7',
    url: '/images/products/pergolados/pergolado-aluminio.jpg',
    alt: 'Pergolado alumínio',
    category: 'PERGOLADOS',
    description: 'Pergolado com estrutura em alumínio',
  },
  {
    id: 'pergolados-8',
    url: '/images/products/pergolados/pergolado-inox.jpg',
    alt: 'Pergolado inox',
    category: 'PERGOLADOS',
    description: 'Pergolado em inox com vidro',
  },
]

/**
 * Table tops and shelves reference images
 */
export const SHELF_IMAGES: ProductImage[] = [
  {
    id: 'tampos-1',
    url: '/images/products/tampos/cristal-para-mesa-de-interior-2.jpg',
    alt: 'Cristal para mesa de interior',
    category: 'TAMPOS_PRATELEIRAS',
    description: 'Tampo de cristal para ambientes internos',
  },
  {
    id: 'tampos-2',
    url: '/images/products/tampos/cristal-para-mesa.jpg',
    alt: 'Cristal para mesa',
    category: 'TAMPOS_PRATELEIRAS',
    description: 'Tampo de cristal temperado para mesa',
  },
  {
    id: 'tampos-3',
    url: '/images/products/tampos/mesas-vital-gallery-31.jpg',
    alt: 'Mesa com tampo de vidro',
    category: 'TAMPOS_PRATELEIRAS',
    description: 'Mesa decorativa com tampo de vidro',
  },
  {
    id: 'tampos-4',
    url: '/images/products/tampos/prateleira.jpg',
    alt: 'Prateleira',
    category: 'TAMPOS_PRATELEIRAS',
    description: 'Prateleira em vidro temperado',
  },
  {
    id: 'tampos-5',
    url: '/images/products/tampos/tables-cedar-1186z.jpg',
    alt: 'Tampo de mesa em vidro',
    category: 'TAMPOS_PRATELEIRAS',
    description: 'Tampo de mesa em vidro temperado',
  },
  {
    id: 'tampos-6',
    url: '/images/products/tampos/tampo-extra-clear.jpg',
    alt: 'Tampo extra clear',
    category: 'TAMPOS_PRATELEIRAS',
    description: 'Tampo em vidro extra clear',
  },
  {
    id: 'tampos-7',
    url: '/images/products/tampos/tampo-mesa.jpg',
    alt: 'Tampo mesa',
    category: 'TAMPOS_PRATELEIRAS',
    description: 'Tampo de mesa em vidro',
  },
  {
    id: 'tampos-8',
    url: '/images/products/tampos/tampo.jpg',
    alt: 'Tampo',
    category: 'TAMPOS_PRATELEIRAS',
    description: 'Tampo em vidro temperado',
  },
]

/**
 * Partition systems reference images
 */
export const PARTITION_IMAGES: ProductImage[] = [
  {
    id: 'divisorias-1',
    url: '/images/products/divisorias/division-de-oficina.jpg',
    alt: 'Divisória de vidro para oficina',
    category: 'DIVISORIAS',
    description: 'Divisória de vidro temperado para área industrial',
  },
  {
    id: 'divisorias-2',
    url: '/images/products/divisorias/division-interior-vidrio-decorado.jpg',
    alt: 'Divisória com vidro decorado',
    category: 'DIVISORIAS',
    description: 'Divisória com vidro jateado decorativo',
  },
  {
    id: 'divisorias-3',
    url: '/images/products/divisorias/divisoria-acustica.jpg',
    alt: 'Divisória acústica',
    category: 'DIVISORIAS',
    description: 'Divisória com isolamento acústico',
  },
  {
    id: 'divisorias-4',
    url: '/images/products/divisorias/divisoria-ambiente.jpg',
    alt: 'Divisória de ambiente',
    category: 'DIVISORIAS',
    description: 'Divisória para separação de ambientes',
  },
  {
    id: 'divisorias-5',
    url: '/images/products/divisorias/divisoria-de-escritorio-site-e1575370609135.jpg',
    alt: 'Divisória de escritório',
    category: 'DIVISORIAS',
    description: 'Divisória de vidro para ambientes corporativos',
  },
  {
    id: 'divisorias-6',
    url: '/images/products/divisorias/divisoria-escritorio.jpg',
    alt: 'Divisória escritório',
    category: 'DIVISORIAS',
    description: 'Divisória corporativa em vidro',
  },
  {
    id: 'divisorias-7',
    url: '/images/products/divisorias/divisoria-porta.jpg',
    alt: 'Divisória com porta',
    category: 'DIVISORIAS',
    description: 'Divisória com porta integrada',
  },
  {
    id: 'divisorias-8',
    url: '/images/products/divisorias/divisoria.jpg',
    alt: 'Divisória',
    category: 'DIVISORIAS',
    description: 'Divisória em vidro temperado',
  },
  {
    id: 'divisorias-9',
    url: '/images/products/divisorias/dormakaba-americas-interior-glass-wall-system-for-.jpeg',
    alt: 'Sistema de divisórias corporativas',
    category: 'DIVISORIAS',
    description: 'Sistema profissional de divisórias de vidro para escritórios',
  },
  {
    id: 'divisorias-10',
    url: '/images/products/divisorias/painel-decorativo.jpg',
    alt: 'Painel decorativo',
    category: 'DIVISORIAS',
    description: 'Painel decorativo em vidro',
  },
]

/**
 * Closure systems reference images
 */
export const CLOSURE_IMAGES: ProductImage[] = [
  {
    id: 'fechamentos-1',
    url: '/images/products/fechamentos/envidra-amento-de-sacada.jpg',
    alt: 'Fechamento de sacada em vidro',
    category: 'FECHAMENTOS',
    description: 'Envidraçamento completo de sacada',
  },
  {
    id: 'fechamentos-2',
    url: '/images/products/fechamentos/fechamento-area-gourmet.jpg',
    alt: 'Fechamento área gourmet',
    category: 'FECHAMENTOS',
    description: 'Fechamento de área gourmet',
  },
  {
    id: 'fechamentos-3',
    url: '/images/products/fechamentos/fechamento-area-servico.jpg',
    alt: 'Fechamento área serviço',
    category: 'FECHAMENTOS',
    description: 'Fechamento de área de serviço',
  },
  {
    id: 'fechamentos-4',
    url: '/images/products/fechamentos/fechamento-gourmet.jpg',
    alt: 'Fechamento gourmet',
    category: 'FECHAMENTOS',
    description: 'Sistema de fechamento para espaço gourmet',
  },
  {
    id: 'fechamentos-5',
    url: '/images/products/fechamentos/fechamento-piscina.jpg',
    alt: 'Fechamento piscina',
    category: 'FECHAMENTOS',
    description: 'Fechamento de área de piscina',
  },
  {
    id: 'fechamentos-6',
    url: '/images/products/fechamentos/fechamento-sacada.jpg',
    alt: 'Fechamento sacada',
    category: 'FECHAMENTOS',
    description: 'Fechamento de sacada em vidro',
  },
  {
    id: 'fechamentos-7',
    url: '/images/products/fechamentos/fechamento-servico.jpg',
    alt: 'Fechamento serviço',
    category: 'FECHAMENTOS',
    description: 'Fechamento para área de serviço',
  },
]

/**
 * Películas decorativas e de segurança
 */
export const PELICULA_IMAGES: ProductImage[] = [
  {
    id: 'pelicula-decorativa-1',
    url: '/images/products/peliculas/bg-peliculas-decorativas-01.jpg',
    alt: 'Película Decorativa para Vidro',
    category: 'PELICULAS',
    subcategory: 'DECORATIVA',
    description: 'Película decorativa com efeito jateado',
  },
]

/**
 * Fachadas em vidro
 */
export const FACHADA_IMAGES: ProductImage[] = [
  {
    id: 'fachadas-1',
    url: '/images/products/fachadas/entenda-como-projetar-fachadas-de-casas-com-vidro.jpeg',
    alt: 'Entenda como projetar fachadas de casas com vidro',
    category: 'FACHADAS',
    description: 'Guia de projetos de fachadas em vidro',
  },
  {
    id: 'fachadas-2',
    url: '/images/products/fachadas/fachada-pele-de-vidro.jpg',
    alt: 'Fachada pele de vidro',
    category: 'FACHADAS',
    description: 'Sistema de fachada pele de vidro estrutural',
  },
  {
    id: 'fachadas-3',
    url: '/images/products/fachadas/fachada.jpg',
    alt: 'Fachada',
    category: 'FACHADAS',
    description: 'Fachada comercial em vidro',
  },
  {
    id: 'fachadas-4',
    url: '/images/products/fachadas/tipos-de-vidros-para-fachada.jpg',
    alt: 'Tipos de vidros para fachada',
    category: 'FACHADAS',
    description: 'Diferentes aplicações de vidro em fachadas',
  },
]

/**
 * Vidros diversos - Exemplos de produtos e aplicações
 */
export const GLASS_EXAMPLES: ProductImage[] = [
  {
    id: 'vidros-1',
    url: '/images/products/vidros/cristal-para-puerta-interior.jpg',
    alt: 'Cristal para porta interior',
    category: 'VIDROS',
    description: 'Vidro temperado para porta interna',
  },
  {
    id: 'vidros-2',
    url: '/images/products/vidros/cristaleria-terrassa-2.png',
    alt: 'Produtos de cristaleria',
    category: 'VIDROS',
    description: 'Variedade de produtos de vidro',
  },
  {
    id: 'vidros-3',
    url: '/images/products/vidros/cristales-a-medida-1.png',
    alt: 'Vidros personalizados',
    category: 'VIDROS',
    description: 'Vidros personalizados para diversos projetos',
  },
  {
    id: 'vidros-4',
    url: '/images/products/vidros/cristales-a-medida-2.png',
    alt: 'Vidros sob encomenda',
    category: 'VIDROS',
    description: 'Vidros fabricados sob encomenda',
  },
  {
    id: 'vidros-5',
    url: '/images/products/vidros/cristales-a-medida-en-sabadell1.png',
    alt: 'Cristales a medida en sabadell',
    category: 'VIDROS',
    description: 'Vidros sob medida',
  },
  {
    id: 'vidros-6',
    url: '/images/products/vidros/cristales-a-medida-en-sabadell2.png',
    alt: 'Cristales a medida en sabadell',
    category: 'VIDROS',
    description: 'Vidros sob medida',
  },
  {
    id: 'vidros-7',
    url: '/images/products/vidros/cristales-a-medida-terrassa-2.png',
    alt: 'Cristales a medida terrassa',
    category: 'VIDROS',
    description: 'Vidros sob medida',
  },
  {
    id: 'vidros-8',
    url: '/images/products/vidros/cristales-a-medida.jpg',
    alt: 'Cristales a medida',
    category: 'VIDROS',
    description: 'Vidros temperados cortados sob medida',
  },
  {
    id: 'vidros-9',
    url: '/images/products/vidros/tipos-de-vidro.jpeg',
    alt: 'Tipos de vidro',
    category: 'VIDROS',
    description: 'Guia de tipos de vidro',
  },
  {
    id: 'vidros-10',
    url: '/images/products/vidros/vidracaria-qual-tipo-de-vidro-escolher1.png',
    alt: 'Tipos de vidro disponíveis',
    category: 'VIDROS',
    description: 'Guia visual de tipos de vidro',
  },
  {
    id: 'vidros-11',
    url: '/images/products/vidros/vidro-acidato.jpg',
    alt: 'Vidro acidato',
    category: 'VIDROS',
    description: 'Vidro com acabamento acidato',
  },
  {
    id: 'vidros-12',
    url: '/images/products/vidros/vidro-extra-clear.jpg',
    alt: 'Vidro extra clear',
    category: 'VIDROS',
    description: 'Vidro extra clear de alta transparência',
  },
  {
    id: 'vidros-13',
    url: '/images/products/vidros/vidro-jateado.jpg',
    alt: 'Vidro jateado',
    category: 'VIDROS',
    description: 'Vidro com acabamento jateado',
  },
  {
    id: 'vidros-14',
    url: '/images/products/vidros/vidro-laminado-temperado.jpg',
    alt: 'Vidro laminado temperado',
    category: 'VIDROS',
    description: 'Vidro laminado temperado para segurança',
  },
  {
    id: 'vidros-15',
    url: '/images/products/vidros/vidro-reflectivo.jpg',
    alt: 'Vidro reflectivo',
    category: 'VIDROS',
    description: 'Vidro reflectivo para fachadas',
  },
  {
    id: 'vidros-16',
    url: '/images/products/vidros/vidro-refletivo-champagne-habitat-cebrace.jpg',
    alt: 'Vidro refletivo champagne',
    category: 'VIDROS',
    description: 'Vidro refletivo cor champagne',
  },
  {
    id: 'vidros-17',
    url: '/images/products/vidros/vidro-serigrafado.jpg',
    alt: 'Vidro serigrafado',
    category: 'VIDROS',
    description: 'Vidro serigrafado decorativo',
  },
  {
    id: 'vidros-18',
    url: '/images/products/vidros/vidro-temperado-10mm.jpg',
    alt: 'Vidro temperado 10mm',
    category: 'VIDROS',
    description: 'Vidro temperado 10mm',
  },
  {
    id: 'vidros-19',
    url: '/images/products/vidros/vidro-temperado-8mm.jpg',
    alt: 'Vidro temperado 8mm',
    category: 'VIDROS',
    description: 'Vidro temperado 8mm',
  },
  {
    id: 'vidros-20',
    url: '/images/products/vidros/vidro-temperado.jpg',
    alt: 'Vidro temperado',
    category: 'VIDROS',
    description: 'Vidro temperado para diversas aplicações',
  },
]

/**
 * Imagens gerais - Arquitetura e Aplicações (da pasta gallery/)
 */
export const GENERAL_IMAGES: ProductImage[] = [
  {
    id: 'arquitetura-vidro-1',
    url: '/images/gallery/architecture-1048092-1920-1536x1152.jpg',
    alt: 'Arquitetura com Vidro',
    category: 'GERAL',
    description: 'Projeto arquitetônico moderno com vidro',
  },
  {
    id: 'fachada-comercial-1',
    url: '/images/gallery/building-91228-1920.jpg',
    alt: 'Fachada Comercial em Vidro',
    category: 'GERAL',
    description: 'Edifício comercial com fachada de vidro',
  },
  {
    id: 'shopping-1',
    url: '/images/gallery/shopping-arcade-1214815-1920.jpg',
    alt: 'Shopping com Vidro',
    category: 'GERAL',
    description: 'Galeria de shopping com cobertura em vidro',
  },
  {
    id: 'shopping-mall-1',
    url: '/images/gallery/shopping-mall-906734-1920-1536x1043.jpg',
    alt: 'Shopping Center',
    category: 'GERAL',
    description: 'Interior de shopping com estruturas de vidro',
  },
  {
    id: 'vitrine-1',
    url: '/images/gallery/showcase-g01b6a45e8-1920.jpg',
    alt: 'Vitrine de Vidro',
    category: 'GERAL',
    description: 'Vitrine comercial em vidro temperado',
  },
  {
    id: 'loja-1',
    url: '/images/gallery/store-832188-1920-1536x1024.jpg',
    alt: 'Fachada de Loja',
    category: 'GERAL',
    description: 'Fachada de loja com vidro e iluminação',
  },
  {
    id: 'urban-1',
    url: '/images/gallery/urban-2004494-1920.jpg',
    alt: 'Arquitetura Urbana',
    category: 'GERAL',
    description: 'Projeto urbano com vidro estrutural',
  },
  {
    id: 'adobestock-1',
    url: '/images/gallery/adobestock-342435973-2048x1365.jpeg',
    alt: 'Projeto Arquitetônico Premium',
    category: 'GERAL',
    description: 'Arquitetura premium com vidro',
  },
  {
    id: 'adaptive-1',
    url: '/images/gallery/co-adaptive-b50-photo-peterdressel-07.jpg',
    alt: 'Sistema Adaptativo',
    category: 'GERAL',
    description: 'Sistema de vidro adaptativo',
  },
  {
    id: 'clients-1',
    url: '/images/gallery/clientsc-1536x1024.jpeg',
    alt: 'Projeto para Cliente',
    category: 'GERAL',
    description: 'Exemplo de projeto executado',
  },
]

/**
 * Hardware reference images
 */
export const HARDWARE_IMAGES: ProductImage[] = [
  {
    id: 'ferragens-1',
    url: '/images/products/ferragens/mola-piso.jpg',
    alt: 'Mola piso',
    category: 'FERRAGENS',
    description: 'Mola de piso para porta de vidro',
  },
  {
    id: 'ferragens-2',
    url: '/images/products/ferragens/puxador-tubular.jpg',
    alt: 'Puxador tubular',
    category: 'FERRAGENS',
    description: 'Puxador tubular em inox',
  },
]

/**
 * Kit reference images
 */
export const KIT_IMAGES: ProductImage[] = [
  {
    id: 'kits-1',
    url: '/images/products/kits/kit-basculante.jpg',
    alt: 'Kit basculante',
    category: 'KITS',
    description: 'Kit completo para janela basculante',
  },
  {
    id: 'kits-2',
    url: '/images/products/kits/kit-box-elegance.jpg',
    alt: 'Kit box elegance',
    category: 'KITS',
    description: 'Kit box linha elegance',
  },
  {
    id: 'kits-3',
    url: '/images/products/kits/kit-box-frontal.jpg',
    alt: 'Kit box frontal',
    category: 'KITS',
    description: 'Kit box frontal completo',
  },
  {
    id: 'kits-4',
    url: '/images/products/kits/kit-elegance.jpg',
    alt: 'Kit elegance',
    category: 'KITS',
    description: 'Kit elegance premium',
  },
  {
    id: 'kits-5',
    url: '/images/products/kits/kit-pivotante.jpg',
    alt: 'Kit pivotante',
    category: 'KITS',
    description: 'Kit porta pivotante',
  },
  {
    id: 'kits-6',
    url: '/images/products/kits/kit-porta-pivotante.jpg',
    alt: 'Kit porta pivotante',
    category: 'KITS',
    description: 'Kit completo porta pivotante',
  },
]

/**
 * Service reference images
 */
export const SERVICE_IMAGES: ProductImage[] = [
  {
    id: 'servicos-1',
    url: '/images/products/servicos/emergencia.jpg',
    alt: 'Atendimento emergencial',
    category: 'SERVICOS',
    description: 'Serviço de emergência 24h',
  },
  {
    id: 'servicos-2',
    url: '/images/products/servicos/instalacao.jpg',
    alt: 'Instalação profissional',
    category: 'SERVICOS',
    description: 'Serviço de instalação',
  },
  {
    id: 'servicos-3',
    url: '/images/products/servicos/manutencao-corretiva.jpg',
    alt: 'Manutenção corretiva',
    category: 'SERVICOS',
    description: 'Serviço de manutenção corretiva',
  },
  {
    id: 'servicos-4',
    url: '/images/products/servicos/manutencao-preventiva.jpg',
    alt: 'Manutenção preventiva',
    category: 'SERVICOS',
    description: 'Serviço de manutenção preventiva',
  },
  {
    id: 'servicos-5',
    url: '/images/products/servicos/medicao-tecnica.jpg',
    alt: 'Medição técnica',
    category: 'SERVICOS',
    description: 'Serviço de medição técnica',
  },
  {
    id: 'servicos-6',
    url: '/images/products/servicos/troca-vidro.jpg',
    alt: 'Troca de vidro',
    category: 'SERVICOS',
    description: 'Serviço de troca de vidros',
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
    ...PELICULA_IMAGES,
    ...FACHADA_IMAGES,
    ...GLASS_EXAMPLES,
    ...GENERAL_IMAGES,
    ...HARDWARE_IMAGES,
    ...KIT_IMAGES,
    ...SERVICE_IMAGES,
  ]

  const filtered = allImages.filter((img) => img.category === category)

  // Debug log
  logger.debug('[PRODUCT-IMAGES] getImagesForCategory', {
    requestedCategory: category,
    totalInLibrary: allImages.length,
    foundImages: filtered.length,
  })

  return filtered
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
    ...PELICULA_IMAGES,
    ...FACHADA_IMAGES,
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
