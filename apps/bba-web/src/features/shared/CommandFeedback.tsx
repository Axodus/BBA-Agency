import type { CommandExecutionState } from "@bba/sdk-react";
import { Alert, Button } from "@bba/ui";

export function CommandFeedback<T>({ state, onRetry }: { readonly state: CommandExecutionState<T>; onRetry(): void }) {
  if (state.status !== "REJECTED" && state.status !== "OUTCOME_UNKNOWN") return null;
  return <Alert title={state.status === "OUTCOME_UNKNOWN" ? "Resultado desconhecido" : "Operação rejeitada"}><p>{state.message}</p><Button onClick={onRetry} type="button" variant="secondary">Repetir a mesma tentativa</Button></Alert>;
}
