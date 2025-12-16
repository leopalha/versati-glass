import { prisma } from '@/lib/prisma'
import { AdminHeader } from '@/components/admin/admin-header'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { SendQuoteButton } from '@/components/admin/send-quote-button'
import { ConvertQuoteButton } from '@/components/admin/convert-quote-button'
import { formatCurrency } from '@/lib/utils'
import {
  FileText,
  Eye,
  Calendar,
  Clock,
  Plus,
  CheckCircle,
  XCircle,
  AlertCircle,
} from 'lucide-react'
import Link from 'next/link'

const statusLabels: Record<string, { label: string; color: string; icon: typeof Clock }> = {
  DRAFT: { label: 'Rascunho', color: 'bg-neutral-500/20 text-neutral-700', icon: Clock },
  SENT: { label: 'Enviado', color: 'bg-blue-500/20 text-blue-400', icon: AlertCircle },
  VIEWED: { label: 'Visualizado', color: 'bg-purple-500/20 text-purple-400', icon: Eye },
  ACCEPTED: { label: 'Aceito', color: 'bg-green-500/20 text-green-400', icon: CheckCircle },
  REJECTED: { label: 'Recusado', color: 'bg-red-500/20 text-red-400', icon: XCircle },
  EXPIRED: { label: 'Expirado', color: 'bg-neutral-500/20 text-neutral-700', icon: Clock },
  CONVERTED: { label: 'Convertido', color: 'bg-gold-500/20 text-gold-400', icon: CheckCircle },
}

export default async function AdminOrcamentosPage() {
  const quotes = await prisma.quote.findMany({
    orderBy: { createdAt: 'desc' },
    take: 50,
    include: {
      items: true,
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
        },
      },
    },
  })

  const stats = await prisma.quote.groupBy({
    by: ['status'],
    _count: true,
  })

  const statusCounts = stats.reduce(
    (acc, curr) => {
      acc[curr.status] = curr._count
      return acc
    },
    {} as Record<string, number>
  )

  const pendingCount = (statusCounts['SENT'] || 0) + (statusCounts['VIEWED'] || 0)

  return (
    <div>
      <AdminHeader
        title="Orcamentos"
        subtitle={`${quotes.length} orcamento(s)`}
        actions={
          <Button size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Novo Orcamento
          </Button>
        }
      />

      <div className="p-6">
        {/* Status filters */}
        <div className="mb-6 flex flex-wrap gap-2">
          <Link
            href="/admin/orcamentos"
            className="rounded-lg bg-gold-500/10 px-3 py-1.5 text-sm font-medium text-gold-500"
          >
            Todos ({quotes.length})
          </Link>
          <Link
            href="/admin/orcamentos?status=pending"
            className={`rounded-lg px-3 py-1.5 text-sm font-medium ${
              pendingCount > 0
                ? 'bg-yellow-500/10 text-yellow-400'
                : 'bg-neutral-200 text-neutral-700'
            }`}
          >
            Pendentes ({pendingCount})
          </Link>
          {Object.entries(statusLabels).map(([status, { label }]) => {
            const count = statusCounts[status] || 0
            if (count === 0) return null
            return (
              <Link
                key={status}
                href={`/admin/orcamentos?status=${status}`}
                className="hover:bg-neutral-250 rounded-lg bg-neutral-200 px-3 py-1.5 text-sm text-neutral-700 hover:text-white"
              >
                {label} ({count})
              </Link>
            )
          })}
        </div>

        {quotes.length === 0 ? (
          <Card className="flex flex-col items-center justify-center p-12 text-center">
            <FileText className="mb-4 h-16 w-16 text-neutral-600" />
            <h3 className="mb-2 font-display text-xl font-semibold text-white">Nenhum orcamento</h3>
            <p className="text-neutral-700">Os orcamentos aparecerao aqui</p>
          </Card>
        ) : (
          <div className="overflow-hidden rounded-lg border border-neutral-400">
            <table className="w-full">
              <thead className="bg-neutral-200">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-neutral-700">
                    Orcamento
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-neutral-700">
                    Cliente
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-neutral-700">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-neutral-700">
                    Total
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-neutral-700">
                    Validade
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-neutral-700">
                    Criado
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-neutral-700">
                    Acoes
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-300">
                {quotes.map((quote) => {
                  const statusInfo = statusLabels[quote.status] || statusLabels.DRAFT
                  const StatusIcon = statusInfo.icon
                  const isExpired =
                    new Date(quote.validUntil) < new Date() &&
                    ['SENT', 'VIEWED'].includes(quote.status)

                  return (
                    <tr key={quote.id} className="hover:bg-neutral-200/50">
                      <td className="px-4 py-3">
                        <p className="font-medium text-white">#{quote.number}</p>
                        <p className="text-xs text-neutral-600">{quote.items.length} item(s)</p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-white">{quote.customerName}</p>
                        <p className="text-xs text-neutral-600">{quote.customerEmail}</p>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`flex w-fit items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${
                            isExpired ? 'bg-red-500/20 text-red-400' : statusInfo.color
                          }`}
                        >
                          <StatusIcon className="h-3 w-3" />
                          {isExpired ? 'Expirado' : statusInfo.label}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-medium text-white">
                          {formatCurrency(Number(quote.total))}
                        </p>
                      </td>
                      <td className="px-4 py-3">
                        <div
                          className={`flex items-center gap-1 text-sm ${
                            isExpired ? 'text-red-400' : 'text-neutral-700'
                          }`}
                        >
                          <Clock className="h-4 w-4" />
                          {new Date(quote.validUntil).toLocaleDateString('pt-BR')}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1 text-sm text-neutral-700">
                          <Calendar className="h-4 w-4" />
                          {new Date(quote.createdAt).toLocaleDateString('pt-BR')}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-2">
                          <SendQuoteButton
                            quoteId={quote.id}
                            quoteNumber={quote.number}
                            customerName={quote.customerName}
                            customerEmail={quote.customerEmail}
                            status={quote.status}
                          />
                          <ConvertQuoteButton
                            quoteId={quote.id}
                            quoteNumber={quote.number}
                            customerName={quote.customerName}
                            status={quote.status}
                          />
                          <Link
                            href={`/admin/orcamentos/${quote.id}`}
                            className="inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm text-gold-500 hover:bg-gold-500/10"
                          >
                            <Eye className="h-4 w-4" />
                            Ver
                          </Link>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
