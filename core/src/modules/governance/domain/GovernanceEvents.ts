import type { JsonObject } from "../../../shared/common/serialization.js";
import { deepFreeze, deterministicHash } from "../../../shared/common/serialization.js";
import { DomainEvent } from "../../../shared/events/DomainEvent.js";
import type { TenantId } from "../../../shared/identity/TenantId.js";
import type { Version } from "../../../shared/version/Version.js";

export interface GovernanceEventProps {
  readonly aggregateId: string;
  readonly tenantId: TenantId;
  readonly occurredAt: string;
  readonly version: Version;
  readonly payload?: JsonObject;
}

export class GovernanceDomainEvent extends DomainEvent {
  public readonly type: string;
  public readonly payload: JsonObject;

  protected constructor(type: string, props: GovernanceEventProps) {
    super({
      eventId: `event_${deterministicHash(`${type}:${props.aggregateId}:${props.version.value}:${props.occurredAt}`)}`,
      occurredAt: props.occurredAt,
      aggregateId: props.aggregateId,
      tenantId: props.tenantId.toString(),
      version: props.version
    });
    this.type = type;
    this.payload = deepFreeze({ ...(props.payload ?? {}) });
    Object.freeze(this);
  }

  public override toJSON(): JsonObject {
    return { ...super.toJSON(), type: this.type, payload: this.payload };
  }
}

function eventType(name: string): new (props: GovernanceEventProps) => GovernanceDomainEvent {
  return class extends GovernanceDomainEvent {
    public constructor(props: GovernanceEventProps) { super(name, props); }
  };
}

export const AuthorityCreated = eventType("AuthorityCreated");
export const AuthorityActivated = eventType("AuthorityActivated");
export const AuthoritySuspended = eventType("AuthoritySuspended");
export const AuthorityRetired = eventType("AuthorityRetired");
export const AssignmentGranted = eventType("AssignmentGranted");
export const AssignmentRevoked = eventType("AssignmentRevoked");
export const AssignmentExpired = eventType("AssignmentExpired");
export const DecisionCreated = eventType("DecisionCreated");
export const DecisionApproved = eventType("DecisionApproved");
export const DecisionRejected = eventType("DecisionRejected");
export const ApprovalRecorded = eventType("ApprovalRecorded");
export const DecisionFinalized = eventType("DecisionFinalized");
