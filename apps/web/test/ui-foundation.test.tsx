import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { FoundationOverview, SettingsPage, SurfaceTemplate, UiKitPage, surfaces } from "../src/design-system/foundation/FoundationPages.js";
import { MissionWorkspace } from "../src/design-system/foundation/MissionWorkspace.js";

describe("BBA App UI Foundation", () => {
  it("makes the canonical lineage and publication boundary explicit", () => {
    render(<MemoryRouter><MissionWorkspace /></MemoryRouter>);
    expect(screen.getByRole("heading", { name: "Institutional lineage" })).toBeTruthy();
    expect(screen.getAllByText("Mission").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Institutional Asset").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Channel Variant").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Distribution Package").length).toBeGreaterThan(0);
    expect(screen.getByText("Distribution is not publication")).toBeTruthy();
  });

  it("records a controlled local Steward decision", async () => {
    const user = userEvent.setup();
    render(<MemoryRouter><MissionWorkspace /></MemoryRouter>);
    await user.click(screen.getByRole("button", { name: "Review decision" }));
    expect(screen.getByRole("dialog", { name: "Confirm governance decision" })).toBeTruthy();
    await user.click(screen.getByRole("button", { name: "Record decision" }));
    expect(screen.getByText("Decision recorded locally")).toBeTruthy();
    expect(screen.getByText(/No external publication was initiated/)).toBeTruthy();
  });

  it("keeps the overview and UI kit independent from backend data", () => {
    const { unmount } = render(<MemoryRouter><FoundationOverview /></MemoryRouter>);
    expect(screen.getByText("Controlled local data")).toBeTruthy();
    unmount();
    render(<MemoryRouter><UiKitPage /></MemoryRouter>);
    expect(screen.getByRole("heading", { name: "BBA UI Kit" })).toBeTruthy();
    expect(screen.getByText("Visible failure")).toBeTruthy();
  });

  it("keeps controlled records, empty states, loading and failures visible on each core surface", () => {
    render(<MemoryRouter><SurfaceTemplate surface={surfaces.packages} /></MemoryRouter>);
    expect(screen.getByText("DP — LinkedIn Brief Set 2026")).toBeTruthy();
    expect(screen.getByText("Preparation does not constitute external publication.")).toBeTruthy();
    expect(screen.getByText("No Distribution Package created")).toBeTruthy();
    expect(screen.getByText("Unable to load")).toBeTruthy();
    expect(screen.getByText("A Human Governance decision is required.")).toBeTruthy();
  });

  it("switches between settings sections with accessible tabs", async () => {
    const user = userEvent.setup();
    render(<MemoryRouter><SettingsPage /></MemoryRouter>);
    await user.click(screen.getByRole("tab", { name: "Governance" }));
    expect(screen.getByText("Rules are display-only in this reference and cannot be changed through this interface.")).toBeTruthy();
  });
});
