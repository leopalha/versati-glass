import { defineConfig, devices } from '@playwright/test'
import { config } from 'dotenv'
import path from 'path'

// Load test environment variables
config({ path: '.env.test' })

// Storage state paths
const STORAGE_STATE_DIR = path.join(__dirname, '.playwright', '.auth')
export const CUSTOMER_AUTH = path.join(STORAGE_STATE_DIR, 'customer.json')
export const ADMIN_AUTH = path.join(STORAGE_STATE_DIR, 'admin.json')

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './e2e',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 1,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: process.env.BASE_URL || 'http://localhost:3100',
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    /* Increased timeouts for slower development server */
    actionTimeout: 60000, // 60 seconds for actions (clicks, fills, etc)
    navigationTimeout: 90000, // 90 seconds for page navigations
  },

  /* Global test timeout */
  timeout: 120000, // 2 minutes per test

  /* Expect timeout for assertions */
  expect: {
    timeout: 30000, // 30 seconds for expect assertions
  },

  /* Configure projects for major browsers */
  projects: [
    // Setup project - runs auth setup before other tests
    {
      name: 'setup',
      testMatch: /auth\.setup\.ts/,
      use: { ...devices['Desktop Chrome'] },
    },

    // Chromium tests - public pages (no auth needed)
    {
      name: 'chromium-public',
      testMatch: /01-homepage\.spec\.ts|02-quote-flow\.spec\.ts/,
      use: { ...devices['Desktop Chrome'] },
    },

    // Chromium tests - auth flow (tests login/register)
    {
      name: 'chromium-auth',
      testMatch: /03-auth-flow\.spec\.ts/,
      use: { ...devices['Desktop Chrome'] },
    },

    // Chromium tests - customer portal (requires customer auth)
    {
      name: 'chromium-portal',
      testMatch: /04-portal-flow\.spec\.ts/,
      use: {
        ...devices['Desktop Chrome'],
        storageState: CUSTOMER_AUTH,
      },
      dependencies: ['setup'],
    },

    // Chromium tests - admin dashboard (requires admin auth)
    {
      name: 'chromium-admin',
      testMatch: /05-admin-flow\.spec\.ts/,
      use: {
        ...devices['Desktop Chrome'],
        storageState: ADMIN_AUTH,
      },
      dependencies: ['setup'],
    },

    // Firefox tests for cross-browser verification
    {
      name: 'firefox',
      testMatch: /01-homepage\.spec\.ts/,
      use: { ...devices['Desktop Firefox'] },
    },

    // Mobile Chrome tests
    {
      name: 'Mobile Chrome',
      testMatch: /01-homepage\.spec\.ts/,
      use: { ...devices['Pixel 5'] },
    },
  ],

  /* Run your local dev server before starting the tests */
  webServer: {
    command: 'pnpm dev -p 3100',
    url: 'http://localhost:3100',
    reuseExistingServer: !process.env.CI,
    timeout: 180000, // 3 minutes to start server
    stdout: 'ignore',
    stderr: 'pipe',
    env: {
      // CRITICAL: Use same DATABASE_URL as .env.test (port 5432, not 54320)
      DATABASE_URL:
        process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/versatiglass',
      NEXTAUTH_URL: 'http://localhost:3100',
      NEXTAUTH_SECRET:
        process.env.NEXTAUTH_SECRET ||
        process.env.AUTH_SECRET ||
        'test-secret-key-change-in-production',
      AUTH_SECRET:
        process.env.AUTH_SECRET ||
        process.env.NEXTAUTH_SECRET ||
        'test-secret-key-change-in-production',
      GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || '',
      GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET || '',
      NODE_ENV: (process.env.NODE_ENV as 'development' | 'production' | 'test') || 'test',
    },
  },
})
