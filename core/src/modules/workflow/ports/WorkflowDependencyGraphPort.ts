import type { StageId } from "../../../shared/identity/index.js";

export interface WorkflowDependencyGraphPort {
  wouldCreateDependencyCycle(input: { readonly stageId: StageId; readonly dependencies: readonly StageId[]; readonly existingEdges: readonly { readonly stageId: StageId; readonly dependencies: readonly StageId[] }[] }): Promise<boolean>;
}
