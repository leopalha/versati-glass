'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { AdminHeader } from '@/components/admin/admin-header'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { formatCurrency, formatDate } from '@/lib/utils'
import {
  FileText,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye,
  Package,
  Bot,
  MessageSquare,
  Image as ImageIcon,
  Pencil,
  Save,
  X,
  Plus,
  Trash2,
  Send,
  FileDown,
  Loader2,
  Download,
  MessageCircle,
} from 'lucide-react'
import Link from 'next/link'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

interface QuoteItem {
  id: string
  description: string
  specifications?: string | null
  width?: number | null
  height?: number | null
  quantity: number
  color?: string | null
  finish?: string | null
  thickness?: string | null
  unitPrice: number
  totalPrice: number
  customerImages?: string[]
  product?: {
    id: string
    name: string
    slug: string
    thumbnail?: string | null
  } | null
}

interface Quote {
  id: string
  number: string
  customerName: string
  customerEmail: string
  customerPhone: string
  serviceStreet: string
  serviceNumber: string
  serviceComplement?: string | null
  serviceNeighborhood: string
  serviceCity: string
  serviceState: string
  serviceZipCode: string
  subtotal: number
  discount: number
  shippingFee: number
  laborFee: number
  materialFee: number
  total: number
  status: string
  source: string
  validUntil: string
  createdAt: string
  sentAt?: string | null
  viewedAt?: string | null
  acceptedAt?: string | null
  internalNotes?: string | null
  customerNotes?: string | null
  items: QuoteItem[]
  user?: {
    id: string
    name: string
    email: string
    phone?: string | null
  } | null
  orders?: Array<{
    id: string
    number: string
    status: string
  }>
  appointments?: Array<{
    id: string
    scheduledDate: string
    scheduledTime: string
    type: string
    status: string
  }>
}

interface AiConversation {
  id: string
  messages: Array<{ id: string }>
}

const statusLabels: Record<string, { label: string; color: string; icon: typeof Clock }> = {
  DRAFT: { label: 'Rascunho', color: 'bg-neutral-500/20 text-neutral-400', icon: Clock },
  SENT: { label: 'Enviado', color: 'bg-blue-500/20 text-blue-400', icon: AlertCircle },
  VIEWED: { label: 'Visualizado', color: 'bg-purple-500/20 text-purple-400', icon: Eye },
  ACCEPTED: { label: 'Aceito', color: 'bg-green-500/20 text-green-400', icon: CheckCircle },
  REJECTED: { label: 'Recusado', color: 'bg-red-500/20 text-red-400', icon: XCircle },
  CANCELLED: { label: 'Cancelado', color: 'bg-red-500/20 text-red-400', icon: XCircle },
  EXPIRED: { label: 'Expirado', color: 'bg-neutral-500/20 text-neutral-400', icon: Clock },
  CONVERTED: { label: 'Convertido', color: 'bg-gold-500/20 text-gold-400', icon: CheckCircle },
}

const sourceLabels: Record<string, string> = {
  WEBSITE: 'Site',
  WHATSAPP: 'WhatsApp',
  PHONE: 'Telefone',
  WALKIN: 'Presencial',
}

export default function QuoteDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const [quoteId, setQuoteId] = useState<string | null>(null)
  const [quote, setQuote] = useState<Quote | null>(null)
  const [aiConversation, setAiConversation] = useState<AiConversation | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editMode, setEditMode] = useState(false)

  // Editable fields
  const [editItems, setEditItems] = useState<QuoteItem[]>([])
  const [editDiscount, setEditDiscount] = useState(0)
  const [editShippingFee, setEditShippingFee] = useState(0)
  const [editLaborFee, setEditLaborFee] = useState(0)
  const [editMaterialFee, setEditMaterialFee] = useState(0)
  const [editInternalNotes, setEditInternalNotes] = useState('')
  const [editCustomerNotes, setEditCustomerNotes] = useState('')

  // Send dialog
  const [showSendDialog, setShowSendDialog] = useState(false)
  const [sendLoading, setSendLoading] = useState(false)
  const [sendError, setSendError] = useState<string | null>(null)
  const [sendViaWhatsApp, setSendViaWhatsApp] = useState(true)
  const [showEmailPreview, setShowEmailPreview] = useState(false)

  // PDF export
  const [exportingPdf, setExportingPdf] = useState(false)

  useEffect(() => {
    params.then((p) => setQuoteId(p.id))
  }, [params])

  const fetchQuote = useCallback(async () => {
    if (!quoteId) return

    try {
      const response = await fetch(`/api/quotes/${quoteId}`)
      if (!response.ok) throw new Error('Erro ao carregar orcamento')

      const data = await response.json()
      setQuote(data.quote)

      // Initialize edit fields
      setEditItems(
        data.quote.items.map((item: QuoteItem) => ({
          ...item,
          unitPrice: Number(item.unitPrice),
          totalPrice: Number(item.totalPrice),
        }))
      )
      setEditDiscount(Number(data.quote.discount) || 0)
      setEditShippingFee(Number(data.quote.shippingFee) || 0)
      setEditLaborFee(Number(data.quote.laborFee) || 0)
      setEditMaterialFee(Number(data.quote.materialFee) || 0)
      setEditInternalNotes(data.quote.internalNotes || '')
      setEditCustomerNotes(data.quote.customerNotes || '')

      if (data.aiConversation) {
        setAiConversation(data.aiConversation)
      }
    } catch (error) {
      console.error('Erro:', error)
    } finally {
      setLoading(false)
    }
  }, [quoteId])

  useEffect(() => {
    fetchQuote()
  }, [fetchQuote])

  const updateItemField = (itemId: string, field: keyof QuoteItem, value: number | string) => {
    setEditItems((prev) =>
      prev.map((item) => {
        if (item.id !== itemId) return item

        const updated = { ...item, [field]: value }
        if (field === 'quantity' || field === 'unitPrice') {
          updated.totalPrice = (Number(updated.quantity) || 0) * (Number(updated.unitPrice) || 0)
        }
        return updated
      })
    )
  }

  const addNewItem = () => {
    const newItem: QuoteItem = {
      id: `new-${Date.now()}`,
      description: 'Novo Item',
      quantity: 1,
      unitPrice: 0,
      totalPrice: 0,
    }
    setEditItems((prev) => [...prev, newItem])
  }

  const removeItem = (itemId: string) => {
    if (editItems.length <= 1) {
      alert('O orcamento deve ter pelo menos 1 item')
      return
    }
    setEditItems((prev) => prev.filter((item) => item.id !== itemId))
  }

  const calculateTotals = () => {
    const itemsSubtotal = editItems.reduce((sum, item) => sum + (Number(item.totalPrice) || 0), 0)
    const discountValue = itemsSubtotal * (editDiscount / 100)
    const fees = editShippingFee + editLaborFee + editMaterialFee
    const total = itemsSubtotal - discountValue + fees
    return { itemsSubtotal, discountValue, fees, total }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const response = await fetch(`/api/quotes/${quoteId}/values`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: editItems.map((item) => ({
            id: item.id.startsWith('new-') ? null : item.id,
            description: item.description,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            specifications: item.specifications,
            width: item.width,
            height: item.height,
            color: item.color,
          })),
          discount: editDiscount,
          shippingFee: editShippingFee,
          laborFee: editLaborFee,
          materialFee: editMaterialFee,
          internalNotes: editInternalNotes,
          customerNotes: editCustomerNotes,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Erro ao salvar')
      }

      setEditMode(false)
      await fetchQuote()
    } catch (error) {
      console.error('Erro:', error)
      alert(error instanceof Error ? error.message : 'Erro ao salvar alteracoes')
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    if (quote) {
      setEditItems(
        quote.items.map((item) => ({
          ...item,
          unitPrice: Number(item.unitPrice),
          totalPrice: Number(item.totalPrice),
        }))
      )
      setEditDiscount(Number(quote.discount) || 0)
      setEditShippingFee(Number(quote.shippingFee) || 0)
      setEditLaborFee(Number(quote.laborFee) || 0)
      setEditMaterialFee(Number(quote.materialFee) || 0)
      setEditInternalNotes(quote.internalNotes || '')
      setEditCustomerNotes(quote.customerNotes || '')
    }
    setEditMode(false)
  }

  const handleSendQuote = async () => {
    setSendLoading(true)
    setSendError(null)

    try {
      const response = await fetch(`/api/quotes/${quoteId}/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sendWhatsApp: sendViaWhatsApp }),
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Erro ao enviar')

      setShowSendDialog(false)
      await fetchQuote()
    } catch (error) {
      setSendError(error instanceof Error ? error.message : 'Erro ao enviar')
    } finally {
      setSendLoading(false)
    }
  }

  const handleExportPdf = async () => {
    setExportingPdf(true)
    try {
      const response = await fetch(`/api/quotes/${quoteId}/pdf`)
      if (!response.ok) throw new Error('Erro ao gerar PDF')

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `orcamento-${quote?.number}.pdf`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error('Erro:', error)
      alert('Erro ao exportar PDF')
    } finally {
      setExportingPdf(false)
    }
  }

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-accent-500" />
      </div>
    )
  }

  if (!quote) {
    return (
      <div className="flex h-96 flex-col items-center justify-center gap-4">
        <p className="text-neutral-400">Orcamento nao encontrado</p>
        <Button variant="outline" asChild>
          <Link href="/admin/orcamentos">Voltar</Link>
        </Button>
      </div>
    )
  }

  const statusInfo = statusLabels[quote.status] || statusLabels.DRAFT
  const StatusIcon = statusInfo.icon
  const isExpired =
    new Date(quote.validUntil) < new Date() && ['SENT', 'VIEWED'].includes(quote.status)
  const canEdit = ['DRAFT', 'SENT', 'VIEWED'].includes(quote.status)
  const canSend = ['DRAFT'].includes(quote.status)
  const canConvert = ['ACCEPTED'].includes(quote.status)
  const canCancel = !['CANCELLED', 'CONVERTED', 'REJECTED'].includes(quote.status)

  const linkedOrder = quote.orders?.[0]
  const linkedAppointment = quote.appointments?.[0]
  const messageCount = aiConversation?.messages?.length || 0
  const { itemsSubtotal, discountValue, fees, total } = calculateTotals()

  return (
    <div>
      <AdminHeader
        title={`Orcamento #${quote.number}`}
        subtitle={`Criado em ${formatDate(quote.createdAt)}`}
        actions={
          <div className="flex flex-wrap gap-2">
            {editMode ? (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCancel}
                  disabled={saving}
                  className="gap-2"
                >
                  <X className="h-4 w-4" />
                  Cancelar
                </Button>
                <Button size="sm" onClick={handleSave} disabled={saving} className="gap-2">
                  {saving ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  Salvar
                </Button>
              </>
            ) : (
              <>
                {canEdit && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditMode(true)}
                    className="gap-2"
                  >
                    <Pencil className="h-4 w-4" />
                    Editar
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleExportPdf}
                  disabled={exportingPdf}
                  className="gap-2"
                >
                  {exportingPdf ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Download className="h-4 w-4" />
                  )}
                  PDF Fornecedor
                </Button>
                {canSend && (
                  <Button size="sm" onClick={() => setShowSendDialog(true)} className="gap-2">
                    <Send className="h-4 w-4" />
                    Enviar
                  </Button>
                )}
                <Button variant="outline" size="sm" asChild>
                  <Link href="/admin/orcamentos">Voltar</Link>
                </Button>
              </>
            )}
          </div>
        }
      />

      <div className="space-y-6 p-6">
        {/* Status e Valores */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="p-6">
            <h3 className="mb-4 font-display text-lg font-semibold text-white">
              Status do Orcamento
            </h3>
            <div className="mb-4 flex flex-wrap items-center gap-3">
              <Badge
                className={`${isExpired ? 'bg-red-500/20 text-red-400' : statusInfo.color} px-3 py-1 text-sm`}
              >
                <StatusIcon className="mr-2 h-4 w-4" />
                {isExpired ? 'Expirado' : statusInfo.label}
              </Badge>
              {aiConversation && (
                <Badge className="bg-purple-500/20 px-3 py-1 text-sm text-purple-400">
                  <Bot className="mr-2 h-4 w-4" />
                  Gerado via IA
                </Badge>
              )}
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-neutral-500">Validade:</span>
                <span className={isExpired ? 'text-red-400' : 'text-white'}>
                  {formatDate(quote.validUntil)}
                </span>
              </div>
              {quote.sentAt && (
                <div className="flex justify-between">
                  <span className="text-neutral-500">Enviado em:</span>
                  <span className="text-white">{formatDate(quote.sentAt)}</span>
                </div>
              )}
              {quote.viewedAt && (
                <div className="flex justify-between">
                  <span className="text-neutral-500">Visualizado em:</span>
                  <span className="text-white">{formatDate(quote.viewedAt)}</span>
                </div>
              )}
              {quote.acceptedAt && (
                <div className="flex justify-between">
                  <span className="text-neutral-500">Aceito em:</span>
                  <span className="text-green-400">{formatDate(quote.acceptedAt)}</span>
                </div>
              )}
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="mb-4 font-display text-lg font-semibold text-white">Valores</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-neutral-500">Subtotal Itens</span>
                <span className="text-white">
                  {formatCurrency(editMode ? itemsSubtotal : Number(quote.subtotal))}
                </span>
              </div>

              {editMode ? (
                <>
                  <div className="flex items-center justify-between gap-4">
                    <Label className="text-neutral-500">Frete (R$)</Label>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      value={editShippingFee}
                      onChange={(e) => setEditShippingFee(Number(e.target.value))}
                      className="w-32 text-right"
                    />
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <Label className="text-neutral-500">Mao de Obra (R$)</Label>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      value={editLaborFee}
                      onChange={(e) => setEditLaborFee(Number(e.target.value))}
                      className="w-32 text-right"
                    />
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <Label className="text-neutral-500">Material Adicional (R$)</Label>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      value={editMaterialFee}
                      onChange={(e) => setEditMaterialFee(Number(e.target.value))}
                      className="w-32 text-right"
                    />
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <Label className="text-neutral-500">Desconto (%)</Label>
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      step="0.01"
                      value={editDiscount}
                      onChange={(e) => setEditDiscount(Number(e.target.value))}
                      className="w-32 text-right"
                    />
                  </div>
                </>
              ) : (
                <>
                  {Number(quote.shippingFee) > 0 && (
                    <div className="flex justify-between">
                      <span className="text-neutral-500">Frete</span>
                      <span className="text-white">
                        {formatCurrency(Number(quote.shippingFee))}
                      </span>
                    </div>
                  )}
                  {Number(quote.laborFee) > 0 && (
                    <div className="flex justify-between">
                      <span className="text-neutral-500">Mao de Obra</span>
                      <span className="text-white">{formatCurrency(Number(quote.laborFee))}</span>
                    </div>
                  )}
                  {Number(quote.materialFee) > 0 && (
                    <div className="flex justify-between">
                      <span className="text-neutral-500">Material Adicional</span>
                      <span className="text-white">
                        {formatCurrency(Number(quote.materialFee))}
                      </span>
                    </div>
                  )}
                  {Number(quote.discount) > 0 && (
                    <div className="flex justify-between text-green-400">
                      <span>Desconto ({quote.discount}%)</span>
                      <span>
                        -{formatCurrency(Number(quote.subtotal) * (Number(quote.discount) / 100))}
                      </span>
                    </div>
                  )}
                </>
              )}

              {editMode && discountValue > 0 && (
                <div className="flex justify-between text-green-400">
                  <span>Desconto ({editDiscount}%)</span>
                  <span>-{formatCurrency(discountValue)}</span>
                </div>
              )}

              <div className="flex justify-between border-t border-neutral-700 pt-3">
                <span className="font-semibold text-white">Total</span>
                <span className="text-xl font-bold text-accent-500">
                  {formatCurrency(editMode ? total : Number(quote.total))}
                </span>
              </div>
            </div>
          </Card>
        </div>

        {/* Cliente */}
        <Card className="p-6">
          <div className="mb-4 flex items-center gap-2">
            <User className="h-5 w-5 text-accent-500" />
            <h3 className="font-display text-lg font-semibold text-white">Cliente</h3>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="flex items-start gap-3">
              <User className="mt-0.5 h-4 w-4 text-neutral-500" />
              <div>
                <p className="text-xs text-neutral-500">Nome</p>
                {quote.user ? (
                  <Link
                    href={`/admin/clientes/${quote.user.id}`}
                    className="text-sm text-accent-500 hover:underline"
                  >
                    {quote.customerName}
                  </Link>
                ) : (
                  <p className="text-sm text-white">{quote.customerName}</p>
                )}
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Mail className="mt-0.5 h-4 w-4 text-neutral-500" />
              <div>
                <p className="text-xs text-neutral-500">Email</p>
                <p className="text-sm text-white">{quote.customerEmail}</p>
              </div>
            </div>
            {quote.customerPhone && (
              <div className="flex items-start gap-3">
                <Phone className="mt-0.5 h-4 w-4 text-neutral-500" />
                <div>
                  <p className="text-xs text-neutral-500">Telefone</p>
                  <p className="text-sm text-white">{quote.customerPhone}</p>
                </div>
              </div>
            )}
            {quote.serviceStreet && (
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 text-neutral-500" />
                <div>
                  <p className="text-xs text-neutral-500">Endereco do Servico</p>
                  <p className="text-sm text-white">
                    {quote.serviceStreet}, {quote.serviceNumber}
                    {quote.serviceComplement && ` - ${quote.serviceComplement}`}
                    <br />
                    {quote.serviceNeighborhood}, {quote.serviceCity}/{quote.serviceState}
                    <br />
                    CEP: {quote.serviceZipCode}
                  </p>
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Itens do Orcamento */}
        <Card className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Package className="h-5 w-5 text-accent-500" />
              <h3 className="font-display text-lg font-semibold text-white">
                Itens do Orcamento ({editMode ? editItems.length : quote.items.length})
              </h3>
            </div>
            {editMode && (
              <Button variant="outline" size="sm" onClick={addNewItem} className="gap-2">
                <Plus className="h-4 w-4" />
                Adicionar Item
              </Button>
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-neutral-700">
                <tr>
                  <th className="pb-3 text-left text-sm font-medium text-neutral-500">Produto</th>
                  <th className="pb-3 text-center text-sm font-medium text-neutral-500">Medidas</th>
                  <th className="pb-3 text-center text-sm font-medium text-neutral-500">Qtd</th>
                  <th className="pb-3 text-right text-sm font-medium text-neutral-500">
                    Preco Unit.
                  </th>
                  <th className="pb-3 text-right text-sm font-medium text-neutral-500">Total</th>
                  {editMode && <th className="w-16 pb-3"></th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-700">
                {(editMode ? editItems : quote.items).map((item, index) => (
                  <tr key={item.id}>
                    <td className="py-4">
                      {editMode ? (
                        <Input
                          value={item.description}
                          onChange={(e) => updateItemField(item.id, 'description', e.target.value)}
                          className="max-w-xs"
                        />
                      ) : (
                        <div className="flex items-center gap-3">
                          {item.product?.thumbnail && (
                            <img
                              src={item.product.thumbnail}
                              alt={item.product.name}
                              className="h-12 w-12 rounded-lg object-cover"
                            />
                          )}
                          <div>
                            <p className="font-medium text-white">
                              {item.product?.name || item.description}
                            </p>
                            {item.specifications && (
                              <p className="text-xs text-neutral-500">{item.specifications}</p>
                            )}
                            {item.color && (
                              <p className="text-xs text-neutral-500">Cor: {item.color}</p>
                            )}
                          </div>
                        </div>
                      )}
                    </td>
                    <td className="py-4 text-center text-sm text-white">
                      {item.width && item.height ? (
                        <span>
                          {Number(item.width).toFixed(2)}m x {Number(item.height).toFixed(2)}m
                        </span>
                      ) : (
                        <span className="text-neutral-500">-</span>
                      )}
                    </td>
                    <td className="py-4 text-center">
                      {editMode ? (
                        <Input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) =>
                            updateItemField(item.id, 'quantity', Number(e.target.value))
                          }
                          className="w-20 text-center"
                        />
                      ) : (
                        <span className="text-white">{item.quantity}</span>
                      )}
                    </td>
                    <td className="py-4 text-right">
                      {editMode ? (
                        <Input
                          type="number"
                          min="0"
                          step="0.01"
                          value={item.unitPrice}
                          onChange={(e) =>
                            updateItemField(item.id, 'unitPrice', Number(e.target.value))
                          }
                          className="w-28 text-right"
                        />
                      ) : (
                        <span className="text-white">{formatCurrency(Number(item.unitPrice))}</span>
                      )}
                    </td>
                    <td className="py-4 text-right font-medium text-accent-500">
                      {formatCurrency(Number(item.totalPrice))}
                    </td>
                    {editMode && (
                      <td className="py-4 text-center">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeItem(item.id)}
                          className="text-red-400 hover:bg-red-500/10 hover:text-red-300"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Customer Images */}
          {!editMode &&
            quote.items.some((item) => item.customerImages && item.customerImages.length > 0) && (
              <div className="mt-6 border-t border-neutral-700 pt-4">
                <div className="mb-3 flex items-center gap-2">
                  <ImageIcon className="h-4 w-4 text-accent-500" />
                  <h4 className="text-sm font-medium text-white">Fotos do Cliente</h4>
                </div>
                <div className="flex flex-wrap gap-2">
                  {quote.items.flatMap((item) =>
                    (item.customerImages || []).map((img, idx) => (
                      <a
                        key={`${item.id}-${idx}`}
                        href={img}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block"
                      >
                        <img
                          src={img}
                          alt={`Foto ${idx + 1}`}
                          className="h-20 w-20 rounded-lg object-cover transition-transform hover:scale-105"
                        />
                      </a>
                    ))
                  )}
                </div>
              </div>
            )}
        </Card>

        {/* Notas e Relacionamentos */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Notas */}
          <Card className="p-6">
            <div className="mb-4 flex items-center gap-2">
              <FileText className="h-5 w-5 text-accent-500" />
              <h3 className="font-display text-lg font-semibold text-white">Notas</h3>
            </div>
            <div className="space-y-4">
              {editMode ? (
                <>
                  <div>
                    <Label className="mb-2 block text-xs text-neutral-500">
                      Notas Internas (visivel apenas para admin)
                    </Label>
                    <Textarea
                      value={editInternalNotes}
                      onChange={(e) => setEditInternalNotes(e.target.value)}
                      placeholder="Notas internas sobre este orcamento..."
                      className="min-h-[100px]"
                    />
                  </div>
                  <div>
                    <Label className="mb-2 block text-xs text-neutral-500">
                      Observacoes do Cliente
                    </Label>
                    <Textarea
                      value={editCustomerNotes}
                      onChange={(e) => setEditCustomerNotes(e.target.value)}
                      placeholder="Observacoes do cliente..."
                      className="min-h-[100px]"
                    />
                  </div>
                </>
              ) : (
                <>
                  {quote.internalNotes && (
                    <div>
                      <p className="mb-1 text-xs text-neutral-500">Notas Internas</p>
                      <p className="whitespace-pre-wrap rounded-lg bg-yellow-500/10 p-3 text-sm text-yellow-400">
                        {quote.internalNotes}
                      </p>
                    </div>
                  )}
                  {quote.customerNotes && (
                    <div>
                      <p className="mb-1 text-xs text-neutral-500">Observacoes do Cliente</p>
                      <p className="whitespace-pre-wrap rounded-lg bg-neutral-800 p-3 text-sm text-white">
                        {quote.customerNotes}
                      </p>
                    </div>
                  )}
                  {!quote.internalNotes && !quote.customerNotes && (
                    <p className="text-sm text-neutral-500">Nenhuma nota adicionada</p>
                  )}
                </>
              )}
            </div>
          </Card>

          {/* Relacionamentos */}
          <Card className="p-6">
            <div className="mb-4 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-accent-500" />
              <h3 className="font-display text-lg font-semibold text-white">Relacionamentos</h3>
            </div>
            <div className="space-y-4">
              {linkedOrder && (
                <div className="rounded-lg bg-green-500/10 p-3">
                  <p className="mb-1 text-xs text-green-400">Pedido Gerado</p>
                  <Link
                    href={`/admin/pedidos/${linkedOrder.id}`}
                    className="text-sm font-medium text-green-400 hover:underline"
                  >
                    #{linkedOrder.number}
                  </Link>
                  <span className="ml-2 text-xs text-neutral-500">
                    Status: {linkedOrder.status}
                  </span>
                </div>
              )}

              {linkedAppointment && (
                <div className="rounded-lg bg-blue-500/10 p-3">
                  <p className="mb-1 text-xs text-blue-400">Visita Agendada</p>
                  <p className="text-sm text-white">
                    {formatDate(linkedAppointment.scheduledDate)} as{' '}
                    {linkedAppointment.scheduledTime}
                  </p>
                  <span className="text-xs text-neutral-500">
                    Tipo: {linkedAppointment.type} | Status: {linkedAppointment.status}
                  </span>
                </div>
              )}

              {aiConversation && (
                <div className="rounded-lg bg-purple-500/10 p-3">
                  <div className="mb-2 flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-purple-400" />
                    <p className="text-xs text-purple-400">Conversa com IA</p>
                  </div>
                  <p className="mb-2 text-sm text-white">{messageCount} mensagens</p>
                  <Link
                    href={`/admin/conversas-ia/${aiConversation.id}`}
                    className="text-xs text-purple-400 hover:underline"
                  >
                    Ver conversa completa
                  </Link>
                </div>
              )}

              <div>
                <p className="mb-1 text-xs text-neutral-500">Origem</p>
                <Badge variant="outline" className="text-xs">
                  {sourceLabels[quote.source] || quote.source}
                </Badge>
              </div>

              {!linkedOrder && !linkedAppointment && !aiConversation && (
                <p className="text-sm text-neutral-500">Nenhum relacionamento ainda</p>
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* Send Dialog */}
      <Dialog open={showSendDialog} onOpenChange={setShowSendDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Enviar Orcamento</DialogTitle>
            <DialogDescription>
              O orcamento <strong>#{quote.number}</strong> sera enviado para{' '}
              <strong>{quote.customerName}</strong>.
            </DialogDescription>
          </DialogHeader>

          {sendError && (
            <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-400">
              {sendError}
            </div>
          )}

          <div className="space-y-4">
            <div className="rounded-lg border border-neutral-700 bg-neutral-800/50 p-4">
              <p className="mb-3 text-sm font-medium text-white">Canais de envio:</p>
              <div className="space-y-3">
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={true}
                    disabled
                    className="h-4 w-4 rounded border-neutral-600"
                  />
                  <Mail className="h-4 w-4 text-neutral-400" />
                  <span className="text-sm text-neutral-300">Email: {quote.customerEmail}</span>
                </label>
                <label className="flex cursor-pointer items-center gap-3">
                  <input
                    type="checkbox"
                    checked={sendViaWhatsApp}
                    onChange={(e) => setSendViaWhatsApp(e.target.checked)}
                    className="h-4 w-4 rounded border-neutral-600 bg-neutral-700 text-accent-500"
                  />
                  <MessageCircle className="h-4 w-4 text-green-400" />
                  <span className="text-sm text-neutral-300">
                    WhatsApp: {quote.customerPhone || 'Nao informado'}
                  </span>
                </label>
              </div>
            </div>

            <div className="rounded-lg border border-neutral-700 bg-neutral-800/50 p-4">
              <p className="mb-2 text-sm font-medium text-white">O cliente recebera:</p>
              <ul className="space-y-1 text-sm text-neutral-400">
                <li>• Detalhes do orcamento com valores</li>
                <li>• Link para visualizar no portal</li>
                <li>• Opcao de aceitar ou recusar</li>
                <li>• Prazo de validade: {formatDate(quote.validUntil)}</li>
              </ul>
            </div>

            <Button
              variant="outline"
              onClick={() => setShowEmailPreview(true)}
              className="w-full gap-2"
            >
              <Eye className="h-4 w-4" />
              Pre-visualizar Email
            </Button>
          </div>

          <DialogFooter>
            <Button variant="ghost" onClick={() => setShowSendDialog(false)} disabled={sendLoading}>
              Cancelar
            </Button>
            <Button onClick={handleSendQuote} disabled={sendLoading} className="gap-2">
              {sendLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
              Enviar Orcamento
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Email Preview Dialog */}
      <Dialog open={showEmailPreview} onOpenChange={setShowEmailPreview}>
        <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Pre-visualizacao do Email</DialogTitle>
          </DialogHeader>
          <div className="rounded-lg border border-neutral-700 bg-neutral-900 p-4">
            <div className="mx-auto max-w-[600px] overflow-hidden rounded-lg bg-[#1a1a1a]">
              {/* Header */}
              <div className="bg-[#d4af37] p-6 text-center">
                <h1 className="text-2xl font-bold text-black">Versati Glass</h1>
              </div>
              {/* Content */}
              <div className="p-8">
                <h2 className="mb-4 text-xl text-white">Ola, {quote.customerName}!</h2>
                <p className="mb-6 text-neutral-400">
                  Seu orcamento foi preparado e esta pronto para analise. Confira os detalhes
                  abaixo:
                </p>

                <div className="mb-6 rounded-lg bg-[#252525] p-4">
                  <div className="mb-2 flex justify-between">
                    <span className="text-neutral-400">Numero do Orcamento</span>
                    <span className="font-bold text-white">#{quote.number}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Valido ate</span>
                    <span className="text-white">{formatDate(quote.validUntil)}</span>
                  </div>
                </div>

                <table className="mb-6 w-full">
                  <thead className="bg-[#252525]">
                    <tr>
                      <th className="p-3 text-left text-neutral-400">Item</th>
                      <th className="p-3 text-center text-neutral-400">Qtd</th>
                      <th className="p-3 text-right text-neutral-400">Valor</th>
                    </tr>
                  </thead>
                  <tbody>
                    {quote.items.slice(0, 5).map((item) => (
                      <tr key={item.id} className="border-b border-[#2a2a2a]">
                        <td className="p-3 text-white">{item.description}</td>
                        <td className="p-3 text-center text-white">{item.quantity}</td>
                        <td className="p-3 text-right text-white">
                          {formatCurrency(Number(item.totalPrice))}
                        </td>
                      </tr>
                    ))}
                    {quote.items.length > 5 && (
                      <tr>
                        <td colSpan={3} className="p-3 text-center text-neutral-500">
                          ... e mais {quote.items.length - 5} itens
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>

                <div className="mb-6 rounded-lg bg-[rgba(212,175,55,0.1)] p-4">
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Total</span>
                    <span className="text-2xl font-bold text-[#d4af37]">
                      {formatCurrency(Number(quote.total))}
                    </span>
                  </div>
                </div>

                <div className="text-center">
                  <span className="inline-block rounded bg-[#d4af37] px-8 py-3 font-bold text-black">
                    Ver Orcamento e Aceitar
                  </span>
                </div>
              </div>
              {/* Footer */}
              <div className="bg-[#151515] p-6 text-center">
                <p className="text-sm text-neutral-500">
                  Versati Glass - Transparencia que transforma espacos
                </p>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setShowEmailPreview(false)}>
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
