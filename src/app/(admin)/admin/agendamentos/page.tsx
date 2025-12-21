import { prisma } from '@/lib/prisma'
import { AdminHeader } from '@/components/admin/admin-header'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Calendar,
  Clock,
  MapPin,
  User,
  CheckCircle,
  XCircle,
  AlertCircle,
  Plus,
} from 'lucide-react'
import Link from 'next/link'
import { CreateAppointmentDialog } from '@/components/admin/create-appointment-dialog'
import { AppointmentActions } from '@/components/admin/appointment-actions'

const statusLabels: Record<string, { label: string; color: string; icon: typeof Clock }> = {
  SCHEDULED: { label: 'Agendado', color: 'bg-blue-500/20 text-blue-400', icon: Clock },
  CONFIRMED: { label: 'Confirmado', color: 'bg-green-500/20 text-green-400', icon: CheckCircle },
  IN_PROGRESS: {
    label: 'Em Andamento',
    color: 'bg-yellow-500/20 text-yellow-400',
    icon: AlertCircle,
  },
  COMPLETED: { label: 'Concluido', color: 'bg-green-500/20 text-green-400', icon: CheckCircle },
  CANCELLED: { label: 'Cancelado', color: 'bg-red-500/20 text-red-400', icon: XCircle },
  RESCHEDULED: { label: 'Reagendado', color: 'bg-purple-500/20 text-purple-400', icon: Calendar },
  NO_SHOW: { label: 'Nao Compareceu', color: 'bg-red-500/20 text-red-400', icon: XCircle },
}

const typeLabels: Record<string, { label: string; color: string }> = {
  VISITA_TECNICA: { label: 'Visita Tecnica', color: 'bg-blue-500/20 text-blue-400' },
  INSTALACAO: { label: 'Instalacao', color: 'bg-purple-500/20 text-purple-400' },
  MANUTENCAO: { label: 'Manutencao', color: 'bg-orange-500/20 text-orange-400' },
  REVISAO: { label: 'Revisao', color: 'bg-cyan-500/20 text-cyan-400' },
}

export default async function AdminAgendamentosPage() {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const [todayAppointments, upcomingAppointments, pastAppointments] = await Promise.all([
    prisma.appointment.findMany({
      where: {
        scheduledDate: {
          gte: today,
          lt: new Date(today.getTime() + 24 * 60 * 60 * 1000),
        },
      },
      orderBy: { scheduledTime: 'asc' },
      include: {
        user: { select: { id: true, name: true, phone: true } },
        order: { select: { id: true, number: true } },
        assignedTo: { select: { id: true, name: true } },
      },
    }),
    prisma.appointment.findMany({
      where: {
        scheduledDate: { gt: new Date(today.getTime() + 24 * 60 * 60 * 1000) },
        status: { in: ['SCHEDULED', 'CONFIRMED'] },
      },
      orderBy: { scheduledDate: 'asc' },
      take: 20,
      include: {
        user: { select: { id: true, name: true, phone: true } },
        order: { select: { id: true, number: true } },
        assignedTo: { select: { id: true, name: true } },
      },
    }),
    prisma.appointment.findMany({
      where: {
        scheduledDate: { lt: today },
      },
      orderBy: { scheduledDate: 'desc' },
      take: 20,
      include: {
        user: { select: { id: true, name: true, phone: true } },
        order: { select: { id: true, number: true } },
      },
    }),
  ])

  const [scheduledCount, confirmedCount, completedCount] = await Promise.all([
    prisma.appointment.count({ where: { status: 'SCHEDULED' } }),
    prisma.appointment.count({ where: { status: 'CONFIRMED' } }),
    prisma.appointment.count({ where: { status: 'COMPLETED' } }),
  ])

  return (
    <div>
      <AdminHeader
        title="Agendamentos"
        subtitle={`${todayAppointments.length} agendamento(s) hoje`}
        actions={<CreateAppointmentDialog />}
      />

      <div className="p-6">
        {/* Stats */}
        <div className="mb-6 grid gap-4 sm:grid-cols-4">
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-500/20">
                <Calendar className="h-5 w-5 text-yellow-400" />
              </div>
              <div>
                <p className="text-sm text-neutral-400">Hoje</p>
                <p className="text-xl font-bold text-white">{todayAppointments.length}</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/20">
                <Clock className="h-5 w-5 text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-neutral-400">Agendados</p>
                <p className="text-xl font-bold text-white">{scheduledCount}</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/20">
                <CheckCircle className="h-5 w-5 text-green-400" />
              </div>
              <div>
                <p className="text-sm text-neutral-400">Confirmados</p>
                <p className="text-xl font-bold text-white">{confirmedCount}</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/20">
                <CheckCircle className="h-5 w-5 text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-neutral-400">Concluidos</p>
                <p className="text-xl font-bold text-white">{completedCount}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Today's appointments */}
        <div className="mb-8">
          <h2 className="mb-4 font-display text-lg font-semibold text-white">
            Agendamentos de Hoje ({new Date().toLocaleDateString('pt-BR')})
          </h2>

          {todayAppointments.length === 0 ? (
            <Card className="p-6 text-center">
              <Calendar className="mx-auto mb-3 h-12 w-12 text-neutral-600" />
              <p className="text-neutral-400">Nenhum agendamento para hoje</p>
            </Card>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {todayAppointments.map((appointment) => {
                const statusInfo = statusLabels[appointment.status] || statusLabels.SCHEDULED
                const typeInfo = typeLabels[appointment.type] || {
                  label: appointment.type,
                  color: 'bg-neutral-500/20 text-neutral-400',
                }
                const StatusIcon = statusInfo.icon

                return (
                  <Card key={appointment.id} className="p-4">
                    <div className="mb-3 flex items-start justify-between">
                      <span
                        className={`rounded-full px-2 py-1 text-xs font-medium ${typeInfo.color}`}
                      >
                        {typeInfo.label}
                      </span>
                      <span
                        className={`flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${statusInfo.color}`}
                      >
                        <StatusIcon className="h-3 w-3" />
                        {statusInfo.label}
                      </span>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-gold-500" />
                        <span className="font-medium text-white">{appointment.scheduledTime}</span>
                        {appointment.estimatedDuration && (
                          <span className="text-xs text-neutral-500">
                            (~{appointment.estimatedDuration} min)
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 text-neutral-300">
                        <User className="h-4 w-4 text-neutral-500" />
                        <span>{appointment.user.name}</span>
                      </div>

                      <div className="flex items-start gap-2 text-sm text-neutral-400">
                        <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-neutral-500" />
                        <span>
                          {appointment.addressStreet}, {appointment.addressNumber}
                          <br />
                          {appointment.addressNeighborhood}
                        </span>
                      </div>

                      {appointment.order && (
                        <Link
                          href={`/admin/pedidos/${appointment.order.id}`}
                          className="inline-block text-xs text-gold-500 hover:text-gold-400"
                        >
                          Pedido #{appointment.order.number}
                        </Link>
                      )}

                      {appointment.assignedTo && (
                        <p className="text-xs text-neutral-500">
                          Tecnico: {appointment.assignedTo.name}
                        </p>
                      )}
                    </div>

                    <div className="mt-4 border-t border-neutral-700 pt-4">
                      <AppointmentActions
                        appointmentId={appointment.id}
                        currentStatus={appointment.status}
                      />
                    </div>
                  </Card>
                )
              })}
            </div>
          )}
        </div>

        {/* Upcoming appointments */}
        {upcomingAppointments.length > 0 && (
          <div className="mb-8">
            <h2 className="mb-4 font-display text-lg font-semibold text-white">
              Proximos Agendamentos
            </h2>

            <div className="space-y-3">
              {upcomingAppointments.map((appointment) => {
                const statusInfo = statusLabels[appointment.status] || statusLabels.SCHEDULED
                const typeInfo = typeLabels[appointment.type] || {
                  label: appointment.type,
                  color: 'bg-neutral-500/20 text-neutral-400',
                }

                return (
                  <Card key={appointment.id} className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="text-center">
                          <p className="text-2xl font-bold text-white">
                            {new Date(appointment.scheduledDate).getDate()}
                          </p>
                          <p className="text-xs text-neutral-400">
                            {new Date(appointment.scheduledDate).toLocaleDateString('pt-BR', {
                              month: 'short',
                            })}
                          </p>
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span
                              className={`rounded-full px-2 py-0.5 text-xs font-medium ${typeInfo.color}`}
                            >
                              {typeInfo.label}
                            </span>
                            <span className="text-sm text-neutral-400">
                              {appointment.scheduledTime}
                            </span>
                          </div>
                          <p className="font-medium text-white">{appointment.user.name}</p>
                          <p className="text-sm text-neutral-500">
                            {appointment.addressNeighborhood}, {appointment.addressCity}
                          </p>
                        </div>
                      </div>
                      <span
                        className={`rounded-full px-2 py-1 text-xs font-medium ${statusInfo.color}`}
                      >
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
    </div>
  )
}
