import type { KnowledgeReference, PolicyReference } from "../../../shared/references/index.js";

export interface WorkflowKnowledgePort {
  validateKnowledge(reference: KnowledgeReference): Promise<void>;
  validatePolicy(reference: PolicyReference): Promise<void>;
}
