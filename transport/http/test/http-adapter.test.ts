import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";
import { resolve } from "node:path";
import { ApplicationError } from "@bba/platform-core/application";
import { buildHttpAdapter, TransportAuthenticationError, type TransportApplicationPorts, type TransportAuthorizationRequest } from "../src/index.js";

type InventoryEntry = { readonly operationId: string; readonly method: string; readonly path: string; readonly boundedContext: keyof TransportApplicationPorts; readonly applicationMethod: string; readonly applicationKind: "command" | "query" };
type ContractOperation = Record<string, unknown> & { readonly operationId: string; readonly responses: Record<string, unknown> };
type Call = { readonly context: string; readonly method: string; readonly request: Record<string, unknown>; readonly applicationContext: Record<string, unknown> };

const repositoryRoot = resolve(process.cwd(), "../..");
const contractPath = resolve(repositoryRoot, "contracts/openapi/v1/openapi.yaml");
const inventory = JSON.parse(await readFile(resolve(repositoryRoot, "contracts/openapi/v1/operation-inventory.json"), "utf8")) as InventoryEntry[];
const contract = JSON.parse(await readFile(contractPath, "utf8")) as { readonly paths: Record<string, Record<string, ContractOperation>>; readonly components: { readonly schemas: Record<string, Record<string, unknown>> } };

function descriptor(entry: InventoryEntry): ContractOperation { return contract.paths[entry.path]?.[entry.method.toLowerCase()] as ContractOperation; }
function responseName(entry: InventoryEntry): string { return descriptor(entry)["x-bba-response-schema"] as string; }
function idFrom(request: Record<string, unknown>): string { return typeof request.targetId === "string" ? request.targetId : Object.values((request.payload ?? {}) as Record<string, unknown>).find((value) => typeof value === "string") as string ?? "resource-main"; }

function queryDto(name: string, request: Record<string, unknown>, tenantId: string): Record<string, unknown> {
  const id = idFrom(request);
  const simple = (field: string): Record<string, unknown> => ({ [field]: id, tenantId, status: "ACTIVE", version: 1, secret: "must-not-leak" });
  if (name === "MissionDto") return { aggregateType: "Mission", id, tenantId, version: 1, status: "ACTIVE", data: {}, secret: "must-not-leak" };
  if (name === "AuthorityDto") return { authorityId: id, tenantId, actorReference: "actor-main", level: "STEWARD", scope: {}, status: "ACTIVE", version: 1, assignments: [], secret: "must-not-leak" };
  if (name === "DecisionDto") return { decisionId: id, tenantId, missionId: "mission-main", decisionType: "APPROVAL", status: "PROPOSED", version: 1, authorityReference: { id: "authority-main", tenantId }, secret: "must-not-leak" };
  if (name === "AgentDto") return { agentId: id, tenantId, name: "Agent", purpose: "Purpose", definitionVersion: "1", lifecycleStatus: "ACTIVE", status: "ACTIVE", availability: "AVAILABLE", capabilities: [], assignments: [], version: 1, secret: "must-not-leak" };
  if (name === "ExecutionDto") return { executionId: id, tenantId, missionReference: { id: "mission-main", tenantId }, agentReference: { id: "agent-main", tenantId }, workAssignmentReference: { id: "assignment-main", tenantId }, status: "RUNNING", result: null, failure: null, version: 1, secret: "must-not-leak" };
  if (name === "AssetDto") return { assetId: id, tenantId, missionReference: { id: "mission-main", tenantId }, status: "DRAFT", currentVersionId: "version-main", versionCount: 1, version: 1, secret: "must-not-leak" };
  if (name === "AssetSummaryDto") return { assetId: id, tenantId, status: "DRAFT", currentVersionId: "version-main", version: 1, secret: "must-not-leak" };
  if (name === "KnowledgeDto") return { knowledgeId: id, tenantId, status: "DRAFT", title: "Title", summary: "Summary", domainArea: "Institutional", audience: "Internal", currentRevision: 1, version: 1, secret: "must-not-leak" };
  if (name === "PolicyDto") return { policyId: id, tenantId, status: "DRAFT", title: "Title", summary: "Summary", scope: "Institutional", currentVersionId: "version-main", version: 1, secret: "must-not-leak" };
  if (name === "WorkflowDto") return simple("workflowId");
  if (name === "WorkflowExecutionDto" || name === "ConnectorExecutionDto") return simple("executionId");
  if (name === "ReviewDto") return simple("reviewId");
  if (name === "PublicationDto") return simple("publicationId");
  if (name === "ConnectorDto") return simple("connectorId");
  throw new Error(`No response fixture for ${name}`);
}

function createApplication(calls: Call[], fault?: { readonly context: string; readonly method: string; readonly error?: unknown; readonly nullResult?: boolean }): TransportApplicationPorts {
  const contexts = [...new Set(inventory.map((entry) => entry.boundedContext))];
  return Object.fromEntries(contexts.map((context) => [context, new Proxy({}, {
    get: (_target, property) => async (request: Record<string, unknown>, applicationContext: Record<string, unknown>) => {
      const method = String(property);
      calls.push({ context, method, request, applicationContext });
      if (fault?.context === context && fault.method === method) {
        if (fault.error !== undefined) throw fault.error;
        if (fault.nullResult === true) return null;
      }
      const entry = inventory.find((candidate) => candidate.boundedContext === context && candidate.applicationMethod === method);
      if (!entry) throw new Error(`Unexpected port invocation ${context}.${method}`);
      if (entry.applicationKind === "command") return { transactionId: "transaction-main", status: "COMMITTED", resourceReferences: [{ resourceType: responseName(entry).replace(/Dto$/u, ""), resourceId: idFrom(request) }], secret: "must-not-leak" };
      const value = queryDto(responseName(entry), request, applicationContext.tenantId as string);
      return ["listAssets", "listKnowledge", "listPolicies"].includes(method) ? [value] : value;
    }
  })])) as unknown as TransportApplicationPorts;
}

function dependencies(calls: Call[], authorizations: TransportAuthorizationRequest[] = [], fault?: Parameters<typeof createApplication>[1], authorized = true) {
  return {
    application: createApplication(calls, fault),
    authentication: { authenticate: async ({ bearerToken }: { readonly bearerToken: string }) => { if (bearerToken === "rejected") throw new TransportAuthenticationError(); return { subject: "subject-main", actorReference: "actor-main" }; } },
    authorization: { authorize: async (request: TransportAuthorizationRequest) => { authorizations.push(request); return authorized; } }
  };
}

function url(entry: InventoryEntry): string { return entry.path.replace(/\{[^}]+\}/gu, "resource-main"); }
function requiredData(entry: InventoryEntry): Record<string, unknown> {
  const operation = descriptor(entry);
  const requestRef = ((operation.requestBody as { content: Record<string, { schema: { $ref: string } }> }).content["application/json"]!.schema.$ref).split("/").at(-1) as string;
  const envelope = contract.components.schemas[requestRef] as { properties: { data: { $ref: string } } };
  const dataName = envelope.properties.data.$ref.split("/").at(-1) as string;
  const data = contract.components.schemas[dataName] as { required?: string[] };
  return Object.fromEntries((data.required ?? []).map((field) => [field, `${field}-main`]));
}

test("all 74 OpenAPI operations bind to exactly one Application API method and serialize closed responses", async () => {
  const calls: Call[] = [];
  const authorizations: TransportAuthorizationRequest[] = [];
  const app = await buildHttpAdapter(dependencies(calls, authorizations), { contractPath, exposeReadiness: true });
  try {
    for (const entry of inventory) {
      const response = await app.inject({
        method: entry.method as "GET" | "POST",
        url: url(entry),
        headers: { authorization: "Bearer accepted", "x-tenant-id": "tenant-main", "x-correlation-id": "correlation-main", "x-actor-id": "actor-main", "idempotency-key": "idempotency-main" },
        ...(entry.applicationKind === "command" ? { payload: { data: requiredData(entry), meta: { reason: "contract test" } } } : {})
      });
      const expected = descriptor(entry).responses["201"] === undefined ? 200 : 201;
      assert.equal(response.statusCode, expected, `${entry.operationId}: ${response.body}`);
      assert.equal(response.headers["x-correlation-id"], "correlation-main");
      const payload = response.json() as { data: Record<string, unknown>; meta: Record<string, unknown> };
      assert.equal(payload.data.secret, undefined, entry.operationId);
      assert.equal(payload.meta.correlationId, "correlation-main");
      const call = calls.at(-1) as Call;
      assert.equal(call.context, entry.boundedContext);
      assert.equal(call.method, entry.applicationMethod);
      assert.equal(call.applicationContext.tenantId, "tenant-main");
      assert.deepEqual(call.applicationContext.actor, { reference: "actor-main" });
      assert.equal(authorizations.at(-1)?.operationId, entry.operationId);
    }
    assert.equal(calls.length, 74);
    assert.equal(authorizations.length, 74);
  } finally { await app.close(); }
});

test("security, idempotency, not-found and public error mappings are stable", async () => {
  const calls: Call[] = [];
  const app = await buildHttpAdapter(dependencies(calls), { contractPath });
  try {
    const missingAuth = await app.inject({ method: "GET", url: "/api/v1/missions/resource-main", headers: { "x-tenant-id": "tenant-main" } });
    assert.equal(missingAuth.statusCode, 401);
    assert.equal(missingAuth.json().error.code, "UNAUTHENTICATED");
    const invalidKey = await app.inject({ method: "POST", url: "/api/v1/missions", headers: { authorization: "Bearer accepted", "x-tenant-id": "tenant-main", "idempotency-key": "bad" }, payload: { data: { missionId: "mission-main" }, meta: { reason: "test" } } });
    assert.equal(invalidKey.statusCode, 400);
    assert.equal(invalidKey.json().error.code, "INVALID_REQUEST");
  } finally { await app.close(); }

  const notFound = await buildHttpAdapter(dependencies([], [], { context: "mission", method: "getMission", nullResult: true }), { contractPath });
  try { const response = await notFound.inject({ method: "GET", url: "/api/v1/missions/resource-main", headers: { authorization: "Bearer accepted", "x-tenant-id": "tenant-main" } }); assert.equal(response.statusCode, 404); assert.equal(response.json().error.code, "NOT_FOUND"); } finally { await notFound.close(); }

  const conflict = await buildHttpAdapter(dependencies([], [], { context: "mission", method: "createMission", error: new ApplicationError("IDEMPOTENCY_CONFLICT", "conflict") }), { contractPath });
  try { const response = await conflict.inject({ method: "POST", url: "/api/v1/missions", headers: { authorization: "Bearer accepted", "x-tenant-id": "tenant-main", "idempotency-key": "idempotency-main" }, payload: { data: { missionId: "mission-main" }, meta: { reason: "test" } } }); assert.equal(response.statusCode, 409); assert.equal(response.json().error.code, "IDEMPOTENCY_CONFLICT"); } finally { await conflict.close(); }

  const failure = await buildHttpAdapter(dependencies([], [], { context: "mission", method: "getMission", error: new ApplicationError("APPLICATION_FAILURE", "provider secret", { provider: "secret" }) }), { contractPath });
  try { const response = await failure.inject({ method: "GET", url: "/api/v1/missions/resource-main", headers: { authorization: "Bearer accepted", "x-tenant-id": "tenant-main" } }); assert.equal(response.statusCode, 500); assert.equal(response.json().error.code, "APPLICATION_FAILURE"); assert.doesNotMatch(response.body, /provider secret|provider/u); } finally { await failure.close(); }
});

test("tenant authorization, actor assertion and request identities are enforced", async () => {
  const deniedCalls: Call[] = [];
  const denied = await buildHttpAdapter(dependencies(deniedCalls, [], undefined, false), { contractPath });
  try {
    const response = await denied.inject({ method: "GET", url: "/api/v1/missions/resource-main", headers: { authorization: "Bearer accepted", "x-tenant-id": "tenant-main" } });
    assert.equal(response.statusCode, 403);
    assert.equal(response.json().error.code, "FORBIDDEN");
    assert.equal(deniedCalls.length, 0);
  } finally { await denied.close(); }

  const calls: Call[] = [];
  const authorizations: TransportAuthorizationRequest[] = [];
  const app = await buildHttpAdapter(dependencies(calls, authorizations), { contractPath });
  try {
    const mismatch = await app.inject({ method: "GET", url: "/api/v1/missions/resource-main", headers: { authorization: "Bearer accepted", "x-tenant-id": "tenant-main", "x-actor-id": "actor-other" } });
    assert.equal(mismatch.statusCode, 403);
    const response = await app.inject({ method: "POST", url: "/api/v1/missions/resource-main:activate", headers: { authorization: "Bearer accepted", "x-tenant-id": "tenant-main", "x-correlation-id": "correlation-main", "x-causation-id": "causation-main", traceparent: "00-0123456789abcdef0123456789abcdef-0123456789abcdef-01", "idempotency-key": "idempotency-main" }, payload: { data: {}, meta: { reason: "identity test" } } });
    assert.equal(response.statusCode, 200, response.body);
    assert.equal(calls.at(-1)?.applicationContext.causationId, "causation-main");
    assert.equal(response.json().meta.traceId, "0123456789abcdef0123456789abcdef");
    assert.equal(authorizations.at(-1)?.operationId, "missionActivateMission");
    assert.deepEqual(authorizations.at(-1)?.target, { resourceType: "Mission", resourceId: "resource-main" });
    const queryWithKey = await app.inject({ method: "GET", url: "/api/v1/missions/resource-main", headers: { authorization: "Bearer accepted", "x-tenant-id": "tenant-main", "idempotency-key": "bad" } });
    assert.equal(queryWithKey.statusCode, 200);
  } finally { await app.close(); }
});

test("composition fails without mandatory security and Application API ports", async () => {
  const valid = dependencies([]);
  await assert.rejects(buildHttpAdapter({ ...valid, authentication: undefined as never }, { contractPath }), /Authentication and authorization ports are required/u);
  await assert.rejects(buildHttpAdapter({ ...valid, application: { ...valid.application, workflow: undefined as never } }, { contractPath }), /workflow is required/u);
});

test("operational endpoints are minimal and documentation exposure is opt-in", async () => {
  const hidden = await buildHttpAdapter(dependencies([]), { contractPath });
  try { assert.equal((await hidden.inject({ method: "GET", url: "/health" })).statusCode, 200); assert.equal((await hidden.inject({ method: "GET", url: "/ready" })).statusCode, 404); assert.equal((await hidden.inject({ method: "GET", url: "/docs" })).statusCode, 404); } finally { await hidden.close(); }
  const exposed = await buildHttpAdapter(dependencies([]), { contractPath, exposeOpenApi: true, exposeDocs: true, exposeReadiness: true });
  try { assert.equal((await exposed.inject({ method: "GET", url: "/ready" })).json().data.status, "ready"); assert.equal((await exposed.inject({ method: "GET", url: "/openapi/v1.json" })).json().openapi, "3.1.0"); assert.match((await exposed.inject({ method: "GET", url: "/docs" })).body, /missionCreateMission|BBA Platform API/u); } finally { await exposed.close(); }
});

test("package export exposes only the public Application API subpath", async () => {
  const publicApi = await import("@bba/platform-core/application");
  assert.equal(typeof publicApi.ApplicationError, "function");
  for (const forbidden of ["@bba/platform-core/src/index.js", "@bba/platform-core/persistence", "@bba/platform-core/domain"]) {
    await assert.rejects(import(forbidden), /not defined by "exports"|Package subpath/u);
  }
});
