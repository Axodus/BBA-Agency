import { ValidationError } from "../errors/ValidationError.js";

export function isCanonicalTimestamp(value: string): boolean {
  if (typeof value !== "string" || value.length === 0) return false;
  try {
    return new Date(value).toISOString() === value;
  } catch {
    return false;
  }
}

export function assertCanonicalTimestamp(value: string, fieldName = "timestamp"): string {
  if (!isCanonicalTimestamp(value)) {
    throw new ValidationError(`${fieldName} must be a canonical ISO 8601 timestamp`, { fieldName });
  }
  return value;
}
