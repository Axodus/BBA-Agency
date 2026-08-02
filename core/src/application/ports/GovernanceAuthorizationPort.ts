import type { EvidenceReference } from "../../shared/evidence/EvidenceReference.js";
import type { MissionId, TenantId } from "../../shared/identity/index.js";
import type { ApprovalReference, AuthorityReference, DecisionReference } from "../../shared/references/index.js";

export interface GovernedMissionCommand {
  readonly tenantId: TenantId;
  readonly missionId: MissionId;
  readonly commandName: string;
  readonly decisionReference: DecisionReference;
  readonly authorityReference: AuthorityReference;
  readonly approvalReference: ApprovalReference;
  readonly evidence: readonly EvidenceReference[];
  readonly reason: string;
  readonly occurredAt: string;
}

export type AuthorizationResult =
  | { readonly status: "AUTHORIZED" }
  | { readonly status: "REJECTED"; readonly reason: string };

export interface GovernanceAuthorizationPort {
  authorize(command: GovernedMissionCommand): Promise<AuthorizationResult>;
}
