import { readdir, readFile } from "node:fs/promises";
import { resolve } from "node:path";

const mode = process.argv[2];
const root = resolve(import.meta.dirname, "..");
const extensions = new Set([".ts", ".mjs"]);

async function collect(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    if (entry.name === ".tmp" || entry.name === "node_modules") continue;
    const path = resolve(directory, entry.name);
    if (entry.isDirectory()) files.push(...await collect(path));
    else if (extensions.has(path.slice(path.lastIndexOf(".")).toLowerCase())) files.push(path);
  }
  return files;
}

const violations = [];
for (const file of await collect(root)) {
  const content = await readFile(file, "utf8");
  const lines = content.split("\n");
  lines.forEach((line, index) => {
    const isCoreSource = file.includes("/src/") || file.includes("/test/");
    if (mode === "--lint" && isCoreSource && /\bany\b|@ts-(?:ignore|nocheck|expect-error)|console\.(?:log|warn|error)\s*\(/u.test(line)) {
      violations.push(`${file}:${index + 1}: prohibited lint pattern`);
    }
    if (mode === "--format" && /[ \t]+$/u.test(line)) {
      violations.push(`${file}:${index + 1}: trailing whitespace`);
    }
  });
  if (!content.endsWith("\n")) violations.push(`${file}: missing final newline`);
}

if (violations.length > 0) {
  console.error(`${mode === "--lint" ? "Lint" : "Format"} check failed:`);
  for (const violation of violations) console.error(`- ${violation}`);
  process.exitCode = 1;
} else {
  console.log(`${mode === "--lint" ? "Lint" : "Format"} check passed.`);
}
