import { tmpdir } from "node:os";
import { join } from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  cacheDir: join(tmpdir(), "bba-vitest-ui"),
  test: {
    environment: "jsdom",
    setupFiles: ["./test/setup.ts"],
    pool: "vmThreads",
    maxWorkers: 1,
    fileParallelism: false
  }
});
