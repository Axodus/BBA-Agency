import { assertCanonicalTimestamp } from "../../../shared/common/timestamps.js";
import type { JsonObject } from "../../../shared/common/serialization.js";
import { InvariantViolation } from "../../../shared/errors/InvariantViolation.js";
import { ValidationError } from "../../../shared/errors/ValidationError.js";
import type { EvidenceReference } from "../../../shared/evidence/EvidenceReference.js";
import type { LineageReference } from "../../../shared/lineage/LineageReference.js";
import { AssetReference, AssetVersionReference, KnowledgeReference, PolicyReference } from "../../../shared/references/index.js";
import { ValueObject } from "../../../shared/valueobject/ValueObject.js";
import { evidenceFromJSON, lineageFromJSON } from "./KnowledgePolicySerialization.js";

export type KnowledgeRelationshipType = "SUPPORTS" | "EXPLAINS" | "SUMMARIZES" | "IMPLEMENTS";
export type KnowledgeRelationshipTarget = AssetReference | AssetVersionReference | PolicyReference;
export interface KnowledgeRelationshipProps { readonly source: KnowledgeReference; readonly target: KnowledgeRelationshipTarget; readonly type: KnowledgeRelationshipType; readonly rationale: string; readonly evidence: readonly EvidenceReference[]; readonly lineage: readonly LineageReference[]; readonly createdAt: string; }
const TYPES = new Set<KnowledgeRelationshipType>(["SUPPORTS", "EXPLAINS", "SUMMARIZES", "IMPLEMENTS"]);

function targetKind(target: KnowledgeRelationshipTarget): "asset" | "asset_version" | "policy" {
  if (target instanceof AssetVersionReference) return "asset_version";
  if (target instanceof AssetReference) return "asset";
  return "policy";
}

export class KnowledgeRelationship extends ValueObject<JsonObject> {
  public readonly source: KnowledgeReference; public readonly target: KnowledgeRelationshipTarget; public readonly type: KnowledgeRelationshipType; public readonly rationale: string; public readonly evidence: readonly EvidenceReference[]; public readonly lineage: readonly LineageReference[]; public readonly createdAt: string;
  public constructor(props: KnowledgeRelationshipProps) {
    const rationale = props.rationale.trim();
    if (!TYPES.has(props.type)) throw new ValidationError("KnowledgeRelationship type is not canonical");
    if (!rationale) throw new ValidationError("KnowledgeRelationship rationale is required");
    if (props.evidence.length === 0 || props.lineage.length === 0) throw new InvariantViolation("KnowledgeRelationship requires Evidence and Lineage");
    if (!props.target.tenantId.equals(props.source.tenantId)) throw new InvariantViolation("KnowledgeRelationship cannot cross a Tenant boundary");
    const createdAt = assertCanonicalTimestamp(props.createdAt, "createdAt");
    super({ source: props.source.toJSON(), targetKind: targetKind(props.target), target: props.target.toJSON(), type: props.type, rationale, evidence: props.evidence.map((item) => item.toJSON()), lineage: props.lineage.map((item) => item.toJSON()), createdAt });
    this.source = props.source; this.target = props.target; this.type = props.type; this.rationale = rationale; this.evidence = Object.freeze([...props.evidence]); this.lineage = Object.freeze([...props.lineage]); this.createdAt = createdAt; Object.freeze(this);
  }
  public get targetKey(): string { return `${targetKind(this.target)}:${this.target.hashCode()}`; }
  public static fromJSON(value: JsonObject): KnowledgeRelationship {
    const targetKindValue = String(value.targetKind);
    const targetValue = value.target as JsonObject;
    const target = targetKindValue === "asset_version"
      ? AssetVersionReference.fromJSON(targetValue as { assetId: string; versionId: string; tenantId: string })
      : targetKindValue === "asset"
        ? AssetReference.fromJSON(targetValue as { id: string; tenantId: string })
        : PolicyReference.fromJSON(targetValue as { id: string; tenantId: string });
    return new KnowledgeRelationship({ source: KnowledgeReference.fromJSON(value.source as { id: string; tenantId: string }), target, type: String(value.type) as KnowledgeRelationshipType, rationale: String(value.rationale), evidence: Array.isArray(value.evidence) ? value.evidence.map((item) => evidenceFromJSON(item as JsonObject)) : [], lineage: Array.isArray(value.lineage) ? value.lineage.map((item) => lineageFromJSON(item as JsonObject)) : [], createdAt: String(value.createdAt) });
  }
}
