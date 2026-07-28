import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "../..");
const contractPath = resolve(root, "contracts/openapi/v1/openapi.yaml");
const inventoryPath = resolve(root, "contracts/openapi/v1/operation-inventory.json");
const applicationPortsPath = resolve(root, "core/src/application/ports/ApplicationApiPorts.ts");
const contract = JSON.parse(await readFile(contractPath, "utf8"));
const versionedOperations = [];

for (const [path, pathItem] of Object.entries(contract.paths ?? {})) {
  for (const [method, operation] of Object.entries(pathItem)) {
    if (!operation || typeof operation !== "object" || typeof operation.operationId !== "string") continue;
    const entry = {
      operationId: operation.operationId,
      method: method.toUpperCase(),
      path,
      boundedContext: operation["x-bba-bounded-context"],
      applicationMethod: operation["x-bba-application-method"],
      applicationKind: operation["x-bba-application-kind"]
    };
    if (!entry.boundedContext || !entry.applicationMethod || !["command", "query"].includes(entry.applicationKind)) {
      throw new Error(`Operation ${entry.operationId} has incomplete BBA traceability metadata`);
    }
    if (!operation.responses || Object.values(operation.responses).some((response) => !response?.content?.["application/json"]?.schema)) {
      throw new Error(`Operation ${entry.operationId} has an open or missing response schema`);
    }
    versionedOperations.push(entry);
  }
}

versionedOperations.sort((left, right) => left.operationId.localeCompare(right.operationId));
const operationIds = new Set(versionedOperations.map((entry) => entry.operationId));
if (versionedOperations.length !== 74 || operationIds.size !== 74) throw new Error(`Expected 74 unique OpenAPI operations, found ${versionedOperations.length}/${operationIds.size}`);
if (operationIds.has("institutionalAssetsAssignAsset") || versionedOperations.some((entry) => entry.applicationMethod === "assignAsset")) throw new Error("assignAsset must remain outside the executable transport surface");

const inventory = JSON.parse(await readFile(inventoryPath, "utf8"));
inventory.sort((left, right) => left.operationId.localeCompare(right.operationId));
if (JSON.stringify(inventory) !== JSON.stringify(versionedOperations)) throw new Error("operation-inventory.json is not the deterministic projection of openapi.yaml");

const portSource = await readFile(applicationPortsPath, "utf8");
const portInterfaces = {
  MissionCommandApiPort: ["mission", "command"], MissionQueryApiPort: ["mission", "query"],
  GovernanceCommandApiPort: ["governance", "command"], GovernanceQueryApiPort: ["governance", "query"],
  AIWorkforceCommandApiPort: ["ai-workforce", "command"], AIWorkforceQueryApiPort: ["ai-workforce", "query"],
  InstitutionalAssetsCommandApiPort: ["institutional-assets", "command"], InstitutionalAssetsQueryApiPort: ["institutional-assets", "query"],
  KnowledgePolicyCommandApiPort: ["knowledge-policy", "command"], KnowledgePolicyQueryApiPort: ["knowledge-policy", "query"],
  WorkflowCommandApiPort: ["workflow", "command"], WorkflowQueryApiPort: ["workflow", "query"],
  ReviewCommandApiPort: ["review", "command"], ReviewQueryApiPort: ["review", "query"],
  PublicationCommandApiPort: ["publication", "command"], PublicationQueryApiPort: ["publication", "query"],
  ConnectorCommandApiPort: ["connector", "command"], ConnectorQueryApiPort: ["connector", "query"]
};
const publicMethods = [];
for (const [interfaceName, [boundedContext, applicationKind]] of Object.entries(portInterfaces)) {
  const match = new RegExp(`export interface ${interfaceName}\\s*\\{([\\s\\S]*?)\\}`, "u").exec(portSource);
  if (!match) throw new Error(`Missing public Application API interface ${interfaceName}`);
  for (const method of match[1].matchAll(/\b([A-Za-z][A-Za-z0-9]*)\s*\(/gu)) publicMethods.push(`${boundedContext}.${method[1]}.${applicationKind}`);
}
const transportMethods = versionedOperations.map((entry) => `${entry.boundedContext}.${entry.applicationMethod}.${entry.applicationKind}`);
publicMethods.sort(); transportMethods.sort();
if (JSON.stringify(publicMethods) !== JSON.stringify(transportMethods)) throw new Error("OpenAPI operations do not match the executable public Application API methods");

console.log(`OpenAPI contract check passed: ${versionedOperations.length} executable operations (${publicMethods.filter((entry) => entry.endsWith(".command")).length} commands, ${publicMethods.filter((entry) => entry.endsWith(".query")).length} queries).`);
