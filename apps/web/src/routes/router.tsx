import { createBrowserRouter, Navigate } from "react-router-dom";
import { StaticAgencyShell } from "../static-publisher/components/StaticAgencyShell.js";
import { AgencyHome } from "../static-publisher/pages/AgencyHome.js";
import { PublisherOverview } from "../static-publisher/pages/PublisherOverview.js";
import { ProjectListPage } from "../static-publisher/pages/ProjectListPage.js";
import { EditorialContextWizard } from "../static-publisher/pages/EditorialContextWizard.js";
import { ProjectWorkspace } from "../static-publisher/pages/ProjectWorkspace.js";
import { StaticAiSettings } from "../static-publisher/pages/StaticAiSettings.js";
import { PlatformDiagnostics } from "../static-publisher/pages/PlatformDiagnostics.js";
import { ServicesPage } from "../static-publisher/pages/ServicesPage.js";
import { DeliveriesPage } from "../static-publisher/pages/DeliveriesPage.js";
import { RouteErrorPage } from "../pages/RouteErrorPage.js";
import { BbaProductShell } from "../design-system/foundation/BbaProductShell.js";
import { MissionWorkspace } from "../design-system/foundation/MissionWorkspace.js";
import {
  AccountPage, FoundationOverview, SettingsPage, SurfaceTemplate, UiKitPage, surfaces,
} from "../design-system/foundation/FoundationPages.js";

export const router = createBrowserRouter([
{ path: "/foundation", element: <BbaProductShell />, errorElement: <RouteErrorPage />, children: [
  { index: true, element: <FoundationOverview /> },
  { path: "missions/:missionId", element: <MissionWorkspace /> },
  { path: "institutional-assets", element: <SurfaceTemplate surface={surfaces.assets} /> },
  { path: "distribution-packages", element: <SurfaceTemplate surface={surfaces.packages} /> },
  { path: "governance", element: <SurfaceTemplate surface={surfaces.governance} /> },
  { path: "institution", element: <SurfaceTemplate surface={surfaces.institution} /> },
  { path: "account", element: <AccountPage /> },
  { path: "settings", element: <SettingsPage /> },
  { path: "ui-kit", element: <UiKitPage /> },
] },
{ path: "/", element: <StaticAgencyShell />, errorElement: <RouteErrorPage />, children: [
  { index: true, element: <AgencyHome /> }, { path: "services", element: <ServicesPage /> }, { path: "services/publisher", element: <PublisherOverview /> }, { path: "services/publisher/new", element: <EditorialContextWizard /> },
  { path: "projects", element: <ProjectListPage /> }, { path: "projects/:projectId", element: <Navigate replace to="context" /> }, { path: "projects/:projectId/:section", element: <ProjectWorkspace /> },
  { path: "deliveries", element: <DeliveriesPage /> }, { path: "settings/ai", element: <StaticAiSettings /> }, { path: "platform-diagnostics", element: <PlatformDiagnostics /> },
] }]);
