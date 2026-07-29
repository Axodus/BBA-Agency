import { act, renderHook } from "@testing-library/react";
import type { ReactNode } from "react";
import { describe, expect, test } from "vitest";
import { ThemeProvider, useTheme } from "../src/index.js";

describe("ThemeProvider", () => {
  test("persists a non-sensitive preference and applies data-theme", () => {
    const wrapper = ({ children }: { readonly children: ReactNode }) => <ThemeProvider>{children}</ThemeProvider>;
    const { result } = renderHook(useTheme, { wrapper });
    act(() => result.current.setPreference("dark"));
    expect(document.documentElement.dataset.theme).toBe("dark");
    expect(localStorage.getItem("bba.theme")).toBe("dark");
  });
});
