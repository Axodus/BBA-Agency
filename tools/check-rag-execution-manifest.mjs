#!/usr/bin/env node
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const manifestPath = join(root, ".rag", "execution-manifest.json");
const failures = [];

if (!existsSync(manifestPath)) {
  console.error("RAG execution manifest is missing.");
  process.exit(1);
}

let manifest;
try {
  manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
} catch (error) {
  console.error(`RAG execution manifest is not valid JSON: ${error.message}`);
  process.exit(1);
}

if (manifest.$schemaVersion !== 1 || !Array.isArray(manifest.epics) || !Array.isArray(manifest.allowedStatuses)) {
  failures.push("Manifest must declare schema version 1, allowed statuses, and an epics array.");
}

const ids = new Set();
for (const epic of manifest.epics ?? []) {
  if (!/^EPIC-IMP-\d{3,}[A-Z]?$/u.test(epic.id ?? "")) failures.push(`Invalid Epic id: ${epic.id ?? "<missing>"}`);
  if (ids.has(epic.id)) failures.push(`Duplicate Epic id: ${epic.id}`);
  ids.add(epic.id);
  if (!manifest.allowedStatuses.includes(epic.status)) failures.push(`${epic.id}: unsupported status ${epic.status}`);
  if (typeof epic.scope !== "string" || epic.scope.length === 0) failures.push(`${epic.id}: scope is required`);
  for (const field of ["authority", "records", "implementation", "validation"]) {
    if (!Array.isArray(epic[field]) || epic[field].length === 0) failures.push(`${epic.id}: ${field} requires at least one entry`);
  }
  for (const field of ["authority", "records", "implementation"]) {
    for (const entry of epic[field] ?? []) {
      if (!existsSync(join(root, entry))) failures.push(`${epic.id}: missing ${field} target ${entry}`);
    }
  }
}

for (const epic of manifest.epics ?? []) {
  for (const dependency of epic.dependsOn ?? []) if (!ids.has(dependency)) failures.push(`${epic.id}: missing dependency ${dependency}`);
}

if (failures.length > 0) {
  console.error("RAG execution manifest check failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`RAG execution manifest check passed: ${manifest.epics.length} epics.`);
