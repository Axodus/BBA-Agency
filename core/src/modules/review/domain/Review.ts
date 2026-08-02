import { AggregateRoot } from "../../../shared/aggregate/AggregateRoot.js";
import type { CausationId, CorrelationId, JsonObject } from "../../../shared/common/index.js";
import { deepFreeze, stableSerialize } from "../../../shared/common/serialization.js";
import { InvariantViolation } from "../../../shared/errors/InvariantViolation.js";
import type { EvidenceReference } from "../../../shared/evidence/EvidenceReference.js";
import { ReviewId, ReviewSessionId, TenantId } from "../../../shared/identity/index.js";
import type { LineageReference } from "../../../shared/lineage/LineageReference.js";
import { MissionReference, ReviewReference } from "../../../shared/references/index.js";
import { Version } from "../../../shared/version/Version.js";
import type { ArchiveReviewCommand, CancelSessionCommand, CloseSessionCommand, CompleteReviewCommand, CreateReviewCommand, OpenSessionCommand, PlanSessionCommand, RecordFindingCommand, ReviewAuditInput, StartReviewCommand } from "./ReviewCommands.js";
import { CompletionAuthorization, ReviewConclusion, type ReviewConclusionSnapshot } from "./ReviewConclusion.js";
import { ReviewArchived, ReviewCompleted, ReviewCreated, ReviewDomainEvent, ReviewFindingRecorded, ReviewSessionCancelled, ReviewSessionClosed, ReviewSessionOpened, ReviewSessionPlanned, ReviewStarted } from "./ReviewEvents.js";
import { ReviewFinding } from "./ReviewFinding.js";
import { ReviewRequest, type ReviewRequestSnapshot } from "./ReviewRequest.js";
import { evidenceFromJSON, lineageFromJSON } from "./ReviewSerialization.js";
import { ReviewSession, type ReviewSessionSnapshot } from "./ReviewSession.js";
import { ReviewSessionStatus, ReviewStatus, type ReviewStatusType } from "./ReviewTypes.js";

export interface ReviewSnapshot {
  readonly schemaVersion: 1;
  readonly reviewId: string;
  readonly tenantId: string;
  readonly missionReference: JsonObject;
  readonly request: ReviewRequestSnapshot;
  readonly status: ReviewStatusType;
  readonly sessions: readonly ReviewSessionSnapshot[];
  readonly conclusion: ReviewConclusionSnapshot | null;
  readonly evidence: readonly JsonObject[];
  readonly lineage: readonly JsonObject[];
  readonly version: number;
}

export class Review extends AggregateRoot<ReviewId> {
  private readonly reviewTenantId: TenantId;
  private readonly reviewMissionReference: MissionReference;
  private readonly reviewRequest: ReviewRequest;
  private reviewStatus: ReviewStatusType;
  private reviewSessions: ReviewSession[];
  private reviewConclusion: ReviewConclusion | null;
  private reviewEvidence: EvidenceReference[];
  private reviewLineage: LineageReference[];

  private constructor(props: {
    readonly id: ReviewId; readonly tenantId: TenantId; readonly missionReference: MissionReference;
    readonly request: ReviewRequest; readonly status: ReviewStatusType; readonly sessions: readonly ReviewSession[];
    readonly conclusion: ReviewConclusion | null; readonly evidence: readonly EvidenceReference[];
    readonly lineage: readonly LineageReference[]; readonly version: Version;
  }) {
    super(props.id, props.version);
    this.reviewTenantId = props.tenantId;
    this.reviewMissionReference = props.missionReference;
    this.reviewRequest = props.request;
    this.reviewStatus = props.status;
    this.reviewSessions = [...props.sessions];
    this.reviewConclusion = props.conclusion;
    this.reviewEvidence = [...props.evidence];
    this.reviewLineage = [...props.lineage];
    this.assertState();
  }

  public static create(command: CreateReviewCommand): Review {
    const request = ReviewRequest.create({
      id: command.requestId, reviewId: command.reviewId, tenantId: command.tenantId, scope: command.scope,
      reviewType: command.reviewType, criteria: command.criteria, requestedBy: command.requestedBy,
      requestedAt: command.requestedAt, ...(command.dueAt === undefined ? {} : { dueAt: command.dueAt })
    });
    const review = new Review({
      id: command.reviewId, tenantId: command.tenantId, missionReference: command.missionReference,
      request, status: ReviewStatus.PROPOSED, sessions: [], conclusion: null,
      evidence: command.evidence, lineage: command.lineage, version: Version.initial()
    });
    review.requireAudit(command);
    review.incrementVersion();
    review.emit(ReviewCreated, command, { requestId: request.id.toString(), status: ReviewStatus.PROPOSED });
    return review;
  }

  public static rehydrate(snapshot: ReviewSnapshot): Review {
    if (snapshot.schemaVersion !== 1) throw new InvariantViolation("Unsupported Review snapshot schema");
    return new Review({
      id: ReviewId.from(snapshot.reviewId), tenantId: TenantId.from(snapshot.tenantId),
      missionReference: MissionReference.fromJSON(snapshot.missionReference as { id: string; tenantId: string }),
      request: ReviewRequest.fromSnapshot(snapshot.request), status: snapshot.status,
      sessions: snapshot.sessions.map(ReviewSession.fromSnapshot),
      conclusion: snapshot.conclusion === null ? null : ReviewConclusion.fromSnapshot(snapshot.conclusion),
      evidence: snapshot.evidence.map(evidenceFromJSON), lineage: snapshot.lineage.map(lineageFromJSON),
      version: Version.from(snapshot.version)
    });
  }

  public get tenantId(): TenantId { return this.reviewTenantId; }
  public get missionReference(): MissionReference { return this.reviewMissionReference; }
  public get request(): ReviewRequest { return ReviewRequest.fromSnapshot(this.reviewRequest.toSnapshot()); }
  public get scope() { return this.reviewRequest.scope; }
  public get status(): ReviewStatusType { return this.reviewStatus; }
  public get sessions(): readonly ReviewSession[] { return this.reviewSessions.map((item) => ReviewSession.fromSnapshot(item.toSnapshot())); }
  public get conclusion(): ReviewConclusion | null { return this.reviewConclusion === null ? null : ReviewConclusion.fromSnapshot(this.reviewConclusion.toSnapshot()); }
  public get evidence(): readonly EvidenceReference[] { return [...this.reviewEvidence]; }
  public get lineage(): readonly LineageReference[] { return [...this.reviewLineage]; }
  public get reference(): ReviewReference { return new ReviewReference(this.id, this.tenantId); }

  public start(command: StartReviewCommand): void {
    if (this.status !== ReviewStatus.PROPOSED) throw new InvariantViolation(`Review cannot start from ${this.status}`);
    if (!this.reviewSessions.some((item) => item.status === ReviewSessionStatus.PLANNED)) throw new InvariantViolation("Review requires a PLANNED session before start");
    this.reviewStatus = ReviewStatus.IN_REVIEW;
    this.mutate(command);
    this.emit(ReviewStarted, command);
  }

  public planSession(command: PlanSessionCommand): void {
    if (this.status !== ReviewStatus.PROPOSED && this.status !== ReviewStatus.IN_REVIEW) throw new InvariantViolation(`Review cannot plan a session from ${this.status}`);
    if (this.reviewSessions.some((item) => item.id.equals(command.sessionId))) throw new InvariantViolation("ReviewSession already exists");
    const session = ReviewSession.plan({ id: command.sessionId, tenantId: this.tenantId, reviewerReferences: command.reviewerReferences, plannedAt: command.occurredAt });
    this.reviewSessions = [...this.reviewSessions, session];
    this.mutate(command);
    this.emit(ReviewSessionPlanned, command, { sessionId: command.sessionId.toString() });
  }

  public openSession(command: OpenSessionCommand): void {
    this.assertInReview();
    if (this.reviewSessions.some((item) => item.status === ReviewSessionStatus.ACTIVE)) throw new InvariantViolation("Only one ReviewSession may be ACTIVE");
    const session = this.requireSession(command.sessionId);
    session.open(command.occurredAt);
    this.mutate(command);
    this.emit(ReviewSessionOpened, command, { sessionId: session.id.toString() });
  }

  public recordFinding(command: RecordFindingCommand): void {
    this.assertInReview();
    const session = this.requireSession(command.sessionId);
    const finding = ReviewFinding.create({
      id: command.findingId, sessionId: command.sessionId, tenantId: this.tenantId,
      category: command.category, severity: command.severity, statement: command.statement,
      recommendation: command.recommendation, evidence: command.evidence, lineage: command.lineage,
      recordedAt: command.occurredAt
    });
    if (this.reviewSessions.some((item) => item.findings.some((known) => known.id.equals(finding.id)))) throw new InvariantViolation("ReviewFinding ID already exists in Review");
    session.record(finding);
    this.mutate(command);
    this.emit(ReviewFindingRecorded, command, { sessionId: session.id.toString(), findingId: finding.id.toString(), severity: finding.severity });
  }

  public closeSession(command: CloseSessionCommand): void {
    this.assertInReview();
    const session = this.requireSession(command.sessionId);
    session.close(command.occurredAt);
    this.mutate(command);
    this.emit(ReviewSessionClosed, command, { sessionId: session.id.toString(), findingCount: session.findings.length });
  }

  public cancelSession(command: CancelSessionCommand): void {
    if (this.status !== ReviewStatus.PROPOSED && this.status !== ReviewStatus.IN_REVIEW) throw new InvariantViolation(`Review cannot cancel a session from ${this.status}`);
    const session = this.requireSession(command.sessionId);
    session.cancel(command.occurredAt);
    this.mutate(command);
    this.emit(ReviewSessionCancelled, command, { sessionId: session.id.toString(), retainedFindingCount: session.findings.length });
  }

  public complete(command: CompleteReviewCommand, authorization: CompletionAuthorization): void {
    this.assertInReview();
    const unresolved = this.reviewSessions.filter((item) => item.status === ReviewSessionStatus.PLANNED || item.status === ReviewSessionStatus.ACTIVE);
    if (unresolved.length > 0) throw new InvariantViolation("Review cannot complete with PLANNED or ACTIVE sessions");
    const contributing = this.reviewSessions.filter((item) => item.status === ReviewSessionStatus.CLOSED);
    if (contributing.length === 0) throw new InvariantViolation("Review requires a CLOSED session before completion");
    const findingIds = contributing.flatMap((session) => session.findings.map((finding) => finding.id));
    this.reviewConclusion = ReviewConclusion.create({
      id: command.conclusionId, tenantId: this.tenantId, outcome: command.outcome, rationale: command.rationale,
      contributingSessionIds: contributing.map((item) => item.id), consideredFindingIds: findingIds,
      completionAuthorization: authorization, createdAt: command.occurredAt
    });
    this.reviewStatus = ReviewStatus.COMPLETED;
    this.mutate(command);
    this.emit(ReviewCompleted, command, {
      conclusionId: command.conclusionId.toString(), outcome: command.outcome,
      contributingSessionIds: contributing.map((item) => item.id.toString()),
      consideredFindingIds: findingIds.map((item) => item.toString()),
      decisionReference: authorization.decisionReference.toJSON(),
      authorityReferences: authorization.authorityReferences.map((item) => item.toJSON())
    });
  }

  public archive(command: ArchiveReviewCommand, authorization: CompletionAuthorization): void {
    if (this.status !== ReviewStatus.COMPLETED) throw new InvariantViolation(`Review cannot archive from ${this.status}`);
    this.reviewStatus = ReviewStatus.ARCHIVED;
    this.mutate(command);
    this.emit(ReviewArchived, command, {
      decisionReference: authorization.decisionReference.toJSON(),
      authorityReferences: authorization.authorityReferences.map((item) => item.toJSON())
    });
  }

  public toSnapshot(): ReviewSnapshot {
    return deepFreeze({
      schemaVersion: 1, reviewId: this.id.toString(), tenantId: this.tenantId.toString(),
      missionReference: this.missionReference.toJSON(), request: this.reviewRequest.toSnapshot(), status: this.status,
      sessions: this.reviewSessions.map((item) => item.toSnapshot()), conclusion: this.reviewConclusion?.toSnapshot() ?? null,
      evidence: this.evidence.map((item) => item.toJSON()), lineage: this.lineage.map((item) => item.toJSON()), version: this.version.value
    });
  }
  public serialize(): string { return stableSerialize(this.toSnapshot() as unknown as JsonObject); }

  private requireSession(sessionId: ReviewSessionId): ReviewSession {
    const session = this.reviewSessions.find((item) => item.id.equals(sessionId));
    if (session === undefined) throw new InvariantViolation("ReviewSession was not found", { sessionId: sessionId.toString() });
    return session;
  }
  private assertInReview(): void { if (this.status !== ReviewStatus.IN_REVIEW) throw new InvariantViolation(`Review must be IN_REVIEW, received ${this.status}`); }
  private mutate(command: ReviewAuditInput): void {
    this.requireAudit(command);
    this.reviewEvidence = [...this.reviewEvidence, ...command.evidence.filter((item) => !this.reviewEvidence.some((known) => known.evidenceId.equals(item.evidenceId)))];
    this.reviewLineage = [...this.reviewLineage, ...command.lineage.filter((item) => !this.reviewLineage.some((known) => known.equals(item)))];
    this.incrementVersion();
    this.assertState();
  }
  private requireAudit(command: ReviewAuditInput): void {
    if (command.reason.trim().length === 0 || command.evidence.length === 0 || command.lineage.length === 0) throw new InvariantViolation("Review mutation requires reason, Evidence and Lineage");
  }
  private emit(EventType: new (props: import("./ReviewEvents.js").ReviewEventProps) => ReviewDomainEvent, command: ReviewAuditInput & { readonly correlationId: CorrelationId; readonly causationId?: CausationId }, payload: JsonObject = {}): void {
    this.recordEvent(new EventType({
      aggregateId: this.id.toString(), tenantId: this.tenantId, occurredAt: command.occurredAt, version: this.version,
      correlationId: command.correlationId.toString(), ...(command.causationId ? { causationId: command.causationId.toString() } : {}),
      evidenceIds: command.evidence.map((item) => item.evidenceId.toString()), lineage: command.lineage.map((item) => item.toJSON()), payload
    }));
  }
  private assertState(): void {
    if (!this.missionReference.tenantId.equals(this.tenantId)) throw new InvariantViolation("Review MissionReference crossed a Tenant boundary");
    if (!this.reviewRequest.tenantId.equals(this.tenantId) || !this.reviewRequest.reviewId.equals(this.id)) throw new InvariantViolation("ReviewRequest ownership is invalid");
    if (this.reviewEvidence.length === 0 || this.reviewLineage.length === 0) throw new InvariantViolation("Review requires Evidence and Lineage");
    if (this.reviewSessions.filter((item) => item.status === ReviewSessionStatus.ACTIVE).length > 1) throw new InvariantViolation("Only one ReviewSession may be ACTIVE");
    if (this.reviewSessions.some((item) => !item.tenantId.equals(this.tenantId))) throw new InvariantViolation("ReviewSession crossed a Tenant boundary");
    const sessionIds = this.reviewSessions.map((item) => item.id.toString());
    if (new Set(sessionIds).size !== sessionIds.length) throw new InvariantViolation("ReviewSession IDs must be unique");
    const findingIds = this.reviewSessions.flatMap((session) => session.findings.map((finding) => finding.id.toString()));
    if (new Set(findingIds).size !== findingIds.length) throw new InvariantViolation("ReviewFinding IDs must be unique within Review");
    if ((this.status === ReviewStatus.COMPLETED || this.status === ReviewStatus.ARCHIVED) !== (this.reviewConclusion !== null)) throw new InvariantViolation("ReviewConclusion exists exactly for completed Review state");
    if (this.reviewConclusion !== null) {
      if (!this.reviewConclusion.tenantId.equals(this.tenantId)) throw new InvariantViolation("ReviewConclusion crossed a Tenant boundary");
      const closed = new Map(this.reviewSessions.filter((item) => item.status === ReviewSessionStatus.CLOSED).map((item) => [item.id.toString(), item]));
      if (this.reviewConclusion.contributingSessionIds.some((item) => !closed.has(item.toString()))) throw new InvariantViolation("ReviewConclusion includes a non-CLOSED session");
      const eligible = new Set(this.reviewConclusion.contributingSessionIds.flatMap((id) => closed.get(id.toString())?.findings.map((item) => item.id.toString()) ?? []));
      if (this.reviewConclusion.consideredFindingIds.some((item) => !eligible.has(item.toString()))) throw new InvariantViolation("ReviewConclusion includes an ineligible Finding");
    }
  }
}
