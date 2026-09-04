import { useCallback, useRef, useState } from "react";
import { BbaSdkError } from "../errors/BbaSdkError.js";
import { CommandOutcomeUnknownError, type CommandExecutionState, type CommandIntent, type CommandReceipt } from "./command-types.js";

function freeze<T>(value: T): Readonly<T> {
  const clone = structuredClone(value);
  if (clone !== null && typeof clone === "object") Object.freeze(clone);
  return clone;
}

export interface CommandIntentController<TPayload> {
  readonly state: CommandExecutionState<TPayload>;
  submit(payload: TPayload, reason: string, options?: { readonly correlationId?: string; readonly causationId?: string }): Promise<void>;
  retry(): Promise<void>;
  edited(): void;
  reset(): void;
}

export function useCommandIntent<TPayload>(execute: (intent: CommandIntent<TPayload>) => Promise<CommandReceipt>): CommandIntentController<TPayload> {
  const [state, setState] = useState<CommandExecutionState<TPayload>>({ status: "EDITING" });
  const intent = useRef<CommandIntent<TPayload> | undefined>(undefined); const submitting = useRef(false);
  const run = useCallback(async (candidate: CommandIntent<TPayload>) => {
    if (submitting.current) return; submitting.current = true; setState({ status: "SUBMITTING", intent: candidate });
    try { const receipt = await execute(candidate); setState({ status: "COMMITTED", intent: candidate, receipt }); }
    catch (error) { if (error instanceof CommandOutcomeUnknownError) setState({ status: "OUTCOME_UNKNOWN", intent: candidate, message: error.message }); else setState({ status: "REJECTED", intent: candidate, message: error instanceof BbaSdkError ? error.message : "A operação foi rejeitada." }); }
    finally { submitting.current = false; }
  }, [execute]);
  const submit = useCallback(async (payload: TPayload, reason: string, options: { readonly correlationId?: string; readonly causationId?: string } = {}) => {
    const candidate: CommandIntent<TPayload> = { reason, idempotencyKey: crypto.randomUUID(), payload: freeze(payload), ...(options.correlationId === undefined ? {} : { correlationId: options.correlationId }), ...(options.causationId === undefined ? {} : { causationId: options.causationId }) };
    intent.current = candidate; await run(candidate);
  }, [run]);
  const retry = useCallback(async () => { if (intent.current !== undefined && (state.status === "REJECTED" || state.status === "OUTCOME_UNKNOWN")) await run(intent.current); }, [run, state.status]);
  const edited = useCallback(() => { if (state.status === "REJECTED" || state.status === "OUTCOME_UNKNOWN") { intent.current = undefined; setState({ status: "EDITING" }); } }, [state.status]);
  const reset = useCallback(() => { intent.current = undefined; setState({ status: "EDITING" }); }, []);
  return { state, submit, retry, edited, reset };
}
