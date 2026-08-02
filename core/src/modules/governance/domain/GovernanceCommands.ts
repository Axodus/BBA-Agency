import type { CorrelationId, CausationId } from "../../../shared/common/index.js";
import type { EvidenceReference } from "../../../shared/evidence/EvidenceReference.js";
import type { AssignmentId, AuthorityId, DecisionId, ApprovalId, MissionId, TenantId } from "../../../shared/identity/index.js";
import type { Version } from "../../../shared/version/Version.js";
import type { LineageReference } from "../../../shared/lineage/LineageReference.js";
import type { AuthorityLevelType } from "./AuthorityLevel.js";
import type { AuthorityScope } from "./AuthorityScope.js";
import type { ApprovalOutcomeType } from "./ApprovalOutcome.js";
import type { AssignmentPeriod } from "./AssignmentPeriod.js";
import type { DecisionTypeValue } from "./DecisionType.js";
import type { HumanActorReference } from "./HumanActorReference.js";
import type { AuthorityReference, AssignmentReference, DecisionReference } from "../../../shared/references/index.js";

export interface GovernanceAuditInput {
  readonly actorReference: HumanActorReference;
  readonly reason: string;
  readonly occurredAt: string;
  readonly correlationId: CorrelationId;
  readonly causationId?: CausationId;
  readonly evidence: readonly EvidenceReference[];
  readonly lineage: readonly LineageReference[];
}

export interface CreateAuthorityCommand extends GovernanceAuditInput {
  readonly authorityId: AuthorityId;
  readonly tenantId: TenantId;
  readonly level: AuthorityLevelType;
  readonly scope: AuthorityScope;
}
export interface ActivateAuthorityCommand extends GovernanceAuditInput {}
export interface DeactivateAuthorityCommand extends GovernanceAuditInput {}
export interface SuspendAuthorityCommand extends GovernanceAuditInput { readonly until: string; }
export interface AssignAuthorityCommand extends GovernanceAuditInput {
  readonly assignmentId: AssignmentId;
  readonly delegateReference: HumanActorReference;
  readonly scope: AuthorityScope;
  readonly period: AssignmentPeriod;
}
export interface RevokeAssignmentCommand extends GovernanceAuditInput { readonly assignmentId: AssignmentId; }
export interface ExpireAssignmentCommand extends GovernanceAuditInput { readonly assignmentId: AssignmentId; }

export interface CreateDecisionCommand extends GovernanceAuditInput {
  readonly decisionId: DecisionId;
  readonly tenantId: TenantId;
  readonly missionId: MissionId;
  readonly decisionType: DecisionTypeValue;
  readonly authorityReference: AuthorityReference;
  readonly assignmentReference?: AssignmentReference;
}
export interface ApproveDecisionCommand extends GovernanceAuditInput {
  readonly outcome?: ApprovalOutcomeType;
  readonly approvalId: ApprovalId;
  readonly authorityReference: AuthorityReference;
  readonly assignmentReference?: AssignmentReference;
}
export interface RejectDecisionCommand extends GovernanceAuditInput {
  readonly approvalId: ApprovalId;
  readonly authorityReference: AuthorityReference;
  readonly assignmentReference?: AssignmentReference;
}
export interface FinalizeDecisionCommand extends GovernanceAuditInput {}

export interface PersistedGovernanceCommand<T> {
  readonly tenantId: TenantId;
  readonly id: AuthorityId | DecisionId;
  readonly expectedVersion: Version;
  readonly command: T;
}

export interface DecisionReferenceInput {
  readonly decisionReference: DecisionReference;
  readonly missionId: MissionId;
}
