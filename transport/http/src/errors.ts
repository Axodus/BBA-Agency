export type TransportErrorCode =
  | "INVALID_REQUEST"
  | "INVALID_TRANSACTION_IDENTITY"
  | "UNAUTHENTICATED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "IDEMPOTENCY_CONFLICT"
  | "CONCURRENCY_CONFLICT"
  | "APPLICATION_FAILURE"
  | "INFRASTRUCTURE_FAILURE"
  | "INTERNAL_FAILURE";

export class TransportError extends Error {
  public constructor(
    public readonly code: TransportErrorCode,
    public readonly statusCode: number,
    message: string,
    public readonly details: Readonly<Record<string, string>> = {},
    options?: { readonly cause?: unknown }
  ) {
    super(message, options);
    this.name = "TransportError";
  }
}

export class TransportAuthenticationError extends TransportError {
  public constructor(message = "Authentication failed") { super("UNAUTHENTICATED", 401, message); }
}

export class TransportInfrastructureError extends TransportError {
  public constructor(message = "Transport infrastructure failed", options?: { readonly cause?: unknown }) { super("INFRASTRUCTURE_FAILURE", 500, message, {}, options); }
}
