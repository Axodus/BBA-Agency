import type { AuditMetadata } from "../../../shared/common/AuditMetadata.js";
import type { JsonObject } from "../../../shared/common/serialization.js";
import type { CausationId, CorrelationId } from "../../../shared/common/index.js";
import type { EvidenceReference } from "../../../shared/evidence/EvidenceReference.js";
import type { ConnectorCapabilityId, ConnectorExecutionId, ConnectorId, TenantId } from "../../../shared/identity/index.js";
import type { LineageReference } from "../../../shared/lineage/LineageReference.js";
import type { ConnectorCapabilityReference, ConnectorReference } from "../../../shared/references/index.js";
import type { ConnectorOperationKey, ExternalEvidence, ConnectorRequestMetadata } from "./ConnectorValues.js";

export interface ConnectorAuditInput { readonly reason: string; readonly evidence: readonly EvidenceReference[]; readonly lineage: readonly LineageReference[]; readonly occurredAt: string; readonly correlationId: CorrelationId; readonly causationId?: CausationId; }
export interface RegisterConnectorCommand extends ConnectorAuditInput { readonly connectorId: ConnectorId; readonly tenantId: TenantId; readonly metadata: JsonObject; readonly capabilities: readonly ConnectorCapabilityDefinition[]; }
export interface ConnectorCapabilityDefinition { readonly id: ConnectorCapabilityId; readonly type: string; readonly supportedOperationKeys: readonly ConnectorOperationKey[]; readonly metadata?: JsonObject; }
export interface ConnectorLifecycleCommand extends ConnectorAuditInput { readonly connectorId: ConnectorId; }
export interface CreateExecutionCommand extends ConnectorAuditInput { readonly executionId: ConnectorExecutionId; readonly connectorReference: ConnectorReference; readonly capabilityReference: ConnectorCapabilityReference; readonly operationKey: ConnectorOperationKey; readonly request: ConnectorRequestMetadata; }
export interface ExecutionLifecycleCommand extends ConnectorAuditInput { readonly executionId: ConnectorExecutionId; }
export interface CompleteExecutionCommand extends ExecutionLifecycleCommand { readonly evidence: readonly EvidenceReference[]; readonly externalEvidence: ExternalEvidence; }
export interface FailExecutionCommand extends ExecutionLifecycleCommand { readonly externalEvidence: ExternalEvidence; }
export interface CancelExecutionCommand extends ExecutionLifecycleCommand { readonly cancellationReason: string; }
export type ConnectorAuditMetadata = AuditMetadata;
