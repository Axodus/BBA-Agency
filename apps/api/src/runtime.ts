import { createAgencyRuntimeHttp, type AgencyAuthenticationPort, type AgencyAuthorizationPort, type AgencyPrincipal, type ProviderCredentialVault } from "@bba/agency-runtime-http";
import type { PublisherPlatformCompositionPort } from "@bba/publisher-prototype";
import type { Db, MongoClient } from "mongodb";
import { createMongoPersistence } from "./persistence/mongo.js";

export interface ApiRuntimeConfiguration {
  readonly accessToken: string;
  readonly tenantId: string;
  readonly subject: string;
  readonly actorReference: string;
  readonly allowedOrigins: readonly string[];
}

export function assertPrivatePreview(value: string | undefined) { if (value !== "true") throw new Error("API_PUBLIC_ACTIVATION_BLOCKED"); }
export function isAllowedOrigin(origin: string, allowedOrigins: readonly string[]) { return allowedOrigins.includes(origin); }

class DisabledCredentialVault implements ProviderCredentialVault {
  public get() { return undefined; }
  public put() { throw new Error("BYOK_DISABLED"); }
  public delete() { throw new Error("BYOK_DISABLED"); }
  public status() { return [{ provider: "OPENAI" as const, configured: false }, { provider: "ANTHROPIC" as const, configured: false }]; }
}

function platformComposition(): PublisherPlatformCompositionPort {
  return {
    createProjectFoundation: async ({ projectId }) => ({ missionId: `mission-${projectId}`, assetIds: [], transactionIds: [`api-project-${projectId}`] }),
    recordEditorialPackage: async ({ current, projectId }) => ({ ...current, assetIds: [...current.assetIds, `asset-${projectId}-package`], transactionIds: [...current.transactionIds, `api-package-${projectId}`] }),
    recordHumanDecision: async ({ current, decision }) => ({ ...current, reviewId: `review-${decision.decisionId}`, transactionIds: [...current.transactionIds, `api-decision-${decision.decisionId}`] })
  };
}

export async function createPrivateApiRuntime(client: MongoClient, database: Db, configuration: ApiRuntimeConfiguration) {
  const { projects, idempotency } = createMongoPersistence(client, database);
  await Promise.all([projects.initialize(), idempotency.initialize()]);
  const expectedPrincipal: AgencyPrincipal = { subject: configuration.subject, actorReference: configuration.actorReference };
  const authentication: AgencyAuthenticationPort = { authenticate: async (token) => token === configuration.accessToken ? expectedPrincipal : undefined };
  const authorization: AgencyAuthorizationPort = { authorize: async ({ principal, tenantId }) => tenantId === configuration.tenantId && principal.subject === expectedPrincipal.subject };
  const app = createAgencyRuntimeHttp({ authentication, authorization, projects, platform: platformComposition(), credentials: new DisabledCredentialVault(), idempotency });
  app.addHook("onRequest", async (request, reply) => {
    const origin = request.headers.origin;
    if (origin === undefined) return;
    if (!isAllowedOrigin(origin, configuration.allowedOrigins)) { await reply.status(403).send({ error: { code: "FORBIDDEN", message: "The request origin is not authorized." } }); return; }
    reply.header("access-control-allow-origin", origin);
    reply.header("vary", "Origin");
    reply.header("access-control-allow-headers", "authorization, content-type, idempotency-key, x-correlation-id, x-tenant-id");
    reply.header("access-control-allow-methods", "GET, POST, PUT, DELETE, OPTIONS");
    if (request.method === "OPTIONS") { await reply.status(204).send(); }
  });
  app.get("/healthz", async () => ({ status: "ok" }));
  app.get("/readyz", async () => { await database.command({ ping: 1 }); return { status: "ready" }; });
  return app;
}
