import type { JsonObject } from "../../../shared/common/serialization.js";
import { ValidationError } from "../../../shared/errors/ValidationError.js";
import { ValueObject } from "../../../shared/valueobject/ValueObject.js";

export interface MissionOutcomeProps {
  readonly result: string;
  readonly learning: string;
  readonly limitations: string;
  readonly residualObligations: string;
}

export class MissionOutcome extends ValueObject<JsonObject> {
  public constructor(props: MissionOutcomeProps) {
    const values = Object.fromEntries(
      Object.entries(props).map(([field, value]) => [field, value.trim()])
    ) as unknown as MissionOutcomeProps;
    for (const [field, value] of Object.entries(values)) {
      if (value.length === 0) throw new ValidationError(`Mission outcome ${field} is required`, { field });
    }
    super({ ...values });
    Object.freeze(this);
  }
}
