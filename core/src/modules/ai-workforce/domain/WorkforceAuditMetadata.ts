import { assertCanonicalTimestamp } from "../../../shared/common/timestamps.js";
import { CausationId, CorrelationId } from "../../../shared/common/index.js";
import type { JsonObject, JsonValue } from "../../../shared/common/serialization.js";
import { ValidationError } from "../../../shared/errors/ValidationError.js";
import { EvidenceReference } from "../../../shared/evidence/EvidenceReference.js";
import { LineageReference } from "../../../shared/lineage/LineageReference.js";
import { Version } from "../../../shared/version/Version.js";
import { ValueObject } from "../../../shared/valueobject/ValueObject.js";

export interface WorkforceAuditMetadataProps {
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly correlationId: CorrelationId;
  readonly causationId?: CausationId;
  readonly version: Version;
  readonly evidence: readonly EvidenceReference[];
  readonly lineage: readonly LineageReference[];
}

export class WorkforceAuditMetadata extends ValueObject<JsonObject> {
  public readonly createdAt: string;
  public readonly updatedAt: string;
  public readonly correlationId: CorrelationId;
  public readonly causationId: CausationId | undefined;
  public readonly version: Version;
  public readonly evidence: readonly EvidenceReference[];
  public readonly lineage: readonly LineageReference[];

  public constructor(props: WorkforceAuditMetadataProps) {
    const createdAt = assertCanonicalTimestamp(props.createdAt, "createdAt");
    const updatedAt = assertCanonicalTimestamp(props.updatedAt, "updatedAt");
    if (updatedAt < createdAt) throw new ValidationError("updatedAt cannot precede createdAt");
    const serialized: Record<string, JsonValue> = {
      createdAt, updatedAt, correlationId: props.correlationId.toJSON(), version: props.version.toJSON(),
      evidence: props.evidence.map((item) => item.toJSON()), lineage: props.lineage.map((item) => item.toJSON())
    };
    if (props.causationId !== undefined) serialized.causationId = props.causationId.toJSON();
    super(serialized);
    this.createdAt = createdAt; this.updatedAt = updatedAt; this.correlationId = props.correlationId;
    this.causationId = props.causationId; this.version = props.version;
    this.evidence = Object.freeze([...props.evidence]); this.lineage = Object.freeze([...props.lineage]);
    Object.freeze(this);
  }
}
