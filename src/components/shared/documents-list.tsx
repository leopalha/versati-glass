'use client'

import { memo, useCallback } from 'react'
import { Download, FileText, Image, FileCheck, Calendar } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

interface Document {
  id: string
  title: string
  description?: string | null
  type: string
  fileUrl: string
  fileName: string
  fileSize: number
  mimeType: string
  createdAt: Date
}

interface DocumentsListProps {
  documents: Document[]
  emptyMessage?: string
}

const documentTypeLabels: Record<string, string> = {
  CONTRACT: 'Contrato',
  INVOICE: 'Nota Fiscal',
  RECEIPT: 'Recibo',
  TECHNICAL_DRAWING: 'Desenho Técnico',
  PHOTO: 'Foto',
  WARRANTY: 'Garantia',
  OTHER: 'Outro',
}

const documentTypeColors: Record<string, string> = {
  CONTRACT: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  INVOICE: 'bg-green-500/20 text-green-400 border-green-500/30',
  RECEIPT: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  TECHNICAL_DRAWING: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  PHOTO: 'bg-pink-500/20 text-pink-400 border-pink-500/30',
  WARRANTY: 'bg-accent-500/20 text-accent-400 border-accent-500/30',
  OTHER: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
}

function getFileIcon(mimeType: string) {
  if (mimeType.startsWith('image/')) {
    return <Image className="h-5 w-5" />
  }
  if (mimeType === 'application/pdf') {
    return <FileText className="h-5 w-5" />
  }
  return <FileCheck className="h-5 w-5" />
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`
}

export const DocumentsList = memo(function DocumentsList({
  documents,
  emptyMessage = 'Nenhum documento disponível',
}: DocumentsListProps) {
  const handleDownload = useCallback((doc: Document) => {
    // Abrir em nova aba para download
    window.open(doc.fileUrl, '_blank')
  }, [])

  if (documents.length === 0) {
    return (
      <div className="py-12 text-center">
        <FileText className="text-theme-secondary mx-auto mb-3 h-12 w-12 opacity-50" />
        <p className="text-theme-secondary">{emptyMessage}</p>
      </div>
    )
  }

  return (
    <div className="grid gap-4">
      {documents.map((doc) => (
        <Card
          key={doc.id}
          className="bg-theme-secondary border-theme-default hover:border-accent-500/30 p-4 transition-colors"
        >
          <div className="flex items-start gap-4">
            {/* Icon */}
            <div className="bg-theme-elevated border-theme-default flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg border text-accent-500">
              {getFileIcon(doc.mimeType)}
            </div>

            {/* Info */}
            <div className="min-w-0 flex-1">
              <div className="mb-2 flex items-start justify-between gap-2">
                <div>
                  <h4 className="text-theme-primary truncate text-sm font-semibold">{doc.title}</h4>
                  <p className="text-theme-secondary mt-1 text-xs">{doc.fileName}</p>
                </div>

                <Badge
                  variant="secondary"
                  className={documentTypeColors[doc.type] || documentTypeColors.OTHER}
                >
                  {documentTypeLabels[doc.type] || 'Outro'}
                </Badge>
              </div>

              {doc.description && (
                <p className="text-theme-secondary mb-2 line-clamp-2 text-sm">{doc.description}</p>
              )}

              <div className="mt-3 flex items-center justify-between gap-4">
                <div className="text-theme-secondary flex items-center gap-4 text-xs">
                  <span>{formatFileSize(doc.fileSize)}</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {new Date(doc.createdAt).toLocaleDateString('pt-BR', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </span>
                </div>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDownload(doc)}
                  className="gap-2"
                >
                  <Download className="h-3 w-3" />
                  Download
                </Button>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
})
