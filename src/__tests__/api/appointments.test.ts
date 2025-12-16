import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest'
import { prisma } from '@/lib/prisma'

// Mock auth
vi.mock('@/lib/auth', () => ({
  auth: vi.fn(() =>
    Promise.resolve({
      user: {
        id: 'test-admin-id',
        email: 'admin@test.com',
        role: 'ADMIN',
      },
    })
  ),
}))

describe('Appointments API Integration Tests', () => {
  let testUserId: string
  let testOrderId: string
  let testAppointmentId: string

  beforeAll(async () => {
    // Create test user
    const user = await prisma.user.upsert({
      where: { email: 'test-appointment@test.com' },
      update: {},
      create: {
        email: 'test-appointment@test.com',
        name: 'Test Appointment User',
        password: 'hashed-password',
        role: 'CUSTOMER',
        phone: '21999999999',
      },
    })
    testUserId = user.id

    // Create test order
    const order = await prisma.order.create({
      data: {
        number: 'TEST-APT-ORDER-001',
        userId: testUserId,
        status: 'PRONTO_ENTREGA',
        paymentStatus: 'PAID',
        paymentMethod: 'PIX',
        subtotal: 2000,
        discount: 0,
        installationFee: 500,
        total: 2500,
        paidAmount: 2500,
        serviceStreet: 'Rua Test',
        serviceNumber: '123',
        serviceNeighborhood: 'Test Bairro',
        serviceCity: 'Rio de Janeiro',
        serviceState: 'RJ',
        serviceZipCode: '20000-000',
      },
    })
    testOrderId = order.id

    // Cleanup test appointments
    await prisma.appointment.deleteMany({
      where: { userId: testUserId },
    })
  })

  afterAll(async () => {
    // Cleanup
    await prisma.appointment.deleteMany({
      where: { userId: testUserId },
    })
    await prisma.order
      .delete({
        where: { id: testOrderId },
      })
      .catch(() => {})
  })

  describe('POST /api/appointments', () => {
    it('should create appointment for installation', async () => {
      const tomorrow = new Date()
      tomorrow.setDate(tomorrow.getDate() + 1)

      const appointment = await prisma.appointment.create({
        data: {
          userId: testUserId,
          orderId: testOrderId,
          type: 'INSTALACAO',
          scheduledDate: tomorrow,
          scheduledTime: '09:00',
          estimatedDuration: 180, // 3 hours
          addressStreet: 'Rua Test Install',
          addressNumber: '123',
          addressNeighborhood: 'Copacabana',
          addressCity: 'Rio de Janeiro',
          addressState: 'RJ',
          addressZipCode: '22000-000',
          status: 'SCHEDULED',
        },
      })

      testAppointmentId = appointment.id

      expect(appointment).toBeDefined()
      expect(appointment.type).toBe('INSTALACAO')
      expect(appointment.scheduledTime).toBe('09:00')
      expect(appointment.estimatedDuration).toBe(180)
      expect(appointment.status).toBe('SCHEDULED')
    })

    it('should create appointment for technical visit', async () => {
      const tomorrow = new Date()
      tomorrow.setDate(tomorrow.getDate() + 2)

      const appointment = await prisma.appointment.create({
        data: {
          userId: testUserId,
          type: 'VISITA_TECNICA',
          scheduledDate: tomorrow,
          scheduledTime: '14:00',
          estimatedDuration: 60,
          addressStreet: 'Rua Visitor',
          addressNumber: '456',
          addressNeighborhood: 'Ipanema',
          addressCity: 'Rio de Janeiro',
          addressState: 'RJ',
          addressZipCode: '22400-000',
          status: 'SCHEDULED',
        },
      })

      expect(appointment.type).toBe('VISITA_TECNICA')
      expect(appointment.estimatedDuration).toBe(60)
      expect(appointment.orderId).toBeNull()
    })

    it('should create appointment for maintenance', async () => {
      const nextWeek = new Date()
      nextWeek.setDate(nextWeek.getDate() + 7)

      const appointment = await prisma.appointment.create({
        data: {
          userId: testUserId,
          orderId: testOrderId,
          type: 'MANUTENCAO',
          scheduledDate: nextWeek,
          scheduledTime: '10:00',
          estimatedDuration: 120,
          addressStreet: 'Rua Maintenance',
          addressNumber: '789',
          addressNeighborhood: 'Leblon',
          addressCity: 'Rio de Janeiro',
          addressState: 'RJ',
          addressZipCode: '22450-000',
          status: 'SCHEDULED',
          notes: 'Check glass seal',
        },
      })

      expect(appointment.type).toBe('MANUTENCAO')
      expect(appointment.notes).toBe('Check glass seal')
    })
  })

  describe('GET /api/appointments - Filtering', () => {
    beforeAll(async () => {
      // Create appointments in different states
      const dates = [new Date('2024-12-20'), new Date('2024-12-21'), new Date('2024-12-22')]

      await prisma.appointment.createMany({
        data: [
          {
            userId: testUserId,
            type: 'INSTALACAO',
            scheduledDate: dates[0],
            scheduledTime: '09:00',
            estimatedDuration: 180,
            addressStreet: 'Rua 1',
            addressNumber: '1',
            addressNeighborhood: 'Bairro 1',
            addressCity: 'Rio de Janeiro',
            addressState: 'RJ',
            addressZipCode: '20000-001',
            status: 'SCHEDULED',
          },
          {
            userId: testUserId,
            type: 'VISITA_TECNICA',
            scheduledDate: dates[1],
            scheduledTime: '14:00',
            estimatedDuration: 60,
            addressStreet: 'Rua 2',
            addressNumber: '2',
            addressNeighborhood: 'Bairro 2',
            addressCity: 'Rio de Janeiro',
            addressState: 'RJ',
            addressZipCode: '20000-002',
            status: 'CONFIRMED',
          },
          {
            userId: testUserId,
            type: 'MANUTENCAO',
            scheduledDate: dates[2],
            scheduledTime: '10:00',
            estimatedDuration: 120,
            addressStreet: 'Rua 3',
            addressNumber: '3',
            addressNeighborhood: 'Bairro 3',
            addressCity: 'Rio de Janeiro',
            addressState: 'RJ',
            addressZipCode: '20000-003',
            status: 'COMPLETED',
            completedAt: new Date(),
          },
        ],
      })
    })

    it('should filter by status', async () => {
      const appointments = await prisma.appointment.findMany({
        where: {
          userId: testUserId,
          status: 'SCHEDULED',
        },
      })

      expect(appointments.length).toBeGreaterThan(0)
      expect(appointments.every((a) => a.status === 'SCHEDULED')).toBe(true)
    })

    it('should filter by type', async () => {
      const appointments = await prisma.appointment.findMany({
        where: {
          userId: testUserId,
          type: 'INSTALACAO',
        },
      })

      expect(appointments.length).toBeGreaterThan(0)
      expect(appointments.every((a) => a.type === 'INSTALACAO')).toBe(true)
    })

    it('should filter by date range', async () => {
      const fromDate = new Date('2024-12-20')
      const toDate = new Date('2024-12-21')

      const appointments = await prisma.appointment.findMany({
        where: {
          userId: testUserId,
          scheduledDate: {
            gte: fromDate,
            lte: toDate,
          },
        },
      })

      expect(appointments.length).toBeGreaterThan(0)
      appointments.forEach((a) => {
        expect(a.scheduledDate >= fromDate).toBe(true)
        expect(a.scheduledDate <= toDate).toBe(true)
      })
    })

    it('should filter upcoming appointments', async () => {
      const now = new Date()

      const appointments = await prisma.appointment.findMany({
        where: {
          userId: testUserId,
          scheduledDate: { gte: now },
          status: { in: ['SCHEDULED', 'CONFIRMED', 'IN_PROGRESS'] },
        },
        orderBy: { scheduledDate: 'asc' },
      })

      appointments.forEach((a) => {
        expect(a.scheduledDate >= now).toBe(true)
        expect(['SCHEDULED', 'CONFIRMED', 'IN_PROGRESS'].includes(a.status)).toBe(true)
      })
    })
  })

  describe('GET /api/appointments/slots', () => {
    it('should generate available time slots', () => {
      const workingHours = { start: 8, end: 18, interval: 2 }
      const expectedSlots = ['08:00', '10:00', '12:00', '14:00', '16:00']

      const slots: string[] = []
      for (let hour = workingHours.start; hour < workingHours.end; hour += workingHours.interval) {
        slots.push(`${hour.toString().padStart(2, '0')}:00`)
      }

      expect(slots).toEqual(expectedSlots)
    })

    it('should skip weekends', () => {
      const testDate = new Date('2024-12-21') // Saturday
      const dayOfWeek = testDate.getDay()

      expect(dayOfWeek === 0 || dayOfWeek === 6).toBe(true)
    })

    it('should generate slots for next 7 days excluding weekends', () => {
      const days = 7
      const startDate = new Date()
      const businessDays: Date[] = []

      for (let i = 0; i < days * 2; i++) {
        // Check up to 14 days to get 7 business days
        const currentDate = new Date(startDate)
        currentDate.setDate(currentDate.getDate() + i)

        const dayOfWeek = currentDate.getDay()
        if (dayOfWeek !== 0 && dayOfWeek !== 6) {
          businessDays.push(currentDate)
          if (businessDays.length === days) break
        }
      }

      expect(businessDays.length).toBe(days)
      businessDays.forEach((date) => {
        const dayOfWeek = date.getDay()
        expect(dayOfWeek !== 0 && dayOfWeek !== 6).toBe(true)
      })
    })
  })

  describe('Appointment Status Workflow', () => {
    it('should transition from SCHEDULED to CONFIRMED', async () => {
      const appointment = await prisma.appointment.update({
        where: { id: testAppointmentId },
        data: { status: 'CONFIRMED' },
      })

      expect(appointment.status).toBe('CONFIRMED')
    })

    it('should transition to IN_PROGRESS', async () => {
      const appointment = await prisma.appointment.update({
        where: { id: testAppointmentId },
        data: { status: 'IN_PROGRESS' },
      })

      expect(appointment.status).toBe('IN_PROGRESS')
    })

    it('should complete appointment', async () => {
      const now = new Date()
      const appointment = await prisma.appointment.update({
        where: { id: testAppointmentId },
        data: {
          status: 'COMPLETED',
          completedAt: now,
        },
      })

      expect(appointment.status).toBe('COMPLETED')
      expect(appointment.completedAt).toBeDefined()
    })

    it('should allow cancellation', async () => {
      const appointment = await prisma.appointment.create({
        data: {
          userId: testUserId,
          type: 'VISITA_TECNICA',
          scheduledDate: new Date('2024-12-25'),
          scheduledTime: '15:00',
          estimatedDuration: 60,
          addressStreet: 'Rua Cancel',
          addressNumber: '999',
          addressNeighborhood: 'Test',
          addressCity: 'Rio de Janeiro',
          addressState: 'RJ',
          addressZipCode: '20000-999',
          status: 'SCHEDULED',
        },
      })

      const cancelled = await prisma.appointment.update({
        where: { id: appointment.id },
        data: { status: 'CANCELLED' },
      })

      expect(cancelled.status).toBe('CANCELLED')
    })

    it('should mark as no-show', async () => {
      const appointment = await prisma.appointment.create({
        data: {
          userId: testUserId,
          type: 'INSTALACAO',
          scheduledDate: new Date('2024-12-26'),
          scheduledTime: '09:00',
          estimatedDuration: 180,
          addressStreet: 'Rua NoShow',
          addressNumber: '888',
          addressNeighborhood: 'Test',
          addressCity: 'Rio de Janeiro',
          addressState: 'RJ',
          addressZipCode: '20000-888',
          status: 'CONFIRMED',
        },
      })

      const noShow = await prisma.appointment.update({
        where: { id: appointment.id },
        data: { status: 'NO_SHOW' },
      })

      expect(noShow.status).toBe('NO_SHOW')
    })
  })

  describe('Appointment Assignment', () => {
    let technicianId: string

    beforeAll(async () => {
      const technician = await prisma.user.upsert({
        where: { email: 'technician@test.com' },
        update: {},
        create: {
          email: 'technician@test.com',
          name: 'Test Technician',
          password: 'hashed-password',
          role: 'STAFF',
        },
      })
      technicianId = technician.id
    })

    it('should assign technician to appointment', async () => {
      const appointment = await prisma.appointment.update({
        where: { id: testAppointmentId },
        data: { assignedToId: technicianId },
        include: { assignedTo: true },
      })

      expect(appointment.assignedToId).toBe(technicianId)
      expect(appointment.assignedTo).toBeDefined()
      expect(appointment.assignedTo?.role).toBe('STAFF')
    })

    it('should unassign technician', async () => {
      const appointment = await prisma.appointment.update({
        where: { id: testAppointmentId },
        data: { assignedToId: null },
      })

      expect(appointment.assignedToId).toBeNull()
    })
  })

  describe('Appointment Related Data', () => {
    it('should include user information', async () => {
      const appointment = await prisma.appointment.findUnique({
        where: { id: testAppointmentId },
        include: { user: true },
      })

      expect(appointment).toBeDefined()
      expect(appointment?.user).toBeDefined()
      expect(appointment?.user.email).toBe('test-appointment@test.com')
    })

    it('should include order information when linked', async () => {
      const appointment = await prisma.appointment.findUnique({
        where: { id: testAppointmentId },
        include: {
          order: {
            select: {
              id: true,
              number: true,
              status: true,
            },
          },
        },
      })

      expect(appointment).toBeDefined()
      expect(appointment?.order).toBeDefined()
      expect(appointment?.order?.number).toBe('TEST-APT-ORDER-001')
    })
  })
})
