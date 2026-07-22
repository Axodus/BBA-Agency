import type { JsonObject } from "../../../shared/common/serialization.js";
import { stableSerialize } from "../../../shared/common/serialization.js";
import { ValidationError } from "../../../shared/errors/ValidationError.js";
import type { AssignmentSnapshot } from "./Assignment.js";
import { isAuthorityStatus, type AuthorityStatusType } from "./AuthorityStatus.js";

export const AUTHORITY_SNAPSHOT_SCHEMA_VERSION = 1 as const;

export interface AuthoritySnapshot {
  readonly schemaVersion: typeof AUTHORITY_SNAPSHOT_SCHEMA_VERSION;
  readonly authorityId: string;
  readonly tenantId: string;
  readonly actorReference: string;
  readonly level: string;
  readonly scope: JsonObject;
  readonly status: AuthorityStatusType;
  readonly suspension: { readonly until: string; readonly reason: string } | null;
  readonly version: number;
  readonly evidence: readonly JsonObject[];
  readonly lineage: readonly JsonObject[];
  readonly audit: JsonObject;
  readonly assignments: readonly AssignmentSnapshot[];
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}
function object(value: unknown, field: string): JsonObject {
  if (!isRecord(value)) throw new ValidationError(`AuthoritySnapshot ${field} must be an object`, { field });
  return value as JsonObject;
}
function string(value: unknown, field: string): string {
  if (typeof value !== "string" || value.trim().length === 0) throw new ValidationError(`AuthoritySnapshot ${field} is required`, { field });
  return value;
}

export function parseAuthoritySnapshot(value: unknown): AuthoritySnapshot {
  if (!isRecord(value)) throw new ValidationError("AuthoritySnapshot must be an object");
  if (value.schemaVersion !== AUTHORITY_SNAPSHOT_SCHEMA_VERSION) throw new ValidationError("AuthoritySnapshot schema version is not supported");
  const status = string(value.status, "status");
  if (!isAuthorityStatus(status)) throw new ValidationError("AuthoritySnapshot status is invalid");
  if (!Number.isSafeInteger(value.version) || Number(value.version) < 0) throw new ValidationError("AuthoritySnapshot version is invalid");
  if (!Array.isArray(value.evidence) || !value.evidence.every(isRecord)) throw new ValidationError("AuthoritySnapshot evidence is invalid");
  if (!Array.isArray(value.lineage) || !value.lineage.every(isRecord)) throw new ValidationError("AuthoritySnapshot lineage is invalid");
  if (!Array.isArray(value.assignments) || !value.assignments.every(isRecord)) throw new ValidationError("AuthoritySnapshot assignments are invalid");
  const suspension = value.suspension === null ? null : object(value.suspension, "suspension");
  return {
    schemaVersion: AUTHORITY_SNAPSHOT_SCHEMA_VERSION,
    authorityId: string(value.authorityId, "authorityId"), tenantId: string(value.tenantId, "tenantId"),
    actorReference: string(value.actorReference, "actorReference"), level: string(value.level, "level"),
    scope: object(value.scope, "scope"), status, suspension: suspension === null ? null : {
      until: string(suspension.until, "suspension.until"), reason: string(suspension.reason, "suspension.reason")
    }, version: Number(value.version), evidence: value.evidence as JsonObject[], lineage: value.lineage as JsonObject[],
    audit: object(value.audit, "audit"), assignments: value.assignments as unknown as AssignmentSnapshot[]
  };
}

export function serializeAuthoritySnapshot(snapshot: AuthoritySnapshot): string {
  return stableSerialize(snapshot as unknown as JsonObject);
}
