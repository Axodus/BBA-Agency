import type { JsonObject, JsonPrimitive } from "../../../shared/common/serialization.js";

export const ConnectorStatus = Object.freeze({ REGISTERED: "REGISTERED", ACTIVE: "ACTIVE", SUSPENDED: "SUSPENDED", RETIRED: "RETIRED" } as const);
export type ConnectorStatusType = typeof ConnectorStatus[keyof typeof ConnectorStatus];

export const ConnectorExecutionStatus = Object.freeze({ CREATED: "CREATED", RUNNING: "RUNNING", SUCCEEDED: "SUCCEEDED", FAILED: "FAILED", CANCELLED: "CANCELLED" } as const);
export type ConnectorExecutionStatusType = typeof ConnectorExecutionStatus[keyof typeof ConnectorExecutionStatus];

export const CapabilityType = Object.freeze({ PUBLISH: "PUBLISH", IMPORT: "IMPORT", EXPORT: "EXPORT", SEARCH: "SEARCH", VALIDATION: "VALIDATION", WEBHOOK: "WEBHOOK" } as const);
export type CapabilityTypeValue = typeof CapabilityType[keyof typeof CapabilityType];

export type TechnicalAttributes = Readonly<Record<string, JsonPrimitive>>;
export type TechnicalMetadata = JsonObject;

export const TransportResultKind = Object.freeze({ SUCCESS: "SUCCESS", FAILURE: "FAILURE" } as const);
export type TransportResultKindType = typeof TransportResultKind[keyof typeof TransportResultKind];

export interface ConnectorRequestMetadataProps {
  readonly requestKey: string;
  readonly operationKey: string;
  readonly targetReference: string;
  readonly idempotencyKey: string;
  readonly requestedAt: string;
  readonly technicalAttributes?: TechnicalAttributes;
}

export interface ConnectorResultMetadataProps {
  readonly receivedAt: string;
  readonly providerCode?: string;
  readonly checksum?: string;
  readonly technicalMetadata?: TechnicalMetadata;
}
