import { assertCanonicalTimestamp } from "../../../shared/common/timestamps.js";
import type { JsonObject } from "../../../shared/common/serialization.js";
import { ValidationError } from "../../../shared/errors/ValidationError.js";
import { ValueObject } from "../../../shared/valueobject/ValueObject.js";

export class PolicyMetadata extends ValueObject<JsonObject> {
  public readonly title: string; public readonly summary: string; public readonly scope: string; public readonly createdAt: string; public readonly updatedAt: string;
  public constructor(props: { readonly title: string; readonly summary: string; readonly scope: string; readonly createdAt: string; readonly updatedAt: string }) {
    const title = props.title.trim(); const summary = props.summary.trim(); const scope = props.scope.trim();
    if (!title || !summary || !scope) throw new ValidationError("PolicyMetadata requires title, summary and scope");
    const createdAt = assertCanonicalTimestamp(props.createdAt, "createdAt"); const updatedAt = assertCanonicalTimestamp(props.updatedAt, "updatedAt");
    if (updatedAt < createdAt) throw new ValidationError("PolicyMetadata updatedAt cannot precede createdAt");
    super({ title, summary, scope, createdAt, updatedAt });
    this.title = title; this.summary = summary; this.scope = scope; this.createdAt = createdAt; this.updatedAt = updatedAt; Object.freeze(this);
  }
  public static fromJSON(value: JsonObject): PolicyMetadata {
    return new PolicyMetadata({ title: String(value.title), summary: String(value.summary), scope: String(value.scope), createdAt: String(value.createdAt), updatedAt: String(value.updatedAt) });
  }
}
