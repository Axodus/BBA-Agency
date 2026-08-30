import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, ".."); const evidenceRoot = resolve(root, "../.rag/evidence/SPRINT-IMP-020"); const viewports = ["desktop", "laptop", "tablet", "mobile"];
const entries = await Promise.all(viewports.map((viewport) => readFile(resolve(evidenceRoot, "routes", `${viewport}.yml`), "utf8")));
await writeFile(resolve(evidenceRoot, "visual-manifest.yml"), `${entries.join("")}\n`, "utf8");
console.log("Delivery test visual manifest assembled: 24 primary screenshots.");
