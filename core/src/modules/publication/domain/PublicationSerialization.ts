import { EvidenceReference } from "../../../shared/evidence/EvidenceReference.js";
import { EvidenceId } from "../../../shared/identity/EvidenceId.js";
import { LineageReference, type LineageRelationship } from "../../../shared/lineage/LineageReference.js";

export function evidenceFromJSON(value: { readonly evidenceId: string; readonly source: string; readonly type: string; readonly capturedAt: string; readonly locator?: string; readonly limitation?: string }): EvidenceReference {
  return new EvidenceReference({
    evidenceId: EvidenceId.from(value.evidenceId), source: value.source, type: value.type,
    capturedAt: value.capturedAt, ...(value.locator === undefined ? {} : { locator: value.locator }),
    ...(value.limitation === undefined ? {} : { limitation: value.limitation })
  });
}

export function lineageFromJSON(value: { readonly sourceId: string; readonly targetId: string; readonly relationship: string; readonly declaredAt: string; readonly reason?: string }): LineageReference {
  return new LineageReference({
    sourceId: value.sourceId, targetId: value.targetId, relationship: value.relationship as LineageRelationship,
    declaredAt: value.declaredAt, ...(value.reason === undefined ? {} : { reason: value.reason })
  });
}
