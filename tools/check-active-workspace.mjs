#!/usr/bin/env node
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const workspaceRoot = process.cwd();

const archivedRootEntries = [
  "demo",
  "src",
  "static",
  "docker-compose.memory.yml",
  "package-lock.json",
  "BBA-Agency-Vercel.zip",
  "startup.log",
  "tests.log",
];

const activeRequiredEntries = [
  "apps/web",
  "apps/api",
  "core",
  "transport/http",
  "transport/agency-runtime",
  "contracts/openapi/v1/openapi.yaml",
  "contracts/agency/v1/openapi.yaml",
  "packages/publisher-prototype",
  "packages/sdk-react",
  "clients/typescript",
  "docker-compose.api.yml",
  "vercel.json",
];

const failures = [];

for (const entry of archivedRootEntries) {
  if (existsSync(join(workspaceRoot, entry))) {
    failures.push(`Archived legacy entry remains in active workspace: ${entry}`);
  }
}

for (const entry of activeRequiredEntries) {
  if (!existsSync(join(workspaceRoot, entry))) {
    failures.push(`Active workspace entry is missing: ${entry}`);
  }
}

const packageJson = JSON.parse(readFileSync(join(workspaceRoot, "package.json"), "utf8"));
const workspaceYaml = readFileSync(join(workspaceRoot, "pnpm-workspace.yaml"), "utf8");
const forbiddenScriptFragments = [
  "src/",
  "demo/",
  "static",
  "docker-compose.memory.yml",
  "ts-node --transpile-only",
];

for (const [name, command] of Object.entries(packageJson.scripts ?? {})) {
  for (const fragment of forbiddenScriptFragments) {
    if (command.includes(fragment)) {
      failures.push(`Root script ${name} still references archived surface: ${fragment}`);
    }
  }
}

if (/^\s*-\s*static\s*$/m.test(workspaceYaml)) {
  failures.push("pnpm-workspace.yaml still includes the archived static workspace.");
}

if (packageJson.dependencies && Object.keys(packageJson.dependencies).length > 0) {
  failures.push("Root package.json still declares runtime dependencies.");
}

if (failures.length > 0) {
  console.error("Active workspace boundary check failed:");
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log("Active workspace boundary check passed.");
