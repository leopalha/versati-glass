import { test as base, expect, Page } from '@playwright/test'

/**
 * Helper function to login via the UI
 * This ensures CSRF cookies are properly established
 */
export async function loginAsUser(page: Page, email: string, password: string): Promise<boolean> {
  // Go to login page first to establish CSRF cookie
  await page.goto('/login', { waitUntil: 'networkidle' })
  await page.waitForLoadState('domcontentloaded')
  await page.waitForTimeout(1000)

  // Fill login form
  await page.locator('input[id="email"]').fill(email)
  await page.locator('input[id="password"]').fill(password)

  // Click submit
  await page.getByRole('button', { name: /entrar/i }).click()

  // Wait for navigation or error
  try {
    await page.waitForURL(/\/admin|\/portal/, { timeout: 30000 })
    return true
  } catch {
    // Check if still on login page (credentials error)
    const currentUrl = page.url()
    return !currentUrl.includes('/login')
  }
}

/**
 * Login as admin user
 */
export async function loginAsAdmin(page: Page): Promise<boolean> {
  return loginAsUser(page, 'admin@versatiglass.com', 'admin123')
}

/**
 * Login as customer user
 */
export async function loginAsCustomer(page: Page): Promise<boolean> {
  return loginAsUser(page, 'customer@versatiglass.com', 'customer123')
}

/**
 * Logout current user
 */
export async function logout(page: Page): Promise<void> {
  // Navigate to logout or clear cookies
  await page.goto('/api/auth/signout', { waitUntil: 'networkidle' })

  // Click confirm button if present
  const confirmBtn = page.getByRole('button', { name: /sign out|sair/i })
  if (await confirmBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
    await confirmBtn.click()
    await page.waitForTimeout(1000)
  }

  // Clear all cookies as fallback
  await page.context().clearCookies()
}

/**
 * Extended test fixture with authentication helpers
 */
export const test = base.extend<{
  authenticatedPage: Page
  adminPage: Page
  customerPage: Page
}>({
  authenticatedPage: async ({ page }, use) => {
    // Default to customer login
    await loginAsCustomer(page)
    await use(page)
  },
  adminPage: async ({ page }, use) => {
    await loginAsAdmin(page)
    await use(page)
  },
  customerPage: async ({ page }, use) => {
    await loginAsCustomer(page)
    await use(page)
  },
})

export { expect }
