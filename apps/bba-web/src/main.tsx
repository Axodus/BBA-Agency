import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@bba/ui/styles.css";
import "./styles.css";
import { App } from "./app/App.js";

const root = document.getElementById("root");
if (root === null) throw new Error("BBA application root was not found");
createRoot(root).render(<StrictMode><App /></StrictMode>);
