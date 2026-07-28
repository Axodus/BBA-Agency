import type { JsonObject } from "../../../shared/common/serialization.js";
import { assertCanonicalTimestamp } from "../../../shared/common/timestamps.js";
import { Entity } from "../../../shared/entity/Entity.js";
import { ValidationError } from "../../../shared/errors/ValidationError.js";
import { ReviewId, ReviewRequestId, TenantId } from "../../../shared/identity/index.js";
import { InstitutionalActorReference, ReviewRequestReference } from "../../../shared/references/index.js";
import { ReviewScope } from "./ReviewScope.js";
import { ReviewType, type ReviewTypeValue } from "./ReviewTypes.js";

export interface ReviewRequestSnapshot {
  readonly requestId: string;
  readonly reviewId: string;
  readonly tenantId: string;
  readonly scope: JsonObject;
  readonly reviewType: ReviewTypeValue;
  readonly criteria: readonly string[];
  readonly requestedBy: JsonObject;
  readonly requestedAt: string;
  readonly dueAt: string | null;
}

export interface ReviewRequestProps {
  readonly id: ReviewRequestId;
  readonly reviewId: ReviewId;
  readonly tenantId: TenantId;
  readonly scope: ReviewScope;
  readonly reviewType: ReviewTypeValue;
  readonly criteria: readonly string[];
  readonly requestedBy: InstitutionalActorReference;
  readonly requestedAt: string;
  readonly dueAt?: string | null;
}

export class ReviewRequest extends Entity<ReviewRequestId> {
  public readonly tenantId: TenantId;
  public readonly reviewId: ReviewId;
  public readonly scope: ReviewScope;
  public readonly reviewType: ReviewTypeValue;
  public readonly criteria: readonly string[];
  public readonly requestedBy: InstitutionalActorReference;
  public readonly requestedAt: string;
  public readonly dueAt: string | null;

  private constructor(props: ReviewRequestProps) {
    super(props.id);
    if (!Object.values(ReviewType).includes(props.reviewType)) throw new ValidationError("ReviewRequest type is invalid");
    if (!props.requestedBy.tenantId.equals(props.tenantId)) throw new ValidationError("ReviewRequest requester crossed a Tenant boundary");
    if (!props.scope.tenantId.equals(props.tenantId)) throw new ValidationError("ReviewRequest scope crossed a Tenant boundary");
    const criteria = props.criteria.map((item) => item.trim());
    if (criteria.length === 0 || criteria.some((item) => item.length === 0)) throw new ValidationError("ReviewRequest requires non-empty criteria");
    if (new Set(criteria).size !== criteria.length) throw new ValidationError("ReviewRequest criteria must be unique");
    this.tenantId = props.tenantId;
    this.reviewId = props.reviewId;
    this.scope = props.scope;
    this.reviewType = props.reviewType;
    this.criteria = Object.freeze([...criteria]);
    this.requestedBy = props.requestedBy;
    this.requestedAt = assertCanonicalTimestamp(props.requestedAt, "requestedAt");
    this.dueAt = props.dueAt === undefined || props.dueAt === null ? null : assertCanonicalTimestamp(props.dueAt, "dueAt");
    if (this.dueAt !== null && this.dueAt <= this.requestedAt) throw new ValidationError("ReviewRequest dueAt must be after requestedAt");
    Object.freeze(this);
  }

  public static create(props: ReviewRequestProps): ReviewRequest {
    return new ReviewRequest(props);
  }

  public static fromSnapshot(snapshot: ReviewRequestSnapshot): ReviewRequest {
    return new ReviewRequest({
      id: ReviewRequestId.from(snapshot.requestId),
      reviewId: ReviewId.from(snapshot.reviewId),
      tenantId: TenantId.from(snapshot.tenantId),
      scope: ReviewScope.fromJSON(snapshot.scope),
      reviewType: snapshot.reviewType,
      criteria: snapshot.criteria,
      requestedBy: InstitutionalActorReference.fromJSON(snapshot.requestedBy as { reference: string; tenantId: string }),
      requestedAt: snapshot.requestedAt,
      dueAt: snapshot.dueAt
    });
  }

  public get reference(): ReviewRequestReference { return new ReviewRequestReference(this.id, this.tenantId); }

  public toSnapshot(): ReviewRequestSnapshot {
    return {
      requestId: this.id.toString(), reviewId: this.reviewId.toString(), tenantId: this.tenantId.toString(), scope: this.scope.toJSON(),
      reviewType: this.reviewType, criteria: [...this.criteria], requestedBy: this.requestedBy.toJSON(),
      requestedAt: this.requestedAt, dueAt: this.dueAt
    };
  }
}
