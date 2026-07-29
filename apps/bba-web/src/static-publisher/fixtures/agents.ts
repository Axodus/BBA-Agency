import type { AgentParticipationView } from "../models.js";
export const projectAgents: readonly AgentParticipationView[] = [
  { id: "context", role: "Context analyst", visibleStage: "Understanding context", status: "COMPLETE", simulatedTime: "18 min", resultVersion: 1, technicalName: "Context Analyst" },
  { id: "strategy", role: "Editorial strategist", visibleStage: "Planning strategy", status: "COMPLETE", simulatedTime: "24 min", resultVersion: 1, technicalName: "Editorial Strategist" },
  { id: "channels", role: "Channel specialist", visibleStage: "Producing content", status: "COMPLETE", simulatedTime: "31 min", resultVersion: 2, technicalName: "Platform Adapter" },
  { id: "consistency", role: "Consistency reviewer", visibleStage: "Validating consistency", status: "COMPLETE", simulatedTime: "12 min", resultVersion: 2, technicalName: "Semantic Consistency Reviewer" },
];
