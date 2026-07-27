import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  timeout: 30000,
  expect: { timeout: 10000 },
  retries: 1,
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL || "http://localhost:3100",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },
  webServer: process.env.PLAYWRIGHT_SKIP_WEB_SERVER
    ? undefined
    : {
        command: "npm.cmd run start -- --port 3100",
        url: "http://localhost:3100",
        reuseExistingServer: true,
        timeout: 120000,
      },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});
