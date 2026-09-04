import { expect, test } from "@playwright/test";

test("app shell exposes keyboard-accessible navigation and primary actions", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("main")).toBeVisible();
  const missionWorkspace = page.getByRole("link", { name: /Abrir Mission Workspace/u });
  await missionWorkspace.focus();
  await expect(missionWorkspace).toBeFocused();

  const width = page.viewportSize()?.width ?? 0;
  if (width < 700) {
    const menu = page.getByRole("button", { name: "Abrir navegação" });
    await menu.focus();
    await expect(menu).toBeFocused();
  } else {
    const overview = page.getByRole("link", { name: "Visão geral", exact: true });
    const missions = page.getByRole("link", { name: "Missões", exact: true });
    await overview.focus();
    await expect(overview).toBeFocused();
    await page.keyboard.press("Tab");
    await expect(missions).toBeFocused();
  }
});

test("settings fields and governance tabs are reachable by keyboard", async ({ page }) => {
  await page.goto("/settings");
  await expect(page.locator("main")).toBeVisible();
  const interfaceTab = page.getByRole("tab", { name: "Interface" });
  const density = page.getByLabel("Densidade");
  await interfaceTab.focus();
  await expect(interfaceTab).toBeFocused();
  await density.focus();
  await expect(density).toBeFocused();
});
