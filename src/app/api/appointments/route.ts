import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// Get appointments for current user
export async function GET(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const upcoming = searchParams.get('upcoming') === 'true'
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')

    // Build filter
    const where: Record<string, unknown> = { userId: session.user.id }

    if (status) {
      where.status = status
    }

    if (upcoming) {
      where.scheduledDate = { gte: new Date() }
      where.status = { in: ['SCHEDULED', 'CONFIRMED', 'IN_PROGRESS'] }
    }

    const [appointments, total] = await Promise.all([
      prisma.appointment.findMany({
        where,
        orderBy: { scheduledDate: upcoming ? 'asc' : 'desc' },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          order: {
            select: {
              id: true,
              number: true,
            },
          },
          quote: {
            select: {
              id: true,
              number: true,
            },
          },
          assignedTo: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      }),
      prisma.appointment.count({ where }),
    ])

    return NextResponse.json({
      appointments,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Get appointments error:', error)
    return NextResponse.json(
      { error: 'Failed to get appointments' },
      { status: 500 }
    )
  }
}

// Create appointment (for scheduling)
export async function POST(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const {
      orderId,
      quoteId,
      type,
      scheduledDate,
      scheduledTime,
      estimatedDuration,
      addressStreet,
      addressNumber,
      addressComplement,
      addressNeighborhood,
      addressCity,
      addressState,
      addressZipCode,
      notes,
    } = body

    // Validate required fields
    if (!type || !scheduledDate || !scheduledTime) {
      return NextResponse.json(
        { error: 'Type, date and time are required' },
        { status: 400 }
      )
    }

    if (!addressStreet || !addressNumber || !addressCity || !addressState) {
      return NextResponse.json(
        { error: 'Address is required' },
        { status: 400 }
      )
    }

    const appointment = await prisma.appointment.create({
      data: {
        userId: session.user.id,
        orderId,
        quoteId,
        type,
        scheduledDate: new Date(scheduledDate),
        scheduledTime,
        estimatedDuration: estimatedDuration || 60,
        addressStreet,
        addressNumber,
        addressComplement,
        addressNeighborhood,
        addressCity,
        addressState,
        addressZipCode,
        notes,
        status: 'SCHEDULED',
      },
    })

    return NextResponse.json(appointment, { status: 201 })
  } catch (error) {
    console.error('Create appointment error:', error)
    return NextResponse.json(
      { error: 'Failed to create appointment' },
      { status: 500 }
    )
  }
}
