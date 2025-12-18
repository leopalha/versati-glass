import { Suspense } from 'react'
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { UnifiedConversationView } from '@/components/admin/unified-conversation-view'
import { Card, CardContent } from '@/components/ui/card'

/**
 * OMNICHANNEL Sprint 1 - Task 3: Admin Unified Conversations Page
 *
 * Página admin para visualizar conversas unificadas (Web + WhatsApp)
 */

export const metadata = {
  title: 'Conversas Unificadas | Admin - Versati Glass',
  description: 'Visualize conversas de clientes em todos os canais'
}

interface PageProps {
  searchParams: {
    userId?: string
    phone?: string
  }
}

export default async function ConversasUnificadasPage({ searchParams }: PageProps) {
  const session = await auth()

  if (!session?.user || session.user.role !== 'ADMIN') {
    redirect('/login')
  }

  const userId = searchParams.userId
  const phoneNumber = searchParams.phone

  if (!userId && !phoneNumber) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Conversas Unificadas</h1>
          <p className="text-muted-foreground mt-2">
            Visualize conversas de clientes em todos os canais (Web Chat + WhatsApp)
          </p>
        </div>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-lg font-semibold mb-2">
                Selecione um cliente para visualizar
              </h3>
              <p className="text-sm text-muted-foreground mb-6">
                Use os filtros ou busque por cliente nas outras páginas
              </p>
              <div className="space-y-2 text-sm text-left max-w-md mx-auto">
                <p className="font-medium">Como acessar:</p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>
                    Acesse <a href="/admin/clientes" className="text-primary hover:underline">Clientes</a> e
                    clique em "Ver Conversas"
                  </li>
                  <li>
                    Acesse <a href="/admin/whatsapp" className="text-primary hover:underline">WhatsApp</a> e
                    selecione uma conversa
                  </li>
                  <li>
                    Acesse <a href="/admin/conversas-ia" className="text-primary hover:underline">Conversas IA</a> e
                    selecione uma conversa web
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Conversas Unificadas</h1>
        <p className="text-muted-foreground mt-2">
          Timeline completa do cliente em todos os canais
        </p>
      </div>

      <Suspense
        fallback={
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-sm text-muted-foreground">Carregando conversas...</p>
            </div>
          </div>
        }
      >
        <UnifiedConversationView
          customerId={userId}
          phoneNumber={phoneNumber}
        />
      </Suspense>
    </div>
  )
}
