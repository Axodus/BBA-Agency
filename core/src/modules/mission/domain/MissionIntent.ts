import type { JsonObject, JsonValue } from "../../../shared/common/serialization.js";
import { ValidationError } from "../../../shared/errors/ValidationError.js";
import { ValueObject } from "../../../shared/valueobject/ValueObject.js";

export interface MissionIntentProps {
  readonly purpose: string;
  readonly objective: string;
  readonly stewardReference: string;
  readonly audience?: string;
  readonly noAudienceReason?: string;
  readonly context: string;
  readonly constraints?: readonly string[];
  readonly expectedOutcome: string;
}

function normalizeRequired(value: string, field: string): string {
  const normalized = value.trim();
  if (normalized.length === 0) throw new ValidationError(`Mission ${field} is required`, { field });
  return normalized;
}

export class MissionIntent extends ValueObject<JsonObject> {
  public constructor(props: MissionIntentProps) {
    const audience = props.audience?.trim();
    const noAudienceReason = props.noAudienceReason?.trim();
    if ((audience === undefined || audience.length === 0) &&
        (noAudienceReason === undefined || noAudienceReason.length === 0)) {
      throw new ValidationError("Mission requires an audience or a reason why audience is not applicable");
    }
    if (audience !== undefined && audience.length > 0 &&
        noAudienceReason !== undefined && noAudienceReason.length > 0) {
      throw new ValidationError("Mission cannot declare both audience and noAudienceReason");
    }
    const constraints = (props.constraints ?? []).map((constraint) => normalizeRequired(constraint, "constraint"));
    const serialized: Record<string, JsonValue> = {
      purpose: normalizeRequired(props.purpose, "purpose"),
      objective: normalizeRequired(props.objective, "objective"),
      stewardReference: normalizeRequired(props.stewardReference, "stewardReference"),
      context: normalizeRequired(props.context, "context"),
      constraints,
      expectedOutcome: normalizeRequired(props.expectedOutcome, "expectedOutcome")
    };
    if (audience !== undefined && audience.length > 0) serialized.audience = audience;
    if (noAudienceReason !== undefined && noAudienceReason.length > 0) serialized.noAudienceReason = noAudienceReason;
    super(serialized);
    Object.freeze(this);
  }

  public get purpose(): string { return this.rawValue.purpose as string; }
  public get objective(): string { return this.rawValue.objective as string; }
  public get stewardReference(): string { return this.rawValue.stewardReference as string; }
}
