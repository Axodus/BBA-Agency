import { describe, expect, it } from "vitest";
import { assertPrivatePreview, loadApiEnvironment } from "../src/configuration.js";
import { isAllowedOrigin } from "../src/runtime.js";

const completeEnvironment = {
  BBA_API_PRIVATE_PREVIEW: "true",
  MONGODB_URI: "mongodb://127.0.0.1:27017/bba-agency?replicaSet=rs0",
  BBA_API_DEV_ACCESS_TOKEN: "local-token",
  BBA_API_TENANT_ID: "tenant-local",
  BBA_API_SUBJECT: "steward-local",
  BBA_API_ACTOR_REFERENCE: "person:steward-local",
  BBA_API_ALLOWED_ORIGINS: "http://localhost:5173"
};

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

  it("identifies each missing required environment variable", () => {
    for (const name of ["MONGODB_URI", "BBA_API_DEV_ACCESS_TOKEN", "BBA_API_TENANT_ID", "BBA_API_SUBJECT", "BBA_API_ACTOR_REFERENCE", "BBA_API_ALLOWED_ORIGINS"] as const) {
      const environment = { ...completeEnvironment };
      delete environment[name];
      expect(() => loadApiEnvironment(environment)).toThrow(`API_CONFIGURATION_MISSING:${name}`);
    }
  });

  it("rejects an invalid port before starting the server", () => {
    expect(() => loadApiEnvironment({ ...completeEnvironment, PORT: "invalid" })).toThrow("API_CONFIGURATION_INVALID:PORT");
  });
});
