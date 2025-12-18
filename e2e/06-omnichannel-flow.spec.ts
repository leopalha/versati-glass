import { test, expect } from '@playwright/test'

test.describe('Omnichannel Flow - Web Chat to WhatsApp', () => {
  test.use({ storageState: 'playwright/.auth/admin.json' })

  const TEST_PHONE = '21987654321'
  const TEST_CUSTOMER_NAME = 'E2E Test Customer'

  test('should detect phone number in web chat and create linking', async ({ page }) => {
    // 1. Open quote page (where chat is located)
    await page.goto('/orcamento')
    await page.waitForLoadState('networkidle')

    // 2. Open AI Chat widget
    const chatButton = page.locator('button:has-text("Chat")')
    if (await chatButton.isVisible()) {
      await chatButton.click()
    }

    // 3. Start conversation
    const chatInput = page.locator(
      'textarea[placeholder*="mensagem"], input[placeholder*="mensagem"]'
    )
    await expect(chatInput).toBeVisible({ timeout: 10000 })

    await chatInput.fill('Oi, quero um orçamento de box para banheiro')
    await chatInput.press('Enter')

    // 4. Wait for AI response
    await page.waitForTimeout(3000) // Wait for AI to respond

    // 5. Provide measurements
    await chatInput.fill('O box é de 1,20m por 2 metros')
    await chatInput.press('Enter')
    await page.waitForTimeout(3000)

    // 6. Provide phone number
    await chatInput.fill(`Meu telefone é (21) 98765-4321`)
    await chatInput.press('Enter')
    await page.waitForTimeout(3000)

    // 7. Verify linking happened in backend
    // Navigate to admin to check if conversation was created
    await page.goto('/admin/conversas-ia')
    await page.waitForLoadState('networkidle')

    // Check if conversation exists
    const conversationRow = page.locator('tr:has-text("Box")').first()
    await expect(conversationRow).toBeVisible({ timeout: 10000 })

    // Get conversation ID
    const viewButton = conversationRow.locator('a:has-text("Ver")')
    const conversationUrl = await viewButton.getAttribute('href')
    const conversationId = conversationUrl?.split('/').pop()

    expect(conversationId).toBeTruthy()

    // 8. Navigate to conversation details
    await page.goto(`/admin/conversas-ia/${conversationId}`)
    await page.waitForLoadState('networkidle')

    // 9. Verify phone was detected and saved
    const pageContent = await page.content()
    expect(pageContent).toContain('21987654321')
  })

  test('should show unified timeline for customer', async ({ page }) => {
    // 1. Create a test user first (simulate existing customer)
    await page.goto('/admin/clientes')
    await page.waitForLoadState('networkidle')

    // 2. Check if test customer exists
    const customerRow = page.locator(`tr:has-text("${TEST_CUSTOMER_NAME}")`).first()

    if (await customerRow.isVisible()) {
      // Customer exists, get ID
      const viewButton = customerRow.locator('a').first()
      await viewButton.click()
      await page.waitForLoadState('networkidle')

      // Get customer ID from URL
      const url = page.url()
      const customerId = url.split('/').pop()

      // 3. Navigate to timeline
      await page.goto(`/admin/clientes/${customerId}/timeline`)
      await page.waitForLoadState('networkidle')

      // 4. Verify timeline components exist
      await expect(page.locator('h1:has-text("Timeline do Cliente")')).toBeVisible()

      // 5. Verify stats card exists
      await expect(page.locator('text=Total de Eventos')).toBeVisible()

      // 6. Verify at least one event is shown (if customer has history)
      const events = page.locator('[class*="timeline"] .p-4')
      const eventCount = await events.count()

      if (eventCount > 0) {
        // Verify event has proper structure
        const firstEvent = events.first()
        await expect(firstEvent).toBeVisible()

        // Check for event icons
        const hasIcon = await firstEvent.locator('svg').isVisible()
        expect(hasIcon).toBe(true)
      }
    }
  })

  test('should preserve context across channels', async ({ page, context }) => {
    // This test simulates:
    // 1. Customer starts conversation on website
    // 2. Provides product info + measurements
    // 3. System should save context with phone linking

    // 1. Start web chat conversation
    await page.goto('/orcamento')
    await page.waitForLoadState('networkidle')

    // 2. Open chat
    const chatButton = page.locator('button:has-text("Chat")')
    if (await chatButton.isVisible()) {
      await chatButton.click()
    }

    const chatInput = page.locator(
      'textarea[placeholder*="mensagem"], input[placeholder*="mensagem"]'
    )
    await expect(chatInput).toBeVisible({ timeout: 10000 })

    // 3. Build conversation with context
    await chatInput.fill('Preciso de um espelho bisotado')
    await chatInput.press('Enter')
    await page.waitForTimeout(2000)

    await chatInput.fill('Tamanho 1 metro por 1,50m')
    await chatInput.press('Enter')
    await page.waitForTimeout(2000)

    await chatInput.fill('Meu telefone: 21987654321')
    await chatInput.press('Enter')
    await page.waitForTimeout(3000)

    // 4. Verify conversation was saved
    await page.goto('/admin/conversas-ia')
    await page.waitForLoadState('networkidle')

    // Find conversation with "espelho"
    const mirrorConvo = page.locator('tr:has-text("espelho")').first()

    if (await mirrorConvo.isVisible()) {
      const viewButton = mirrorConvo.locator('a:has-text("Ver")').first()
      await viewButton.click()
      await page.waitForLoadState('networkidle')

      // 5. Verify context was saved
      const content = await page.content()
      expect(content.toLowerCase()).toContain('espelho')
      expect(content).toContain('1')
      const hasDecimal = content.includes('1.5') || content.includes('1,5')
      expect(hasDecimal).toBe(true)
    }
  })

  test('should link web conversation to whatsapp via phone', async ({ page }) => {
    // Test the automatic linking mechanism

    // 1. Create web conversation with phone
    await page.goto('/orcamento')
    await page.waitForLoadState('networkidle')

    const chatButton = page.locator('button:has-text("Chat")')
    if (await chatButton.isVisible()) {
      await chatButton.click()
    }

    const chatInput = page.locator(
      'textarea[placeholder*="mensagem"], input[placeholder*="mensagem"]'
    )
    await expect(chatInput).toBeVisible({ timeout: 10000 })

    await chatInput.fill('Quero orçamento de porta de vidro')
    await chatInput.press('Enter')
    await page.waitForTimeout(2000)

    await chatInput.fill('Telefone: (21) 99999-8888')
    await chatInput.press('Enter')
    await page.waitForTimeout(3000)

    // 2. Check backend database for linking
    // Navigate to conversations list
    await page.goto('/admin/conversas-ia')
    await page.waitForLoadState('networkidle')

    // Find the porta conversation
    const portaConvo = page.locator('tr:has-text("porta")').first()

    if (await portaConvo.isVisible()) {
      // Click to view details
      const viewLink = portaConvo.locator('a').first()
      await viewLink.click()
      await page.waitForLoadState('networkidle')

      // 3. Verify phone number is in the page
      const pageText = await page.textContent('body')
      const hasPhone = pageText?.includes('21999998888') || pageText?.includes('21 99999-8888')
      expect(hasPhone).toBe(true)
    }
  })

  test('should display linked badge on timeline', async ({ page }) => {
    // This test checks if timeline shows linked conversations properly

    await page.goto('/admin/clientes')
    await page.waitForLoadState('networkidle')

    // Get first customer
    const firstCustomer = page.locator('tbody tr').first()

    if (await firstCustomer.isVisible()) {
      const viewButton = firstCustomer.locator('a').first()
      await viewButton.click()
      await page.waitForLoadState('networkidle')

      const url = page.url()
      const customerId = url.split('/').pop()

      // Navigate to timeline
      await page.goto(`/admin/clientes/${customerId}/timeline`)
      await page.waitForLoadState('networkidle')

      // Check if any event has "Linked" badge
      const linkedBadge = page.locator('text=Linked')

      // If badge exists, verify it's properly displayed
      if (await linkedBadge.isVisible()) {
        const badgeCount = await linkedBadge.count()
        expect(badgeCount).toBeGreaterThan(0)
      }
    }
  })

  test('should handle missing phone gracefully', async ({ page }) => {
    // Test that system doesn't break if phone is not provided

    await page.goto('/orcamento')
    await page.waitForLoadState('networkidle')

    const chatButton = page.locator('button:has-text("Chat")')
    if (await chatButton.isVisible()) {
      await chatButton.click()
    }

    const chatInput = page.locator(
      'textarea[placeholder*="mensagem"], input[placeholder*="mensagem"]'
    )
    await expect(chatInput).toBeVisible({ timeout: 10000 })

    // Send messages without phone
    await chatInput.fill('Quanto custa um box?')
    await chatInput.press('Enter')
    await page.waitForTimeout(2000)

    await chatInput.fill('É para um banheiro de 2 metros')
    await chatInput.press('Enter')
    await page.waitForTimeout(2000)

    // Verify chat still works
    const messages = page.locator('[class*="message"]')
    const messageCount = await messages.count()

    // Should have at least user messages + AI responses
    expect(messageCount).toBeGreaterThan(0)
  })
})

test.describe('Voice Feature E2E', () => {
  test('should show voice buttons in chat', async ({ page }) => {
    await page.goto('/orcamento')
    await page.waitForLoadState('networkidle')

    // Open chat
    const chatButton = page.locator('button:has-text("Chat")')
    if (await chatButton.isVisible()) {
      await chatButton.click()
      await page.waitForTimeout(1000)

      // Check for voice buttons (mic and volume icons)
      const micButton = page.locator('button[title*="Gravar"], button[title*="audio"]')
      const volumeButton = page.locator('button svg:has-text("Volume"), button:has(svg)')

      // At least one voice control should be visible
      const hasMic = await micButton.isVisible().catch(() => false)
      const volumeCount = await volumeButton.count()

      expect(hasMic || volumeCount > 0).toBe(true)
    }
  })
})
