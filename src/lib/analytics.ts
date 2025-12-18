// Google Analytics 4 Custom Events
// Documentation: https://developers.google.com/analytics/devguides/collection/ga4/reference/events

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
    dataLayer?: unknown[]
  }
}

// Helper function to safely send GA4 events
function sendEvent(eventName: string, params?: Record<string, unknown>) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, params)
  }
}

// ============================================
// QUOTE FUNNEL EVENTS
// ============================================

export function trackQuoteStarted(params: {
  category?: string
  source?: 'homepage' | 'product_page' | 'header' | 'whatsapp'
}) {
  sendEvent('quote_started', {
    event_category: 'Quote Funnel',
    quote_category: params.category,
    quote_source: params.source,
  })
}

export function trackQuoteStepCompleted(params: {
  step: number
  step_name: string
  category?: string
  product?: string
}) {
  sendEvent('quote_step_completed', {
    event_category: 'Quote Funnel',
    step_number: params.step,
    step_name: params.step_name,
    quote_category: params.category,
    quote_product: params.product,
  })
}

export function trackQuoteCompleted(params: {
  quote_id: string
  category: string
  product: string
  estimated_value?: number
}) {
  sendEvent('quote_completed', {
    event_category: 'Quote Funnel',
    quote_id: params.quote_id,
    quote_category: params.category,
    quote_product: params.product,
    value: params.estimated_value,
    currency: 'BRL',
  })
}

export function trackQuoteAbandoned(params: {
  step: number
  step_name: string
  category?: string
}) {
  sendEvent('quote_abandoned', {
    event_category: 'Quote Funnel',
    abandoned_at_step: params.step,
    step_name: params.step_name,
    quote_category: params.category,
  })
}

// ============================================
// E-COMMERCE EVENTS
// ============================================

export function trackViewItem(params: {
  item_id: string
  item_name: string
  item_category: string
  price?: number
}) {
  sendEvent('view_item', {
    currency: 'BRL',
    value: params.price,
    items: [
      {
        item_id: params.item_id,
        item_name: params.item_name,
        item_category: params.item_category,
        price: params.price,
      },
    ],
  })
}

export function trackViewItemList(params: {
  item_list_id: string
  item_list_name: string
  items: Array<{
    item_id: string
    item_name: string
    item_category: string
    index: number
    price?: number
  }>
}) {
  sendEvent('view_item_list', {
    item_list_id: params.item_list_id,
    item_list_name: params.item_list_name,
    items: params.items,
  })
}

export function trackSelectItem(params: {
  item_id: string
  item_name: string
  item_category: string
  item_list_name?: string
}) {
  sendEvent('select_item', {
    item_list_name: params.item_list_name,
    items: [
      {
        item_id: params.item_id,
        item_name: params.item_name,
        item_category: params.item_category,
      },
    ],
  })
}

export function trackBeginCheckout(params: {
  order_id: string
  value: number
  items: Array<{
    item_id: string
    item_name: string
    price: number
    quantity: number
  }>
}) {
  sendEvent('begin_checkout', {
    currency: 'BRL',
    value: params.value,
    items: params.items,
  })
}

export function trackPurchase(params: {
  transaction_id: string
  value: number
  tax?: number
  shipping?: number
  items: Array<{
    item_id: string
    item_name: string
    price: number
    quantity: number
  }>
}) {
  sendEvent('purchase', {
    transaction_id: params.transaction_id,
    currency: 'BRL',
    value: params.value,
    tax: params.tax,
    shipping: params.shipping,
    items: params.items,
  })
}

// ============================================
// CONTACT & ENGAGEMENT EVENTS
// ============================================

export function trackWhatsAppClick(params: {
  source: 'floating_button' | 'header' | 'footer' | 'contact_page' | 'product_page'
  page_path?: string
}) {
  sendEvent('whatsapp_click', {
    event_category: 'Contact',
    click_source: params.source,
    page_path: params.page_path || (typeof window !== 'undefined' ? window.location.pathname : ''),
  })
}

export function trackPhoneClick(params: { source: string }) {
  sendEvent('phone_click', {
    event_category: 'Contact',
    click_source: params.source,
  })
}

export function trackEmailClick(params: { source: string }) {
  sendEvent('email_click', {
    event_category: 'Contact',
    click_source: params.source,
  })
}

export function trackContactFormSubmit(params: { form_name: string; has_message?: boolean }) {
  sendEvent('contact_form_submit', {
    event_category: 'Contact',
    form_name: params.form_name,
    has_message: params.has_message,
  })
}

// ============================================
// USER ACCOUNT EVENTS
// ============================================

export function trackSignUp(params: { method: 'credentials' | 'google' }) {
  sendEvent('sign_up', {
    method: params.method,
  })
}

export function trackLogin(params: { method: 'credentials' | 'google' }) {
  sendEvent('login', {
    method: params.method,
  })
}

// ============================================
// NAVIGATION & SEARCH EVENTS
// ============================================

export function trackSearch(params: { search_term: string; results_count?: number }) {
  sendEvent('search', {
    search_term: params.search_term,
    results_count: params.results_count,
  })
}

export function trackPageScroll(params: { scroll_depth: 25 | 50 | 75 | 100; page_path?: string }) {
  sendEvent('scroll', {
    percent_scrolled: params.scroll_depth,
    page_path: params.page_path || (typeof window !== 'undefined' ? window.location.pathname : ''),
  })
}

export function trackCTAClick(params: {
  cta_text: string
  cta_location: string
  destination_url?: string
}) {
  sendEvent('cta_click', {
    event_category: 'Engagement',
    cta_text: params.cta_text,
    cta_location: params.cta_location,
    destination_url: params.destination_url,
  })
}

// ============================================
// SCHEDULING EVENTS
// ============================================

export function trackAppointmentScheduled(params: {
  appointment_type: 'visita_tecnica' | 'instalacao' | 'manutencao'
  date: string
}) {
  sendEvent('appointment_scheduled', {
    event_category: 'Appointment',
    appointment_type: params.appointment_type,
    appointment_date: params.date,
  })
}

export function trackAppointmentCancelled(params: { appointment_type: string; reason?: string }) {
  sendEvent('appointment_cancelled', {
    event_category: 'Appointment',
    appointment_type: params.appointment_type,
    cancellation_reason: params.reason,
  })
}

// ============================================
// DOCUMENT EVENTS
// ============================================

export function trackDocumentDownload(params: { document_type: string; document_name: string }) {
  sendEvent('file_download', {
    event_category: 'Document',
    file_extension: params.document_type,
    file_name: params.document_name,
  })
}

export function trackDocumentUpload(params: { document_type: string; file_size?: number }) {
  sendEvent('document_upload', {
    event_category: 'Document',
    document_type: params.document_type,
    file_size_kb: params.file_size ? Math.round(params.file_size / 1024) : undefined,
  })
}

// ============================================
// SHARE EVENTS
// ============================================

export function trackShare(params: {
  method: 'facebook' | 'twitter' | 'whatsapp' | 'linkedin' | 'copy_link'
  content_type: 'product' | 'page'
  item_id?: string
}) {
  sendEvent('share', {
    method: params.method,
    content_type: params.content_type,
    item_id: params.item_id,
  })
}

// ============================================
// ERROR EVENTS
// ============================================

export function trackError(params: {
  error_type: string
  error_message: string
  page_path?: string
}) {
  sendEvent('error', {
    event_category: 'Error',
    error_type: params.error_type,
    error_message: params.error_message,
    page_path: params.page_path || (typeof window !== 'undefined' ? window.location.pathname : ''),
  })
}

// ============================================
// PAYMENT EVENTS
// ============================================

export function trackPaymentStarted(params: {
  payment_method: 'pix' | 'card'
  value: number
  order_id: string
}) {
  sendEvent('payment_started', {
    event_category: 'Payment',
    payment_method: params.payment_method,
    value: params.value,
    currency: 'BRL',
    order_id: params.order_id,
  })
}

export function trackPaymentCompleted(params: {
  payment_method: 'pix' | 'card'
  value: number
  order_id: string
}) {
  sendEvent('payment_completed', {
    event_category: 'Payment',
    payment_method: params.payment_method,
    value: params.value,
    currency: 'BRL',
    order_id: params.order_id,
  })
}

export function trackPaymentFailed(params: {
  payment_method: 'pix' | 'card'
  error_reason?: string
  order_id: string
}) {
  sendEvent('payment_failed', {
    event_category: 'Payment',
    payment_method: params.payment_method,
    error_reason: params.error_reason,
    order_id: params.order_id,
  })
}
