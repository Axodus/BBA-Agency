import type { JsonObject } from "../../../shared/common/serialization.js";
import { deepFreeze } from "../../../shared/common/serialization.js";
import { ValidationError } from "../../../shared/errors/ValidationError.js";
import { ValueObject } from "../../../shared/valueobject/ValueObject.js";

export interface ExecutionResultProps { readonly output: JsonObject; readonly uncertainty?: string; readonly limitations?: readonly string[]; readonly metrics?: JsonObject; readonly provenance?: readonly string[]; }

export class ExecutionResult extends ValueObject<JsonObject> {
  public readonly output: JsonObject;
  public readonly uncertainty: string;
  public readonly limitations: readonly string[];
  public readonly metrics: JsonObject;
  public readonly provenance: readonly string[];
  public constructor(props: ExecutionResultProps) {
    if (props.output === null || typeof props.output !== "object" || Array.isArray(props.output)) throw new ValidationError("ExecutionResult output must be an object");
    const uncertainty = props.uncertainty?.trim() ?? ""; const limitations = Object.freeze([...(props.limitations ?? [])]); const metrics = deepFreeze({ ...(props.metrics ?? {}) }); const provenance = Object.freeze([...(props.provenance ?? [])]);
    super({ output: deepFreeze({ ...props.output }), uncertainty, limitations: [...limitations], metrics, provenance: [...provenance] });
    this.output = deepFreeze({ ...props.output }); this.uncertainty = uncertainty; this.limitations = limitations; this.metrics = metrics; this.provenance = provenance; Object.freeze(this);
  }
  public static fromJSON(value: JsonObject): ExecutionResult { return new ExecutionResult({ output: (value.output as JsonObject) ?? {}, uncertainty: typeof value.uncertainty === "string" ? value.uncertainty : "", limitations: Array.isArray(value.limitations) ? value.limitations.map(String) : [], metrics: (value.metrics as JsonObject) ?? {}, provenance: Array.isArray(value.provenance) ? value.provenance.map(String) : [] }); }
}
