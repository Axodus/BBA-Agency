import { expect, test, type Page } from "@playwright/test";
import path from "node:path";

const evidenceRoot = path.resolve(process.cwd(), "../../.rag/evidence/SPRINT-IMP-017");
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
  await page.screenshot({ animations: "disabled", fullPage: true, path: path.join(evidenceRoot, directory, `${viewport}-${surface}.png`) });
}

async function reachWizardConfirmation(page: Page) {
  await page.goto("/services/publisher/new");
  await page.getByLabel("Project title").fill("Visual convergence evidence");
  await page.getByLabel("What needs to be communicated").fill("BBA Agency visual convergence");
  await page.getByLabel("Communication objective").fill("Demonstrate an aligned Agency experience");
  await page.getByLabel("Expected outcome").fill("A reviewed Editorial Package");
  await page.locator('[data-action="continue"]').click();
  await page.getByLabel("Audience").fill("Institutional teams");
  await page.getByLabel("Central message").fill("AI executes and people govern important decisions");
  await page.getByLabel("Tone").fill("Precise and accountable");
  await page.locator('[data-action="continue"]').click();
  await page.getByLabel("Text materials").fill("Deterministic evidence source");
  await page.locator('[data-action="continue"]').click();
  await page.getByLabel("Required facts").fill("No external publication was performed");
  await page.getByLabel("Required terms").fill("Human Governance");
  for (let step = 0; step < 3; step += 1) await page.locator('[data-action="continue"]').click();
  await expect(page.getByRole("heading", { name: "You will receive" })).toBeVisible();
}

for (const viewport of viewports) {
  test(`captures converged Agency surfaces at ${viewport.name}`, async ({ page }) => {
    test.setTimeout(120_000);
    await page.setViewportSize({ width: viewport.width, height: viewport.height });

    const routes = [
      ["home", "/"],
      ["services", "/services"],
      ["publisher", "/services/publisher"],
      ["projects", "/projects"],
      ["editorial-core", "/projects/demo-core-review/context?scenario=awaiting-core-approval"],
      ["strategy", "/projects/demo-final-review/strategy?scenario=awaiting-package-approval"],
      ["content", "/projects/demo-final-review/content?scenario=awaiting-package-approval"],
      ["review", "/projects/demo-final-review/review?scenario=awaiting-package-approval"],
      ["delivery", "/projects/demo-delivery/delivery?scenario=ready-for-delivery"],
      ["ai-settings", "/settings/ai?scenario=configured"],
      ["failure", "/projects/demo-failure/content?scenario=recoverable-failure"],
    ] as const;

    for (const [surface, route] of routes) {
      await page.goto(route);
      await expect(page.locator("main")).toBeVisible();
      await capture(page, viewport.directory, viewport.name, surface);
    }

    await reachWizardConfirmation(page);
    await capture(page, viewport.directory, viewport.name, "wizard-confirmation");

    await page.goto("/projects/demo-final-review/content?scenario=awaiting-package-approval");
    await page.locator('[data-action="compare-versions"]').click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await capture(page, viewport.directory, viewport.name, "version-comparison");
  });
}
