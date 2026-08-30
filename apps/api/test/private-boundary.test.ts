import { describe, expect, it } from "vitest";
import { assertPrivatePreview, isAllowedOrigin } from "../src/runtime.js";

describe("private API boundary", () => {
  it("blocks startup until private preview is explicitly enabled", () => {
    expect(() => assertPrivatePreview(undefined)).toThrow("API_PUBLIC_ACTIVATION_BLOCKED");
    expect(() => assertPrivatePreview("false")).toThrow("API_PUBLIC_ACTIVATION_BLOCKED");
    expect(() => assertPrivatePreview("true")).not.toThrow();
  });

  it("allows only configured browser origins", () => {
    expect(isAllowedOrigin("https://dev.bba.country", ["https://dev.bba.country"])).toBe(true);
    expect(isAllowedOrigin("https://unknown.example", ["https://dev.bba.country"])).toBe(false);
  });
});
