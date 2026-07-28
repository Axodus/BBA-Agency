import { readdir, readFile } from "node:fs/promises";
import { resolve, relative } from "node:path";

async function files(directory) {
  const result = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = resolve(directory, entry.name);
    if (entry.isDirectory()) result.push(...await files(path));
    else if (path.endsWith(".ts")) result.push(path);
  }
  return result;
}

const root = resolve(import.meta.dirname, "..");
const repositoryRoot = resolve(root, "../..");
const violations = [];
for (const file of await files(resolve(root, "src"))) {
  const source = await readFile(file, "utf8");
  for (const match of source.matchAll(/from\s+["']([^"']+)["']/gu)) {
    const specifier = match[1];
    if (specifier.startsWith("@bba/platform-core/") && specifier !== "@bba/platform-core/application") violations.push(`${relative(root, file)} imports ${specifier}`);
    if (specifier.includes("core/src") || /(?:domain|persistence|bindings|internal)/u.test(specifier) && specifier.startsWith("@bba/platform-core")) violations.push(`${relative(root, file)} bypasses the public Application API`);
  }
}
if (violations.length) throw new Error(violations.join("\n"));
const corePackage = JSON.parse(await readFile(resolve(repositoryRoot, "core/package.json"), "utf8"));
if (JSON.stringify(Object.keys(corePackage.exports ?? {})) !== JSON.stringify(["./application"])) throw new Error("Core package must expose only the public Application API subpath");
const forbiddenPackageFile = (corePackage.files ?? []).find((file) => /(?:bindings|services|infrastructure|modules|domain|persistence)/u.test(file));
if (forbiddenPackageFile) throw new Error(`Core package leaks internal artifact ${forbiddenPackageFile}`);
console.log("HTTP transport boundary check passed.");
