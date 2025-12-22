import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { isR2Configured, uploadToR2 } from '@/lib/r2-storage'

/**
 * GET /api/debug-r2
 * Debug R2 configuration and test upload
 * Only accessible to ADMIN users
 */
export async function GET() {
  try {
    const session = await auth()
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const config = {
      isConfigured: isR2Configured(),
      hasAccountId: !!process.env.CLOUDFLARE_ACCOUNT_ID,
      hasAccessKey: !!process.env.CLOUDFLARE_R2_ACCESS_KEY_ID,
      hasSecretKey: !!process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY,
      hasBucketName: !!process.env.CLOUDFLARE_R2_BUCKET_NAME,
      hasPublicUrl: !!process.env.CLOUDFLARE_R2_PUBLIC_URL,
      bucketName: process.env.CLOUDFLARE_R2_BUCKET_NAME || 'not-set',
      publicUrl: process.env.CLOUDFLARE_R2_PUBLIC_URL || 'not-set',
      // Show partial values for debugging (first 4 chars)
      accountIdPrefix: process.env.CLOUDFLARE_ACCOUNT_ID?.substring(0, 8) || 'not-set',
      accessKeyPrefix: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID?.substring(0, 8) || 'not-set',
    }

    // Test upload with a tiny image (1x1 transparent PNG)
    let uploadTest = { success: false, error: '', url: '', key: '' }

    if (config.isConfigured) {
      try {
        // 1x1 transparent PNG (smallest valid PNG)
        const pngData = Buffer.from(
          'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
          'base64'
        )

        const result = await uploadToR2(pngData, 'test-debug.png', 'image/png')
        uploadTest = {
          success: true,
          error: '',
          url: result.url,
          key: result.key,
        }
      } catch (err) {
        uploadTest = {
          success: false,
          error: err instanceof Error ? err.message : 'Unknown error',
          url: '',
          key: '',
        }
      }
    }

    return NextResponse.json({
      config,
      uploadTest,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
