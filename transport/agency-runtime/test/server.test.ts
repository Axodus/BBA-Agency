import { describe, expect, it } from "vitest";
import { EphemeralCredentialVault, InMemoryPublisherProjectRepository, createAgencyRuntimeHttp } from "../src/index.js";
import type { PublisherPlatformCompositionPort } from "@bba/publisher-prototype";

const editorialContext = { contextId: "context-1", version: 1, title: "Projeto Publisher", topic: "Mensagem institucional", objective: "Criar pacote editorial", audience: "Lideranças", centralMessage: "Uma mensagem coerente pode servir vários canais", tone: "Preciso", language: "pt-BR", callToAction: "Conheça a proposta", requiredFacts: ["Aprovação humana é obrigatória"], requiredTerms: ["governança"], prohibitedClaims: ["publicação autônoma"], constraints: ["Não publicar externamente"], materials: [{ id: "material-1", kind: "TEXT", title: "Fonte", content: "Aprovação humana é obrigatória" }], channels: ["blog", "linkedin", "instagram"] } as const;
const platform: PublisherPlatformCompositionPort = {
  createProjectFoundation: async ({ projectId }) => ({ missionId: `mission-${projectId}`, assetIds: [], transactionIds: ["tx-project"] }),
  recordEditorialPackage: async ({ current }) => ({ ...current, assetIds: ["asset-package"], transactionIds: [...current.transactionIds, "tx-package"] }),
  recordHumanDecision: async ({ current, decision }) => ({ ...current, reviewId: "review-1", transactionIds: [...current.transactionIds, decision.decisionId] }),
};
function headers(key?: string) { return { authorization: "Bearer test-token", "x-tenant-id": "tenant-1", "x-correlation-id": "correlation-1", ...(key === undefined ? {} : { "idempotency-key": key }) }; }
function app() { return createAgencyRuntimeHttp({ authentication: { authenticate: async (token) => token === "test-token" ? { subject: "subject-1", actorReference: "steward-1" } : undefined }, authorization: { authorize: async ({ tenantId }) => tenantId === "tenant-1" }, projects: new InMemoryPublisherProjectRepository(), platform, credentials: new EphemeralCredentialVault(), clock: () => new Date("2026-07-29T12:00:00.000Z") }); }

describe("Agency Runtime HTTP", () => {
  it("fails composition when a mandatory Platform collaborator is absent", () => {
    expect(() => createAgencyRuntimeHttp({ authentication: { authenticate: async () => undefined }, authorization: { authorize: async () => false }, projects: new InMemoryPublisherProjectRepository(), credentials: new EphemeralCredentialVault() } as never)).toThrow("AGENCY_RUNTIME_COMPOSITION_INCOMPLETE");
  });
  it("runs the deterministic Project journey with two human checkpoints", async () => {
    const server = app(); const createBody = { projectId: "project-1", executionMode: "DETERMINISTIC", context: editorialContext };
    let response = await server.inject({ method: "POST", url: "/agency/v1/projects", headers: headers("project-create-1"), payload: createBody }); expect(response.statusCode).toBe(200);
    response = await server.inject({ method: "POST", url: "/agency/v1/projects/project-1/execute", headers: headers("project-execute-1"), payload: {} }); expect(response.json().data.status).toBe("AWAITING_EDITORIAL_CORE_APPROVAL");
    response = await server.inject({ method: "POST", url: "/agency/v1/projects/project-1/decisions", headers: headers("project-core-decision"), payload: { decisionId: "decision-core", target: "EDITORIAL_CORE", targetVersion: 1, outcome: "APPROVED", rationale: "Mensagem correta" } }); expect(response.json().data.status).toBe("RUNNING_EDITORIAL_PLAN");
    response = await server.inject({ method: "POST", url: "/agency/v1/projects/project-1/execute", headers: headers("project-execute-2"), payload: {} }); expect(response.json().data.packages[0].variants).toHaveLength(3);
    response = await server.inject({ method: "POST", url: "/agency/v1/projects/project-1/decisions", headers: headers("project-package-decision"), payload: { decisionId: "decision-package", target: "EDITORIAL_PACKAGE", targetVersion: 1, outcome: "APPROVED", rationale: "Pronto para uso" } }); expect(response.json().data.status).toBe("READY_FOR_DELIVERY");
    response = await server.inject({ method: "GET", url: "/agency/v1/projects/project-1/package", headers: headers() }); expect(response.statusCode).toBe(200); expect(response.json().data.status).toBe("READY_FOR_DELIVERY");
    await server.close();
  }, 30_000);

  it("replays commands without executing again and detects an incompatible key", async () => {
    const server = app(); const payload = { projectId: "project-replay", executionMode: "DETERMINISTIC", context: editorialContext };
    const first = await server.inject({ method: "POST", url: "/agency/v1/projects", headers: headers("same-create-key"), payload });
    const replay = await server.inject({ method: "POST", url: "/agency/v1/projects", headers: headers("same-create-key"), payload }); expect(first.json().meta.replayed).toBe(false); expect(replay.json().meta.replayed).toBe(true);
    const conflict = await server.inject({ method: "POST", url: "/agency/v1/projects", headers: headers("same-create-key"), payload: { ...payload, projectId: "different-project" } }); expect(conflict.statusCode).toBe(409); expect(conflict.json().error.code).toBe("IDEMPOTENCY_CONFLICT"); await server.close();
  });

  it("keeps provider keys write-only and scoped to the authenticated tenant and principal", async () => {
    const server = app(); const saved = await server.inject({ method: "PUT", url: "/agency/v1/settings/ai", headers: headers("configure-openai"), payload: { provider: "OPENAI", apiKey: "sk-private-value", model: "gpt-5.6-terra" } });
    expect(saved.statusCode).toBe(200); expect(saved.body).not.toContain("sk-private-value"); const status = await server.inject({ method: "GET", url: "/agency/v1/settings/ai", headers: headers() }); expect(status.body).not.toContain("sk-private-value"); expect(status.json().data[0].configured).toBe(true); await server.close();
  });

  it("expires BYOK credentials after sixty minutes", () => {
    const vault = new EphemeralCredentialVault(); vault.put("tenant-1", "subject-1", { provider: "ANTHROPIC", apiKey: "private-key", model: "claude-sonnet-5" }, 1_000);
    expect(vault.get("tenant-1", "subject-1", "ANTHROPIC", 3_600_999)?.model).toBe("claude-sonnet-5"); expect(vault.get("tenant-1", "subject-1", "ANTHROPIC", 3_601_000)).toBeUndefined();
  });
});
