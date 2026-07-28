export type BbaSdkErrorCode = "CONFIGURATION_MISSING" | "UNAUTHENTICATED" | "FORBIDDEN" | "NOT_FOUND" | "CONFLICT" | "APPLICATION_FAILURE" | "SESSION_ERROR" | "UNKNOWN";

export class BbaSdkError extends Error {
  public constructor(
    public readonly code: BbaSdkErrorCode,
    message: string,
    public readonly status: number | undefined,
    public readonly requestId: string | undefined,
    public readonly correlationId: string | undefined
  ) { super(message); this.name = "BbaSdkError"; }
  public get retryable(): boolean { return false; }
}

function text(value: unknown): string | undefined { return typeof value === "string" && value.trim() ? value : undefined; }
function record(value: unknown): Record<string, unknown> { return value !== null && typeof value === "object" ? value as Record<string, unknown> : {}; }

export function normalizeSdkError(status: number | undefined, payload: unknown): BbaSdkError {
  const envelope = record(payload); const body = record(envelope.error);
  const message = text(body.message) ?? "A operação não pôde ser concluída.";
  const code = status === 401 ? "UNAUTHENTICATED" : status === 403 ? "FORBIDDEN" : status === 404 ? "NOT_FOUND" : status === 409 ? "CONFLICT" : status === 500 ? "APPLICATION_FAILURE" : "UNKNOWN";
  return new BbaSdkError(code, message, status, text(body.requestId), text(body.correlationId));
}
