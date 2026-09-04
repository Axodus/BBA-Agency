export interface CommandIntent<TPayload> {
  readonly reason: string;
  readonly idempotencyKey: string;
  readonly correlationId?: string;
  readonly causationId?: string;
  readonly payload: Readonly<TPayload>;
}

export interface CommandReceipt {
  readonly operationId: string;
  readonly transactionId: string;
  readonly idempotencyKey: string;
  readonly correlationId: string;
  readonly causationId?: string;
  readonly resourceReferences: readonly { readonly type: string; readonly id: string }[];
}

export type CommandExecutionState<TPayload> =
  | { readonly status: "EDITING" }
  | { readonly status: "SUBMITTING"; readonly intent: CommandIntent<TPayload> }
  | { readonly status: "REJECTED"; readonly intent: CommandIntent<TPayload>; readonly message: string }
  | { readonly status: "OUTCOME_UNKNOWN"; readonly intent: CommandIntent<TPayload>; readonly message: string }
  | { readonly status: "COMMITTED"; readonly intent: CommandIntent<TPayload>; readonly receipt: CommandReceipt };

export class CommandOutcomeUnknownError extends Error {
  public constructor(message = "Não foi possível confirmar o resultado da operação.") { super(message); this.name = "CommandOutcomeUnknownError"; }
}
