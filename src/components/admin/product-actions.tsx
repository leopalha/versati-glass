'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import {
  MoreHorizontal,
  Pencil,
  Copy,
  Trash2,
  Eye,
  EyeOff,
  Star,
  StarOff,
  Loader2,
} from 'lucide-react'
import { useToast } from '@/components/ui/toast/use-toast'
import Link from 'next/link'

interface ProductActionsProps {
  product: {
    id: string
    slug: string
    name: string
    isActive: boolean
    isFeatured: boolean
  }
}

export function ProductActions({ product }: ProductActionsProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [loadingAction, setLoadingAction] = useState<string | null>(null)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const handleToggleActive = async () => {
    setLoadingAction('active')
    try {
      const response = await fetch(`/api/products/${product.slug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !product.isActive }),
      })

      if (!response.ok) {
        throw new Error('Erro ao atualizar produto')
      }

      toast({
        title: product.isActive ? 'Produto desativado' : 'Produto ativado',
        description: product.isActive
          ? 'O produto não aparecerá mais no catálogo'
          : 'O produto agora está visível no catálogo',
      })

      router.refresh()
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Não foi possível atualizar o produto',
        variant: 'error',
      })
    } finally {
      setLoadingAction(null)
    }
  }

  const handleToggleFeatured = async () => {
    setLoadingAction('featured')
    try {
      const response = await fetch(`/api/products/${product.slug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isFeatured: !product.isFeatured }),
      })

      if (!response.ok) {
        throw new Error('Erro ao atualizar produto')
      }

      toast({
        title: product.isFeatured ? 'Removido dos destaques' : 'Adicionado aos destaques',
        description: product.isFeatured
          ? 'O produto não aparecerá mais em destaque'
          : 'O produto agora aparece em destaque na home',
      })

      router.refresh()
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Não foi possível atualizar o produto',
        variant: 'error',
      })
    } finally {
      setLoadingAction(null)
    }
  }

  const handleDuplicate = async () => {
    setLoadingAction('duplicate')
    try {
      const response = await fetch(`/api/products/${product.slug}/duplicate`, {
        method: 'POST',
      })

      if (!response.ok) {
        throw new Error('Erro ao duplicar produto')
      }

      const data = await response.json()

      toast({
        title: 'Produto duplicado',
        description: `"${data.name}" foi criado como cópia`,
      })

      router.refresh()
      // Redirecionar para editar o novo produto
      router.push(`/admin/produtos/${data.id}`)
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Não foi possível duplicar o produto',
        variant: 'error',
      })
    } finally {
      setLoadingAction(null)
    }
  }

  const handleDelete = async () => {
    setLoadingAction('delete')
    try {
      const response = await fetch(`/api/products/${product.slug}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Erro ao excluir produto')
      }

      const data = await response.json()

      toast({
        title: data.softDelete ? 'Produto desativado' : 'Produto excluído',
        description: data.softDelete
          ? 'O produto foi desativado pois possui pedidos/orçamentos vinculados'
          : 'O produto foi removido permanentemente',
      })

      setShowDeleteDialog(false)
      router.refresh()
    } catch (error) {
      toast({
        title: 'Erro',
        description: error instanceof Error ? error.message : 'Não foi possível excluir o produto',
        variant: 'error',
      })
    } finally {
      setLoadingAction(null)
    }
  }

  return (
    <>
      <div className="flex items-center gap-2">
        <Link href={`/admin/produtos/${product.id}`}>
          <Button variant="outline" size="sm">
            <Pencil className="mr-1 h-3 w-3" />
            Editar
          </Button>
        </Link>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-8 w-8 p-0">
              {loadingAction ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <MoreHorizontal className="h-4 w-4" />
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem
              onClick={handleToggleActive}
              disabled={loadingAction === 'active'}
              className="cursor-pointer"
            >
              {product.isActive ? (
                <>
                  <EyeOff className="mr-2 h-4 w-4" />
                  Desativar
                </>
              ) : (
                <>
                  <Eye className="mr-2 h-4 w-4" />
                  Ativar
                </>
              )}
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={handleToggleFeatured}
              disabled={loadingAction === 'featured'}
              className="cursor-pointer"
            >
              {product.isFeatured ? (
                <>
                  <StarOff className="mr-2 h-4 w-4" />
                  Remover destaque
                </>
              ) : (
                <>
                  <Star className="mr-2 h-4 w-4" />
                  Destacar
                </>
              )}
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={handleDuplicate}
              disabled={loadingAction === 'duplicate'}
              className="cursor-pointer"
            >
              <Copy className="mr-2 h-4 w-4" />
              Duplicar
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={() => setShowDeleteDialog(true)}
              className="cursor-pointer text-red-500 focus:text-red-500"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Excluir
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Dialog de confirmação de exclusão */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="border-neutral-700 bg-neutral-800">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Excluir produto?</AlertDialogTitle>
            <AlertDialogDescription className="text-neutral-400">
              Tem certeza que deseja excluir <strong className="text-white">{product.name}</strong>?
              <br />
              <br />
              Se o produto tiver pedidos ou orçamentos vinculados, ele será apenas desativado. Caso
              contrário, será removido permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-neutral-600 bg-neutral-700 text-white hover:bg-neutral-600">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={loadingAction === 'delete'}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              {loadingAction === 'delete' ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Excluindo...
                </>
              ) : (
                'Excluir'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
