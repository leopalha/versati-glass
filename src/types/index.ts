// Exportar tipos do Prisma
import type {
  User,
  Product,
  Quote,
  QuoteItem,
  Order,
  OrderItem,
  OrderTimelineEntry,
  Appointment,
  Document,
  Conversation,
  Message,
} from '@prisma/client'

export type {
  User,
  Product,
  Quote,
  QuoteItem,
  Order,
  OrderItem,
  OrderTimelineEntry,
  Appointment,
  Document,
  Conversation,
  Message,
}

import type {
  Role,
  AuthProvider,
  ProductCategory,
  PriceType,
  QuoteStatus,
  QuoteSource,
  PaymentStatus,
  PaymentMethod,
  OrderStatus,
  OrderItemStatus,
  AppointmentType,
  AppointmentStatus,
  DocumentType,
  DocumentStatus,
  ConversationStatus,
  MessageDirection,
  MessageType,
  SenderType,
  MessageStatus,
} from '@prisma/client'

export type {
  Role,
  AuthProvider,
  ProductCategory,
  PriceType,
  QuoteStatus,
  QuoteSource,
  PaymentStatus,
  PaymentMethod,
  OrderStatus,
  OrderItemStatus,
  AppointmentType,
  AppointmentStatus,
  DocumentType,
  DocumentStatus,
  ConversationStatus,
  MessageDirection,
  MessageType,
  SenderType,
  MessageStatus,
}

// Tipos de API Response
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: {
    code: string
    message: string
  }
  pagination?: {
    page: number
    limit: number
    total: number
    pages: number
  }
}

// Tipos de formulários
export interface LoginFormData {
  email: string
  password: string
}

export interface RegisterFormData {
  name: string
  email: string
  password: string
  phone: string
}

export interface QuoteFormData {
  // Produto
  category: string
  productId: string
  color?: string
  finish?: string
  thickness?: string

  // Medidas
  width?: number
  height?: number
  quantity: number
  specifications?: string

  // Imagens
  images?: File[]

  // Cliente
  customerName: string
  customerEmail: string
  customerPhone: string

  // Endereço
  zipCode: string
  street: string
  number: string
  complement?: string
  neighborhood: string
  city: string
  state: string

  // Observações
  notes?: string
}

export interface AppointmentFormData {
  date: string
  time: string
  type: string
  notes?: string
}

// Tipos com relações
export interface ProductWithRelations extends Product {
  _count?: {
    quoteItems: number
    orderItems: number
  }
}

export interface QuoteWithItems extends Quote {
  items: QuoteItem[]
  user: User
}

export interface OrderWithDetails extends Order {
  items: OrderItem[]
  timeline: OrderTimelineEntry[]
  user: User
  quote?: Quote | null
  appointments: Appointment[]
  documents: Document[]
}

export interface ConversationWithMessages extends Conversation {
  messages: Message[]
  user?: User | null
  assignedTo?: User | null
}

// Tipos de estatísticas/dashboards
export interface DashboardStats {
  totalOrders: number
  activeOrders: number
  completedOrders: number
  totalRevenue: number
  averageTicket: number
  pendingQuotes: number
  upcomingAppointments: number
  conversionRate: number
}

export interface OrdersByStatus {
  status: OrderStatus
  count: number
}

export interface RevenueByMonth {
  month: string
  revenue: number
  orders: number
}
