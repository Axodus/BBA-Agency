import { describe, expect, it, vi } from "vitest";
import { AgencyClient } from "../src/agency/client.js";

describe("AgencyClient", () => {
  it("propagates tenant, bearer, correlation, and command idempotency without leaking credentials", async () => {
    const request = vi.fn<typeof fetch>().mockResolvedValue(new Response(JSON.stringify({ data: { projectId: "project-1" }, meta: { correlationId: "correlation-1", replayed: false } }), { status: 200, headers: { "content-type": "application/json" } }));
    const client = new AgencyClient({ baseUrl: "https://agency.example.test/", getAccessToken: async () => "secret-token", getTenantId: () => "tenant-1", getCorrelationId: () => "correlation-1", fetch: request });
    await client.createProject({ projectId: "project-1", executionMode: "DETERMINISTIC", context: { contextId: "context-1", version: 1, title: "Project", topic: "Topic", objective: "Objective", audience: "Audience", centralMessage: "Message", tone: "Precise", language: "pt-BR", requiredFacts: [], requiredTerms: [], prohibitedClaims: [], constraints: [], materials: [], channels: ["blog", "linkedin", "instagram"] } }, "idempotency-project-1");
    expect(request).toHaveBeenCalledOnce(); const [, init] = request.mock.calls[0]!; expect(init?.headers).toMatchObject({ authorization: "Bearer secret-token", "x-tenant-id": "tenant-1", "x-correlation-id": "correlation-1", "idempotency-key": "idempotency-project-1" });
  });

  it("normalizes the public error code instead of exposing response internals", async () => {
    const client = new AgencyClient({ baseUrl: "https://agency.example.test", getAccessToken: async () => "token", getTenantId: () => "tenant-1", getCorrelationId: () => "correlation-1", fetch: vi.fn<typeof fetch>().mockResolvedValue(new Response(JSON.stringify({ error: { code: "FORBIDDEN", message: "private detail" } }), { status: 403 })) });
    await expect(client.listProjects()).rejects.toThrow("FORBIDDEN");
  });
});
