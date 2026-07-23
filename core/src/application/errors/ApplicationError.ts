export type ApplicationErrorCode = "VALIDATION_FAILED" | "INVALID_TRANSACTION_IDENTITY" | "IDEMPOTENCY_CONFLICT" | "NOT_FOUND" | "FORBIDDEN_CONTEXT" | "CONCURRENCY_CONFLICT" | "APPLICATION_FAILURE";

export class ApplicationError extends Error {
  public constructor(public readonly code: ApplicationErrorCode, message: string, public readonly details: Readonly<Record<string, string>> = {}, public readonly correlationId?: string, options?: { readonly cause?: unknown }) {
    super(message, options);
    this.name = "ApplicationError";
  }
  public toJSON(): Record<string, unknown> { return { code: this.code, message: this.message, details: this.details, ...(this.correlationId === undefined ? {} : { correlationId: this.correlationId }) }; }
}
