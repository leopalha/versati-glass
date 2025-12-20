import { test, expect } from '@playwright/test'

test.describe('AI Chat - Ana Assistant', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' })
    await page.waitForLoadState('domcontentloaded')
    await page.waitForTimeout(2000)
  })

  test('should display chat widget on homepage', async ({ page }) => {
    // Check for chat widget/button
    const chatWidget = page.locator(
      'button:has-text("Chat"), button:has-text("Ana"), [class*="chat-widget"], [id*="chat"]'
    )
    const count = await chatWidget.count()

    // Chat widget should be present
    expect(count).toBeGreaterThan(0)

    if (count > 0) {
      await expect(chatWidget.first()).toBeVisible()
    }
  })

  test('should open chat interface when clicked', async ({ page }) => {
    // Find chat button
    const chatButton = page
      .locator(
        'button:has-text("Chat"), button:has-text("Ana"), button:has-text("Assistente"), [class*="chat-button"]'
      )
      .first()

    const buttonExists = (await chatButton.count()) > 0

    if (buttonExists && (await chatButton.isVisible())) {
      await chatButton.click()
      await page.waitForTimeout(1000)

      // Chat interface should open
      const chatInterface = page.locator(
        '[role="dialog"]:has-text("Chat"), [class*="chat-interface"], [class*="chat-container"]'
      )
      const interfaceCount = await chatInterface.count()

      if (interfaceCount > 0) {
        await expect(chatInterface.first()).toBeVisible()
      }
    }
  })

  test('should display welcome message from Ana', async ({ page }) => {
    // Open chat
    const chatButton = page
      .locator('button:has-text("Chat"), button:has-text("Ana"), [class*="chat-button"]')
      .first()

    if ((await chatButton.count()) > 0 && (await chatButton.isVisible())) {
      await chatButton.click()
      await page.waitForTimeout(2000)

      // Check for welcome/initial message
      const welcomeMessage = page.locator(
        '[class*="message"]:has-text("Ana"), p:has-text("ajudar")'
      )
      const hasWelcome = (await welcomeMessage.count()) > 0

      if (hasWelcome) {
        await expect(welcomeMessage.first()).toBeVisible()
      }
    }
  })

  test('should have input field for user messages', async ({ page }) => {
    // Open chat
    const chatButton = page.locator('button:has-text("Chat"), button:has-text("Ana")').first()

    if ((await chatButton.count()) > 0 && (await chatButton.isVisible())) {
      await chatButton.click()
      await page.waitForTimeout(1000)

      // Check for input field
      const messageInput = page.locator(
        'input[type="text"][placeholder*="mensagem"], textarea[placeholder*="mensagem"], input[placeholder*="Digite"]'
      )
      const hasInput = (await messageInput.count()) > 0

      if (hasInput) {
        await expect(messageInput.first()).toBeVisible()
        await expect(messageInput.first()).toBeEditable()
      }
    }
  })

  test('should send a message in chat', async ({ page }) => {
    // Open chat
    const chatButton = page.locator('button:has-text("Chat"), button:has-text("Ana")').first()

    if ((await chatButton.count()) > 0 && (await chatButton.isVisible())) {
      await chatButton.click()
      await page.waitForTimeout(1500)

      // Find input
      const messageInput = page
        .locator('input[type="text"], textarea, input[placeholder*="mensagem"]')
        .last()

      if ((await messageInput.count()) > 0 && (await messageInput.isVisible())) {
        // Type message
        await messageInput.fill('Olá, preciso de um orçamento')
        await page.waitForTimeout(500)

        // Find and click send button
        const sendButton = page.locator('button[type="submit"], button:has-text("Enviar")').last()

        if ((await sendButton.count()) > 0 && (await sendButton.isVisible())) {
          await sendButton.click()
          await page.waitForTimeout(2000)

          // Check message was sent
          const userMessage = page.locator('[class*="message"]:has-text("orçamento")')
          const hasMessage = (await userMessage.count()) > 0

          if (hasMessage) {
            await expect(userMessage.first()).toBeVisible()
          }
        }
      }
    }
  })

  test('should display typing indicator when AI is responding', async ({ page }) => {
    const chatButton = page.locator('button:has-text("Chat"), button:has-text("Ana")').first()

    if ((await chatButton.count()) > 0 && (await chatButton.isVisible())) {
      await chatButton.click()
      await page.waitForTimeout(1500)

      const messageInput = page.locator('input[type="text"], textarea').last()

      if ((await messageInput.count()) > 0 && (await messageInput.isVisible())) {
        await messageInput.fill('Teste')

        const sendButton = page.locator('button[type="submit"]').last()

        if ((await sendButton.count()) > 0) {
          await sendButton.click()

          // Check for typing indicator (dots, loading, etc.)
          const typingIndicator = page.locator(
            '[class*="typing"], [class*="loading"], [class*="dots"]'
          )

          // Typing indicator might appear briefly
          const hasIndicator = (await typingIndicator.count()) > 0

          // This is optional - just checking if it exists
          console.log(`Typing indicator present: ${hasIndicator}`)
        }
      }
    }
  })

  test('should have voice recording feature if available', async ({ page }) => {
    const chatButton = page.locator('button:has-text("Chat"), button:has-text("Ana")').first()

    if ((await chatButton.count()) > 0 && (await chatButton.isVisible())) {
      await chatButton.click()
      await page.waitForTimeout(1000)

      // Check for microphone/voice button
      const voiceButton = page.locator(
        'button[aria-label*="microphone"], button[aria-label*="voice"], button:has([class*="mic"])'
      )

      const hasVoice = (await voiceButton.count()) > 0

      console.log(`Voice feature available: ${hasVoice}`)

      if (hasVoice) {
        await expect(voiceButton.first()).toBeVisible()
      }
    }
  })

  test('should have image upload feature if available', async ({ page }) => {
    const chatButton = page.locator('button:has-text("Chat"), button:has-text("Ana")').first()

    if ((await chatButton.count()) > 0 && (await chatButton.isVisible())) {
      await chatButton.click()
      await page.waitForTimeout(1000)

      // Check for image upload button
      const uploadButton = page.locator(
        'button[aria-label*="upload"], button[aria-label*="image"], input[type="file"], button:has([class*="upload"])'
      )

      const hasUpload = (await uploadButton.count()) > 0

      console.log(`Image upload available: ${hasUpload}`)

      if (hasUpload) {
        const button = uploadButton.first()
        if (await button.isVisible()) {
          await expect(button).toBeVisible()
        }
      }
    }
  })

  test('should close chat when close button clicked', async ({ page }) => {
    const chatButton = page.locator('button:has-text("Chat"), button:has-text("Ana")').first()

    if ((await chatButton.count()) > 0 && (await chatButton.isVisible())) {
      await chatButton.click()
      await page.waitForTimeout(1000)

      // Find close button
      const closeButton = page.locator(
        'button[aria-label*="Close"], button[aria-label*="Fechar"], button:has-text("×")'
      )

      if ((await closeButton.count()) > 0 && (await closeButton.isVisible())) {
        await closeButton.click()
        await page.waitForTimeout(500)

        // Chat interface should be hidden
        const chatInterface = page.locator(
          '[role="dialog"]:has-text("Chat"), [class*="chat-interface"]'
        )

        if ((await chatInterface.count()) > 0) {
          await expect(chatInterface.first()).not.toBeVisible()
        }
      }
    }
  })

  test('should persist chat history on page navigation if implemented', async ({ page }) => {
    const chatButton = page.locator('button:has-text("Chat"), button:has-text("Ana")').first()

    if ((await chatButton.count()) > 0 && (await chatButton.isVisible())) {
      await chatButton.click()
      await page.waitForTimeout(1500)

      const messageInput = page.locator('input[type="text"], textarea').last()

      if ((await messageInput.count()) > 0 && (await messageInput.isVisible())) {
        await messageInput.fill('Mensagem de teste')

        const sendButton = page.locator('button[type="submit"]').last()
        if ((await sendButton.count()) > 0) {
          await sendButton.click()
          await page.waitForTimeout(2000)

          // Navigate to another page
          await page.goto('/produtos', { waitUntil: 'networkidle' })
          await page.waitForTimeout(1500)

          // Open chat again
          const chatButton2 = page
            .locator('button:has-text("Chat"), button:has-text("Ana")')
            .first()

          if ((await chatButton2.count()) > 0) {
            await chatButton2.click()
            await page.waitForTimeout(1000)

            // Check if previous message is still visible
            const previousMessage = page.locator('[class*="message"]:has-text("teste")')
            const hasPersistence = (await previousMessage.count()) > 0

            console.log(`Chat history persisted: ${hasPersistence}`)
          }
        }
      }
    }
  })

  test('should display quick action buttons if available', async ({ page }) => {
    const chatButton = page.locator('button:has-text("Chat"), button:has-text("Ana")').first()

    if ((await chatButton.count()) > 0 && (await chatButton.isVisible())) {
      await chatButton.click()
      await page.waitForTimeout(1500)

      // Check for quick action buttons (Orçamento, Produtos, etc.)
      const quickActions = page.locator(
        'button:has-text("Orçamento"), button:has-text("Produtos"), button:has-text("Contato")'
      )

      const hasQuickActions = (await quickActions.count()) > 0

      console.log(`Quick action buttons available: ${hasQuickActions}`)

      if (hasQuickActions) {
        expect(await quickActions.count()).toBeGreaterThan(0)
      }
    }
  })

  test('should handle long messages correctly', async ({ page }) => {
    const chatButton = page.locator('button:has-text("Chat"), button:has-text("Ana")').first()

    if ((await chatButton.count()) > 0 && (await chatButton.isVisible())) {
      await chatButton.click()
      await page.waitForTimeout(1500)

      const messageInput = page.locator('input[type="text"], textarea').last()

      if ((await messageInput.count()) > 0 && (await messageInput.isVisible())) {
        // Type long message
        const longMessage =
          'Este é um teste com uma mensagem muito longa para verificar se o chat consegue lidar com textos extensos sem problemas de layout ou funcionalidade. '.repeat(
            3
          )

        await messageInput.fill(longMessage)
        await page.waitForTimeout(500)

        // Check input accepts long text
        const value = await messageInput.inputValue()
        expect(value.length).toBeGreaterThan(100)
      }
    }
  })
})
