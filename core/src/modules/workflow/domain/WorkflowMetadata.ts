import { assertCanonicalTimestamp } from "../../../shared/common/timestamps.js";
import type { JsonObject } from "../../../shared/common/serialization.js";
import { ValidationError } from "../../../shared/errors/ValidationError.js";
import { ValueObject } from "../../../shared/valueobject/ValueObject.js";

export class WorkflowMetadata extends ValueObject<JsonObject> {
  public readonly name: string;
  public readonly summary: string;
  public readonly createdAt: string;
  public readonly updatedAt: string;

  public constructor(props: { readonly name: string; readonly summary: string; readonly createdAt: string; readonly updatedAt: string }) {
    const name = props.name.trim();
    const summary = props.summary.trim();
    if (!name || !summary) throw new ValidationError("WorkflowMetadata requires name and summary");
    const createdAt = assertCanonicalTimestamp(props.createdAt, "createdAt");
    const updatedAt = assertCanonicalTimestamp(props.updatedAt, "updatedAt");
    if (updatedAt < createdAt) throw new ValidationError("WorkflowMetadata updatedAt cannot precede createdAt");
    super({ name, summary, createdAt, updatedAt });
    this.name = name;
    this.summary = summary;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    Object.freeze(this);
  }

  public static fromJSON(value: JsonObject): WorkflowMetadata {
    return new WorkflowMetadata({ name: String(value.name), summary: String(value.summary), createdAt: String(value.createdAt), updatedAt: String(value.updatedAt) });
  }
}
