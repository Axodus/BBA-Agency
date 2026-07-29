import { readdir, readFile, stat } from "node:fs/promises";
import { resolve } from "node:path";

const mode = process.argv[2];
const targets = process.argv.slice(3);
if (!["--lint", "--format"].includes(mode) || targets.length === 0) throw new Error("Usage: workspace-quality-check.mjs --lint|--format <path...>");
const extensions = new Set([".ts", ".mjs"]);

async function collect(path) {
  const info = await stat(path);
  if (!info.isDirectory()) return [path];
  const result = [];
  for (const entry of await readdir(path, { withFileTypes: true })) {
    if ([".tmp", "dist", "generated", "node_modules"].includes(entry.name)) continue;
    result.push(...await collect(resolve(path, entry.name)));
  }
  return result;
}

const violations = [];
for (const target of targets) {
  for (const file of await collect(resolve(process.cwd(), target))) {
    if (!extensions.has(file.slice(file.lastIndexOf(".")).toLowerCase())) continue;
    const content = await readFile(file, "utf8");
    content.split("\n").forEach((line, index) => {
      if (mode === "--lint" && /\bany\b|@ts-(?:ignore|nocheck|expect-error)|console\.(?:log|warn|error)\s*\(/u.test(line)) violations.push(`${file}:${index + 1}: prohibited lint pattern`);
      if (mode === "--format" && /[ \t]+$/u.test(line)) violations.push(`${file}:${index + 1}: trailing whitespace`);
    });
    if (!content.endsWith("\n")) violations.push(`${file}: missing final newline`);
  }
}

if (violations.length) {
  for (const violation of violations) console.error(violation);
  process.exitCode = 1;
} else {
  console.log(`${mode === "--lint" ? "Lint" : "Format"} check passed.`);
}
