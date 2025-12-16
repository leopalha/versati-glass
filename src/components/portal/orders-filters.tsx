'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Search, Filter, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'

const statusOptions = [
  { value: 'all', label: 'Todos os Status' },
  { value: 'PENDENTE', label: 'Pendente' },
  { value: 'APROVADO', label: 'Aprovado' },
  { value: 'EM_PRODUCAO', label: 'Em Produção' },
  { value: 'PRONTO_ENTREGA', label: 'Pronto para Entrega' },
  { value: 'INSTALACAO_AGENDADA', label: 'Instalação Agendada' },
  { value: 'EM_INSTALACAO', label: 'Em Instalação' },
  { value: 'CONCLUIDO', label: 'Concluído' },
  { value: 'CANCELADO', label: 'Cancelado' },
]

const sortOptions = [
  { value: 'newest', label: 'Mais Recentes' },
  { value: 'oldest', label: 'Mais Antigos' },
  { value: 'highest', label: 'Maior Valor' },
  { value: 'lowest', label: 'Menor Valor' },
]

export function OrdersFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [search, setSearch] = useState(searchParams.get('search') || '')
  const [status, setStatus] = useState(searchParams.get('status') || 'all')
  const [sort, setSort] = useState(searchParams.get('sort') || 'newest')
  const [showFilters, setShowFilters] = useState(false)

  const activeFiltersCount =
    (search ? 1 : 0) + (status !== 'all' ? 1 : 0) + (sort !== 'newest' ? 1 : 0)

  const applyFilters = () => {
    const params = new URLSearchParams()

    if (search) params.set('search', search)
    if (status && status !== 'all') params.set('status', status)
    if (sort && sort !== 'newest') params.set('sort', sort)

    router.push(`/portal/pedidos?${params.toString()}`)
  }

  const clearFilters = () => {
    setSearch('')
    setStatus('all')
    setSort('newest')
    router.push('/portal/pedidos')
  }

  // Auto-apply filters when they change
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      applyFilters()
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [search, status, sort])

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="text-theme-secondary absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
          <Input
            placeholder="Buscar por número do pedido..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Filter Toggle */}
        <Button variant="outline" onClick={() => setShowFilters(!showFilters)} className="gap-2">
          <Filter className="h-4 w-4" />
          Filtros
          {activeFiltersCount > 0 && (
            <Badge variant="secondary" className="ml-1">
              {activeFiltersCount}
            </Badge>
          )}
        </Button>

        {/* Clear Filters */}
        {activeFiltersCount > 0 && (
          <Button variant="ghost" onClick={clearFilters} className="gap-2">
            <X className="h-4 w-4" />
            Limpar
          </Button>
        )}
      </div>

      {/* Expanded Filters */}
      {showFilters && (
        <div className="bg-theme-elevated border-theme-default grid grid-cols-1 gap-3 rounded-lg border p-4 sm:grid-cols-2">
          <div>
            <label className="text-theme-primary mb-2 block text-sm font-medium">Status</label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-theme-primary mb-2 block text-sm font-medium">Ordenar por</label>
            <Select value={sort} onValueChange={setSort}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      {/* Active Filters Display */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap gap-2">
          {search && (
            <Badge variant="secondary" className="gap-1">
              Busca: {search}
              <button onClick={() => setSearch('')} className="ml-1 hover:text-accent-500">
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {status !== 'all' && (
            <Badge variant="secondary" className="gap-1">
              Status: {statusOptions.find((o) => o.value === status)?.label || status}
              <button onClick={() => setStatus('all')} className="ml-1 hover:text-accent-500">
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {sort !== 'newest' && (
            <Badge variant="secondary" className="gap-1">
              Ordenação: {sortOptions.find((o) => o.value === sort)?.label || sort}
              <button onClick={() => setSort('newest')} className="ml-1 hover:text-accent-500">
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
        </div>
      )}
    </div>
  )
}
