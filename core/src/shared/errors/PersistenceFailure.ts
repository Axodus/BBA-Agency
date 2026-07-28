import { DomainError } from "./DomainError.js";

export class PersistenceFailure extends DomainError {
  public constructor(message: string, details: Record<string, string> = {}) { super("persistence_failure", message, details); }
}
