import type { CausationId, CorrelationId } from "../../../shared/common/index.js";
import type { EvidenceReference } from "../../../shared/evidence/EvidenceReference.js";
import type { ReviewConclusionId, ReviewFindingId, ReviewId, ReviewRequestId, ReviewSessionId, TenantId } from "../../../shared/identity/index.js";
import type { LineageReference } from "../../../shared/lineage/LineageReference.js";
import type { InstitutionalActorReference, MissionReference } from "../../../shared/references/index.js";
import type { ReviewScope } from "./ReviewScope.js";
import type { FindingCategoryValue, FindingSeverityValue, ReviewOutcomeValue, ReviewTypeValue } from "./ReviewTypes.js";

export interface ReviewAuditInput {
  readonly reason: string;
  readonly occurredAt: string;
  readonly correlationId: CorrelationId;
  readonly causationId?: CausationId;
  readonly evidence: readonly EvidenceReference[];
  readonly lineage: readonly LineageReference[];
}

export interface CreateReviewCommand extends ReviewAuditInput {
  readonly reviewId: ReviewId;
  readonly requestId: ReviewRequestId;
  readonly tenantId: TenantId;
  readonly missionReference: MissionReference;
  readonly scope: ReviewScope;
  readonly reviewType: ReviewTypeValue;
  readonly criteria: readonly string[];
  readonly requestedBy: InstitutionalActorReference;
  readonly requestedAt: string;
  readonly dueAt?: string | null;
}
export interface StartReviewCommand extends ReviewAuditInput {}
export interface PlanSessionCommand extends ReviewAuditInput { readonly sessionId: ReviewSessionId; readonly reviewerReferences: readonly InstitutionalActorReference[]; }
export interface OpenSessionCommand extends ReviewAuditInput { readonly sessionId: ReviewSessionId; }
export interface RecordFindingCommand extends ReviewAuditInput {
  readonly sessionId: ReviewSessionId;
  readonly findingId: ReviewFindingId;
  readonly category: FindingCategoryValue;
  readonly severity: FindingSeverityValue;
  readonly statement: string;
  readonly recommendation: string;
}
export interface CloseSessionCommand extends ReviewAuditInput { readonly sessionId: ReviewSessionId; }
export interface CancelSessionCommand extends ReviewAuditInput { readonly sessionId: ReviewSessionId; }
export interface CompleteReviewCommand extends ReviewAuditInput { readonly conclusionId: ReviewConclusionId; readonly outcome: ReviewOutcomeValue; readonly rationale: string; }
export interface ArchiveReviewCommand extends ReviewAuditInput {}
