import { expect, test } from "@playwright/test";

test("Mission Workspace preserves lineage and governed decision flow", async ({ page }) => {
  await page.goto("/missions/msn-024");
  await expect(page.getByRole("heading", { name: "Institutional clarity for the next cycle" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Institutional lineage" })).toBeVisible();
  await expect(page.getByText("Distribution is not publication")).toBeVisible();

  const viewportWidth = await page.evaluate(() => window.innerWidth);
  const documentWidth = await page.evaluate(() => document.documentElement.scrollWidth);
  expect(documentWidth).toBeLessThanOrEqual(viewportWidth);

  await page.getByRole("button", { name: "Review decision" }).click();
  await expect(page.getByRole("dialog", { name: "Confirm governance decision" })).toBeVisible();
  await page.getByRole("button", { name: "Record decision" }).click();
  await expect(page.getByText("Decision recorded locally")).toBeVisible();
  await page.goto("/");
  await page.goto("/missions");
  await expect(page.getByRole("button", { name: "Decision recorded" }).first()).toBeDisabled();
});

test("settings tabs and mobile navigation remain operable", async ({ page }) => {
  await page.goto("/settings");
  await page.getByRole("tab", { name: "Governance" }).click();
  await expect(page.getByText("Rules are display-only in this reference and cannot be changed through this interface.")).toBeVisible();

  const viewportWidth = page.viewportSize()?.width ?? 0;
  if (viewportWidth < 832) {
    await page.getByRole("button", { name: "Open navigation" }).click();
    const navigation = page.getByRole("dialog", { name: "Navigation" });
    await expect(navigation).toBeVisible();
    await navigation.getByRole("link", { name: "UI Kit" }).click();
  } else {
    await page.getByRole("link", { name: "UI Kit" }).click();
  }
  await expect(page.getByRole("heading", { name: "BBA UI Kit" })).toBeVisible();
});
