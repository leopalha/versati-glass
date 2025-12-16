import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { AdminSidebar } from '@/components/admin/admin-sidebar'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  if (!session?.user) {
    redirect('/login?callbackUrl=/admin')
  }

  // Only allow ADMIN and STAFF roles
  if (!['ADMIN', 'STAFF'].includes(session.user.role)) {
    redirect('/portal')
  }

  return (
    <div className="min-h-screen bg-neutral-150">
      <AdminSidebar />
      <main className="lg:ml-64">
        {children}
      </main>
    </div>
  )
}
