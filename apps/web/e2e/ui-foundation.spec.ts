import { expect, test } from "@playwright/test";

test("Mission Workspace preserves lineage and governed decision flow", async ({ page }) => {
  await page.goto("/foundation/missions/msn-024");
  await expect(page.getByRole("heading", { name: "Clareza institucional para o próximo ciclo" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Cadeia institucional" })).toBeVisible();
  await expect(page.getByText("Distribuição não é publicação")).toBeVisible();

  const viewportWidth = await page.evaluate(() => window.innerWidth);
  const documentWidth = await page.evaluate(() => document.documentElement.scrollWidth);
  expect(documentWidth).toBeLessThanOrEqual(viewportWidth);

  await page.getByRole("button", { name: "Revisar decisão" }).click();
  await expect(page.getByRole("dialog", { name: "Confirmar decisão de governança" })).toBeVisible();
  await page.getByRole("button", { name: "Registrar decisão" }).click();
  await expect(page.getByText("Decisão registrada localmente")).toBeVisible();
});

test("settings tabs and mobile navigation remain operable", async ({ page }) => {
  await page.goto("/foundation/settings");
  await page.getByRole("tab", { name: "Governança" }).click();
  await expect(page.getByText("As regras são somente exibidas nesta sprint e não podem ser alteradas.")).toBeVisible();

  const viewportWidth = page.viewportSize()?.width ?? 0;
  if (viewportWidth < 832) {
    await page.getByRole("button", { name: "Abrir navegação" }).click();
    const navigation = page.getByRole("dialog", { name: "Navegação" });
    await expect(navigation).toBeVisible();
    await navigation.getByRole("link", { name: "UI Kit" }).click();
  } else {
    await page.getByRole("link", { name: "UI Kit" }).click();
  }
  await expect(page.getByRole("heading", { name: "UI Kit BBA" })).toBeVisible();
});
