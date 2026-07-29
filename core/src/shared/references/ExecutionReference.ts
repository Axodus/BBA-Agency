import { ExecutionId } from "../identity/ExecutionId.js";
import { TenantId } from "../identity/TenantId.js";
import { TenantReference } from "./TenantReference.js";

export class ExecutionReference extends TenantReference<ExecutionId> {
  public constructor(executionId: ExecutionId, tenantId: TenantId) { super(executionId, tenantId); }
  public static fromJSON(value: { readonly id: string; readonly tenantId: string }): ExecutionReference {
    return new ExecutionReference(ExecutionId.from(value.id), TenantId.from(value.tenantId));
  }
}
