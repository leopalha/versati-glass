'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Filter, X } from 'lucide-react'

const statusOptions = [
  { value: '', label: 'Todos os status' },
  { value: 'ORCAMENTO_ENVIADO', label: 'Orçamento Enviado' },
  { value: 'AGUARDANDO_PAGAMENTO', label: 'Aguardando Pagamento' },
  { value: 'APROVADO', label: 'Aprovado' },
  { value: 'EM_PRODUCAO', label: 'Em Produção' },
  { value: 'PRONTO_ENTREGA', label: 'Pronto para Entrega' },
  { value: 'INSTALACAO_AGENDADA', label: 'Instalação Agendada' },
  { value: 'INSTALANDO', label: 'Instalando' },
  { value: 'CONCLUIDO', label: 'Concluído' },
  { value: 'CANCELADO', label: 'Cancelado' },
]

const paymentStatusOptions = [
  { value: '', label: 'Todos os pagamentos' },
  { value: 'PENDING', label: 'Pendente' },
  { value: 'PARTIAL', label: 'Parcial' },
  { value: 'PAID', label: 'Pago' },
  { value: 'REFUNDED', label: 'Estornado' },
]

export function OrdersFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [open, setOpen] = useState(false)

  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    status: searchParams.get('status') || '',
    paymentStatus: searchParams.get('paymentStatus') || '',
    dateFrom: searchParams.get('dateFrom') || '',
    dateTo: searchParams.get('dateTo') || '',
  })

  const handleApplyFilters = () => {
    const params = new URLSearchParams()

    if (filters.search) params.set('search', filters.search)
    if (filters.status) params.set('status', filters.status)
    if (filters.paymentStatus) params.set('paymentStatus', filters.paymentStatus)
    if (filters.dateFrom) params.set('dateFrom', filters.dateFrom)
    if (filters.dateTo) params.set('dateTo', filters.dateTo)

    router.push(`/admin/pedidos?${params.toString()}`)
    setOpen(false)
  }

  const handleClearFilters = () => {
    setFilters({
      search: '',
      status: '',
      paymentStatus: '',
      dateFrom: '',
      dateTo: '',
    })
    router.push('/admin/pedidos')
    setOpen(false)
  }

  const hasActiveFilters =
    filters.search || filters.status || filters.paymentStatus || filters.dateFrom || filters.dateTo

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="relative">
          <Filter className="mr-2 h-4 w-4" />
          Filtrar
          {hasActiveFilters && (
            <span className="ml-2 flex h-5 w-5 items-center justify-center rounded-full bg-gold-500 text-xs text-black">
              {
                [
                  filters.search,
                  filters.status,
                  filters.paymentStatus,
                  filters.dateFrom,
                  filters.dateTo,
                ].filter(Boolean).length
              }
            </span>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Filtrar Pedidos</DialogTitle>
          <DialogDescription>
            Use os filtros abaixo para refinar a lista de pedidos
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* Search */}
          <div className="grid gap-2">
            <label className="text-sm font-medium">Buscar</label>
            <Input
              placeholder="Número do pedido, nome ou email do cliente..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            />
          </div>

          {/* Status */}
          <div className="grid gap-2">
            <label className="text-sm font-medium">Status do Pedido</label>
            <select
              className="border-theme-default placeholder:text-theme-secondary flex h-10 w-full rounded-md border bg-transparent px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 focus-visible:ring-offset-2"
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Payment Status */}
          <div className="grid gap-2">
            <label className="text-sm font-medium">Status do Pagamento</label>
            <select
              className="border-theme-default placeholder:text-theme-secondary flex h-10 w-full rounded-md border bg-transparent px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 focus-visible:ring-offset-2"
              value={filters.paymentStatus}
              onChange={(e) => setFilters({ ...filters, paymentStatus: e.target.value })}
            >
              {paymentStatusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <label className="text-sm font-medium">Data Inicial</label>
              <Input
                type="date"
                value={filters.dateFrom}
                onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium">Data Final</label>
              <Input
                type="date"
                value={filters.dateTo}
                onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
              />
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          {hasActiveFilters && (
            <Button variant="outline" onClick={handleClearFilters}>
              <X className="mr-2 h-4 w-4" />
              Limpar
            </Button>
          )}
          <Button onClick={handleApplyFilters}>Aplicar Filtros</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
