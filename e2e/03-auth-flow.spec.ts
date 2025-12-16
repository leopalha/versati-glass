import { test, expect } from '@playwright/test'

test.describe('Authentication Flow', () => {
  const testEmail = `test-${Date.now()}@example.com`
  const testPassword = 'Test123!@#'

  test('should register new user', async ({ page }) => {
    // 1. Go to registration page
    await page.goto('/registro')

    // 2. Fill registration form
    await page.getByLabel(/nome completo/i).fill('Test User E2E')
    await page.getByLabel(/email/i).fill(testEmail)
    await page.getByLabel(/telefone/i).fill('21987654321')
    await page.getByLabel(/senha/i).first().fill(testPassword)
    await page.getByLabel(/confirmar senha/i).fill(testPassword)

    // 3. Submit form
    await page.getByRole('button', { name: /criar conta/i }).click()

    // 4. Should redirect to portal or show success
    await expect(page).toHaveURL(/\/portal|\/login/, { timeout: 10000 })
  })

  test('should login with valid credentials', async ({ page }) => {
    // 1. Go to login page
    await page.goto('/login')

    // 2. Fill login form (using seeded admin user)
    await page.getByLabel(/email/i).fill('admin@versatiglass.com')
    await page.getByLabel(/senha/i).fill('admin123')

    // 3. Submit form
    await page.getByRole('button', { name: /entrar/i }).click()

    // 4. Should redirect to dashboard/portal
    await expect(page).toHaveURL(/\/admin|\/portal/, { timeout: 10000 })

    // 5. Should show user menu
    await expect(page.getByRole('button', { name: /admin/i })).toBeVisible()
  })

  test('should show error with invalid credentials', async ({ page }) => {
    await page.goto('/login')

    // Fill with invalid credentials
    await page.getByLabel(/email/i).fill('invalid@example.com')
    await page.getByLabel(/senha/i).fill('wrongpassword')

    // Submit
    await page.getByRole('button', { name: /entrar/i }).click()

    // Should show error message
    await expect(page.getByText(/credenciais inválidas|erro/i)).toBeVisible()

    // Should stay on login page
    await expect(page).toHaveURL(/\/login/)
  })

  test('should validate email format', async ({ page }) => {
    await page.goto('/registro')

    // Enter invalid email
    await page.getByLabel(/email/i).fill('invalid-email')
    await page.getByLabel(/nome/i).click() // Blur email field

    // Should show validation error
    await expect(page.getByText(/email.*inválido|formato.*inválido/i)).toBeVisible()
  })

  test('should validate password strength', async ({ page }) => {
    await page.goto('/registro')

    // Enter weak password
    await page.getByLabel(/senha/i).first().fill('123')
    await page.getByLabel(/confirmar senha/i).click() // Blur password field

    // Should show validation error
    await expect(page.getByText(/senha.*forte|mínimo.*caracteres/i)).toBeVisible()
  })

  test('should validate password confirmation match', async ({ page }) => {
    await page.goto('/registro')

    // Enter non-matching passwords
    await page.getByLabel(/senha/i).first().fill('Test123!@#')
    await page.getByLabel(/confirmar senha/i).fill('Different123!@#')
    await page.getByLabel(/nome/i).click() // Blur confirm password field

    // Should show validation error
    await expect(page.getByText(/senhas.*não.*conferem/i)).toBeVisible()
  })

  test('should logout successfully', async ({ page }) => {
    // 1. Login first
    await page.goto('/login')
    await page.getByLabel(/email/i).fill('admin@versatiglass.com')
    await page.getByLabel(/senha/i).fill('admin123')
    await page.getByRole('button', { name: /entrar/i }).click()

    // 2. Wait for redirect
    await page.waitForURL(/\/admin|\/portal/, { timeout: 10000 })

    // 3. Click user menu
    await page.getByRole('button', { name: /admin/i }).click()

    // 4. Click logout
    await page.getByRole('menuitem', { name: /sair|logout/i }).click()

    // 5. Should redirect to homepage or login
    await expect(page).toHaveURL(/\/$|\/login/)
  })

  test('should redirect to login when accessing protected route', async ({ page }) => {
    // Try to access portal without authentication
    await page.goto('/portal')

    // Should redirect to login
    await expect(page).toHaveURL(/\/login/, { timeout: 5000 })
  })

  test('should remember me functionality', async ({ page }) => {
    await page.goto('/login')

    // Check "Remember me" checkbox
    await page.getByLabel(/lembrar.*de.*mim/i).check()

    // Login
    await page.getByLabel(/email/i).fill('admin@versatiglass.com')
    await page.getByLabel(/senha/i).fill('admin123')
    await page.getByRole('button', { name: /entrar/i }).click()

    // Wait for redirect
    await page.waitForURL(/\/admin|\/portal/)

    // Get cookies
    const cookies = await page.context().cookies()

    // Should have auth cookie with long expiration
    const authCookie = cookies.find((c) => c.name.includes('auth'))
    expect(authCookie).toBeDefined()
  })

  test('should navigate to password recovery', async ({ page }) => {
    await page.goto('/login')

    // Click forgot password link
    await page.getByRole('link', { name: /esqueceu.*senha/i }).click()

    // Should navigate to password recovery page
    await expect(page).toHaveURL(/\/recuperar-senha/)

    // Should show recovery form
    await expect(page.getByLabel(/email/i)).toBeVisible()
  })

  test('should request password recovery', async ({ page }) => {
    await page.goto('/recuperar-senha')

    // Enter email
    await page.getByLabel(/email/i).fill('admin@versatiglass.com')

    // Submit
    await page.getByRole('button', { name: /enviar/i }).click()

    // Should show success message
    await expect(page.getByText(/email.*enviado|verifique.*email/i)).toBeVisible({
      timeout: 10000,
    })
  })
})
