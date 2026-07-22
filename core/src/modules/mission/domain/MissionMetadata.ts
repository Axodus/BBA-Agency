import { assertCanonicalTimestamp } from "../../../shared/common/timestamps.js";
import type { JsonObject } from "../../../shared/common/serialization.js";
import { ValidationError } from "../../../shared/errors/ValidationError.js";
import { ValueObject } from "../../../shared/valueobject/ValueObject.js";

export interface MissionMetadataProps {
  readonly title: string;
  readonly summary: string;
  readonly description: string;
  readonly createdAt: string;
  readonly updatedAt: string;
}

function required(value: string, field: string): string {
  const normalized = value.trim();
  if (normalized.length === 0) throw new ValidationError(`Mission ${field} is required`, { field });
  return normalized;
}

export class MissionMetadata extends ValueObject<JsonObject> {
  public constructor(props: MissionMetadataProps) {
    const createdAt = assertCanonicalTimestamp(props.createdAt, "createdAt");
    const updatedAt = assertCanonicalTimestamp(props.updatedAt, "updatedAt");
    if (updatedAt < createdAt) {
      throw new ValidationError("Mission updatedAt cannot precede createdAt");
    }
    super({
      title: required(props.title, "title"),
      summary: required(props.summary, "summary"),
      description: required(props.description, "description"),
      createdAt,
      updatedAt
    });
    Object.freeze(this);
  }

  public get title(): string { return this.rawValue.title as string; }
  public get summary(): string { return this.rawValue.summary as string; }
  public get description(): string { return this.rawValue.description as string; }
  public get createdAt(): string { return this.rawValue.createdAt as string; }
  public get updatedAt(): string { return this.rawValue.updatedAt as string; }

  public rename(title: string, updatedAt: string): MissionMetadata {
    this.assertMonotonicUpdate(updatedAt);
    return new MissionMetadata({ ...this.toJSON(), title, updatedAt } as unknown as MissionMetadataProps);
  }

  public updateDescription(description: string, updatedAt: string): MissionMetadata {
    this.assertMonotonicUpdate(updatedAt);
    return new MissionMetadata({ ...this.toJSON(), description, updatedAt } as unknown as MissionMetadataProps);
  }

  public touch(updatedAt: string): MissionMetadata {
    this.assertMonotonicUpdate(updatedAt);
    return new MissionMetadata({ ...this.toJSON(), updatedAt } as unknown as MissionMetadataProps);
  }

  private assertMonotonicUpdate(updatedAt: string): void {
    const canonical = assertCanonicalTimestamp(updatedAt, "updatedAt");
    if (canonical < this.updatedAt) {
      throw new ValidationError("Mission updatedAt cannot precede current updatedAt");
    }
  }
}
