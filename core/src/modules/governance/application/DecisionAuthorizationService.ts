import { assertSameTenant } from "../../../shared/tenant/tenantRules.js";
import type { GovernanceAuthorizationPort, GovernedMissionCommand, AuthorizationResult } from "../../../application/ports/GovernanceAuthorizationPort.js";
import type { DecisionRepository } from "../ports/DecisionRepository.js";
import { DecisionStatus } from "../domain/DecisionStatus.js";

export class DecisionAuthorizationService implements GovernanceAuthorizationPort {
  public constructor(private readonly decisions: DecisionRepository) {}
  public async authorize(command: GovernedMissionCommand): Promise<AuthorizationResult> {
    const decision = await this.decisions.findById(command.tenantId, command.decisionReference.id);
    if (decision === null) return { status: "REJECTED", reason: "Decision was not found in the requested Tenant" };
    try {
      assertSameTenant(decision.tenantId, command.tenantId);
      assertSameTenant(decision.tenantId, command.decisionReference);
      assertSameTenant(decision.tenantId, command.authorityReference);
      assertSameTenant(decision.tenantId, command.approvalReference);
    } catch { return { status: "REJECTED", reason: "Governance authorization crossed a Tenant boundary" }; }
    if (decision.status !== DecisionStatus.FINALIZED || decision.approval === null || decision.approval.outcome === "REJECTED") return { status: "REJECTED", reason: "Decision is not finalized with an approving outcome" };
    if (!decision.missionId.equals(command.missionId)) return { status: "REJECTED", reason: "Decision does not authorize the requested Mission" };
    if (!decision.authorityReference.equals(command.authorityReference)) return { status: "REJECTED", reason: "Authority reference does not match the Decision" };
    if (decision.approvalReference === undefined || !decision.approvalReference.equals(command.approvalReference)) return { status: "REJECTED", reason: "Approval reference does not match the Decision" };
    return { status: "AUTHORIZED" };
  }
}
