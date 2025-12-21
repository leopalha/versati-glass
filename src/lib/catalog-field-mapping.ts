/**
 * MAPEAMENTO DE CAMPOS POR CATEGORIA
 *
 * Define quais campos devem ser exibidos, ocultados ou condicionalmente mostrados
 * para cada categoria de produto no Quote Wizard.
 *
 * Baseado em análise profunda de 78 produtos em 14 categorias.
 */

export type FieldName =
  | 'width'
  | 'height'
  | 'thickness'
  | 'glassType'
  | 'glassColor'
  | 'hardwareColor'
  | 'model'
  | 'finishLine'
  | 'finish'
  | 'shape'
  | 'pivotPosition'
  | 'handleType'
  | 'lockType'
  | 'hasteSize'
  | 'hasHandrail'
  | 'handrailType'
  | 'ledTemp'
  | 'bisoteWidth'
  | 'glassTexture'
  | 'pergolaStructure'
  | 'pergolaFixing'
  | 'pergolaSlope'
  | 'partitionSystem'
  | 'partitionHeight'
  | 'shelfType'
  | 'shelfSupportType'
  | 'shelfSupportMaterial'
  | 'closingType'
  | 'closingSystem'
  | 'serviceUrgency'
  | 'serviceType'
  | 'numberOfLeaves'
  | 'premiumMaterial'
  | 'premiumFinish'
  | 'numberOfTracks'
  | 'motorType'
  | 'towerHeight'
  | 'buttonSize'
  | 'spiderPoints'
  | 'jateamentoType'
  | 'serigrafadoPadrao'
  | 'serigrafadoCor'
  | 'molduraType'
  | 'quantidadeLampadas'
  | 'kitContents'
  | 'molaCapacidade'
  | 'puxadorTamanho'
  | 'repairType'

export type ConditionalRule = {
  field: FieldName
  value: string | boolean
  showFields: FieldName[]
}

export type CategoryFieldConfig = {
  // Campos sempre visíveis e obrigatórios
  required: FieldName[]

  // Campos sempre visíveis mas opcionais
  optional?: FieldName[]

  // Regras condicionais: SE campo X = valor Y, ENTÃO mostrar campos Z
  conditional?: ConditionalRule[]

  // Campos que NUNCA devem aparecer para esta categoria
  hidden: FieldName[]

  // Validações específicas (espessuras permitidas, etc)
  validations?: {
    thicknessOptions?: number[]
    minWidth?: number
    maxWidth?: number
    minHeight?: number
    maxHeight?: number
    requiredGlassType?: string
    requiredHardware?: string
  }
}

/**
 * MAPEAMENTO COMPLETO POR CATEGORIA
 */
export const CATEGORY_FIELD_MAP: Record<string, CategoryFieldConfig> = {
  /**
   * BOX PARA BANHEIRO (13 produtos)
   * Todos têm vidro obrigatoriamente
   */
  BOX: {
    required: [
      'width',
      'height',
      'thickness',
      'glassType',
      'glassColor',
      'hardwareColor',
      'model',
      'finishLine',
    ],
    optional: ['finish'],
    conditional: [
      {
        field: 'model',
        value: 'ARTICULADO',
        showFields: ['numberOfLeaves'],
      },
      {
        field: 'finishLine',
        value: 'PREMIUM',
        showFields: ['premiumMaterial'],
      },
    ],
    hidden: [
      'pivotPosition',
      'handleType',
      'lockType',
      'hasteSize',
      'hasHandrail',
      'handrailType',
      'ledTemp',
      'bisoteWidth',
      'shape',
      'glassTexture',
      'pergolaStructure',
      'pergolaFixing',
      'pergolaSlope',
      'partitionSystem',
      'partitionHeight',
      'shelfType',
      'shelfSupportType',
      'shelfSupportMaterial',
      'closingType',
      'closingSystem',
      'serviceUrgency',
      'serviceType',
      'numberOfTracks',
      'motorType',
      'towerHeight',
      'buttonSize',
      'spiderPoints',
      'jateamentoType',
      'serigrafadoPadrao',
      'serigrafadoCor',
      'molduraType',
      'quantidadeLampadas',
      'kitContents',
      'molaCapacidade',
      'puxadorTamanho',
      'repairType',
    ],
    validations: {
      thicknessOptions: [8, 10],
    },
  },

  /**
   * PORTAS DE VIDRO (6 produtos)
   * Todas têm vidro obrigatoriamente
   */
  PORTAS: {
    required: [
      'width',
      'height',
      'thickness',
      'glassType',
      'glassColor',
      'hardwareColor',
      'model',
      'handleType',
      'lockType',
    ],
    optional: ['finish'],
    conditional: [
      {
        field: 'model',
        value: 'PIVOTANTE',
        showFields: ['pivotPosition'],
      },
      {
        field: 'model',
        value: 'PIVOTANTE_PREMIUM',
        showFields: ['pivotPosition', 'premiumFinish'],
      },
      {
        field: 'model',
        value: 'CAMARAO',
        showFields: ['numberOfLeaves'],
      },
    ],
    hidden: [
      'finishLine',
      'hasteSize',
      'hasHandrail',
      'handrailType',
      'ledTemp',
      'bisoteWidth',
      'shape',
      'glassTexture',
      'pergolaStructure',
      'pergolaFixing',
      'pergolaSlope',
      'partitionSystem',
      'partitionHeight',
      'shelfType',
      'shelfSupportType',
      'shelfSupportMaterial',
      'closingType',
      'closingSystem',
      'serviceUrgency',
      'serviceType',
      'numberOfTracks',
      'motorType',
      'towerHeight',
      'buttonSize',
      'spiderPoints',
      'jateamentoType',
      'serigrafadoPadrao',
      'serigrafadoCor',
      'molduraType',
      'quantidadeLampadas',
      'kitContents',
      'molaCapacidade',
      'puxadorTamanho',
      'repairType',
    ],
    validations: {
      thicknessOptions: [8, 10],
    },
  },

  /**
   * JANELAS DE VIDRO (5 produtos)
   * Todas têm vidro obrigatoriamente
   */
  JANELAS: {
    required: ['width', 'height', 'thickness', 'glassType', 'glassColor', 'hardwareColor', 'model'],
    optional: ['finish'],
    conditional: [
      {
        field: 'model',
        value: 'MAXIM_AR',
        showFields: ['hasteSize'],
      },
      {
        field: 'model',
        value: 'CORRER',
        showFields: ['numberOfLeaves'],
      },
      {
        field: 'glassType',
        value: 'IMPRESSO',
        showFields: ['glassTexture'],
      },
    ],
    hidden: [
      'finishLine',
      'pivotPosition',
      'handleType',
      'lockType',
      'hasHandrail',
      'handrailType',
      'ledTemp',
      'bisoteWidth',
      'shape',
      'pergolaStructure',
      'pergolaFixing',
      'pergolaSlope',
      'partitionSystem',
      'partitionHeight',
      'shelfType',
      'shelfSupportType',
      'shelfSupportMaterial',
      'closingType',
      'closingSystem',
      'serviceUrgency',
      'serviceType',
      'numberOfTracks',
      'motorType',
      'towerHeight',
      'buttonSize',
      'spiderPoints',
      'jateamentoType',
      'serigrafadoPadrao',
      'serigrafadoCor',
      'molduraType',
      'quantidadeLampadas',
      'kitContents',
      'molaCapacidade',
      'puxadorTamanho',
      'repairType',
    ],
    validations: {
      thicknessOptions: [6, 8],
    },
  },

  /**
   * GUARDA-CORPO (6 produtos)
   * CRÍTICO: Gradil Inox NÃO TEM VIDRO
   * Outros 5 produtos TÊM VIDRO (laminado obrigatório)
   */
  GUARDA_CORPO: {
    required: ['width', 'height', 'model', 'hardwareColor'],
    optional: ['hasHandrail'],
    conditional: [
      // SE model NÃO É GRADIL_INOX → mostrar campos de vidro
      {
        field: 'model',
        value: 'AUTOPORTANTE',
        showFields: ['thickness', 'glassType', 'glassColor'],
      },
      {
        field: 'model',
        value: 'AUTOPORTANTE_INOX',
        showFields: ['thickness', 'glassType', 'glassColor'],
      },
      {
        field: 'model',
        value: 'TORRES',
        showFields: ['thickness', 'glassType', 'glassColor', 'towerHeight'],
      },
      {
        field: 'model',
        value: 'BOTTONS',
        showFields: ['thickness', 'glassType', 'glassColor', 'buttonSize'],
      },
      {
        field: 'model',
        value: 'SPIDER',
        showFields: ['thickness', 'glassType', 'glassColor', 'spiderPoints'],
      },
      // SE has handrail → mostrar tipo de corrimão
      {
        field: 'hasHandrail',
        value: true,
        showFields: ['handrailType'],
      },
    ],
    hidden: [
      'finishLine',
      'finish',
      'pivotPosition',
      'handleType',
      'lockType',
      'hasteSize',
      'ledTemp',
      'bisoteWidth',
      'shape',
      'glassTexture',
      'pergolaStructure',
      'pergolaFixing',
      'pergolaSlope',
      'partitionSystem',
      'partitionHeight',
      'shelfType',
      'shelfSupportType',
      'shelfSupportMaterial',
      'closingType',
      'closingSystem',
      'serviceUrgency',
      'serviceType',
      'numberOfLeaves',
      'premiumMaterial',
      'premiumFinish',
      'numberOfTracks',
      'motorType',
      'jateamentoType',
      'serigrafadoPadrao',
      'serigrafadoCor',
      'molduraType',
      'quantidadeLampadas',
      'kitContents',
      'molaCapacidade',
      'puxadorTamanho',
      'repairType',
    ],
    validations: {
      thicknessOptions: [8, 10, 12],
      minHeight: 1.1, // NBR 14718: altura mínima 1,10m
      requiredGlassType: 'LAMINADO', // Para modelos com vidro
    },
  },

  /**
   * CORTINAS DE VIDRO (4 produtos)
   * Todas têm vidro obrigatoriamente
   */
  CORTINAS_VIDRO: {
    required: ['width', 'height', 'thickness', 'glassType', 'glassColor', 'hardwareColor', 'model'],
    optional: [],
    conditional: [
      {
        field: 'model',
        value: 'STANLEY',
        showFields: ['numberOfTracks'],
      },
      {
        field: 'model',
        value: 'AUTOMATIZADO',
        showFields: ['motorType'],
      },
    ],
    hidden: [
      'finishLine',
      'finish',
      'pivotPosition',
      'handleType',
      'lockType',
      'hasteSize',
      'hasHandrail',
      'handrailType',
      'ledTemp',
      'bisoteWidth',
      'shape',
      'glassTexture',
      'pergolaStructure',
      'pergolaFixing',
      'pergolaSlope',
      'partitionSystem',
      'partitionHeight',
      'shelfType',
      'shelfSupportType',
      'shelfSupportMaterial',
      'closingType',
      'closingSystem',
      'serviceUrgency',
      'serviceType',
      'numberOfLeaves',
      'premiumMaterial',
      'premiumFinish',
      'towerHeight',
      'buttonSize',
      'spiderPoints',
      'jateamentoType',
      'serigrafadoPadrao',
      'serigrafadoCor',
      'molduraType',
      'quantidadeLampadas',
      'kitContents',
      'molaCapacidade',
      'puxadorTamanho',
      'repairType',
    ],
    validations: {
      thicknessOptions: [8, 10],
    },
  },

  /**
   * PERGOLADOS E COBERTURAS (4 produtos)
   * Todos têm vidro laminado obrigatoriamente (NBR 7199)
   */
  PERGOLADOS: {
    required: [
      'width',
      'height',
      'thickness',
      'glassType',
      'glassColor',
      'hardwareColor',
      'pergolaStructure',
      'pergolaFixing',
      'pergolaSlope',
    ],
    optional: [],
    conditional: [
      {
        field: 'pergolaStructure',
        value: 'ALUMINIO',
        showFields: ['premiumFinish'], // Acabamento: branco, preto, madeirado
      },
      {
        field: 'pergolaStructure',
        value: 'INOX',
        showFields: ['premiumFinish'], // Acabamento: polido, escovado
      },
    ],
    hidden: [
      'model',
      'finishLine',
      'finish',
      'pivotPosition',
      'handleType',
      'lockType',
      'hasteSize',
      'hasHandrail',
      'handrailType',
      'ledTemp',
      'bisoteWidth',
      'shape',
      'glassTexture',
      'partitionSystem',
      'partitionHeight',
      'shelfType',
      'shelfSupportType',
      'shelfSupportMaterial',
      'closingType',
      'closingSystem',
      'serviceUrgency',
      'serviceType',
      'numberOfLeaves',
      'premiumMaterial',
      'numberOfTracks',
      'motorType',
      'towerHeight',
      'buttonSize',
      'spiderPoints',
      'jateamentoType',
      'serigrafadoPadrao',
      'serigrafadoCor',
      'molduraType',
      'quantidadeLampadas',
      'kitContents',
      'molaCapacidade',
      'puxadorTamanho',
      'repairType',
    ],
    validations: {
      thicknessOptions: [8, 10],
      requiredGlassType: 'LAMINADO', // NBR 7199
    },
  },

  /**
   * ESPELHOS (8 produtos)
   * NÃO TÊM VIDRO - são vidro espelhado
   * NÃO TÊM FERRAGEM - não têm abertura
   */
  ESPELHOS: {
    required: ['width', 'height', 'thickness', 'glassColor', 'shape', 'model'],
    optional: ['finish'],
    conditional: [
      {
        field: 'finish',
        value: 'BISOTE',
        showFields: ['bisoteWidth'],
      },
      {
        field: 'model',
        value: 'LED',
        showFields: ['ledTemp'],
      },
      {
        field: 'model',
        value: 'CAMARIM',
        showFields: ['molduraType', 'quantidadeLampadas'],
      },
      {
        field: 'model',
        value: 'VENEZIANO',
        showFields: ['molduraType'],
      },
    ],
    hidden: [
      'glassType', // É espelho, não vidro
      'hardwareColor', // Espelhos não têm ferragem
      'finishLine',
      'pivotPosition',
      'handleType',
      'lockType',
      'hasteSize',
      'hasHandrail',
      'handrailType',
      'glassTexture',
      'pergolaStructure',
      'pergolaFixing',
      'pergolaSlope',
      'partitionSystem',
      'partitionHeight',
      'shelfType',
      'shelfSupportType',
      'shelfSupportMaterial',
      'closingType',
      'closingSystem',
      'serviceUrgency',
      'serviceType',
      'numberOfLeaves',
      'premiumMaterial',
      'premiumFinish',
      'numberOfTracks',
      'motorType',
      'towerHeight',
      'buttonSize',
      'spiderPoints',
      'jateamentoType',
      'serigrafadoPadrao',
      'serigrafadoCor',
      'kitContents',
      'molaCapacidade',
      'puxadorTamanho',
      'repairType',
    ],
    validations: {
      thicknessOptions: [4, 5],
    },
  },

  /**
   * VIDROS (9 produtos - placas de vidro puro)
   * Apenas vidro, sem moldura ou ferragem
   */
  VIDROS: {
    required: ['width', 'height', 'thickness', 'glassType', 'glassColor'],
    optional: ['finish'],
    conditional: [
      {
        field: 'glassType',
        value: 'JATEADO',
        showFields: ['jateamentoType'],
      },
      {
        field: 'glassType',
        value: 'SERIGRAFADO',
        showFields: ['serigrafadoPadrao', 'serigrafadoCor'],
      },
    ],
    hidden: [
      'hardwareColor',
      'model',
      'finishLine',
      'pivotPosition',
      'handleType',
      'lockType',
      'hasteSize',
      'hasHandrail',
      'handrailType',
      'ledTemp',
      'bisoteWidth',
      'shape',
      'glassTexture',
      'pergolaStructure',
      'pergolaFixing',
      'pergolaSlope',
      'partitionSystem',
      'partitionHeight',
      'shelfType',
      'shelfSupportType',
      'shelfSupportMaterial',
      'closingType',
      'closingSystem',
      'serviceUrgency',
      'serviceType',
      'numberOfLeaves',
      'premiumMaterial',
      'premiumFinish',
      'numberOfTracks',
      'motorType',
      'towerHeight',
      'buttonSize',
      'spiderPoints',
      'molduraType',
      'quantidadeLampadas',
      'kitContents',
      'molaCapacidade',
      'puxadorTamanho',
      'repairType',
    ],
    validations: {
      thicknessOptions: [2, 3, 4, 5, 6, 8, 10, 12],
    },
  },

  /**
   * DIVISÓRIAS E PAINÉIS (4 produtos)
   * Todas têm vidro obrigatoriamente
   */
  DIVISORIAS: {
    required: [
      'width',
      'height',
      'thickness',
      'glassType',
      'glassColor',
      'hardwareColor',
      'partitionSystem',
      'partitionHeight',
    ],
    optional: ['finish'],
    conditional: [],
    hidden: [
      'model',
      'finishLine',
      'pivotPosition',
      'handleType',
      'lockType',
      'hasteSize',
      'hasHandrail',
      'handrailType',
      'ledTemp',
      'bisoteWidth',
      'shape',
      'glassTexture',
      'pergolaStructure',
      'pergolaFixing',
      'pergolaSlope',
      'shelfType',
      'shelfSupportType',
      'shelfSupportMaterial',
      'closingType',
      'closingSystem',
      'serviceUrgency',
      'serviceType',
      'numberOfLeaves',
      'premiumMaterial',
      'premiumFinish',
      'numberOfTracks',
      'motorType',
      'towerHeight',
      'buttonSize',
      'spiderPoints',
      'jateamentoType',
      'serigrafadoPadrao',
      'serigrafadoCor',
      'molduraType',
      'quantidadeLampadas',
      'kitContents',
      'molaCapacidade',
      'puxadorTamanho',
      'repairType',
    ],
    validations: {
      thicknessOptions: [10, 12],
    },
  },

  /**
   * FECHAMENTOS EM VIDRO (4 produtos)
   * Todos têm vidro obrigatoriamente
   */
  FECHAMENTOS: {
    required: [
      'width',
      'height',
      'thickness',
      'glassType',
      'glassColor',
      'hardwareColor',
      'closingType',
      'closingSystem',
    ],
    optional: [],
    conditional: [],
    hidden: [
      'model',
      'finishLine',
      'finish',
      'pivotPosition',
      'handleType',
      'lockType',
      'hasteSize',
      'hasHandrail',
      'handrailType',
      'ledTemp',
      'bisoteWidth',
      'shape',
      'glassTexture',
      'pergolaStructure',
      'pergolaFixing',
      'pergolaSlope',
      'partitionSystem',
      'partitionHeight',
      'shelfType',
      'shelfSupportType',
      'shelfSupportMaterial',
      'serviceUrgency',
      'serviceType',
      'numberOfLeaves',
      'premiumMaterial',
      'premiumFinish',
      'numberOfTracks',
      'motorType',
      'towerHeight',
      'buttonSize',
      'spiderPoints',
      'jateamentoType',
      'serigrafadoPadrao',
      'serigrafadoCor',
      'molduraType',
      'quantidadeLampadas',
      'kitContents',
      'molaCapacidade',
      'puxadorTamanho',
      'repairType',
    ],
    validations: {
      thicknessOptions: [8, 10],
      requiredHardware: 'INOX_316', // SE closingType = PISCINA
      requiredGlassType: 'LAMINADO', // SE closingType = PISCINA
    },
  },

  /**
   * TAMPOS E PRATELEIRAS (3 produtos)
   * Todos têm vidro temperado obrigatoriamente
   */
  TAMPOS_PRATELEIRAS: {
    required: ['width', 'height', 'thickness', 'glassType', 'glassColor', 'shape', 'shelfType'],
    optional: ['finish'],
    conditional: [
      {
        field: 'shelfType',
        value: 'PRATELEIRA',
        showFields: ['shelfSupportType', 'shelfSupportMaterial'],
      },
    ],
    hidden: [
      'hardwareColor',
      'model',
      'finishLine',
      'pivotPosition',
      'handleType',
      'lockType',
      'hasteSize',
      'hasHandrail',
      'handrailType',
      'ledTemp',
      'bisoteWidth',
      'glassTexture',
      'pergolaStructure',
      'pergolaFixing',
      'pergolaSlope',
      'partitionSystem',
      'partitionHeight',
      'closingType',
      'closingSystem',
      'serviceUrgency',
      'serviceType',
      'numberOfLeaves',
      'premiumMaterial',
      'premiumFinish',
      'numberOfTracks',
      'motorType',
      'towerHeight',
      'buttonSize',
      'spiderPoints',
      'jateamentoType',
      'serigrafadoPadrao',
      'serigrafadoCor',
      'molduraType',
      'quantidadeLampadas',
      'kitContents',
      'molaCapacidade',
      'puxadorTamanho',
      'repairType',
    ],
    validations: {
      thicknessOptions: [6, 8, 10, 12],
    },
  },

  /**
   * FERRAGENS (4 produtos)
   * CRÍTICO: NÃO TÊM DIMENSÕES (width/height)
   * São apenas acessórios/peças
   */
  FERRAGENS: {
    required: ['hardwareColor', 'model'],
    optional: [],
    conditional: [
      {
        field: 'model',
        value: 'MOLA',
        showFields: ['molaCapacidade'],
      },
      {
        field: 'model',
        value: 'PUXADOR',
        showFields: ['puxadorTamanho'],
      },
      {
        field: 'model',
        value: 'KIT_PORTA_PIVOTANTE',
        showFields: ['kitContents'],
      },
      {
        field: 'model',
        value: 'KIT_BOX',
        showFields: ['kitContents'],
      },
    ],
    hidden: [
      'width',
      'height',
      'thickness',
      'glassType',
      'glassColor',
      'finishLine',
      'finish',
      'shape',
      'pivotPosition',
      'handleType',
      'lockType',
      'hasteSize',
      'hasHandrail',
      'handrailType',
      'ledTemp',
      'bisoteWidth',
      'glassTexture',
      'pergolaStructure',
      'pergolaFixing',
      'pergolaSlope',
      'partitionSystem',
      'partitionHeight',
      'shelfType',
      'shelfSupportType',
      'shelfSupportMaterial',
      'closingType',
      'closingSystem',
      'serviceUrgency',
      'serviceType',
      'numberOfLeaves',
      'premiumMaterial',
      'premiumFinish',
      'numberOfTracks',
      'motorType',
      'towerHeight',
      'buttonSize',
      'spiderPoints',
      'jateamentoType',
      'serigrafadoPadrao',
      'serigrafadoCor',
      'molduraType',
      'quantidadeLampadas',
      'repairType',
    ],
    validations: {},
  },

  /**
   * KITS COMPLETOS (2 produtos)
   * CRÍTICO: NÃO TÊM DIMENSÕES (width/height)
   * São conjuntos de peças/produtos
   */
  KITS: {
    required: ['hardwareColor', 'model'],
    optional: ['kitContents'],
    conditional: [],
    hidden: [
      'width',
      'height',
      'thickness',
      'glassType',
      'glassColor',
      'finishLine',
      'finish',
      'shape',
      'pivotPosition',
      'handleType',
      'lockType',
      'hasteSize',
      'hasHandrail',
      'handrailType',
      'ledTemp',
      'bisoteWidth',
      'glassTexture',
      'pergolaStructure',
      'pergolaFixing',
      'pergolaSlope',
      'partitionSystem',
      'partitionHeight',
      'shelfType',
      'shelfSupportType',
      'shelfSupportMaterial',
      'closingType',
      'closingSystem',
      'serviceUrgency',
      'serviceType',
      'numberOfLeaves',
      'premiumMaterial',
      'premiumFinish',
      'numberOfTracks',
      'motorType',
      'towerHeight',
      'buttonSize',
      'spiderPoints',
      'jateamentoType',
      'serigrafadoPadrao',
      'serigrafadoCor',
      'molduraType',
      'quantidadeLampadas',
      'molaCapacidade',
      'puxadorTamanho',
      'repairType',
    ],
    validations: {},
  },

  /**
   * SERVIÇOS (6 produtos)
   * CRÍTICO: Campos condicionais dependem do tipo de serviço
   * TROCA_VIDRO precisa de dimensões e especificações de vidro
   * Outros serviços NÃO precisam
   */
  SERVICOS: {
    required: ['model', 'serviceUrgency'],
    optional: [],
    conditional: [
      {
        field: 'model',
        value: 'TROCA_VIDRO',
        showFields: ['width', 'height', 'thickness', 'glassType', 'glassColor'],
      },
      {
        field: 'model',
        value: 'MANUTENCAO_CORRETIVA',
        showFields: ['repairType'],
      },
    ],
    hidden: [
      // Por padrão, ocultar campos de produto físico
      // Serão mostrados condicionalmente SE model = TROCA_VIDRO
      'hardwareColor',
      'finishLine',
      'finish',
      'shape',
      'pivotPosition',
      'handleType',
      'lockType',
      'hasteSize',
      'hasHandrail',
      'handrailType',
      'ledTemp',
      'bisoteWidth',
      'glassTexture',
      'pergolaStructure',
      'pergolaFixing',
      'pergolaSlope',
      'partitionSystem',
      'partitionHeight',
      'shelfType',
      'shelfSupportType',
      'shelfSupportMaterial',
      'closingType',
      'closingSystem',
      'numberOfLeaves',
      'premiumMaterial',
      'premiumFinish',
      'numberOfTracks',
      'motorType',
      'towerHeight',
      'buttonSize',
      'spiderPoints',
      'jateamentoType',
      'serigrafadoPadrao',
      'serigrafadoCor',
      'molduraType',
      'quantidadeLampadas',
      'kitContents',
      'molaCapacidade',
      'puxadorTamanho',
    ],
    validations: {},
  },

  /**
   * FACHADAS (1 produto)
   * Fachadas de vidro comerciais e corporativas
   */
  FACHADAS: {
    required: ['width', 'height', 'thickness', 'glassType', 'glassColor'],
    optional: ['finish', 'hardwareColor'],
    conditional: [],
    hidden: [
      'model',
      'shape',
      'pivotPosition',
      'handleType',
      'lockType',
      'hasteSize',
      'hasHandrail',
      'handrailType',
      'ledTemp',
      'bisoteWidth',
      'glassTexture',
      'pergolaStructure',
      'pergolaFixing',
      'pergolaSlope',
      'partitionSystem',
      'partitionHeight',
      'shelfType',
      'shelfSupportType',
      'shelfSupportMaterial',
      'closingType',
      'closingSystem',
      'numberOfLeaves',
      'premiumMaterial',
      'premiumFinish',
      'numberOfTracks',
      'motorType',
      'towerHeight',
      'buttonSize',
      'spiderPoints',
      'jateamentoType',
      'serigrafadoPadrao',
      'serigrafadoCor',
      'molduraType',
      'quantidadeLampadas',
      'kitContents',
      'molaCapacidade',
      'puxadorTamanho',
      'serviceUrgency',
      'finishLine',
    ],
    validations: {
      thicknessOptions: [10, 12],
      minWidth: 1.0,
      maxWidth: 6.0,
      minHeight: 2.0,
      maxHeight: 6.0,
      requiredGlassType: 'Temperado ou Laminado',
    },
  },

  /**
   * PAINEIS DECORATIVOS (2 produtos)
   * Painéis artísticos e decorativos
   */
  PAINEIS_DECORATIVOS: {
    required: ['width', 'height', 'thickness', 'glassType', 'glassColor'],
    optional: ['finish', 'glassTexture', 'shape'],
    conditional: [],
    hidden: [
      'model',
      'hardwareColor',
      'pivotPosition',
      'handleType',
      'lockType',
      'hasteSize',
      'hasHandrail',
      'handrailType',
      'ledTemp',
      'bisoteWidth',
      'pergolaStructure',
      'pergolaFixing',
      'pergolaSlope',
      'partitionSystem',
      'partitionHeight',
      'shelfType',
      'shelfSupportType',
      'shelfSupportMaterial',
      'closingType',
      'closingSystem',
      'numberOfLeaves',
      'premiumMaterial',
      'premiumFinish',
      'numberOfTracks',
      'motorType',
      'towerHeight',
      'buttonSize',
      'spiderPoints',
      'jateamentoType',
      'serigrafadoPadrao',
      'serigrafadoCor',
      'molduraType',
      'quantidadeLampadas',
      'kitContents',
      'molaCapacidade',
      'puxadorTamanho',
      'serviceUrgency',
      'finishLine',
    ],
    validations: {
      thicknessOptions: [6, 8, 10],
    },
  },
}

/**
 * Helper: Verificar se um campo deve ser exibido para uma categoria
 */
export function shouldShowField(
  category: string,
  fieldName: FieldName,
  currentValues: Record<string, any>
): boolean {
  const config = CATEGORY_FIELD_MAP[category]
  if (!config) return false

  // Se está na lista de hidden, nunca mostrar
  if (config.hidden.includes(fieldName)) {
    return false
  }

  // Se está na lista de required ou optional, sempre mostrar
  if (config.required.includes(fieldName) || config.optional?.includes(fieldName)) {
    return true
  }

  // Verificar regras condicionais
  if (config.conditional) {
    for (const rule of config.conditional) {
      // Se o campo condicional tem o valor esperado
      if (currentValues[rule.field] === rule.value) {
        // E este campo está na lista de campos a mostrar
        if (rule.showFields.includes(fieldName)) {
          return true
        }
      }
    }
  }

  // Por padrão, não mostrar
  return false
}

/**
 * Helper: Obter lista de campos obrigatórios visíveis
 */
export function getRequiredFields(
  category: string,
  currentValues: Record<string, any>
): FieldName[] {
  const config = CATEGORY_FIELD_MAP[category]
  if (!config) return []

  const required = [...config.required]

  // Adicionar campos condicionais que estão sendo mostrados
  if (config.conditional) {
    for (const rule of config.conditional) {
      if (currentValues[rule.field] === rule.value) {
        // Campos condicionais também são obrigatórios quando visíveis
        required.push(...rule.showFields)
      }
    }
  }

  return required
}

/**
 * Helper: Obter validações para uma categoria
 */
export function getCategoryValidations(category: string) {
  return CATEGORY_FIELD_MAP[category]?.validations || {}
}
