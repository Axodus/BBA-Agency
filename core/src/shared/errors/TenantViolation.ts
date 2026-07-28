import { DomainError } from "./DomainError.js";

export class TenantViolation extends DomainError {
  public constructor(message: string, details: Record<string, string> = {}) {
    super("tenant_violation", message, details);
  }
}
