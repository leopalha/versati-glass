import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { SupplierFormDialog } from '@/components/admin/supplier-form-dialog'
import { AdminHeader } from '@/components/admin/admin-header'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Building2, Mail, Phone, MapPin, Star, Package, ShoppingCart } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Fornecedores | Admin - Versati Glass',
  description: 'Gestão de fornecedores',
}

export default async function FornecedoresPage() {
  const session = await auth()

  if (!session?.user || (session.user.role !== 'ADMIN' && session.user.role !== 'STAFF')) {
    redirect('/login')
  }

  const suppliers = await prisma.supplier.findMany({
    orderBy: [{ isPreferred: 'desc' }, { name: 'asc' }],
    include: {
      _count: {
        select: {
          supplierQuotes: true,
          orders: true,
        },
      },
    },
  })

  const stats = {
    total: suppliers.length,
    active: suppliers.filter((s) => s.isActive).length,
    preferred: suppliers.filter((s) => s.isPreferred).length,
    totalQuotes: suppliers.reduce((sum, s) => sum + s._count.supplierQuotes, 0),
  }

  return (
    <div>
      <AdminHeader
        title="Fornecedores"
        subtitle="Gerencie seus fornecedores e solicite cotações"
        actions={<SupplierFormDialog />}
      />

      <div className="space-y-6 p-6">
        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="border-neutral-700 bg-neutral-800 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-400">Total</p>
                <p className="text-2xl font-bold text-white">{stats.total}</p>
              </div>
              <Building2 className="h-8 w-8 text-neutral-500" />
            </div>
          </Card>
          <Card className="border-neutral-700 bg-neutral-800 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-400">Ativos</p>
                <p className="text-2xl font-bold text-white">{stats.active}</p>
              </div>
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500/20">
                <div className="h-3 w-3 rounded-full bg-green-500" />
              </div>
            </div>
          </Card>
          <Card className="border-neutral-700 bg-neutral-800 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-400">Preferenciais</p>
                <p className="text-2xl font-bold text-white">{stats.preferred}</p>
              </div>
              <Star className="h-8 w-8 fill-yellow-500 text-yellow-500" />
            </div>
          </Card>
          <Card className="border-neutral-700 bg-neutral-800 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-400">Cotações</p>
                <p className="text-2xl font-bold text-white">{stats.totalQuotes}</p>
              </div>
              <Package className="h-8 w-8 text-neutral-500" />
            </div>
          </Card>
        </div>

        {/* Lista de Fornecedores */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {suppliers.map((supplier) => (
            <Card
              key={supplier.id}
              className="border-neutral-700 bg-neutral-800 p-6 transition-colors hover:border-neutral-600"
            >
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-semibold text-white">{supplier.name}</h3>
                      {supplier.isPreferred && (
                        <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                      )}
                    </div>
                    {supplier.tradeName && (
                      <p className="text-sm text-neutral-400">{supplier.tradeName}</p>
                    )}
                  </div>
                  <Badge variant={supplier.isActive ? 'default' : 'secondary'}>
                    {supplier.isActive ? 'Ativo' : 'Inativo'}
                  </Badge>
                </div>

                {/* Contato */}
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-neutral-400">
                    <Mail className="h-4 w-4" />
                    <span className="truncate">{supplier.email}</span>
                  </div>
                  {supplier.phone && (
                    <div className="flex items-center gap-2 text-neutral-400">
                      <Phone className="h-4 w-4" />
                      <span>{supplier.phone}</span>
                    </div>
                  )}
                  {supplier.city && (
                    <div className="flex items-center gap-2 text-neutral-400">
                      <MapPin className="h-4 w-4" />
                      <span>
                        {supplier.city}/{supplier.state}
                      </span>
                    </div>
                  )}
                </div>

                {/* Categorias */}
                {supplier.categories.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {supplier.categories.slice(0, 3).map((cat) => (
                      <Badge key={cat} variant="outline" className="border-neutral-600 text-xs">
                        {cat}
                      </Badge>
                    ))}
                    {supplier.categories.length > 3 && (
                      <Badge variant="outline" className="border-neutral-600 text-xs">
                        +{supplier.categories.length - 3}
                      </Badge>
                    )}
                  </div>
                )}

                {/* Stats */}
                <div className="flex items-center gap-4 border-t border-neutral-700 pt-2 text-sm">
                  <div className="flex items-center gap-1">
                    <Package className="h-4 w-4 text-neutral-500" />
                    <span className="font-medium text-white">{supplier._count.supplierQuotes}</span>
                    <span className="text-neutral-400">cotações</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <ShoppingCart className="h-4 w-4 text-neutral-500" />
                    <span className="font-medium text-white">{supplier._count.orders}</span>
                    <span className="text-neutral-400">pedidos</span>
                  </div>
                </div>

                {/* Ações */}
                <div className="flex gap-2 pt-2">
                  <SupplierFormDialog supplier={supplier} />
                  <Button variant="outline" size="sm" asChild>
                    <a href={`/admin/fornecedores/${supplier.id}`}>Detalhes</a>
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {suppliers.length === 0 && (
          <Card className="border-neutral-700 bg-neutral-800 p-12">
            <div className="space-y-4 text-center">
              <Building2 className="mx-auto h-12 w-12 text-neutral-500" />
              <div>
                <h3 className="text-lg font-semibold text-white">Nenhum fornecedor cadastrado</h3>
                <p className="text-sm text-neutral-400">
                  Cadastre fornecedores para solicitar cotações
                </p>
              </div>
              <SupplierFormDialog />
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}
