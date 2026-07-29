import { Decision } from "../domain/Decision.js";
import type { ApproveDecisionCommand } from "../domain/GovernanceCommands.js";
import type { DecisionRepository } from "../ports/DecisionRepository.js";
import { ValidationError } from "../../../shared/errors/ValidationError.js";

export class ApproveDecision {
  public constructor(private readonly repository: DecisionRepository) {}
  public async execute(input: { readonly tenantId: import("../../../shared/identity/TenantId.js").TenantId; readonly decisionId: import("../../../shared/identity/DecisionId.js").DecisionId; readonly expectedVersion: import("../../../shared/version/Version.js").Version; readonly command: ApproveDecisionCommand }): Promise<Decision> { const decision = await this.repository.findById(input.tenantId, input.decisionId); if (decision === null) throw new ValidationError("Decision was not found"); decision.approve(input.command); await this.repository.save(decision, input.expectedVersion); return decision; }
}
