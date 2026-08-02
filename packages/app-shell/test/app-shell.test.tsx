import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { ThemeProvider } from "@bba/ui";
import { describe, expect, test } from "vitest";
import { BbaAppShell } from "../src/index.js";

describe("BbaAppShell", () => {
  test("renders configuration failures separately from an authenticated shell", () => {
    render(<ThemeProvider><MemoryRouter><BbaAppShell runtime={{ status: "CONFIGURATION_MISSING", message: "Token and tenant are required" }} /></MemoryRouter></ThemeProvider>);
    expect(screen.getByText("Configuration missing")).toBeTruthy();
  });

  test("renders navigation, tenant and session summaries", () => {
    render(<ThemeProvider><MemoryRouter initialEntries={["/"]}><Routes><Route element={<BbaAppShell runtime={{ status: "READY", tenantId: "tenant_alpha", session: { subject: "steward", actorReference: "person:steward" } }} />}><Route index element={<h1>Como podemos ajudar?</h1>} /></Route></Routes></MemoryRouter></ThemeProvider>);
    expect(screen.getByRole("link", { name: "Projects" })).toBeTruthy();
    expect(screen.getByText("tenant_alpha")).toBeTruthy();
    expect(screen.getByText("person:steward")).toBeTruthy();
  });
});
