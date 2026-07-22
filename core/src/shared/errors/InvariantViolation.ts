import { DomainError } from "./DomainError.js";

export class InvariantViolation extends DomainError {
  public constructor(message: string, details: Record<string, string> = {}) {
    super("invariant_violation", message, details);
  }
}
