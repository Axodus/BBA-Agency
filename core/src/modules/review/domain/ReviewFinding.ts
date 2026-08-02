import type { JsonObject } from "../../../shared/common/serialization.js";
import { assertCanonicalTimestamp } from "../../../shared/common/timestamps.js";
import { Entity } from "../../../shared/entity/Entity.js";
import { ValidationError } from "../../../shared/errors/ValidationError.js";
import { EvidenceReference } from "../../../shared/evidence/EvidenceReference.js";
import { ReviewFindingId, ReviewSessionId, TenantId } from "../../../shared/identity/index.js";
import { LineageReference } from "../../../shared/lineage/LineageReference.js";
import { evidenceFromJSON, lineageFromJSON } from "./ReviewSerialization.js";
import { FindingCategory, FindingSeverity, type FindingCategoryValue, type FindingSeverityValue } from "./ReviewTypes.js";

export interface ReviewFindingSnapshot {
  readonly findingId: string;
  readonly sessionId: string;
  readonly tenantId: string;
  readonly category: FindingCategoryValue;
  readonly severity: FindingSeverityValue;
  readonly statement: string;
  readonly recommendation: string;
  readonly evidence: readonly JsonObject[];
  readonly lineage: readonly JsonObject[];
  readonly recordedAt: string;
}

export interface ReviewFindingProps {
  readonly id: ReviewFindingId;
  readonly sessionId: ReviewSessionId;
  readonly tenantId: TenantId;
  readonly category: FindingCategoryValue;
  readonly severity: FindingSeverityValue;
  readonly statement: string;
  readonly recommendation: string;
  readonly evidence: readonly EvidenceReference[];
  readonly lineage: readonly LineageReference[];
  readonly recordedAt: string;
}

export class ReviewFinding extends Entity<ReviewFindingId> {
  public readonly sessionId: ReviewSessionId;
  public readonly tenantId: TenantId;
  public readonly category: FindingCategoryValue;
  public readonly severity: FindingSeverityValue;
  public readonly statement: string;
  public readonly recommendation: string;
  public readonly evidence: readonly EvidenceReference[];
  public readonly lineage: readonly LineageReference[];
  public readonly recordedAt: string;

  private constructor(props: ReviewFindingProps) {
    super(props.id);
    if (!Object.values(FindingCategory).includes(props.category)) throw new ValidationError("ReviewFinding category is invalid");
    if (!Object.values(FindingSeverity).includes(props.severity)) throw new ValidationError("ReviewFinding severity is invalid");
    const statement = props.statement.trim();
    const recommendation = props.recommendation.trim();
    if (statement.length === 0 || recommendation.length === 0) throw new ValidationError("ReviewFinding requires statement and recommendation");
    if (props.evidence.length === 0 || props.lineage.length === 0) throw new ValidationError("ReviewFinding requires Evidence and Lineage");
    if (new Set(props.evidence.map((item) => item.evidenceId.toString())).size !== props.evidence.length) throw new ValidationError("ReviewFinding Evidence must be unique");
    this.sessionId = props.sessionId;
    this.tenantId = props.tenantId;
    this.category = props.category;
    this.severity = props.severity;
    this.statement = statement;
    this.recommendation = recommendation;
    this.evidence = Object.freeze([...props.evidence]);
    this.lineage = Object.freeze([...props.lineage]);
    this.recordedAt = assertCanonicalTimestamp(props.recordedAt, "recordedAt");
    Object.freeze(this);
  }

  public static create(props: ReviewFindingProps): ReviewFinding { return new ReviewFinding(props); }
  public static fromSnapshot(snapshot: ReviewFindingSnapshot): ReviewFinding {
    return new ReviewFinding({
      id: ReviewFindingId.from(snapshot.findingId), sessionId: ReviewSessionId.from(snapshot.sessionId),
      tenantId: TenantId.from(snapshot.tenantId), category: snapshot.category, severity: snapshot.severity,
      statement: snapshot.statement, recommendation: snapshot.recommendation,
      evidence: snapshot.evidence.map(evidenceFromJSON), lineage: snapshot.lineage.map(lineageFromJSON), recordedAt: snapshot.recordedAt
    });
  }
  public toSnapshot(): ReviewFindingSnapshot {
    return {
      findingId: this.id.toString(), sessionId: this.sessionId.toString(), tenantId: this.tenantId.toString(),
      category: this.category, severity: this.severity, statement: this.statement, recommendation: this.recommendation,
      evidence: this.evidence.map((item) => item.toJSON()), lineage: this.lineage.map((item) => item.toJSON()), recordedAt: this.recordedAt
    };
  }
}
