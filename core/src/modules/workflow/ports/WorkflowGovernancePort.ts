import type { TenantId } from "../../../shared/identity/index.js";
import type { WorkflowReference, WorkflowExecutionReference } from "../../../shared/references/index.js";

export type WorkflowAuthorizationResult = "AUTHORIZED" | "REJECTED";

export interface WorkflowGovernancePort {
  authorizeTransition(input: { readonly tenantId: TenantId; readonly target: WorkflowReference | WorkflowExecutionReference; readonly transition: string; readonly reason: string }): Promise<WorkflowAuthorizationResult>;
  authorizeCancellation(input: { readonly tenantId: TenantId; readonly target: WorkflowExecutionReference; readonly reason: string }): Promise<WorkflowAuthorizationResult>;
}
