import type { JsonObject } from "../../../shared/common/serialization.js";
import { stableSerialize } from "../../../shared/common/serialization.js";
import { ValidationError } from "../../../shared/errors/ValidationError.js";
import type { ApprovalSnapshot } from "./Approval.js";
import { DecisionStatus, type DecisionStatusType } from "./DecisionStatus.js";

export const DECISION_SNAPSHOT_SCHEMA_VERSION = 1 as const;
export interface DecisionSnapshot {
  readonly schemaVersion: typeof DECISION_SNAPSHOT_SCHEMA_VERSION;
  readonly decisionId: string; readonly tenantId: string; readonly missionId: string;
  readonly decisionType: string; readonly status: DecisionStatusType;
  readonly authorityReference: JsonObject; readonly assignmentReference: JsonObject | null;
  readonly approval: ApprovalSnapshot | null; readonly version: number;
  readonly evidence: readonly JsonObject[]; readonly lineage: readonly JsonObject[]; readonly audit: JsonObject;
}
function record(value: unknown, field: string): Record<string, unknown> {
  if (value === null || typeof value !== "object" || Array.isArray(value)) throw new ValidationError(`DecisionSnapshot ${field} must be an object`, { field });
  return value as Record<string, unknown>;
}
function required(value: unknown, field: string): string {
  if (typeof value !== "string" || value.trim().length === 0) throw new ValidationError(`DecisionSnapshot ${field} is required`, { field });
  return value;
}
export function parseDecisionSnapshot(value: unknown): DecisionSnapshot {
  const input = record(value, "root");
  if (input.schemaVersion !== DECISION_SNAPSHOT_SCHEMA_VERSION) throw new ValidationError("DecisionSnapshot schema version is not supported");
  const status = required(input.status, "status");
  if (!Object.values(DecisionStatus).includes(status as DecisionStatusType)) throw new ValidationError("DecisionSnapshot status is invalid");
  if (!Number.isSafeInteger(input.version) || Number(input.version) < 0) throw new ValidationError("DecisionSnapshot version is invalid");
  const evidence = input.evidence; const lineage = input.lineage;
  if (!Array.isArray(evidence) || !evidence.every((item) => item !== null && typeof item === "object" && !Array.isArray(item))) throw new ValidationError("DecisionSnapshot evidence is invalid");
  if (!Array.isArray(lineage) || !lineage.every((item) => item !== null && typeof item === "object" && !Array.isArray(item))) throw new ValidationError("DecisionSnapshot lineage is invalid");
  return { schemaVersion: 1, decisionId: required(input.decisionId, "decisionId"), tenantId: required(input.tenantId, "tenantId"), missionId: required(input.missionId, "missionId"), decisionType: required(input.decisionType, "decisionType"), status: status as DecisionStatusType, authorityReference: record(input.authorityReference, "authorityReference") as JsonObject, assignmentReference: input.assignmentReference === null ? null : record(input.assignmentReference, "assignmentReference") as JsonObject, approval: input.approval === null ? null : record(input.approval, "approval") as unknown as ApprovalSnapshot, version: Number(input.version), evidence: evidence as JsonObject[], lineage: lineage as JsonObject[], audit: record(input.audit, "audit") as JsonObject };
}
export function serializeDecisionSnapshot(snapshot: DecisionSnapshot): string { return stableSerialize(snapshot as unknown as JsonObject); }
