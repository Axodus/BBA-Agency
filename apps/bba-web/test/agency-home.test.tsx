import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { AgencyHomePage } from "../src/features/publisher/AgencyHomePage.js";

describe("Agency service home", () => {
  it("leads with customer services and the Editorial Package outcome", () => {
    render(<MemoryRouter><AgencyHomePage /></MemoryRouter>);
    expect(screen.getByRole("heading", { name: "Como podemos ajudar?" })).toBeTruthy();
    expect(screen.getByText("Planejar publicações")).toBeTruthy();
    expect(screen.getByText(/Pacote Editorial, não uma coleção de prompts/u)).toBeTruthy();
    expect(screen.queryByRole("heading", { name: "Mission" })).toBeNull();
  });
});
