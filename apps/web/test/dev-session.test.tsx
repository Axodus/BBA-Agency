import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";
import { DevSessionSetup } from "../src/runtime/DevSessionSetup.js";

describe("DevSessionSetup", () => {
  test("requires complete configuration and emits an ephemeral snapshot", () => {
    const configure = vi.fn(); render(<DevSessionSetup initialBaseUrl="https://api.example.test" onConfigure={configure} />);
    fireEvent.change(screen.getByLabelText("Bearer token"), { target: { value: "token" } });
    fireEvent.change(screen.getByLabelText("Tenant"), { target: { value: "tenant_test" } });
    fireEvent.change(screen.getByLabelText("Subject"), { target: { value: "steward" } });
    fireEvent.change(screen.getByLabelText("Actor reference"), { target: { value: "person:steward" } });
    fireEvent.click(screen.getByRole("button", { name: "Iniciar sessão local" }));
    expect(configure).toHaveBeenCalledWith({ baseUrl: "https://api.example.test", accessToken: "token", tenantId: "tenant_test", subject: "steward", actorReference: "person:steward" });
    expect(localStorage.getItem("accessToken")).toBeNull(); expect(sessionStorage.length).toBe(0);
  });
});
