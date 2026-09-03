import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { FoundationOverview, SettingsPage, UiKitPage } from "../src/design-system/foundation/FoundationPages.js";
import { MissionWorkspace } from "../src/design-system/foundation/MissionWorkspace.js";

describe("BBA App UI Foundation", () => {
  it("makes the canonical lineage and publication boundary explicit", () => {
    render(<MemoryRouter><MissionWorkspace /></MemoryRouter>);
    expect(screen.getByRole("heading", { name: "Cadeia institucional" })).toBeTruthy();
    expect(screen.getAllByText("Mission").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Institutional Asset").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Channel Variant").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Distribution Package").length).toBeGreaterThan(0);
    expect(screen.getByText("Distribuição não é publicação")).toBeTruthy();
  });

  it("records a controlled local Steward decision", async () => {
    const user = userEvent.setup();
    render(<MemoryRouter><MissionWorkspace /></MemoryRouter>);
    await user.click(screen.getByRole("button", { name: "Revisar decisão" }));
    expect(screen.getByRole("dialog", { name: "Confirmar decisão de governança" })).toBeTruthy();
    await user.click(screen.getByRole("button", { name: "Registrar decisão" }));
    expect(screen.getByText("Decisão registrada localmente")).toBeTruthy();
    expect(screen.getByText(/Nenhuma publicação externa foi iniciada/)).toBeTruthy();
  });

  it("keeps the overview and UI kit independent from backend data", () => {
    const { unmount } = render(<MemoryRouter><FoundationOverview /></MemoryRouter>);
    expect(screen.getByText("Dados locais controlados")).toBeTruthy();
    unmount();
    render(<MemoryRouter><UiKitPage /></MemoryRouter>);
    expect(screen.getByRole("heading", { name: "UI Kit BBA" })).toBeTruthy();
    expect(screen.getByText("Falha visível")).toBeTruthy();
  });

  it("switches between settings sections with accessible tabs", async () => {
    const user = userEvent.setup();
    render(<MemoryRouter><SettingsPage /></MemoryRouter>);
    await user.click(screen.getByRole("tab", { name: "Governança" }));
    expect(screen.getByText("As regras são somente exibidas nesta sprint e não podem ser alteradas.")).toBeTruthy();
  });
});
