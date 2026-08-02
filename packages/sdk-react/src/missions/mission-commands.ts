import { missionActivateMission, missionCompleteMission, missionCreateMission, missionRenameMission } from "@bba/api-client";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { commandHeaders, executeCommand, requireReady, type GeneratedCommandResponse } from "../commands/execute-command.js";
import type { CommandIntent } from "../commands/command-types.js";
import { useCommandIntent } from "../commands/use-command-intent.js";
import { useBbaSdkRuntime } from "../provider/BbaSdkProvider.js";

export interface EvidenceInput { readonly evidenceId: string; readonly source: string; readonly type: string; readonly capturedAt: string; readonly locator?: string; readonly limitation?: string; }
export interface LineageInput { readonly sourceId: string; readonly targetId: string; readonly relationship: string; readonly declaredAt: string; readonly reason?: string; }
export interface MissionCreateInput { readonly missionId: string; readonly metadata: { readonly title: string; readonly summary: string; readonly description: string; readonly createdAt: string; readonly updatedAt: string }; readonly intent: { readonly purpose: string; readonly objective: string; readonly stewardReference: string; readonly context: string; readonly expectedOutcome: string; readonly audience?: string; readonly noAudienceReason?: string; readonly constraints?: readonly string[] }; readonly evidence: readonly EvidenceInput[]; readonly lineage: readonly LineageInput[]; }
export interface MissionRenameInput { readonly missionId: string; readonly expectedVersion: number; readonly title: string; readonly occurredAt: string; }
export interface MissionDecisionInput { readonly missionId: string; readonly expectedVersion: number; readonly authorityReference: string; readonly decisionReference?: string; readonly approvalReference?: string; readonly occurredAt: string; readonly evidence: readonly EvidenceInput[]; }
export interface MissionCompleteInput extends MissionDecisionInput { readonly outcome: { readonly result: string; readonly learning: string; readonly limitations: string; readonly residualObligations: string }; }

type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };
function evidenceJson(values: readonly EvidenceInput[]): JsonValue[] { return values.map((value) => ({ evidenceId: value.evidenceId, source: value.source, type: value.type, capturedAt: value.capturedAt, ...(value.locator === undefined ? {} : { locator: value.locator }), ...(value.limitation === undefined ? {} : { limitation: value.limitation }) })); }
function lineageJson(values: readonly LineageInput[]): JsonValue[] { return values.map((value) => ({ sourceId: value.sourceId, targetId: value.targetId, relationship: value.relationship, declaredAt: value.declaredAt, ...(value.reason === undefined ? {} : { reason: value.reason }) })); }

function useMissionCommand<T>(operationId: string, invoke: (runtime: ReturnType<typeof requireReady>, intent: CommandIntent<T>) => Promise<GeneratedCommandResponse>) {
  const runtime = useBbaSdkRuntime(); const queryClient = useQueryClient();
  const execute = useCallback((intent: CommandIntent<T>) => { const ready = requireReady(runtime.ready); const payload = intent.payload as T & { readonly missionId: string }; return executeCommand(ready, queryClient, operationId, intent, () => invoke(ready, intent), { primaryId: payload.missionId }); }, [invoke, operationId, queryClient, runtime.ready]);
  return useCommandIntent(execute);
}

export function useMissionCreateMissionCommand() { return useMissionCommand<MissionCreateInput>("missionCreateMission", (runtime, intent) => missionCreateMission({ client: runtime.client, headers: commandHeaders(runtime, intent), body: { data: { missionId: intent.payload.missionId, metadata: { ...intent.payload.metadata }, intent: { ...intent.payload.intent, constraints: [...(intent.payload.intent.constraints ?? [])] }, evidence: evidenceJson(intent.payload.evidence), lineage: lineageJson(intent.payload.lineage) }, meta: { reason: intent.reason } } })); }
export function useMissionRenameMissionCommand() { return useMissionCommand<MissionRenameInput>("missionRenameMission", (runtime, intent) => missionRenameMission({ client: runtime.client, path: { missionId: intent.payload.missionId }, headers: commandHeaders(runtime, intent), body: { data: intent.payload, meta: { reason: intent.reason } } })); }
export function useMissionActivateMissionCommand() { return useMissionCommand<MissionDecisionInput>("missionActivateMission", (runtime, intent) => missionActivateMission({ client: runtime.client, path: { missionId: intent.payload.missionId }, headers: commandHeaders(runtime, intent), body: { data: { ...intent.payload, evidence: evidenceJson(intent.payload.evidence) }, meta: { reason: intent.reason } } })); }
export function useMissionCompleteMissionCommand() { return useMissionCommand<MissionCompleteInput>("missionCompleteMission", (runtime, intent) => missionCompleteMission({ client: runtime.client, path: { missionId: intent.payload.missionId }, headers: commandHeaders(runtime, intent), body: { data: { ...intent.payload, evidence: evidenceJson(intent.payload.evidence) }, meta: { reason: intent.reason } } })); }
