'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Upload, Loader2, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { logger, getErrorMessage } from '@/lib/logger'

interface UploadDocumentDialogProps {
  orderId?: string
  quoteId?: string
}

const documentTypes = [
  { value: 'CONTRACT', label: 'Contrato' },
  { value: 'INVOICE', label: 'Nota Fiscal' },
  { value: 'RECEIPT', label: 'Recibo' },
  { value: 'TECHNICAL_DRAWING', label: 'Desenho Técnico' },
  { value: 'PHOTO', label: 'Foto' },
  { value: 'WARRANTY', label: 'Garantia' },
  { value: 'OTHER', label: 'Outro' },
]

export function UploadDocumentDialog({ orderId, quoteId }: UploadDocumentDialogProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [type, setType] = useState('OTHER')

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0]
      setFile(selectedFile)

      // Auto-preencher título com nome do arquivo
      if (!title) {
        setTitle(selectedFile.name.replace(/\.[^/.]+$/, ''))
      }
    }
  }

  const handleUpload = async () => {
    if (!file) {
      alert('Selecione um arquivo')
      return
    }

    if (!title) {
      alert('Digite um título para o documento')
      return
    }

    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('title', title)
      formData.append('description', description)
      formData.append('type', type)
      if (orderId) formData.append('orderId', orderId)
      if (quoteId) formData.append('quoteId', quoteId)

      const response = await fetch('/api/documents', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Erro ao fazer upload')
      }

      setOpen(false)
      setFile(null)
      setTitle('')
      setDescription('')
      setType('OTHER')
      router.refresh()
    } catch (error) {
      // ARCH-P1-3: Replace 'any' with proper error handling
      const errorMsg = getErrorMessage(error)
      logger.error('[UPLOAD_DOCUMENT] Failed to upload document:', { error: errorMsg })
      alert(errorMsg || 'Erro ao fazer upload. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-2">
          <Upload className="h-4 w-4" />
          Upload Documento
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload de Documento</DialogTitle>
          <DialogDescription>
            Envie um documento relacionado a este pedido ou orçamento
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* File Input */}
          <div>
            <Label>Arquivo *</Label>
            <div className="mt-2">
              <Input
                type="file"
                onChange={handleFileChange}
                accept=".pdf,.jpg,.jpeg,.png,.webp,.doc,.docx"
              />
            </div>
            {file && (
              <div className="text-theme-secondary mt-2 flex items-center gap-2 text-sm">
                <FileText className="h-4 w-4" />
                <span className="truncate">{file.name}</span>
                <span className="text-xs">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
              </div>
            )}
            <p className="text-theme-secondary mt-1 text-xs">
              PDF, imagens ou documentos (máx 10MB)
            </p>
          </div>

          {/* Title */}
          <div>
            <Label>Título *</Label>
            <Input
              placeholder="Ex: Contrato de Instalação"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1"
            />
          </div>

          {/* Type */}
          <div>
            <Label>Tipo de Documento</Label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {documentTypes.map((docType) => (
                  <SelectItem key={docType.value} value={docType.value}>
                    {docType.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Description */}
          <div>
            <Label>Descrição (opcional)</Label>
            <Textarea
              placeholder="Informações adicionais sobre o documento..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 min-h-[80px]"
            />
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={loading}>
            Cancelar
          </Button>
          <Button type="button" onClick={handleUpload} disabled={loading || !file || !title}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Enviando...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Enviar Documento
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
