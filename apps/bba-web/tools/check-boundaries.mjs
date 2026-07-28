import { readFile, readdir } from "node:fs/promises";
import { resolve } from "node:path";

async function files(directory) { const entries = await readdir(directory, { withFileTypes: true }); const output = []; for (const entry of entries) { const path = resolve(directory, entry.name); if (entry.isDirectory()) output.push(...await files(path)); else if (/\.tsx?$/u.test(entry.name)) output.push(path); } return output; }
const roots = [{ path: resolve(process.cwd(), "src"), forbidden: /@bba\/(?:api-client|platform-core|http-transport)|\bfetch\s*\(/u }];
const violations = [];
for (const root of roots) for (const file of await files(root.path)) { const source = await readFile(file, "utf8"); if (root.forbidden.test(source)) violations.push(file); }
if (violations.length) { for (const file of violations) process.stderr.write(`Forbidden browser dependency: ${file}\n`); process.exitCode = 1; } else process.stdout.write("Browser boundary check passed.\n");
