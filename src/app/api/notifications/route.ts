import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import {
  sendQuoteNotification,
  sendOrderConfirmationNotification,
  sendAppointmentReminderNotification,
  sendInstallationCompleteNotification,
} from '@/services/notifications'
import { logger } from '@/lib/logger'

// Send a notification
export async function POST(request: NextRequest) {
  try {
    const session = await auth()

    // Require authentication
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Only admins and staff can send notifications
    if (!['ADMIN', 'STAFF'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    const { type, id } = body

    if (!type || !id) {
      return NextResponse.json({ error: 'Type and ID are required' }, { status: 400 })
    }

    let result

    switch (type) {
      case 'quote':
        result = await sendQuoteNotification(id)
        break

      case 'order_confirmation':
        result = await sendOrderConfirmationNotification(id)
        break

      case 'appointment_reminder':
        result = await sendAppointmentReminderNotification(id)
        break

      case 'installation_complete':
        result = await sendInstallationCompleteNotification(id)
        break

      default:
        return NextResponse.json({ error: `Unknown notification type: ${type}` }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      result,
    })
  } catch (error) {
    logger.error('Notification error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to send notification' },
      { status: 500 }
    )
  }
}
