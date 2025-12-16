import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { PortalSidebar } from '@/components/portal/portal-sidebar'

export default async function PortalLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()

  if (!session?.user) {
    redirect('/login?callbackUrl=/portal')
  }

  return (
    <div className="bg-theme-primary min-h-screen">
      <PortalSidebar />
      <main className="lg:ml-64">{children}</main>
    </div>
  )
}
