import { assertCanonicalTimestamp } from "../../../shared/common/timestamps.js";
import { CausationId, CorrelationId } from "../../../shared/common/index.js";
import type { JsonObject, JsonValue } from "../../../shared/common/serialization.js";
import { ValidationError } from "../../../shared/errors/ValidationError.js";
import { EvidenceReference } from "../../../shared/evidence/EvidenceReference.js";
import { LineageReference } from "../../../shared/lineage/LineageReference.js";
import { Version } from "../../../shared/version/Version.js";
import { ValueObject } from "../../../shared/valueobject/ValueObject.js";

export interface GovernanceAuditMetadataProps {
  readonly createdAt: string; readonly updatedAt: string; readonly correlationId: CorrelationId;
  readonly causationId?: CausationId; readonly version: Version; readonly actorReference: string;
  readonly reason: string; readonly evidence: readonly EvidenceReference[]; readonly lineage: readonly LineageReference[];
}

export class GovernanceAuditMetadata extends ValueObject<JsonObject> {
  public readonly actorReference: string;
  public readonly reason: string;
  public readonly evidence: readonly EvidenceReference[];
  public readonly lineage: readonly LineageReference[];
  private readonly createdTimestamp: string;
  private readonly updatedTimestamp: string;
  private readonly correlation: CorrelationId;
  private readonly causation: CausationId | undefined;
  private readonly currentVersion: Version;

  public constructor(props: GovernanceAuditMetadataProps) {
    const createdAt = assertCanonicalTimestamp(props.createdAt, "createdAt");
    const updatedAt = assertCanonicalTimestamp(props.updatedAt, "updatedAt");
    if (updatedAt < createdAt) throw new ValidationError("updatedAt cannot precede createdAt");
    const actorReference = props.actorReference.trim(); const reason = props.reason.trim();
    if (actorReference.length === 0 || reason.length === 0) throw new ValidationError("Governance audit actorReference and reason are required");
    const serialized: Record<string, JsonValue> = { createdAt, updatedAt, correlationId: props.correlationId.toJSON(), version: props.version.toJSON(), actorReference, reason, evidence: props.evidence.map((item) => item.toJSON()), lineage: props.lineage.map((item) => item.toJSON()) };
    if (props.causationId !== undefined) serialized.causationId = props.causationId.toJSON();
    super(serialized);
    this.actorReference = actorReference; this.reason = reason; this.evidence = [...props.evidence]; this.lineage = [...props.lineage];
    this.createdTimestamp = createdAt; this.updatedTimestamp = updatedAt; this.correlation = props.correlationId; this.causation = props.causationId; this.currentVersion = props.version;
    Object.freeze(this.evidence); Object.freeze(this.lineage); Object.freeze(this);
  }
  public get createdAt(): string { return this.createdTimestamp; }
  public get updatedAt(): string { return this.updatedTimestamp; }
  public get correlationId(): CorrelationId { return this.correlation; }
  public get causationId(): CausationId | undefined { return this.causation; }
  public get version(): Version { return this.currentVersion; }
}
