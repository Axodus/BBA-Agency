import { readdir, readFile } from "node:fs/promises";
import { dirname, relative, resolve } from "node:path";

const sourceExtensions = new Set([".cjs", ".cts", ".js", ".mjs", ".mts", ".ts"]);
const importPattern = /(?:from\s*|import\s*\(\s*|require\s*\(\s*|export\s+[^\n]*?from\s*)["']([^"']+)["']/gu;
const forbiddenAliases = /^(?:@(?:bba\/)?(?:demo|legacy|src))(?:\/|$)/u;

async function collectFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const path = resolve(directory, entry.name);
    if (entry.isDirectory()) {
      if (entry.name !== ".tmp" && entry.name !== "node_modules") {
        files.push(...await collectFiles(path));
      }
    } else if (sourceExtensions.has(path.slice(path.lastIndexOf(".")).toLowerCase())) {
      files.push(path);
    }
  }

  return files;
}

export async function findBoundaryViolations(coreRoot = resolve(import.meta.dirname, "..")) {
  const files = await collectFiles(coreRoot);
  const repositoryRoot = resolve(coreRoot, "..");
  const forbiddenRoots = [resolve(repositoryRoot, "demo"), resolve(repositoryRoot, "src")];
  const violations = [];

  for (const file of files) {
    const content = await readFile(file, "utf8");
    for (const match of content.matchAll(importPattern)) {
      const specifier = match[1];
      if (forbiddenAliases.test(specifier)) {
        violations.push(`${relative(coreRoot, file)} imports prohibited alias ${specifier}`);
        continue;
      }
      if (specifier.startsWith(".")) {
        const target = resolve(dirname(file), specifier);
        if (forbiddenRoots.some((forbiddenRoot) => target === forbiddenRoot || target.startsWith(`${forbiddenRoot}/`))) {
          violations.push(`${relative(coreRoot, file)} imports prohibited path ${specifier}`);
        }
      }
    }
  }

  return violations;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const violations = await findBoundaryViolations();
  if (violations.length > 0) {
    console.error("Core boundary violations detected:");
    for (const violation of violations) console.error(`- ${violation}`);
    process.exitCode = 1;
  } else {
    console.log("Core boundary check passed: no executable dependency on demo/ or src/.");
  }
}
