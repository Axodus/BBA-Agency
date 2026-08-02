import type { MissionCompleteInput, MissionDecisionInput, MissionRenameInput } from "@bba/sdk-react";
import { canonicalTimestamp } from "../../../shared/forms/form-utils.js";
import { mapEvidence } from "../common.js";
import type { CompleteMissionFormValues, DecisionMissionFormValues, RenameMissionFormValues } from "./schema.js";

export const mapRenameMission = (missionId: string, values: RenameMissionFormValues): MissionRenameInput => ({ missionId, title: values.title, expectedVersion: values.expectedVersion, occurredAt: canonicalTimestamp(values.occurredAt) });
export const mapDecisionMission = (missionId: string, values: DecisionMissionFormValues): MissionDecisionInput => ({ missionId, expectedVersion: values.expectedVersion, authorityReference: values.authorityReference, ...(values.decisionReference ? { decisionReference: values.decisionReference } : {}), ...(values.approvalReference ? { approvalReference: values.approvalReference } : {}), occurredAt: canonicalTimestamp(values.occurredAt), evidence: mapEvidence(values.evidence) });
export const mapCompleteMission = (missionId: string, values: CompleteMissionFormValues): MissionCompleteInput => ({ ...mapDecisionMission(missionId, values), outcome: { result: values.result, learning: values.learning, limitations: values.limitations, residualObligations: values.residualObligations } });
