import { expect, test } from "@playwright/test";

test("home exposes keyboard-accessible primary actions", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("main")).toBeVisible();
  const startProject = page.getByRole("link", { name: "Start a Project →" });
  await startProject.focus();
  await expect(startProject).toBeFocused();

  const width = page.viewportSize()?.width ?? 0;
  if (width < 700) {
    const menu = page.getByRole("button", { name: "Menu" });
    await menu.focus();
    await expect(menu).toBeFocused();
  } else {
    const services = page.getByRole("link", { name: "Services", exact: true });
    const projects = page.getByRole("link", { name: "Projects", exact: true });
    await services.focus();
    await expect(services).toBeFocused();
    await page.keyboard.press("Tab");
    await expect(projects).toBeFocused();
  }
});

test("wizard fields and continuation controls are reachable by keyboard", async ({ page }) => {
  await page.goto("/services/publisher/new");
  await expect(page.locator("main")).toBeVisible();
  const projectTitle = page.getByLabel("Project title");
  const communicationNeed = page.getByLabel("What needs to be communicated");
  const continueButton = page.getByRole("button", { name: /^Continue/u });
  await projectTitle.focus();
  await expect(projectTitle).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(communicationNeed).toBeFocused();
  await continueButton.focus();
  await expect(continueButton).toBeFocused();
});
