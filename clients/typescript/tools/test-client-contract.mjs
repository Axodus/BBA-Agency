import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const facade = await readFile(resolve(root, "src/index.ts"), "utf8");
const sdk = await readFile(resolve(root, "src/generated/sdk.gen.ts"), "utf8");
const callableOperations = [...sdk.matchAll(/^export const ([A-Za-z0-9_]+) =/gmu)].map((match) => match[1]);

assert.equal(callableOperations.length, 74);
assert.equal(new Set(callableOperations).size, 74);
for (const contract of ["baseUrl", "getAccessToken", "getTenantId", "getCorrelationId", "fetch"]) assert.match(facade, new RegExp(`\\b${contract}\\b`, "u"));
assert.match(facade, /createBbaClient/u);
assert.match(facade, /createClient\(/u);
assert.doesNotMatch(facade, /\.setConfig\(/u);

console.log("TypeScript client contract passed: 74 callable operations and per-instance configuration.");
