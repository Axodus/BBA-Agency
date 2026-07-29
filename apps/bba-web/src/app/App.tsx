import { BbaSdkProvider } from "@bba/sdk-react";
import { ThemeProvider } from "@bba/ui";
import { useMemo, useState } from "react";
import { RouterProvider } from "react-router-dom";
import { router } from "../routes/router.js";
import { browserCorrelationIds, createDevAdapters, type DevSessionConfiguration } from "../runtime/dev-session.js";
import { DevSessionSetup } from "../runtime/DevSessionSetup.js";

const configuredBaseUrl = import.meta.env.VITE_BBA_API_BASE_URL ?? "";

export function App() {
  const [configuration, setConfiguration] = useState<DevSessionConfiguration>();
  const adapters = useMemo(() => configuration === undefined ? null : createDevAdapters(configuration), [configuration]);
  if (configuration === undefined || adapters === null) return <ThemeProvider><DevSessionSetup initialBaseUrl={configuredBaseUrl} onConfigure={setConfiguration} /></ThemeProvider>;
  return <ThemeProvider><BbaSdkProvider auth={adapters.auth} baseUrl={configuration.baseUrl} correlationIds={browserCorrelationIds} workspace={adapters.workspace}><RouterProvider router={router} /></BbaSdkProvider></ThemeProvider>;
}
