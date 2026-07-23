import type { ConnectorExecutionReference, ConnectorReference } from "../../../shared/references/index.js";
import type { ConnectorExecutionStatusType } from "../domain/ConnectorTypes.js";

export interface ConnectorObservation { readonly execution: ConnectorExecutionReference; readonly connector: ConnectorReference; readonly operationKey: string; readonly result: ConnectorExecutionStatusType; readonly externalIdentifier?: string; readonly failureCode?: string; readonly observedAt: string; readonly evidenceIds: readonly string[]; readonly correlationId: string; readonly causationId?: string; }
export interface ConnectorObservationDeliveryPort { deliverObservation(observation: ConnectorObservation): Promise<void>; }
