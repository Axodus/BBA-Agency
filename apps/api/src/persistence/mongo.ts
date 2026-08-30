import type { CommandIdempotencyStore } from "@bba/agency-runtime-http";
import type { PublisherProject, PublisherProjectRepository } from "@bba/publisher-prototype";
import { AsyncLocalStorage } from "node:async_hooks";
import type { ClientSession, Db, MongoClient } from "mongodb";

interface StoredProject {
  readonly tenantId: string;
  readonly projectId: string;
  readonly subject: string;
  readonly updatedAt: string;
  readonly project: PublisherProject;
}

interface StoredIdempotency {
  readonly tenantId: string;
  readonly subject: string;
  readonly operationId: string;
  readonly key: string;
  readonly fingerprint: string;
  readonly body: unknown;
  readonly createdAt: Date;
  readonly expiresAt: Date;
}

function sessionOption(session: ClientSession | undefined) { return session === undefined ? {} : { session }; }

export class MongoPublisherProjectRepository implements PublisherProjectRepository {
  public constructor(private readonly database: Db, private readonly sessions: AsyncLocalStorage<ClientSession>) {}
  public async initialize() {
    await this.database.collection<StoredProject>("agency_projects").createIndex({ tenantId: 1, projectId: 1 }, { unique: true, name: "tenant_project" });
    await this.database.collection<StoredProject>("agency_projects").createIndex({ tenantId: 1, subject: 1, updatedAt: -1 }, { name: "tenant_subject_updated" });
  }
  public async get(tenantId: string, projectId: string) { const found = await this.database.collection<StoredProject>("agency_projects").findOne({ tenantId, projectId }, sessionOption(this.sessions.getStore())); return found === null ? undefined : structuredClone(found.project); }
  public async list(tenantId: string, subject: string) { const rows = await this.database.collection<StoredProject>("agency_projects").find({ tenantId, subject }, sessionOption(this.sessions.getStore())).sort({ updatedAt: -1 }).toArray(); return rows.map((row) => structuredClone(row.project)); }
  public async save(project: PublisherProject) { await this.database.collection<StoredProject>("agency_projects").updateOne({ tenantId: project.tenantId, projectId: project.projectId }, { $set: { tenantId: project.tenantId, projectId: project.projectId, subject: project.subject, updatedAt: project.updatedAt, project: structuredClone(project) } }, { upsert: true, ...sessionOption(this.sessions.getStore()) }); }
}

export class MongoCommandIdempotencyStore implements CommandIdempotencyStore {
  public constructor(private readonly client: MongoClient, private readonly database: Db, private readonly sessions: AsyncLocalStorage<ClientSession>, private readonly retentionHours = 24) {}
  public async initialize() {
    await this.database.collection<StoredIdempotency>("agency_idempotency").createIndex({ tenantId: 1, subject: 1, operationId: 1, key: 1 }, { unique: true, name: "command_key" });
    await this.database.collection<StoredIdempotency>("agency_idempotency").createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0, name: "expiry" });
  }
  public async execute<T>(input: { readonly tenantId: string; readonly subject: string; readonly operationId: string; readonly key: string; readonly fingerprint: string; readonly createdAt: string }, command: () => Promise<T>) {
    const result = await this.client.withSession((session) => session.withTransaction(() => this.sessions.run(session, async () => {
      const filter = { tenantId: input.tenantId, subject: input.subject, operationId: input.operationId, key: input.key };
      const previous = await this.database.collection<StoredIdempotency>("agency_idempotency").findOne(filter, { session });
      if (previous !== null) { if (previous.fingerprint !== input.fingerprint) throw new Error("IDEMPOTENCY_CONFLICT"); return { body: structuredClone(previous.body) as T, replayed: true as const }; }
      const body = await command(); const createdAt = new Date(input.createdAt);
      await this.database.collection<StoredIdempotency>("agency_idempotency").insertOne({ ...filter, fingerprint: input.fingerprint, body: structuredClone(body), createdAt, expiresAt: new Date(createdAt.getTime() + this.retentionHours * 3_600_000) }, { session });
      return { body, replayed: false as const };
    })));
    if (result === undefined) throw new Error("IDEMPOTENCY_TRANSACTION_ABORTED");
    return result;
  }
}

export function createMongoPersistence(client: MongoClient, database: Db) {
  const sessions = new AsyncLocalStorage<ClientSession>();
  return { projects: new MongoPublisherProjectRepository(database, sessions), idempotency: new MongoCommandIdempotencyStore(client, database, sessions) };
}
