import { readFile, readdir } from "node:fs/promises";
import { resolve } from "node:path";

const root = resolve(process.cwd(), "src");
async function files(directory) { const entries = await readdir(directory, { withFileTypes: true }); const output = []; for (const entry of entries) { const path = resolve(directory, entry.name); if (entry.isDirectory()) output.push(...await files(path)); else if (/\.tsx?$/u.test(entry.name)) output.push(path); } return output; }
const violations = [];
for (const file of await files(root)) { const source = await readFile(file, "utf8"); if (/@bba\/(?:ui|app-shell)|@bba\/platform-core|@bba\/http-transport/u.test(source)) violations.push(file); }
if (violations.length) { for (const file of violations) process.stderr.write(`Forbidden sdk-react dependency: ${file}\n`); process.exitCode = 1; } else process.stdout.write("sdk-react boundary check passed.\n");
