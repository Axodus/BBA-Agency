import type { ConnectorRequestMetadata, ExternalEvidenceFailure, ExternalEvidenceSuccess } from "../domain/ConnectorValues.js";

export interface ConnectorTransportSuccess { readonly status: "SUCCESS"; readonly evidence: ExternalEvidenceSuccess; readonly receivedAt: string; readonly technicalMetadata: Readonly<Record<string, unknown>>; }
export interface ConnectorTransportFailure { readonly status: "FAILURE"; readonly evidence: ExternalEvidenceFailure; readonly receivedAt: string; readonly technicalMetadata: Readonly<Record<string, unknown>>; }
export type ConnectorTransportResult = ConnectorTransportSuccess | ConnectorTransportFailure;
export interface ConnectorTransportPort { execute(input: { readonly request: ConnectorRequestMetadata }): Promise<ConnectorTransportResult>; }
