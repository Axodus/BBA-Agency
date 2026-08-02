import type { ConnectorExecutionReference } from "../../../shared/references/index.js";
export interface ConnectorAuditPort { recordTechnicalEvidence(input: { readonly execution: ConnectorExecutionReference; readonly evidenceIds: readonly string[] }): Promise<void>; }
