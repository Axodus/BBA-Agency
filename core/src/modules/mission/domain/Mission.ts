import { AggregateRoot } from "../../../shared/aggregate/AggregateRoot.js";
import { assertCanonicalTimestamp } from "../../../shared/common/timestamps.js";
import type { JsonObject, JsonValue } from "../../../shared/common/serialization.js";
import { InvariantViolation } from "../../../shared/errors/InvariantViolation.js";
import { ValidationError } from "../../../shared/errors/ValidationError.js";
import { EvidenceReference, type EvidenceReferenceProps } from "../../../shared/evidence/EvidenceReference.js";
import { EvidenceId } from "../../../shared/identity/EvidenceId.js";
import { MissionId } from "../../../shared/identity/MissionId.js";
import { TenantId } from "../../../shared/identity/TenantId.js";
import { LineageReference, type LineageReferenceProps, type LineageRelationship } from "../../../shared/lineage/LineageReference.js";
import { Version } from "../../../shared/version/Version.js";
import type {
  ArchiveMissionCommand,
  CompleteMissionCommand,
  CreateMissionCommand,
  MissionDecisionContext,
  RegisterMissionEvidenceCommand,
  RegisterMissionLineageCommand,
  RenameMissionCommand,
  ResumeMissionCommand,
  UpdateMissionDescriptionCommand
} from "./MissionCommands.js";
import {
  MissionActivated,
  MissionArchived,
  MissionAuthorized,
  MissionCancelled,
  MissionCompleted,
  MissionCreated,
  MissionDeferred,
  MissionDescriptionUpdated,
  MissionEvidenceRegistered,
  MissionLineageRegistered,
  MissionOutcomeDecisionStarted,
  MissionPaused,
  MissionPrepared,
  MissionRejected,
  MissionRenamed,
  MissionReopened,
  MissionResumed,
  MissionReviewStarted,
  missionDecisionPayload,
  type MissionDomainEvent,
  type MissionEventProps
} from "./MissionEvents.js";
import { MissionIntent, type MissionIntentProps } from "./MissionIntent.js";
import { MissionLifecycle } from "./MissionLifecycle.js";
import { MissionMetadata, type MissionMetadataProps } from "./MissionMetadata.js";
import { MissionOutcome, type MissionOutcomeProps } from "./MissionOutcome.js";
import { MISSION_SNAPSHOT_SCHEMA_VERSION, serializeMissionSnapshot, type MissionSnapshot } from "./MissionSnapshot.js";
import { MissionStatus, TERMINAL_MISSION_STATUSES, type MissionStatus as MissionStatusType } from "./MissionStatus.js";

type MissionEventConstructor = new (props: MissionEventProps) => MissionDomainEvent;

interface RehydratedMissionState {
  readonly status: MissionStatusType;
  readonly metadata: MissionMetadata;
  readonly intent: MissionIntent;
  readonly version: Version;
  readonly evidence: readonly EvidenceReference[];
  readonly lineage: readonly LineageReference[];
  readonly outcome: MissionOutcome | null;
  readonly pausedFrom: MissionStatusType | null;
  readonly statusReason: string | null;
  readonly archivedAt: string | null;
}

function required(value: string, field: string): string {
  const normalized = value.trim();
  if (normalized.length === 0) throw new ValidationError(`Mission ${field} is required`, { field });
  return normalized;
}

function evidenceFromSnapshot(snapshot: JsonObject): EvidenceReference {
  const props: EvidenceReferenceProps = {
    evidenceId: EvidenceId.from(String(snapshot.evidenceId)),
    source: String(snapshot.source),
    type: String(snapshot.type),
    capturedAt: String(snapshot.capturedAt),
    ...(typeof snapshot.locator === "string" ? { locator: snapshot.locator } : {}),
    ...(typeof snapshot.limitation === "string" ? { limitation: snapshot.limitation } : {})
  };
  return new EvidenceReference(props);
}

function lineageFromSnapshot(snapshot: JsonObject): LineageReference {
  const props: LineageReferenceProps = {
    sourceId: String(snapshot.sourceId),
    targetId: String(snapshot.targetId),
    relationship: String(snapshot.relationship) as LineageRelationship,
    declaredAt: String(snapshot.declaredAt),
    ...(typeof snapshot.reason === "string" ? { reason: snapshot.reason } : {})
  };
  return new LineageReference(props);
}

export class Mission extends AggregateRoot<MissionId> {
  private readonly missionTenantId: TenantId;
  private missionStatus: MissionStatusType;
  private missionMetadata: MissionMetadata;
  private readonly missionIntent: MissionIntent;
  private missionEvidence: EvidenceReference[];
  private missionLineage: LineageReference[];
  private missionOutcome: MissionOutcome | null;
  private previousPausedStatus: MissionStatusType | null;
  private currentStatusReason: string | null;
  private missionArchivedAt: string | null;

  private constructor(
    missionId: MissionId,
    tenantId: TenantId,
    state: RehydratedMissionState
  ) {
    super(missionId, state.version);
    if (state.evidence.length === 0) throw new InvariantViolation("Mission must preserve Evidence");
    if (state.lineage.length === 0) throw new InvariantViolation("Mission must preserve Lineage");
    this.missionTenantId = tenantId;
    this.missionStatus = state.status;
    this.missionMetadata = state.metadata;
    this.missionIntent = state.intent;
    this.missionEvidence = [...state.evidence];
    this.missionLineage = [...state.lineage];
    this.missionOutcome = state.outcome;
    this.previousPausedStatus = state.pausedFrom;
    this.currentStatusReason = state.statusReason;
    this.missionArchivedAt = state.archivedAt;
    Object.defineProperty(this, "missionTenantId", { writable: false, configurable: false });
    Object.defineProperty(this, "missionIntent", { writable: false, configurable: false });
    this.assertStateInvariants();
  }

  public static create(command: CreateMissionCommand): Mission {
    if (command.metadata.createdAt !== command.metadata.updatedAt) {
      throw new ValidationError("A new Mission must have identical createdAt and updatedAt");
    }
    const mission = new Mission(command.missionId, command.tenantId, {
      status: MissionStatus.PROPOSED,
      metadata: command.metadata,
      intent: command.intent,
      version: Version.initial(),
      evidence: command.evidence,
      lineage: command.lineage,
      outcome: null,
      pausedFrom: null,
      statusReason: "Mission proposed",
      archivedAt: null
    });
    for (const reference of mission.missionLineage) {
      if (reference.toJSON().targetId !== mission.id.toString()) {
        throw new InvariantViolation("Mission Lineage must target the Mission identity", {
          missionId: mission.id.toString()
        });
      }
    }
    mission.emit(MissionCreated, command.metadata.createdAt, {
      status: MissionStatus.PROPOSED,
      title: command.metadata.title,
      evidenceIds: mission.evidenceIds() as JsonValue[]
    });
    return mission;
  }

  public static rehydrate(snapshot: MissionSnapshot): Mission {
    const metadata = new MissionMetadata(snapshot.metadata as unknown as MissionMetadataProps);
    const intent = new MissionIntent(snapshot.intent as unknown as MissionIntentProps);
    const outcome = snapshot.outcome === null
      ? null
      : new MissionOutcome(snapshot.outcome as unknown as MissionOutcomeProps);
    return new Mission(MissionId.from(snapshot.missionId), TenantId.from(snapshot.tenantId), {
      status: snapshot.status,
      metadata,
      intent,
      version: Version.from(snapshot.version),
      evidence: snapshot.evidence.map(evidenceFromSnapshot),
      lineage: snapshot.lineage.map(lineageFromSnapshot),
      outcome,
      pausedFrom: snapshot.pausedFrom,
      statusReason: snapshot.statusReason,
      archivedAt: snapshot.archivedAt
    });
  }

  public get tenantId(): TenantId { return this.missionTenantId; }
  public get status(): MissionStatusType { return this.missionStatus; }
  public get metadata(): MissionMetadata { return this.missionMetadata; }
  public get intent(): MissionIntent { return this.missionIntent; }
  public get evidence(): readonly EvidenceReference[] { return [...this.missionEvidence]; }
  public get lineage(): readonly LineageReference[] { return [...this.missionLineage]; }
  public get outcome(): MissionOutcome | null { return this.missionOutcome; }
  public get pausedFrom(): MissionStatusType | null { return this.previousPausedStatus; }
  public get statusReason(): string | null { return this.currentStatusReason; }
  public get archivedAt(): string | null { return this.missionArchivedAt; }

  public rename(command: RenameMissionCommand): void {
    this.assertContentMutable();
    this.missionMetadata = this.missionMetadata.rename(command.title, command.occurredAt);
    this.emit(MissionRenamed, command.occurredAt, { title: this.missionMetadata.title });
  }

  public updateDescription(command: UpdateMissionDescriptionCommand): void {
    this.assertContentMutable();
    this.missionMetadata = this.missionMetadata.updateDescription(command.description, command.occurredAt);
    this.emit(MissionDescriptionUpdated, command.occurredAt, {
      description: this.missionMetadata.description
    });
  }

  public authorize(decision: MissionDecisionContext): void {
    this.transition(MissionStatus.AUTHORIZED, decision, MissionAuthorized);
  }

  public prepare(decision: MissionDecisionContext): void {
    this.transition(MissionStatus.PREPARED, decision, MissionPrepared);
  }

  public activate(decision: MissionDecisionContext): void {
    this.transition(MissionStatus.IN_PROGRESS, decision, MissionActivated);
  }

  public pause(decision: MissionDecisionContext): void {
    MissionLifecycle.assertTransition(this.status, MissionStatus.PAUSED);
    this.assertDecision(decision);
    this.previousPausedStatus = this.status;
    this.transition(MissionStatus.PAUSED, decision, MissionPaused, {
      pausedFrom: this.previousPausedStatus
    });
  }

  public resume(command: ResumeMissionCommand): void {
    if (this.status !== MissionStatus.PAUSED || this.previousPausedStatus === null) {
      throw new InvariantViolation("Only a paused Mission can resume");
    }
    if (this.previousPausedStatus === MissionStatus.AUTHORIZED && command.targetStatus !== MissionStatus.PREPARED) {
      throw new InvariantViolation("A Mission paused during authorization must resume through preparation");
    }
    this.transition(command.targetStatus, command, MissionResumed, {
      resumedFrom: this.previousPausedStatus
    });
    this.previousPausedStatus = null;
  }

  public submitForReview(decision: MissionDecisionContext): void {
    this.transition(MissionStatus.UNDER_REVIEW, decision, MissionReviewStarted);
  }

  public beginOutcomeDecision(decision: MissionDecisionContext): void {
    this.transition(MissionStatus.OUTCOME_DECISION, decision, MissionOutcomeDecisionStarted);
  }

  public complete(command: CompleteMissionCommand): void {
    MissionLifecycle.assertTransition(this.status, MissionStatus.CLOSED_WITH_LEARNING);
    this.assertDecision(command);
    this.missionOutcome = command.outcome;
    this.transition(MissionStatus.CLOSED_WITH_LEARNING, command, MissionCompleted, {
      outcome: command.outcome.toJSON()
    });
  }

  public cancel(decision: MissionDecisionContext): void {
    this.transition(MissionStatus.STOPPED, decision, MissionCancelled);
  }

  public defer(decision: MissionDecisionContext): void {
    this.transition(MissionStatus.DEFERRED, decision, MissionDeferred);
  }

  public reject(decision: MissionDecisionContext): void {
    this.transition(MissionStatus.REJECTED, decision, MissionRejected);
  }

  public reopen(decision: MissionDecisionContext): void {
    MissionLifecycle.assertTransition(this.status, MissionStatus.PROPOSED);
    this.assertDecision(decision);
    this.transition(MissionStatus.PROPOSED, decision, MissionReopened);
    this.missionOutcome = null;
  }

  public archive(command: ArchiveMissionCommand): void {
    if (!TERMINAL_MISSION_STATUSES.some((status) => status === this.status)) {
      throw new InvariantViolation("Only a terminal Mission can be archived", { status: this.status });
    }
    if (this.archivedAt !== null) throw new InvariantViolation("Mission is already archived");
    this.assertDecision(command);
    const nextEvidence = this.mergedDecisionEvidence(command.evidence);
    const nextMetadata = this.missionMetadata.touch(command.occurredAt);
    this.missionEvidence = nextEvidence;
    this.missionArchivedAt = assertCanonicalTimestamp(command.occurredAt, "occurredAt");
    this.currentStatusReason = required(command.reason, "archive reason");
    this.missionMetadata = nextMetadata;
    this.emit(MissionArchived, command.occurredAt, this.decisionPayload(command, {
      retainedStatus: this.status,
      archivedAt: this.missionArchivedAt
    }));
  }

  public registerEvidence(command: RegisterMissionEvidenceCommand): void {
    this.assertNotArchived();
    if (this.missionEvidence.some((item) => item.evidenceId.equals(command.evidence.evidenceId))) {
      throw new InvariantViolation("Mission Evidence is already registered", {
        evidenceId: command.evidence.evidenceId.toString()
      });
    }
    const nextMetadata = this.missionMetadata.touch(command.occurredAt);
    this.missionEvidence = [...this.missionEvidence, command.evidence];
    this.missionMetadata = nextMetadata;
    this.emit(MissionEvidenceRegistered, command.occurredAt, {
      evidenceId: command.evidence.evidenceId.toString()
    });
  }

  public registerLineage(command: RegisterMissionLineageCommand): void {
    this.assertNotArchived();
    if (command.lineage.toJSON().targetId !== this.id.toString()) {
      throw new InvariantViolation("Mission Lineage must target the Mission identity");
    }
    if (this.missionLineage.some((item) => item.equals(command.lineage))) {
      throw new InvariantViolation("Mission Lineage is already registered");
    }
    const nextMetadata = this.missionMetadata.touch(command.occurredAt);
    this.missionLineage = [...this.missionLineage, command.lineage];
    this.missionMetadata = nextMetadata;
    this.emit(MissionLineageRegistered, command.occurredAt, {
      lineage: command.lineage.toJSON()
    });
  }

  public toSnapshot(): MissionSnapshot {
    return {
      schemaVersion: MISSION_SNAPSHOT_SCHEMA_VERSION,
      missionId: this.id.toString(),
      tenantId: this.tenantId.toString(),
      status: this.status,
      metadata: this.metadata.toJSON(),
      intent: this.intent.toJSON(),
      version: this.version.value,
      evidence: this.evidence.map((reference) => reference.toJSON()),
      lineage: this.lineage.map((reference) => reference.toJSON()),
      outcome: this.outcome?.toJSON() ?? null,
      pausedFrom: this.pausedFrom,
      statusReason: this.statusReason,
      archivedAt: this.archivedAt
    };
  }

  public serialize(): string {
    return serializeMissionSnapshot(this.toSnapshot());
  }

  private transition(
    target: MissionStatusType,
    decision: MissionDecisionContext,
    EventType: MissionEventConstructor,
    extra: JsonObject = {}
  ): void {
    this.assertNotArchived();
    this.assertDecision(decision);
    MissionLifecycle.assertTransition(this.status, target);
    const nextEvidence = this.mergedDecisionEvidence(decision.evidence);
    const nextMetadata = this.missionMetadata.touch(decision.occurredAt);
    this.missionEvidence = nextEvidence;
    this.missionStatus = target;
    this.currentStatusReason = required(decision.reason, "transition reason");
    this.missionMetadata = nextMetadata;
    this.emit(EventType, decision.occurredAt, this.decisionPayload(decision, {
      status: target,
      ...extra
    }));
    this.assertStateInvariants();
  }

  private emit(EventType: MissionEventConstructor, occurredAt: string, payload: JsonObject): void {
    const version = this.incrementVersion();
    this.recordEvent(new EventType({
      missionId: this.id,
      tenantId: this.tenantId,
      occurredAt,
      version,
      payload
    }));
  }

  private assertDecision(decision: MissionDecisionContext): void {
    required(decision.actorReference, "actorReference");
    required(decision.authorityReference, "authorityReference");
    required(decision.reason, "decision reason");
    assertCanonicalTimestamp(decision.occurredAt, "occurredAt");
    if (decision.evidence.length === 0) {
      throw new InvariantViolation("A Mission transition requires Evidence");
    }
  }

  private mergedDecisionEvidence(evidence: readonly EvidenceReference[]): EvidenceReference[] {
    const known = new Set(this.missionEvidence.map((item) => item.evidenceId.toString()));
    const additions = evidence.filter((item) => !known.has(item.evidenceId.toString()));
    return [...this.missionEvidence, ...additions];
  }

  private decisionPayload(decision: MissionDecisionContext, extra: JsonObject): JsonObject {
    return missionDecisionPayload(
      required(decision.actorReference, "actorReference"),
      required(decision.authorityReference, "authorityReference"),
      required(decision.reason, "decision reason"),
      decision.evidence.map((reference) => reference.evidenceId.toString()),
      extra
    );
  }

  private evidenceIds(): string[] {
    return this.missionEvidence.map((reference) => reference.evidenceId.toString());
  }

  private assertContentMutable(): void {
    this.assertNotArchived();
    if (TERMINAL_MISSION_STATUSES.some((status) => status === this.status)) {
      throw new InvariantViolation("Terminal Mission content cannot be changed", { status: this.status });
    }
  }

  private assertNotArchived(): void {
    if (this.archivedAt !== null) throw new InvariantViolation("Archived Mission cannot be changed");
  }

  private assertStateInvariants(): void {
    if (this.status === MissionStatus.PAUSED &&
        (this.previousPausedStatus === null || this.currentStatusReason === null)) {
      throw new InvariantViolation("Paused Mission requires its previous status and reason");
    }
    if (this.status === MissionStatus.CLOSED_WITH_LEARNING && this.outcome === null) {
      throw new InvariantViolation("Closed Mission requires an explicit outcome and learning");
    }
    if (this.archivedAt !== null &&
        !TERMINAL_MISSION_STATUSES.some((status) => status === this.status)) {
      throw new InvariantViolation("Archived Mission must retain a terminal status");
    }
  }
}
