import { assertCanonicalTimestamp } from "../../../shared/common/timestamps.js";
import type { JsonObject, JsonPrimitive } from "../../../shared/common/serialization.js";
import { ValidationError } from "../../../shared/errors/ValidationError.js";
import { ValueObject } from "../../../shared/valueobject/ValueObject.js";
import { CapabilityType, type CapabilityTypeValue, type ConnectorRequestMetadataProps, type ConnectorResultMetadataProps, type TechnicalAttributes, type TechnicalMetadata } from "./ConnectorTypes.js";

function required(value: string, name: string): string {
  const result = value.trim();
  if (result.length === 0) throw new ValidationError(`${name} is required`);
  return result;
}

function scalarAttributes(value: TechnicalAttributes): JsonObject {
  const result: Record<string, JsonPrimitive> = {};
  for (const [key, item] of Object.entries(value)) {
    if (key.trim().length === 0 || item === undefined || (typeof item === "object" && item !== null)) throw new ValidationError("technicalAttributes must contain scalar values");
    result[key] = item;
  }
  return result;
}

export class ConnectorOperationKey extends ValueObject<string> {
  public constructor(value: string) { super(required(value, "operationKey")); }
  public get value(): string { return this.rawValue; }
}

export class ConnectorExecutionRequestKey extends ValueObject<string> {
  public constructor(value: string) { super(required(value, "idempotencyKey")); }
  public get value(): string { return this.rawValue; }
}

export class TargetReference extends ValueObject<string> {
  public constructor(value: string) { super(required(value, "targetReference")); }
  public get value(): string { return this.rawValue; }
}

export class ConnectorRequestMetadata extends ValueObject<JsonObject> {
  public constructor(props: ConnectorRequestMetadataProps) {
    const operationKey = required(props.operationKey, "operationKey");
    const requestKey = required(props.requestKey, "requestKey");
    const idempotencyKey = required(props.idempotencyKey, "idempotencyKey");
    const targetReference = required(props.targetReference, "targetReference");
    const serialized: Record<string, JsonPrimitive | JsonObject> = {
      requestKey, operationKey, targetReference, idempotencyKey,
      requestedAt: assertCanonicalTimestamp(props.requestedAt, "requestedAt"),
      technicalAttributes: scalarAttributes(props.technicalAttributes ?? {})
    };
    super(serialized);
    Object.freeze(this);
  }
  public get requestKey(): string { return this.rawValue.requestKey as string; }
  public get operationKey(): string { return this.rawValue.operationKey as string; }
  public get idempotencyKey(): string { return this.rawValue.idempotencyKey as string; }
}

export class ConnectorResultMetadata extends ValueObject<JsonObject> {
  public constructor(props: ConnectorResultMetadataProps) {
    const serialized: Record<string, JsonPrimitive | TechnicalMetadata> = { receivedAt: assertCanonicalTimestamp(props.receivedAt, "receivedAt") };
    if (props.providerCode?.trim()) serialized.providerCode = props.providerCode.trim();
    if (props.checksum?.trim()) serialized.checksum = props.checksum.trim();
    serialized.technicalMetadata = props.technicalMetadata ?? {};
    super(serialized);
    Object.freeze(this);
  }
}

export class ExternalEvidenceSuccess extends ValueObject<JsonObject> {
  public readonly kind = "SUCCESS" as const;
  public constructor(props: { readonly externalIdentifier: string; readonly providerReference: string; readonly receivedAt: string; readonly checksum?: string; readonly technicalMetadata?: TechnicalMetadata }) {
    const externalIdentifier = required(props.externalIdentifier, "externalIdentifier");
    const providerReference = required(props.providerReference, "providerReference");
    const serialized: Record<string, JsonPrimitive | TechnicalMetadata> = { kind: "SUCCESS", externalIdentifier, providerReference, receivedAt: assertCanonicalTimestamp(props.receivedAt, "receivedAt"), technicalMetadata: props.technicalMetadata ?? {} };
    if (props.checksum?.trim()) serialized.checksum = props.checksum.trim();
    super(serialized);
    Object.freeze(this);
  }
}

export class ExternalEvidenceFailure extends ValueObject<JsonObject> {
  public readonly kind = "FAILURE" as const;
  public constructor(props: { readonly providerReference: string; readonly failureCode: string; readonly failureReason: string; readonly retryable: boolean; readonly receivedAt: string; readonly technicalMetadata?: TechnicalMetadata }) {
    const serialized: Record<string, JsonPrimitive | TechnicalMetadata> = { kind: "FAILURE", providerReference: required(props.providerReference, "providerReference"), failureCode: required(props.failureCode, "failureCode"), failureReason: required(props.failureReason, "failureReason"), retryable: props.retryable, receivedAt: assertCanonicalTimestamp(props.receivedAt, "receivedAt"), technicalMetadata: props.technicalMetadata ?? {} };
    super(serialized);
    Object.freeze(this);
  }
}

export type ExternalEvidence = ExternalEvidenceSuccess | ExternalEvidenceFailure;
export type ConnectorCapabilitySnapshot = { readonly id: string; readonly tenantId: string; readonly connectorId: string; readonly capabilityType: CapabilityTypeValue; readonly supportedOperationKeys: readonly string[]; readonly metadata: JsonObject };
export function assertCapabilityType(value: string): CapabilityTypeValue {
  if (!Object.values(CapabilityType).includes(value as CapabilityTypeValue)) throw new ValidationError("Unsupported Connector capability type", { value });
  return value as CapabilityTypeValue;
}
