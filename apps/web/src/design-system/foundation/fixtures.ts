import type { AuditEntry, CanonicalReference, WorkforceContribution } from "./contracts.js";

export const missionFixture = Object.freeze({
  id: "mission-institutional-clarity-2026-3",
  title: "Clareza institucional para o próximo ciclo",
  objective: "Estabelecer uma narrativa institucional clara para orientar decisões e comunicações no ciclo 2026.3.",
  steward: "Ana Lemos",
  updatedAt: "2026-09-03T14:32:00-03:00",
  dueAt: "2026-09-18",
});

export const lineageFixture: readonly CanonicalReference[] = Object.freeze([
  { type: "Mission", id: missionFixture.id, label: "Clareza institucional", state: "awaiting", stateLabel: "Aguardando decisão" },
  { type: "Institutional Asset", id: "asset-institutional-brief-2026-3-v1", label: "Institutional Brief — Ciclo 2026.3", state: "awaiting", stateLabel: "Aguardando decisão" },
  { type: "Channel Variant", id: "variant-linkedin-brief-pending", label: "Brief Executivo · LinkedIn", state: "neutral", stateLabel: "Pendente", locked: true },
  { type: "Distribution Package", id: "package-linkedin-brief-not-constituted", label: "DP — LinkedIn Brief Set 2026", state: "neutral", stateLabel: "Pendente", locked: true },
]);

export const workforceFixture: readonly WorkforceContribution[] = Object.freeze([
  { role: "Analista de Pesquisa", contribution: "Coletou dados e referências", state: "approved" },
  { role: "Redator Institucional", contribution: "Redigiu narrativa e síntese", state: "approved" },
  { role: "Estrategista de Conteúdo", contribution: "Definiu posicionamentos", state: "approved" },
]);

export const auditFixture: readonly AuditEntry[] = Object.freeze([
  { id: "audit-04", at: "2026-09-03T11:07:00-03:00", actor: "AI Workforce", action: "Concluiu o Institutional Asset e encaminhou para decisão.", objectId: "asset-institutional-brief-2026-3-v1" },
  { id: "audit-03", at: "2026-09-03T10:42:00-03:00", actor: "AI Workforce", action: "Concluiu pesquisa e coleta de dados.", objectId: missionFixture.id },
  { id: "audit-02", at: "2026-09-03T10:15:00-03:00", actor: "AI Workforce", action: "Registrou a preparação da Channel Variant.", objectId: "variant-linkedin-brief-pending" },
  { id: "audit-01", at: "2026-09-03T09:15:00-03:00", actor: "Steward", action: "Criou a Mission e definiu seus objetivos.", objectId: missionFixture.id },
]);
