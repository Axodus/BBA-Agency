import { z } from "zod";
import { evidenceSchema, lineageSchema, reasonSchema } from "../common.js";

export const createMissionSchema = z.object({ reason: reasonSchema, missionId: z.string().trim().min(1), title: z.string().trim().min(1), summary: z.string().trim().min(1), description: z.string().trim().min(1), createdAt: z.string().min(1), updatedAt: z.string().min(1), purpose: z.string().trim().min(1), objective: z.string().trim().min(1), stewardReference: z.string().trim().min(1), context: z.string().trim().min(1), expectedOutcome: z.string().trim().min(1), audience: z.string().trim().optional(), evidence: z.array(evidenceSchema).min(1), lineage: z.array(lineageSchema).min(1) });
export type CreateMissionFormValues = z.infer<typeof createMissionSchema>;
