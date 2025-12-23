#!/usr/bin/env node

/**
 * Generate VAPID keys for Web Push notifications
 *
 * Run: node scripts/generate-vapid-keys.js
 *
 * Add the output to your .env file:
 * NEXT_PUBLIC_VAPID_PUBLIC_KEY=...
 * VAPID_PRIVATE_KEY=...
 * VAPID_EMAIL=noreply@versatiglass.com.br
 */

const webpush = require('web-push')

console.log('\n🔑 Generating VAPID keys for Web Push notifications...\n')

const vapidKeys = webpush.generateVAPIDKeys()

console.log('✅ VAPID keys generated successfully!\n')
console.log('Add these to your .env file:\n')
console.log('─'.repeat(60))
console.log(`NEXT_PUBLIC_VAPID_PUBLIC_KEY=${vapidKeys.publicKey}`)
console.log(`VAPID_PRIVATE_KEY=${vapidKeys.privateKey}`)
console.log(`VAPID_EMAIL=noreply@versatiglass.com.br`)
console.log('─'.repeat(60))
console.log('\n⚠️  Keep the private key secure and never commit it to git!\n')
