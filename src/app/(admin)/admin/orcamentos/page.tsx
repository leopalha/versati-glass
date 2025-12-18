import { prisma } from '@/lib/prisma'
import { AdminHeader } from '@/components/admin/admin-header'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { SendQuoteButton } from '@/components/admin/send-quote-button'
import { ConvertQuoteButton } from '@/components/admin/convert-quote-button'
import { CancelQuoteButton } from '@/components/admin/cancel-quote-button'
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
  Bot,
} from 'lucide-react'
import Link from 'next/link'

const statusLabels: Record<string, { label: string; color: string; icon: typeof Clock }> = {
  DRAFT: { label: 'Rascunho', color: 'bg-neutral-500/20 text-neutral-400', icon: Clock },
  SENT: { label: 'Enviado', color: 'bg-blue-500/20 text-blue-400', icon: AlertCircle },
  VIEWED: { label: 'Visualizado', color: 'bg-purple-500/20 text-purple-400', icon: Eye },
  ACCEPTED: { label: 'Aceito', color: 'bg-green-500/20 text-green-400', icon: CheckCircle },
  REJECTED: { label: 'Recusado', color: 'bg-red-500/20 text-red-400', icon: XCircle },
  CANCELLED: { label: 'Cancelado', color: 'bg-red-500/20 text-red-400', icon: XCircle },
  EXPIRED: { label: 'Expirado', color: 'bg-neutral-500/20 text-neutral-400', icon: Clock },
  CONVERTED: { label: 'Convertido', color: 'bg-accent-500/20 text-accent-500', icon: CheckCircle },
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

  // AI-CHAT P2.1: Get AI-generated quotes
  const aiConversations = await prisma.aiConversation.findMany({
    where: {
      quoteId: { in: quotes.map((q) => q.id) },
    },
    select: {
      quoteId: true,
    },
  })

  const aiQuoteIds = new Set(aiConversations.map((c) => c.quoteId))

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
            className="bg-accent-500/10 hover:bg-accent-500/20 rounded-lg px-3 py-1.5 text-sm font-medium text-accent-500 transition-colors"
          >
            Todos ({quotes.length})
          </Link>
          <Link
            href="/admin/orcamentos?status=pending"
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
              pendingCount > 0
                ? 'bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/20'
                : 'bg-neutral-700/50 text-neutral-400 hover:bg-neutral-700'
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
                className="rounded-lg bg-neutral-700/50 px-3 py-1.5 text-sm text-neutral-300 transition-colors hover:bg-neutral-600 hover:text-white"
              >
                {label} ({count})
              </Link>
            )
          })}
        </div>

        {quotes.length === 0 ? (
          <Card className="flex flex-col items-center justify-center p-12 text-center">
            <FileText className="mb-4 h-16 w-16 text-neutral-500" />
            <h3 className="mb-2 font-display text-xl font-semibold text-white">Nenhum orcamento</h3>
            <p className="text-neutral-400">Os orcamentos aparecerao aqui</p>
          </Card>
        ) : (
          <div className="overflow-hidden rounded-lg border border-neutral-700">
            <table className="w-full">
              <thead className="bg-neutral-800/80">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-neutral-400">
                    Orcamento
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-neutral-400">
                    Cliente
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-neutral-400">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-neutral-400">
                    Total
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-neutral-400">
                    Validade
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-neutral-400">
                    Criado
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-neutral-400">
                    Acoes
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-700/50">
                {quotes.map((quote) => {
                  const statusInfo = statusLabels[quote.status] || statusLabels.DRAFT
                  const StatusIcon = statusInfo.icon
                  const isExpired =
                    new Date(quote.validUntil) < new Date() &&
                    ['SENT', 'VIEWED'].includes(quote.status)
                  const isAiGenerated = aiQuoteIds.has(quote.id)

                  return (
                    <tr key={quote.id} className="transition-colors hover:bg-neutral-800/50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div>
                            <Link
                              href={`/admin/orcamentos/${quote.id}`}
                              className="font-medium text-white transition-colors hover:text-accent-500"
                            >
                              #{quote.number}
                            </Link>
                            <p className="text-xs text-neutral-500">{quote.items.length} item(s)</p>
                          </div>
                          {isAiGenerated && (
                            <span
                              className="flex items-center gap-1 rounded-full bg-purple-500/20 px-2 py-0.5 text-xs font-medium text-purple-400"
                              title="Gerado via Chat IA"
                            >
                              <Bot className="h-3 w-3" />
                              IA
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-white">{quote.customerName}</p>
                        <p className="text-xs text-neutral-500">{quote.customerEmail}</p>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`flex w-fit items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${
                            isExpired ? 'bg-red-500/20 text-red-400' : statusInfo.color
                          }`}
                        >
                          <StatusIcon className="h-3 w-3" />
                          {isExpired ? 'Expirado' : statusInfo.label}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-medium text-accent-500">
                          {formatCurrency(Number(quote.total))}
                        </p>
                      </td>
                      <td className="px-4 py-3">
                        <div
                          className={`flex items-center gap-1.5 text-sm ${
                            isExpired ? 'text-red-400' : 'text-neutral-400'
                          }`}
                        >
                          <Clock className="h-4 w-4" />
                          {new Date(quote.validUntil).toLocaleDateString('pt-BR')}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5 text-sm text-neutral-400">
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
                          <CancelQuoteButton
                            quoteId={quote.id}
                            quoteNumber={quote.number}
                            customerName={quote.customerName}
                            status={quote.status}
                          />
                          <Link
                            href={`/admin/orcamentos/${quote.id}`}
                            className="hover:bg-accent-500/10 inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm text-accent-500 transition-colors"
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
