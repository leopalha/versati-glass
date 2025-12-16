import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { PortalHeader } from '@/components/portal/portal-header'
import { Card } from '@/components/ui/card'
import { formatCurrency } from '@/lib/utils'
import { FileText, Eye, Calendar, AlertCircle, CheckCircle, XCircle, Clock } from 'lucide-react'
import Link from 'next/link'

const statusLabels: Record<string, { label: string; color: string; icon: typeof Clock }> = {
  DRAFT: { label: 'Rascunho', color: 'bg-neutral-500/20 text-neutral-400', icon: Clock },
  SENT: { label: 'Aguardando Resposta', color: 'bg-yellow-500/20 text-yellow-400', icon: AlertCircle },
  VIEWED: { label: 'Visualizado', color: 'bg-blue-500/20 text-blue-400', icon: Eye },
  ACCEPTED: { label: 'Aceito', color: 'bg-green-500/20 text-green-400', icon: CheckCircle },
  REJECTED: { label: 'Recusado', color: 'bg-red-500/20 text-red-400', icon: XCircle },
  EXPIRED: { label: 'Expirado', color: 'bg-neutral-500/20 text-neutral-400', icon: Clock },
  CONVERTED: { label: 'Convertido', color: 'bg-gold-500/20 text-gold-400', icon: CheckCircle },
}

export default async function OrcamentosPage() {
  const session = await auth()

  if (!session?.user?.id) {
    return null
  }

  const quotes = await prisma.quote.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' },
    include: {
      items: true,
    },
  })

  return (
    <div>
      <PortalHeader title="Orcamentos" subtitle={`${quotes.length} orcamento(s)`} />

      <div className="p-6">
        {quotes.length === 0 ? (
          <Card className="flex flex-col items-center justify-center p-12 text-center">
            <FileText className="mb-4 h-16 w-16 text-neutral-600" />
            <h3 className="mb-2 font-display text-xl font-semibold text-white">
              Nenhum orcamento ainda
            </h3>
            <p className="mb-4 text-neutral-700">
              Solicite seu primeiro orcamento
            </p>
            <Link
              href="/orcamento"
              className="rounded-lg bg-gold-500 px-6 py-2 font-medium text-black hover:bg-gold-400"
            >
              Solicitar Orcamento
            </Link>
          </Card>
        ) : (
          <div className="space-y-4">
            {quotes.map((quote) => {
              const statusInfo = statusLabels[quote.status] || statusLabels.DRAFT
              const StatusIcon = statusInfo.icon
              const isExpired = new Date(quote.validUntil) < new Date() && quote.status === 'SENT'

              return (
                <Card key={quote.id} className="p-6">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <div className="flex items-center gap-3">
                        <h3 className="font-display text-lg font-semibold text-white">
                          Orcamento #{quote.number}
                        </h3>
                        <span
                          className={`flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${
                            isExpired ? 'bg-red-500/20 text-red-400' : statusInfo.color
                          }`}
                        >
                          <StatusIcon className="h-3 w-3" />
                          {isExpired ? 'Expirado' : statusInfo.label}
                        </span>
                      </div>
                      <div className="mt-2 flex items-center gap-4 text-sm text-neutral-700">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {new Date(quote.createdAt).toLocaleDateString('pt-BR')}
                        </span>
                        <span>{quote.items.length} item(s)</span>
                        <span>
                          Valido ate:{' '}
                          {new Date(quote.validUntil).toLocaleDateString('pt-BR')}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm text-neutral-700">Total</p>
                        <p className="font-display text-xl font-bold text-gold-500">
                          {formatCurrency(Number(quote.total))}
                        </p>
                      </div>
                      <Link
                        href={`/portal/orcamentos/${quote.id}`}
                        className="flex items-center gap-2 rounded-lg border border-gold-500 px-4 py-2 text-gold-500 transition-colors hover:bg-gold-500 hover:text-black"
                      >
                        <Eye className="h-4 w-4" />
                        <span>Ver Detalhes</span>
                      </Link>
                    </div>
                  </div>

                  {/* Action hints */}
                  {quote.status === 'SENT' && !isExpired && (
                    <div className="mt-4 rounded-lg bg-yellow-500/10 p-3">
                      <p className="flex items-center gap-2 text-sm text-yellow-400">
                        <AlertCircle className="h-4 w-4" />
                        Este orcamento aguarda sua aprovacao. Clique em &quot;Ver Detalhes&quot; para aceitar ou recusar.
                      </p>
                    </div>
                  )}
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
