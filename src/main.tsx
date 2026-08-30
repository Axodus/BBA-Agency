import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App.js";
import { registerWebMcpTools } from "./webmcp.js";
import "../app/globals.css";

const root = document.getElementById("root");
if (root === null) throw new Error("Root element not found");
createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

void registerWebMcpTools().catch((error: unknown) => {
  console.warn("WebMCP tool registration failed.", error);
});
