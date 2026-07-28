import { assertCanonicalTimestamp } from "../../../shared/common/timestamps.js";
import type { JsonObject } from "../../../shared/common/serialization.js";
import { Entity } from "../../../shared/entity/Entity.js";
import { InvariantViolation } from "../../../shared/errors/InvariantViolation.js";
import { ValidationError } from "../../../shared/errors/ValidationError.js";
import type { EvidenceReference } from "../../../shared/evidence/EvidenceReference.js";
import { PolicyId, PolicyVersionId, TenantId } from "../../../shared/identity/index.js";
import type { LineageReference } from "../../../shared/lineage/LineageReference.js";
import { DecisionReference } from "../../../shared/references/index.js";
import { evidenceFromJSON, lineageFromJSON } from "./KnowledgePolicySerialization.js";
import { PolicyRuleSet } from "./PolicyRuleSet.js";
import { PolicyVersionNumber } from "./PolicyVersionNumber.js";

export interface PolicyVersionProps { readonly id: PolicyVersionId; readonly policyId: PolicyId; readonly tenantId: TenantId; readonly number: PolicyVersionNumber; readonly ruleSet: PolicyRuleSet; readonly predecessorVersionId?: PolicyVersionId; readonly reason: string; readonly authorityDecisionReference: DecisionReference; readonly evidence: readonly EvidenceReference[]; readonly lineage: readonly LineageReference[]; readonly createdAt: string; }

export class PolicyVersion extends Entity<PolicyVersionId> {
  public readonly policyId: PolicyId; public readonly tenantId: TenantId; public readonly number: PolicyVersionNumber; public readonly ruleSet: PolicyRuleSet; public readonly predecessorVersionId: PolicyVersionId | undefined; public readonly reason: string; public readonly authorityDecisionReference: DecisionReference; public readonly evidence: readonly EvidenceReference[]; public readonly lineage: readonly LineageReference[]; public readonly createdAt: string;
  public constructor(props: PolicyVersionProps) {
    const reason = props.reason.trim();
    if (!reason) throw new ValidationError("PolicyVersion reason is required");
    if (!props.authorityDecisionReference.tenantId.equals(props.tenantId)) throw new InvariantViolation("PolicyVersion decision crossed a Tenant boundary");
    if (props.evidence.length === 0 || props.lineage.length === 0) throw new InvariantViolation("PolicyVersion requires Evidence and Lineage");
    super(props.id);
    this.policyId = props.policyId; this.tenantId = props.tenantId; this.number = props.number; this.ruleSet = props.ruleSet; this.predecessorVersionId = props.predecessorVersionId; this.reason = reason; this.authorityDecisionReference = props.authorityDecisionReference; this.evidence = Object.freeze([...props.evidence]); this.lineage = Object.freeze([...props.lineage]); this.createdAt = assertCanonicalTimestamp(props.createdAt, "createdAt"); Object.freeze(this);
  }
  public toSnapshot(): JsonObject { return { id: this.id.toString(), policyId: this.policyId.toString(), tenantId: this.tenantId.toString(), number: this.number.value, ruleSet: this.ruleSet.toJSON(), ...(this.predecessorVersionId ? { predecessorVersionId: this.predecessorVersionId.toString() } : {}), reason: this.reason, authorityDecisionReference: this.authorityDecisionReference.toJSON(), evidence: this.evidence.map((item) => item.toJSON()), lineage: this.lineage.map((item) => item.toJSON()), createdAt: this.createdAt }; }
  public static fromSnapshot(value: JsonObject): PolicyVersion {
    return new PolicyVersion({ id: PolicyVersionId.from(String(value.id)), policyId: PolicyId.from(String(value.policyId)), tenantId: TenantId.from(String(value.tenantId)), number: new PolicyVersionNumber(Number(value.number)), ruleSet: PolicyRuleSet.fromJSON(value.ruleSet as JsonObject), ...(value.predecessorVersionId ? { predecessorVersionId: PolicyVersionId.from(String(value.predecessorVersionId)) } : {}), reason: String(value.reason), authorityDecisionReference: DecisionReference.fromJSON(value.authorityDecisionReference as { id: string; tenantId: string }), evidence: Array.isArray(value.evidence) ? value.evidence.map((item) => evidenceFromJSON(item as JsonObject)) : [], lineage: Array.isArray(value.lineage) ? value.lineage.map((item) => lineageFromJSON(item as JsonObject)) : [], createdAt: String(value.createdAt) });
  }
}
