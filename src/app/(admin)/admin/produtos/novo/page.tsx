import Link from 'next/link'
import { ProductForm } from '@/components/admin/product-form'
import { AdminHeader } from '@/components/admin/admin-header'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'

export default function NovoProdutoPage() {
  return (
    <div>
      <AdminHeader
        title="Novo Produto"
        subtitle="Adicione um novo produto ao catálogo"
        actions={
          <Link href="/admin/produtos">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar
            </Button>
          </Link>
        }
      />

      <div className="p-6">
        <ProductForm mode="create" />
      </div>
    </div>
  )
}
