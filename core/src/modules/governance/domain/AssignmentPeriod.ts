import { assertCanonicalTimestamp } from "../../../shared/common/timestamps.js";
import { ValidationError } from "../../../shared/errors/ValidationError.js";
import { ValueObject } from "../../../shared/valueobject/ValueObject.js";

export interface AssignmentPeriodProps { readonly startsAt: string; readonly endsAt: string; }

export class AssignmentPeriod extends ValueObject<{ readonly startsAt: string; readonly endsAt: string }> {
  public constructor(props: AssignmentPeriodProps) {
    const startsAt = assertCanonicalTimestamp(props.startsAt, "startsAt");
    const endsAt = assertCanonicalTimestamp(props.endsAt, "endsAt");
    if (endsAt <= startsAt) throw new ValidationError("Assignment endsAt must be after startsAt");
    super({ startsAt, endsAt });
    Object.freeze(this);
  }
  public get startsAt(): string { return this.rawValue.startsAt; }
  public get endsAt(): string { return this.rawValue.endsAt; }
  public overlaps(other: AssignmentPeriod): boolean { return this.startsAt < other.endsAt && other.startsAt < this.endsAt; }
}
