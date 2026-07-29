import { DomainError } from "./DomainError.js";

export class PersistenceConflict extends DomainError {
  public constructor(message: string, details: Record<string, string> = {}) { super("persistence_conflict", message, details); }
}
