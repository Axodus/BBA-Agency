import type { Decision } from "../domain/Decision.js";
import type { DecisionId, TenantId } from "../../../shared/identity/index.js";
import type { Version } from "../../../shared/version/Version.js";

export interface DecisionRepository {
  save(decision: Decision, expectedVersion: Version): Promise<void>;
  findById(tenantId: TenantId, decisionId: DecisionId): Promise<Decision | null>;
  exists(tenantId: TenantId, decisionId: DecisionId): Promise<boolean>;
}
