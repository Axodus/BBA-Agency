import { render, renderHook } from "@testing-library/react";
import type { ReactNode } from "react";
import { describe, expect, test } from "vitest";
import { Lineage, ThemeProvider, useTheme } from "../src/index.js";

describe("ThemeProvider", () => {
  test("clears legacy theme preferences and applies the canonical light theme", () => {
    localStorage.setItem("bba.theme", "dark");
    const wrapper = ({ children }: { readonly children: ReactNode }) => <ThemeProvider>{children}</ThemeProvider>;
    const { result } = renderHook(useTheme, { wrapper });
    expect(result.current.preference).toBe("light");
    expect(result.current.resolvedTheme).toBe("light");
    expect(document.documentElement.dataset.theme).toBe("light");
    expect(document.documentElement.style.colorScheme).toBe("light");
    expect(localStorage.getItem("bba.theme")).toBeNull();
  });

  test("keeps a locked lineage stage readable without color", () => {
    const { getByText } = render(<Lineage title="Canonical lineage" items={[{ type: "Mission", id: "mission-1", label: "Mission", state: "approved", stateLabel: "Approved" }, { type: "Channel Variant", id: "variant-1", label: "Variant", state: "neutral", stateLabel: "Locked", locked: true }]} />);
    expect(getByText("Upstream decision pending")).toBeTruthy();
  });
});
