import { expect, test } from "@playwright/test";

test("app shell exposes keyboard-accessible navigation and primary actions", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("main")).toBeVisible();
  const missionWorkspace = page.getByRole("link", { name: /Open Mission Workspace/u });
  await missionWorkspace.focus();
  await expect(missionWorkspace).toBeFocused();

  const width = page.viewportSize()?.width ?? 0;
  if (width < 700) {
    const menu = page.getByRole("button", { name: "Open navigation" });
    await menu.focus();
    await expect(menu).toBeFocused();
  } else {
    const overview = page.getByRole("link", { name: "Overview", exact: true });
    const missions = page.getByRole("link", { name: "Missions", exact: true });
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
  const density = page.getByLabel("Density");
  await interfaceTab.focus();
  await expect(interfaceTab).toBeFocused();
  await page.keyboard.press("ArrowRight");
  await expect(page.getByRole("tab", { name: "Governance" })).toBeFocused();
  await page.keyboard.press("Home");
  await expect(interfaceTab).toBeFocused();
  await density.focus();
  await expect(density).toBeFocused();
});

test("governance dialog traps focus and returns it to its trigger", async ({ page }) => {
  await page.goto("/missions/msn-024");
  const trigger = page.getByRole("button", { name: "Review decision" });
  await trigger.click();
  const dialog = page.getByRole("dialog", { name: "Confirm governance decision" });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole("button", { name: "Close modal" })).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(trigger).toBeFocused();
});


test("semantic labels retain readable contrast on all shared surfaces", async ({ page }) => {
  await page.goto("/ui-kit");
  const ratios = await page.evaluate(() => {
    const root = getComputedStyle(document.documentElement);
    const rgb = (color: string) => {
      const element = document.createElement("span");
      element.style.color = color;
      document.body.append(element);
      const value = getComputedStyle(element).color.match(/[\d.]+/g)!.slice(0, 3).map(Number);
      element.remove();
      return value;
    };
    const luminance = (values: number[]) => values.map((v) => v / 255).map((v) => v <= .04045 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4).reduce((sum, v, i) => sum + v * [0.2126, 0.7152, 0.0722][i]!, 0);
    const backgrounds = ["--bba-bg", "--bba-surface", "--bba-surface-raised"].map((token) => luminance(rgb(root.getPropertyValue(token))));
    return [...document.querySelectorAll<HTMLElement>(".bba-status")].map((badge) => {
      const foreground = luminance(rgb(getComputedStyle(badge).color));
      return { label: badge.textContent, minimum: Math.min(...backgrounds.map((background) => (Math.max(background, foreground) + .05) / (Math.min(background, foreground) + .05))) };
    });
  });
  expect(ratios.length).toBeGreaterThanOrEqual(8);
  for (const ratio of ratios) expect(ratio.minimum, `${ratio.label} contrast`).toBeGreaterThanOrEqual(4.5);
});

test("unknown Mission and local storage failure retain the shell", async ({ page }) => {
  await page.goto("/missions/unknown");
  await expect(page.getByRole("heading", { name: "Mission not found" })).toBeVisible();
  await page.evaluate(() => sessionStorage.setItem("bba.foundation.mission.msn-024.decision", "corrupt"));
  await page.goto("/missions/msn-024");
  await expect(page.getByRole("alert")).toContainText("could not be loaded");
  await expect(page.getByRole("button", { name: "Review decision" })).toBeDisabled();
});
