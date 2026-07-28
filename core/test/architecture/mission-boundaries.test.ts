import assert from "node:assert/strict";
import test from "node:test";
import { readFile, readdir } from "node:fs/promises";
import { resolve, relative } from "node:path";

const missionRoot = resolve(import.meta.dirname, "../../../../src/modules/mission");
const forbiddenContexts = /\/(?:governance|workforce|assets?|knowledge|publication|connector)(?:\/|$)/u;
const importPattern = /(?:from\s*|import\s*\(\s*)["']([^"']+)["']/gu;

async function sourceFiles(directory: string): Promise<string[]> {
  const entries = await readdir(directory, { withFileTypes: true });
  const files: string[] = [];
  for (const entry of entries) {
    const path = resolve(directory, entry.name);
    if (entry.isDirectory()) files.push(...await sourceFiles(path));
    else if (path.endsWith(".ts")) files.push(path);
  }
  return files;
}

test("Mission Domain has no dependency on infrastructure or future bounded contexts", async () => {
  const violations: string[] = [];
  for (const file of await sourceFiles(resolve(missionRoot, "domain"))) {
    const content = await readFile(file, "utf8");
    for (const match of content.matchAll(importPattern)) {
      const specifier = match[1] ?? "";
      if (specifier.includes("/infrastructure/") || forbiddenContexts.test(specifier)) {
        violations.push(`${relative(missionRoot, file)} -> ${specifier}`);
      }
    }
  }
  assert.deepEqual(violations, []);
});

test("Mission Application depends on ports, never on the in-memory adapter", async () => {
  const violations: string[] = [];
  for (const file of await sourceFiles(resolve(missionRoot, "application"))) {
    const content = await readFile(file, "utf8");
    for (const match of content.matchAll(importPattern)) {
      const specifier = match[1] ?? "";
      if (specifier.includes("/infrastructure/") || forbiddenContexts.test(specifier)) {
        violations.push(`${relative(missionRoot, file)} -> ${specifier}`);
      }
    }
  }
  assert.deepEqual(violations, []);
});

test("Mission root public barrel does not export its infrastructure adapter", async () => {
  const barrel = await readFile(resolve(missionRoot, "index.ts"), "utf8");
  assert.doesNotMatch(barrel, /infrastructure/u);
});
