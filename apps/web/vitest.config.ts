import react from "@vitejs/plugin-react";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({ cacheDir: join(tmpdir(), "bba-vitest-web"), plugins: [react()], test: { environment: "jsdom", setupFiles: ["./test/setup.ts"], exclude: ["e2e/**", "node_modules/**", "dist/**"], pool: "vmThreads", maxWorkers: 1, fileParallelism: false } });
