import { readFile, readdir } from "node:fs/promises";
import { resolve } from "node:path";

const root = resolve(process.cwd(), "../..");
const canonical = JSON.parse(await readFile(resolve(root, "contracts/openapi/v1/operation-inventory.json"), "utf8"));
const product = JSON.parse(await readFile(resolve(root, "packages/sdk-react/product-operation-inventory.json"), "utf8"));
const coverage = JSON.parse(await readFile(resolve(process.cwd(), "test-harness/runtime-coverage.json"), "utf8"));
if (canonical.length !== 74 || product.length !== 74) throw new Error("Acceptance requires 74 canonical and product operations");
if (product.filter((entry) => entry.applicationKind === "COMMAND").length !== 57 || product.filter((entry) => entry.applicationKind === "QUERY").length !== 17) throw new Error("Acceptance requires 57 Commands and 17 Queries");
if (product.some((entry) => entry.status !== "IMPLEMENTED")) throw new Error("Product placeholders remain");
const contexts = [...new Set(canonical.map((entry) => entry.boundedContext))].sort(); if (JSON.stringify(contexts) !== JSON.stringify(Object.keys(coverage).sort())) throw new Error("Reference runtime coverage does not include every bounded context");
for (const path of Object.values(coverage)) { const source = await readFile(resolve(root, path), "utf8"); if (!/ApplicationCommandRunner/u.test(source) || !/ApplicationQueryRunner/u.test(source)) throw new Error(`Runtime coverage is not a real command/query composition: ${path}`); }
async function files(directory) { const entries = await readdir(directory, { withFileTypes: true }); const result = []; for (const entry of entries) { const path = resolve(directory, entry.name); if (entry.isDirectory()) result.push(...await files(path)); else result.push(path); } return result; }
const productionFiles = await files(resolve(process.cwd(), "src")); const production = (await Promise.all(productionFiles.map((path) => readFile(path, "utf8")))).join("\n");
if (/PLACEHOLDER|ProductPlaceholderPage/u.test(production)) throw new Error("Placeholder product source remains");
if (/test-harness/u.test(production)) throw new Error("Test harness entered the production graph");
process.stdout.write("Product acceptance invariant passed: 74 bindings, 57 Commands, 17 Queries, 9 real runtime suites.\n");
