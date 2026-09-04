import { z } from "zod";
import { canonicalTimestamp, localTimestamp } from "../../shared/forms/form-utils.js";

export const evidenceSchema = z.object({ evidenceId: z.string().trim().min(1), source: z.string().trim().min(1), type: z.string().trim().min(1), capturedAt: z.string().min(1) });
export const lineageSchema = z.object({ sourceId: z.string().trim().min(1), targetId: z.string().trim().min(1), relationship: z.string().trim().min(1), declaredAt: z.string().min(1) });
export const reasonSchema = z.string().trim().min(3, "Informe a justificativa operacional.");
export const auditDefaults = () => ({ occurredAt: localTimestamp(), evidence: [{ evidenceId: "", source: "", type: "", capturedAt: localTimestamp() }], lineage: [{ sourceId: "", targetId: "", relationship: "", declaredAt: localTimestamp() }] });
export const mapEvidence = (items: readonly z.infer<typeof evidenceSchema>[]) => items.map((item) => ({ ...item, capturedAt: canonicalTimestamp(item.capturedAt) }));
export const mapLineage = (items: readonly z.infer<typeof lineageSchema>[]) => items.map((item) => ({ ...item, declaredAt: canonicalTimestamp(item.declaredAt) }));
