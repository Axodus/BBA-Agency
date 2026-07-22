import type { JsonObject } from "../../../shared/common/serialization.js";
import { stableSerialize } from "../../../shared/common/serialization.js";
import { ValidationError } from "../../../shared/errors/ValidationError.js";
import { isMissionStatus, type MissionStatus } from "./MissionStatus.js";

export const MISSION_SNAPSHOT_SCHEMA_VERSION = 1 as const;

export interface MissionSnapshot {
  readonly schemaVersion: typeof MISSION_SNAPSHOT_SCHEMA_VERSION;
  readonly missionId: string;
  readonly tenantId: string;
  readonly status: MissionStatus;
  readonly metadata: JsonObject;
  readonly intent: JsonObject;
  readonly version: number;
  readonly evidence: readonly JsonObject[];
  readonly lineage: readonly JsonObject[];
  readonly outcome: JsonObject | null;
  readonly pausedFrom: MissionStatus | null;
  readonly statusReason: string | null;
  readonly archivedAt: string | null;
  readonly authorityReferences: readonly JsonObject[];
  readonly decisionReferences: readonly JsonObject[];
  readonly approvalReferences: readonly JsonObject[];
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function requireString(record: Record<string, unknown>, field: string): string {
  const value = record[field];
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new ValidationError(`MissionSnapshot ${field} must be a non-empty string`, { field });
  }
  return value;
}

function requireObject(record: Record<string, unknown>, field: string): JsonObject {
  const value = record[field];
  if (!isRecord(value)) throw new ValidationError(`MissionSnapshot ${field} must be an object`, { field });
  return value as JsonObject;
}

function requireObjectArray(record: Record<string, unknown>, field: string): readonly JsonObject[] {
  const value = record[field];
  if (!Array.isArray(value) || !value.every(isRecord)) {
    throw new ValidationError(`MissionSnapshot ${field} must be an object array`, { field });
  }
  return value as JsonObject[];
}

function optionalObjectArray(record: Record<string, unknown>, field: string): readonly JsonObject[] {
  if (record[field] === undefined) return [];
  return requireObjectArray(record, field);
}

function optionalStatus(record: Record<string, unknown>, field: string): MissionStatus | null {
  const value = record[field];
  if (value === null) return null;
  if (typeof value !== "string" || !isMissionStatus(value)) {
    throw new ValidationError(`MissionSnapshot ${field} is not a canonical Mission status`, { field });
  }
  return value;
}

export function parseMissionSnapshot(value: unknown): MissionSnapshot {
  if (!isRecord(value)) throw new ValidationError("MissionSnapshot must be an object");
  if (value.schemaVersion !== MISSION_SNAPSHOT_SCHEMA_VERSION) {
    throw new ValidationError("MissionSnapshot schema version is not supported", {
      schemaVersion: String(value.schemaVersion)
    });
  }
  const status = requireString(value, "status");
  if (!isMissionStatus(status)) {
    throw new ValidationError("MissionSnapshot status is not canonical", { status });
  }
  if (!Number.isSafeInteger(value.version) || (value.version as number) < 1) {
    throw new ValidationError("MissionSnapshot version must be a positive safe integer");
  }
  const outcomeValue = value.outcome;
  const outcome = outcomeValue === null ? null : requireObject(value, "outcome");
  const statusReasonValue = value.statusReason;
  const archivedAtValue = value.archivedAt;
  if (statusReasonValue !== null && typeof statusReasonValue !== "string") {
    throw new ValidationError("MissionSnapshot statusReason must be a string or null");
  }
  if (archivedAtValue !== null && typeof archivedAtValue !== "string") {
    throw new ValidationError("MissionSnapshot archivedAt must be a string or null");
  }
  return {
    schemaVersion: MISSION_SNAPSHOT_SCHEMA_VERSION,
    missionId: requireString(value, "missionId"),
    tenantId: requireString(value, "tenantId"),
    status,
    metadata: requireObject(value, "metadata"),
    intent: requireObject(value, "intent"),
    version: value.version as number,
    evidence: requireObjectArray(value, "evidence"),
    lineage: requireObjectArray(value, "lineage"),
    outcome,
    pausedFrom: optionalStatus(value, "pausedFrom"),
    statusReason: statusReasonValue,
    archivedAt: archivedAtValue,
    authorityReferences: optionalObjectArray(value, "authorityReferences"),
    decisionReferences: optionalObjectArray(value, "decisionReferences"),
    approvalReferences: optionalObjectArray(value, "approvalReferences")
  };
}

export function serializeMissionSnapshot(snapshot: MissionSnapshot): string {
  return stableSerialize(snapshot as unknown as JsonObject);
}
