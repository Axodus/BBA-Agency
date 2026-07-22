import { assertCanonicalTimestamp } from "../../../shared/common/timestamps.js";
import type { JsonObject } from "../../../shared/common/serialization.js";
import { InvariantViolation } from "../../../shared/errors/InvariantViolation.js";
import { ValidationError } from "../../../shared/errors/ValidationError.js";
import type { EvidenceReference } from "../../../shared/evidence/EvidenceReference.js";
import type { LineageReference } from "../../../shared/lineage/LineageReference.js";
import { AssetReference, AuthorityReference, DecisionReference } from "../../../shared/references/index.js";
import { ValueObject } from "../../../shared/valueobject/ValueObject.js";
import { evidenceFromJSON, lineageFromJSON } from "./AssetSerialization.js";

export type AssetRelationshipType = "DERIVES_FROM" | "REFERENCES" | "SUPERSEDES" | "RELATES_TO";
const RELATIONSHIP_TYPES = new Set<AssetRelationshipType>(["DERIVES_FROM", "REFERENCES", "SUPERSEDES", "RELATES_TO"]);

export interface AssetRelationshipProps { readonly source: AssetReference; readonly target: AssetReference; readonly type: AssetRelationshipType; readonly authorityReference: AuthorityReference; readonly decisionReference: DecisionReference; readonly rationale: string; readonly evidence: readonly EvidenceReference[]; readonly lineage: readonly LineageReference[]; readonly createdAt: string; }

export class AssetRelationship extends ValueObject<JsonObject> {
  public readonly source: AssetReference; public readonly target: AssetReference; public readonly type: AssetRelationshipType; public readonly authorityReference: AuthorityReference; public readonly decisionReference: DecisionReference; public readonly rationale: string; public readonly evidence: readonly EvidenceReference[]; public readonly lineage: readonly LineageReference[]; public readonly createdAt: string;
  public constructor(props: AssetRelationshipProps) {
    const rationale = props.rationale.trim();
    if (!rationale) throw new ValidationError("AssetRelationship rationale is required");
    if (!RELATIONSHIP_TYPES.has(props.type)) throw new ValidationError("AssetRelationship type is not canonical");
    if (!props.source.tenantId.equals(props.target.tenantId) || !props.source.tenantId.equals(props.authorityReference.tenantId) || !props.source.tenantId.equals(props.decisionReference.tenantId)) throw new InvariantViolation("AssetRelationship cannot cross a Tenant boundary");
    if (props.source.id.equals(props.target.id)) throw new InvariantViolation("AssetRelationship cannot reference itself");
    if (props.evidence.length === 0 || props.lineage.length === 0) throw new InvariantViolation("AssetRelationship requires Evidence and Lineage");
    const createdAt = assertCanonicalTimestamp(props.createdAt, "createdAt");
    super({ source: props.source.toJSON(), target: props.target.toJSON(), type: props.type, authorityReference: props.authorityReference.toJSON(), decisionReference: props.decisionReference.toJSON(), rationale, evidence: props.evidence.map((item) => item.toJSON()), lineage: props.lineage.map((item) => item.toJSON()), createdAt });
    this.source = props.source; this.target = props.target; this.type = props.type; this.authorityReference = props.authorityReference; this.decisionReference = props.decisionReference; this.rationale = rationale; this.evidence = Object.freeze([...props.evidence]); this.lineage = Object.freeze([...props.lineage]); this.createdAt = createdAt; Object.freeze(this);
  }
  public isAcyclic(): boolean { return this.type === "DERIVES_FROM" || this.type === "SUPERSEDES"; }
  public static fromJSON(value: JsonObject): AssetRelationship { return new AssetRelationship({ source: AssetReference.fromJSON(value.source as { id: string; tenantId: string }), target: AssetReference.fromJSON(value.target as { id: string; tenantId: string }), type: String(value.type) as AssetRelationshipType, authorityReference: AuthorityReference.fromJSON(value.authorityReference as { id: string; tenantId: string }), decisionReference: DecisionReference.fromJSON(value.decisionReference as { id: string; tenantId: string }), rationale: String(value.rationale), evidence: Array.isArray(value.evidence) ? value.evidence.map((item) => evidenceFromJSON(item as JsonObject)) : [], lineage: Array.isArray(value.lineage) ? value.lineage.map((item) => lineageFromJSON(item as JsonObject)) : [], createdAt: String(value.createdAt) }); }
}
