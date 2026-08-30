import { agencyProjects } from "./generated/project-content.generated.js";

export { agencyProjects };
export type {
  AgencyProjectContent,
  ProjectAgentRole,
  ProjectDeliverable,
  ProjectExampleStatus,
  ProjectFaqItem,
  ProjectHumanDecision,
  ProjectRevisionExample,
  ProjectTraceRecord,
  ProjectWorkflowStage,
} from "./project-content.types.js";

export const agencyProjectMap = new Map(
  agencyProjects.map((project) => [project.id, project] as const),
);

export const agencyProjectRouteMap = new Map(
  agencyProjects.map((project) => [project.slug, project] as const),
);

export function getAgencyProjectById(projectId: string) {
  return agencyProjectMap.get(projectId);
}

export function getAgencyProjectByRouteSegment(projectSlug: string) {
  return agencyProjectRouteMap.get(projectSlug);
}
