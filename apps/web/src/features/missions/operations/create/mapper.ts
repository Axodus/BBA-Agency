import type { MissionCreateInput } from "@bba/sdk-react";
import { canonicalTimestamp } from "../../../shared/forms/form-utils.js";
import { mapEvidence, mapLineage } from "../common.js";
import type { CreateMissionFormValues } from "./schema.js";

export function mapCreateMission(values: CreateMissionFormValues): MissionCreateInput { return { missionId: values.missionId, metadata: { title: values.title, summary: values.summary, description: values.description, createdAt: canonicalTimestamp(values.createdAt), updatedAt: canonicalTimestamp(values.updatedAt) }, intent: { purpose: values.purpose, objective: values.objective, stewardReference: values.stewardReference, context: values.context, expectedOutcome: values.expectedOutcome, ...(values.audience ? { audience: values.audience } : {}) }, evidence: mapEvidence(values.evidence), lineage: mapLineage(values.lineage) }; }
