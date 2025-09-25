import { PlaywrightTestConfig } from '@playwright/test';
import dotenv from 'dotenv';
dotenv.config();

const config: PlaywrightTestConfig = {
  use: {
    headless: false,
    viewport: { width: 1280, height: 720 },
    ignoreHTTPSErrors: true,
    video: {
      mode: 'on',
      size: { width: 1280, height: 720 },
    },
    screenshot: 'on',
    trace: 'on',
    baseURL: process.env.GAME_URL || 'http://localhost:3456',
    actionTimeout: 36000,
    acceptDownloads: true,
  },

  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,

  testDir: 'src/tests',
  testMatch: 'src/tests/**/*.spec.ts',
  // testIgnore: /.*\.setup\.ts/,
  expect: {
    toHaveScreenshot: { maxDiffPixelRatio: 0.1 },
  },
  fullyParallel: true,
  reporter: 'html',
  timeout: 300000,
  projects: [
    { name: 'setup', testMatch: /.*\.setup\.ts/ },
    {
      name: 'chromium',
      use: {
        browserName: 'chromium',
        // Use prepared auth state.
        // storageState: './playwright/.auth/user.json',
      },
    },
  ],
  globalSetup: './globalSetup.ts',
};
export default config;
