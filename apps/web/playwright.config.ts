import { defineConfig, devices } from "@playwright/test";
import { tmpdir } from "node:os";
import { join } from "node:path";

export default defineConfig({
  outputDir: join(tmpdir(), "bba-playwright-results"),
  testDir: "./e2e",
  webServer: { command: "pnpm run preview --host 127.0.0.1", port: 4173, reuseExistingServer: true },
  use: { baseURL: "http://127.0.0.1:4173" },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile", use: { ...devices["Pixel 7"] } }
  ]
});
