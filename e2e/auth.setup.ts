import { test as setup, expect } from '@playwright/test'
import path from 'path'
import fs from 'fs'

const STORAGE_STATE_DIR = path.join(__dirname, '../.playwright/.auth')
const customerAuthFile = path.join(STORAGE_STATE_DIR, 'customer.json')
const adminAuthFile = path.join(STORAGE_STATE_DIR, 'admin.json')

// Ensure auth directory exists
setup.beforeAll(async () => {
  if (!fs.existsSync(STORAGE_STATE_DIR)) {
    fs.mkdirSync(STORAGE_STATE_DIR, { recursive: true })
  }
})

setup('authenticate as customer', async ({ page }) => {
  // Go to login page
  await page.goto('/login', { waitUntil: 'networkidle' })
  await page.waitForLoadState('domcontentloaded')
  await page.waitForTimeout(3000) // Wait for hydration and CSRF token

  // Fill login form
  await page.locator('input[id="email"]').fill('customer@versatiglass.com')
  await page.locator('input[id="password"]').fill('customer123')

  // Submit and wait for response
  await page.getByRole('button', { name: /entrar/i }).click()

  // Wait for either redirect or loading spinner to appear and disappear
  await page.waitForTimeout(3000) // Wait for signIn to process

  // Check if we got redirected or if we need to wait more
  const currentUrl = page.url()
  if (currentUrl.includes('/login')) {
    // Still on login, wait more and check for toast
    await page.waitForTimeout(5000)
  }

  // Try to navigate to portal directly if login succeeded
  await page.goto('/portal', { waitUntil: 'networkidle' })
  await page.waitForLoadState('domcontentloaded')

  // Check if we're logged in (not redirected back to login)
  const finalUrl = page.url()
  if (finalUrl.includes('/portal')) {
    // Save storage state
    await page.context().storageState({ path: customerAuthFile })
  } else {
    throw new Error('Login failed - redirected to: ' + finalUrl)
  }
})

setup('authenticate as admin', async ({ page }) => {
  // Go to login page
  await page.goto('/login', { waitUntil: 'networkidle' })
  await page.waitForLoadState('domcontentloaded')
  await page.waitForTimeout(3000) // Wait for hydration and CSRF token

  // Fill login form
  await page.locator('input[id="email"]').fill('admin@versatiglass.com')
  await page.locator('input[id="password"]').fill('admin123')

  // Submit and wait for response
  await page.getByRole('button', { name: /entrar/i }).click()

  // Wait for either redirect or loading spinner to appear and disappear
  await page.waitForTimeout(3000) // Wait for signIn to process

  // Check if we got redirected or if we need to wait more
  const currentUrl = page.url()
  if (currentUrl.includes('/login')) {
    // Still on login, wait more
    await page.waitForTimeout(5000)
  }

  // Try to navigate to admin directly if login succeeded
  await page.goto('/admin', { waitUntil: 'networkidle' })
  await page.waitForLoadState('domcontentloaded')

  // Check if we're logged in (not redirected back to login)
  const finalUrl = page.url()
  if (finalUrl.includes('/admin')) {
    // Save storage state
    await page.context().storageState({ path: adminAuthFile })
  } else {
    throw new Error('Admin login failed - redirected to: ' + finalUrl)
  }
})
