import { ApplicationError } from "../errors/ApplicationError.js";
import type { ApplicationCommandContext, MutableCommandDto, QueryContext } from "../dto/ApplicationContext.js";

function required(value: string | undefined, field: string): string {
  if (value === undefined || value.trim().length === 0) throw new ApplicationError("VALIDATION_FAILED", `${field} is required`, { field });
  return value.trim();
}

export function validateCommandContext(context: ApplicationCommandContext): void {
  required(context.tenantId, "tenantId");
  required(context.actor.reference, "actor.reference");
  required(context.correlationId, "correlationId");
  if (context.causationId !== undefined) required(context.causationId, "causationId");
}

export function validateQueryContext(context: QueryContext): void {
  required(context.tenantId, "tenantId");
  required(context.correlationId, "correlationId");
  if (context.actor !== undefined) required(context.actor.reference, "actor.reference");
}

export function validateMutableCommand(command: MutableCommandDto): void {
  required(command.idempotencyKey, "idempotencyKey");
  required(command.reason, "reason");
}
