import type { CausationId, CorrelationId, JsonObject } from "../../../shared/common/index.js";
import type { EvidenceReference } from "../../../shared/evidence/EvidenceReference.js";
import type { PublicationId, PublicationPackageId, PublicationRecordId, PublicationVersionId, TenantId } from "../../../shared/identity/index.js";
import type { LineageReference } from "../../../shared/lineage/LineageReference.js";
import type { AssetReference, AssetVersionReference, ConnectorReference, KnowledgeReference, MissionReference } from "../../../shared/references/index.js";
import type { PublicationDestination } from "./PublicationPackage.js";
import type { PublicationRecordResultType } from "./PublicationTypes.js";

export interface PublicationAuditInput {
  readonly reason: string;
  readonly occurredAt: string;
  readonly correlationId: CorrelationId;
  readonly causationId?: CausationId;
  readonly evidence: readonly EvidenceReference[];
  readonly lineage: readonly LineageReference[];
}

export interface PublicationPackageItemInput {
  readonly assetReference: AssetReference;
  readonly assetVersionReference: AssetVersionReference;
}

export interface CreatePublicationCommand extends PublicationAuditInput {
  readonly publicationId: PublicationId;
  readonly packageId: PublicationPackageId;
  readonly tenantId: TenantId;
  readonly missionReference: MissionReference;
  readonly items: readonly PublicationPackageItemInput[];
  readonly destinations: readonly PublicationDestination[];
  readonly knowledgeReferences?: readonly KnowledgeReference[];
  readonly metadata?: JsonObject;
}

export interface PreparePublicationCommand extends PublicationAuditInput {}
export interface AuthorizePublicationCommand extends PublicationAuditInput {}
export interface ArchivePublicationCommand extends PublicationAuditInput {}

export interface PublicationObservationInput {
  readonly recordId: PublicationRecordId;
  readonly connectorReference: ConnectorReference;
  readonly destinationKey: string;
  readonly result: PublicationRecordResultType;
  readonly observedAt: string;
  readonly externalIdentifier?: string;
  readonly failureReason?: string;
  readonly evidence: readonly EvidenceReference[];
  readonly metadata?: JsonObject;
}

export interface RecordPublicationOutcomeCommand extends PublicationAuditInput {
  readonly publicationVersionId: PublicationVersionId;
  readonly observationBatchKey: string;
  readonly observations: readonly PublicationObservationInput[];
}
