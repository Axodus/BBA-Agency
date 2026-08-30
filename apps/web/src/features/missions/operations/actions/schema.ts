import { z } from "zod";
import { evidenceSchema, reasonSchema } from "../common.js";

export const renameMissionSchema = z.object({ reason: reasonSchema, title: z.string().trim().min(1), expectedVersion: z.number().int().positive(), occurredAt: z.string().min(1) });
export const decisionMissionSchema = z.object({ reason: reasonSchema, expectedVersion: z.number().int().positive(), authorityReference: z.string().trim().min(1), decisionReference: z.string().trim().optional(), approvalReference: z.string().trim().optional(), occurredAt: z.string().min(1), evidence: z.array(evidenceSchema).min(1) });
export const completeMissionSchema = decisionMissionSchema.extend({ result: z.string().trim().min(1), learning: z.string().trim().min(1), limitations: z.string().trim().min(1), residualObligations: z.string().trim().min(1) });
export type RenameMissionFormValues = z.infer<typeof renameMissionSchema>; export type DecisionMissionFormValues = z.infer<typeof decisionMissionSchema>; export type CompleteMissionFormValues = z.infer<typeof completeMissionSchema>;
