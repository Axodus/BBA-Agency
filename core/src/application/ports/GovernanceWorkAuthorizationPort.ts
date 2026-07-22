import type { EvidenceReference } from "../../shared/evidence/EvidenceReference.js";
import type { TenantId } from "../../shared/identity/TenantId.js";
import type { LineageReference } from "../../shared/lineage/LineageReference.js";
import type { AssignmentReference, AuthorityReference, DecisionReference, MissionReference } from "../../shared/references/index.js";
import type { AuthorizationResult } from "./GovernanceAuthorizationPort.js";

export interface GovernedWorkCommand {
  readonly tenantId: TenantId; readonly missionReference: MissionReference; readonly commandName: string;
  readonly authorityReference: AuthorityReference; readonly decisionReference: DecisionReference; readonly governanceAssignmentReference?: AssignmentReference;
  readonly evidence: readonly EvidenceReference[]; readonly lineage: readonly LineageReference[]; readonly reason: string; readonly occurredAt: string;
}

export interface GovernanceWorkAuthorizationPort { authorizeWork(command: GovernedWorkCommand): Promise<AuthorizationResult>; }
