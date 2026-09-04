import { renderHook, waitFor } from "@testing-library/react";
import { readFileSync } from "node:fs";
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import type { ReactNode } from "react";
import { afterAll, afterEach, beforeAll, describe, expect, test } from "vitest";
import { BbaSdkProvider, CommandOutcomeUnknownError, commandInvalidationPolicy, createBbaQueryClient, missionKeys, normalizeSdkError, useAiWorkforceGetAgentQuery, useAiWorkforceProvisionAgentCommand, useBbaSdkState, useCommandIntent, useMissionCreateMissionCommand, useMissionQuery, type AuthAdapter, type CorrelationIdProvider, type WorkspaceAdapter } from "../src/index.js";

const auth: AuthAdapter = { getAccessToken: async () => "token-test", getPrincipal: async () => ({ subject: "steward", actorReference: "person:steward" }) };
const workspace: WorkspaceAdapter = { getTenantId: async () => "tenant_test" };
const correlationIds: CorrelationIdProvider = { createCorrelationId: () => "correlation-test" };
const server = setupServer();
beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe("sdk-react", () => {
  test("exports every canonical product binding and no placeholder binding", async () => {
    const inventory = JSON.parse(readFileSync("product-operation-inventory.json", "utf8")) as { readonly reactBinding: string; readonly status: string }[]; const publicApi = await import("../src/index.js");
    expect(inventory).toHaveLength(74); expect(inventory.every((entry) => entry.status === "IMPLEMENTED")).toBe(true); for (const entry of inventory) expect(publicApi[entry.reactBinding as keyof typeof publicApi], entry.reactBinding).toBeTypeOf("function");
  });
  test("uses conservative Query defaults", () => {
    const defaults = createBbaQueryClient().getDefaultOptions();
    expect(defaults.queries).toMatchObject({ retry: false, refetchOnWindowFocus: false, staleTime: 30_000 });
    expect(defaults.mutations).toMatchObject({ retry: false });
  });

  test("keeps query keys tenant isolated", () => { expect(missionKeys.detail("tenant_a", "mission_1")).not.toEqual(missionKeys.detail("tenant_b", "mission_1")); });
  test("declares one invalidation policy for every Command", () => { expect(Object.keys(commandInvalidationPolicy)).toHaveLength(57); });

  test("preserves intent and parsed payload on unknown-outcome retry", async () => {
    const keys: string[] = []; const payloads: unknown[] = []; let attempt = 0;
    const executor = async (intent: import("../src/index.js").CommandIntent<{ readonly missionId: string }>) => { keys.push(intent.idempotencyKey); payloads.push(intent.payload); attempt += 1; if (attempt === 1) throw new CommandOutcomeUnknownError(); return { operationId: "missionCreateMission", transactionId: "transaction-1", idempotencyKey: intent.idempotencyKey, correlationId: "correlation-1", resourceReferences: [{ type: "Mission", id: intent.payload.missionId }] }; };
    const result = renderHook(() => useCommandIntent(executor)); await result.result.current.submit({ missionId: "mission_1" }, "Create Mission"); await waitFor(() => expect(result.result.current.state.status).toBe("OUTCOME_UNKNOWN")); await result.result.current.retry(); await waitFor(() => expect(result.result.current.state.status).toBe("COMMITTED"));
    expect(keys[0]).toBe(keys[1]); expect(payloads[0]).toEqual({ missionId: "mission_1" }); expect(Object.isFrozen(payloads[0])).toBe(true);
  });

  test.each([[401, "UNAUTHENTICATED"], [403, "FORBIDDEN"], [404, "NOT_FOUND"], [409, "CONFLICT"], [500, "APPLICATION_FAILURE"]] as const)("maps HTTP %s into %s without retry", (status, code) => {
    const error = normalizeSdkError(status, { error: { message: "public failure", requestId: "request-test", correlationId: "correlation-test" } });
    expect(error.code).toBe(code); expect(error.retryable).toBe(false);
  });

  test("resolves async adapters and maps Mission into a stable view", async () => {
    let request: Request | undefined;
    const fetch: typeof globalThis.fetch = async (input, init) => { request = new Request(input, init); return new Response(JSON.stringify({ data: { aggregateType: "Mission", id: "mission_1", tenantId: "tenant_test", version: 2, status: "ACTIVE", data: {} }, meta: { requestId: "request-test", correlationId: "correlation-test" } }), { status: 200, headers: { "content-type": "application/json" } }); };
    const wrapper = ({ children }: { readonly children: ReactNode }) => <BbaSdkProvider auth={auth} baseUrl="https://api.example.test" correlationIds={correlationIds} fetch={fetch} workspace={workspace}>{children}</BbaSdkProvider>;
    const runtime = renderHook(useBbaSdkState, { wrapper }); await waitFor(() => expect(runtime.result.current.status).toBe("READY"));
    const mission = renderHook(() => useMissionQuery("mission_1"), { wrapper }); await waitFor(() => expect(mission.result.current.data?.status).toBe("ACTIVE"));
    expect(mission.result.current.data).toEqual({ id: "mission_1", tenantId: "tenant_test", version: 2, status: "ACTIVE", title: null, summary: null, description: null });
    expect(request?.headers.get("Authorization")).toBe("Bearer token-test"); expect(request?.headers.get("X-Tenant-Id")).toBe("tenant_test"); expect(request?.headers.get("X-Correlation-Id")).toBe("correlation-test");
  });

  test("distinguishes missing configuration from adapter failure", async () => {
    const missing = ({ children }: { readonly children: ReactNode }) => <BbaSdkProvider auth={{ ...auth, getAccessToken: async () => undefined }} baseUrl="https://api.example.test" correlationIds={correlationIds} workspace={workspace}>{children}</BbaSdkProvider>;
    const missingResult = renderHook(useBbaSdkState, { wrapper: missing }); await waitFor(() => expect(missingResult.result.current.status).toBe("CONFIGURATION_MISSING"));
    const failing = ({ children }: { readonly children: ReactNode }) => <BbaSdkProvider auth={{ ...auth, getPrincipal: async () => { throw new Error("adapter failed"); } }} baseUrl="https://api.example.test" correlationIds={correlationIds} workspace={workspace}>{children}</BbaSdkProvider>;
    const failingResult = renderHook(useBbaSdkState, { wrapper: failing }); await waitFor(() => expect(failingResult.result.current.status).toBe("SESSION_ERROR"));
  });

  test("uses MSW to preserve a public forbidden error", async () => {
    server.use(http.get("https://api.example.test/api/v1/missions/mission_forbidden", () => HttpResponse.json({ error: { code: "FORBIDDEN", message: "Tenant access denied", requestId: "request-msw", correlationId: "correlation-msw" } }, { status: 403 })));
    const wrapper = ({ children }: { readonly children: ReactNode }) => <BbaSdkProvider auth={auth} baseUrl="https://api.example.test" correlationIds={correlationIds} workspace={workspace}>{children}</BbaSdkProvider>;
    const mission = renderHook(() => useMissionQuery("mission_forbidden"), { wrapper });
    await waitFor(() => expect(mission.result.current.error?.code).toBe("FORBIDDEN"));
    expect(mission.result.current.error?.requestId).toBe("request-msw");
  });

  test("submits Mission Command with explicit identity headers and normalizes its receipt", async () => {
    let request: Request | undefined;
    const fetch: typeof globalThis.fetch = async (input, init) => { request = input instanceof Request ? input.clone() : new Request(input, init); return new Response(JSON.stringify({ data: { transactionId: "transaction-mission", resourceReferences: [{ resourceType: "Mission", resourceId: "mission_1" }] }, meta: { requestId: "request-command", correlationId: "correlation-command" } }), { status: 201, headers: { "content-type": "application/json" } }); };
    const wrapper = ({ children }: { readonly children: ReactNode }) => <BbaSdkProvider auth={auth} baseUrl="https://api.example.test" correlationIds={correlationIds} fetch={fetch} workspace={workspace}>{children}</BbaSdkProvider>;
    const command = renderHook(() => ({ command: useMissionCreateMissionCommand(), runtime: useBbaSdkState() }), { wrapper }); await waitFor(() => expect(command.result.current.runtime.status).toBe("READY"));
    await command.result.current.command.submit({ missionId: "mission_1", metadata: { title: "Mission", summary: "Summary", description: "Description", createdAt: "2026-07-28T12:00:00.000Z", updatedAt: "2026-07-28T12:00:00.000Z" }, intent: { purpose: "Purpose", objective: "Objective", stewardReference: "person:steward", context: "Context", expectedOutcome: "Outcome" }, evidence: [{ evidenceId: "evidence_1", source: "source", type: "record", capturedAt: "2026-07-28T12:00:00.000Z" }], lineage: [{ sourceId: "source_1", targetId: "mission_1", relationship: "supports", declaredAt: "2026-07-28T12:00:00.000Z" }] }, "Create governed Mission", { correlationId: "interaction-correlation" });
    await waitFor(() => expect(command.result.current.command.state.status).toBe("COMMITTED"));
    expect(request?.headers.get("Idempotency-Key")).toBeTruthy(); expect(request?.headers.get("X-Correlation-Id")).toBe("interaction-correlation");
    if (command.result.current.command.state.status === "COMMITTED") expect(command.result.current.command.state.receipt).toMatchObject({ operationId: "missionCreateMission", transactionId: "transaction-mission", correlationId: "correlation-command" });
  });

  test("binds AI Workforce provision and Agent query through public SDK contracts", async () => {
    const requests: Request[] = [];
    const fetch: typeof globalThis.fetch = async (input, init) => { const request = input instanceof Request ? input.clone() : new Request(input, init); requests.push(request); if (request.method === "POST") return new Response(JSON.stringify({ data: { transactionId: "transaction-agent", resourceReferences: [{ resourceType: "Agent", resourceId: "agent_1" }] }, meta: { requestId: "request-agent", correlationId: "correlation-agent" } }), { status: 201, headers: { "content-type": "application/json" } }); return new Response(JSON.stringify({ data: { agentId: "agent_1", tenantId: "tenant_test", name: "Policy analyst", purpose: "Analyze policy", definitionVersion: "1", lifecycleStatus: "ACTIVE", status: "AVAILABLE", availability: "AVAILABLE", capabilities: [{ name: "analysis" }], assignments: [], version: 1 }, meta: { requestId: "request-agent-query", correlationId: "correlation-agent-query" } }), { status: 200, headers: { "content-type": "application/json" } }); };
    const wrapper = ({ children }: { readonly children: ReactNode }) => <BbaSdkProvider auth={auth} baseUrl="https://api.example.test" correlationIds={correlationIds} fetch={fetch} workspace={workspace}>{children}</BbaSdkProvider>;
    const command = renderHook(() => ({ command: useAiWorkforceProvisionAgentCommand(), runtime: useBbaSdkState() }), { wrapper }); await waitFor(() => expect(command.result.current.runtime.status).toBe("READY"));
    await command.result.current.command.submit({ agentId: "agent_1", name: "Policy analyst", purpose: "Analyze policy", definitionVersion: "1", capabilities: [{ name: "analysis", scope: "policy" }], occurredAt: "2026-07-28T12:00:00.000Z", evidence: [{ evidenceId: "evidence_1", source: "source", type: "record", capturedAt: "2026-07-28T12:00:00.000Z" }], lineage: [{ sourceId: "source_1", targetId: "agent_1", relationship: "defines", declaredAt: "2026-07-28T12:00:00.000Z" }] }, "Provision governed Agent");
    await waitFor(() => expect(command.result.current.command.state.status).toBe("COMMITTED")); expect(requests[0]?.headers.get("Idempotency-Key")).toBeTruthy();
    const query = renderHook(() => useAiWorkforceGetAgentQuery("agent_1"), { wrapper }); await waitFor(() => expect(query.result.current.data?.name).toBe("Policy analyst")); expect(query.result.current.data).toMatchObject({ id: "agent_1", capabilityCount: 1, assignmentCount: 0 });
  });
});
