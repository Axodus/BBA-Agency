import type { QueryClient } from "@tanstack/react-query";
import { BbaSdkError, normalizeSdkError } from "../errors/BbaSdkError.js";
import type { ReadySdkRuntime } from "../provider/BbaSdkProvider.js";
import { invalidateCommittedCommand, type InvalidationResourceIds } from "./invalidation-policy.js";
import { CommandOutcomeUnknownError, type CommandIntent, type CommandReceipt } from "./command-types.js";

export interface GeneratedCommandResponse {
  readonly data?: { readonly data?: { readonly transactionId?: unknown; readonly resourceReferences?: unknown }; readonly meta?: { readonly correlationId?: unknown } } | undefined;
  readonly error?: unknown | undefined;
  readonly response?: Response;
}

export async function executeCommand<TPayload>(runtime: ReadySdkRuntime, queryClient: QueryClient, operationId: string, intent: CommandIntent<TPayload>, call: () => Promise<GeneratedCommandResponse>, ids: InvalidationResourceIds): Promise<CommandReceipt> {
  let response: GeneratedCommandResponse;
  try { response = await call(); } catch { throw new CommandOutcomeUnknownError(); }
  if (response.error !== undefined) throw normalizeSdkError(response.response?.status, response.error);
  const result = response.data?.data; const transactionId = result?.transactionId; const correlationId = response.data?.meta?.correlationId;
  if (typeof transactionId !== "string" || typeof correlationId !== "string" || !Array.isArray(result?.resourceReferences)) throw new CommandOutcomeUnknownError("O servidor respondeu sem um receipt público válido.");
  const resourceReferences = result.resourceReferences.map((value) => { const item = value as { readonly resourceType?: unknown; readonly resourceId?: unknown }; if (typeof item.resourceType !== "string" || typeof item.resourceId !== "string") throw new CommandOutcomeUnknownError("O receipt contém referências inválidas."); return { type: item.resourceType, id: item.resourceId }; });
  await invalidateCommittedCommand(queryClient, operationId, runtime.tenantId, ids);
  return { operationId, transactionId, idempotencyKey: intent.idempotencyKey, correlationId, ...(intent.causationId === undefined ? {} : { causationId: intent.causationId }), resourceReferences };
}

export function commandHeaders(runtime: ReadySdkRuntime, intent: CommandIntent<unknown>) {
  return { "X-Tenant-Id": runtime.tenantId, "Idempotency-Key": intent.idempotencyKey, ...(intent.correlationId === undefined ? {} : { "X-Correlation-Id": intent.correlationId }), ...(intent.causationId === undefined ? {} : { "X-Causation-Id": intent.causationId }) };
}

export function requireReady(runtime: ReadySdkRuntime | null): ReadySdkRuntime {
  if (runtime === null) throw new BbaSdkError("CONFIGURATION_MISSING", "O SDK ainda não está configurado.", undefined, undefined, undefined);
  return runtime;
}
