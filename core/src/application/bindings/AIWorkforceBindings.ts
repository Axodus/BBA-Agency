import { CausationId, CorrelationId } from "../../shared/common/index.js";
import type { JsonObject } from "../../shared/common/serialization.js";
import { EvidenceReference } from "../../shared/evidence/EvidenceReference.js";
import { LineageReference, type LineageRelationship } from "../../shared/lineage/LineageReference.js";
import { AgentId, EvidenceId, ExecutionId, MissionId, TenantId, WorkAssignmentId } from "../../shared/identity/index.js";
import { AgentReference, AssignmentReference, AuthorityReference, DecisionReference, MissionReference, WorkAssignmentReference } from "../../shared/references/index.js";
import { ApplicationError } from "../errors/ApplicationError.js";
import type { AIWorkforceCommandRequestDto, AgentDto, AssignAgentRequestDto, CommittedOperationResultDto, CompleteExecutionRequestDto, ExecutionDto, GetAgentRequestDto, GetExecutionRequestDto, ProvisionAgentRequestDto, StartExecutionRequestDto } from "../dto/ApplicationContext.js";
import type { GovernanceWorkAuthorizationPort } from "../ports/GovernanceWorkAuthorizationPort.js";
import type { TransactionalRepositorySession, ReadRepositorySession } from "../services/TransactionalRepositorySession.js";
import type { ValidatedCommandContext } from "../services/ApplicationCommandRunner.js";
import type { CommandBindingDescriptor, QueryBindingDescriptor } from "./ApplicationBindingTypes.js";
import { AssignmentPolicy, Capability, ExecutionResult } from "../../modules/ai-workforce/domain/index.js";
import { AIWorkCoordinator } from "../../modules/ai-workforce/application/AIWorkCoordinator.js";
import { completeExecution } from "../../modules/ai-workforce/application/CompleteExecution.js";
import { provisionAgent } from "../../modules/ai-workforce/application/ProvisionAgent.js";
import type { Agent } from "../../modules/ai-workforce/domain/Agent.js";
import type { Execution } from "../../modules/ai-workforce/domain/Execution.js";

type JsonRecord = Record<string, unknown>;
export type AgentRepositories = Pick<TransactionalRepositorySession, "agent">;
export type WorkforceRepositories = Pick<TransactionalRepositorySession, "agent" | "execution">;
export type ExecutionRepositories = Pick<TransactionalRepositorySession, "execution">;
export type ReadAgentRepositories = Pick<ReadRepositorySession, "agent">;
export type ReadExecutionRepositories = Pick<ReadRepositorySession, "execution">;

function object(value: unknown, field: string): JsonRecord {
  if (value === null || typeof value !== "object" || Array.isArray(value)) throw new ApplicationError("VALIDATION_FAILED", `${field} must be an object`, { field });
  return value as JsonRecord;
}

function required(value: unknown, field: string): string {
  if (typeof value !== "string" || value.trim() === "") throw new ApplicationError("VALIDATION_FAILED", `${field} is required`, { field });
  return value;
}

function records(value: unknown, field: string): readonly JsonRecord[] {
  if (!Array.isArray(value)) throw new ApplicationError("VALIDATION_FAILED", `${field} must be an array`, { field });
  return value.map((item) => object(item, field));
}

function payload(command: AIWorkforceCommandRequestDto): JsonRecord { return object(command.payload, "payload"); }
function target(command: AIWorkforceCommandRequestDto, field: string): string { return required(command.targetId ?? payload(command)[field], field); }

function evidence(value: unknown): readonly EvidenceReference[] {
  return records(value, "evidence").map((item) => new EvidenceReference({ evidenceId: EvidenceId.from(required(item.evidenceId, "evidence.evidenceId")), source: required(item.source, "evidence.source"), type: required(item.type, "evidence.type"), capturedAt: required(item.capturedAt, "evidence.capturedAt"), ...(typeof item.locator === "string" ? { locator: item.locator } : {}), ...(typeof item.limitation === "string" ? { limitation: item.limitation } : {}) }));
}

function lineage(value: unknown): readonly LineageReference[] {
  return records(value, "lineage").map((item) => new LineageReference({ sourceId: required(item.sourceId, "lineage.sourceId"), targetId: required(item.targetId, "lineage.targetId"), relationship: required(item.relationship, "lineage.relationship") as LineageRelationship, declaredAt: required(item.declaredAt, "lineage.declaredAt"), ...(typeof item.reason === "string" ? { reason: item.reason } : {}) }));
}

function audit(command: AIWorkforceCommandRequestDto, context: ValidatedCommandContext) {
  const data = payload(command);
  return {
    occurredAt: required(data.occurredAt, "occurredAt"),
    correlationId: CorrelationId.from(context.correlationId),
    ...(context.causationId === undefined ? {} : { causationId: CausationId.from(context.causationId) }),
    evidence: evidence(data.evidence),
    lineage: lineage(data.lineage),
    reason: command.reason
  };
}

function capabilities(value: unknown, field: string): readonly Capability[] {
  return records(value, field).map((item) => new Capability({ name: required(item.name, `${field}.name`), scope: required(item.scope, `${field}.scope`), ...(Array.isArray(item.qualityCriteria) ? { qualityCriteria: item.qualityCriteria.map((entry) => required(entry, `${field}.qualityCriteria`)) } : {}), ...(Array.isArray(item.limitations) ? { limitations: item.limitations.map((entry) => required(entry, `${field}.limitations`)) } : {}) }));
}

function validateCommon(command: AIWorkforceCommandRequestDto): void {
  const data = payload(command);
  required(data.occurredAt, "occurredAt");
  evidence(data.evidence);
  lineage(data.lineage);
}

function validateProvision(command: ProvisionAgentRequestDto): void {
  const data = payload(command); target(command, "agentId"); validateCommon(command);
  target(command, "agentId"); required(data.name, "name"); required(data.purpose, "purpose"); required(data.definitionVersion, "definitionVersion"); capabilities(data.capabilities, "capabilities");
}

function validateAssign(command: AssignAgentRequestDto): void {
  const data = payload(command); target(command, "agentId"); validateCommon(command);
  target(command, "agentId"); required(data.workAssignmentId, "workAssignmentId"); required(data.missionId, "missionId"); required(data.title, "title"); required(data.responsibility, "responsibility"); required(data.authorityId, "authorityId"); required(data.decisionId, "decisionId"); capabilities(data.requiredCapabilities, "requiredCapabilities");
  if (data.assignmentPolicy !== undefined) object(data.assignmentPolicy, "assignmentPolicy");
}

function validateStart(command: StartExecutionRequestDto): void {
  const data = payload(command); target(command, "executionId"); validateCommon(command);
  target(command, "executionId"); required(data.agentId, "agentId"); required(data.workAssignmentId, "workAssignmentId"); required(data.missionId, "missionId");
}

function validateComplete(command: CompleteExecutionRequestDto): void {
  const data = payload(command); target(command, "executionId"); validateCommon(command);
  const result = object(data.result, "result"); object(result.output, "result.output");
}

function validateQuery(query: GetAgentRequestDto | GetExecutionRequestDto): void { required(query.targetId, "targetId"); }

function mappedTarget(request: AIWorkforceCommandRequestDto, field: string): AIWorkforceCommandRequestDto {
  const value = payload(request)[field];
  return request.targetId === undefined && typeof value === "string" ? { ...request, targetId: value } : request;
}
function mapProvision(request: ProvisionAgentRequestDto): ProvisionAgentRequestDto { return mappedTarget(request, "agentId") as ProvisionAgentRequestDto; }
function mapAssign(request: AssignAgentRequestDto): AssignAgentRequestDto { return mappedTarget(request, "agentId") as AssignAgentRequestDto; }
function mapStart(request: StartExecutionRequestDto): StartExecutionRequestDto { return mappedTarget(request, "executionId") as StartExecutionRequestDto; }
function mapComplete(request: CompleteExecutionRequestDto): CompleteExecutionRequestDto { return mappedTarget(request, "executionId") as CompleteExecutionRequestDto; }
function mapAgentQuery(request: GetAgentRequestDto): GetAgentRequestDto { return request; }
function mapExecutionQuery(request: GetExecutionRequestDto): GetExecutionRequestDto { return request; }

function committed(transactionId: string, resourceType: string, resourceId: string): CommittedOperationResultDto {
  return Object.freeze({ transactionId, status: "COMMITTED", resourceReferences: Object.freeze([{ resourceType, resourceId }]) });
}

function provisionCommand(command: ProvisionAgentRequestDto, context: ValidatedCommandContext) {
  const data = payload(command); const auditData = audit(command, context);
  return { agentId: AgentId.from(target(command, "agentId")), tenantId: TenantId.from(context.tenantId), name: required(data.name, "name"), purpose: required(data.purpose, "purpose"), definitionVersion: required(data.definitionVersion, "definitionVersion"), capabilities: capabilities(data.capabilities, "capabilities"), ...auditData };
}

function assignCommand(command: AssignAgentRequestDto, context: ValidatedCommandContext) {
  const data = payload(command); const auditData = audit(command, context); const policy = data.assignmentPolicy === undefined ? undefined : new AssignmentPolicy(object(data.assignmentPolicy, "assignmentPolicy") as { exclusive?: boolean; concurrencyKey?: string; maxDurationSeconds?: number });
  return { workAssignmentId: WorkAssignmentId.from(required(data.workAssignmentId, "workAssignmentId")), tenantId: TenantId.from(context.tenantId), agentId: AgentId.from(target(command, "agentId")), missionReference: new MissionReference(MissionId.from(required(data.missionId, "missionId")), TenantId.from(context.tenantId)), title: required(data.title, "title"), responsibility: required(data.responsibility, "responsibility"), requiredCapabilities: capabilities(data.requiredCapabilities, "requiredCapabilities"), ...(policy === undefined ? {} : { assignmentPolicy: policy }), authorityReference: AuthorityReference.fromJSON({ id: required(data.authorityId, "authorityId"), tenantId: context.tenantId }), decisionReference: DecisionReference.fromJSON({ id: required(data.decisionId, "decisionId"), tenantId: context.tenantId }), ...(typeof data.governanceAssignmentId === "string" ? { governanceAssignmentReference: AssignmentReference.fromJSON({ id: data.governanceAssignmentId, tenantId: context.tenantId }) } : {}), ...auditData };
}

function startCommand(command: StartExecutionRequestDto, context: ValidatedCommandContext) {
  const data = payload(command); const auditData = audit(command, context);
  return { executionId: ExecutionId.from(target(command, "executionId")), tenantId: TenantId.from(context.tenantId), missionReference: new MissionReference(MissionId.from(required(data.missionId, "missionId")), TenantId.from(context.tenantId)), agentReference: new AgentReference(AgentId.from(required(data.agentId, "agentId")), TenantId.from(context.tenantId)), workAssignmentReference: new WorkAssignmentReference(WorkAssignmentId.from(required(data.workAssignmentId, "workAssignmentId")), TenantId.from(context.tenantId)), ...auditData };
}

function completeCommand(command: CompleteExecutionRequestDto, context: ValidatedCommandContext) {
  const result = object(payload(command).result, "result"); const auditData = audit(command, context);
  return { result: new ExecutionResult({ output: object(result.output, "result.output") as JsonObject, ...(typeof result.uncertainty === "string" ? { uncertainty: result.uncertainty } : {}), ...(Array.isArray(result.limitations) ? { limitations: result.limitations.map((item) => required(item, "result.limitations")) } : {}), ...(result.metrics === undefined ? {} : { metrics: object(result.metrics, "result.metrics") as JsonObject }), ...(Array.isArray(result.provenance) ? { provenance: result.provenance.map((item) => required(item, "result.provenance")) } : {}) }), ...auditData };
}

function reference(id: string, tenantId: string) { return Object.freeze({ id, tenantId }); }
function agentDto(agent: Agent): AgentDto {
  return Object.freeze({ agentId: agent.id.toString(), tenantId: agent.tenantId.toString(), name: agent.name, purpose: agent.purpose, definitionVersion: agent.definitionVersion, lifecycleStatus: agent.lifecycleStatus, status: agent.status, availability: agent.availability, capabilities: agent.capabilities.capabilities.map((item) => Object.freeze({ name: item.name, scope: item.scope, qualityCriteria: [...item.qualityCriteria], limitations: [...item.limitations] })), assignments: agent.assignments.map((item) => Object.freeze({ assignmentId: item.id.toString(), tenantId: item.tenantId.toString(), missionReference: item.missionReference.toJSON(), agentReference: item.agentReference.toJSON(), title: item.title, responsibility: item.responsibility, requiredCapabilities: item.requiredCapabilities.map((capability) => capability.toJSON()), policy: item.policy.toJSON(), authorityReference: item.authorityReference.toJSON(), decisionReference: item.decisionReference.toJSON(), status: item.status, createdAt: item.createdAt, updatedAt: item.updatedAt })), version: agent.version.value });
}
function executionDto(execution: Execution): ExecutionDto {
  return Object.freeze({ executionId: execution.id.toString(), tenantId: execution.tenantId.toString(), missionReference: reference(execution.missionReference.id.toString(), execution.missionReference.tenantId.toString()), agentReference: reference(execution.agentReference.id.toString(), execution.agentReference.tenantId.toString()), workAssignmentReference: reference(execution.workAssignmentReference.id.toString(), execution.workAssignmentReference.tenantId.toString()), status: execution.status, result: execution.result?.toJSON() ?? null, failure: execution.failure, version: execution.version.value });
}

export interface AIWorkforceBindings {
  readonly provisionAgent: CommandBindingDescriptor<ProvisionAgentRequestDto, CommittedOperationResultDto, CommittedOperationResultDto, AgentRepositories>;
  readonly assignAgent: CommandBindingDescriptor<AssignAgentRequestDto, CommittedOperationResultDto, CommittedOperationResultDto, WorkforceRepositories>;
  readonly startExecution: CommandBindingDescriptor<StartExecutionRequestDto, CommittedOperationResultDto, CommittedOperationResultDto, WorkforceRepositories>;
  readonly completeExecution: CommandBindingDescriptor<CompleteExecutionRequestDto, CommittedOperationResultDto, CommittedOperationResultDto, ExecutionRepositories>;
  readonly getAgent: QueryBindingDescriptor<GetAgentRequestDto, Agent | null, AgentDto | null, ReadAgentRepositories>;
  readonly getExecution: QueryBindingDescriptor<GetExecutionRequestDto, Execution | null, ExecutionDto | null, ReadExecutionRepositories>;
}

export function createAIWorkforceBindings(authorization: GovernanceWorkAuthorizationPort): AIWorkforceBindings {
  if (authorization === undefined || authorization === null) throw new ApplicationError("APPLICATION_FAILURE", "GovernanceWorkAuthorizationPort is required");
  const agentRepositories = (repositories: TransactionalRepositorySession): AgentRepositories => Object.freeze({ agent: repositories.agent });
  const workforceRepositories = (repositories: TransactionalRepositorySession): WorkforceRepositories => Object.freeze({ agent: repositories.agent, execution: repositories.execution });
  const executionRepositories = (repositories: TransactionalRepositorySession): ExecutionRepositories => Object.freeze({ execution: repositories.execution });
  const readAgentRepositories = (repositories: ReadRepositorySession): ReadAgentRepositories => Object.freeze({ agent: repositories.agent });
  const readExecutionRepositories = (repositories: ReadRepositorySession): ReadExecutionRepositories => Object.freeze({ execution: repositories.execution });

  const provisionAgentBinding: AIWorkforceBindings["provisionAgent"] = { boundedContext: "ai-workforce", exportName: "provisionAgent", operationName: "ProvisionAgent", apiPortMethod: "provisionAgent", repositoryView: { repositories: ["agent"] }, useCaseExport: "provisionAgent", requestMapper: mapProvision, validator: validateProvision, repositorySelector: agentRepositories, confirmedResourceType: "Agent", handler: async (command, context, repositories) => { await provisionAgent(repositories.agent, provisionCommand(command, context)); return committed(context.transactionId, "Agent", target(command, "agentId")); }, responseMapper: (result) => result };
  const assignAgentBinding: AIWorkforceBindings["assignAgent"] = { boundedContext: "ai-workforce", exportName: "assignAgent", operationName: "AssignAgent", apiPortMethod: "assignAgent", repositoryView: { repositories: ["agent", "execution"] }, useCaseExport: "AIWorkCoordinator.assign", requestMapper: mapAssign, validator: validateAssign, repositorySelector: workforceRepositories, confirmedResourceType: "Agent", handler: async (command, context, repositories) => { const result = await new AIWorkCoordinator(repositories.agent, repositories.execution, authorization).assign(assignCommand(command, context)); if (result.result.status === "REJECTED") throw new ApplicationError("FORBIDDEN_CONTEXT", result.result.reason, {}, context.correlationId); return committed(context.transactionId, "Agent", target(command, "agentId")); }, responseMapper: (result) => result };
  const startExecutionBinding: AIWorkforceBindings["startExecution"] = { boundedContext: "ai-workforce", exportName: "startExecution", operationName: "StartExecution", apiPortMethod: "startExecution", repositoryView: { repositories: ["agent", "execution"] }, useCaseExport: "AIWorkCoordinator.start", requestMapper: mapStart, validator: validateStart, repositorySelector: workforceRepositories, confirmedResourceType: "Execution", handler: async (command, context, repositories) => { const execution = await new AIWorkCoordinator(repositories.agent, repositories.execution, authorization).start(startCommand(command, context)); return committed(context.transactionId, "Execution", execution.id.toString()); }, responseMapper: (result) => result };
  const completeExecutionBinding: AIWorkforceBindings["completeExecution"] = { boundedContext: "ai-workforce", exportName: "completeExecution", operationName: "CompleteExecution", apiPortMethod: "completeExecution", repositoryView: { repositories: ["execution"] }, useCaseExport: "completeExecution", requestMapper: mapComplete, validator: validateComplete, repositorySelector: executionRepositories, confirmedResourceType: "Execution", handler: async (command, context, repositories) => { const executionId = ExecutionId.from(target(command, "executionId")); await completeExecution(repositories.execution, TenantId.from(context.tenantId), executionId, completeCommand(command, context)); return committed(context.transactionId, "Execution", executionId.toString()); }, responseMapper: (result) => result };
  const getAgentBinding: AIWorkforceBindings["getAgent"] = { boundedContext: "ai-workforce", exportName: "AgentRepository.findById", operationName: "getAgent", apiPortMethod: "getAgent", repositoryView: { repositories: ["agent"] }, requestMapper: mapAgentQuery, validator: validateQuery, repositorySelector: readAgentRepositories, handler: async (query, context, repositories) => repositories.agent.findById(TenantId.from(context.tenantId), AgentId.from(required(query.targetId, "targetId"))), responseMapper: (result) => result === null ? null : agentDto(result) };
  const getExecutionBinding: AIWorkforceBindings["getExecution"] = { boundedContext: "ai-workforce", exportName: "ExecutionRepository.findById", operationName: "getExecution", apiPortMethod: "getExecution", repositoryView: { repositories: ["execution"] }, requestMapper: mapExecutionQuery, validator: validateQuery, repositorySelector: readExecutionRepositories, handler: async (query, context, repositories) => repositories.execution.findById(TenantId.from(context.tenantId), ExecutionId.from(required(query.targetId, "targetId"))), responseMapper: (result) => result === null ? null : executionDto(result) };
  return Object.freeze({ provisionAgent: provisionAgentBinding, assignAgent: assignAgentBinding, startExecution: startExecutionBinding, completeExecution: completeExecutionBinding, getAgent: getAgentBinding, getExecution: getExecutionBinding });
}
