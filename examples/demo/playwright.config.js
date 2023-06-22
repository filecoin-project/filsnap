import { defineConfig } from '@playwright/test'

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './test',
  timeout: process.env.CI ? 60 * 1000 : 30 * 1000,
  expect: {
    timeout: 5000,
  },
  // fullyParallel: true,
  maxFailures: process.env.CI ? 2 : 0,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? [['html'], ['list']] : 'list',
  use: {
    actionTimeout: 0,
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    colorScheme: 'dark',
    browserName: 'chromium',
  },
  webServer: {
    command: 'pnpm run start',
    url: 'http://localhost:3000',
  },
})
