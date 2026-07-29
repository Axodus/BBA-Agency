import { readFile, readdir } from "node:fs/promises";
import { resolve } from "node:path";

const canonical = JSON.parse(await readFile(resolve(process.cwd(), "../../contracts/openapi/v1/operation-inventory.json"), "utf8"));
const product = JSON.parse(await readFile(resolve(process.cwd(), "product-operation-inventory.json"), "utf8"));
const canonicalIds = canonical.map((entry) => entry.operationId).sort();
const productIds = product.map((entry) => entry.operationId).sort();
if (JSON.stringify(canonicalIds) !== JSON.stringify(productIds)) throw new Error("Product inventory diverged from canonical operation inventory");
if (product.length !== 74 || new Set(productIds).size !== 74) throw new Error("Product inventory must contain 74 unique bindings");
if (product.some((entry) => !entry.route || !entry.reactBinding || entry.operationId.includes("assignAsset") || entry.operationId.includes("executeTransport"))) throw new Error("Product inventory contains an invalid binding");
if (product.some((entry) => entry.status !== "IMPLEMENTED")) throw new Error("Product inventory still contains placeholders or blocked bindings");
async function sourceTree(directory) { const entries = await readdir(directory, { withFileTypes: true }); const sources = []; for (const entry of entries) { const path = resolve(directory, entry.name); if (entry.isDirectory()) sources.push(...await sourceTree(path)); else if (/\.tsx?$/u.test(entry.name)) sources.push(await readFile(path, "utf8")); } return sources; }
const sdkSource = (await sourceTree(resolve(process.cwd(), "src"))).join("\n");
const appSource = (await sourceTree(resolve(process.cwd(), "../../apps/bba-web/src"))).join("\n");
for (const entry of product) {
  if (!sdkSource.includes(entry.reactBinding)) throw new Error(`Public React binding missing for ${entry.operationId}: ${entry.reactBinding}`);
  if (!appSource.includes(entry.operationId) && !appSource.includes(entry.reactBinding)) throw new Error(`Product binding missing for ${entry.operationId}`);
  const routeRoot = entry.route.split("/:")[0]; if (!appSource.includes(routeRoot.replace(/^\//u, ""))) throw new Error(`Product route missing for ${entry.operationId}: ${entry.route}`);
  if (entry.applicationKind === "COMMAND" && entry.operationId !== "missionCreateMission" && entry.action !== entry.operationId) throw new Error(`Command action identity diverged for ${entry.operationId}`);
}
const invalidationSource = await readFile(resolve(process.cwd(), "src/commands/invalidation-policy.ts"), "utf8");
for (const entry of product.filter((candidate) => candidate.applicationKind === "COMMAND")) if (!invalidationSource.includes(`${entry.operationId}:`)) throw new Error(`Invalidation policy missing for ${entry.operationId}`);
process.stdout.write("Product inventory check passed: 74 canonical product bindings.\n");
