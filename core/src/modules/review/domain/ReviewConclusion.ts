import type { JsonObject, JsonValue } from "../../../shared/common/serialization.js";
import { assertCanonicalTimestamp } from "../../../shared/common/timestamps.js";
import { Entity } from "../../../shared/entity/Entity.js";
import { ValidationError } from "../../../shared/errors/ValidationError.js";
import { ReviewConclusionId, ReviewFindingId, ReviewSessionId, TenantId } from "../../../shared/identity/index.js";
import { AuthorityReference, DecisionReference } from "../../../shared/references/index.js";
import { ValueObject } from "../../../shared/valueobject/ValueObject.js";
import { ReviewOutcome, type ReviewOutcomeValue } from "./ReviewTypes.js";

export interface CompletionAuthorizationSnapshot {
  readonly decisionReference: JsonObject;
  readonly authorityReferences: readonly JsonObject[];
}

export class CompletionAuthorization extends ValueObject<JsonObject> {
  public readonly decisionReference: DecisionReference;
  public readonly authorityReferences: readonly AuthorityReference[];

  public constructor(tenantId: TenantId, decisionReference: DecisionReference, authorityReferences: readonly AuthorityReference[]) {
    if (!decisionReference.tenantId.equals(tenantId)) throw new ValidationError("CompletionAuthorization Decision crossed a Tenant boundary");
    if (authorityReferences.length === 0) throw new ValidationError("CompletionAuthorization requires Authority");
    if (authorityReferences.some((item) => !item.tenantId.equals(tenantId))) throw new ValidationError("CompletionAuthorization Authority crossed a Tenant boundary");
    const ordered = [...authorityReferences].sort((left, right) => left.id.toString().localeCompare(right.id.toString()));
    if (new Set(ordered.map((item) => item.id.toString())).size !== ordered.length) throw new ValidationError("CompletionAuthorization Authorities must be unique");
    super({ decisionReference: decisionReference.toJSON(), authorityReferences: ordered.map((item) => item.toJSON()) as unknown as JsonValue });
    this.decisionReference = decisionReference;
    this.authorityReferences = Object.freeze(ordered);
    Object.freeze(this);
  }

  public static fromJSON(tenantId: TenantId, value: JsonObject): CompletionAuthorization {
    return new CompletionAuthorization(
      tenantId,
      DecisionReference.fromJSON(value.decisionReference as { id: string; tenantId: string }),
      (value.authorityReferences as unknown as readonly JsonObject[]).map((item) => AuthorityReference.fromJSON(item as { id: string; tenantId: string }))
    );
  }
}

export interface ReviewConclusionSnapshot {
  readonly conclusionId: string;
  readonly tenantId: string;
  readonly outcome: ReviewOutcomeValue;
  readonly rationale: string;
  readonly contributingSessionIds: readonly string[];
  readonly consideredFindingIds: readonly string[];
  readonly completionAuthorization: JsonObject;
  readonly createdAt: string;
}

export class ReviewConclusion extends Entity<ReviewConclusionId> {
  public readonly tenantId: TenantId;
  public readonly outcome: ReviewOutcomeValue;
  public readonly rationale: string;
  public readonly contributingSessionIds: readonly ReviewSessionId[];
  public readonly consideredFindingIds: readonly ReviewFindingId[];
  public readonly completionAuthorization: CompletionAuthorization;
  public readonly createdAt: string;

  private constructor(props: {
    readonly id: ReviewConclusionId;
    readonly tenantId: TenantId;
    readonly outcome: ReviewOutcomeValue;
    readonly rationale: string;
    readonly contributingSessionIds: readonly ReviewSessionId[];
    readonly consideredFindingIds: readonly ReviewFindingId[];
    readonly completionAuthorization: CompletionAuthorization;
    readonly createdAt: string;
  }) {
    super(props.id);
    if (!Object.values(ReviewOutcome).includes(props.outcome)) throw new ValidationError("ReviewConclusion outcome is invalid");
    const rationale = props.rationale.trim();
    if (rationale.length === 0) throw new ValidationError("ReviewConclusion requires rationale");
    const sessions = [...props.contributingSessionIds].sort((left, right) => left.toString().localeCompare(right.toString()));
    const findings = [...props.consideredFindingIds].sort((left, right) => left.toString().localeCompare(right.toString()));
    if (sessions.length === 0) throw new ValidationError("ReviewConclusion requires a contributing CLOSED session");
    if (new Set(sessions.map(String)).size !== sessions.length || new Set(findings.map(String)).size !== findings.length) throw new ValidationError("ReviewConclusion contribution IDs must be unique");
    this.tenantId = props.tenantId;
    this.outcome = props.outcome;
    this.rationale = rationale;
    this.contributingSessionIds = Object.freeze(sessions);
    this.consideredFindingIds = Object.freeze(findings);
    this.completionAuthorization = props.completionAuthorization;
    this.createdAt = assertCanonicalTimestamp(props.createdAt, "createdAt");
    Object.freeze(this);
  }

  public static create(props: {
    readonly id: ReviewConclusionId; readonly tenantId: TenantId; readonly outcome: ReviewOutcomeValue;
    readonly rationale: string; readonly contributingSessionIds: readonly ReviewSessionId[];
    readonly consideredFindingIds: readonly ReviewFindingId[]; readonly completionAuthorization: CompletionAuthorization;
    readonly createdAt: string;
  }): ReviewConclusion { return new ReviewConclusion(props); }

  public static fromSnapshot(snapshot: ReviewConclusionSnapshot): ReviewConclusion {
    const tenantId = TenantId.from(snapshot.tenantId);
    return new ReviewConclusion({
      id: ReviewConclusionId.from(snapshot.conclusionId), tenantId, outcome: snapshot.outcome,
      rationale: snapshot.rationale, contributingSessionIds: snapshot.contributingSessionIds.map(ReviewSessionId.from),
      consideredFindingIds: snapshot.consideredFindingIds.map(ReviewFindingId.from),
      completionAuthorization: CompletionAuthorization.fromJSON(tenantId, snapshot.completionAuthorization), createdAt: snapshot.createdAt
    });
  }

  public toSnapshot(): ReviewConclusionSnapshot {
    return {
      conclusionId: this.id.toString(), tenantId: this.tenantId.toString(), outcome: this.outcome,
      rationale: this.rationale, contributingSessionIds: this.contributingSessionIds.map(String),
      consideredFindingIds: this.consideredFindingIds.map(String),
      completionAuthorization: this.completionAuthorization.toJSON(), createdAt: this.createdAt
    };
  }
}
