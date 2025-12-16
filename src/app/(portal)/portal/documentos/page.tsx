import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { PortalHeader } from '@/components/portal/portal-header'
import { Card } from '@/components/ui/card'
import {
  FileText,
  Download,
  Calendar,
  File,
  Shield,
  Receipt,
  Image,
} from 'lucide-react'

const typeIcons: Record<string, typeof FileText> = {
  CONTRATO: FileText,
  GARANTIA: Shield,
  NOTA_FISCAL: Receipt,
  ORCAMENTO_PDF: FileText,
  FOTO: Image,
  OUTRO: File,
}

const typeLabels: Record<string, string> = {
  CONTRATO: 'Contrato',
  GARANTIA: 'Garantia',
  NOTA_FISCAL: 'Nota Fiscal',
  ORCAMENTO_PDF: 'Orcamento',
  FOTO: 'Foto',
  OUTRO: 'Documento',
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export default async function DocumentosPage() {
  const session = await auth()

  if (!session?.user?.id) {
    return null
  }

  const documents = await prisma.document.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' },
    include: {
      order: {
        select: {
          id: true,
          number: true,
        },
      },
      quote: {
        select: {
          id: true,
          number: true,
        },
      },
    },
  })

  // Group by type
  const groupedDocuments = documents.reduce(
    (acc, doc) => {
      const type = doc.type
      if (!acc[type]) acc[type] = []
      acc[type].push(doc)
      return acc
    },
    {} as Record<string, typeof documents>
  )

  return (
    <div>
      <PortalHeader title="Documentos" subtitle={`${documents.length} documento(s)`} />

      <div className="p-6">
        {documents.length === 0 ? (
          <Card className="flex flex-col items-center justify-center p-12 text-center">
            <FileText className="mb-4 h-16 w-16 text-neutral-600" />
            <h3 className="mb-2 font-display text-xl font-semibold text-white">
              Nenhum documento
            </h3>
            <p className="text-neutral-700">
              Seus documentos aparecerao aqui
            </p>
          </Card>
        ) : (
          <div className="space-y-8">
            {Object.entries(groupedDocuments).map(([type, docs]) => {
              const Icon = typeIcons[type] || File

              return (
                <div key={type}>
                  <h2 className="mb-4 flex items-center gap-2 font-display text-lg font-semibold text-white">
                    <Icon className="h-5 w-5 text-gold-500" />
                    {typeLabels[type] || type}
                  </h2>

                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {docs.map((doc) => (
                      <Card key={doc.id} className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-neutral-200">
                              <Icon className="h-5 w-5 text-neutral-700" />
                            </div>
                            <div>
                              <p className="font-medium text-white">{doc.name}</p>
                              <div className="mt-1 flex items-center gap-2 text-xs text-neutral-600">
                                <span>{formatFileSize(doc.size)}</span>
                                <span>-</span>
                                <span className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  {new Date(doc.createdAt).toLocaleDateString('pt-BR')}
                                </span>
                              </div>
                              {(doc.order || doc.quote) && (
                                <p className="mt-1 text-xs text-neutral-700">
                                  {doc.order
                                    ? `Pedido #${doc.order.number}`
                                    : `Orcamento #${doc.quote?.number}`}
                                </p>
                              )}
                            </div>
                          </div>

                          <a
                            href={doc.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex h-8 w-8 items-center justify-center rounded-lg text-neutral-700 hover:bg-neutral-200 hover:text-white"
                          >
                            <Download className="h-4 w-4" />
                          </a>
                        </div>

                        {doc.status === 'PENDING' && doc.type === 'CONTRATO' && (
                          <div className="mt-3 rounded-lg bg-yellow-500/10 p-2">
                            <p className="text-xs text-yellow-400">
                              Aguardando assinatura
                            </p>
                          </div>
                        )}

                        {doc.signedAt && (
                          <div className="mt-3 rounded-lg bg-green-500/10 p-2">
                            <p className="text-xs text-green-400">
                              Assinado em{' '}
                              {new Date(doc.signedAt).toLocaleDateString('pt-BR')}
                            </p>
                          </div>
                        )}
                      </Card>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
