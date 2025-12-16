import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { PortalHeader } from '@/components/portal/portal-header'
import { Card } from '@/components/ui/card'
import { Calendar, Clock, MapPin, CheckCircle, XCircle, AlertCircle } from 'lucide-react'

const statusLabels: Record<string, { label: string; color: string; icon: typeof Clock }> = {
  SCHEDULED: { label: 'Agendado', color: 'bg-blue-500/20 text-blue-400', icon: Clock },
  CONFIRMED: { label: 'Confirmado', color: 'bg-green-500/20 text-green-400', icon: CheckCircle },
  IN_PROGRESS: { label: 'Em Andamento', color: 'bg-yellow-500/20 text-yellow-400', icon: AlertCircle },
  COMPLETED: { label: 'Concluido', color: 'bg-green-500/20 text-green-400', icon: CheckCircle },
  CANCELLED: { label: 'Cancelado', color: 'bg-red-500/20 text-red-400', icon: XCircle },
  RESCHEDULED: { label: 'Reagendado', color: 'bg-purple-500/20 text-purple-400', icon: Calendar },
  NO_SHOW: { label: 'Nao Compareceu', color: 'bg-red-500/20 text-red-400', icon: XCircle },
}

const typeLabels: Record<string, string> = {
  VISITA_TECNICA: 'Visita Tecnica',
  INSTALACAO: 'Instalacao',
  MANUTENCAO: 'Manutencao',
  REVISAO: 'Revisao',
}

export default async function AgendamentosPage() {
  const session = await auth()

  if (!session?.user?.id) {
    return null
  }

  const [upcomingAppointments, pastAppointments] = await Promise.all([
    prisma.appointment.findMany({
      where: {
        userId: session.user.id,
        scheduledDate: { gte: new Date() },
        status: { in: ['SCHEDULED', 'CONFIRMED', 'IN_PROGRESS'] },
      },
      orderBy: { scheduledDate: 'asc' },
      include: {
        order: {
          select: {
            id: true,
            number: true,
          },
        },
      },
    }),
    prisma.appointment.findMany({
      where: {
        userId: session.user.id,
        OR: [
          { scheduledDate: { lt: new Date() } },
          { status: { in: ['COMPLETED', 'CANCELLED', 'NO_SHOW'] } },
        ],
      },
      orderBy: { scheduledDate: 'desc' },
      take: 10,
      include: {
        order: {
          select: {
            id: true,
            number: true,
          },
        },
      },
    }),
  ])

  const totalAppointments = upcomingAppointments.length + pastAppointments.length

  return (
    <div>
      <PortalHeader
        title="Agendamentos"
        subtitle={`${totalAppointments} agendamento(s)`}
      />

      <div className="p-6">
        {totalAppointments === 0 ? (
          <Card className="flex flex-col items-center justify-center p-12 text-center">
            <Calendar className="mb-4 h-16 w-16 text-neutral-500" />
            <h3 className="mb-2 font-display text-xl font-semibold text-white">
              Nenhum agendamento
            </h3>
            <p className="text-neutral-400">
              Seus agendamentos aparecerao aqui
            </p>
          </Card>
        ) : (
          <div className="space-y-8">
            {/* Upcoming */}
            {upcomingAppointments.length > 0 && (
              <div>
                <h2 className="mb-4 font-display text-lg font-semibold text-white">
                  Proximos Agendamentos
                </h2>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {upcomingAppointments.map((appointment) => {
                    const statusInfo = statusLabels[appointment.status] || statusLabels.SCHEDULED
                    const StatusIcon = statusInfo.icon

                    return (
                      <Card key={appointment.id} className="p-6">
                        <div className="mb-4 flex items-start justify-between">
                          <div>
                            <p className="font-display text-lg font-semibold text-white">
                              {typeLabels[appointment.type] || appointment.type}
                            </p>
                            {appointment.order && (
                              <p className="text-sm text-neutral-400">
                                Pedido #{appointment.order.number}
                              </p>
                            )}
                          </div>
                          <span
                            className={`flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${statusInfo.color}`}
                          >
                            <StatusIcon className="h-3 w-3" />
                            {statusInfo.label}
                          </span>
                        </div>

                        <div className="space-y-3">
                          <div className="flex items-center gap-3 text-neutral-300">
                            <Calendar className="h-5 w-5 text-gold-500" />
                            <span>
                              {new Date(appointment.scheduledDate).toLocaleDateString('pt-BR', {
                                weekday: 'long',
                                day: 'numeric',
                                month: 'long',
                              })}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 text-neutral-300">
                            <Clock className="h-5 w-5 text-gold-500" />
                            <span>{appointment.scheduledTime}</span>
                            {appointment.estimatedDuration && (
                              <span className="text-neutral-500">
                                (~{appointment.estimatedDuration} min)
                              </span>
                            )}
                          </div>
                          <div className="flex items-start gap-3 text-neutral-300">
                            <MapPin className="mt-0.5 h-5 w-5 flex-shrink-0 text-gold-500" />
                            <span className="text-sm">
                              {appointment.addressStreet}, {appointment.addressNumber}
                              {appointment.addressComplement && ` - ${appointment.addressComplement}`}
                              <br />
                              {appointment.addressNeighborhood}, {appointment.addressCity}
                            </span>
                          </div>
                        </div>

                        {appointment.notes && (
                          <p className="mt-4 rounded-lg bg-neutral-200 p-3 text-sm text-neutral-400">
                            {appointment.notes}
                          </p>
                        )}
                      </Card>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Past */}
            {pastAppointments.length > 0 && (
              <div>
                <h2 className="mb-4 font-display text-lg font-semibold text-white">
                  Agendamentos Anteriores
                </h2>
                <div className="space-y-3">
                  {pastAppointments.map((appointment) => {
                    const statusInfo = statusLabels[appointment.status] || statusLabels.COMPLETED
                    const StatusIcon = statusInfo.icon

                    return (
                      <Card key={appointment.id} className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-neutral-200">
                              <Calendar className="h-5 w-5 text-neutral-500" />
                            </div>
                            <div>
                              <p className="font-medium text-white">
                                {typeLabels[appointment.type] || appointment.type}
                              </p>
                              <p className="text-sm text-neutral-400">
                                {new Date(appointment.scheduledDate).toLocaleDateString('pt-BR')} -{' '}
                                {appointment.scheduledTime}
                              </p>
                            </div>
                          </div>
                          <span
                            className={`flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${statusInfo.color}`}
                          >
                            <StatusIcon className="h-3 w-3" />
                            {statusInfo.label}
                          </span>
                        </div>
                      </Card>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
