import { CausationId, CorrelationId } from "../../shared/common/index.js";
import { EvidenceReference } from "../../shared/evidence/EvidenceReference.js";
import { ApprovalId, AssignmentId, AuthorityId, DecisionId, EvidenceId, MissionId, TenantId } from "../../shared/identity/index.js";
import { LineageReference, type LineageRelationship } from "../../shared/lineage/LineageReference.js";
import { AssignmentReference, AuthorityReference } from "../../shared/references/index.js";
import { Version } from "../../shared/version/Version.js";
import { ApproveDecision, AssignAuthority, CreateAuthority, CreateDecision, FinalizeDecision, RejectDecision } from "../../modules/governance/application/index.js";
import { ApprovalOutcome } from "../../modules/governance/domain/ApprovalOutcome.js";
import { AssignmentPeriod } from "../../modules/governance/domain/AssignmentPeriod.js";
import { AuthorityLevel } from "../../modules/governance/domain/AuthorityLevel.js";
import { AuthorityScope } from "../../modules/governance/domain/AuthorityScope.js";
import { DecisionType } from "../../modules/governance/domain/DecisionType.js";
import { HumanActorReference } from "../../modules/governance/domain/HumanActorReference.js";
import type { Authority } from "../../modules/governance/domain/Authority.js";
import type { Decision } from "../../modules/governance/domain/Decision.js";
import type { ApproveDecisionRequestDto, AssignAuthorityRequestDto, AuthorityDto, CommittedOperationResultDto, CreateAuthorityRequestDto, CreateDecisionRequestDto, DecisionDto, FinalizeDecisionRequestDto, GetAuthorityRequestDto, GetDecisionRequestDto, GovernanceReferenceDto, OperationCommandDto, RejectDecisionRequestDto } from "../dto/ApplicationContext.js";
import { ApplicationError } from "../errors/ApplicationError.js";
import type { CommandBindingDescriptor, QueryBindingDescriptor } from "./ApplicationBindingTypes.js";
import type { ValidatedCommandContext } from "../services/ApplicationCommandRunner.js";

type JsonRecord = Record<string, unknown>;
type GovernanceCommand = OperationCommandDto;

function object(value: unknown, field: string): JsonRecord {
  if (value === null || typeof value !== "object" || Array.isArray(value)) {
    throw new ApplicationError("VALIDATION_FAILED", `${field} must be an object`, { field });
  }
  return value as JsonRecord;
}

function required(value: unknown, field: string): string {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new ApplicationError("VALIDATION_FAILED", `${field} is required`, { field });
  }
  return value;
}

function records(value: unknown, field: string): readonly JsonRecord[] {
  if (!Array.isArray(value)) {
    throw new ApplicationError("VALIDATION_FAILED", `${field} must be an array`, { field });
  }
  return value.map((item) => object(item, field));
}

function commandPayload(command: GovernanceCommand): JsonRecord {
  return object(command.payload, "payload");
}

function target(command: GovernanceCommand, field: string): string {
  return required(command.targetId ?? commandPayload(command)[field], field);
}

function expected(payload: JsonRecord): Version {
  if (!Number.isSafeInteger(payload.expectedVersion) || Number(payload.expectedVersion) < 0) {
    throw new ApplicationError("VALIDATION_FAILED", "expectedVersion must be a non-negative integer", {});
  }
  return Version.from(Number(payload.expectedVersion));
}

function evidence(value: unknown): readonly EvidenceReference[] {
  return records(value, "evidence").map((item) => new EvidenceReference({
    evidenceId: EvidenceId.from(required(item.evidenceId, "evidence.evidenceId")),
    source: required(item.source, "evidence.source"),
    type: required(item.type, "evidence.type"),
    capturedAt: required(item.capturedAt, "evidence.capturedAt"),
    ...(typeof item.locator === "string" ? { locator: item.locator } : {}),
    ...(typeof item.limitation === "string" ? { limitation: item.limitation } : {})
  }));
}

function lineage(value: unknown): readonly LineageReference[] {
  return records(value, "lineage").map((item) => new LineageReference({
    sourceId: required(item.sourceId, "lineage.sourceId"),
    targetId: required(item.targetId, "lineage.targetId"),
    relationship: required(item.relationship, "lineage.relationship") as LineageRelationship,
    declaredAt: required(item.declaredAt, "lineage.declaredAt"),
    ...(typeof item.reason === "string" ? { reason: item.reason } : {})
  }));
}

function scope(value: unknown, field = "scope"): AuthorityScope {
  const input = object(value, field);
  if (!Array.isArray(input.actions)) {
    throw new ApplicationError("VALIDATION_FAILED", `${field}.actions must be an array`, { field });
  }
  const actions = input.actions.map((item) => required(item, `${field}.actions`));
  const constraints = Array.isArray(input.constraints)
    ? input.constraints.map((item) => required(item, `${field}.constraints`))
    : undefined;
  return new AuthorityScope({ purpose: required(input.purpose, `${field}.purpose`), actions, ...(constraints === undefined ? {} : { constraints }) });
}

function reference(id: string, tenantId: string): GovernanceReferenceDto {
  return Object.freeze({ id, tenantId });
}

function optionalAssignment(payload: JsonRecord, tenantId: string): AssignmentReference | undefined {
  return typeof payload.assignmentId === "string"
    ? AssignmentReference.fromJSON({ id: required(payload.assignmentId, "assignmentId"), tenantId })
    : undefined;
}

function audit(command: GovernanceCommand, context: ValidatedCommandContext) {
  const payload = commandPayload(command);
  const occurredAt = required(payload.occurredAt, "occurredAt");
  return {
    actorReference: HumanActorReference.from(context.actor.reference),
    reason: command.reason,
    occurredAt,
    correlationId: CorrelationId.from(context.correlationId),
    ...(context.causationId === undefined ? {} : { causationId: CausationId.from(context.causationId) }),
    evidence: evidence(payload.evidence),
    lineage: lineage(payload.lineage)
  };
}

function requireAudit(command: GovernanceCommand): void {
  const payload = commandPayload(command);
  required(payload.occurredAt, "occurredAt");
  evidence(payload.evidence);
  lineage(payload.lineage);
}

function committed(transactionId: string, ...resourceReferences: readonly { readonly resourceType: string; readonly resourceId: string }[]): CommittedOperationResultDto {
  return Object.freeze({ transactionId, status: "COMMITTED", resourceReferences: Object.freeze([...resourceReferences]) });
}

function replay(transactionId: string, command: GovernanceCommand, resources: (command: GovernanceCommand) => readonly { readonly resourceType: string; readonly resourceId: string }[]): Promise<CommittedOperationResultDto> {
  return Promise.resolve(committed(transactionId, ...resources(command)));
}

function authorityResources(command: GovernanceCommand): readonly { readonly resourceType: string; readonly resourceId: string }[] {
  return [{ resourceType: "Authority", resourceId: target(command, "authorityId") }];
}

function assignmentResources(command: GovernanceCommand): readonly { readonly resourceType: string; readonly resourceId: string }[] {
  const payload = commandPayload(command);
  return [...authorityResources(command), { resourceType: "Assignment", resourceId: required(payload.assignmentId, "assignmentId") }];
}

function decisionResources(command: GovernanceCommand): readonly { readonly resourceType: string; readonly resourceId: string }[] {
  return [{ resourceType: "Decision", resourceId: target(command, "decisionId") }];
}

function approvalResources(command: GovernanceCommand): readonly { readonly resourceType: string; readonly resourceId: string }[] {
  const payload = commandPayload(command);
  return [...decisionResources(command), { resourceType: "Approval", resourceId: required(payload.approvalId, "approvalId") }];
}

function validateCreateAuthority(command: GovernanceCommand): void {
  const payload = commandPayload(command);
  target(command, "authorityId");
  const level = required(payload.level, "level");
  if (!Object.values(AuthorityLevel).includes(level as typeof AuthorityLevel[keyof typeof AuthorityLevel])) {
    throw new ApplicationError("VALIDATION_FAILED", "level is invalid", {});
  }
  scope(payload.scope);
  requireAudit(command);
}

function validateAssignAuthority(command: GovernanceCommand): void {
  const payload = commandPayload(command);
  target(command, "authorityId");
  expected(payload);
  required(payload.assignmentId, "assignmentId");
  required(payload.delegateReference, "delegateReference");
  scope(payload.scope);
  const period = object(payload.period, "period");
  new AssignmentPeriod({ startsAt: required(period.startsAt, "period.startsAt"), endsAt: required(period.endsAt, "period.endsAt") });
  requireAudit(command);
}

function validateCreateDecision(command: GovernanceCommand): void {
  const payload = commandPayload(command);
  target(command, "decisionId");
  required(payload.missionId, "missionId");
  const decisionType = required(payload.decisionType, "decisionType");
  if (!Object.values(DecisionType).includes(decisionType as typeof DecisionType[keyof typeof DecisionType])) {
    throw new ApplicationError("VALIDATION_FAILED", "decisionType is invalid", {});
  }
  required(payload.authorityId, "authorityId");
  requireAudit(command);
}

function validateDecisionMutation(command: GovernanceCommand): void {
  const payload = commandPayload(command);
  target(command, "decisionId");
  expected(payload);
  requireAudit(command);
}

function validateApproval(command: GovernanceCommand): void {
  validateDecisionMutation(command);
  const payload = commandPayload(command);
  required(payload.approvalId, "approvalId");
  required(payload.authorityId, "authorityId");
  if (payload.outcome !== undefined && !Object.values(ApprovalOutcome).includes(required(payload.outcome, "outcome") as typeof ApprovalOutcome[keyof typeof ApprovalOutcome])) {
    throw new ApplicationError("VALIDATION_FAILED", "outcome is invalid", {});
  }
}

function validateReject(command: GovernanceCommand): void {
  validateDecisionMutation(command);
  const payload = commandPayload(command);
  required(payload.approvalId, "approvalId");
  required(payload.authorityId, "authorityId");
}

function validateQuery(query: { readonly targetId?: string }): void {
  required(query.targetId, "targetId");
}

function authorityDto(authority: Authority): AuthorityDto {
  return Object.freeze({
    authorityId: authority.id.toString(),
    tenantId: authority.tenantId.toString(),
    actorReference: authority.actorReference.toString(),
    level: authority.level.value,
    scope: authority.scope.toJSON(),
    status: authority.status,
    version: authority.version.value,
    assignments: Object.freeze(authority.assignments.map((assignment) => Object.freeze({
      assignmentId: assignment.id.toString(),
      delegateReference: assignment.delegateReference.toString(),
      scope: assignment.scope.toJSON(),
      period: Object.freeze(assignment.period.toJSON()),
      status: assignment.status
    })))
  });
}

function decisionDto(decision: Decision): DecisionDto {
  const approval = decision.approval;
  return Object.freeze({
    decisionId: decision.id.toString(),
    tenantId: decision.tenantId.toString(),
    missionId: decision.missionId.toString(),
    decisionType: decision.decisionTypeValue,
    status: decision.status,
    version: decision.version.value,
    authorityReference: reference(decision.authorityReference.id.toString(), decision.authorityReference.tenantId.toString()),
    ...(decision.assignmentReference === undefined ? {} : { assignmentReference: reference(decision.assignmentReference.id.toString(), decision.assignmentReference.tenantId.toString()) }),
    ...(approval === null ? {} : { approval: Object.freeze({
      approvalId: approval.id.toString(),
      outcome: approval.outcome,
      authorityReference: reference(approval.authorityReference.id.toString(), approval.authorityReference.tenantId.toString()),
      ...(approval.assignmentReference === undefined ? {} : { assignmentReference: reference(approval.assignmentReference.id.toString(), approval.assignmentReference.tenantId.toString()) })
    }) })
  });
}

export const createAuthorityBinding: CommandBindingDescriptor<CreateAuthorityRequestDto, CommittedOperationResultDto, CommittedOperationResultDto> = {
  boundedContext: "governance", exportName: "CreateAuthority", operationName: "CreateAuthority", apiPortMethod: "createAuthority", repositoryView: { repositories: ["authority"] }, useCaseExport: "CreateAuthority",
  requestMapper: (request) => request, validator: validateCreateAuthority,
  handler: async (command, context, session) => {
    const payload = commandPayload(command);
    const repositories = Object.freeze({ authority: session.authority });
    const authorityId = target(command, "authorityId");
    await new CreateAuthority(repositories.authority).execute({ ...audit(command, context), authorityId: AuthorityId.from(authorityId), tenantId: TenantId.from(context.tenantId), level: required(payload.level, "level") as "ADVISORY" | "OPERATIONAL" | "INSTITUTIONAL" | "FINAL", scope: scope(payload.scope) });
    return committed(context.transactionId, ...authorityResources(command));
  },
  replay: { kind: "FULL_CONFIRMED_RESULT", resolver: { resolve: (transactionId, command) => replay(transactionId, command, authorityResources) } }, responseMapper: (result) => result
};

export const assignAuthorityBinding: CommandBindingDescriptor<AssignAuthorityRequestDto, CommittedOperationResultDto, CommittedOperationResultDto> = {
  boundedContext: "governance", exportName: "AssignAuthority", operationName: "AssignAuthority", apiPortMethod: "assignAuthority", repositoryView: { repositories: ["authority"] }, useCaseExport: "AssignAuthority",
  requestMapper: (request) => request, validator: validateAssignAuthority,
  handler: async (command, context, session) => {
    const payload = commandPayload(command);
    const repositories = Object.freeze({ authority: session.authority });
    await new AssignAuthority(repositories.authority).execute({ tenantId: TenantId.from(context.tenantId), authorityId: AuthorityId.from(target(command, "authorityId")), expectedVersion: expected(payload), command: { ...audit(command, context), assignmentId: AssignmentId.from(required(payload.assignmentId, "assignmentId")), delegateReference: HumanActorReference.from(required(payload.delegateReference, "delegateReference")), scope: scope(payload.scope), period: new AssignmentPeriod({ startsAt: required(object(payload.period, "period").startsAt, "period.startsAt"), endsAt: required(object(payload.period, "period").endsAt, "period.endsAt") }) } });
    return committed(context.transactionId, ...assignmentResources(command));
  },
  replay: { kind: "FULL_CONFIRMED_RESULT", resolver: { resolve: (transactionId, command) => replay(transactionId, command, assignmentResources) } }, responseMapper: (result) => result
};

export const createDecisionBinding: CommandBindingDescriptor<CreateDecisionRequestDto, CommittedOperationResultDto, CommittedOperationResultDto> = {
  boundedContext: "governance", exportName: "CreateDecision", operationName: "CreateDecision", apiPortMethod: "createDecision", repositoryView: { repositories: ["decision"] }, useCaseExport: "CreateDecision",
  requestMapper: (request) => request, validator: validateCreateDecision,
  handler: async (command, context, session) => {
    const payload = commandPayload(command);
    const repositories = Object.freeze({ decision: session.decision });
    const decisionType = required(payload.decisionType, "decisionType");
    const assignmentReference = optionalAssignment(payload, context.tenantId);
    await new CreateDecision(repositories.decision).execute({ ...audit(command, context), decisionId: DecisionId.from(target(command, "decisionId")), tenantId: TenantId.from(context.tenantId), missionId: MissionId.from(required(payload.missionId, "missionId")), decisionType: decisionType as typeof DecisionType[keyof typeof DecisionType], authorityReference: AuthorityReference.fromJSON({ id: required(payload.authorityId, "authorityId"), tenantId: context.tenantId }), ...(assignmentReference === undefined ? {} : { assignmentReference }) });
    return committed(context.transactionId, ...decisionResources(command));
  },
  replay: { kind: "FULL_CONFIRMED_RESULT", resolver: { resolve: (transactionId, command) => replay(transactionId, command, decisionResources) } }, responseMapper: (result) => result
};

function decisionMutationInput(command: GovernanceCommand, context: ValidatedCommandContext) {
  const payload = commandPayload(command);
  return { tenantId: TenantId.from(context.tenantId), decisionId: DecisionId.from(target(command, "decisionId")), expectedVersion: expected(payload), command: audit(command, context) };
}

export const approveDecisionBinding: CommandBindingDescriptor<ApproveDecisionRequestDto, CommittedOperationResultDto, CommittedOperationResultDto> = {
  boundedContext: "governance", exportName: "ApproveDecision", operationName: "ApproveDecision", apiPortMethod: "approveDecision", repositoryView: { repositories: ["decision"] }, useCaseExport: "ApproveDecision",
  requestMapper: (request) => request, validator: validateApproval,
  handler: async (command, context, session) => {
    const payload = commandPayload(command);
    const repositories = Object.freeze({ decision: session.decision });
    const input = decisionMutationInput(command, context);
    const assignmentReference = optionalAssignment(payload, context.tenantId);
    await new ApproveDecision(repositories.decision).execute({ ...input, command: { ...input.command, approvalId: ApprovalId.from(required(payload.approvalId, "approvalId")), authorityReference: AuthorityReference.fromJSON({ id: required(payload.authorityId, "authorityId"), tenantId: context.tenantId }), ...(assignmentReference === undefined ? {} : { assignmentReference }), ...(payload.outcome === undefined ? {} : { outcome: required(payload.outcome, "outcome") as typeof ApprovalOutcome[keyof typeof ApprovalOutcome] }) } });
    return committed(context.transactionId, ...approvalResources(command));
  },
  replay: { kind: "FULL_CONFIRMED_RESULT", resolver: { resolve: (transactionId, command) => replay(transactionId, command, approvalResources) } }, responseMapper: (result) => result
};

export const rejectDecisionBinding: CommandBindingDescriptor<RejectDecisionRequestDto, CommittedOperationResultDto, CommittedOperationResultDto> = {
  boundedContext: "governance", exportName: "RejectDecision", operationName: "RejectDecision", apiPortMethod: "rejectDecision", repositoryView: { repositories: ["decision"] }, useCaseExport: "RejectDecision",
  requestMapper: (request) => request, validator: validateReject,
  handler: async (command, context, session) => {
    const payload = commandPayload(command);
    const repositories = Object.freeze({ decision: session.decision });
    const input = decisionMutationInput(command, context);
    const assignmentReference = optionalAssignment(payload, context.tenantId);
    await new RejectDecision(repositories.decision).execute({ ...input, command: { ...input.command, approvalId: ApprovalId.from(required(payload.approvalId, "approvalId")), authorityReference: AuthorityReference.fromJSON({ id: required(payload.authorityId, "authorityId"), tenantId: context.tenantId }), ...(assignmentReference === undefined ? {} : { assignmentReference }) } });
    return committed(context.transactionId, ...approvalResources(command));
  },
  replay: { kind: "FULL_CONFIRMED_RESULT", resolver: { resolve: (transactionId, command) => replay(transactionId, command, approvalResources) } }, responseMapper: (result) => result
};

export const finalizeDecisionBinding: CommandBindingDescriptor<FinalizeDecisionRequestDto, CommittedOperationResultDto, CommittedOperationResultDto> = {
  boundedContext: "governance", exportName: "FinalizeDecision", operationName: "FinalizeDecision", apiPortMethod: "finalizeDecision", repositoryView: { repositories: ["decision"] }, useCaseExport: "FinalizeDecision",
  requestMapper: (request) => request, validator: validateDecisionMutation,
  handler: async (command, context, session) => {
    const repositories = Object.freeze({ decision: session.decision });
    await new FinalizeDecision(repositories.decision).execute(decisionMutationInput(command, context));
    return committed(context.transactionId, ...decisionResources(command));
  },
  replay: { kind: "FULL_CONFIRMED_RESULT", resolver: { resolve: (transactionId, command) => replay(transactionId, command, decisionResources) } }, responseMapper: (result) => result
};

export const getAuthorityBinding: QueryBindingDescriptor<GetAuthorityRequestDto, Authority | null, AuthorityDto | null> = {
  boundedContext: "governance", exportName: "AuthorityRepository.findById", operationName: "getAuthority", apiPortMethod: "getAuthority", repositoryView: { repositories: ["authority"] }, requestMapper: (request) => request,
  validator: validateQuery,
  handler: async (query, context, session) => Object.freeze({ authority: session.authority }).authority.findById(TenantId.from(context.tenantId), AuthorityId.from(required(query.targetId, "targetId"))),
  responseMapper: (result) => result === null ? null : authorityDto(result)
};

export const getDecisionBinding: QueryBindingDescriptor<GetDecisionRequestDto, Decision | null, DecisionDto | null> = {
  boundedContext: "governance", exportName: "DecisionRepository.findById", operationName: "getDecision", apiPortMethod: "getDecision", repositoryView: { repositories: ["decision"] }, requestMapper: (request) => request,
  validator: validateQuery,
  handler: async (query, context, session) => Object.freeze({ decision: session.decision }).decision.findById(TenantId.from(context.tenantId), DecisionId.from(required(query.targetId, "targetId"))),
  responseMapper: (result) => result === null ? null : decisionDto(result)
};

export const governanceBindings = Object.freeze({
  createAuthority: createAuthorityBinding,
  assignAuthority: assignAuthorityBinding,
  createDecision: createDecisionBinding,
  approveDecision: approveDecisionBinding,
  rejectDecision: rejectDecisionBinding,
  finalizeDecision: finalizeDecisionBinding,
  getAuthority: getAuthorityBinding,
  getDecision: getDecisionBinding
});
