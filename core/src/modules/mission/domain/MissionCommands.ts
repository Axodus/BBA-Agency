import type { EvidenceReference } from "../../../shared/evidence/EvidenceReference.js";
import type { LineageReference } from "../../../shared/lineage/LineageReference.js";
import type { MissionId } from "../../../shared/identity/MissionId.js";
import type { TenantId } from "../../../shared/identity/TenantId.js";
import type { Version } from "../../../shared/version/Version.js";
import type { ApprovalReference, AuthorityReference, DecisionReference } from "../../../shared/references/index.js";
import type { MissionIntent } from "./MissionIntent.js";
import type { MissionMetadata } from "./MissionMetadata.js";
import type { MissionOutcome } from "./MissionOutcome.js";
import type { MissionStatus } from "./MissionStatus.js";

export interface MissionDecisionContext {
  readonly actorReference: string;
  readonly authorityReference: string | AuthorityReference;
  readonly decisionReference?: DecisionReference;
  readonly approvalReference?: ApprovalReference;
  readonly reason: string;
  readonly occurredAt: string;
  readonly evidence: readonly EvidenceReference[];
}

export interface CreateMissionCommand {
  readonly missionId: MissionId;
  readonly tenantId: TenantId;
  readonly metadata: MissionMetadata;
  readonly intent: MissionIntent;
  readonly evidence: readonly EvidenceReference[];
  readonly lineage: readonly LineageReference[];
}

export interface RenameMissionCommand {
  readonly title: string;
  readonly occurredAt: string;
}

export interface UpdateMissionDescriptionCommand {
  readonly description: string;
  readonly occurredAt: string;
}

export interface ResumeMissionCommand extends MissionDecisionContext {
  readonly targetStatus: typeof MissionStatus.PREPARED | typeof MissionStatus.IN_PROGRESS;
}

export interface CompleteMissionCommand extends MissionDecisionContext {
  readonly outcome: MissionOutcome;
}

export interface ArchiveMissionCommand extends MissionDecisionContext {}

export interface RegisterMissionEvidenceCommand {
  readonly evidence: EvidenceReference;
  readonly occurredAt: string;
}

export interface RegisterMissionLineageCommand {
  readonly lineage: LineageReference;
  readonly occurredAt: string;
}

export interface PersistedMissionCommand<T> {
  readonly tenantId: TenantId;
  readonly missionId: MissionId;
  readonly expectedVersion: Version;
  readonly command: T;
}
