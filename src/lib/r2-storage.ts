/**
 * Cloudflare R2 Storage Integration
 *
 * R2 é compatível com S3 API mas mais barato.
 * Usa a API de presigned URLs para upload direto do browser.
 */

interface R2Config {
  accountId: string
  accessKeyId: string
  secretAccessKey: string
  bucketName: string
  publicUrl: string
}

function getR2Config(): R2Config {
  // Trim all env vars to remove trailing newlines/whitespace
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID?.trim()
  const accessKeyId = process.env.CLOUDFLARE_R2_ACCESS_KEY_ID?.trim()
  const secretAccessKey = process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY?.trim()
  const bucketName = (process.env.CLOUDFLARE_R2_BUCKET_NAME || 'versati-glass').trim()
  const publicUrl = (process.env.CLOUDFLARE_R2_PUBLIC_URL || '').trim()

  if (!accountId || !accessKeyId || !secretAccessKey) {
    throw new Error('Cloudflare R2 credentials not configured')
  }

  return { accountId, accessKeyId, secretAccessKey, bucketName, publicUrl }
}

/**
 * Generate AWS Signature V4 for R2
 */
async function signRequest(
  method: string,
  url: string,
  headers: Record<string, string>,
  body: Uint8Array | null,
  config: R2Config
): Promise<Record<string, string>> {
  const encoder = new TextEncoder()

  const now = new Date()
  const amzDate = now.toISOString().replace(/[:-]|\.\d{3}/g, '')
  const dateStamp = amzDate.slice(0, 8)

  const region = 'auto'
  const service = 's3'

  const credentialScope = `${dateStamp}/${region}/${service}/aws4_request`

  // Create canonical request
  const parsedUrl = new URL(url)
  const canonicalUri = parsedUrl.pathname
  const canonicalQueryString = parsedUrl.searchParams.toString()

  // Add required headers
  headers['x-amz-date'] = amzDate
  headers['x-amz-content-sha256'] = body ? await sha256Hex(body) : 'UNSIGNED-PAYLOAD'

  const sortedHeaders = Object.keys(headers).sort()
  const canonicalHeaders =
    sortedHeaders.map((key) => `${key.toLowerCase()}:${headers[key].trim()}`).join('\n') + '\n'
  const signedHeaders = sortedHeaders.map((k) => k.toLowerCase()).join(';')

  const payloadHash = headers['x-amz-content-sha256']

  const canonicalRequest = [
    method,
    canonicalUri,
    canonicalQueryString,
    canonicalHeaders,
    signedHeaders,
    payloadHash,
  ].join('\n')

  // Create string to sign
  const canonicalRequestHash = await sha256Hex(encoder.encode(canonicalRequest))
  const stringToSign = ['AWS4-HMAC-SHA256', amzDate, credentialScope, canonicalRequestHash].join(
    '\n'
  )

  // Calculate signature
  const kDate = await hmacSha256(
    encoder.encode('AWS4' + config.secretAccessKey),
    encoder.encode(dateStamp)
  )
  const kRegion = await hmacSha256(new Uint8Array(kDate), encoder.encode(region))
  const kService = await hmacSha256(new Uint8Array(kRegion), encoder.encode(service))
  const kSigning = await hmacSha256(new Uint8Array(kService), encoder.encode('aws4_request'))
  const signature = await hmacSha256Hex(new Uint8Array(kSigning), encoder.encode(stringToSign))

  // Create authorization header
  const authorization = `AWS4-HMAC-SHA256 Credential=${config.accessKeyId}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`

  return {
    ...headers,
    Authorization: authorization,
  }
}

async function sha256Hex(data: Uint8Array): Promise<string> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const hashBuffer = await crypto.subtle.digest('SHA-256', data as any)
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

async function hmacSha256(key: Uint8Array, data: Uint8Array): Promise<ArrayBuffer> {
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    key as any,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  )
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return crypto.subtle.sign('HMAC', cryptoKey, data as any)
}

async function hmacSha256Hex(key: Uint8Array, data: Uint8Array): Promise<string> {
  const result = await hmacSha256(key, data)
  return Array.from(new Uint8Array(result))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

/**
 * Upload file to Cloudflare R2
 */
export async function uploadToR2(
  file: Buffer,
  filename: string,
  contentType: string
): Promise<{ url: string; key: string }> {
  const config = getR2Config()

  // Generate unique key
  const timestamp = Date.now()
  const randomStr = Math.random().toString(36).substring(2, 8)
  const ext = filename.split('.').pop() || 'jpg'
  const key = `products/${timestamp}-${randomStr}.${ext}`

  const endpoint = `https://${config.accountId}.r2.cloudflarestorage.com/${config.bucketName}/${key}`

  // Convert Buffer to Uint8Array for signing
  const fileData = new Uint8Array(file)

  const headers: Record<string, string> = {
    Host: `${config.accountId}.r2.cloudflarestorage.com`,
    'Content-Type': contentType,
    'Content-Length': file.length.toString(),
  }

  const signedHeaders = await signRequest('PUT', endpoint, headers, fileData, config)

  let response: Response
  try {
    response = await fetch(endpoint, {
      method: 'PUT',
      headers: signedHeaders,
      body: fileData,
    })
  } catch (fetchError) {
    const msg = fetchError instanceof Error ? fetchError.message : 'Network error'
    throw new Error(`R2 network error: ${msg}`)
  }

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`R2 upload failed: ${response.status} ${response.statusText} - ${error}`)
  }

  // Return public URL
  const publicUrl = config.publicUrl
    ? `${config.publicUrl}/${key}`
    : `https://${config.bucketName}.${config.accountId}.r2.cloudflarestorage.com/${key}`

  return { url: publicUrl, key }
}

/**
 * Delete file from Cloudflare R2
 */
export async function deleteFromR2(key: string): Promise<void> {
  const config = getR2Config()

  const endpoint = `https://${config.accountId}.r2.cloudflarestorage.com/${config.bucketName}/${key}`

  const headers: Record<string, string> = {
    Host: `${config.accountId}.r2.cloudflarestorage.com`,
  }

  const signedHeaders = await signRequest('DELETE', endpoint, headers, null, config)

  const response = await fetch(endpoint, {
    method: 'DELETE',
    headers: signedHeaders,
  })

  if (!response.ok && response.status !== 404) {
    throw new Error(`R2 delete failed: ${response.status}`)
  }
}

/**
 * Check if R2 is configured
 */
export function isR2Configured(): boolean {
  return !!(
    process.env.CLOUDFLARE_ACCOUNT_ID &&
    process.env.CLOUDFLARE_R2_ACCESS_KEY_ID &&
    process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY
  )
}
