import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@bba/ui/styles.css";
import "./design-system/tokens/agency.css";
import "./styles.css";
import "./design-system/components/agency-components.css";
import "./design-system/patterns/agency-home.css";
import "./design-system/foundation/foundation.css";
import { App } from "./app/App.js";

const root = document.getElementById("root");
if (root === null) throw new Error("BBA application root was not found");
createRoot(root).render(<StrictMode><App /></StrictMode>);
