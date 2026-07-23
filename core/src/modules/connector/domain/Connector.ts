import { AggregateRoot } from "../../../shared/aggregate/AggregateRoot.js";
import type { JsonObject } from "../../../shared/common/serialization.js";
import { deepFreeze, stableSerialize } from "../../../shared/common/serialization.js";
import { InvariantViolation } from "../../../shared/errors/InvariantViolation.js";
import type { EvidenceReference } from "../../../shared/evidence/EvidenceReference.js";
import { ConnectorCapabilityId, ConnectorId, TenantId } from "../../../shared/identity/index.js";
import type { LineageReference } from "../../../shared/lineage/LineageReference.js";
import { Version } from "../../../shared/version/Version.js";
import { evidenceFromJSON, lineageFromJSON } from "./ConnectorSerialization.js";
import type { ConnectorCapabilityDefinition, ConnectorAuditInput, ConnectorLifecycleCommand, RegisterConnectorCommand } from "./ConnectorCommands.js";
import { ConnectorActivated, ConnectorDomainEvent, ConnectorRegistered, ConnectorRetired, ConnectorSuspended } from "./ConnectorEvents.js";
import { ConnectorOperationKey, assertCapabilityType, type ConnectorCapabilitySnapshot } from "./ConnectorValues.js";
import { ConnectorStatus, type ConnectorStatusType } from "./ConnectorTypes.js";

export interface ConnectorSnapshot { readonly schemaVersion: 1; readonly connectorId: string; readonly tenantId: string; readonly metadata: JsonObject; readonly capabilities: readonly ConnectorCapabilitySnapshot[]; readonly status: ConnectorStatusType; readonly evidence: readonly JsonObject[]; readonly lineage: readonly JsonObject[]; readonly version: number; }

export class ConnectorCapability {
  private constructor(private readonly snapshot: ConnectorCapabilitySnapshot) { Object.freeze(this); }
  public static create(definition: ConnectorCapabilityDefinition, connectorId: ConnectorId, tenantId: TenantId): ConnectorCapability {
    const keys = definition.supportedOperationKeys.map((item) => item.value);
    if (keys.length === 0 || new Set(keys).size !== keys.length) throw new InvariantViolation("ConnectorCapability requires unique operation keys");
    return new ConnectorCapability(deepFreeze({ id: definition.id.toString(), tenantId: tenantId.toString(), connectorId: connectorId.toString(), capabilityType: assertCapabilityType(definition.type), supportedOperationKeys: [...keys].sort(), metadata: definition.metadata ?? {} }));
  }
  public static fromSnapshot(snapshot: ConnectorCapabilitySnapshot): ConnectorCapability { return new ConnectorCapability(deepFreeze({ ...snapshot, supportedOperationKeys: [...snapshot.supportedOperationKeys] })); }
  public get id(): ConnectorCapabilityId { return ConnectorCapabilityId.from(this.snapshot.id); }
  public get tenantId(): TenantId { return TenantId.from(this.snapshot.tenantId); }
  public get connectorId(): ConnectorId { return ConnectorId.from(this.snapshot.connectorId); }
  public get type(): string { return this.snapshot.capabilityType; }
  public get supportedOperationKeys(): readonly string[] { return [...this.snapshot.supportedOperationKeys]; }
  public supports(operation: ConnectorOperationKey): boolean { return this.snapshot.supportedOperationKeys.includes(operation.value); }
  public toSnapshot(): ConnectorCapabilitySnapshot { return deepFreeze({ ...this.snapshot, supportedOperationKeys: [...this.snapshot.supportedOperationKeys] }); }
}

export class Connector extends AggregateRoot<ConnectorId> {
  private constructor(connectorId: ConnectorId, private readonly connectorTenantId: TenantId, private readonly connectorMetadata: JsonObject, private connectorCapabilities: ConnectorCapability[], private connectorStatus: ConnectorStatusType, private connectorEvidence: EvidenceReference[], private connectorLineage: LineageReference[], version: Version) { super(connectorId, version); }
  public static create(command: RegisterConnectorCommand): Connector {
    const capabilities = command.capabilities.map((definition) => ConnectorCapability.create(definition, command.connectorId, command.tenantId));
    const connector = new Connector(command.connectorId, command.tenantId, command.metadata, capabilities, ConnectorStatus.REGISTERED, [...command.evidence], [...command.lineage], Version.initial());
    connector.mutate(command); connector.emit(ConnectorRegistered, command, { connectorId: connector.id.toString(), capabilityIds: capabilities.map((item) => item.id.toString()) }); return connector;
  }
  public static rehydrate(snapshot: ConnectorSnapshot): Connector {
    if (snapshot.schemaVersion !== 1) throw new InvariantViolation("Unsupported Connector snapshot schema");
    return new Connector(ConnectorId.from(snapshot.connectorId), TenantId.from(snapshot.tenantId), snapshot.metadata, snapshot.capabilities.map(ConnectorCapability.fromSnapshot), snapshot.status, snapshot.evidence.map(evidenceFromJSON), snapshot.lineage.map(lineageFromJSON), Version.from(snapshot.version));
  }
  public get tenantId(): TenantId { return this.connectorTenantId; }
  public get status(): ConnectorStatusType { return this.connectorStatus; }
  public get metadata(): JsonObject { return deepFreeze({ ...this.connectorMetadata }); }
  public get capabilities(): readonly ConnectorCapability[] { return this.connectorCapabilities.map((item) => ConnectorCapability.fromSnapshot(item.toSnapshot())); }
  public get reference() { return { id: this.id, tenantId: this.tenantId }; }
  public findCapability(id: ConnectorCapabilityId): ConnectorCapability { const capability = this.connectorCapabilities.find((item) => item.id.equals(id)); if (capability === undefined) throw new InvariantViolation("Connector capability does not belong to Connector"); return ConnectorCapability.fromSnapshot(capability.toSnapshot()); }
  public activate(command: ConnectorLifecycleCommand): void { if (this.status !== ConnectorStatus.REGISTERED && this.status !== ConnectorStatus.SUSPENDED) throw new InvariantViolation(`Connector cannot activate from ${this.status}`); this.connectorStatus = ConnectorStatus.ACTIVE; this.mutate(command); this.emit(ConnectorActivated, command); }
  public suspend(command: ConnectorLifecycleCommand): void { if (this.status !== ConnectorStatus.ACTIVE) throw new InvariantViolation(`Connector cannot suspend from ${this.status}`); this.connectorStatus = ConnectorStatus.SUSPENDED; this.mutate(command); this.emit(ConnectorSuspended, command); }
  public retire(command: ConnectorLifecycleCommand): void { if (this.status === ConnectorStatus.RETIRED) throw new InvariantViolation("Connector is already retired"); this.connectorStatus = ConnectorStatus.RETIRED; this.mutate(command); this.emit(ConnectorRetired, command); }
  public toSnapshot(): ConnectorSnapshot { return deepFreeze({ schemaVersion: 1, connectorId: this.id.toString(), tenantId: this.tenantId.toString(), metadata: this.metadata, capabilities: this.connectorCapabilities.map((item) => item.toSnapshot()), status: this.status, evidence: this.connectorEvidence.map((item) => item.toJSON()), lineage: this.connectorLineage.map((item) => item.toJSON()), version: this.version.value }); }
  public serialize(): string { return stableSerialize(this.toSnapshot() as unknown as JsonObject); }
  private mutate(command: ConnectorAuditInput): void { if (command.reason.trim().length === 0 || command.evidence.length === 0 || command.lineage.length === 0) throw new InvariantViolation("Connector mutation requires reason, Evidence and Lineage"); this.connectorEvidence = [...this.connectorEvidence, ...command.evidence]; this.connectorLineage = [...this.connectorLineage, ...command.lineage]; this.incrementVersion(); this.assertState(); }
  private emit(EventType: new (props: import("./ConnectorEvents.js").ConnectorEventProps) => ConnectorDomainEvent, command: ConnectorAuditInput, payload: JsonObject = {}): void { this.recordEvent(new EventType({ aggregateId: this.id.toString(), tenantId: this.tenantId, occurredAt: command.occurredAt, version: this.version, correlationId: command.correlationId.toString(), ...(command.causationId === undefined ? {} : { causationId: command.causationId.toString() }), evidenceIds: command.evidence.map((item) => item.evidenceId.toString()), lineage: command.lineage.map((item) => item.toJSON()), payload })); }
  private assertState(): void { if (this.connectorCapabilities.some((item) => !item.tenantId.equals(this.tenantId) || !item.connectorId.equals(this.id))) throw new InvariantViolation("Connector capability crossed a boundary"); }
}
