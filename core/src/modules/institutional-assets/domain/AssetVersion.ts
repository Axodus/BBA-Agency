import { Entity } from "../../../shared/entity/Entity.js";
import { assertCanonicalTimestamp } from "../../../shared/common/timestamps.js";
import type { JsonObject } from "../../../shared/common/serialization.js";
import { InvariantViolation } from "../../../shared/errors/InvariantViolation.js";
import { ValidationError } from "../../../shared/errors/ValidationError.js";
import type { EvidenceReference } from "../../../shared/evidence/EvidenceReference.js";
import { AssetId, AssetVersionId, TenantId } from "../../../shared/identity/index.js";
import type { LineageReference } from "../../../shared/lineage/LineageReference.js";
import { AssetVersionReference, DecisionReference } from "../../../shared/references/index.js";
import { CanonicalContent } from "./CanonicalContent.js";
import type { AssetVersionGovernanceState } from "./AssetVersionGovernanceState.js";
import { AssetVersionNumber } from "./AssetVersionNumber.js";
import { evidenceFromJSON, lineageFromJSON } from "./AssetSerialization.js";

export interface AssetVersionProps { readonly id: AssetVersionId; readonly assetId: AssetId; readonly tenantId: TenantId; readonly number: AssetVersionNumber; readonly content: CanonicalContent; readonly predecessorReference?: AssetVersionReference; readonly reason: string; readonly authorityDecisionReference: DecisionReference; readonly evidence: readonly EvidenceReference[]; readonly lineage: readonly LineageReference[]; readonly createdAt: string; readonly governanceState?: AssetVersionGovernanceState; }
const GOVERNANCE_STATES = new Set<AssetVersionGovernanceState>(["DRAFT", "REVIEWED", "APPROVED", "PUBLISHED", "ARCHIVED"]);

export class AssetVersion extends Entity<AssetVersionId> {
  public readonly assetId: AssetId; public readonly tenantId: TenantId; public readonly number: AssetVersionNumber; public readonly content: CanonicalContent; public readonly predecessorReference: AssetVersionReference | undefined; public readonly reason: string; public readonly authorityDecisionReference: DecisionReference; public readonly evidence: readonly EvidenceReference[]; public readonly lineage: readonly LineageReference[]; public readonly createdAt: string; public readonly governanceState: AssetVersionGovernanceState;
  public constructor(props: AssetVersionProps) {
    const reason = props.reason.trim();
    const governanceState = props.governanceState ?? "DRAFT";
    if (!reason) throw new ValidationError("AssetVersion reason is required");
    if (!GOVERNANCE_STATES.has(governanceState)) throw new ValidationError("AssetVersion governance state is not canonical");
    if (!props.authorityDecisionReference.tenantId.equals(props.tenantId) || (props.predecessorReference !== undefined && (!props.predecessorReference.tenantId.equals(props.tenantId) || !props.predecessorReference.assetId.equals(props.assetId)))) throw new InvariantViolation("AssetVersion references must belong to its Asset and Tenant");
    if (props.evidence.length === 0 || props.lineage.length === 0) throw new InvariantViolation("AssetVersion requires Evidence and Lineage");
    super(props.id);
    this.assetId = props.assetId; this.tenantId = props.tenantId; this.number = props.number; this.content = props.content; this.predecessorReference = props.predecessorReference; this.reason = reason; this.authorityDecisionReference = props.authorityDecisionReference; this.evidence = Object.freeze([...props.evidence]); this.lineage = Object.freeze([...props.lineage]); this.createdAt = assertCanonicalTimestamp(props.createdAt, "createdAt"); this.governanceState = governanceState; Object.freeze(this);
  }
  public toSnapshot(): JsonObject { return { id: this.id.toString(), assetId: this.assetId.toString(), tenantId: this.tenantId.toString(), number: this.number.value, content: this.content.toJSON(), ...(this.predecessorReference ? { predecessorReference: this.predecessorReference.toJSON() } : {}), reason: this.reason, authorityDecisionReference: this.authorityDecisionReference.toJSON(), evidence: this.evidence.map((item) => item.toJSON()), lineage: this.lineage.map((item) => item.toJSON()), createdAt: this.createdAt, governanceState: this.governanceState }; }
  public static fromSnapshot(value: JsonObject): AssetVersion { const assetId = AssetId.from(String(value.assetId)); const tenantId = TenantId.from(String(value.tenantId)); return new AssetVersion({ id: AssetVersionId.from(String(value.id)), assetId, tenantId, number: new AssetVersionNumber(Number(value.number)), content: CanonicalContent.fromJSON(value.content as JsonObject), ...(value.predecessorReference ? { predecessorReference: AssetVersionReference.fromJSON(value.predecessorReference as { assetId: string; versionId: string; tenantId: string }) } : {}), reason: String(value.reason), authorityDecisionReference: DecisionReference.fromJSON(value.authorityDecisionReference as { id: string; tenantId: string }), evidence: Array.isArray(value.evidence) ? value.evidence.map((item) => evidenceFromJSON(item as JsonObject)) : [], lineage: Array.isArray(value.lineage) ? value.lineage.map((item) => lineageFromJSON(item as JsonObject)) : [], createdAt: String(value.createdAt), governanceState: String(value.governanceState) as AssetVersionGovernanceState }); }
}
