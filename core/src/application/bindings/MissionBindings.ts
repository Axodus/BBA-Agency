import { EvidenceId, MissionId, TenantId } from "../../shared/identity/index.js";
import { EvidenceReference } from "../../shared/evidence/EvidenceReference.js";
import { LineageReference, type LineageRelationship } from "../../shared/lineage/LineageReference.js";
import { MissionIntent } from "../../modules/mission/domain/MissionIntent.js";
import { MissionOutcome } from "../../modules/mission/domain/MissionOutcome.js";
import { MissionMetadata } from "../../modules/mission/domain/MissionMetadata.js";
import { Version } from "../../shared/version/Version.js";
import { AuthorityReference, DecisionReference, ApprovalReference } from "../../shared/references/index.js";
import { ActivateMission } from "../../modules/mission/application/ActivateMission.js";
import { CompleteMission } from "../../modules/mission/application/CompleteMission.js";
import { CreateMission } from "../../modules/mission/application/CreateMission.js";
import { RenameMission } from "../../modules/mission/application/RenameMission.js";
import type { Mission } from "../../modules/mission/domain/Mission.js";
import type { AggregateDto, CommittedOperationResultDto, OperationCommandDto, QueryDto } from "../dto/ApplicationContext.js";
import type { CommandBindingDescriptor, QueryBindingDescriptor } from "./ApplicationBindingTypes.js";
import type { ValidatedCommandContext } from "../services/ApplicationCommandRunner.js";
import { ApplicationError } from "../errors/ApplicationError.js";

type JsonRecord = Record<string, unknown>;
function record(value: unknown): JsonRecord { if (typeof value !== "object" || value === null || Array.isArray(value)) throw new ApplicationError("VALIDATION_FAILED", "Expected an object payload", {}); return value as JsonRecord; }
function string(value: unknown, field: string): string { if (typeof value !== "string" || value.trim() === "") throw new ApplicationError("VALIDATION_FAILED", `${field} is required`, { field }); return value; }
function array(value: unknown, field: string): readonly JsonRecord[] { if (!Array.isArray(value)) throw new ApplicationError("VALIDATION_FAILED", `${field} must be an array`, { field }); return value.map((item) => record(item)); }
function evidence(value: unknown): readonly EvidenceReference[] { return array(value, "evidence").map((item) => new EvidenceReference({ evidenceId: EvidenceId.from(string(item.evidenceId, "evidenceId")), source: string(item.source, "source"), type: string(item.type, "type"), capturedAt: string(item.capturedAt, "capturedAt"), ...(typeof item.locator === "string" ? { locator: item.locator } : {}), ...(typeof item.limitation === "string" ? { limitation: item.limitation } : {}) })); }
function lineage(value: unknown): readonly LineageReference[] { return array(value, "lineage").map((item) => new LineageReference({ sourceId: string(item.sourceId, "sourceId"), targetId: string(item.targetId, "targetId"), relationship: string(item.relationship, "relationship") as LineageRelationship, declaredAt: string(item.declaredAt, "declaredAt"), ...(typeof item.reason === "string" ? { reason: item.reason } : {}) })); }
function audit(payload: JsonRecord, context: ValidatedCommandContext, fields: Record<string, unknown> = {}) { return { actorReference: context.actor.reference, authorityReference: string(payload.authorityReference, "authorityReference"), ...(typeof payload.decisionReference === "string" ? { decisionReference: payload.decisionReference } : {}), ...(typeof payload.approvalReference === "string" ? { approvalReference: payload.approvalReference } : {}), reason: string(payload.reason ?? "application command", "reason"), occurredAt: string(payload.occurredAt ?? new Date().toISOString(), "occurredAt"), evidence: evidence(payload.evidence), ...fields }; }
function missionDto(mission: Mission): AggregateDto { const snapshot = mission.toSnapshot(); return { aggregateType: "Mission", id: mission.id.toString(), tenantId: mission.tenantId.toString(), version: mission.version.value, status: mission.status, data: snapshot as unknown as AggregateDto["data"] }; }
function payload(command: OperationCommandDto): JsonRecord { return record(command.payload); }
function expected(input: JsonRecord): Version { return Version.from(typeof input.expectedVersion === "number" ? input.expectedVersion : 0); }
function missionId(command: OperationCommandDto): string { const data = payload(command); return string(data.missionId ?? command.targetId, "missionId"); }
function committedMission(transactionId: string, resourceId: string): CommittedOperationResultDto {
  return Object.freeze({ transactionId, status: "COMMITTED", resourceReferences: Object.freeze([{ resourceType: "Mission", resourceId }]) });
}
function committedReplay(transactionId: string, command: OperationCommandDto): Promise<CommittedOperationResultDto> {
  return Promise.resolve(committedMission(transactionId, missionId(command)));
}
function validateCreate(command: OperationCommandDto): void {
  const data = payload(command);
  missionId(command);
  const metadata = record(data.metadata);
  string(metadata.title, "title");
  string(metadata.summary, "summary");
  string(metadata.description, "description");
  string(metadata.createdAt, "createdAt");
  string(metadata.updatedAt, "updatedAt");
  const intent = record(data.intent);
  string(intent.purpose, "purpose");
  string(intent.objective, "objective");
  string(intent.stewardReference, "stewardReference");
  string(intent.context, "context");
  string(intent.expectedOutcome, "expectedOutcome");
  evidence(data.evidence);
  lineage(data.lineage);
}
function validateRename(command: OperationCommandDto): void {
  const data = payload(command);
  missionId(command);
  string(data.title, "title");
  string(data.occurredAt, "occurredAt");
  expected(data);
}
function validateDecision(command: OperationCommandDto): void {
  const data = payload(command);
  missionId(command);
  string(data.authorityReference, "authorityReference");
  string(data.reason, "reason");
  string(data.occurredAt, "occurredAt");
  evidence(data.evidence);
  expected(data);
}
function validateComplete(command: OperationCommandDto): void {
  validateDecision(command);
  const outcome = record(payload(command).outcome);
  string(outcome.result, "result");
  string(outcome.learning, "learning");
  string(outcome.limitations, "limitations");
  string(outcome.residualObligations, "residualObligations");
}

export const createMissionBinding: CommandBindingDescriptor<OperationCommandDto, CommittedOperationResultDto, CommittedOperationResultDto> = {
  boundedContext: "mission", exportName: "CreateMission", operationName: "CreateMission", apiPortMethod: "createMission", repositoryView: { repositories: ["mission"] }, useCaseExport: "CreateMission", requestMapper: (request) => request,
  validator: validateCreate,
  handler: async (command, context, repositories) => { const data = payload(command); const intent = record(data.intent); const metadata = record(data.metadata); const id = missionId(command); await new CreateMission(repositories.mission).execute({ missionId: MissionId.from(id), tenantId: TenantId.from(context.tenantId), metadata: new MissionMetadata({ title: string(metadata.title, "title"), summary: string(metadata.summary, "summary"), description: string(metadata.description, "description"), createdAt: string(metadata.createdAt, "createdAt"), updatedAt: string(metadata.updatedAt, "updatedAt") }), intent: new MissionIntent({ purpose: string(intent.purpose, "purpose"), objective: string(intent.objective, "objective"), stewardReference: string(intent.stewardReference, "stewardReference"), context: string(intent.context, "context"), expectedOutcome: string(intent.expectedOutcome, "expectedOutcome"), ...(typeof intent.audience === "string" ? { audience: intent.audience } : {}), ...(typeof intent.noAudienceReason === "string" ? { noAudienceReason: intent.noAudienceReason } : {}), ...(Array.isArray(intent.constraints) ? { constraints: intent.constraints.map((item) => string(item, "constraint")) } : {}) }), evidence: evidence(data.evidence), lineage: lineage(data.lineage) }); return committedMission(context.transactionId, id); },
  replay: { kind: "FULL_CONFIRMED_RESULT", resolver: { resolve: committedReplay } },
  responseMapper: (result) => result
};

export const renameMissionBinding: CommandBindingDescriptor<OperationCommandDto, CommittedOperationResultDto, CommittedOperationResultDto> = {
  boundedContext: "mission", exportName: "RenameMission", operationName: "RenameMission", apiPortMethod: "renameMission", repositoryView: { repositories: ["mission"] }, useCaseExport: "RenameMission", requestMapper: (request) => request,
  validator: validateRename,
  handler: async (command, context, repositories) => { const data = payload(command); const id = missionId(command); await new RenameMission(repositories.mission).execute({ tenantId: TenantId.from(context.tenantId), missionId: MissionId.from(id), expectedVersion: expected(data), command: { title: string(data.title, "title"), occurredAt: string(data.occurredAt, "occurredAt") } }); return committedMission(context.transactionId, id); },
  replay: { kind: "FULL_CONFIRMED_RESULT", resolver: { resolve: committedReplay } }, responseMapper: (result) => result
};

function decisionCommand(command: OperationCommandDto, context: ValidatedCommandContext) { const data = payload(command); const raw = audit(data, context); const decision = typeof raw.decisionReference === "string" ? DecisionReference.fromJSON({ id: raw.decisionReference, tenantId: context.tenantId }) : undefined; const approval = typeof raw.approvalReference === "string" ? ApprovalReference.fromJSON({ id: raw.approvalReference, tenantId: context.tenantId }) : undefined; return { tenantId: TenantId.from(context.tenantId), missionId: MissionId.from(string(command.targetId, "targetId")), expectedVersion: expected(data), command: { actorReference: raw.actorReference, authorityReference: AuthorityReference.fromJSON({ id: raw.authorityReference, tenantId: context.tenantId }), reason: raw.reason, occurredAt: raw.occurredAt, evidence: raw.evidence, ...(decision === undefined ? {} : { decisionReference: decision }), ...(approval === undefined ? {} : { approvalReference: approval }) } }; }
export const activateMissionBinding: CommandBindingDescriptor<OperationCommandDto, CommittedOperationResultDto, CommittedOperationResultDto> = { boundedContext: "mission", exportName: "ActivateMission", operationName: "ActivateMission", apiPortMethod: "activateMission", repositoryView: { repositories: ["mission"] }, useCaseExport: "ActivateMission", requestMapper: (request) => request, validator: validateDecision, handler: async (command, context, repositories) => { const id = missionId(command); await new ActivateMission(repositories.mission).execute(decisionCommand(command, context)); return committedMission(context.transactionId, id); }, replay: { kind: "FULL_CONFIRMED_RESULT", resolver: { resolve: committedReplay } }, responseMapper: (result) => result };
export const completeMissionBinding: CommandBindingDescriptor<OperationCommandDto, CommittedOperationResultDto, CommittedOperationResultDto> = { boundedContext: "mission", exportName: "CompleteMission", operationName: "CompleteMission", apiPortMethod: "completeMission", repositoryView: { repositories: ["mission"] }, useCaseExport: "CompleteMission", requestMapper: (request) => request, validator: validateComplete, handler: async (command, context, repositories) => { const data = payload(command); const input = decisionCommand(command, context); const outcome = record(data.outcome); await new CompleteMission(repositories.mission).execute({ ...input, command: { ...input.command, outcome: new MissionOutcome({ result: string(outcome.result, "result"), learning: string(outcome.learning, "learning"), limitations: string(outcome.limitations, "limitations"), residualObligations: string(outcome.residualObligations, "residualObligations") }) } }); return committedMission(context.transactionId, missionId(command)); }, replay: { kind: "FULL_CONFIRMED_RESULT", resolver: { resolve: committedReplay } }, responseMapper: (result) => result };

export const missionQueryBinding: QueryBindingDescriptor<QueryDto, Mission | null, AggregateDto | null> = { boundedContext: "mission", exportName: "MissionRepository.findById", operationName: "getMission", apiPortMethod: "getMission", repositoryView: { repositories: ["mission"] }, requestMapper: (request) => request, validator: (query) => { if (query.targetId === undefined) throw new ApplicationError("VALIDATION_FAILED", "targetId is required", {}); }, handler: async (query, context, repositories) => query.targetId === undefined ? null : repositories.mission.findById(TenantId.from(context.tenantId), MissionId.from(query.targetId)), responseMapper: (result) => result === null ? null : missionDto(result) };

export const missionBindings = Object.freeze({ createMission: createMissionBinding, activateMission: activateMissionBinding, renameMission: renameMissionBinding, completeMission: completeMissionBinding, getMission: missionQueryBinding });
