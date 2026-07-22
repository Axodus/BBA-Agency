import { assertCanonicalTimestamp } from "../../../shared/common/timestamps.js";
import type { JsonObject } from "../../../shared/common/serialization.js";
import { ValidationError } from "../../../shared/errors/ValidationError.js";
import { ValueObject } from "../../../shared/valueobject/ValueObject.js";

export interface AssetMetadataProps { readonly title: string; readonly summary: string; readonly purpose: string; readonly createdAt: string; readonly updatedAt: string; }
export class AssetMetadata extends ValueObject<JsonObject> {
  public readonly title: string; public readonly summary: string; public readonly purpose: string; public readonly createdAt: string; public readonly updatedAt: string;
  public constructor(props: AssetMetadataProps) { const title = props.title.trim(); const summary = props.summary.trim(); const purpose = props.purpose.trim(); if (!title || !summary || !purpose) throw new ValidationError("AssetMetadata title, summary and purpose are required"); const createdAt = assertCanonicalTimestamp(props.createdAt, "createdAt"); const updatedAt = assertCanonicalTimestamp(props.updatedAt, "updatedAt"); if (updatedAt < createdAt) throw new ValidationError("AssetMetadata updatedAt cannot precede createdAt"); super({ title, summary, purpose, createdAt, updatedAt }); this.title = title; this.summary = summary; this.purpose = purpose; this.createdAt = createdAt; this.updatedAt = updatedAt; Object.freeze(this); }
  public static fromJSON(value: JsonObject): AssetMetadata { return new AssetMetadata({ title: String(value.title), summary: String(value.summary), purpose: String(value.purpose), createdAt: String(value.createdAt), updatedAt: String(value.updatedAt) }); }
}
