import type { TenantContext } from "./TenantContext.js";

export interface CurrentTenantPort {
  currentTenant(): TenantContext | null;
}
