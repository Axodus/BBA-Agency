import { renderHook, waitFor } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import type { ReactNode } from "react";
import { afterAll, afterEach, beforeAll, describe, expect, test } from "vitest";
import { BbaSdkProvider, createBbaQueryClient, missionKeys, normalizeSdkError, useBbaSdkState, useMissionQuery, type AuthAdapter, type CorrelationIdProvider, type WorkspaceAdapter } from "../src/index.js";

const auth: AuthAdapter = { getAccessToken: async () => "token-test", getPrincipal: async () => ({ subject: "steward", actorReference: "person:steward" }) };
const workspace: WorkspaceAdapter = { getTenantId: async () => "tenant_test" };
const correlationIds: CorrelationIdProvider = { createCorrelationId: () => "correlation-test" };
const server = setupServer();
beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe("sdk-react", () => {
  test("uses conservative Query defaults", () => {
    const defaults = createBbaQueryClient().getDefaultOptions();
    expect(defaults.queries).toMatchObject({ retry: false, refetchOnWindowFocus: false, staleTime: 30_000 });
    expect(defaults.mutations).toMatchObject({ retry: false });
  });

  test("keeps query keys tenant isolated", () => { expect(missionKeys.detail("tenant_a", "mission_1")).not.toEqual(missionKeys.detail("tenant_b", "mission_1")); });

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
    expect(mission.result.current.data).toEqual({ id: "mission_1", tenantId: "tenant_test", version: 2, status: "ACTIVE" });
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
});
