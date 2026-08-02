import { ThemeProvider } from "@bba/ui";
import { RouterProvider } from "react-router-dom";
import { router } from "../routes/router.js";
import { StaticPublisherProvider } from "../static-publisher/StaticPublisherProvider.js";
import { I18nProvider } from "../i18n/index.js";

export function App() {
  return <I18nProvider><ThemeProvider><StaticPublisherProvider><RouterProvider router={router} /></StaticPublisherProvider></ThemeProvider></I18nProvider>;
}
