import type { JsonObject } from "../../../shared/common/serialization.js";
import { ValidationError } from "../../../shared/errors/ValidationError.js";
import { ValueObject } from "../../../shared/valueobject/ValueObject.js";

export interface AssignmentPolicyProps { readonly exclusive?: boolean; readonly concurrencyKey?: string; readonly maxDurationSeconds?: number; }

export class AssignmentPolicy extends ValueObject<JsonObject> {
  public readonly exclusive: boolean;
  public readonly concurrencyKey: string | undefined;
  public readonly maxDurationSeconds: number | undefined;
  public constructor(props: AssignmentPolicyProps = {}) {
    const concurrencyKey = props.concurrencyKey?.trim();
    if (props.maxDurationSeconds !== undefined && (!Number.isInteger(props.maxDurationSeconds) || props.maxDurationSeconds <= 0)) throw new ValidationError("AssignmentPolicy maxDurationSeconds must be positive");
    const serialized: Record<string, import("../../../shared/common/serialization.js").JsonValue> = { exclusive: props.exclusive ?? false };
    if (concurrencyKey) serialized.concurrencyKey = concurrencyKey;
    if (props.maxDurationSeconds !== undefined) serialized.maxDurationSeconds = props.maxDurationSeconds;
    super(serialized);
    this.exclusive = props.exclusive ?? false; this.concurrencyKey = concurrencyKey || undefined; this.maxDurationSeconds = props.maxDurationSeconds; Object.freeze(this);
  }
  public conflictsWith(other: AssignmentPolicy): boolean { return this.exclusive || other.exclusive || (this.concurrencyKey !== undefined && this.concurrencyKey === other.concurrencyKey); }
  public static fromJSON(value: JsonObject): AssignmentPolicy { const props = { exclusive: value.exclusive === true, ...(typeof value.concurrencyKey === "string" ? { concurrencyKey: value.concurrencyKey } : {}), ...(typeof value.maxDurationSeconds === "number" ? { maxDurationSeconds: value.maxDurationSeconds } : {}) }; return new AssignmentPolicy(props); }
}
