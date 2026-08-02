export type DomainErrorCode =
  | "domain_error"
  | "validation_error"
  | "invariant_violation"
  | "tenant_violation"
  | "concurrency_conflict"
  | "persistence_failure"
  | "persistence_conflict"
  | "post_commit_failure";

export abstract class DomainError extends Error {
  public readonly code: DomainErrorCode;
  public readonly details: Readonly<Record<string, string>>;

  protected constructor(code: DomainErrorCode, message: string, details: Record<string, string> = {}) {
    super(message);
    this.name = new.target.name;
    this.code = code;
    this.details = Object.freeze({ ...details });
    Object.setPrototypeOf(this, new.target.prototype);
  }

  public toJSON(): { readonly name: string; readonly code: DomainErrorCode; readonly message: string; readonly details: Readonly<Record<string, string>> } {
    return { name: this.name, code: this.code, message: this.message, details: this.details };
  }
}
