import react from "@vitejs/plugin-react";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { defineConfig } from "vite";

export default defineConfig({ cacheDir: join(tmpdir(), "bba-vite-web"), plugins: [react()], build: { outDir: process.env.BBA_WEB_OUT_DIR ?? "dist", sourcemap: true }, server: { port: 4174 }, preview: { port: 4173 } });
