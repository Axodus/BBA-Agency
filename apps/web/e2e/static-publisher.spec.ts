import { expect, test } from "@playwright/test";

test("canonical BBA app route exposes governed Mission lineage", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Trabalho de IA sob governança humana" })).toBeVisible();
  await page.getByRole("link", { name: /Abrir Mission Workspace/u }).click();
  await expect(page.getByRole("heading", { name: "Clareza institucional para o próximo ciclo" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Cadeia institucional" })).toBeVisible();
  await expect(page.getByText("Mission").first()).toBeVisible();
  await expect(page.getByText("Institutional Asset").first()).toBeVisible();
  await expect(page.getByText("Channel Variant").first()).toBeVisible();
  await expect(page.getByText("Distribution Package").first()).toBeVisible();
});

test("Steward decision is local and never triggers external publication", async ({ page }) => {
  await page.goto("/missions/msn-024");
  await page.getByRole("button", { name: "Revisar decisão" }).click();
  await expect(page.getByRole("dialog", { name: "Confirmar decisão de governança" })).toContainText("Nenhuma Channel Variant será publicada");
  await page.getByRole("button", { name: "Registrar decisão" }).click();
  await expect(page.getByText("Decisão registrada localmente")).toBeVisible();
  await expect(page.getByText("Nenhuma publicação externa foi iniciada.")).toBeVisible();
});

test("controlled local Publisher routes remain reachable within the canonical shell", async ({ page }) => {
  await page.goto("/projects/demo-final-review/review");
  await expect(page.getByRole("heading", { name: "Neurons protocol launch" })).toBeVisible();
  await page.goto("/deliveries");
  await expect(page.getByRole("heading", { name: "Deliveries" })).toBeVisible();
  await expect(page.getByText("No external publication was performed.")).toBeVisible();
});
