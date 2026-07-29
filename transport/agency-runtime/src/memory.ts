import type { PublisherProject, PublisherProjectRepository } from "@bba/publisher-prototype";

export class InMemoryPublisherProjectRepository implements PublisherProjectRepository {
  private readonly projects = new Map<string, PublisherProject>();
  public async get(tenantId: string, projectId: string) { return this.projects.get(`${tenantId}:${projectId}`); }
  public async list(tenantId: string, subject: string) { return [...this.projects.values()].filter((project) => project.tenantId === tenantId && project.subject === subject); }
  public async save(project: PublisherProject) { this.projects.set(`${project.tenantId}:${project.projectId}`, structuredClone(project)); }
}

export interface EphemeralProviderCredential { readonly provider: "OPENAI" | "ANTHROPIC"; readonly apiKey: string; readonly model: string; readonly expiresAt: number; }
export class EphemeralCredentialVault {
  private readonly credentials = new Map<string, EphemeralProviderCredential>();
  public put(tenantId: string, subject: string, credential: Omit<EphemeralProviderCredential, "expiresAt">, now = Date.now()) { this.credentials.set(`${tenantId}:${subject}:${credential.provider}`, { ...credential, expiresAt: now + 3_600_000 }); }
  public get(tenantId: string, subject: string, provider: "OPENAI" | "ANTHROPIC", now = Date.now()) { const value = this.credentials.get(`${tenantId}:${subject}:${provider}`); if (!value || value.expiresAt <= now) { this.credentials.delete(`${tenantId}:${subject}:${provider}`); return undefined; } return value; }
  public delete(tenantId: string, subject: string, provider: "OPENAI" | "ANTHROPIC") { this.credentials.delete(`${tenantId}:${subject}:${provider}`); }
  public status(tenantId: string, subject: string, now = Date.now()) { return (["OPENAI", "ANTHROPIC"] as const).map((provider) => { const value = this.get(tenantId, subject, provider, now); return { provider, configured: value !== undefined, ...(value === undefined ? {} : { model: value.model, expiresAt: new Date(value.expiresAt).toISOString() }) }; }); }
}
