import { TenantViolation } from "../errors/TenantViolation.js";
import { TenantId } from "../identity/TenantId.js";
import type { TenantContext } from "./TenantContext.js";

export type TenantScoped = TenantContext | { readonly tenantId: TenantId };

function tenantIdOf(value: TenantId | TenantScoped): TenantId {
  return value instanceof TenantId ? value : value.tenantId;
}

export function sameTenant(left: TenantId | TenantScoped, right: TenantId | TenantScoped): boolean {
  return tenantIdOf(left).equals(tenantIdOf(right));
}

export function assertSameTenant(left: TenantId | TenantScoped, right: TenantId | TenantScoped): void {
  if (!sameTenant(left, right)) {
    throw new TenantViolation("Tenant boundary does not permit this operation", {
      leftTenantId: tenantIdOf(left).toString(),
      rightTenantId: tenantIdOf(right).toString()
    });
  }
}

export function assertCrossTenantForbidden(left: TenantId | TenantScoped, right: TenantId | TenantScoped): void {
  assertSameTenant(left, right);
}
