import { prisma } from '@/lib/prisma'
import { AdminHeader } from '@/components/admin/admin-header'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { formatCurrency } from '@/lib/utils'
import { Users, Eye, Calendar, Package, Search } from 'lucide-react'
import Link from 'next/link'

export default async function AdminClientesPage() {
  const customers = await prisma.user.findMany({
    where: { role: 'CUSTOMER' },
    orderBy: { createdAt: 'desc' },
    take: 50,
    include: {
      _count: {
        select: {
          orders: true,
          quotes: true,
        },
      },
      orders: {
        select: {
          total: true,
        },
      },
    },
  })

  const totalCustomers = await prisma.user.count({ where: { role: 'CUSTOMER' } })

  return (
    <div>
      <AdminHeader
        title="Clientes"
        subtitle={`${totalCustomers} cliente(s)`}
        actions={
          <Button variant="outline" size="sm">
            <Search className="mr-2 h-4 w-4" />
            Buscar
          </Button>
        }
      />

      <div className="p-6">
        {customers.length === 0 ? (
          <Card className="flex flex-col items-center justify-center p-12 text-center">
            <Users className="mb-4 h-16 w-16 text-neutral-600" />
            <h3 className="mb-2 font-display text-xl font-semibold text-white">Nenhum cliente</h3>
            <p className="text-neutral-400">Os clientes aparecerao aqui</p>
          </Card>
        ) : (
          <div className="overflow-hidden rounded-lg border border-neutral-700">
            <table className="w-full">
              <thead className="bg-neutral-800">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-neutral-300">
                    Cliente
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-neutral-300">
                    Contato
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-neutral-300">
                    Pedidos
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-neutral-300">
                    Total Gasto
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-neutral-300">
                    Cadastro
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-neutral-300">
                    Acoes
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-700">
                {customers.map((customer) => {
                  const totalSpent = customer.orders.reduce(
                    (sum, order) => sum + Number(order.total),
                    0
                  )

                  return (
                    <tr key={customer.id} className="hover:bg-neutral-800">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gold-500/20">
                            <span className="font-semibold text-gold-500">
                              {customer.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-white">{customer.name}</p>
                            <p className="text-xs text-neutral-400">{customer.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-neutral-300">{customer.phone || '-'}</p>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1 text-neutral-300">
                          <Package className="h-4 w-4" />
                          {customer._count.orders}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-medium text-white">{formatCurrency(totalSpent)}</p>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1 text-sm text-neutral-400">
                          <Calendar className="h-4 w-4" />
                          {new Date(customer.createdAt).toLocaleDateString('pt-BR')}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Link
                          href={`/admin/clientes/${customer.id}`}
                          className="inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm text-gold-500 hover:bg-gold-500/10"
                        >
                          <Eye className="h-4 w-4" />
                          Ver
                        </Link>
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
