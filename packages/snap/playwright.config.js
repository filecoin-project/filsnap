import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './test/e2e',
  timeout: process.env.CI ? 60 * 1000 : 30 * 1000,
  expect: {
    timeout: 5000,
  },
  fullyParallel: false,
  forbidOnly: Boolean(process.env.CI),
  maxFailures: process.env.CI ? 2 : 0,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? [['html'], ['list']] : 'list',
  use: {
    actionTimeout: 0,
    baseURL: 'http://example.org',
    trace: 'on-first-retry',
    colorScheme: 'dark',
    browserName: 'chromium',
  },
  webServer: {
    command: 'pnpm run serve',
    url: 'http://localhost:8081',
  },
})
