import { createBrowserRouter, Navigate } from "react-router-dom";
import { StaticAgencyShell } from "../static-publisher/components/StaticAgencyShell.js";
import { AgencyHome } from "../static-publisher/pages/AgencyHome.js";
import { PublisherOverview } from "../static-publisher/pages/PublisherOverview.js";
import { ProjectListPage } from "../static-publisher/pages/ProjectListPage.js";
import { EditorialContextWizard } from "../static-publisher/pages/EditorialContextWizard.js";
import { ProjectWorkspace } from "../static-publisher/pages/ProjectWorkspace.js";
import { StaticAiSettings } from "../static-publisher/pages/StaticAiSettings.js";
import { PlatformDiagnostics } from "../static-publisher/pages/PlatformDiagnostics.js";
import { RouteErrorPage } from "../pages/RouteErrorPage.js";

export const router = createBrowserRouter([{ path: "/", element: <StaticAgencyShell />, errorElement: <RouteErrorPage />, children: [
  { index: true, element: <AgencyHome /> }, { path: "services/publisher", element: <PublisherOverview /> }, { path: "services/publisher/new", element: <EditorialContextWizard /> },
  { path: "projects", element: <ProjectListPage /> }, { path: "projects/:projectId", element: <Navigate replace to="context" /> }, { path: "projects/:projectId/:section", element: <ProjectWorkspace /> },
  { path: "settings/ai", element: <StaticAiSettings /> }, { path: "platform-diagnostics", element: <PlatformDiagnostics /> },
] }]);
