import { readFile, readdir } from "node:fs/promises";
import { resolve } from "node:path";

async function files(directory) { const entries = await readdir(directory, { withFileTypes: true }); const output = []; for (const entry of entries) { const path = resolve(directory, entry.name); if (entry.isDirectory()) output.push(...await files(path)); else if (/\.tsx?$/u.test(entry.name)) output.push(path); } return output; }
const rules = [
  { root: "packages/ui/src", pattern: /@bba\/(?:app-shell|sdk-react|api-client|platform-core|http-transport)/u },
  { root: "packages/app-shell/src", pattern: /@bba\/(?:sdk-react|api-client|platform-core|http-transport)/u },
  { root: "packages/sdk-react/src", pattern: /@bba\/(?:ui|app-shell|platform-core|http-transport)/u },
  { root: "apps/web/src", pattern: /@bba\/(?:api-client|platform-core|http-transport)|\bfetch\s*\(/u }
];
const violations = [];
for (const rule of rules) for (const file of await files(resolve(process.cwd(), rule.root))) if (rule.pattern.test(await readFile(file, "utf8"))) violations.push(file);
const publicSdkFacade = await readFile(resolve(process.cwd(), "packages/sdk-react/src/index.ts"), "utf8");
if (/@bba\/api-client|\bMissionGetMission(?:Response|Data|Error|Errors)\b|\bClient\b/u.test(publicSdkFacade)) violations.push("packages/sdk-react/src/index.ts: generated SDK type leak");
if (violations.length) { for (const violation of violations) process.stderr.write(`Frontend boundary violation: ${violation}\n`); process.exitCode = 1; } else process.stdout.write("Frontend package graph check passed.\n");
