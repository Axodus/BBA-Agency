import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AppHeader } from "./components/AppHeader.js";
import { AgencyFooter } from "../app/components/AgencyFooter.js";
import { Home } from "./pages/Home.js";
import { Services } from "./pages/Services.js";
import { ProductDetail } from "./pages/ProductDetail.js";
import { Projects } from "./pages/Projects.js";
import { ProjectDetail } from "./pages/ProjectDetail.js";
import { Deliveries } from "./pages/Deliveries.js";
import { DeliveryDetail } from "./pages/DeliveryDetail.js";
import { Models } from "./pages/Models.js";
import { Unavailable } from "./pages/Unavailable.js";

function Shell({ children }: { readonly children: React.ReactNode }) {
  return (
    <>
      <AppHeader />
      {children}
      <AgencyFooter />
    </>
  );
}

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <Shell>
              <Home />
            </Shell>
          }
        />
        <Route
          path="/services"
          element={
            <Shell>
              <Services />
            </Shell>
          }
        />
        <Route
          path="/services/:serviceSlug"
          element={
            <Shell>
              <ProductDetail />
            </Shell>
          }
        />
        <Route
          path="/projects"
          element={
            <Shell>
              <Projects />
            </Shell>
          }
        />
        <Route
          path="/projects/new"
          element={
            <Shell>
              <Unavailable />
            </Shell>
          }
        />
        <Route
          path="/projects/:projectSlug"
          element={
            <Shell>
              <ProjectDetail />
            </Shell>
          }
        />
        <Route
          path="/deliveries"
          element={
            <Shell>
              <Deliveries />
            </Shell>
          }
        />
        <Route
          path="/deliveries/new"
          element={
            <Shell>
              <Unavailable />
            </Shell>
          }
        />
        <Route
          path="/deliveries/:deliverySlug"
          element={
            <Shell>
              <DeliveryDetail />
            </Shell>
          }
        />
        <Route
          path="/ai-models"
          element={
            <Shell>
              <Models />
            </Shell>
          }
        />
        <Route
          path="/unavailable"
          element={
            <Shell>
              <Unavailable />
            </Shell>
          }
        />
        <Route
          path="*"
          element={
            <Shell>
              <Unavailable />
            </Shell>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
