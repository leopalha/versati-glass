import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { isR2Configured, uploadToR2 } from '@/lib/r2-storage'

/**
 * GET /api/debug-r2
 * Debug R2 configuration and test upload
 * No auth required for status check, but upload test requires ADMIN
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const testUpload = searchParams.get('test') === 'true'

  // Only require auth for test upload
  if (testUpload) {
    const session = await auth()
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Não autorizado para teste de upload' }, { status: 401 })
    }
  }

  try {
    const config = {
      isConfigured: isR2Configured(),
      hasAccountId: !!process.env.CLOUDFLARE_ACCOUNT_ID,
      hasAccessKey: !!process.env.CLOUDFLARE_R2_ACCESS_KEY_ID,
      hasSecretKey: !!process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY,
      hasBucketName: !!process.env.CLOUDFLARE_R2_BUCKET_NAME,
      hasPublicUrl: !!process.env.CLOUDFLARE_R2_PUBLIC_URL,
      // Trim values to show actual config (without trailing newlines)
      bucketName: (process.env.CLOUDFLARE_R2_BUCKET_NAME || 'not-set').trim(),
      publicUrl: (process.env.CLOUDFLARE_R2_PUBLIC_URL || 'not-set').trim(),
      // Show partial values for debugging (first 8 chars)
      accountIdPrefix: process.env.CLOUDFLARE_ACCOUNT_ID?.trim().substring(0, 8) || 'not-set',
      accessKeyPrefix: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID?.trim().substring(0, 8) || 'not-set',
    }

    // Test upload with a tiny image (1x1 transparent PNG) - only if requested
    let uploadTest = { success: false, error: '', url: '', key: '', skipped: !testUpload }

    if (testUpload && config.isConfigured) {
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
          skipped: false,
        }
      } catch (err) {
        uploadTest = {
          success: false,
          error: err instanceof Error ? err.message : 'Unknown error',
          url: '',
          key: '',
          skipped: false,
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
