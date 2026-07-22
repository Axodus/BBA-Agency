import type { JsonObject } from "../../../shared/common/index.js";
import { EvidenceReference } from "../../../shared/evidence/EvidenceReference.js";
import { EvidenceId } from "../../../shared/identity/EvidenceId.js";
import { LineageReference, type LineageRelationship } from "../../../shared/lineage/LineageReference.js";

export function evidenceFromJSON(value: JsonObject): EvidenceReference {
  return new EvidenceReference({
    evidenceId: EvidenceId.from(String(value.evidenceId)), source: String(value.source),
    type: String(value.type), capturedAt: String(value.capturedAt),
    ...(typeof value.locator === "string" ? { locator: value.locator } : {}),
    ...(typeof value.limitation === "string" ? { limitation: value.limitation } : {})
  });
}

export function lineageFromJSON(value: JsonObject): LineageReference {
  return new LineageReference({
    sourceId: String(value.sourceId), targetId: String(value.targetId),
    relationship: String(value.relationship) as LineageRelationship,
    declaredAt: String(value.declaredAt),
    ...(typeof value.reason === "string" ? { reason: value.reason } : {})
  });
}
