/**
 * Application-wide constants for Versati Glass
 * Centralized configuration to avoid hardcoded values
 */

// ============================================================================
// BRAND IDENTITY
// ============================================================================

export const BRAND = {
  name: 'Versati Glass',
  tagline: 'Transparência que transforma espaços',
  description: 'Soluções premium em vidro temperado para sua casa ou empresa',
} as const

// ============================================================================
// CONTACT INFORMATION
// ============================================================================

export const CONTACT = {
  phone: '+55 21 98253-6229',
  phoneRaw: '+5521982536229', // Format for tel: links
  phoneWhatsApp: '5521982536229', // Format for WhatsApp API (no + or spaces)
  email: 'contato@versatiglass.com.br',
  emailNoReply: 'noreply@versatiglass.com.br',
  address: {
    city: 'Rio de Janeiro',
    state: 'RJ',
    full: 'Rio de Janeiro, RJ',
  },
} as const

// ============================================================================
// THEME COLORS
// ============================================================================

export const COLORS = {
  // Primary brand color (gold)
  primary: '#d4af37',
  primaryRGB: '212, 175, 55',

  // Accent color (used for CTA buttons)
  accent: '#C9A962',
  accentHover: '#B8944E',

  // Status colors
  success: '#22c55e',
  successRGB: '34, 197, 94',

  error: '#ef4444',
  errorRGB: '239, 68, 68',

  warning: '#f59e0b',
  warningRGB: '245, 158, 11',

  info: '#3b82f6',
  infoRGB: '59, 130, 246',

  // Neutral colors
  neutralLight: '#a0a0a0',
  neutralDark: '#666',

  // Background colors
  bgPrimary: '#0a0a0a',
  bgSecondary: '#1a1a1a',
  bgTertiary: '#252525',
  bgQuaternary: '#151515',
} as const

// ============================================================================
// BUSINESS RULES
// ============================================================================

export const BUSINESS_RULES = {
  // Quote expiration
  quoteValidityDays: 30,

  // Password requirements
  minPasswordLength: 6,

  // File upload limits
  maxFileSize: 10 * 1024 * 1024, // 10MB
  allowedImageTypes: ['image/jpeg', 'image/png', 'image/webp'],
  allowedDocumentTypes: ['application/pdf', 'image/jpeg', 'image/png'],

  // Pagination
  defaultPageSize: 10,
  maxPageSize: 100,

  // Phone validation
  phoneRegex: /^\(\d{2}\)\s?\d{4,5}-\d{4}$/,
  phoneDigitsOnly: /^\d{10,11}$/,

  // Email verification
  emailVerificationExpiryHours: 24,

  // Password reset
  passwordResetExpiryHours: 1,

  // Appointment scheduling
  appointmentDurationMinutes: 60,
  businessHoursStart: '08:00',
  businessHoursEnd: '18:00',
  businessDays: [1, 2, 3, 4, 5], // Monday to Friday
} as const

// ============================================================================
// API CONFIGURATION
// ============================================================================

export const API = {
  // Rate limiting (requests per minute)
  rateLimit: {
    auth: 5, // Login, register, password reset
    api: 60, // General API calls
    public: 30, // Public endpoints
  },

  // Timeouts
  timeout: {
    default: 30000, // 30 seconds
    upload: 60000, // 1 minute
    longRunning: 120000, // 2 minutes
  },
} as const

// ============================================================================
// APPOINTMENT STATUS
// ============================================================================

export const APPOINTMENT_STATUS = {
  SCHEDULED: {
    label: 'Agendado',
    color: COLORS.info,
    icon: '📅',
    description: 'Seu agendamento foi criado com sucesso.',
  },
  CONFIRMED: {
    label: 'Confirmado',
    color: COLORS.success,
    icon: '✓',
    description: 'Seu agendamento foi confirmado pela nossa equipe.',
  },
  IN_PROGRESS: {
    label: 'Em Andamento',
    color: COLORS.primary,
    icon: '🔧',
    description: 'Nossa equipe está realizando o serviço no momento.',
  },
  COMPLETED: {
    label: 'Concluído',
    color: COLORS.success,
    icon: '✓',
    description: 'O serviço foi concluído com sucesso!',
  },
  CANCELLED: {
    label: 'Cancelado',
    color: COLORS.error,
    icon: '✗',
    description: 'Este agendamento foi cancelado.',
  },
  RESCHEDULED: {
    label: 'Reagendado',
    color: COLORS.warning,
    icon: '🔄',
    description: 'Este agendamento foi reagendado.',
  },
  NO_SHOW: {
    label: 'Ausência',
    color: COLORS.error,
    icon: '⚠',
    description: 'Você não compareceu ao agendamento.',
  },
} as const

// ============================================================================
// ORDER STATUS
// ============================================================================

export const ORDER_STATUS = {
  PENDING_PAYMENT: {
    label: 'Aguardando Pagamento',
    color: COLORS.warning,
    description: 'Aguardando confirmação do pagamento',
  },
  CONFIRMED: {
    label: 'Confirmado',
    color: COLORS.success,
    description: 'Pedido confirmado e em processamento',
  },
  IN_PRODUCTION: {
    label: 'Em Produção',
    color: COLORS.info,
    description: 'Produtos sendo fabricados',
  },
  READY_FOR_DELIVERY: {
    label: 'Pronto para Entrega',
    color: COLORS.primary,
    description: 'Pedido pronto para ser entregue',
  },
  DELIVERED: {
    label: 'Entregue',
    color: COLORS.success,
    description: 'Pedido entregue com sucesso',
  },
  CANCELLED: {
    label: 'Cancelado',
    color: COLORS.error,
    description: 'Pedido cancelado',
  },
} as const

// ============================================================================
// QUOTE STATUS
// ============================================================================

export const QUOTE_STATUS = {
  DRAFT: {
    label: 'Rascunho',
    color: COLORS.neutralLight,
  },
  PENDING: {
    label: 'Pendente',
    color: COLORS.warning,
  },
  ACCEPTED: {
    label: 'Aceito',
    color: COLORS.success,
  },
  REJECTED: {
    label: 'Rejeitado',
    color: COLORS.error,
  },
  EXPIRED: {
    label: 'Expirado',
    color: COLORS.neutralDark,
  },
} as const

// ============================================================================
// ROUTES
// ============================================================================

export const ROUTES = {
  public: {
    home: '/',
    products: '/produtos',
    portfolio: '/portfolio',
    logos: '/logos',
    faq: '/faq',
    privacy: '/privacidade',
    terms: '/termos',
  },
  auth: {
    login: '/login',
    register: '/registro',
    forgotPassword: '/recuperar-senha',
    resetPassword: '/redefinir-senha',
    verifyEmail: '/verificar-email',
  },
  portal: {
    dashboard: '/portal',
    profile: '/portal/perfil',
    orders: '/portal/pedidos',
    orderDetails: (id: string) => `/portal/pedidos/${id}`,
  },
  admin: {
    dashboard: '/admin',
    customers: '/admin/clientes',
    products: '/admin/produtos',
    productEdit: (id: string) => `/admin/produtos/${id}`,
    quotes: '/admin/orcamentos',
    orders: '/admin/pedidos',
    manual: '/admin/manual',
  },
} as const

// ============================================================================
// WHATSAPP
// ============================================================================

export const WHATSAPP = {
  baseUrl: 'https://wa.me',
  businessNumber: CONTACT.phoneRaw,
  defaultMessage: {
    quote: 'Olá! Gostaria de solicitar um orçamento.',
    support: 'Olá! Preciso de ajuda.',
    general: 'Olá! Gostaria de mais informações.',
  },
} as const

// ============================================================================
// SEO & META
// ============================================================================

export const SEO = {
  defaultTitle: `${BRAND.name} - ${BRAND.tagline}`,
  titleTemplate: `%s | ${BRAND.name}`,
  description: BRAND.description,
  keywords: [
    'vidro temperado',
    'box de banheiro',
    'guarda corpo de vidro',
    'espelho',
    'porta de vidro',
    'janela de vidro',
    'Rio de Janeiro',
    'RJ',
  ],
  ogImage: '/og-image.jpg',
  twitterHandle: '@versatiglass',
} as const

// ============================================================================
// FEATURE FLAGS
// ============================================================================

export const FEATURES = {
  emailVerification: true,
  googleOAuth: true,
  aiQuoteAssistant: true,
  whatsappIntegration: true,
  paymentGateway: false, // To be implemented
  portfolioDetails: false, // To be implemented
  productReviews: false, // To be implemented
} as const
