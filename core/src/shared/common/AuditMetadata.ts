import { CausationId } from "./CausationId.js";
import { CorrelationId } from "./CorrelationId.js";
import { assertCanonicalTimestamp } from "./timestamps.js";
import { ValidationError } from "../errors/ValidationError.js";
import { Version } from "../version/Version.js";
import { ValueObject } from "../valueobject/ValueObject.js";
import type { JsonObject, JsonValue } from "./serialization.js";

export interface AuditMetadataProps {
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly correlationId: CorrelationId;
  readonly causationId?: CausationId;
  readonly version: Version;
}

export class AuditMetadata extends ValueObject<JsonObject> {
  private readonly createdTimestamp: string;
  private readonly updatedTimestamp: string;
  private readonly correlation: CorrelationId;
  private readonly causation: CausationId | undefined;
  private readonly currentVersion: Version;

  public constructor(props: AuditMetadataProps) {
    const createdAt = assertCanonicalTimestamp(props.createdAt, "createdAt");
    const updatedAt = assertCanonicalTimestamp(props.updatedAt, "updatedAt");
    if (updatedAt < createdAt) {
      throw new ValidationError("updatedAt cannot precede createdAt");
    }
    const serialized: Record<string, JsonValue> = {
      createdAt,
      updatedAt,
      correlationId: props.correlationId.toJSON(),
      version: props.version.toJSON()
    };
    if (props.causationId !== undefined) serialized.causationId = props.causationId.toJSON();
    super(serialized);
    this.createdTimestamp = createdAt;
    this.updatedTimestamp = updatedAt;
    this.correlation = props.correlationId;
    this.causation = props.causationId;
    this.currentVersion = props.version;
    Object.freeze(this);
  }

  public get createdAt(): string { return this.createdTimestamp; }
  public get updatedAt(): string { return this.updatedTimestamp; }
  public get correlationId(): CorrelationId { return this.correlation; }
  public get causationId(): CausationId | undefined { return this.causation; }
  public get version(): Version { return this.currentVersion; }
}
