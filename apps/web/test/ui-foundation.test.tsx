import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import { AccountPage, FoundationOverview, SettingsPage, SurfaceTemplate, UiKitPage, surfaces } from "../src/design-system/foundation/FoundationPages.js";
import { MissionWorkspace } from "../src/design-system/foundation/MissionWorkspace.js";

describe("BBA App UI Foundation", () => {
  it("makes the canonical lineage and publication boundary explicit", () => {
    render(<MemoryRouter><MissionWorkspace /></MemoryRouter>);
    expect(screen.getByRole("heading", { name: "Institutional lineage" })).toBeTruthy();
    expect(screen.getAllByText("Mission").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Institutional Asset").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Channel Variant").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Distribution Package").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Blocked").length).toBeGreaterThan(0);
    expect(screen.getByText("Distribution is not publication")).toBeTruthy();
  });

  it("records a controlled local Steward decision", async () => {
    const user = userEvent.setup();
    render(<MemoryRouter><MissionWorkspace /></MemoryRouter>);
    await user.click(screen.getByRole("button", { name: "Review decision" }));
    expect(screen.getByRole("dialog", { name: "Confirm governance decision" })).toBeTruthy();
    await user.click(screen.getByRole("button", { name: "Record decision" }));
    expect(screen.getByText("Decision recorded locally")).toBeTruthy();
    expect(screen.getByText(/The Audit Record was updated/)).toBeTruthy();
    expect(screen.getAllByText("Approved").length).toBeGreaterThan(1);
    expect(screen.getByText(/No external publication was initiated/)).toBeTruthy();
  });

  it("restores the local decision and Audit Record within the browser session", async () => {
    const user = userEvent.setup();
    const rendered = render(<MemoryRouter><MissionWorkspace /></MemoryRouter>);
    await user.click(screen.getByRole("radio", { name: "Request changes" }));
    await user.click(screen.getByRole("button", { name: "Review decision" }));
    await user.click(screen.getByRole("button", { name: "Record decision" }));
    rendered.unmount();
    render(<MemoryRouter><MissionWorkspace /></MemoryRouter>);
    expect(screen.getAllByText("Changes requested").length).toBeGreaterThan(0);
    expect(screen.getAllByRole("button", { name: "Decision recorded" })[0]!.hasAttribute("disabled")).toBe(true);
    expect(screen.getByText(/Request changes\. The content preserves institutional direction/)).toBeTruthy();
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

  it("keeps unavailable preference persistence explicit", () => {
    const { unmount } = render(<MemoryRouter><AccountPage /></MemoryRouter>);
    expect(screen.getByRole("button", { name: "Save preferences" }).hasAttribute("disabled")).toBe(true);
    expect(screen.getByText("Profile is read-only. Saving preferences is unavailable.")).toBeTruthy();
    unmount();
    render(<MemoryRouter><SettingsPage /></MemoryRouter>);
    expect(screen.getByRole("button", { name: "Save settings" }).hasAttribute("disabled")).toBe(true);
    expect(screen.getByText(/Settings are read-only/)).toBeTruthy();
  });

  it("supports arrow-key navigation between settings tabs", async () => {
    const user = userEvent.setup();
    render(<MemoryRouter><SettingsPage /></MemoryRouter>);
    screen.getByRole("tab", { name: "Interface" }).focus();
    await user.keyboard("{ArrowRight}");
    expect(screen.getByRole("tab", { name: "Governance" }).getAttribute("aria-selected")).toBe("true");
    expect(screen.getByText("Rules are display-only in this reference and cannot be changed through this interface.")).toBeTruthy();
  });
  it("preserves a corrupt audit value and blocks recording", () => {
    sessionStorage.setItem("bba.foundation.mission.msn-024.decision", "invalid-json");
    render(<MemoryRouter><MissionWorkspace /></MemoryRouter>);
    expect(screen.getByText("Decision recording blocked")).toBeTruthy();
    expect(screen.getByRole("button", { name: "Review decision" }).hasAttribute("disabled")).toBe(true);
    expect(sessionStorage.getItem("bba.foundation.mission.msn-024.decision")).toBe("invalid-json");
  });

  it("does not report a decision when storage fails and retains the note for retry", async () => {
    const user = userEvent.setup();
    render(<MemoryRouter><MissionWorkspace /></MemoryRouter>);
    await user.clear(screen.getByRole("textbox", { name: "Governance note" }));
    await user.type(screen.getByRole("textbox", { name: "Governance note" }), "Keep the institutional evidence.");
    await user.click(screen.getByRole("button", { name: "Review decision" }));
    const write = vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => { throw new Error("Quota exceeded"); });
    try {
      await user.click(screen.getByRole("button", { name: "Record decision" }));
      expect(screen.queryByText("Decision recorded locally")).toBeNull();
      expect(screen.getByText("Decision recording blocked")).toBeTruthy();
      expect((screen.getByRole("textbox", { name: "Governance note" }) as HTMLTextAreaElement).value).toBe("Keep the institutional evidence.");
    } finally { write.mockRestore(); }
    await user.click(screen.getByRole("button", { name: "Retry local storage" }));
    await user.click(screen.getByRole("button", { name: "Review decision" }));
    await user.click(screen.getByRole("button", { name: "Record decision" }));
    expect(screen.getByText("Decision recorded locally")).toBeTruthy();
    expect(screen.getByText(/Approve Institutional Asset\. Keep the institutional evidence/)).toBeTruthy();
  });

});
