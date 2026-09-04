import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

const path = resolve(import.meta.dirname, "v1/openapi.yaml");
const contract = JSON.parse(await readFile(path, "utf8"));
const expected = [
  "agencyListServices", "agencyListProjects", "agencyCreateProject", "agencyGetProject",
  "agencyExecuteProject", "agencyRecordDecision", "agencyGetEditorialPackage",
  "agencyGetAiSettings", "agencyConfigureAi", "agencyDeleteAiSettings"
].sort();
const operations = Object.values(contract.paths ?? {}).flatMap((item) => Object.values(item ?? {})).filter((candidate) => candidate && typeof candidate === "object" && typeof candidate.operationId === "string").map((candidate) => candidate.operationId).sort();
if (contract.openapi !== "3.1.0") throw new Error("Agency OpenAPI contract must use 3.1.0");
if (JSON.stringify(operations) !== JSON.stringify(expected)) throw new Error("Agency OpenAPI operation inventory does not match the runtime surface");
console.log(`Agency OpenAPI contract check passed: ${operations.length} operations.`);
