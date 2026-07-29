import { defineConfig } from "vitest/config";

export default defineConfig({ test: { environment: "jsdom", setupFiles: ["./test/setup.ts"], pool: "vmThreads", maxWorkers: 1, fileParallelism: false } });
