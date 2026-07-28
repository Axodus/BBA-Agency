import { mkdtemp, readdir, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { resolve } from "node:path";
import { spawn } from "node:child_process";

async function tree(directory, prefix = "") {
  const result = new Map();
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const key = prefix ? `${prefix}/${entry.name}` : entry.name;
    if (entry.isDirectory()) for (const [name, value] of await tree(resolve(directory, entry.name), key)) result.set(name, value);
    else result.set(key, await readFile(resolve(directory, entry.name), "utf8"));
  }
  return result;
}

const temporary = await mkdtemp(resolve(tmpdir(), "bba-client-"));
try {
  await new Promise((fulfill, reject) => {
    const child = spawn("pnpm", ["run", "generate"], { cwd: resolve(import.meta.dirname, ".."), env: { ...process.env, BBA_CLIENT_OUTPUT: temporary }, stdio: "inherit" });
    child.on("exit", (code) => code === 0 ? fulfill() : reject(new Error(`Client generation failed with ${code}`)));
  });
  const expected = await tree(resolve(import.meta.dirname, "../src/generated"));
  const actual = await tree(temporary);
  if (JSON.stringify([...expected]) !== JSON.stringify([...actual])) throw new Error("Generated TypeScript client is not synchronized with the canonical OpenAPI contract");
  const sdk = [...expected.values()].join("\n");
  const inventory = JSON.parse(await readFile(resolve(import.meta.dirname, "../../../contracts/openapi/v1/operation-inventory.json"), "utf8"));
  const missing = inventory.filter((entry) => !sdk.includes(entry.operationId));
  if (missing.length) throw new Error(`Generated SDK is missing ${missing.length} callable operations`);
  console.log(`Generated client check passed: ${inventory.length} callable operations.`);
} finally {
  await rm(temporary, { recursive: true, force: true });
}
