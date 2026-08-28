import { defineConfig, devices } from '@playwright/test';

const baseURL = process.env.PORTAL_BASE_URL || 'https://192.168.1.201';
const storageState = process.env.PORTAL_STORAGE_STATE || '.auth/portal.json';

export default defineConfig({
  testDir: './tests/quality',
  outputDir: './test-results',
  snapshotPathTemplate: '{testDir}/__screenshots__/{projectName}/{arg}{ext}',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  reporter: [['list'], ['html', { outputFolder: 'playwright-report', open: 'never' }]],
  use: {
    baseURL,
    storageState,
    ignoreHTTPSErrors: true,
    locale: 'vi-VN',
    timezoneId: 'Asia/Ho_Chi_Minh',
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure'
  },
  projects: [
    { name: 'desktop-dark', use: { ...devices['Desktop Chrome'], colorScheme: 'dark', viewport: { width: 1440, height: 1000 } } },
    { name: 'mobile-light', use: { ...devices['Pixel 7'], colorScheme: 'light', viewport: { width: 390, height: 844 } } }
  ]
});
