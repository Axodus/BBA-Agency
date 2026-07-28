import { DomainError } from "./DomainError.js";

export class ValidationError extends DomainError {
  public constructor(message: string, details: Record<string, string> = {}) {
    super("validation_error", message, details);
  }
}
