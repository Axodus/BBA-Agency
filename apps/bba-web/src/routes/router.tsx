import { createBrowserRouter } from "react-router-dom";
import { RuntimeShell } from "../app/RuntimeShell.js";
import { MissionsPage } from "../pages/MissionsPage.js";
import { RouteErrorPage } from "../pages/RouteErrorPage.js";
import { MissionCreatePage } from "../features/missions/MissionCreatePage.js";
import { GovernanceWorkspacePage } from "../features/governance/GovernanceWorkspacePage.js";
import { AIWorkforceWorkspacePage } from "../features/ai-workforce/AIWorkforceWorkspacePage.js";
import { InstitutionalAssetsWorkspacePage } from "../features/institutional-assets/InstitutionalAssetsWorkspacePage.js";
import { KnowledgePolicyWorkspacePage } from "../features/knowledge-policy/KnowledgePolicyWorkspacePage.js";
import { WorkflowWorkspacePage } from "../features/workflow/WorkflowWorkspacePage.js";
import { ReviewWorkspacePage } from "../features/review/ReviewWorkspacePage.js";
import { PublicationWorkspacePage } from "../features/publication/PublicationWorkspacePage.js";
import { ConnectorWorkspacePage } from "../features/connector/ConnectorWorkspacePage.js";
import { AgencyHomePage } from "../features/publisher/AgencyHomePage.js";
import { AiSettingsPage } from "../features/publisher/AiSettingsPage.js";
import { NewProjectPage } from "../features/publisher/NewProjectPage.js";
import { ProjectsPage } from "../features/publisher/ProjectsPage.js";
import { ProjectWorkspacePage } from "../features/publisher/ProjectWorkspacePage.js";

export const router = createBrowserRouter([{ path: "/", element: <RuntimeShell />, errorElement: <RouteErrorPage />, children: [
  { index: true, element: <AgencyHomePage /> }, { path: "projects", element: <ProjectsPage /> }, { path: "projects/new", element: <NewProjectPage /> }, { path: "projects/:projectId", element: <ProjectWorkspacePage /> }, { path: "settings/ai", element: <AiSettingsPage /> },
  { path: "missions", element: <MissionsPage /> }, { path: "missions/new", element: <MissionCreatePage /> }, { path: "missions/:missionId", lazy: () => import("../pages/MissionDetailPage.js") },
  { path: "governance", element: <GovernanceWorkspacePage /> }, { path: "ai-workforce", element: <AIWorkforceWorkspacePage /> },
  { path: "institutional-assets", element: <InstitutionalAssetsWorkspacePage /> }, { path: "knowledge", element: <KnowledgePolicyWorkspacePage /> },
  { path: "workflows", element: <WorkflowWorkspacePage /> }, { path: "reviews", element: <ReviewWorkspacePage /> }, { path: "publications", element: <PublicationWorkspacePage /> },
  { path: "connectors", element: <ConnectorWorkspacePage /> }
] }]);
