import { DomainError } from "./DomainError.js";

export class ConcurrencyConflict extends DomainError {
  public constructor(message: string, details: Record<string, string> = {}) {
    super("concurrency_conflict", message, details);
  }
}
