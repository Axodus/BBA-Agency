import type { AuditEntry, CanonicalReference, WorkforceContribution } from "./contracts.js";

export const missionFixture = Object.freeze({
  id: "mission-institutional-clarity-2026-3",
  title: "Institutional clarity for the next cycle",
  objective: "Establish a clear institutional narrative to guide decisions and communications in cycle 2026.3.",
  steward: "Ana Lemos",
  updatedAt: "2026-09-03T14:32:00-03:00",
  dueAt: "2026-09-18",
});

export const lineageFixture: readonly CanonicalReference[] = Object.freeze([
  { type: "Mission", id: missionFixture.id, label: "Institutional clarity", state: "awaiting", stateLabel: "Awaiting decision" },
  { type: "Institutional Asset", id: "asset-institutional-brief-2026-3-v1", label: "Institutional Brief — Cycle 2026.3", state: "awaiting", stateLabel: "Awaiting decision" },
  { type: "Channel Variant", id: "variant-linkedin-brief-pending", label: "Executive Brief · LinkedIn", state: "blocked", stateLabel: "Blocked", locked: true },
  { type: "Distribution Package", id: "package-linkedin-brief-not-constituted", label: "DP — LinkedIn Brief Set 2026", state: "blocked", stateLabel: "Blocked", locked: true },
]);

export const workforceFixture: readonly WorkforceContribution[] = Object.freeze([
  { role: "Research Analyst", contribution: "Collected data and references", state: "approved" },
  { role: "Institutional Writer", contribution: "Drafted narrative and synthesis", state: "approved" },
  { role: "Content Strategist", contribution: "Defined positions", state: "approved" },
]);

export const auditFixture: readonly AuditEntry[] = Object.freeze([
  { id: "audit-04", at: "2026-09-03T11:07:00-03:00", actor: "AI Workforce", action: "Completed the Institutional Asset and submitted it for a decision.", objectId: "asset-institutional-brief-2026-3-v1" },
  { id: "audit-03", at: "2026-09-03T10:42:00-03:00", actor: "AI Workforce", action: "Completed research and data collection.", objectId: missionFixture.id },
  { id: "audit-02", at: "2026-09-03T10:15:00-03:00", actor: "AI Workforce", action: "Recorded the planned Channel Variant; preparation remains blocked.", objectId: "variant-linkedin-brief-pending" },
  { id: "audit-01", at: "2026-09-03T09:15:00-03:00", actor: "Steward", action: "Created the Mission and defined its objectives.", objectId: missionFixture.id },
]);
