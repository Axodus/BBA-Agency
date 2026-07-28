import assert from "node:assert/strict";
import { test } from "node:test";
import { ApplicationCommandRunner, canonicalCommandFingerprint, deriveTransactionId } from "../../src/application/services/ApplicationCommandRunner.js";
import { ApplicationQueryRunner } from "../../src/application/services/ApplicationQueryRunner.js";
import type { ApplicationCommandContext, OperationCommandDto, QueryContext } from "../../src/application/dto/ApplicationContext.js";
import type { CommandTransaction, CommandTransactionFactory, ReadRepositorySession, ReadRepositorySessionFactory, TransactionalRepositorySession } from "../../src/application/services/TransactionalRepositorySession.js";
import type { TransactionOutcome } from "../../src/infrastructure/persistence/PersistencePorts.js";
import type { TransactionContext } from "../../src/infrastructure/persistence/TransactionContext.js";

const context: ApplicationCommandContext = { tenantId: "tenant_test", actor: { reference: "actor_test" }, correlationId: "correlation_test" };
const command: OperationCommandDto = { idempotencyKey: "request_test", reason: "initial intent", payload: { title: "Mission" } };

class FakeTransaction implements CommandTransaction {
  public readonly context: TransactionContext | undefined;
  public readonly repositories = {} as TransactionalRepositorySession;
  public commits = 0;
  public rollbacks = 0;
  public state: TransactionOutcome = "NOT_FOUND";
  public async commit(): Promise<void> { this.commits += 1; this.state = "COMMITTED"; }
  public async rollback(): Promise<void> { this.rollbacks += 1; }
  public outcome(): TransactionOutcome { return this.state; }
}
class FakeTransactions implements CommandTransactionFactory {
  public last: FakeTransaction | undefined;
  public open(): CommandTransaction { this.last = new FakeTransaction(); return this.last; }
}

test("derives stable transaction identity from Tenant, context, operation and key", () => {
  assert.equal(deriveTransactionId(context, "mission", "createMission", "request_test"), deriveTransactionId(context, "mission", "createMission", "request_test"));
  assert.notEqual(deriveTransactionId(context, "mission", "createMission", "request_test"), deriveTransactionId(context, "mission", "renameMission", "request_test"));
});

test("canonical fingerprint includes reason and excludes idempotency key", () => {
  const first = canonicalCommandFingerprint(command);
  const sameIntent = canonicalCommandFingerprint({ ...command, idempotencyKey: "another_key" });
  const differentReason = canonicalCommandFingerprint({ ...command, reason: "different intent" });
  assert.deepEqual(first, sameIntent); assert.notDeepEqual(first, differentReason); assert.equal(first.algorithm, "application-command-canonical-v1"); assert.equal(first.hashAlgorithm, "sha256");
});

test("command runner validates before opening a transaction and commits successful handlers", async () => {
  const transactions = new FakeTransactions(); const runner = new ApplicationCommandRunner(transactions);
  const result = await runner.execute("mission", "createMission", command, context, async (input) => ({ value: input.payload.title as string }));
  assert.deepEqual(result, { value: "Mission" }); assert.equal(transactions.last?.commits, 1); assert.equal(transactions.last?.rollbacks, 0);
});

test("command failure rolls back and does not expose internal error details", async () => {
  const transactions = new FakeTransactions(); const runner = new ApplicationCommandRunner(transactions);
  await assert.rejects(() => runner.execute("mission", "createMission", command, context, async () => { throw new Error("secret provider detail"); }), (error: { code: string; toJSON(): Record<string, unknown> }) => {
    assert.equal(error.code, "APPLICATION_FAILURE"); assert.equal(error.toJSON().message, "Application command failed"); return true;
  });
  assert.equal(transactions.last?.commits, 0); assert.equal(transactions.last?.rollbacks, 1);
});

test("query runner uses a read session and never opens a transaction", async () => {
  let opened = 0; const session: ReadRepositorySession = { mission: {} as ReadRepositorySession["mission"], authority: {} as ReadRepositorySession["authority"], decision: {} as ReadRepositorySession["decision"], agent: {} as ReadRepositorySession["agent"], execution: {} as ReadRepositorySession["execution"], asset: {} as ReadRepositorySession["asset"], knowledge: {} as ReadRepositorySession["knowledge"], policy: {} as ReadRepositorySession["policy"] };
  const sessions: ReadRepositorySessionFactory = { open: () => { opened += 1; return session; } };
  const runner = new ApplicationQueryRunner(sessions); const queryContext: QueryContext = { tenantId: "tenant_test", correlationId: "correlation_test" };
  const result = await runner.execute({ targetId: "mission_test" }, queryContext, async (query) => ({ id: query.targetId }));
  assert.deepEqual(result, { id: "mission_test" }); assert.equal(opened, 1);
});
