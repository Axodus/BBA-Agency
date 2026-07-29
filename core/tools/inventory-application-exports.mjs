import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(new URL("..", import.meta.url).pathname, "src/modules");
const contexts = [
  ["mission", "application/index.ts"],
  ["governance", "application/index.ts"],
  ["ai-workforce", "application/index.ts"],
  ["institutional-assets", "application/index.ts"],
  ["knowledge-policy", "application/index.ts"],
  ["workflow", "application/index.ts"],
  ["review", "application/index.ts"],
  ["publication", "application/index.ts"],
  ["connector", "application/index.ts"]
];

const exclusions = new Set(["executeTransport"]);
const plannedBlocked = [{ boundedContext: "institutional-assets", exportName: "assignAsset", category: "PLANNED_PUBLIC_OPERATION", status: "BLOCKED" }];
const operationPattern = /(?:export\s+\{\s*([^}]+)\s*\}|export\s+\*\s+from\s+["']\.\/([^"']+)["'])/g;

function namesFromFile(file) {
  const source = readFileSync(file, "utf8");
  const names = [];
  for (const match of source.matchAll(operationPattern)) {
    if (match[1]) {
      for (const item of match[1].split(",")) names.push(item.trim().split(/\s+as\s+/u)[0]);
    } else if (match[2]) {
      const sibling = resolve(file, "..", `${match[2].replace(/\.js$/u, "")}.ts`);
      const siblingSource = readFileSync(sibling, "utf8");
      for (const declaration of siblingSource.matchAll(/export\s+(?:async\s+)?(?:function|class|interface|type)\s+([A-Za-z_$][\w$]*)/g)) names.push(declaration[1]);
    }
  }
  return [...new Set(names)].sort();
}

const discovered = [];
for (const [boundedContext, relative] of contexts) {
  const file = resolve(root, boundedContext, relative);
  for (const name of namesFromFile(file)) {
    const category = exclusions.has(name) ? "EXPLICIT_EXCLUSION" : /Error$/u.test(name) ? "ERROR" : /Input$/u.test(name) ? "TYPE_OR_INPUT" : /Service|Coordinator|Port$/u.test(name) ? "COLLABORATOR" : /^(Create|Activate|Archive|Approve|Assign|Cancel|Complete|Curate|Finalize|Reject|Rename|Produce|Prepare|Publish|Authorize|Record|Start|Suspend|Resume|Retire|Open|Close|Plan|Link|Supersede|Advance|Pause|Fail|Provision|Register|Execute)/u.test(name) || /^[a-z]/u.test(name) ? "INVOCABLE_APPLICATION_EXPORT" : "TYPE_OR_INPUT";
    discovered.push({ boundedContext, exportName: name, category });
  }
}

const apiPorts = readFileSync(resolve(root, "../application/ports/ApplicationApiPorts.ts"), "utf8");
const commandMethods = [];
const queryMethods = [];
for (const match of apiPorts.matchAll(/export interface (\w+CommandApiPort)\s*\{([^}]*)\}/g)) {
  for (const method of match[2].matchAll(/(\w+)\(/g)) commandMethods.push({ port: match[1], method: method[1] });
}
for (const match of apiPorts.matchAll(/export interface (\w+QueryApiPort)\s*\{([^}]*)\}/g)) {
  for (const method of match[2].matchAll(/(\w+)\(/g)) queryMethods.push({ port: match[1], method: method[1] });
}
const exposedCommandNames = new Set(commandMethods.map((item) => item.method));
const entries = discovered.map((entry) => ({
  ...entry,
  status:
    entry.category === "INVOCABLE_APPLICATION_EXPORT"
      ? exposedCommandNames.has(`${entry.exportName.charAt(0).toLowerCase()}${entry.exportName.slice(1)}`)
        ? "PUBLICLY_EXPOSED"
        : "AVAILABLE_NOT_EXPOSED"
      : entry.category === "EXPLICIT_EXCLUSION"
        ? "TECHNICAL_EXCLUSION"
        : "INFORMATIONAL"
}));
entries.push(...plannedBlocked);
const commandEntries = entries.filter((entry) => entry.category === "INVOCABLE_APPLICATION_EXPORT" || entry.category === "EXPLICIT_EXCLUSION");
const output = {
  schema: "application-capability-inventory-v3",
  status: "INFORMATIONAL_BACKLOG_INPUT",
  gate: "ApplicationApiPorts.ts",
  note: "Available module capabilities do not become public M12 operations automatically.",
  generatedFrom: contexts.map(([context, file]) => `${context}/${file}`),
  availableCapabilities: {
    raw: commandEntries.length,
    technicalExclusions: commandEntries.filter((entry) => entry.category === "EXPLICIT_EXCLUSION").length,
    invocable: commandEntries.filter((entry) => entry.category === "INVOCABLE_APPLICATION_EXPORT").length
  },
  publicSurface: {
    commands: commandMethods,
    queries: queryMethods,
    total: commandMethods.length + queryMethods.length
  },
  entries
};
const destination = process.argv[2];
if (destination) writeFileSync(destination, `${JSON.stringify(output, null, 2)}\n`);
else process.stdout.write(`${JSON.stringify(output, null, 2)}\n`);
