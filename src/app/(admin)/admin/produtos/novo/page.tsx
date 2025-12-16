import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ProductForm } from '@/components/admin/product-form'

export default function NovoProdutoPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Novo Produto</h1>
        <p className="text-neutral-500 dark:text-neutral-400">
          Adicione um novo produto ao catálogo
        </p>
      </div>

      {/* Form */}
      <ProductForm mode="create" />
    </div>
  )
}
