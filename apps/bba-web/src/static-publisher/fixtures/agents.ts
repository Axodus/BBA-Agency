import type { AgentParticipationView } from "../models.js";
export const projectAgents: readonly AgentParticipationView[] = [
  { id: "context", role: "Analista de contexto", visibleStage: "Compreendendo contexto", status: "COMPLETE", simulatedTime: "18 min", resultVersion: 1, technicalName: "Context Analyst" },
  { id: "strategy", role: "Estrategista editorial", visibleStage: "Planejando estratégia", status: "COMPLETE", simulatedTime: "24 min", resultVersion: 1, technicalName: "Editorial Strategist" },
  { id: "channels", role: "Especialista em canais", visibleStage: "Produzindo conteúdos", status: "COMPLETE", simulatedTime: "31 min", resultVersion: 2, technicalName: "Platform Adapter" },
  { id: "consistency", role: "Revisor de consistência", visibleStage: "Validando consistência", status: "COMPLETE", simulatedTime: "12 min", resultVersion: 2, technicalName: "Semantic Consistency Reviewer" },
];
