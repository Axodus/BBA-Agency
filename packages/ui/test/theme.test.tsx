import { act, render, renderHook } from "@testing-library/react";
import type { ReactNode } from "react";
import { describe, expect, test } from "vitest";
import { Lineage, ThemeProvider, useTheme } from "../src/index.js";

describe("ThemeProvider", () => {
  test("persists a non-sensitive preference and applies data-theme", () => {
    const wrapper = ({ children }: { readonly children: ReactNode }) => <ThemeProvider>{children}</ThemeProvider>;
    const { result } = renderHook(useTheme, { wrapper });
    act(() => result.current.setPreference("dark"));
    expect(document.documentElement.dataset.theme).toBe("dark");
    expect(localStorage.getItem("bba.theme")).toBe("dark");
  });

  test("keeps a locked lineage stage readable without color", () => {
    const { getByText } = render(<Lineage title="Canonical lineage" items={[{ type: "Mission", id: "mission-1", label: "Mission", state: "approved", stateLabel: "Approved" }, { type: "Channel Variant", id: "variant-1", label: "Variant", state: "neutral", stateLabel: "Locked", locked: true }]} />);
    expect(getByText("Upstream decision pending")).toBeTruthy();
  });
});
