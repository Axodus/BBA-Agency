import { EvidenceId } from "../identity/EvidenceId.js";
import { assertCanonicalTimestamp } from "../common/timestamps.js";
import type { JsonObject, JsonValue } from "../common/serialization.js";
import { ValidationError } from "../errors/ValidationError.js";
import { ValueObject } from "../valueobject/ValueObject.js";

export interface EvidenceReferenceProps {
  readonly evidenceId: EvidenceId;
  readonly source: string;
  readonly type: string;
  readonly capturedAt: string;
  readonly locator?: string;
  readonly limitation?: string;
}

export class EvidenceReference extends ValueObject<JsonObject> {
  private readonly referenceId: EvidenceId;

  public constructor(props: EvidenceReferenceProps) {
    const source = props.source.trim();
    const type = props.type.trim();
    if (source.length === 0 || type.length === 0) {
      throw new ValidationError("EvidenceReference source and type are required");
    }
    const serialized: Record<string, JsonValue> = {
      evidenceId: props.evidenceId.toString(),
      source,
      type,
      capturedAt: assertCanonicalTimestamp(props.capturedAt, "capturedAt")
    };
    for (const [name, value] of [["locator", props.locator], ["limitation", props.limitation]] as const) {
      const normalized = value?.trim();
      if (normalized !== undefined && normalized.length > 0) serialized[name] = normalized;
    }
    super(serialized);
    this.referenceId = props.evidenceId;
    Object.freeze(this);
  }

  public get evidenceId(): EvidenceId { return this.referenceId; }
}
