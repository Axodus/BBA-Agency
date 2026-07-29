import { ThemeProvider } from "@bba/ui";
import { RouterProvider } from "react-router-dom";
import { router } from "../routes/router.js";
import { StaticPublisherProvider } from "../static-publisher/StaticPublisherProvider.js";

export function App() {
  return <ThemeProvider><StaticPublisherProvider><RouterProvider router={router} /></StaticPublisherProvider></ThemeProvider>;
}
