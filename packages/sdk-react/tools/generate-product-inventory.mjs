import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const repositoryRoot = resolve(process.cwd(), "../..");
const canonicalPath = resolve(repositoryRoot, "contracts/openapi/v1/operation-inventory.json");
const outputPath = resolve(process.cwd(), "product-operation-inventory.json");
const operations = JSON.parse(await readFile(canonicalPath, "utf8"));

const slices = {
  mission: "015.2", governance: "015.3", "ai-workforce": "015.4", "institutional-assets": "015.5",
  "knowledge-policy": "015.5", workflow: "015.6", review: "015.6", publication: "015.6", connector: "015.7"
};

const confirmations = new Map(Object.entries({
  missionCompleteMission: "TERMINAL",
  governanceAssignAuthority: "AUTHORITY", governanceApproveDecision: "AUTHORITY", governanceRejectDecision: "AUTHORITY", governanceFinalizeDecision: "AUTHORITY",
  aiWorkforceCompleteExecution: "TERMINAL", institutionalAssetsRetireAsset: "IRREVERSIBLE",
  workflowArchiveWorkflow: "IRREVERSIBLE", workflowAdvanceStage: "TERMINAL", workflowRecordTaskState: "TERMINAL", workflowRecordTaskFailure: "TERMINAL", workflowCompleteWorkflow: "TERMINAL", workflowCancelWorkflow: "TERMINAL", workflowFailWorkflowExecution: "TERMINAL",
  reviewCloseSession: "TERMINAL", reviewCancelSession: "TERMINAL", reviewCompleteReview: "TERMINAL", reviewArchiveReview: "IRREVERSIBLE",
  publicationAuthorizePublication: "AUTHORITY", publicationRecordPublicationOutcome: "EXTERNAL_EFFECT", publicationArchivePublication: "IRREVERSIBLE",
  connectorRetireConnector: "IRREVERSIBLE", connectorCompleteExecution: "TERMINAL", connectorFailExecution: "TERMINAL", connectorCancelExecution: "TERMINAL"
}));

const createOperations = new Set([
  "missionCreateMission", "governanceCreateAuthority", "governanceCreateDecision", "aiWorkforceProvisionAgent",
  "institutionalAssetsCreateAsset", "institutionalAssetsRegisterAsset", "knowledgePolicyCreateKnowledge", "knowledgePolicyCreatePolicy",
  "workflowCreateWorkflow", "reviewCreateReview", "publicationCreatePublication", "connectorRegisterConnector", "connectorCreateExecution"
]);
const implementedContexts = new Set(["mission", "governance", "ai-workforce", "institutional-assets", "knowledge-policy", "workflow", "review", "publication", "connector"]);

function route(operationId) {
  if (operationId === "missionCreateMission") return "/missions/new";
  if (operationId.startsWith("mission")) return "/missions/:missionId";
  const workspaces = [["governance", "/governance"], ["aiWorkforce", "/ai-workforce"], ["institutionalAssets", "/institutional-assets"], ["knowledgePolicy", "/knowledge"], ["workflow", "/workflows"], ["review", "/reviews"], ["publication", "/publications"], ["connector", "/connectors"]];
  const workspace = workspaces.find(([prefix]) => operationId.startsWith(prefix))?.[1];
  if (workspace === undefined) throw new Error(`Product route missing for ${operationId}`);
  return workspace;
}

function reactBinding(operation) {
  return `use${operation.operationId[0].toUpperCase()}${operation.operationId.slice(1)}${operation.applicationKind === "command" ? "Command" : "Query"}`;
}

const inventory = operations.map((operation) => {
  const isQuery = operation.applicationKind === "query";
  const interaction = isQuery ? (operation.applicationMethod.startsWith("list") ? "LIST_QUERY" : "DETAIL_QUERY") : (createOperations.has(operation.operationId) ? "CREATE_FORM" : "ACTION_PANEL");
  const confirmationKind = confirmations.get(operation.operationId);
  const operationRoute = interaction === "LIST_QUERY" ? route(operation.operationId).replace(/\/:[^/]+$/u, "") : route(operation.operationId);
  return {
    operationId: operation.operationId,
    applicationKind: isQuery ? "QUERY" : "COMMAND",
    boundedContext: operation.boundedContext,
    sdkMethod: operation.operationId,
    reactBinding: reactBinding(operation),
    route: operationRoute,
    ...(!isQuery && operation.operationId !== "missionCreateMission" ? { action: operation.operationId } : {}),
    interaction,
    status: implementedContexts.has(operation.boundedContext) ? "IMPLEMENTED" : "PLACEHOLDER",
    implementedInSlice: slices[operation.boundedContext],
    requiresConfirmation: confirmationKind !== undefined,
    ...(confirmationKind === undefined ? {} : { confirmationKind })
  };
});

if (inventory.length !== 74 || new Set(inventory.map((entry) => entry.operationId)).size !== 74) throw new Error("Product inventory must contain 74 unique operations");
if (inventory.some((entry) => entry.operationId === "assignAsset" || entry.operationId === "executeTransport")) throw new Error("Non-executable operation entered product inventory");
await writeFile(outputPath, `${JSON.stringify(inventory, null, 2)}\n`);
