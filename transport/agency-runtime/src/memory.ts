import type { PublisherProject, PublisherProjectRepository } from "@bba/publisher-prototype";
import type { AiProvider, CommandIdempotencyStore, ProviderCredential, ProviderCredentialVault } from "./contracts.js";

export class InMemoryPublisherProjectRepository implements PublisherProjectRepository {
  private readonly projects = new Map<string, PublisherProject>();
  public async get(tenantId: string, projectId: string) { return this.projects.get(`${tenantId}:${projectId}`); }
  public async list(tenantId: string, subject: string) { return [...this.projects.values()].filter((project) => project.tenantId === tenantId && project.subject === subject); }
  public async save(project: PublisherProject) { this.projects.set(`${project.tenantId}:${project.projectId}`, structuredClone(project)); }
}

export interface EphemeralProviderCredential extends ProviderCredential {}
export class EphemeralCredentialVault implements ProviderCredentialVault {
  private readonly credentials = new Map<string, ProviderCredential>();
  public put(tenantId: string, subject: string, credential: Omit<ProviderCredential, "expiresAt">, now = Date.now()) { this.credentials.set(`${tenantId}:${subject}:${credential.provider}`, { ...credential, expiresAt: now + 3_600_000 }); }
  public get(tenantId: string, subject: string, provider: AiProvider, now = Date.now()) { const value = this.credentials.get(`${tenantId}:${subject}:${provider}`); if (!value || value.expiresAt <= now) { this.credentials.delete(`${tenantId}:${subject}:${provider}`); return undefined; } return value; }
  public delete(tenantId: string, subject: string, provider: AiProvider) { this.credentials.delete(`${tenantId}:${subject}:${provider}`); }
  public status(tenantId: string, subject: string, now = Date.now()) { return (["OPENAI", "ANTHROPIC"] as const).map((provider) => { const value = this.get(tenantId, subject, provider, now); return { provider, configured: value !== undefined, ...(value === undefined ? {} : { model: value.model, expiresAt: new Date(value.expiresAt).toISOString() }) }; }); }
}

export class InMemoryCommandIdempotencyStore implements CommandIdempotencyStore {
  private readonly entries = new Map<string, { readonly fingerprint: string; readonly body: unknown }>();
  public async execute<T>(input: { readonly tenantId: string; readonly subject: string; readonly operationId: string; readonly key: string; readonly fingerprint: string; readonly createdAt: string }, command: () => Promise<T>) {
    const key = this.key(input); const entry = this.entries.get(key);
    if (entry !== undefined) { if (entry.fingerprint !== input.fingerprint) throw new Error("IDEMPOTENCY_CONFLICT"); return { body: structuredClone(entry.body) as T, replayed: true }; }
    const body = await command(); this.entries.set(key, { fingerprint: input.fingerprint, body: structuredClone(body) }); return { body, replayed: false };
  }
  private key(input: { readonly tenantId: string; readonly subject: string; readonly operationId: string; readonly key: string }) { return `${input.tenantId}:${input.subject}:${input.operationId}:${input.key}`; }
}
