import { createHash } from "node:crypto";
import { deterministicHash, stableSerialize, type JsonObject } from "../../shared/common/serialization.js";
import { ApplicationError } from "../errors/ApplicationError.js";
import type { ApplicationCommandContext, MutableCommandDto } from "../dto/ApplicationContext.js";
import { validateCommandContext, validateMutableCommand } from "../validation/ApplicationValidation.js";
import { TransactionContext } from "../../infrastructure/persistence/TransactionContext.js";
import type { CanonicalPayloadDescriptor } from "../../infrastructure/persistence/PersistenceTypes.js";
import type { CommandTransactionFactory, TransactionalRepositorySession } from "./TransactionalRepositorySession.js";

export interface ValidatedCommandContext extends ApplicationCommandContext { readonly transactionId: string; readonly payloadFingerprint: CanonicalPayloadDescriptor; }
export type CommandHandler<C extends MutableCommandDto, R> = (command: C, context: ValidatedCommandContext, repositories: TransactionalRepositorySession) => Promise<R>;

export function canonicalCommandFingerprint(command: MutableCommandDto & { readonly payload: JsonObject; readonly targetId?: string }): CanonicalPayloadDescriptor {
  const canonicalPayload = stableSerialize({ reason: command.reason, ...(command.targetId === undefined ? {} : { targetId: command.targetId }), payload: command.payload });
  return { algorithm: "application-command-canonical-v1", hashAlgorithm: "sha256", fingerprint: createHash("sha256").update(canonicalPayload).digest("hex") };
}

export function deriveTransactionId(context: ApplicationCommandContext, boundedContext: string, operationName: string, idempotencyKey: string): string {
  return `transaction_${deterministicHash(`${context.tenantId}|${boundedContext}|${operationName}|${idempotencyKey}`)}`;
}

function mapFailure(error: unknown, correlationId: string): ApplicationError {
  if (error instanceof ApplicationError) return error;
  const candidate = error as { readonly code?: string; readonly message?: string };
  if (candidate.code === "concurrency_conflict" || candidate.code === "persistence_conflict") return new ApplicationError("CONCURRENCY_CONFLICT", "Optimistic concurrency conflict", {}, correlationId, { cause: error });
  if (candidate.code === "validation_error" || candidate.code === "invariant_violation" || candidate.code === "tenant_violation" || candidate.code === "persistence_failure") return new ApplicationError("VALIDATION_FAILED", candidate.message ?? "Application validation failed", {}, correlationId, { cause: error });
  return new ApplicationError("APPLICATION_FAILURE", "Application command failed", {}, correlationId, { cause: error });
}

export interface CommandReplay<C, R> { resolve(transactionId: string, command: C, context: ApplicationCommandContext): Promise<R>; }

export class ApplicationCommandRunner {
  public constructor(private readonly transactions: CommandTransactionFactory) {}
  public async execute<C extends MutableCommandDto & { readonly payload: JsonObject }, R>(boundedContext: string, operationName: string, command: C, context: ApplicationCommandContext, handler: CommandHandler<C, R>, replay?: CommandReplay<C, R>): Promise<R> {
    validateCommandContext(context); validateMutableCommand(command);
    const fingerprint = canonicalCommandFingerprint(command);
    const transactionId = deriveTransactionId(context, boundedContext, operationName, command.idempotencyKey);
    const inspected = this.transactions.inspect?.(transactionId);
    if (inspected?.outcome === "COMMITTED") {
      if (inspected.fingerprint?.fingerprint !== fingerprint.fingerprint) throw new ApplicationError("IDEMPOTENCY_CONFLICT", "Idempotency key was already committed with different content", {}, context.correlationId);
      if (replay === undefined) throw new ApplicationError("APPLICATION_FAILURE", "Committed operation has no replay resolver", {}, context.correlationId);
      return replay.resolve(transactionId, command, context);
    }
    const validated = Object.freeze({ ...context, transactionId, payloadFingerprint: fingerprint });
    const persistenceContext = new TransactionContext({ transactionId, tenantId: context.tenantId, actor: context.actor.reference, correlationId: context.correlationId, ...(context.causationId === undefined ? {} : { causationId: context.causationId }), startedAt: new Date().toISOString() });
    const transaction = this.transactions.open(persistenceContext);
    let handlerResult: R | undefined;
    try {
      handlerResult = await handler(command, validated, transaction.repositories);
      await transaction.commit(fingerprint);
      return handlerResult;
    } catch (error) {
      const outcome = transaction.outcome();
      if (handlerResult !== undefined && outcome === "COMMITTED") return handlerResult;
      if (outcome !== "UNKNOWN" && outcome !== "COMMITTED") {
        try { await transaction.rollback(); } catch (rollbackError) { throw mapFailure(rollbackError, context.correlationId); }
      }
      if (outcome === "COMMITTED" && handlerResult === undefined) throw new ApplicationError("IDEMPOTENCY_CONFLICT", "Idempotency key was already committed with different content", {}, context.correlationId, { cause: error });
      if (outcome === "UNKNOWN") throw new ApplicationError("APPLICATION_FAILURE", "Transaction outcome is unknown; automatic retry is prohibited", {}, context.correlationId, { cause: error });
      throw mapFailure(error, context.correlationId);
    }
  }
}
