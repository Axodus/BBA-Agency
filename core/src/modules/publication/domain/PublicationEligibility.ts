import { assertCanonicalTimestamp, deepFreeze, type JsonObject } from "../../../shared/common/index.js";
import type { EvidenceReference } from "../../../shared/evidence/EvidenceReference.js";
import { InvariantViolation } from "../../../shared/errors/InvariantViolation.js";
import { TenantId } from "../../../shared/identity/index.js";
import { ReviewReference } from "../../../shared/references/index.js";
import { evidenceFromJSON } from "./PublicationSerialization.js";
import { EligibilityResult, type EligibilityResultType } from "./PublicationTypes.js";

export interface PublicationEligibilitySnapshot {
  readonly tenantId: string;
  readonly reviewReference: JsonObject;
  readonly reviewConclusionId: string;
  readonly eligibilityResult: EligibilityResultType;
  readonly validatedAt: string;
  readonly evidence: readonly JsonObject[];
}

export class PublicationEligibility {
  public readonly tenantId: TenantId;
  public readonly reviewReference: ReviewReference;
  public readonly reviewConclusionId: string;
  public readonly eligibilityResult: EligibilityResultType;
  public readonly validatedAt: string;
  public readonly evidence: readonly EvidenceReference[];

  public constructor(props: { readonly tenantId: TenantId; readonly reviewReference: ReviewReference; readonly reviewConclusionId: string; readonly eligibilityResult: EligibilityResultType; readonly validatedAt: string; readonly evidence: readonly EvidenceReference[] }) {
    if (!props.reviewReference.tenantId.equals(props.tenantId)) throw new InvariantViolation("PublicationEligibility cannot cross Tenant boundaries");
    if (props.reviewConclusionId.trim().length === 0) throw new InvariantViolation("PublicationEligibility requires a ReviewConclusion identifier");
    if (props.eligibilityResult !== EligibilityResult.ELIGIBLE && props.eligibilityResult !== EligibilityResult.NOT_ELIGIBLE) throw new InvariantViolation("PublicationEligibility result is not canonical");
    if (props.evidence.length === 0) throw new InvariantViolation("PublicationEligibility requires Evidence");
    this.tenantId = props.tenantId;
    this.reviewReference = props.reviewReference;
    this.reviewConclusionId = props.reviewConclusionId;
    this.eligibilityResult = props.eligibilityResult;
    this.validatedAt = assertCanonicalTimestamp(props.validatedAt, "validatedAt");
    this.evidence = Object.freeze([...props.evidence]);
    Object.freeze(this);
  }

  public toSnapshot(): PublicationEligibilitySnapshot {
    return deepFreeze({
      tenantId: this.tenantId.toString(), reviewReference: this.reviewReference.toJSON(), reviewConclusionId: this.reviewConclusionId,
      eligibilityResult: this.eligibilityResult, validatedAt: this.validatedAt, evidence: this.evidence.map((item) => item.toJSON())
    });
  }

  public static fromSnapshot(snapshot: PublicationEligibilitySnapshot): PublicationEligibility {
    return new PublicationEligibility({
      tenantId: TenantId.from(snapshot.tenantId), reviewReference: ReviewReference.fromJSON(snapshot.reviewReference as { id: string; tenantId: string }),
      reviewConclusionId: snapshot.reviewConclusionId, eligibilityResult: snapshot.eligibilityResult,
      validatedAt: snapshot.validatedAt, evidence: snapshot.evidence.map((item) => evidenceFromJSON(item as { evidenceId: string; source: string; type: string; capturedAt: string; locator?: string; limitation?: string }))
    });
  }
}
