import type { TenantContext } from "./TenantContext.js";

export interface TenantContextProvider {
  getCurrent(): TenantContext | null;
}
