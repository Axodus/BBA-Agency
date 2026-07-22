import type { JsonObject } from "../../../shared/common/serialization.js";
import { assertCanonicalTimestamp } from "../../../shared/common/timestamps.js";
import { Entity } from "../../../shared/entity/Entity.js";
import { InvariantViolation } from "../../../shared/errors/InvariantViolation.js";
import { ValidationError } from "../../../shared/errors/ValidationError.js";
import { ReviewSessionId, TenantId } from "../../../shared/identity/index.js";
import { InstitutionalActorReference, ReviewSessionReference } from "../../../shared/references/index.js";
import { ReviewFinding, type ReviewFindingSnapshot } from "./ReviewFinding.js";
import { ReviewSessionStatus, type ReviewSessionStatusType } from "./ReviewTypes.js";

export interface ReviewSessionSnapshot {
  readonly sessionId: string;
  readonly tenantId: string;
  readonly reviewerReferences: readonly JsonObject[];
  readonly status: ReviewSessionStatusType;
  readonly findings: readonly ReviewFindingSnapshot[];
  readonly plannedAt: string;
  readonly startedAt: string | null;
  readonly closedAt: string | null;
}

export class ReviewSession extends Entity<ReviewSessionId> {
  private sessionStatus: ReviewSessionStatusType;
  private sessionFindings: ReviewFinding[];
  private sessionStartedAt: string | null;
  private sessionClosedAt: string | null;
  public readonly tenantId: TenantId;
  public readonly reviewerReferences: readonly InstitutionalActorReference[];
  public readonly plannedAt: string;

  private constructor(props: {
    readonly id: ReviewSessionId;
    readonly tenantId: TenantId;
    readonly reviewerReferences: readonly InstitutionalActorReference[];
    readonly status: ReviewSessionStatusType;
    readonly findings: readonly ReviewFinding[];
    readonly plannedAt: string;
    readonly startedAt?: string | null;
    readonly closedAt?: string | null;
  }) {
    super(props.id);
    if (props.reviewerReferences.length === 0) throw new ValidationError("ReviewSession requires at least one reviewer");
    if (props.reviewerReferences.some((item) => !item.tenantId.equals(props.tenantId))) throw new ValidationError("ReviewSession reviewer crossed a Tenant boundary");
    if (new Set(props.reviewerReferences.map((item) => item.reference)).size !== props.reviewerReferences.length) throw new ValidationError("ReviewSession reviewers must be unique");
    this.tenantId = props.tenantId;
    this.reviewerReferences = Object.freeze([...props.reviewerReferences]);
    this.sessionStatus = props.status;
    this.sessionFindings = [...props.findings];
    this.plannedAt = assertCanonicalTimestamp(props.plannedAt, "plannedAt");
    this.sessionStartedAt = props.startedAt === undefined || props.startedAt === null ? null : assertCanonicalTimestamp(props.startedAt, "startedAt");
    this.sessionClosedAt = props.closedAt === undefined || props.closedAt === null ? null : assertCanonicalTimestamp(props.closedAt, "closedAt");
    this.assertState();
  }

  public static plan(props: { readonly id: ReviewSessionId; readonly tenantId: TenantId; readonly reviewerReferences: readonly InstitutionalActorReference[]; readonly plannedAt: string }): ReviewSession {
    return new ReviewSession({ ...props, status: ReviewSessionStatus.PLANNED, findings: [] });
  }
  public static fromSnapshot(snapshot: ReviewSessionSnapshot): ReviewSession {
    return new ReviewSession({
      id: ReviewSessionId.from(snapshot.sessionId), tenantId: TenantId.from(snapshot.tenantId),
      reviewerReferences: snapshot.reviewerReferences.map((item) => InstitutionalActorReference.fromJSON(item as { reference: string; tenantId: string })),
      status: snapshot.status, findings: snapshot.findings.map(ReviewFinding.fromSnapshot), plannedAt: snapshot.plannedAt,
      startedAt: snapshot.startedAt, closedAt: snapshot.closedAt
    });
  }

  public get status(): ReviewSessionStatusType { return this.sessionStatus; }
  public get findings(): readonly ReviewFinding[] { return [...this.sessionFindings]; }
  public get startedAt(): string | null { return this.sessionStartedAt; }
  public get closedAt(): string | null { return this.sessionClosedAt; }
  public get reference(): ReviewSessionReference { return new ReviewSessionReference(this.id, this.tenantId); }

  public open(at: string): void {
    if (this.status !== ReviewSessionStatus.PLANNED) throw new InvariantViolation(`ReviewSession cannot open from ${this.status}`);
    this.sessionStatus = ReviewSessionStatus.ACTIVE;
    this.sessionStartedAt = assertCanonicalTimestamp(at, "startedAt");
    this.assertState();
  }
  public record(finding: ReviewFinding): void {
    if (this.status !== ReviewSessionStatus.ACTIVE) throw new InvariantViolation("Finding can only be recorded in an ACTIVE ReviewSession");
    if (!finding.sessionId.equals(this.id) || !finding.tenantId.equals(this.tenantId)) throw new InvariantViolation("ReviewFinding cannot change session or Tenant");
    if (this.sessionFindings.some((item) => item.id.equals(finding.id))) throw new InvariantViolation("ReviewFinding already exists in ReviewSession");
    this.sessionFindings = [...this.sessionFindings, finding];
  }
  public close(at: string): void {
    if (this.status !== ReviewSessionStatus.ACTIVE) throw new InvariantViolation(`ReviewSession cannot close from ${this.status}`);
    this.sessionStatus = ReviewSessionStatus.CLOSED;
    this.sessionClosedAt = assertCanonicalTimestamp(at, "closedAt");
    this.assertState();
  }
  public cancel(at: string): void {
    if (this.status !== ReviewSessionStatus.PLANNED && this.status !== ReviewSessionStatus.ACTIVE) throw new InvariantViolation(`ReviewSession cannot cancel from ${this.status}`);
    this.sessionStatus = ReviewSessionStatus.CANCELLED;
    this.sessionClosedAt = assertCanonicalTimestamp(at, "closedAt");
    this.assertState();
  }
  public toSnapshot(): ReviewSessionSnapshot {
    return {
      sessionId: this.id.toString(), tenantId: this.tenantId.toString(), reviewerReferences: this.reviewerReferences.map((item) => item.toJSON()),
      status: this.status, findings: this.findings.map((item) => item.toSnapshot()), plannedAt: this.plannedAt,
      startedAt: this.startedAt, closedAt: this.closedAt
    };
  }
  private assertState(): void {
    if (this.findings.some((item) => !item.sessionId.equals(this.id) || !item.tenantId.equals(this.tenantId))) throw new InvariantViolation("ReviewSession contains a foreign Finding");
    if (this.status === ReviewSessionStatus.PLANNED && (this.startedAt !== null || this.closedAt !== null)) throw new InvariantViolation("PLANNED ReviewSession cannot have execution timestamps");
    if (this.status === ReviewSessionStatus.ACTIVE && (this.startedAt === null || this.closedAt !== null)) throw new InvariantViolation("ACTIVE ReviewSession requires startedAt only");
    if ((this.status === ReviewSessionStatus.CLOSED || this.status === ReviewSessionStatus.CANCELLED) && this.closedAt === null) throw new InvariantViolation("Terminal ReviewSession requires closedAt");
  }
}
