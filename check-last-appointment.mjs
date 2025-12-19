import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function checkLastAppointment() {
  try {
    const appointment = await prisma.appointment.findMany({
      orderBy: { createdAt: 'desc' },
      take: 1,
      include: {
        user: {
          select: { name: true, email: true }
        },
        quote: {
          select: { number: true }
        }
      }
    })

    if (appointment.length === 0) {
      console.log('❌ Nenhum agendamento encontrado')
      return
    }

    const apt = appointment[0]
    console.log('\n📅 ÚLTIMO AGENDAMENTO:\n')
    console.log(`ID: ${apt.id}`)
    console.log(`Tipo: ${apt.type}`)
    console.log(`Status: ${apt.status}`)
    console.log(`Data/Hora: ${apt.scheduledFor}`)
    console.log(`Cliente: ${apt.user?.name || apt.customerName}`)
    console.log(`Email: ${apt.user?.email || apt.customerEmail}`)
    console.log(`Phone: ${apt.customerPhone}`)
    console.log(`Orçamento: ${apt.quote?.number || 'N/A'}`)
    console.log(`Google Calendar Event ID: ${apt.calendarEventId || '❌ NÃO CRIADO'}`)
    console.log(`Criado em: ${apt.createdAt}`)

    if (!apt.calendarEventId) {
      console.log('\n⚠️ PROBLEMA: Evento NÃO foi criado no Google Calendar!')
      console.log('\nPossíveis causas:')
      console.log('1. Erro ao criar evento')
      console.log('2. Google Calendar não configurado corretamente')
      console.log('3. Erro de permissão')
    }

  } catch (error) {
    console.error('❌ Erro:', error.message)
  } finally {
    await prisma.$disconnect()
  }
}

checkLastAppointment()
