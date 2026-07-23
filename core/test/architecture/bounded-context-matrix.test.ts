import assert from "node:assert/strict";
import test from "node:test";
import { readFile, readdir } from "node:fs/promises";
import { relative, resolve } from "node:path";

const modulesRoot = resolve(import.meta.dirname, "../../src/modules");
const contexts = new Set(["mission", "governance", "ai-workforce", "institutional-assets", "knowledge-policy", "workforce", "assets", "knowledge", "workflow", "review", "publication", "connector"]);
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

test("Knowledge Policy domain and application remain reference-only and infrastructure-free", async () => {
  const knowledgePolicyRoot = resolve(modulesRoot, "knowledge-policy");
  const violations: string[] = [];
  const forbidden = /(?:\/modules\/(?:mission|governance|ai-workforce|institutional-assets|workflow|review|publication|connector)|infrastructure|frontend)/u;
  for (const file of await files(knowledgePolicyRoot)) {
    const relativeFile = relative(knowledgePolicyRoot, file);
    if (!relativeFile.startsWith("domain/") && !relativeFile.startsWith("application/")) continue;
    const content = await readFile(file, "utf8");
    for (const match of content.matchAll(importPattern)) {
      const specifier = match[1] ?? "";
      if (forbidden.test(specifier)) violations.push(`${relativeFile} -> ${specifier}`);
    }
  }
  assert.deepEqual(violations, []);
});

test("Workflow domain and application remain coordination-only and infrastructure-free", async () => {
  const workflowRoot = resolve(modulesRoot, "workflow");
  const violations: string[] = [];
  const forbidden = /(?:\/modules\/(?:mission|governance|ai-workforce|institutional-assets|knowledge-policy|review|publication|connector)|infrastructure|frontend)/u;
  for (const file of await files(workflowRoot)) {
    const relativeFile = relative(workflowRoot, file);
    if (!relativeFile.startsWith("domain/") && !relativeFile.startsWith("application/")) continue;
    const content = await readFile(file, "utf8");
    for (const match of content.matchAll(importPattern)) {
      const specifier = match[1] ?? "";
      if (forbidden.test(specifier)) violations.push(`${relativeFile} -> ${specifier}`);
    }
  }
  assert.deepEqual(violations, []);
});

test("Review domain and application remain assessment-only and infrastructure-free", async () => {
  const reviewRoot = resolve(modulesRoot, "review");
  const violations: string[] = [];
  const forbidden = /(?:\/modules\/(?:mission|governance|ai-workforce|institutional-assets|knowledge-policy|workflow|publication|connector)|infrastructure|frontend)/u;
  for (const file of await files(reviewRoot)) {
    const relativeFile = relative(reviewRoot, file);
    if (!relativeFile.startsWith("domain/") && !relativeFile.startsWith("application/")) continue;
    const content = await readFile(file, "utf8");
    for (const match of content.matchAll(importPattern)) {
      const specifier = match[1] ?? "";
      if (forbidden.test(specifier)) violations.push(`${relativeFile} -> ${specifier}`);
    }
  }
  assert.deepEqual(violations, []);
});

test("Publication domain and application remain publication-only and infrastructure-free", async () => {
  const publicationRoot = resolve(modulesRoot, "publication");
  const violations: string[] = [];
  const forbidden = /(?:\/modules\/(?:mission|governance|ai-workforce|institutional-assets|knowledge-policy|workflow|review|connector)|infrastructure|frontend)/u;
  for (const file of await files(publicationRoot)) {
    const relativeFile = relative(publicationRoot, file);
    if (!relativeFile.startsWith("domain/") && !relativeFile.startsWith("application/")) continue;
    const content = await readFile(file, "utf8");
    for (const match of content.matchAll(importPattern)) {
      const specifier = match[1] ?? "";
      if (forbidden.test(specifier)) violations.push(`${relativeFile} -> ${specifier}`);
    }
  }
  assert.deepEqual(violations, []);
});

test("Connector domain and application remain technical and institution-free", async () => {
  const connectorRoot = resolve(modulesRoot, "connector");
  const violations: string[] = [];
  const forbidden = /(?:\/modules\/(?:mission|governance|ai-workforce|institutional-assets|knowledge-policy|workflow|review|publication)|infrastructure|frontend|http|sdk|oauth|secret|token)/u;
  for (const file of await files(connectorRoot)) {
    const relativeFile = relative(connectorRoot, file);
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
