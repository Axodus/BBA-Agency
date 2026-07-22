import { Decision } from "../domain/Decision.js";
import type { CreateDecisionCommand } from "../domain/GovernanceCommands.js";
import type { DecisionRepository } from "../ports/DecisionRepository.js";
import { Version } from "../../../shared/version/Version.js";

export class CreateDecision {
  public constructor(private readonly repository: DecisionRepository) {}
  public async execute(command: CreateDecisionCommand): Promise<Decision> { const decision = Decision.create(command); await this.repository.save(decision, Version.initial()); return decision; }
}
