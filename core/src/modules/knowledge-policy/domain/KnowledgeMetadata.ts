import { assertCanonicalTimestamp } from "../../../shared/common/timestamps.js";
import type { JsonObject } from "../../../shared/common/serialization.js";
import { ValidationError } from "../../../shared/errors/ValidationError.js";
import { ValueObject } from "../../../shared/valueobject/ValueObject.js";

export class KnowledgeMetadata extends ValueObject<JsonObject> {
  public readonly title: string; public readonly summary: string; public readonly stewardNote: string; public readonly createdAt: string; public readonly updatedAt: string;
  public constructor(props: { readonly title: string; readonly summary: string; readonly stewardNote: string; readonly createdAt: string; readonly updatedAt: string }) {
    const title = props.title.trim(); const summary = props.summary.trim(); const stewardNote = props.stewardNote.trim();
    if (!title || !summary || !stewardNote) throw new ValidationError("KnowledgeMetadata requires title, summary and steward note");
    const createdAt = assertCanonicalTimestamp(props.createdAt, "createdAt"); const updatedAt = assertCanonicalTimestamp(props.updatedAt, "updatedAt");
    if (updatedAt < createdAt) throw new ValidationError("KnowledgeMetadata updatedAt cannot precede createdAt");
    super({ title, summary, stewardNote, createdAt, updatedAt });
    this.title = title; this.summary = summary; this.stewardNote = stewardNote; this.createdAt = createdAt; this.updatedAt = updatedAt; Object.freeze(this);
  }
  public static fromJSON(value: JsonObject): KnowledgeMetadata {
    return new KnowledgeMetadata({ title: String(value.title), summary: String(value.summary), stewardNote: String(value.stewardNote), createdAt: String(value.createdAt), updatedAt: String(value.updatedAt) });
  }
}
