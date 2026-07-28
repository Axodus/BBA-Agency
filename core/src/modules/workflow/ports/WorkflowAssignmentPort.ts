import type { WorkAssignmentReference } from "../../../shared/references/index.js";

export interface WorkflowAssignmentPort {
  validateAssignment(reference: WorkAssignmentReference): Promise<void>;
  notifyAssignment(reference: WorkAssignmentReference): Promise<void>;
}
