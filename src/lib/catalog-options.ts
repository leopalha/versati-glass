/**
 * VERSATI GLASS - Opções do Catálogo de Produtos
 * Baseado no documento 15_CATALOGO_PRODUTOS_SERVICOS.md
 *
 * Este arquivo centraliza TODAS as opções disponíveis para produtos,
 * garantindo consistência entre Quote Wizard, cadastro de produtos e API.
 */

// ============================================
// CATEGORIAS DE PRODUTOS
// ============================================

export const PRODUCT_CATEGORIES = [
  {
    id: 'BOX',
    name: 'Box para Banheiro',
    description: 'Box de correr, abrir, pivotante e especiais',
    icon: 'Droplets',
    color: 'text-blue-400',
  },
  {
    id: 'ESPELHOS',
    name: 'Espelhos',
    description: 'Lapidados, bisotados, com LED e decorativos',
    icon: 'Square',
    color: 'text-silver-400',
  },
  {
    id: 'VIDROS',
    name: 'Vidros',
    description: 'Temperados, laminados, jateados e especiais',
    icon: 'LayoutGrid',
    color: 'text-cyan-400',
  },
  {
    id: 'PORTAS',
    name: 'Portas de Vidro',
    description: 'Pivotantes, de abrir, correr e articuladas',
    icon: 'DoorOpen',
    color: 'text-amber-400',
  },
  {
    id: 'JANELAS',
    name: 'Janelas de Vidro',
    description: 'Maxim-ar, basculante, correr e pivotante',
    icon: 'PanelTop',
    color: 'text-sky-400',
  },
  {
    id: 'GUARDA_CORPO',
    name: 'Guarda-Corpo',
    description: 'Autoportante, torres de inox, bottons e spider',
    icon: 'Fence',
    color: 'text-orange-400',
  },
  {
    id: 'CORTINAS_VIDRO',
    name: 'Cortinas de Vidro',
    description: 'Envidraçamento de sacadas e varandas',
    icon: 'PanelsTopLeft',
    color: 'text-teal-400',
  },
  {
    id: 'PERGOLADOS',
    name: 'Pergolados e Coberturas',
    description: 'Coberturas de vidro para áreas externas',
    icon: 'Home',
    color: 'text-lime-400',
  },
  {
    id: 'TAMPOS_PRATELEIRAS',
    name: 'Tampos e Prateleiras',
    description: 'Tampos de mesa e prateleiras de vidro',
    icon: 'RectangleHorizontal',
    color: 'text-indigo-400',
  },
  {
    id: 'DIVISORIAS',
    name: 'Divisórias e Painéis',
    description: 'Divisórias de escritório e painéis decorativos',
    icon: 'Columns',
    color: 'text-pink-400',
  },
  {
    id: 'FECHAMENTOS',
    name: 'Fechamentos em Vidro',
    description: 'Fechamento de varanda, área gourmet e piscina',
    icon: 'Grid3x3',
    color: 'text-green-400',
  },
  {
    id: 'FERRAGENS',
    name: 'Ferragens e Acessórios',
    description: 'Dobradiças, puxadores, fechaduras avulsas',
    icon: 'Wrench',
    color: 'text-gray-400',
  },
  {
    id: 'KITS',
    name: 'Kits Completos',
    description: 'Kits prontos para instalação',
    icon: 'Package',
    color: 'text-violet-400',
  },
  {
    id: 'SERVICOS',
    name: 'Serviços',
    description: 'Manutenção, reparos e instalação',
    icon: 'Hammer',
    color: 'text-rose-400',
  },
  {
    id: 'OUTROS',
    name: 'Outros',
    description: 'Produtos e serviços especiais',
    icon: 'MoreHorizontal',
    color: 'text-purple-400',
  },
] as const

export type ProductCategoryId = (typeof PRODUCT_CATEGORIES)[number]['id']

// ============================================
// TIPOS DE VIDRO (Seção 1 do Catálogo)
// ============================================

export const GLASS_TYPES = [
  { id: 'COMUM', name: 'Vidro Comum (Float)', description: 'Base para todos os tipos' },
  {
    id: 'TEMPERADO',
    name: 'Vidro Temperado',
    description: '5x mais resistente, quebra em fragmentos',
  },
  { id: 'LAMINADO', name: 'Vidro Laminado', description: 'Duas lâminas + PVB, segurança máxima' },
  { id: 'LAMINADO_TEMPERADO', name: 'Vidro Laminado Temperado', description: 'Combinação premium' },
  { id: 'JATEADO', name: 'Vidro Jateado', description: 'Superfície fosca, privacidade' },
  { id: 'ACIDATO', name: 'Vidro Acidato (Satinato)', description: 'Fosco liso, fácil limpeza' },
  { id: 'SERIGRAFADO', name: 'Vidro Serigrafado', description: 'Com tinta cerâmica vitrificada' },
  { id: 'IMPRESSO', name: 'Vidro Impresso (Fantasia)', description: 'Com textura decorativa' },
  { id: 'EXTRA_CLEAR', name: 'Vidro Extra Clear', description: 'Sem tonalidade verde' },
  { id: 'REFLECTIVO', name: 'Vidro Reflectivo', description: 'Espelhado, controle solar' },
  { id: 'ARAMADO', name: 'Vidro Aramado', description: 'Com malha de aço' },
  { id: 'CONTROLE_SOLAR', name: 'Vidro de Controle Solar', description: 'Low-E, bloqueia calor' },
  { id: 'INSULADO', name: 'Vidro Insulado (Duplo)', description: 'Câmara de ar, isolamento' },
  { id: 'AUTOLIMPANTE', name: 'Vidro Autolimpante', description: 'Revestimento fotocatalítico' },
] as const

// ============================================
// CORES DE VIDRO
// ============================================

export const GLASS_COLORS = [
  { id: 'INCOLOR', name: 'Incolor', code: 'INC' },
  { id: 'EXTRA_CLEAR', name: 'Extra Clear', code: 'EXC' },
  { id: 'VERDE', name: 'Verde', code: 'VD' },
  { id: 'FUME', name: 'Fumê', code: 'FM' },
  { id: 'BRONZE', name: 'Bronze', code: 'BZ' },
  { id: 'REFLECTA_PRATA', name: 'Reflecta Prata', code: 'RP' },
  { id: 'REFLECTA_BRONZE', name: 'Reflecta Bronze', code: 'RB' },
] as const

// ============================================
// CORES DE ESPELHO
// ============================================

export const MIRROR_COLORS = [
  { id: 'CRISTAL', name: 'Cristal (Prata)', description: 'Tradicional, reflexo real' },
  { id: 'FUME', name: 'Fumê', description: 'Cinza, reflexo escurecido' },
  { id: 'BRONZE', name: 'Bronze', description: 'Dourado, tom quente' },
  { id: 'ROSA', name: 'Rosa', description: 'Rosê, feminino' },
  { id: 'AZUL', name: 'Azul', description: 'Frio, moderno' },
] as const

// ============================================
// TIPOS DE MATERIAL (Phase 4 - Alternativas ao vidro)
// ============================================

/**
 * Materiais disponíveis para diferentes categorias de produtos
 * Baseado no mercado de vidraçaria e serralheria
 */
export const MATERIAL_TYPES = [
  // VIDROS (padrão para maioria dos produtos)
  {
    id: 'VIDRO_TEMPERADO',
    name: 'Vidro Temperado',
    description: '5x mais resistente, segurança',
    categories: ['BOX', 'PORTAS', 'JANELAS', 'GUARDA_CORPO', 'DIVISORIAS', 'FECHAMENTOS', 'TAMPOS_PRATELEIRAS', 'VIDROS'],
  },
  {
    id: 'VIDRO_LAMINADO',
    name: 'Vidro Laminado',
    description: 'Máxima segurança, não estilhaça',
    categories: ['PERGOLADOS', 'GUARDA_CORPO', 'DIVISORIAS', 'TAMPOS_PRATELEIRAS', 'VIDROS'],
  },
  {
    id: 'VIDRO_COMUM',
    name: 'Vidro Comum (Float)',
    description: 'Econômico, uso interno',
    categories: ['DIVISORIAS', 'VIDROS'],
  },

  // POLICARBONATO (alternativa resistente)
  {
    id: 'POLICARBONATO_COMPACTO',
    name: 'Policarbonato Compacto',
    description: '6mm, 8mm, 10mm - resistente a impactos',
    categories: ['PERGOLADOS', 'DIVISORIAS', 'FECHAMENTOS', 'PORTAS', 'JANELAS'],
    thicknessOptions: ['6mm', '8mm', '10mm'],
  },
  {
    id: 'POLICARBONATO_ALVEOLAR',
    name: 'Policarbonato Alveolar',
    description: '6mm, 10mm, 16mm - isolamento térmico',
    categories: ['PERGOLADOS', 'FECHAMENTOS'],
    thicknessOptions: ['6mm', '10mm', '16mm'],
  },

  // ACRÍLICO (alternativa econômica)
  {
    id: 'ACRILICO',
    name: 'Acrílico (PMMA)',
    description: 'Transparente, leve, econômico',
    categories: ['DIVISORIAS', 'TAMPOS_PRATELEIRAS', 'PERGOLADOS'],
    thicknessOptions: ['3mm', '5mm', '8mm', '10mm'],
  },

  // TELA/REDE (proteção sem vedação)
  {
    id: 'TELA_REDE',
    name: 'Tela/Rede de Proteção',
    description: 'Proteção contra quedas, ventilação',
    categories: ['FECHAMENTOS'],
  },

  // ESTRUTURAL (sem material de vedação)
  {
    id: 'ESTRUTURAL_ONLY',
    name: 'Apenas Estrutura',
    description: 'Perfis e ferragens sem vedação',
    categories: ['BOX', 'PORTAS', 'JANELAS', 'GUARDA_CORPO', 'DIVISORIAS', 'FECHAMENTOS', 'PERGOLADOS'],
  },
] as const

/**
 * Helper: Obter materiais disponíveis para uma categoria
 */
export function getMaterialsForCategory(category: string) {
  return MATERIAL_TYPES.filter((mat) => (mat.categories as readonly string[]).includes(category))
}

// ============================================
// ESPESSURAS DE VIDRO
// ============================================

export const GLASS_THICKNESSES = [
  { id: '2MM', value: '2mm', numericValue: 2 },
  { id: '3MM', value: '3mm', numericValue: 3 },
  { id: '4MM', value: '4mm', numericValue: 4 },
  { id: '5MM', value: '5mm', numericValue: 5 },
  { id: '6MM', value: '6mm', numericValue: 6 },
  { id: '8MM', value: '8mm', numericValue: 8 },
  { id: '10MM', value: '10mm', numericValue: 10 },
  { id: '12MM', value: '12mm', numericValue: 12 },
  { id: '15MM', value: '15mm', numericValue: 15 },
  { id: '19MM', value: '19mm', numericValue: 19 },
] as const

// ============================================
// ESPESSURAS DE ESPELHO
// ============================================

export const MIRROR_THICKNESSES = [
  { id: '3MM', value: '3mm', application: 'Pequenos espelhos, molduras' },
  { id: '4MM', value: '4mm', application: 'Padrão banheiro/decoração' },
  { id: '5MM', value: '5mm', application: 'Grandes dimensões' },
  { id: '6MM', value: '6mm', application: 'Portas/painéis' },
] as const

// ============================================
// ACABAMENTOS DE BORDA (VIDRO/ESPELHO)
// ============================================

export const EDGE_FINISHES = [
  { id: 'LISO', name: 'Liso', description: 'Sem acabamento especial' },
  { id: 'LAPIDADO', name: 'Lapidado', description: 'Borda reta polida 90°' },
  { id: 'LAPIDADO_OG', name: 'Lapidado OG', description: 'Borda levemente arredondada' },
  { id: 'BISOTE', name: 'Bisotê', description: 'Chanfro decorativo' },
  { id: 'CANTO_CHANFRADO', name: 'Canto Chanfrado', description: 'Quinas cortadas' },
  { id: 'CANTO_MOEDA', name: 'Canto Moeda', description: 'Quinas arredondadas' },
  { id: 'CANTO_GARRAFA', name: 'Canto Garrafa', description: 'Quinas muito arredondadas' },
] as const

// ============================================
// LARGURAS DE BISOTÊ
// ============================================

export const BISOTE_WIDTHS = [
  { id: '0.5CM', value: '0,5cm', description: 'Sutil' },
  { id: '1CM', value: '1,0cm', description: 'Discreto' },
  { id: '2CM', value: '2,0cm', description: 'Padrão' },
  { id: '3CM', value: '3,0cm', description: 'Marcante' },
  { id: '4CM', value: '4,0cm', description: 'Luxo' },
] as const

// ============================================
// MODELOS DE BOX (Seção 2 do Catálogo)
// ============================================

export const BOX_MODELS = [
  { id: 'FRONTAL', name: 'Box Frontal (Reto)', description: 'Folha fixa + porta de correr' },
  { id: 'CANTO', name: 'Box de Canto (Em L)', description: 'Duas laterais com vidro' },
  { id: 'ABRIR', name: 'Box de Abrir', description: 'Porta abre para fora' },
  { id: 'ARTICULADO', name: 'Box Articulado (Sanfonado)', description: 'Porta dobra sobre si' },
  { id: 'PIVOTANTE', name: 'Box Pivotante', description: 'Porta gira em eixo' },
  { id: 'WALK_IN', name: 'Box Walk-In', description: 'Sem porta, apenas painéis fixos' },
  { id: 'BANHEIRA', name: 'Box para Banheira', description: 'Modelos específicos' },
] as const

// ============================================
// LINHAS DE ACABAMENTO BOX
// ============================================

export const BOX_FINISH_LINES = [
  {
    id: 'TRADICIONAL',
    name: 'Linha Tradicional',
    description: 'Alumínio tubular, roldanas ocultas',
  },
  { id: 'ELEGANCE', name: 'Linha Elegance', description: 'Roldana aparente decorativa' },
  { id: 'PREMIUM', name: 'Linha Premium', description: '100% Inox maciço' },
  { id: 'CRISTAL', name: 'Linha Cristal', description: 'Dobradiças, sem trilhos' },
] as const

// ============================================
// CORES DE FERRAGEM/ALUMÍNIO
// ============================================

export const HARDWARE_COLORS = [
  { id: 'BRANCO', name: 'Branco', code: 'BC' },
  { id: 'PRETO', name: 'Preto', code: 'PT' },
  { id: 'FOSCO', name: 'Fosco/Natural', code: 'FO' },
  { id: 'CROMADO', name: 'Cromado', code: 'CR' },
  { id: 'BRONZE', name: 'Bronze', code: 'BZ' },
  { id: 'DOURADO', name: 'Dourado', code: 'DR' },
  { id: 'CHAMPANHE', name: 'Champanhe', code: 'CH' },
  { id: 'INOX_POLIDO', name: 'Inox Polido', code: 'IP' },
  { id: 'INOX_ESCOVADO', name: 'Inox Escovado', code: 'IE' },
  { id: 'PVD_BLACK', name: 'PVD Black', code: 'PB' },
  { id: 'PVD_GOLD', name: 'PVD Gold', code: 'PG' },
  { id: 'PVD_ROSE', name: 'PVD Rose', code: 'PR' },
] as const

// ============================================
// SISTEMAS DE CORTINA DE VIDRO
// ============================================

export const GLASS_CURTAIN_SYSTEMS = [
  { id: 'EUROPEU', name: 'Sistema Europeu (Pivotante)', description: 'Abertura 100%, NBR 16259' },
  { id: 'STANLEY', name: 'Sistema Stanley', description: 'Trilhos múltiplos, abertura parcial' },
  { id: 'VERSATIK', name: 'Sistema Versatik', description: 'Laterais fixas, central móvel' },
  { id: 'TETO', name: 'Sistema de Teto', description: 'Cobertura retrátil horizontal' },
] as const

// ============================================
// SISTEMAS DE GUARDA-CORPO
// ============================================

export const GUARD_RAIL_SYSTEMS = [
  { id: 'AUTOPORTANTE', name: 'Autoportante (Embutido)', description: 'Perfil U no piso' },
  { id: 'TORRES', name: 'Torres/Pinças de Inox', description: 'Torres verticais com pinças' },
  { id: 'BOTTONS', name: 'Bottons/Conectores', description: 'Botões pontuais de inox' },
  { id: 'SPIDER', name: 'Spider (Aranha)', description: 'Grampos articulados' },
  { id: 'MONTANTES', name: 'Montantes com Vidro', description: 'Colunas verticais + vidro' },
  { id: 'GRADIL', name: 'Gradil de Inox', description: 'Tubos sem vidro' },
] as const

// ============================================
// TIPOS DE PORTA DE VIDRO
// ============================================

export const DOOR_TYPES = [
  { id: 'PIVOTANTE', name: 'Porta Pivotante', description: 'Gira em eixo vertical' },
  { id: 'ABRIR', name: 'Porta de Abrir (Giro)', description: 'Dobradiças laterais' },
  { id: 'CORRER', name: 'Porta de Correr', description: 'Desliza sobre trilho' },
  { id: 'CAMARAO', name: 'Porta Camarão (Articulada)', description: 'Dobra sobre si' },
  { id: 'AUTOMATICA', name: 'Porta Automática', description: 'Abertura motorizada' },
] as const

// ============================================
// TIPOS DE JANELA DE VIDRO
// ============================================

export const WINDOW_TYPES = [
  { id: 'MAXIM_AR', name: 'Janela Maxim-Ar', description: 'Projeta inferior para fora' },
  { id: 'BASCULANTE', name: 'Janela Basculante', description: 'Pivota no eixo horizontal' },
  { id: 'CORRER', name: 'Janela de Correr', description: 'Folhas deslizam horizontalmente' },
  { id: 'GUILHOTINA', name: 'Janela Guilhotina', description: 'Folhas deslizam verticalmente' },
  { id: 'PIVOTANTE', name: 'Janela Pivotante', description: 'Gira em eixo central' },
  { id: 'PROJETANTE', name: 'Janela Projetante', description: 'Abre para fora, topo fixo' },
] as const

// ============================================
// TIPOS DE ESPELHO
// ============================================

export const MIRROR_TYPES = [
  { id: 'LAPIDADO', name: 'Espelho Lapidado', description: 'Bordas retas e polidas' },
  { id: 'BISOTADO', name: 'Espelho Bisotado', description: 'Bordas chanfradas' },
  { id: 'LED', name: 'Espelho com LED', description: 'Iluminação integrada' },
  { id: 'DECORATIVO', name: 'Espelho Decorativo', description: 'Formas especiais' },
  { id: 'JATEADO', name: 'Espelho Jateado', description: 'Com áreas foscas' },
  { id: 'CAMARIM', name: 'Espelho Camarim', description: 'Estilo Hollywood com lâmpadas' },
] as const

// ============================================
// TEMPERATURA DE COR LED
// ============================================

export const LED_TEMPERATURES = [
  { id: '3000K', name: '3000K - Luz Quente', description: 'Amarela, aconchegante' },
  { id: '4000K', name: '4000K - Luz Neutra', description: 'Ideal para maquiagem' },
  { id: '6000K', name: '6000K - Luz Fria', description: 'Branca, moderna' },
] as const

// ============================================
// FORMATOS DE ESPELHO/TAMPO
// ============================================

export const SHAPES = [
  { id: 'RETANGULAR', name: 'Retangular' },
  { id: 'QUADRADO', name: 'Quadrado' },
  { id: 'REDONDO', name: 'Redondo' },
  { id: 'OVAL', name: 'Oval' },
  { id: 'ORGANICO', name: 'Orgânico' },
  { id: 'ESPECIAL', name: 'Especial (sob medida)' },
] as const

// ============================================
// TIPOS DE SERVIÇO
// ============================================

export const SERVICE_TYPES = [
  { id: 'MEDICAO', name: 'Medição Técnica', description: 'Avaliação in loco' },
  { id: 'PROJETO', name: 'Projeto Personalizado', description: 'Desenho técnico e especificações' },
  { id: 'INSTALACAO', name: 'Instalação Profissional', description: 'Equipe especializada' },
  { id: 'MANUTENCAO_PREVENTIVA', name: 'Manutenção Preventiva', description: 'Limpeza e ajustes' },
  { id: 'MANUTENCAO_CORRETIVA', name: 'Manutenção Corretiva', description: 'Reparos e trocas' },
  { id: 'REPOSICAO', name: 'Reposição de Vidros', description: 'Substituição de peças' },
  { id: 'EMERGENCIA', name: 'Serviço 24 Horas', description: 'Atendimento emergencial' },
] as const

// ============================================
// MÉTODOS DE INSTALAÇÃO DE ESPELHO
// ============================================

export const MIRROR_INSTALLATION_METHODS = [
  { id: 'COLA', name: 'Fixa-espelho (cola)', description: 'Adesivo específico neutro' },
  { id: 'BOTOES', name: 'Botões', description: 'Fixação pontual decorativa' },
  { id: 'PERFIL', name: 'Perfil de alumínio', description: 'Moldura de suporte' },
  { id: 'PARAFUSOS', name: 'Parafusos', description: 'Com arruelas cromadas' },
  { id: 'PENDURADOR', name: 'Pendurador', description: 'Corrente ou cabo' },
] as const

// ============================================
// FERRAGENS - CÓDIGOS PRINCIPAIS
// ============================================

export const HARDWARE_CODES = {
  // Dobradiças
  DOBRADIÇA_SUPERIOR: '1101',
  DOBRADIÇA_SUPERIOR_JUMBO: '1101J',
  DOBRADIÇA_INFERIOR: '1103',
  DOBRADIÇA_INFERIOR_JUMBO: '1103J',
  SUPORTE_BASCULANTE_GRANDE: '1110',
  SUPORTE_BASCULANTE_PEQUENO: '1230',

  // Pivôs
  PIVO_INFERIOR: '1013',
  PIVO_SUPERIOR: '1201',
  PIVO_SUPERIOR_AJUSTAVEL: '1201A',

  // Fechaduras e Trincos
  TRINCO_SIMPLES: '1500',
  FECHADURA_CENTRAL: '1520',
  TRINCO_BASCULANTE: '1523',
  LIVRE_OCUPADO: '1560',
  TRINCO_JANELA_CORRER: '1800',

  // Contra-fechaduras
  CONTRA_VIDRO_ALVENARIA: '1504',
  CONTRA_VIDRO_VIDRO: '1506',
  GUIA_DESCANSO: '1589',
} as const

// ============================================
// TIPOS DE VIDRO IMPRESSO (FANTASIA)
// ============================================

export const GLASS_TEXTURES = [
  { id: 'MINI_BOREAL', name: 'Mini Boreal', description: 'Pequenas ondulações' },
  { id: 'CANELADO', name: 'Canelado', description: 'Linhas verticais' },
  { id: 'PONTILHADO', name: 'Pontilhado', description: 'Pequenos pontos' },
  { id: 'MARTELADO', name: 'Martelado', description: 'Efeito martelado' },
  { id: 'QUADRATO', name: 'Quadrato', description: 'Padrão quadriculado' },
  { id: 'ESTRIADO', name: 'Estriado', description: 'Listras finas' },
] as const

// ============================================
// TAMANHOS DE HASTE (JANELA MAXIM-AR)
// ============================================

export const MAXIM_AR_HASTE_SIZES = [
  { id: '30CM', name: '30cm', description: 'Janelas pequenas' },
  { id: '40CM', name: '40cm', description: 'Janelas médias' },
  { id: '50CM', name: '50cm', description: 'Janelas grandes' },
] as const

// ============================================
// POSIÇÃO DO PIVÔ (PORTAS PIVOTANTES)
// ============================================

export const PIVOT_POSITIONS = [
  { id: 'CENTRAL', name: 'Pivô Central', description: 'Eixo no centro da porta' },
  { id: 'DESLOCADO', name: 'Pivô Deslocado', description: 'Eixo a 1/3 da largura, economiza espaço' },
] as const

// ============================================
// TIPOS DE PUXADOR
// ============================================

export const HANDLE_TYPES = [
  { id: 'TUBULAR_30', name: 'Tubular 30x20cm', size: '30x20cm' },
  { id: 'TUBULAR_40', name: 'Tubular 40x30cm', size: '40x30cm' },
  { id: 'TUBULAR_60', name: 'Tubular 60x40cm', size: '60x40cm' },
  { id: 'ALCA_15', name: 'Alça Simples 15cm', size: '15cm' },
  { id: 'ALCA_20', name: 'Alça Simples 20cm', size: '20cm' },
  { id: 'H_40', name: 'H Horizontal 40cm', size: '40cm' },
  { id: 'H_60', name: 'H Horizontal 60cm', size: '60cm' },
  { id: 'EMBUTIDO', name: 'Embutido no Vidro', size: 'Recorte especial' },
] as const

// ============================================
// TIPOS DE FECHADURA
// ============================================

export const LOCK_TYPES = [
  { id: 'CENTRAL', name: 'Fechadura Central', description: 'Com chave', code: '1520' },
  { id: 'LIVRE_OCUPADO', name: 'Livre/Ocupado', description: 'Para banheiro', code: '1560' },
  { id: 'SEM_FECHADURA', name: 'Sem Fechadura', description: 'Apenas puxador' },
] as const

// ============================================
// TIPOS DE CORRIMÃO (GUARDA-CORPO)
// ============================================

export const HANDRAIL_TYPES = [
  { id: 'INOX_50MM', name: 'Inox Ø 50mm', description: 'Tubo redondo padrão' },
  { id: 'INOX_40MM', name: 'Inox Ø 40mm', description: 'Tubo fino' },
  { id: 'INOX_RETANGULAR', name: 'Inox Retangular 40x20mm', description: 'Perfil retangular' },
  { id: 'MADEIRA_INOX', name: 'Madeira + Inox', description: 'Combinação premium' },
  { id: 'SEM_CORRIMAO', name: 'Sem Corrimão', description: 'Apenas vidro' },
] as const

// ============================================
// TIPOS DE ESTRUTURA (PERGOLADOS)
// ============================================

export const PERGOLA_STRUCTURES = [
  { id: 'MADEIRA', name: 'Madeira', description: 'Clássico, requer tratamento' },
  { id: 'ALUMINIO', name: 'Alumínio', description: 'Leve, resistente, baixa manutenção' },
  { id: 'ACO', name: 'Aço', description: 'Resistente, requer pintura' },
  { id: 'INOX', name: 'Aço Inox', description: 'Premium, zero manutenção' },
] as const

// ============================================
// SISTEMAS DE FIXAÇÃO (PERGOLADOS)
// ============================================

export const PERGOLA_FIXING_SYSTEMS = [
  { id: 'APOIADO', name: 'Apoiado em Perfil', description: 'Vidro apoia em calha de alumínio' },
  { id: 'ENGASTADO', name: 'Engastado', description: 'Vidro encaixado em perfil U' },
  { id: 'SPIDER', name: 'Spider', description: 'Fixação por grampos' },
  { id: 'PERFIL_ESTRUTURAL', name: 'Perfil Estrutural', description: 'Sistema autoportante' },
] as const

// ============================================
// INCLINAÇÕES (PERGOLADOS)
// ============================================

export const PERGOLA_SLOPES = [
  { id: '5', name: '5%', description: 'Mínimo para escoamento' },
  { id: '10', name: '10%', description: 'Ideal para autolimpeza' },
  { id: '15', name: '15%+', description: 'Regiões muito chuvosas' },
] as const

// ============================================
// TIPOS DE SUPORTE (PRATELEIRAS)
// ============================================

export const SHELF_SUPPORT_TYPES = [
  { id: 'CANTO', name: 'Suporte de Canto', description: 'Fixação em L' },
  { id: 'PELICANO', name: 'Suporte Pelicano', description: 'Abraça a prateleira' },
  { id: 'INVISIVEL', name: 'Suporte Invisível', description: 'Embutido na parede' },
  { id: 'DECORATIVO', name: 'Suporte Decorativo', description: 'Design variado' },
] as const

// ============================================
// MATERIAL DE SUPORTE (PRATELEIRAS)
// ============================================

export const SHELF_SUPPORT_MATERIALS = [
  { id: 'INOX', name: 'Inox' },
  { id: 'ALUMINIO', name: 'Alumínio' },
  { id: 'CROMADO', name: 'Zamak Cromado' },
] as const

// ============================================
// SISTEMAS DE DIVISÓRIAS
// ============================================

export const PARTITION_SYSTEMS = [
  { id: 'PISO_TETO', name: 'Piso-Teto', description: 'Estrutura completa' },
  { id: 'MEIA_ALTURA', name: 'Meia Altura', description: 'Até 1,50m' },
  { id: 'AUTOPORTANTE', name: 'Autoportante', description: 'Sem fixação superior' },
  { id: 'COM_PORTA', name: 'Com Porta Integrada', description: 'Divisória + porta' },
] as const

// ============================================
// TIPOS DE FECHAMENTO
// ============================================

export const CLOSING_TYPES = [
  { id: 'VARANDA', name: 'Fechamento de Varanda', description: 'Envidraçamento residencial' },
  { id: 'AREA_GOURMET', name: 'Área Gourmet', description: 'Espaço de lazer' },
  { id: 'PISCINA', name: 'Fechamento de Piscina', description: 'Área de piscina' },
  { id: 'FACHADA', name: 'Fachada', description: 'Fachada comercial/residencial' },
] as const

// ============================================
// SISTEMAS DE FECHAMENTO
// ============================================

export const CLOSING_SYSTEMS = [
  { id: 'CORTINA_VIDRO', name: 'Cortina de Vidro', description: 'Folhas articuladas' },
  { id: 'CAIXILHO_FIXO', name: 'Caixilho Fixo', description: 'Sem abertura' },
  { id: 'JANELA_INTEGRADA', name: 'Com Janela Integrada', description: 'Abertura parcial' },
  { id: 'PORTAS_CORRER', name: 'Portas de Correr', description: 'Deslizante' },
  { id: 'PORTAS_CAMARAO', name: 'Portas Camarão', description: 'Articulada dobrável' },
] as const

// ============================================
// URGÊNCIA DE SERVIÇO
// ============================================

export const SERVICE_URGENCY = [
  { id: 'NORMAL', name: 'Normal', description: '3-5 dias úteis' },
  { id: 'URGENTE', name: 'Urgente', description: '24-48 horas' },
  { id: 'EMERGENCIAL', name: 'Emergencial 24h', description: 'Atendimento imediato' },
] as const

// ============================================
// HELPER: Obter opções por categoria
// ============================================

export function getOptionsForCategory(categoryId: string) {
  switch (categoryId) {
    case 'BOX':
      return {
        models: BOX_MODELS,
        finishLines: BOX_FINISH_LINES,
        glassTypes: GLASS_TYPES.filter((g) =>
          ['TEMPERADO', 'JATEADO', 'ACIDATO', 'SERIGRAFADO'].includes(g.id)
        ),
        glassColors: GLASS_COLORS,
        thicknesses: GLASS_THICKNESSES.filter((t) => ['8MM', '10MM'].includes(t.id)),
        hardwareColors: HARDWARE_COLORS,
      }
    case 'ESPELHOS':
      return {
        types: MIRROR_TYPES,
        colors: MIRROR_COLORS,
        thicknesses: MIRROR_THICKNESSES,
        finishes: EDGE_FINISHES.filter((f) => ['LAPIDADO', 'BISOTE'].includes(f.id)),
        bisoteWidths: BISOTE_WIDTHS,
        ledTemperatures: LED_TEMPERATURES,
        shapes: SHAPES,
        installationMethods: MIRROR_INSTALLATION_METHODS,
      }
    case 'VIDROS':
      return {
        types: GLASS_TYPES,
        colors: GLASS_COLORS,
        thicknesses: GLASS_THICKNESSES,
        finishes: EDGE_FINISHES,
      }
    case 'PORTAS':
      return {
        types: DOOR_TYPES,
        glassTypes: GLASS_TYPES.filter((g) =>
          ['TEMPERADO', 'JATEADO', 'ACIDATO', 'SERIGRAFADO'].includes(g.id)
        ),
        glassColors: GLASS_COLORS,
        thicknesses: GLASS_THICKNESSES.filter((t) => ['8MM', '10MM', '12MM'].includes(t.id)),
        hardwareColors: HARDWARE_COLORS,
        pivotPositions: PIVOT_POSITIONS,
        handleTypes: HANDLE_TYPES,
        lockTypes: LOCK_TYPES,
      }
    case 'JANELAS':
      return {
        types: WINDOW_TYPES,
        glassTypes: GLASS_TYPES.filter((g) => ['TEMPERADO', 'IMPRESSO'].includes(g.id)),
        glassColors: GLASS_COLORS,
        thicknesses: GLASS_THICKNESSES.filter((t) => ['6MM', '8MM'].includes(t.id)),
        hardwareColors: HARDWARE_COLORS,
        glassTextures: GLASS_TEXTURES,
        hasteSizes: MAXIM_AR_HASTE_SIZES,
      }
    case 'GUARDA_CORPO':
      return {
        systems: GUARD_RAIL_SYSTEMS,
        glassTypes: GLASS_TYPES.filter((g) =>
          ['LAMINADO', 'LAMINADO_TEMPERADO', 'TEMPERADO'].includes(g.id)
        ),
        glassColors: GLASS_COLORS,
        thicknesses: GLASS_THICKNESSES.filter((t) =>
          ['10MM', '12MM', '16MM', '19MM'].includes(t.id)
        ),
        hardwareColors: HARDWARE_COLORS.filter(
          (c) => c.id.includes('INOX') || c.id.includes('PVD')
        ),
        handrailTypes: HANDRAIL_TYPES,
      }
    case 'CORTINAS_VIDRO':
      return {
        systems: GLASS_CURTAIN_SYSTEMS,
        glassColors: GLASS_COLORS,
        thicknesses: GLASS_THICKNESSES.filter((t) => ['8MM', '10MM'].includes(t.id)),
        hardwareColors: HARDWARE_COLORS,
      }
    case 'PERGOLADOS':
      return {
        glassTypes: GLASS_TYPES.filter((g) =>
          ['LAMINADO', 'LAMINADO_TEMPERADO', 'CONTROLE_SOLAR', 'AUTOLIMPANTE'].includes(g.id)
        ),
        glassColors: GLASS_COLORS,
        thicknesses: GLASS_THICKNESSES.filter((t) => ['8MM', '10MM', '12MM'].includes(t.id)),
        structures: PERGOLA_STRUCTURES,
        fixingSystems: PERGOLA_FIXING_SYSTEMS,
        slopes: PERGOLA_SLOPES,
      }
    case 'TAMPOS_PRATELEIRAS':
      return {
        glassTypes: GLASS_TYPES.filter((g) =>
          ['COMUM', 'TEMPERADO', 'EXTRA_CLEAR', 'SERIGRAFADO', 'LAMINADO'].includes(g.id)
        ),
        glassColors: GLASS_COLORS,
        thicknesses: GLASS_THICKNESSES,
        finishes: EDGE_FINISHES,
        shapes: SHAPES,
        shelfSupportTypes: SHELF_SUPPORT_TYPES,
        shelfSupportMaterials: SHELF_SUPPORT_MATERIALS,
      }
    case 'DIVISORIAS':
      return {
        glassTypes: GLASS_TYPES.filter((g) =>
          ['TEMPERADO', 'JATEADO', 'SERIGRAFADO', 'LAMINADO'].includes(g.id)
        ),
        glassColors: GLASS_COLORS,
        thicknesses: GLASS_THICKNESSES.filter((t) => ['8MM', '10MM', '12MM'].includes(t.id)),
        systems: PARTITION_SYSTEMS,
      }
    case 'FECHAMENTOS':
      return {
        glassTypes: GLASS_TYPES.filter((g) => ['TEMPERADO', 'LAMINADO'].includes(g.id)),
        glassColors: GLASS_COLORS,
        thicknesses: GLASS_THICKNESSES.filter((t) => ['8MM', '10MM'].includes(t.id)),
        hardwareColors: HARDWARE_COLORS,
        closingTypes: CLOSING_TYPES,
        closingSystems: CLOSING_SYSTEMS,
      }
    case 'SERVICOS':
      return {
        types: SERVICE_TYPES,
        urgency: SERVICE_URGENCY,
      }
    default:
      return {
        glassTypes: GLASS_TYPES,
        glassColors: GLASS_COLORS,
        thicknesses: GLASS_THICKNESSES,
        hardwareColors: HARDWARE_COLORS,
      }
  }
}
