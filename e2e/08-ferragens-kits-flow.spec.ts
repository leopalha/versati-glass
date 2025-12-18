import { test, expect } from '@playwright/test'
import { setupTestEnvironment, cleanupTestData } from './fixtures/test-helpers'

/**
 * E2E Tests for FERRAGENS and KITS Quote Flows
 *
 * Tests the specialized forms for hardware and kit products
 * introduced in Phase 2 of the conditional fields implementation
 */

test.describe('Ferragens (Hardware) Quote Flow', () => {
  test.beforeEach(async ({ page }) => {
    await setupTestEnvironment(page)
    await page.goto('http://localhost:3000')
  })

  test.afterEach(async () => {
    await cleanupTestData()
  })

  test('should complete ferragens quote with dobradiça selection', async ({ page }) => {
    // Navigate to quote wizard
    await page.click('text=Fazer Orçamento')
    await expect(page).toHaveURL(/.*orcamento/)

    // Step 0: Location (CEP)
    await page.fill('input[name="cep"]', '01310-100')
    await page.click('button:has-text("Continuar")')
    await expect(page.locator('text=São Paulo - SP')).toBeVisible()
    await page.click('button:has-text("Confirmar")')

    // Step 1: Category - Select FERRAGENS
    await expect(page.locator('h2:has-text("Categoria")')).toBeVisible()
    await page.click('button:has-text("Ferragens")')

    // Step 2: Product - Select Ferragens Avulsas
    await expect(page.locator('h2:has-text("Produto")')).toBeVisible()
    await page.click('button:has-text("Ferragens Avulsas")')
    await page.click('button:has-text("Continuar")')

    // Step 3: Details - FERRAGENS specific form
    await expect(page.locator('h2:has-text("Ferragens Avulsas")')).toBeVisible()

    // Should NOT have width/height fields
    await expect(page.locator('input[id="width"]')).not.toBeVisible()
    await expect(page.locator('input[id="height"]')).not.toBeVisible()

    // Select hardware type: Dobradiça
    await page.click('button:has-text("Selecione o tipo")')
    await page.click('text=Dobradiça')

    // Code field should appear for dobradiça
    await expect(page.locator('text=Código/Modelo')).toBeVisible()
    await page.click('button:has-text("Selecione o código")')
    await page.click('text=1101 - Superior sem pino')

    // Set quantity
    await page.fill('input[id="quantity"]', '4')

    // Select color
    await page.click('button:has-text("Selecione"):below(text=Acabamento/Cor)')
    await page.click('text=Cromado')

    // Add description
    await page.fill('textarea', 'Dobradiças para porta de vidro 10mm')

    // Continue to cart
    await page.click('button:has-text("Adicionar e Ir pro Carrinho")')

    // Step 4: Cart review
    await expect(page.locator('h2:has-text("Carrinho")')).toBeVisible()
    await expect(page.locator('text=Dobradiça')).toBeVisible()
    await expect(page.locator('text=1101 - Superior sem pino')).toBeVisible()
    await expect(page.locator('text=4')).toBeVisible() // Quantity
    await expect(page.locator('text=Cromado')).toBeVisible()
  })

  test('should handle multiple ferragens items', async ({ page }) => {
    // Navigate and setup
    await page.goto('http://localhost:3000/orcamento')
    await page.fill('input[name="cep"]', '01310-100')
    await page.click('button:has-text("Continuar")')
    await page.click('button:has-text("Confirmar")')

    // Select FERRAGENS category
    await page.click('button:has-text("Ferragens")')
    await page.click('button:has-text("Ferragens Avulsas")')
    await page.click('button:has-text("Continuar")')

    // Add first item: Dobradiça
    await page.click('button:has-text("Selecione o tipo")')
    await page.click('text=Dobradiça')
    await page.click('button:has-text("Selecione o código")')
    await page.click('text=1101 - Superior sem pino')
    await page.fill('input[id="quantity"]', '2')
    await page.click('button:has-text("Adicionar e Ir pro Carrinho")')

    // Add another item
    await page.click('button:has-text("Adicionar Mais Produtos")')

    // This should go back to step 2 (product selection)
    await expect(page.locator('h2:has-text("Produto")')).toBeVisible()
    await page.click('button:has-text("Ferragens Avulsas")')
    await page.click('button:has-text("Continuar")')

    // Add second item: Fechadura
    await page.click('button:has-text("Selecione o tipo")')
    await page.click('text=Fechadura/Trinco')
    await page.click('button:has-text("Selecione o código")')
    await page.click('text=1520 - Fechadura central')
    await page.fill('input[id="quantity"]', '1')
    await page.click('button:has-text("Adicionar e Ir pro Carrinho")')

    // Verify both items in cart
    await expect(page.locator('text=Dobradiça')).toBeVisible()
    await expect(page.locator('text=Fechadura/Trinco')).toBeVisible()
    await expect(page.locator('text=1520 - Fechadura central')).toBeVisible()
  })

  test('should validate required fields for ferragens', async ({ page }) => {
    await page.goto('http://localhost:3000/orcamento')
    await page.fill('input[name="cep"]', '01310-100')
    await page.click('button:has-text("Continuar")')
    await page.click('button:has-text("Confirmar")')
    await page.click('button:has-text("Ferragens")')
    await page.click('button:has-text("Ferragens Avulsas")')
    await page.click('button:has-text("Continuar")')

    // Try to continue without selecting type
    await page.click('button:has-text("Adicionar e Ir pro Carrinho")')

    // Should show validation error
    await expect(page.locator('text=Selecione o tipo de ferragem')).toBeVisible()

    // Select type that requires code
    await page.click('button:has-text("Selecione o tipo")')
    await page.click('text=Pivô')

    // Try to continue without code
    await page.click('button:has-text("Adicionar e Ir pro Carrinho")')

    // Should show code validation error
    await expect(page.locator('text=Selecione o código/modelo da ferragem')).toBeVisible()
  })

  test('should allow ferragens without codes', async ({ page }) => {
    await page.goto('http://localhost:3000/orcamento')
    await page.fill('input[name="cep"]', '01310-100')
    await page.click('button:has-text("Continuar")')
    await page.click('button:has-text("Confirmar")')
    await page.click('button:has-text("Ferragens")')
    await page.click('button:has-text("Ferragens Avulsas")')
    await page.click('button:has-text("Continuar")')

    // Select type that doesn't require code (Puxador)
    await page.click('button:has-text("Selecione o tipo")')
    await page.click('text=Puxador')

    // Code field should NOT appear
    await expect(page.locator('text=Código/Modelo')).not.toBeVisible()

    // Set quantity
    await page.fill('input[id="quantity"]', '2')

    // Should be able to continue
    await page.click('button:has-text("Adicionar e Ir pro Carrinho")')

    // Should successfully add to cart
    await expect(page.locator('h2:has-text("Carrinho")')).toBeVisible()
    await expect(page.locator('text=Puxador')).toBeVisible()
  })
})

test.describe('Kits Quote Flow', () => {
  test.beforeEach(async ({ page }) => {
    await setupTestEnvironment(page)
    await page.goto('http://localhost:3000')
  })

  test.afterEach(async () => {
    await cleanupTestData()
  })

  test('should complete kits quote with kit selection', async ({ page }) => {
    // Navigate to quote wizard
    await page.click('text=Fazer Orçamento')
    await expect(page).toHaveURL(/.*orcamento/)

    // Step 0: Location
    await page.fill('input[name="cep"]', '01310-100')
    await page.click('button:has-text("Continuar")')
    await page.click('button:has-text("Confirmar")')

    // Step 1: Category - Select KITS
    await expect(page.locator('h2:has-text("Categoria")')).toBeVisible()
    await page.click('button:has-text("Kits")')

    // Step 2: Product - Select Kit para Box
    await expect(page.locator('h2:has-text("Produto")')).toBeVisible()
    await page.click('button:has-text("Kit para Box")')
    await page.click('button:has-text("Continuar")')

    // Step 3: Details - KITS specific form
    await expect(page.locator('h2:has-text("Kits Completos")')).toBeVisible()

    // Should NOT have width/height fields
    await expect(page.locator('input[id="width"]')).not.toBeVisible()
    await expect(page.locator('input[id="height"]')).not.toBeVisible()

    // Select kit type
    await page.click('button:has-text("Selecione o tipo de kit")')
    await page.click('text=Kit Box Frontal Simples')

    // Should display kit contents
    await expect(page.locator('text=Conteúdo do Kit')).toBeVisible()
    await expect(page.locator('text=Trilho superior')).toBeVisible()
    await expect(page.locator('text=Roldanas')).toBeVisible()
    await expect(page.locator('text=R$ 150 - R$ 280')).toBeVisible() // Price range

    // Set quantity
    await page.fill('input[id="quantity"]', '1')

    // Select color
    await page.click('button:has-text("Selecione"):below(text=Acabamento/Cor)')
    await page.click('text=Cromado')

    // Continue to cart
    await page.click('button:has-text("Adicionar e Ir pro Carrinho")')

    // Step 4: Cart review
    await expect(page.locator('h2:has-text("Carrinho")')).toBeVisible()
    await expect(page.locator('text=Kit Box Frontal Simples')).toBeVisible()
    await expect(page.locator('text=Cromado')).toBeVisible()
  })

  test('should display different kit contents based on selection', async ({ page }) => {
    await page.goto('http://localhost:3000/orcamento')
    await page.fill('input[name="cep"]', '01310-100')
    await page.click('button:has-text("Continuar")')
    await page.click('button:has-text("Confirmar")')
    await page.click('button:has-text("Kits")')
    await page.click('button:has-text("Kit para Box")')
    await page.click('button:has-text("Continuar")')

    // Select first kit type
    await page.click('button:has-text("Selecione o tipo de kit")')
    await page.click('text=Kit Box Frontal Simples')
    await expect(page.locator('text=Roldanas (2 a 4)')).toBeVisible()

    // Change to different kit type
    await page.click('button:has-text("Kit Box Frontal Simples")')
    await page.click('text=Kit Box Pivotante')

    // Should show different contents
    await expect(page.locator('text=Pivô inferior')).toBeVisible()
    await expect(page.locator('text=Pivô superior')).toBeVisible()

    // Roldanas should not be visible anymore
    await expect(page.locator('text=Roldanas (2 a 4)')).not.toBeVisible()
  })

  test('should validate required fields for kits', async ({ page }) => {
    await page.goto('http://localhost:3000/orcamento')
    await page.fill('input[name="cep"]', '01310-100')
    await page.click('button:has-text("Continuar")')
    await page.click('button:has-text("Confirmar")')
    await page.click('button:has-text("Kits")')
    await page.click('button:has-text("Kit para Box")')
    await page.click('button:has-text("Continuar")')

    // Try to continue without selecting kit type
    await page.click('button:has-text("Adicionar e Ir pro Carrinho")')

    // Should show validation error
    await expect(page.locator('text=Selecione o tipo de kit')).toBeVisible()

    // Select kit type
    await page.click('button:has-text("Selecione o tipo de kit")')
    await page.click('text=Kit Box Frontal Simples')

    // Clear quantity to 0
    await page.fill('input[id="quantity"]', '0')
    await page.click('button:has-text("Adicionar e Ir pro Carrinho")')

    // Should show quantity validation error
    await expect(page.locator('text=A quantidade deve ser no mínimo 1')).toBeVisible()
  })
})

test.describe('Mixed Quote with Ferragens and Kits', () => {
  test('should allow mixing regular products with ferragens and kits', async ({ page }) => {
    await setupTestEnvironment(page)
    await page.goto('http://localhost:3000/orcamento')

    // Setup location
    await page.fill('input[name="cep"]', '01310-100')
    await page.click('button:has-text("Continuar")')
    await page.click('button:has-text("Confirmar")')

    // Add BOX product (regular form)
    await page.click('button:has-text("Box")')
    await page.click('button:has-text("Box Frontal")')
    await page.click('button:has-text("Continuar")')

    await page.fill('input[id="width"]', '1.20')
    await page.fill('input[id="height"]', '2.00')
    await page.fill('input[id="quantity"]', '1')
    await page.click('button:has-text("Adicionar e Ir pro Carrinho")')

    // Add ferragens
    await page.click('button:has-text("Adicionar Mais Produtos")')
    await page.click('button:has-text("Ferragens")')
    await page.click('button:has-text("Ferragens Avulsas")')
    await page.click('button:has-text("Continuar")')

    await page.click('button:has-text("Selecione o tipo")')
    await page.click('text=Dobradiça')
    await page.click('button:has-text("Selecione o código")')
    await page.click('text=1101 - Superior sem pino')
    await page.fill('input[id="quantity"]', '4')
    await page.click('button:has-text("Adicionar e Ir pro Carrinho")')

    // Add kit
    await page.click('button:has-text("Adicionar Mais Produtos")')
    await page.click('button:has-text("Kits")')
    await page.click('button:has-text("Kit para Box")')
    await page.click('button:has-text("Continuar")')

    await page.click('button:has-text("Selecione o tipo de kit")')
    await page.click('text=Kit Box Frontal Simples')
    await page.fill('input[id="quantity"]', '1')
    await page.click('button:has-text("Adicionar e Ir pro Carrinho")')

    // Verify all 3 items in cart
    await expect(page.locator('text=Box Frontal')).toBeVisible()
    await expect(page.locator('text=Dobradiça')).toBeVisible()
    await expect(page.locator('text=Kit Box Frontal Simples')).toBeVisible()

    // Should be able to continue to customer data
    await page.click('button:has-text("Continuar")')
    await expect(page.locator('h2:has-text("Dados")')).toBeVisible()
  })
})
