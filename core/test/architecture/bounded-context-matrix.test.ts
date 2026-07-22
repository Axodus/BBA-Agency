import assert from "node:assert/strict";
import test from "node:test";
import { readFile, readdir } from "node:fs/promises";
import { relative, resolve } from "node:path";

const modulesRoot = resolve(import.meta.dirname, "../../src/modules");
const contexts = new Set(["mission", "governance", "ai-workforce", "institutional-assets", "workforce", "assets", "knowledge", "workflow", "publication", "connector"]);
const importPattern = /(?:from\s*|import\s*\(\s*)["']([^"']+)["']/gu;

async function files(directory: string): Promise<string[]> {
  const entries = await readdir(directory, { withFileTypes: true });
  const result: string[] = [];
  for (const entry of entries) {
    const path = resolve(directory, entry.name);
    if (entry.isDirectory()) result.push(...await files(path));
    else if (path.endsWith(".ts")) result.push(path);
  }
  return result;
}

test("bounded contexts do not import each other laterally", async () => {
  const violations: string[] = [];
  for (const file of await files(modulesRoot)) {
    const relativeFile = relative(modulesRoot, file);
    const owner = relativeFile.split("/")[0] ?? "";
    if (!contexts.has(owner)) continue;
    const content = await readFile(file, "utf8");
    for (const match of content.matchAll(importPattern)) {
      const specifier = match[1] ?? "";
      if (!specifier.startsWith(".")) continue;
      const target = resolve(file, "..", specifier);
      const targetMatch = target.match(/\/modules\/([^/]+)/u);
      const targetContext = targetMatch?.[1];
      if (targetContext !== undefined && contexts.has(targetContext) && targetContext !== owner) violations.push(`${relativeFile} -> ${specifier}`);
    }
  }
  assert.deepEqual(violations, []);
});

test("bounded context matrix preserves the Application coordination exception", async () => {
  const coordinator = await readFile(resolve(import.meta.dirname, "../../../../src/application/coordination/GovernedMissionCommandCoordinator.ts"), "utf8");
  assert.match(coordinator, /GovernanceAuthorizationPort/u);
  assert.doesNotMatch(coordinator, /Decision|Approval|Assignment|Authority/u);
});

test("Governance domain and application do not depend on infrastructure or future contexts", async () => {
  const governanceRoot = resolve(modulesRoot, "governance");
  const violations: string[] = [];
  const forbidden = /(?:infrastructure|mission|workforce|assets?|knowledge|workflow|publication|connector|frontend)/u;
  for (const file of await files(governanceRoot)) {
    const relativeFile = relative(governanceRoot, file);
    if (!relativeFile.startsWith("domain/") && !relativeFile.startsWith("application/")) continue;
    const content = await readFile(file, "utf8");
    for (const match of content.matchAll(importPattern)) {
      const specifier = match[1] ?? "";
      if (forbidden.test(specifier)) violations.push(`${relativeFile} -> ${specifier}`);
    }
  }
  assert.deepEqual(violations, []);
});

test("AI Workforce domain and application remain reference-only and infrastructure-free", async () => {
  const workforceRoot = resolve(modulesRoot, "ai-workforce");
  const violations: string[] = [];
  const forbidden = /(?:\/modules\/(?:mission|governance|assets?|knowledge|workflow|publication|connector)|infrastructure|frontend)/u;
  for (const file of await files(workforceRoot)) {
    const relativeFile = relative(workforceRoot, file);
    if (!relativeFile.startsWith("domain/") && !relativeFile.startsWith("application/")) continue;
    const content = await readFile(file, "utf8");
    for (const match of content.matchAll(importPattern)) {
      const specifier = match[1] ?? "";
      if (forbidden.test(specifier)) violations.push(`${relativeFile} -> ${specifier}`);
    }
  }
  assert.deepEqual(violations, []);
});

test("AI Workforce keeps Mission coordination in neutral references and ports", async () => {
  const workforceRoot = resolve(modulesRoot, "ai-workforce");
  const violations: string[] = [];
  for (const file of await files(workforceRoot)) {
    const relativeFile = relative(workforceRoot, file);
    if (!relativeFile.startsWith("domain/") && !relativeFile.startsWith("application/")) continue;
    const content = await readFile(file, "utf8");
    if (content.includes("modules/mission") || content.includes("modules/governance")) violations.push(relativeFile);
  }
  assert.deepEqual(violations, []);
});

test("Institutional Assets domain and application remain reference-only and infrastructure-free", async () => {
  const assetsRoot = resolve(modulesRoot, "institutional-assets");
  const violations: string[] = [];
  const forbidden = /(?:\/modules\/(?:mission|governance|ai-workforce|workflow|publication|connector)|infrastructure|frontend)/u;
  for (const file of await files(assetsRoot)) {
    const relativeFile = relative(assetsRoot, file);
    if (!relativeFile.startsWith("domain/") && !relativeFile.startsWith("application/")) continue;
    const content = await readFile(file, "utf8");
    for (const match of content.matchAll(importPattern)) {
      const specifier = match[1] ?? "";
      if (forbidden.test(specifier)) violations.push(`${relativeFile} -> ${specifier}`);
    }
  }
  assert.deepEqual(violations, []);
});

test("shared references depend only on Shared Kernel primitives", async () => {
  const referencesRoot = resolve(import.meta.dirname, "../../../../src/shared/references");
  const violations: string[] = [];
  for (const file of await files(referencesRoot)) {
    const content = await readFile(file, "utf8");
    for (const match of content.matchAll(importPattern)) {
      const specifier = match[1] ?? "";
      if (specifier.includes("/modules/")) violations.push(`${relative(referencesRoot, file)} -> ${specifier}`);
    }
  }
  assert.deepEqual(violations, []);
});
