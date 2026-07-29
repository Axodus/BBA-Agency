import { assertCanonicalTimestamp, deepFreeze, type JsonObject } from "../../../shared/common/index.js";
import type { EvidenceReference } from "../../../shared/evidence/EvidenceReference.js";
import { InvariantViolation } from "../../../shared/errors/InvariantViolation.js";
import { TenantId } from "../../../shared/identity/index.js";
import { AuthorityReference, DecisionReference } from "../../../shared/references/index.js";
import { PublicationEligibility, type PublicationEligibilitySnapshot } from "./PublicationEligibility.js";
import { evidenceFromJSON } from "./PublicationSerialization.js";
import { EligibilityResult } from "./PublicationTypes.js";

export interface PublicationAuthorizationSnapshot {
  readonly tenantId: string;
  readonly decisionReference: JsonObject;
  readonly authorityReferences: readonly JsonObject[];
  readonly eligibility: PublicationEligibilitySnapshot;
  readonly authorizedAt: string;
  readonly evidence: readonly JsonObject[];
}

export class PublicationAuthorization {
  public readonly tenantId: TenantId;
  public readonly decisionReference: DecisionReference;
  public readonly authorityReferences: readonly AuthorityReference[];
  public readonly eligibility: PublicationEligibility;
  public readonly authorizedAt: string;
  public readonly evidence: readonly EvidenceReference[];

  public constructor(props: { readonly tenantId: TenantId; readonly decisionReference: DecisionReference; readonly authorityReferences: readonly AuthorityReference[]; readonly eligibility: PublicationEligibility; readonly authorizedAt: string; readonly evidence: readonly EvidenceReference[] }) {
    if (!props.decisionReference.tenantId.equals(props.tenantId) || !props.eligibility.tenantId.equals(props.tenantId)) throw new InvariantViolation("PublicationAuthorization cannot cross Tenant boundaries");
    if (props.eligibility.eligibilityResult !== EligibilityResult.ELIGIBLE) throw new InvariantViolation("PublicationAuthorization requires eligible Review evidence");
    if (props.authorityReferences.length === 0 || props.evidence.length === 0) throw new InvariantViolation("PublicationAuthorization requires Authority and Evidence");
    for (const authority of props.authorityReferences) if (!authority.tenantId.equals(props.tenantId)) throw new InvariantViolation("PublicationAuthorization authority must belong to the Publication Tenant");
    this.tenantId = props.tenantId;
    this.decisionReference = props.decisionReference;
    this.authorityReferences = Object.freeze([...props.authorityReferences]);
    this.eligibility = props.eligibility;
    this.authorizedAt = assertCanonicalTimestamp(props.authorizedAt, "authorizedAt");
    this.evidence = Object.freeze([...props.evidence]);
    Object.freeze(this);
  }

  public toSnapshot(): PublicationAuthorizationSnapshot {
    return deepFreeze({
      tenantId: this.tenantId.toString(), decisionReference: this.decisionReference.toJSON(),
      authorityReferences: this.authorityReferences.map((item) => item.toJSON()), eligibility: this.eligibility.toSnapshot(),
      authorizedAt: this.authorizedAt, evidence: this.evidence.map((item) => item.toJSON())
    });
  }

  public static fromSnapshot(snapshot: PublicationAuthorizationSnapshot): PublicationAuthorization {
    return new PublicationAuthorization({
      tenantId: TenantId.from(snapshot.tenantId), decisionReference: DecisionReference.fromJSON(snapshot.decisionReference as { id: string; tenantId: string }),
      authorityReferences: snapshot.authorityReferences.map((item) => AuthorityReference.fromJSON(item as { id: string; tenantId: string })),
      eligibility: PublicationEligibility.fromSnapshot(snapshot.eligibility), authorizedAt: snapshot.authorizedAt,
      evidence: snapshot.evidence.map((item) => evidenceFromJSON(item as { evidenceId: string; source: string; type: string; capturedAt: string; locator?: string; limitation?: string }))
    });
  }
}
