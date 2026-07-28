import { createBrowserRouter } from "react-router-dom";
import { RuntimeShell } from "../app/RuntimeShell.js";
import { MissionsPage } from "../pages/MissionsPage.js";
import { OverviewPage } from "../pages/OverviewPage.js";
import { RouteErrorPage } from "../pages/RouteErrorPage.js";

export const router = createBrowserRouter([{ path: "/", element: <RuntimeShell />, errorElement: <RouteErrorPage />, children: [{ index: true, element: <OverviewPage /> }, { path: "missions", element: <MissionsPage /> }, { path: "missions/:missionId", lazy: () => import("../pages/MissionDetailPage.js") }] }]);
