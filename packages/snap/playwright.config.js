import { defineConfig } from '@playwright/test'

export default defineConfig({
  name: 'snap',
  testDir: './test',
  timeout: process.env.CI ? 60 * 1000 : 30 * 1000,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : undefined,
  workers: process.env.CI ? 1 : undefined,
  maxFailures: process.env.CI ? 0 : 1,
  reporter: process.env.CI ? [['html'], ['list']] : 'list',
  use: {
    baseURL: 'http://localhost:8081',
    trace: 'on-first-retry',
    colorScheme: 'dark',
    browserName: 'chromium',
    viewport: { width: 1280, height: 1280 },
  },
  webServer: [
    {
      command: 'pnpm run serve-static',
      url: 'http://localhost:8081',
      reuseExistingServer: !process.env.CI,
    },
    {
      command: 'pnpm run build && pnpm exec mm-snap serve',
      url: 'http://localhost:8080/dist/snap.js',
      reuseExistingServer: !process.env.CI,
    },
  ],
})
