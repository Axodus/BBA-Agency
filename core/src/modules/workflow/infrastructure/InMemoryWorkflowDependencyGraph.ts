import type { StageId } from "../../../shared/identity/index.js";
import type { WorkflowDependencyGraphPort } from "../ports/WorkflowDependencyGraphPort.js";

export class InMemoryWorkflowDependencyGraph implements WorkflowDependencyGraphPort {
  public async wouldCreateDependencyCycle(input: { readonly stageId: StageId; readonly dependencies: readonly StageId[]; readonly existingEdges: readonly { readonly stageId: StageId; readonly dependencies: readonly StageId[] }[] }): Promise<boolean> {
    const edges = new Map(input.existingEdges.map((edge) => [edge.stageId.toString(), [...edge.dependencies.map((item) => item.toString())]]));
    edges.set(input.stageId.toString(), input.dependencies.map((item) => item.toString()));
    const visiting = new Set<string>();
    const visited = new Set<string>();
    const visit = (stageId: string): boolean => {
      if (visited.has(stageId)) return false;
      if (visiting.has(stageId)) return true;
      visiting.add(stageId);
      for (const dependency of edges.get(stageId) ?? []) {
        if (visit(dependency)) return true;
      }
      visiting.delete(stageId);
      visited.add(stageId);
      return false;
    };
    return [...edges.keys()].some(visit);
  }
}
