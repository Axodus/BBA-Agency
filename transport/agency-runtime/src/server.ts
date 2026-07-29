import Fastify, { type FastifyInstance, type FastifyRequest } from "fastify";
import { DeterministicAgentExecutor, PublisherProjectService, agencyServiceCatalog, type AgentExecutorPort, type HumanDecision, type PublisherPlatformCompositionPort, type PublisherProjectRepository } from "@bba/publisher-prototype";
import { z } from "zod";
import { ByokAgentExecutor } from "./llm-executor.js";
import { EphemeralCredentialVault } from "./memory.js";

export interface AgencyPrincipal { readonly subject: string; readonly actorReference: string; }
export interface AgencyAuthenticationPort { authenticate(bearerToken: string): Promise<AgencyPrincipal | undefined>; }
export interface AgencyAuthorizationPort { authorize(input: { readonly principal: AgencyPrincipal; readonly tenantId: string; readonly operationId: string; readonly projectId?: string | undefined }): Promise<boolean>; }
export interface AgencyRuntimeHttpDependencies {
  readonly authentication: AgencyAuthenticationPort;
  readonly authorization: AgencyAuthorizationPort;
  readonly projects: PublisherProjectRepository;
  readonly platform: PublisherPlatformCompositionPort;
  readonly credentials: EphemeralCredentialVault;
  readonly request?: typeof fetch;
  readonly clock?: () => Date;
}

const commandHeaders = z.object({ authorization: z.string().regex(/^Bearer\s+\S+$/u), "x-tenant-id": z.string().min(1).max(128), "x-correlation-id": z.string().min(1).max(128), "idempotency-key": z.string().regex(/^[A-Za-z0-9._:-]{8,128}$/u) });
const queryHeaders = commandHeaders.omit({ "idempotency-key": true });
const credentialBody = z.object({ provider: z.enum(["OPENAI", "ANTHROPIC"]), apiKey: z.string().min(8).max(512), model: z.string().min(1).max(128) });
const decisionBody = z.object({ decisionId: z.string().min(1), target: z.enum(["EDITORIAL_CORE", "EDITORIAL_PACKAGE"]), targetVersion: z.number().int().positive(), outcome: z.enum(["APPROVED", "REJECTED", "REVISION_REQUESTED"]), rationale: z.string().trim().min(1).max(2000) });
type RequestIdentity = { principal: AgencyPrincipal; tenantId: string; correlationId: string; idempotencyKey?: string | undefined };

function token(request: FastifyRequest) { return String(request.headers.authorization ?? "").replace(/^Bearer\s+/u, ""); }
function errorCode(error: unknown) { return error instanceof Error ? error.message.split(":")[0] ?? "INTERNAL_FAILURE" : "INTERNAL_FAILURE"; }
function httpStatus(code: string) { if (code.includes("NOT_FOUND")) return 404; if (code.includes("ALREADY") || code.includes("NOT_EXECUTABLE") || code.includes("AWAITING")) return 409; if (code.includes("PROVIDER")) return 502; return 400; }

export function createAgencyRuntimeHttp(dependencies: AgencyRuntimeHttpDependencies): FastifyInstance {
  if (!dependencies.authentication || !dependencies.authorization || !dependencies.projects || !dependencies.platform || !dependencies.credentials) throw new Error("AGENCY_RUNTIME_COMPOSITION_INCOMPLETE");
  const app = Fastify({ logger: false }); const service = new PublisherProjectService(dependencies.projects, dependencies.platform); const replay = new Map<string, { fingerprint: string; body: unknown }>(); const now = dependencies.clock ?? (() => new Date());

  async function identify(request: FastifyRequest, operationId: string, command: boolean, projectId?: string): Promise<RequestIdentity> {
    const parsed = (command ? commandHeaders : queryHeaders).parse(request.headers); const principal = await dependencies.authentication.authenticate(token(request));
    if (!principal) throw new Error("UNAUTHENTICATED"); const tenantId = parsed["x-tenant-id"];
    if (!await dependencies.authorization.authorize({ principal, tenantId, operationId, projectId })) throw new Error("FORBIDDEN");
    return { principal, tenantId, correlationId: parsed["x-correlation-id"], ...(command ? { idempotencyKey: (parsed as z.infer<typeof commandHeaders>)["idempotency-key"] } : {}) };
  }
  function context(identity: RequestIdentity) { return { tenantId: identity.tenantId, subject: identity.principal.subject, actorReference: identity.principal.actorReference, correlationId: identity.correlationId, now: now().toISOString() }; }
  async function command<T>(identity: RequestIdentity, operationId: string, payload: unknown, execute: () => Promise<T>) {
    const replayKey = `${identity.tenantId}:${identity.principal.subject}:${operationId}:${identity.idempotencyKey}`; const fingerprint = JSON.stringify(payload); const previous = replay.get(replayKey);
    if (previous) { if (previous.fingerprint !== fingerprint) throw new Error("IDEMPOTENCY_CONFLICT"); return { data: previous.body, meta: { replayed: true, correlationId: identity.correlationId } }; }
    const body = await execute(); replay.set(replayKey, { fingerprint, body }); return { data: body, meta: { replayed: false, correlationId: identity.correlationId } };
  }

  app.setErrorHandler((error, _request, reply) => { const code = error instanceof z.ZodError ? "INVALID_REQUEST" : errorCode(error); const status = code === "UNAUTHENTICATED" ? 401 : code === "FORBIDDEN" ? 403 : code === "IDEMPOTENCY_CONFLICT" ? 409 : httpStatus(code); void reply.status(status).send({ error: { code, message: code === "INTERNAL_FAILURE" ? "Unexpected failure" : code } }); });
  app.get("/agency/v1/services", async (request) => { const identity = await identify(request, "agencyListServices", false); return { data: agencyServiceCatalog, meta: { correlationId: identity.correlationId } }; });
  app.get("/agency/v1/projects", async (request) => { const identity = await identify(request, "agencyListProjects", false); return { data: await dependencies.projects.list(identity.tenantId, identity.principal.subject), meta: { correlationId: identity.correlationId } }; });
  app.get<{ Params: { projectId: string } }>("/agency/v1/projects/:projectId", async (request) => { const identity = await identify(request, "agencyGetProject", false, request.params.projectId); const project = await dependencies.projects.get(identity.tenantId, request.params.projectId); if (!project || project.subject !== identity.principal.subject) throw new Error("PROJECT_NOT_FOUND"); return { data: project, meta: { correlationId: identity.correlationId } }; });
  app.post("/agency/v1/projects", async (request) => { const identity = await identify(request, "agencyCreateProject", true); const body = request.body as Parameters<typeof service.create>[0]; return command(identity, "agencyCreateProject", body, () => service.create(body, context(identity))); });
  app.post<{ Params: { projectId: string } }>("/agency/v1/projects/:projectId/execute", async (request) => { const identity = await identify(request, "agencyExecuteProject", true, request.params.projectId); const project = await dependencies.projects.get(identity.tenantId, request.params.projectId); if (!project || project.subject !== identity.principal.subject) throw new Error("PROJECT_NOT_FOUND"); let executor: AgentExecutorPort = new DeterministicAgentExecutor(); if (project.executionMode === "BYOK") { if (!project.provider) throw new Error("PROVIDER_NOT_SELECTED"); const credential = dependencies.credentials.get(identity.tenantId, identity.principal.subject, project.provider); if (!credential) throw new Error("PROVIDER_CREDENTIAL_MISSING"); executor = new ByokAgentExecutor(credential, dependencies.request); } return command(identity, "agencyExecuteProject", request.body ?? {}, () => service.execute(request.params.projectId, context(identity), executor)); });
  app.post<{ Params: { projectId: string } }>("/agency/v1/projects/:projectId/decisions", async (request) => { const identity = await identify(request, "agencyRecordDecision", true, request.params.projectId); const parsed = decisionBody.parse(request.body); const decision: HumanDecision = { ...parsed, actorReference: identity.principal.actorReference, occurredAt: now().toISOString() }; return command(identity, "agencyRecordDecision", parsed, () => service.decide(request.params.projectId, decision, context(identity))); });
  app.get<{ Params: { projectId: string } }>("/agency/v1/projects/:projectId/package", async (request) => { const identity = await identify(request, "agencyGetEditorialPackage", false, request.params.projectId); const project = await dependencies.projects.get(identity.tenantId, request.params.projectId); if (!project || project.subject !== identity.principal.subject) throw new Error("PROJECT_NOT_FOUND"); if (project.status !== "READY_FOR_DELIVERY") throw new Error("PACKAGE_NOT_READY"); return { data: project.packages[0], meta: { correlationId: identity.correlationId } }; });
  app.get("/agency/v1/settings/ai", async (request) => { const identity = await identify(request, "agencyGetAiSettings", false); return { data: dependencies.credentials.status(identity.tenantId, identity.principal.subject), meta: { correlationId: identity.correlationId } }; });
  app.put("/agency/v1/settings/ai", async (request) => { const identity = await identify(request, "agencyConfigureAi", true); const value = credentialBody.parse(request.body); return command(identity, "agencyConfigureAi", { provider: value.provider, model: value.model }, async () => { dependencies.credentials.put(identity.tenantId, identity.principal.subject, value); return { provider: value.provider, model: value.model, configured: true, expiresInSeconds: 3600 }; }); });
  app.delete<{ Params: { provider: "OPENAI" | "ANTHROPIC" } }>("/agency/v1/settings/ai/:provider", async (request) => { const identity = await identify(request, "agencyDeleteAiSettings", true); const provider = z.enum(["OPENAI", "ANTHROPIC"]).parse(request.params.provider); return command(identity, "agencyDeleteAiSettings", { provider }, async () => { dependencies.credentials.delete(identity.tenantId, identity.principal.subject, provider); return { provider, configured: false }; }); });
  return app;
}
