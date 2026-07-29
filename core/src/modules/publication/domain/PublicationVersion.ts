import { assertCanonicalTimestamp, deepFreeze, type JsonObject } from "../../../shared/common/index.js";
import type { EvidenceReference } from "../../../shared/evidence/EvidenceReference.js";
import { InvariantViolation } from "../../../shared/errors/InvariantViolation.js";
import { PublicationRecordId, PublicationVersionId, TenantId } from "../../../shared/identity/index.js";
import { ConnectorReference, PublicationVersionReference } from "../../../shared/references/index.js";
import { evidenceFromJSON } from "./PublicationSerialization.js";
import { PublicationAuthorization, type PublicationAuthorizationSnapshot } from "./PublicationAuthorization.js";
import { PublicationPackage, type PublicationPackageSnapshot } from "./PublicationPackage.js";
import { PublicationRecordResult, PublicationResult, type PublicationRecordResultType, type PublicationResultType } from "./PublicationTypes.js";

export class PublicationVersionNumber {
  public readonly value: number;
  private constructor(value: number) {
    if (!Number.isInteger(value) || value < 1) throw new InvariantViolation("PublicationVersionNumber must be a positive integer");
    this.value = value;
    Object.freeze(this);
  }
  public static first(): PublicationVersionNumber { return new PublicationVersionNumber(1); }
  public static from(value: number): PublicationVersionNumber { return new PublicationVersionNumber(value); }
  public next(): PublicationVersionNumber { return new PublicationVersionNumber(this.value + 1); }
}

export interface PublicationManifestSnapshot {
  readonly packageSnapshot: PublicationPackageSnapshot;
  readonly authorizationSnapshot: PublicationAuthorizationSnapshot;
  readonly attemptNumber: number;
  readonly createdAt: string;
}
export class PublicationManifest {
  public readonly packageSnapshot: PublicationPackageSnapshot;
  public readonly authorizationSnapshot: PublicationAuthorizationSnapshot;
  public readonly attemptNumber: PublicationVersionNumber;
  public readonly createdAt: string;
  public constructor(props: { readonly packageSnapshot: PublicationPackageSnapshot; readonly authorizationSnapshot: PublicationAuthorizationSnapshot; readonly attemptNumber: PublicationVersionNumber; readonly createdAt: string }) {
    this.packageSnapshot = deepFreeze(props.packageSnapshot);
    this.authorizationSnapshot = deepFreeze(props.authorizationSnapshot);
    this.attemptNumber = props.attemptNumber;
    this.createdAt = assertCanonicalTimestamp(props.createdAt, "createdAt");
    Object.freeze(this);
  }
  public toSnapshot(): PublicationManifestSnapshot { return deepFreeze({ packageSnapshot: this.packageSnapshot, authorizationSnapshot: this.authorizationSnapshot, attemptNumber: this.attemptNumber.value, createdAt: this.createdAt }); }
  public static fromSnapshot(snapshot: PublicationManifestSnapshot): PublicationManifest {
    return new PublicationManifest({ packageSnapshot: snapshot.packageSnapshot, authorizationSnapshot: snapshot.authorizationSnapshot, attemptNumber: PublicationVersionNumber.from(snapshot.attemptNumber), createdAt: snapshot.createdAt });
  }
}

export interface PublicationRecordSnapshot {
  readonly recordId: string;
  readonly tenantId: string;
  readonly connectorReference: JsonObject;
  readonly destinationKey: string;
  readonly result: PublicationRecordResultType;
  readonly observedAt: string;
  readonly externalIdentifier: string | null;
  readonly failureReason: string | null;
  readonly evidence: readonly JsonObject[];
  readonly metadata: JsonObject;
}
export class PublicationRecord {
  public readonly id: PublicationRecordId;
  public readonly tenantId: TenantId;
  public readonly connectorReference: ConnectorReference;
  public readonly destinationKey: string;
  public readonly result: PublicationRecordResultType;
  public readonly observedAt: string;
  public readonly externalIdentifier: string | null;
  public readonly failureReason: string | null;
  public readonly evidence: readonly EvidenceReference[];
  public readonly metadata: JsonObject;
  public constructor(props: { readonly id: PublicationRecordId; readonly tenantId: TenantId; readonly connectorReference: ConnectorReference; readonly destinationKey: string; readonly result: PublicationRecordResultType; readonly observedAt: string; readonly externalIdentifier?: string; readonly failureReason?: string; readonly evidence: readonly EvidenceReference[]; readonly metadata?: JsonObject }) {
    if (!props.connectorReference.tenantId.equals(props.tenantId)) throw new InvariantViolation("PublicationRecord ConnectorReference must belong to the Publication Tenant");
    if (props.destinationKey.trim().length === 0 || props.evidence.length === 0) throw new InvariantViolation("PublicationRecord requires destination and Evidence");
    const externalIdentifier = props.externalIdentifier?.trim();
    const failureReason = props.failureReason?.trim();
    if (props.result === PublicationRecordResult.SUCCESS) {
      if (externalIdentifier === undefined || externalIdentifier.length === 0) throw new InvariantViolation("SUCCESS PublicationRecord requires externalIdentifier");
      if (failureReason !== undefined && failureReason.length > 0) throw new InvariantViolation("SUCCESS PublicationRecord forbids failureReason");
    } else if (props.result === PublicationRecordResult.FAILED) {
      if (failureReason === undefined || failureReason.length === 0) throw new InvariantViolation("FAILED PublicationRecord requires failureReason");
      if (externalIdentifier !== undefined && externalIdentifier.length > 0) throw new InvariantViolation("FAILED PublicationRecord forbids externalIdentifier");
    } else {
      throw new InvariantViolation("PublicationRecord result is not canonical");
    }
    this.id = props.id;
    this.tenantId = props.tenantId;
    this.connectorReference = props.connectorReference;
    this.destinationKey = props.destinationKey.trim();
    this.result = props.result;
    this.observedAt = assertCanonicalTimestamp(props.observedAt, "observedAt");
    this.externalIdentifier = externalIdentifier ?? null;
    this.failureReason = failureReason ?? null;
    this.evidence = Object.freeze([...props.evidence]);
    this.metadata = deepFreeze(props.metadata ?? {});
    Object.freeze(this);
  }
  public toSnapshot(): PublicationRecordSnapshot {
    return deepFreeze({
      recordId: this.id.toString(), tenantId: this.tenantId.toString(), connectorReference: this.connectorReference.toJSON(), destinationKey: this.destinationKey,
      result: this.result, observedAt: this.observedAt, externalIdentifier: this.externalIdentifier, failureReason: this.failureReason,
      evidence: this.evidence.map((item) => item.toJSON()), metadata: this.metadata
    });
  }
  public static fromSnapshot(snapshot: PublicationRecordSnapshot): PublicationRecord {
    return new PublicationRecord({
      id: PublicationRecordId.from(snapshot.recordId), tenantId: TenantId.from(snapshot.tenantId),
      connectorReference: ConnectorReference.fromJSON(snapshot.connectorReference as { id: string; tenantId: string }),
      destinationKey: snapshot.destinationKey, result: snapshot.result, observedAt: snapshot.observedAt,
      ...(snapshot.externalIdentifier === null ? {} : { externalIdentifier: snapshot.externalIdentifier }),
      ...(snapshot.failureReason === null ? {} : { failureReason: snapshot.failureReason }),
      evidence: snapshot.evidence.map((item) => evidenceFromJSON(item as { evidenceId: string; source: string; type: string; capturedAt: string; locator?: string; limitation?: string })),
      metadata: snapshot.metadata
    });
  }
}

export interface PublicationVersionSnapshot {
  readonly versionId: string;
  readonly tenantId: string;
  readonly versionNumber: number;
  readonly observationBatchKey: string;
  readonly manifest: PublicationManifestSnapshot;
  readonly records: readonly PublicationRecordSnapshot[];
  readonly result: PublicationResultType;
  readonly createdAt: string;
  readonly publishedAt: string | null;
}
export class PublicationVersion {
  public readonly id: PublicationVersionId;
  public readonly tenantId: TenantId;
  public readonly versionNumber: PublicationVersionNumber;
  public readonly observationBatchKey: string;
  public readonly manifest: PublicationManifest;
  public readonly records: readonly PublicationRecord[];
  public readonly result: PublicationResultType;
  public readonly createdAt: string;
  public readonly publishedAt: string | null;
  private constructor(props: { readonly id: PublicationVersionId; readonly tenantId: TenantId; readonly versionNumber: PublicationVersionNumber; readonly observationBatchKey: string; readonly manifest: PublicationManifest; readonly records: readonly PublicationRecord[]; readonly createdAt: string }) {
    if (props.observationBatchKey.trim().length === 0) throw new InvariantViolation("PublicationVersion requires observationBatchKey");
    if (props.records.length === 0) throw new InvariantViolation("PublicationVersion requires records");
    for (const record of props.records) if (!record.tenantId.equals(props.tenantId)) throw new InvariantViolation("PublicationVersion records must belong to the Publication Tenant");
    this.id = props.id;
    this.tenantId = props.tenantId;
    this.versionNumber = props.versionNumber;
    this.observationBatchKey = props.observationBatchKey.trim();
    this.manifest = props.manifest;
    this.records = Object.freeze([...props.records].sort((a, b) => a.destinationKey.localeCompare(b.destinationKey)));
    this.result = deriveResult(this.records);
    this.createdAt = assertCanonicalTimestamp(props.createdAt, "createdAt");
    this.publishedAt = this.result === PublicationResult.SUCCESS ? this.createdAt : null;
    Object.freeze(this);
  }
  public static create(props: { readonly id: PublicationVersionId; readonly tenantId: TenantId; readonly versionNumber: PublicationVersionNumber; readonly observationBatchKey: string; readonly package: PublicationPackage; readonly authorization: PublicationAuthorization; readonly records: readonly PublicationRecord[]; readonly createdAt: string }): PublicationVersion {
    return new PublicationVersion({
      id: props.id, tenantId: props.tenantId, versionNumber: props.versionNumber, observationBatchKey: props.observationBatchKey,
      manifest: new PublicationManifest({ packageSnapshot: props.package.toSnapshot(), authorizationSnapshot: props.authorization.toSnapshot(), attemptNumber: props.versionNumber, createdAt: props.createdAt }),
      records: props.records, createdAt: props.createdAt
    });
  }
  public get reference(): PublicationVersionReference { return new PublicationVersionReference(this.id, this.tenantId); }
  public toSnapshot(): PublicationVersionSnapshot {
    return deepFreeze({
      versionId: this.id.toString(), tenantId: this.tenantId.toString(), versionNumber: this.versionNumber.value,
      observationBatchKey: this.observationBatchKey, manifest: this.manifest.toSnapshot(), records: this.records.map((item) => item.toSnapshot()),
      result: this.result, createdAt: this.createdAt, publishedAt: this.publishedAt
    });
  }
  public static fromSnapshot(snapshot: PublicationVersionSnapshot): PublicationVersion {
    const version = new PublicationVersion({
      id: PublicationVersionId.from(snapshot.versionId), tenantId: TenantId.from(snapshot.tenantId),
      versionNumber: PublicationVersionNumber.from(snapshot.versionNumber), observationBatchKey: snapshot.observationBatchKey,
      manifest: PublicationManifest.fromSnapshot(snapshot.manifest), records: snapshot.records.map(PublicationRecord.fromSnapshot), createdAt: snapshot.createdAt
    });
    if (version.result !== snapshot.result || version.publishedAt !== snapshot.publishedAt) throw new InvariantViolation("PublicationVersion snapshot result is inconsistent with records");
    return version;
  }
}

function deriveResult(records: readonly PublicationRecord[]): PublicationResultType {
  const success = records.filter((item) => item.result === PublicationRecordResult.SUCCESS).length;
  if (success === records.length) return PublicationResult.SUCCESS;
  if (success === 0) return PublicationResult.FAILED;
  return PublicationResult.PARTIAL;
}
