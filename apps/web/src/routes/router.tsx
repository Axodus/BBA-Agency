import { createBrowserRouter, Navigate } from "react-router-dom";
import { DeliveriesPage } from "../static-publisher/pages/DeliveriesPage.js";
import { EditorialContextWizard } from "../static-publisher/pages/EditorialContextWizard.js";
import { ProjectListPage } from "../static-publisher/pages/ProjectListPage.js";
import { ProjectWorkspace } from "../static-publisher/pages/ProjectWorkspace.js";
import { PublisherOverview } from "../static-publisher/pages/PublisherOverview.js";
import { ServicesPage } from "../static-publisher/pages/ServicesPage.js";
import { RouteErrorPage } from "../pages/RouteErrorPage.js";
import { BbaProductShell } from "../design-system/foundation/BbaProductShell.js";
import { MissionWorkspace } from "../design-system/foundation/MissionWorkspace.js";
import {
  AccountPage, FoundationOverview, SettingsPage, SurfaceTemplate, UiKitPage, surfaces,
} from "../design-system/foundation/FoundationPages.js";

export const router = createBrowserRouter([
{ path: "/", element: <BbaProductShell />, errorElement: <RouteErrorPage />, children: [
  { index: true, element: <FoundationOverview /> },
  { path: "missions", element: <Navigate replace to="/missions/msn-024" /> },
  { path: "missions/:missionId", element: <MissionWorkspace /> },
  { path: "institutional-assets", element: <SurfaceTemplate surface={surfaces.assets} /> },
  { path: "distribution-packages", element: <SurfaceTemplate surface={surfaces.packages} /> },
  { path: "governance", element: <SurfaceTemplate surface={surfaces.governance} /> },
  { path: "institution", element: <SurfaceTemplate surface={surfaces.institution} /> },
  { path: "account", element: <AccountPage /> },
  { path: "settings", element: <SettingsPage /> },
  { path: "ui-kit", element: <UiKitPage /> },
  { path: "foundation", element: <Navigate replace to="/" /> },
  { path: "foundation/missions/:missionId", element: <Navigate replace to="/missions/msn-024" /> },
  { path: "foundation/institutional-assets", element: <Navigate replace to="/institutional-assets" /> },
  { path: "foundation/distribution-packages", element: <Navigate replace to="/distribution-packages" /> },
  { path: "foundation/governance", element: <Navigate replace to="/governance" /> },
  { path: "foundation/institution", element: <Navigate replace to="/institution" /> },
  { path: "foundation/account", element: <Navigate replace to="/account" /> },
  { path: "foundation/settings", element: <Navigate replace to="/settings" /> },
  { path: "foundation/ui-kit", element: <Navigate replace to="/ui-kit" /> },
  { path: "services", element: <ServicesPage /> },
  { path: "services/publisher", element: <PublisherOverview /> },
  { path: "services/publisher/new", element: <EditorialContextWizard /> },
  { path: "projects", element: <ProjectListPage /> },
  { path: "projects/:projectId", element: <Navigate replace to="context" /> },
  { path: "projects/:projectId/:section", element: <ProjectWorkspace /> },
  { path: "deliveries", element: <DeliveriesPage /> },
  { path: "settings/ai", element: <Navigate replace to="/settings" /> },
  { path: "platform-diagnostics", element: <Navigate replace to="/institution" /> },
] }]);
