import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { SupplierFormDialog } from '@/components/admin/supplier-form-dialog'
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
    orderBy: [
      { isPreferred: 'desc' },
      { name: 'asc' },
    ],
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
    active: suppliers.filter(s => s.isActive).length,
    preferred: suppliers.filter(s => s.isPreferred).length,
    totalQuotes: suppliers.reduce((sum, s) => sum + s._count.supplierQuotes, 0),
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Fornecedores</h1>
          <p className="text-muted-foreground">
            Gerencie seus fornecedores e solicite cotações
          </p>
        </div>
        <SupplierFormDialog />
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total</p>
              <p className="text-2xl font-bold">{stats.total}</p>
            </div>
            <Building2 className="h-8 w-8 text-muted-foreground" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Ativos</p>
              <p className="text-2xl font-bold">{stats.active}</p>
            </div>
            <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
              <div className="h-3 w-3 rounded-full bg-green-500" />
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Preferenciais</p>
              <p className="text-2xl font-bold">{stats.preferred}</p>
            </div>
            <Star className="h-8 w-8 text-yellow-500 fill-yellow-500" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Cotações</p>
              <p className="text-2xl font-bold">{stats.totalQuotes}</p>
            </div>
            <Package className="h-8 w-8 text-muted-foreground" />
          </div>
        </Card>
      </div>

      {/* Lista de Fornecedores */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {suppliers.map((supplier) => (
          <Card key={supplier.id} className="p-6 hover:shadow-lg transition-shadow">
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-lg">{supplier.name}</h3>
                    {supplier.isPreferred && (
                      <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                    )}
                  </div>
                  {supplier.tradeName && (
                    <p className="text-sm text-muted-foreground">{supplier.tradeName}</p>
                  )}
                </div>
                <Badge variant={supplier.isActive ? 'default' : 'secondary'}>
                  {supplier.isActive ? 'Ativo' : 'Inativo'}
                </Badge>
              </div>

              {/* Contato */}
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  <span className="truncate">{supplier.email}</span>
                </div>
                {supplier.phone && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Phone className="h-4 w-4" />
                    <span>{supplier.phone}</span>
                  </div>
                )}
                {supplier.city && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{supplier.city}/{supplier.state}</span>
                  </div>
                )}
              </div>

              {/* Categorias */}
              {supplier.categories.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {supplier.categories.slice(0, 3).map((cat) => (
                    <Badge key={cat} variant="outline" className="text-xs">
                      {cat}
                    </Badge>
                  ))}
                  {supplier.categories.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{supplier.categories.length - 3}
                    </Badge>
                  )}
                </div>
              )}

              {/* Stats */}
              <div className="flex items-center gap-4 pt-2 border-t text-sm">
                <div className="flex items-center gap-1">
                  <Package className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{supplier._count.supplierQuotes}</span>
                  <span className="text-muted-foreground">cotações</span>
                </div>
                <div className="flex items-center gap-1">
                  <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{supplier._count.orders}</span>
                  <span className="text-muted-foreground">pedidos</span>
                </div>
              </div>

              {/* Ações */}
              <div className="flex gap-2 pt-2">
                <SupplierFormDialog supplier={supplier} />
                <Button variant="outline" size="sm" asChild>
                  <a href={`/admin/fornecedores/${supplier.id}`}>
                    Detalhes
                  </a>
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {suppliers.length === 0 && (
        <Card className="p-12">
          <div className="text-center space-y-4">
            <Building2 className="h-12 w-12 text-muted-foreground mx-auto" />
            <div>
              <h3 className="text-lg font-semibold">Nenhum fornecedor cadastrado</h3>
              <p className="text-sm text-muted-foreground">
                Cadastre fornecedores para solicitar cotações
              </p>
            </div>
            <SupplierFormDialog />
          </div>
        </Card>
      )}
    </div>
  )
}
