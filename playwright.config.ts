import { defineConfig, devices } from "@playwright/test";
import * as dotenv from "dotenv";
import * as os from "node:os";

dotenv.config({ quiet: true });

export default defineConfig({
  testDir: "./src/tests",
  outputDir: "test-results",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : 4,

  reporter: [
    [
      "html",
      {
        host: "127.0.0.1",
        open: "always",
      },
    ],
    ["line"],
    [
      "allure-playwright",
      {
        os_platform: os.platform(),
        os_release: os.release(),
        os_version: os.version(),
        node_version: process.version,
      },
    ],
  ],

  use: {
    baseURL: "https://rahulshettyacademy.com/",
    ignoreHTTPSErrors: true,
    trace: "on-first-retry",
    actionTimeout: 30000,
    navigationTimeout: 30000,
    screenshot: {
      mode: "on",
    },
    video: "retain-on-failure",
  },

  projects: [
    {
      name: "chromium",
      timeout: 200000,
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "firefox",
      timeout: 600000,
      use: { ...devices["Desktop Firefox"] },
    },
    { name: "webkit", timeout: 900000, use: { ...devices["Desktop Safari"] } },
  ],
});
