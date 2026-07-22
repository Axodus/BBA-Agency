import type { JsonObject, JsonValue } from "../../../shared/common/serialization.js";
import { deterministicHash } from "../../../shared/common/serialization.js";
import { DomainEvent } from "../../../shared/events/DomainEvent.js";
import type { MissionId } from "../../../shared/identity/MissionId.js";
import type { TenantId } from "../../../shared/identity/TenantId.js";
import type { Version } from "../../../shared/version/Version.js";

export interface MissionEventProps {
  readonly missionId: MissionId;
  readonly tenantId: TenantId;
  readonly occurredAt: string;
  readonly version: Version;
  readonly payload?: JsonObject;
}

function eventId(type: string, props: MissionEventProps): string {
  const seed = `${type}:${props.missionId.toString()}:${props.version.value}:${props.occurredAt}`;
  return `event_${deterministicHash(seed)}`;
}

export abstract class MissionDomainEvent extends DomainEvent {
  public readonly type: string;
  public readonly payload: JsonObject;

  protected constructor(type: string, props: MissionEventProps) {
    super({
      eventId: eventId(type, props),
      occurredAt: props.occurredAt,
      aggregateId: props.missionId.toString(),
      tenantId: props.tenantId.toString(),
      version: props.version
    });
    this.type = type;
    this.payload = Object.freeze({ ...(props.payload ?? {}) });
    Object.freeze(this);
  }

  public override toJSON(): JsonObject {
    return { ...super.toJSON(), type: this.type, payload: this.payload };
  }
}

function defineEvent<TName extends string>(name: TName): new (props: MissionEventProps) => MissionDomainEvent {
  return class extends MissionDomainEvent {
    public constructor(props: MissionEventProps) { super(name, props); }
  };
}

export const MissionCreated = defineEvent("MissionCreated");
export const MissionRenamed = defineEvent("MissionRenamed");
export const MissionDescriptionUpdated = defineEvent("MissionDescriptionUpdated");
export const MissionAuthorized = defineEvent("MissionAuthorized");
export const MissionPrepared = defineEvent("MissionPrepared");
export const MissionActivated = defineEvent("MissionActivated");
export const MissionPaused = defineEvent("MissionPaused");
export const MissionResumed = defineEvent("MissionResumed");
export const MissionReviewStarted = defineEvent("MissionReviewStarted");
export const MissionOutcomeDecisionStarted = defineEvent("MissionOutcomeDecisionStarted");
export const MissionCompleted = defineEvent("MissionCompleted");
export const MissionCancelled = defineEvent("MissionCancelled");
export const MissionDeferred = defineEvent("MissionDeferred");
export const MissionRejected = defineEvent("MissionRejected");
export const MissionReopened = defineEvent("MissionReopened");
export const MissionArchived = defineEvent("MissionArchived");
export const MissionEvidenceRegistered = defineEvent("MissionEvidenceRegistered");
export const MissionLineageRegistered = defineEvent("MissionLineageRegistered");

export function missionDecisionPayload(
  actorReference: string,
  authorityReference: string,
  reason: string,
  evidenceIds: readonly string[],
  extra: JsonObject = {}
): JsonObject {
  return {
    actorReference,
    authorityReference,
    reason,
    evidenceIds: [...evidenceIds] as JsonValue[],
    ...extra
  };
}
