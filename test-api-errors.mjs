/**
 * FQ.7.5: API Error Scenarios Test
 *
 * Tests various error scenarios for the /api/quotes endpoint
 */

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
const API_URL = `${BASE_URL}/api/quotes`

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
}

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`)
}

function logTest(name) {
  log(`\n🧪 Test: ${name}`, 'blue')
}

function logSuccess(message) {
  log(`  ✅ ${message}`, 'green')
}

function logError(message) {
  log(`  ❌ ${message}`, 'red')
}

function logInfo(message) {
  log(`  ℹ️  ${message}`, 'yellow')
}

// Test scenarios
const tests = {
  // FQ.7.1: Validation errors
  async testEmptyPayload() {
    logTest('Empty Payload')
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      })

      if (response.status === 400) {
        const data = await response.json()
        logSuccess('Returns 400 for empty payload')
        logInfo(`Error message: ${data.error}`)
        return true
      }

      logError(`Expected 400, got ${response.status}`)
      return false
    } catch (error) {
      logError(`Request failed: ${error.message}`)
      return false
    }
  },

  async testInvalidEmail() {
    logTest('Invalid Email')
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: 'Test User',
          customerEmail: 'invalid-email',
          customerPhone: '1234567890',
          serviceStreet: 'Test Street',
          serviceNumber: '123',
          serviceNeighborhood: 'Test',
          serviceCity: 'Test City',
          serviceState: 'SP',
          serviceZipCode: '12345678',
          items: [{
            description: 'Test Item',
            quantity: 1,
            unitPrice: 100,
            totalPrice: 100,
          }],
        }),
      })

      if (response.status === 400) {
        const data = await response.json()
        logSuccess('Returns 400 for invalid email')
        logInfo(`Validation error caught`)
        return true
      }

      logError(`Expected 400, got ${response.status}`)
      return false
    } catch (error) {
      logError(`Request failed: ${error.message}`)
      return false
    }
  },

  async testNoItems() {
    logTest('Quote with No Items')
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: 'Test User',
          customerEmail: 'test@example.com',
          customerPhone: '1234567890',
          serviceStreet: 'Test Street',
          serviceNumber: '123',
          serviceNeighborhood: 'Test',
          serviceCity: 'Test City',
          serviceState: 'SP',
          serviceZipCode: '12345678',
          items: [],
        }),
      })

      if (response.status === 400) {
        const data = await response.json()
        logSuccess('Returns 400 for empty items array')
        return true
      }

      logError(`Expected 400, got ${response.status}`)
      return false
    } catch (error) {
      logError(`Request failed: ${error.message}`)
      return false
    }
  },

  async testTooManyItems() {
    logTest('Quote with Too Many Items (>50)')
    try {
      const items = Array.from({ length: 51 }, (_, i) => ({
        description: `Item ${i + 1}`,
        quantity: 1,
        unitPrice: 100,
        totalPrice: 100,
      }))

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: 'Test User',
          customerEmail: 'test@example.com',
          customerPhone: '1234567890',
          serviceStreet: 'Test Street',
          serviceNumber: '123',
          serviceNeighborhood: 'Test',
          serviceCity: 'Test City',
          serviceState: 'SP',
          serviceZipCode: '12345678',
          items,
        }),
      })

      if (response.status === 400) {
        const data = await response.json()
        logSuccess('Returns 400 for >50 items')
        return true
      }

      logError(`Expected 400, got ${response.status}`)
      return false
    } catch (error) {
      logError(`Request failed: ${error.message}`)
      return false
    }
  },

  async testInvalidDimensions() {
    logTest('Invalid Dimensions (negative/too large)')
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: 'Test User',
          customerEmail: 'test@example.com',
          customerPhone: '1234567890',
          serviceStreet: 'Test Street',
          serviceNumber: '123',
          serviceNeighborhood: 'Test',
          serviceCity: 'Test City',
          serviceState: 'SP',
          serviceZipCode: '12345678',
          items: [{
            description: 'Test Item',
            width: 150, // Too large (max 100m)
            height: -5, // Negative
            quantity: 1,
            unitPrice: 100,
            totalPrice: 100,
          }],
        }),
      })

      if (response.status === 400) {
        const data = await response.json()
        logSuccess('Returns 400 for invalid dimensions')
        return true
      }

      logError(`Expected 400, got ${response.status}`)
      return false
    } catch (error) {
      logError(`Request failed: ${error.message}`)
      return false
    }
  },

  // FQ.7.2: Rate limiting
  async testRateLimiting() {
    logTest('Rate Limiting (6 requests in quick succession)')
    try {
      const validPayload = {
        customerName: 'Test User',
        customerEmail: 'test@example.com',
        customerPhone: '1234567890',
        serviceStreet: 'Test Street',
        serviceNumber: '123',
        serviceNeighborhood: 'Test',
        serviceCity: 'Test City',
        serviceState: 'SP',
        serviceZipCode: '12345678',
        items: [{
          description: 'Test Item',
          quantity: 1,
          unitPrice: 100,
          totalPrice: 100,
        }],
      }

      const requests = []
      for (let i = 0; i < 6; i++) {
        requests.push(
          fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(validPayload),
          })
        )
      }

      const responses = await Promise.all(requests)
      const statuses = responses.map(r => r.status)
      const hasRateLimit = statuses.includes(429)

      if (hasRateLimit) {
        logSuccess('Rate limiting activated after multiple requests')
        logInfo(`Status codes: ${statuses.join(', ')}`)
        return true
      }

      logError('Rate limiting not triggered')
      logInfo(`Status codes: ${statuses.join(', ')}`)
      return false
    } catch (error) {
      logError(`Request failed: ${error.message}`)
      return false
    }
  },

  // Error handling
  async testMalformedJSON() {
    logTest('Malformed JSON')
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: '{ invalid json }',
      })

      if (response.status >= 400) {
        logSuccess('Handles malformed JSON gracefully')
        return true
      }

      logError(`Expected error status, got ${response.status}`)
      return false
    } catch (error) {
      // Network errors are acceptable for malformed JSON
      logSuccess('Handles malformed JSON (network error)')
      return true
    }
  },

  async testLongStrings() {
    logTest('Extremely Long Strings')
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: 'A'.repeat(500), // Exceeds 100 char limit
          customerEmail: 'test@example.com',
          customerPhone: '1234567890',
          serviceStreet: 'Test Street',
          serviceNumber: '123',
          serviceNeighborhood: 'Test',
          serviceCity: 'Test City',
          serviceState: 'SP',
          serviceZipCode: '12345678',
          items: [{
            description: 'B'.repeat(1000), // Exceeds 500 char limit
            quantity: 1,
            unitPrice: 100,
            totalPrice: 100,
          }],
        }),
      })

      if (response.status === 400) {
        const data = await response.json()
        logSuccess('Returns 400 for strings exceeding max length')
        return true
      }

      logError(`Expected 400, got ${response.status}`)
      return false
    } catch (error) {
      logError(`Request failed: ${error.message}`)
      return false
    }
  },
}

// Run all tests
async function runTests() {
  log('\n╔════════════════════════════════════════════════╗', 'magenta')
  log('║    API Error Scenarios Test Suite (FQ.7.5)    ║', 'magenta')
  log('╚════════════════════════════════════════════════╝', 'magenta')
  log(`\nTesting API: ${API_URL}\n`)

  const results = []

  for (const [name, test] of Object.entries(tests)) {
    try {
      const result = await test()
      results.push({ name, passed: result })

      // Small delay between tests to avoid overwhelming the server
      await new Promise(resolve => setTimeout(resolve, 500))
    } catch (error) {
      log(`\n⚠️  Test ${name} threw an error:`, 'red')
      log(`   ${error.message}`, 'red')
      results.push({ name, passed: false })
    }
  }

  // Summary
  log('\n╔════════════════════════════════════════════════╗', 'magenta')
  log('║                 Test Summary                   ║', 'magenta')
  log('╚════════════════════════════════════════════════╝', 'magenta')

  const passed = results.filter(r => r.passed).length
  const failed = results.filter(r => !r.passed).length
  const total = results.length

  log(`\n  Total Tests: ${total}`)
  log(`  ✅ Passed: ${passed}`, 'green')
  if (failed > 0) {
    log(`  ❌ Failed: ${failed}`, 'red')
  }
  log(`  Success Rate: ${Math.round((passed / total) * 100)}%\n`)

  if (failed > 0) {
    log('Failed tests:', 'red')
    results.filter(r => !r.passed).forEach(r => {
      log(`  - ${r.name}`, 'red')
    })
    log('')
  }

  process.exit(failed > 0 ? 1 : 0)
}

// Check if server is running
async function checkServer() {
  try {
    log('Checking if development server is running...', 'yellow')
    const response = await fetch(BASE_URL, { method: 'HEAD' })
    if (response.ok || response.status < 500) {
      log('✅ Server is running\n', 'green')
      return true
    }
  } catch (error) {
    log('❌ Server is not running!', 'red')
    log('Please start the development server with: npm run dev\n', 'yellow')
    process.exit(1)
  }
}

// Main execution
;(async () => {
  await checkServer()
  await runTests()
})()
