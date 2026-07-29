import type { CreatePublisherProjectRequest, EditorialPackage, HumanDecision, PublisherProject } from "@bba/publisher-prototype";

export interface AgencyClientConfiguration { readonly baseUrl: string; readonly getAccessToken: () => Promise<string | undefined>; readonly getTenantId: () => string; readonly getCorrelationId: () => string; readonly fetch?: typeof globalThis.fetch | undefined; }
type Envelope<T> = { readonly data: T; readonly meta: { readonly correlationId: string; readonly replayed?: boolean } };
export interface AiProviderStatus { readonly provider: "OPENAI" | "ANTHROPIC"; readonly configured: boolean; readonly model?: string | undefined; readonly expiresAt?: string | undefined; }

export class AgencyClient {
  public constructor(private readonly configuration: AgencyClientConfiguration) {}
  public listProjects() { return this.send<readonly PublisherProject[]>("GET", "/agency/v1/projects"); }
  public getProject(projectId: string) { return this.send<PublisherProject>("GET", `/agency/v1/projects/${encodeURIComponent(projectId)}`); }
  public createProject(request: CreatePublisherProjectRequest, idempotencyKey: string) { return this.send<PublisherProject>("POST", "/agency/v1/projects", request, idempotencyKey); }
  public executeProject(projectId: string, idempotencyKey: string) { return this.send<PublisherProject>("POST", `/agency/v1/projects/${encodeURIComponent(projectId)}/execute`, {}, idempotencyKey); }
  public recordDecision(projectId: string, decision: Omit<HumanDecision, "actorReference" | "occurredAt">, idempotencyKey: string) { return this.send<PublisherProject>("POST", `/agency/v1/projects/${encodeURIComponent(projectId)}/decisions`, decision, idempotencyKey); }
  public getEditorialPackage(projectId: string) { return this.send<EditorialPackage>("GET", `/agency/v1/projects/${encodeURIComponent(projectId)}/package`); }
  public getAiSettings() { return this.send<readonly AiProviderStatus[]>("GET", "/agency/v1/settings/ai"); }
  public configureAi(value: { readonly provider: "OPENAI" | "ANTHROPIC"; readonly apiKey: string; readonly model: string }, idempotencyKey: string) { return this.send<{ provider: string; model: string; configured: true; expiresInSeconds: number }>("PUT", "/agency/v1/settings/ai", value, idempotencyKey); }
  private async send<T>(method: string, path: string, body?: unknown, idempotencyKey?: string): Promise<Envelope<T>> {
    const accessToken = await this.configuration.getAccessToken(); if (!accessToken) throw new Error("UNAUTHENTICATED");
    const response = await (this.configuration.fetch ?? globalThis.fetch)(`${this.configuration.baseUrl.replace(/\/$/u, "")}${path}`, { method, headers: { authorization: `Bearer ${accessToken}`, "x-tenant-id": this.configuration.getTenantId(), "x-correlation-id": this.configuration.getCorrelationId(), ...(idempotencyKey === undefined ? {} : { "idempotency-key": idempotencyKey }), ...(body === undefined ? {} : { "content-type": "application/json" }) }, ...(body === undefined ? {} : { body: JSON.stringify(body) }) });
    const value = await response.json() as Envelope<T> | { error?: { code?: string } }; if (!response.ok) throw new Error("error" in value ? value.error?.code ?? `HTTP_${response.status}` : `HTTP_${response.status}`); return value as Envelope<T>;
  }
}
