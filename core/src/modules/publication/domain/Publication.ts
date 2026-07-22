import { AggregateRoot } from "../../../shared/aggregate/AggregateRoot.js";
import type { CausationId, CorrelationId, JsonObject } from "../../../shared/common/index.js";
import { deepFreeze, stableSerialize } from "../../../shared/common/serialization.js";
import { InvariantViolation } from "../../../shared/errors/InvariantViolation.js";
import type { EvidenceReference } from "../../../shared/evidence/EvidenceReference.js";
import { PublicationId, PublicationVersionId, TenantId } from "../../../shared/identity/index.js";
import type { LineageReference } from "../../../shared/lineage/LineageReference.js";
import { MissionReference, PublicationReference, PublicationVersionReference } from "../../../shared/references/index.js";
import { Version } from "../../../shared/version/Version.js";
import type { AuthorizePublicationCommand, CreatePublicationCommand, PreparePublicationCommand, PublicationAuditInput, PublicationObservationInput, RecordPublicationOutcomeCommand, ArchivePublicationCommand } from "./PublicationCommands.js";
import { PublicationAuthorization, type PublicationAuthorizationSnapshot } from "./PublicationAuthorization.js";
import { PublicationCreated, PublicationPrepared, PublicationAuthorized, PublicationArchived, PublicationDomainEvent, PublicationOutcomeRecorded, PublicationPublished } from "./PublicationEvents.js";
import { PublicationEligibility, type PublicationEligibilitySnapshot } from "./PublicationEligibility.js";
import { PublicationPackage, type PublicationPackageSnapshot } from "./PublicationPackage.js";
import { evidenceFromJSON, lineageFromJSON } from "./PublicationSerialization.js";
import { PublicationRecord, PublicationVersion, PublicationVersionNumber, type PublicationVersionSnapshot } from "./PublicationVersion.js";
import { PublicationResult, PublicationStatus, type PublicationStatusType } from "./PublicationTypes.js";

export interface PublicationSnapshot {
  readonly schemaVersion: 1;
  readonly publicationId: string;
  readonly tenantId: string;
  readonly missionReference: JsonObject;
  readonly package: PublicationPackageSnapshot;
  readonly status: PublicationStatusType;
  readonly preparedEligibility: PublicationEligibilitySnapshot | null;
  readonly authorization: PublicationAuthorizationSnapshot | null;
  readonly versions: readonly PublicationVersionSnapshot[];
  readonly currentVersionId: string | null;
  readonly consumedObservationBatchKeys: readonly string[];
  readonly evidence: readonly JsonObject[];
  readonly lineage: readonly JsonObject[];
  readonly version: number;
}

export class Publication extends AggregateRoot<PublicationId> {
  private readonly publicationTenantId: TenantId;
  private readonly publicationMissionReference: MissionReference;
  private readonly publicationPackage: PublicationPackage;
  private publicationStatus: PublicationStatusType;
  private preparedEligibility: PublicationEligibility | null;
  private publicationAuthorization: PublicationAuthorization | null;
  private publicationVersions: PublicationVersion[];
  private publicationCurrentVersionId: string | null;
  private readonly consumedBatchKeys: Set<string>;
  private publicationEvidence: EvidenceReference[];
  private publicationLineage: LineageReference[];

  private constructor(props: {
    readonly id: PublicationId; readonly tenantId: TenantId; readonly missionReference: MissionReference; readonly publicationPackage: PublicationPackage;
    readonly status: PublicationStatusType; readonly preparedEligibility: PublicationEligibility | null; readonly authorization: PublicationAuthorization | null;
    readonly versions: readonly PublicationVersion[]; readonly currentVersionId: string | null; readonly consumedObservationBatchKeys: readonly string[];
    readonly evidence: readonly EvidenceReference[]; readonly lineage: readonly LineageReference[]; readonly version: Version;
  }) {
    super(props.id, props.version);
    this.publicationTenantId = props.tenantId;
    this.publicationMissionReference = props.missionReference;
    this.publicationPackage = props.publicationPackage;
    this.publicationStatus = props.status;
    this.preparedEligibility = props.preparedEligibility;
    this.publicationAuthorization = props.authorization;
    this.publicationVersions = [...props.versions];
    this.publicationCurrentVersionId = props.currentVersionId;
    this.consumedBatchKeys = new Set(props.consumedObservationBatchKeys);
    this.publicationEvidence = [...props.evidence];
    this.publicationLineage = [...props.lineage];
    this.assertState();
  }

  public static create(command: CreatePublicationCommand): Publication {
    const publicationPackage = PublicationPackage.create({
      id: command.packageId, tenantId: command.tenantId, items: command.items, destinations: command.destinations,
      knowledgeReferences: command.knowledgeReferences ?? [], metadata: command.metadata ?? {}, createdAt: command.occurredAt
    });
    const publication = new Publication({
      id: command.publicationId, tenantId: command.tenantId, missionReference: command.missionReference,
      publicationPackage, status: PublicationStatus.DRAFT, preparedEligibility: null, authorization: null,
      versions: [], currentVersionId: null, consumedObservationBatchKeys: [], evidence: command.evidence,
      lineage: command.lineage, version: Version.initial()
    });
    publication.requireAudit(command);
    publication.incrementVersion();
    publication.emit(PublicationCreated, command, { packageId: publicationPackage.id.toString(), status: PublicationStatus.DRAFT });
    return publication;
  }

  public static rehydrate(snapshot: PublicationSnapshot): Publication {
    if (snapshot.schemaVersion !== 1) throw new InvariantViolation("Unsupported Publication snapshot schema");
    return new Publication({
      id: PublicationId.from(snapshot.publicationId), tenantId: TenantId.from(snapshot.tenantId),
      missionReference: MissionReference.fromJSON(snapshot.missionReference as { id: string; tenantId: string }),
      publicationPackage: PublicationPackage.fromSnapshot(snapshot.package), status: snapshot.status,
      preparedEligibility: snapshot.preparedEligibility === null ? null : PublicationEligibility.fromSnapshot(snapshot.preparedEligibility),
      authorization: snapshot.authorization === null ? null : PublicationAuthorization.fromSnapshot(snapshot.authorization),
      versions: snapshot.versions.map(PublicationVersion.fromSnapshot), currentVersionId: snapshot.currentVersionId,
      consumedObservationBatchKeys: snapshot.consumedObservationBatchKeys,
      evidence: snapshot.evidence.map((item) => evidenceFromJSON(item as { evidenceId: string; source: string; type: string; capturedAt: string; locator?: string; limitation?: string })),
      lineage: snapshot.lineage.map((item) => lineageFromJSON(item as { sourceId: string; targetId: string; relationship: string; declaredAt: string; reason?: string })),
      version: Version.from(snapshot.version)
    });
  }

  public get tenantId(): TenantId { return this.publicationTenantId; }
  public get missionReference(): MissionReference { return this.publicationMissionReference; }
  public get package(): PublicationPackage { return PublicationPackage.fromSnapshot(this.publicationPackage.toSnapshot()); }
  public get status(): PublicationStatusType { return this.publicationStatus; }
  public get authorization(): PublicationAuthorization | null { return this.publicationAuthorization === null ? null : PublicationAuthorization.fromSnapshot(this.publicationAuthorization.toSnapshot()); }
  public get currentVersionId(): PublicationVersionReference | null {
    return this.publicationCurrentVersionId === null ? null : new PublicationVersionReference(PublicationVersionId.from(this.publicationCurrentVersionId), this.tenantId);
  }
  public get versions(): readonly PublicationVersion[] { return this.publicationVersions.map((item) => PublicationVersion.fromSnapshot(item.toSnapshot())); }
  public get reference(): PublicationReference { return new PublicationReference(this.id, this.tenantId); }

  public prepare(command: PreparePublicationCommand, eligibility: PublicationEligibility): void {
    if (this.status !== PublicationStatus.DRAFT) throw new InvariantViolation(`Publication cannot prepare from ${this.status}`);
    if (!eligibility.tenantId.equals(this.tenantId)) throw new InvariantViolation("PublicationEligibility must belong to the Publication Tenant");
    this.preparedEligibility = eligibility;
    this.publicationStatus = PublicationStatus.READY;
    this.mutate(command);
    this.emit(PublicationPrepared, command, { reviewReference: eligibility.reviewReference.toJSON(), reviewConclusionId: eligibility.reviewConclusionId });
  }

  public authorize(command: AuthorizePublicationCommand, authorization: PublicationAuthorization): void {
    if (this.status !== PublicationStatus.READY) throw new InvariantViolation(`Publication cannot authorize from ${this.status}`);
    if (!authorization.tenantId.equals(this.tenantId)) throw new InvariantViolation("PublicationAuthorization must belong to the Publication Tenant");
    this.publicationAuthorization = authorization;
    this.publicationStatus = PublicationStatus.AUTHORIZED_FOR_CONNECTOR;
    this.mutate(command);
    this.emit(PublicationAuthorized, command, { decisionReference: authorization.decisionReference.toJSON(), authorityReferences: authorization.authorityReferences.map((item) => item.toJSON()) });
  }

  public recordOutcome(command: RecordPublicationOutcomeCommand): void {
    if (this.status !== PublicationStatus.AUTHORIZED_FOR_CONNECTOR) throw new InvariantViolation(`Publication cannot record outcome from ${this.status}`);
    if (this.publicationAuthorization === null) throw new InvariantViolation("Publication requires authorization before external observations");
    const batchKey = command.observationBatchKey.trim();
    if (batchKey.length === 0) throw new InvariantViolation("Publication outcome requires observationBatchKey");
    if (this.consumedBatchKeys.has(batchKey)) throw new InvariantViolation("Publication observationBatchKey was already recorded");
    const records = this.buildRecords(command.observations);
    const nextNumber = this.publicationVersions.length === 0 ? PublicationVersionNumber.first() : this.publicationVersions[this.publicationVersions.length - 1]!.versionNumber.next();
    const publicationVersion = PublicationVersion.create({
      id: command.publicationVersionId, tenantId: this.tenantId, versionNumber: nextNumber, observationBatchKey: batchKey,
      package: this.publicationPackage, authorization: this.publicationAuthorization, records, createdAt: command.occurredAt
    });
    this.publicationVersions = [...this.publicationVersions, publicationVersion];
    this.publicationCurrentVersionId = publicationVersion.id.toString();
    this.consumedBatchKeys.add(batchKey);
    if (publicationVersion.result === PublicationResult.SUCCESS) this.publicationStatus = PublicationStatus.PUBLISHED;
    this.mutate(command);
    const payload = {
      publicationVersionId: publicationVersion.id.toString(), publicationVersionNumber: publicationVersion.versionNumber.value,
      result: publicationVersion.result, recordIds: publicationVersion.records.map((item) => item.id.toString()),
      connectorReferences: publicationVersion.records.map((item) => item.connectorReference.toJSON())
    };
    this.emit(PublicationOutcomeRecorded, command, payload);
    if (publicationVersion.result === PublicationResult.SUCCESS) this.emit(PublicationPublished, command, payload);
  }

  public archive(command: ArchivePublicationCommand, authorization: PublicationAuthorization): void {
    if (this.status !== PublicationStatus.PUBLISHED) throw new InvariantViolation(`Publication cannot archive from ${this.status}`);
    if (!authorization.tenantId.equals(this.tenantId)) throw new InvariantViolation("Publication archive authorization must belong to the Publication Tenant");
    this.publicationStatus = PublicationStatus.ARCHIVED;
    this.mutate(command);
    this.emit(PublicationArchived, command, { decisionReference: authorization.decisionReference.toJSON(), authorityReferences: authorization.authorityReferences.map((item) => item.toJSON()) });
  }

  public toSnapshot(): PublicationSnapshot {
    return deepFreeze({
      schemaVersion: 1, publicationId: this.id.toString(), tenantId: this.tenantId.toString(), missionReference: this.missionReference.toJSON(),
      package: this.publicationPackage.toSnapshot(), status: this.status, preparedEligibility: this.preparedEligibility?.toSnapshot() ?? null,
      authorization: this.publicationAuthorization?.toSnapshot() ?? null, versions: this.publicationVersions.map((item) => item.toSnapshot()),
      currentVersionId: this.publicationCurrentVersionId, consumedObservationBatchKeys: [...this.consumedBatchKeys].sort(),
      evidence: this.publicationEvidence.map((item) => item.toJSON()), lineage: this.publicationLineage.map((item) => item.toJSON()), version: this.version.value
    });
  }
  public serialize(): string { return stableSerialize(this.toSnapshot() as unknown as JsonObject); }

  private buildRecords(observations: readonly PublicationObservationInput[]): PublicationRecord[] {
    const expected = new Set(this.publicationPackage.destinations.map((item) => item.key));
    if (observations.length !== expected.size) throw new InvariantViolation("Publication outcome requires exact destination coverage");
    const seen = new Set<string>();
    const records: PublicationRecord[] = [];
    for (const observation of observations) {
      const destinationKey = observation.destinationKey.trim();
      if (!expected.has(destinationKey)) throw new InvariantViolation("Publication outcome contains an undeclared destination", { destinationKey });
      if (seen.has(destinationKey)) throw new InvariantViolation("Publication outcome contains duplicate destination records", { destinationKey });
      seen.add(destinationKey);
      records.push(new PublicationRecord({
        id: observation.recordId, tenantId: this.tenantId, connectorReference: observation.connectorReference, destinationKey,
        result: observation.result, observedAt: observation.observedAt, ...(observation.externalIdentifier === undefined ? {} : { externalIdentifier: observation.externalIdentifier }),
        ...(observation.failureReason === undefined ? {} : { failureReason: observation.failureReason }), evidence: observation.evidence, metadata: observation.metadata ?? {}
      }));
    }
    for (const destinationKey of expected) if (!seen.has(destinationKey)) throw new InvariantViolation("Publication outcome is missing a destination", { destinationKey });
    return records;
  }

  private mutate(command: PublicationAuditInput): void {
    this.requireAudit(command);
    this.publicationEvidence = [...this.publicationEvidence, ...command.evidence.filter((item) => !this.publicationEvidence.some((known) => known.evidenceId.equals(item.evidenceId)))];
    this.publicationLineage = [...this.publicationLineage, ...command.lineage.filter((item) => !this.publicationLineage.some((known) => known.equals(item)))];
    this.incrementVersion();
    this.assertState();
  }
  private requireAudit(command: PublicationAuditInput): void {
    if (command.reason.trim().length === 0 || command.evidence.length === 0 || command.lineage.length === 0) throw new InvariantViolation("Publication mutation requires reason, Evidence and Lineage");
  }
  private emit(EventType: new (props: import("./PublicationEvents.js").PublicationEventProps) => PublicationDomainEvent, command: PublicationAuditInput & { readonly correlationId: CorrelationId; readonly causationId?: CausationId }, payload: JsonObject = {}): void {
    this.recordEvent(new EventType({ aggregateId: this.id.toString(), tenantId: this.tenantId, occurredAt: command.occurredAt, version: this.version, correlationId: command.correlationId, ...(command.causationId === undefined ? {} : { causationId: command.causationId }), reason: command.reason, payload }));
  }
  private assertState(): void {
    if (!this.publicationMissionReference.tenantId.equals(this.tenantId) || !this.publicationPackage.tenantId.equals(this.tenantId)) throw new InvariantViolation("Publication cannot cross Tenant boundaries");
    if (this.publicationCurrentVersionId === null && this.publicationVersions.length !== 0) throw new InvariantViolation("Publication currentVersionId is required when versions exist");
    if (this.publicationCurrentVersionId !== null && !this.publicationVersions.some((item) => item.id.toString() === this.publicationCurrentVersionId)) throw new InvariantViolation("Publication currentVersionId must point to an existing PublicationVersion");
    if (new Set(this.publicationVersions.map((item) => item.observationBatchKey)).size !== this.publicationVersions.length) throw new InvariantViolation("Publication observationBatchKey must be unique per Publication");
  }
}
