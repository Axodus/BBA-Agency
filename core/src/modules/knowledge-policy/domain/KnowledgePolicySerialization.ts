import type { JsonObject } from "../../../shared/common/serialization.js";
import { CorrelationId, CausationId } from "../../../shared/common/index.js";
import { EvidenceReference } from "../../../shared/evidence/EvidenceReference.js";
import { EvidenceId } from "../../../shared/identity/EvidenceId.js";
import { LineageReference, type LineageRelationship } from "../../../shared/lineage/LineageReference.js";

export function evidenceFromJSON(value: JsonObject): EvidenceReference {
  return new EvidenceReference({ evidenceId: EvidenceId.from(String(value.evidenceId)), source: String(value.source), type: String(value.type), capturedAt: String(value.capturedAt) });
}

export function lineageFromJSON(value: JsonObject): LineageReference {
  return new LineageReference({ sourceId: String(value.sourceId), targetId: String(value.targetId), relationship: String(value.relationship) as LineageRelationship, declaredAt: String(value.declaredAt) });
}

export function correlationFromJSON(value: string): CorrelationId { return CorrelationId.from(value); }
export function causationFromJSON(value: string | undefined): CausationId | undefined { return value === undefined ? undefined : CausationId.from(value); }
