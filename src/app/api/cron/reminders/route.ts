import { NextRequest, NextResponse } from 'next/server'
import { sendDailyAppointmentReminders } from '@/services/notifications'

// Cron job endpoint for sending daily appointment reminders
// This should be called by a cron service (e.g., Vercel Cron) daily
export async function GET(request: NextRequest) {
  try {
    // Verify cron secret in production
    const authHeader = request.headers.get('authorization')
    const cronSecret = process.env.CRON_SECRET

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    console.log('Starting daily appointment reminders cron job...')

    const results = await sendDailyAppointmentReminders()

    const successCount = results.filter((r) => r.success).length
    const failureCount = results.filter((r) => !r.success).length

    console.log(
      `Cron job completed: ${successCount} success, ${failureCount} failures`
    )

    return NextResponse.json({
      success: true,
      total: results.length,
      successCount,
      failureCount,
      results,
    })
  } catch (error) {
    console.error('Cron job error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Cron job failed' },
      { status: 500 }
    )
  }
}

// Also allow POST for flexibility
export async function POST(request: NextRequest) {
  return GET(request)
}
