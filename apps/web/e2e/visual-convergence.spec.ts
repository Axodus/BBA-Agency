import { expect, test, type Page } from "@playwright/test";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const evidenceRoot = path.resolve(process.cwd(), "../../.rag/evidence/BBA-APP-UI-FOUNDATION/latest");
const viewports = [
  { name: "desktop-1440x900", width: 1440, height: 900, directory: "desktop" },
  { name: "laptop-1280x800", width: 1280, height: 800, directory: "desktop" },
  { name: "tablet-768x1024", width: 768, height: 1024, directory: "mobile" },
  { name: "mobile-390x844", width: 390, height: 844, directory: "mobile" },
] as const;

async function stabilize(page: Page) {
  await page.addStyleTag({ content: "*,*::before,*::after{animation:none!important;transition:none!important;caret-color:transparent!important}" });
  await page.evaluate(() => document.fonts.ready);
}

async function capture(page: Page, directory: string, viewport: string, surface: string) {
  await stabilize(page);
  const overflow = await page.evaluate(() => ({
    viewport: window.innerWidth,
    document: document.documentElement.scrollWidth,
    elements: [...document.querySelectorAll("body *")].map((element) => {
      const bounds = element.getBoundingClientRect();
      return { selector: `${element.tagName.toLowerCase()}.${[...element.classList].join(".")}`, left: Math.round(bounds.left), right: Math.round(bounds.right), width: Math.round(bounds.width) };
    }).filter((element) => element.left < 0 || element.right > window.innerWidth + 1).slice(0, 8),
  }));
  expect(overflow.document, `${surface} must not overflow horizontally at ${viewport}; offenders: ${JSON.stringify(overflow.elements)}`).toBeLessThanOrEqual(overflow.viewport);
  const output = path.join(evidenceRoot, directory, `${viewport}-${surface}.png`);
  await mkdir(path.dirname(output), { recursive: true });
  await page.screenshot({ animations: "disabled", fullPage: true, path: output });
}

for (const viewport of viewports) {
  test(`captures converged Agency surfaces at ${viewport.name}`, async ({ page }) => {
    test.setTimeout(120_000);
    await page.setViewportSize({ width: viewport.width, height: viewport.height });

    const routes = [
      ["overview", "/"],
      ["mission-workspace", "/missions/msn-024"],
      ["institutional-assets", "/institutional-assets"],
      ["distribution-packages", "/distribution-packages"],
      ["governance", "/governance"],
      ["institution", "/institution"],
      ["account", "/account"],
      ["settings", "/settings"],
      ["ui-kit", "/ui-kit"],
    ] as const;

    for (const [surface, route] of routes) {
      await page.goto(route);
      await expect(page.locator("main")).toBeVisible();
      await capture(page, viewport.directory, viewport.name, surface);
    }

    await page.goto("/missions/msn-024");
    await page.getByRole("button", { name: "Revisar decisão" }).click();
    await expect(page.getByRole("dialog", { name: "Confirmar decisão de governança" })).toBeVisible();
    await capture(page, viewport.directory, viewport.name, "governance-dialog");
  });
}
