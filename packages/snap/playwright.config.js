import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './test',
  timeout: process.env.CI ? 60 * 1000 : 30 * 1000,
  fullyParallel: false,
  forbidOnly: Boolean(process.env.CI),
  maxFailures: process.env.CI ? 1 : 0,
  retries: process.env.CI ? 2 : 1,
  workers: process.env.CI ? 1 : 2,
  reporter: process.env.CI ? [['html'], ['list']] : 'list',
  use: {
    baseURL: 'http://example.org',
    trace: 'on-first-retry',
    colorScheme: 'dark',
    browserName: 'chromium',
  },
  webServer: {
    command: 'pnpm run build && pnpm exec sirv --port 8081',
    url: 'http://localhost:8081/dist/snap.js',
  },
})
