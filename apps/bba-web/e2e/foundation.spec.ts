import { expect, test } from "@playwright/test";

async function configure(page: import("@playwright/test").Page) {
  await page.getByLabel("API base URL").fill("https://api.example.test");
  await page.getByLabel("Bearer token").fill("token-e2e");
  await page.getByLabel("Tenant").fill("tenant_e2e");
  await page.getByLabel("Subject").fill("steward-e2e");
  await page.getByLabel("Actor reference").fill("person:steward-e2e");
  await page.getByRole("button", { name: "Iniciar sessão local" }).click();
}

test("direct Mission deep link uses the SDK and public projection", async ({ page }) => {
  let tenantHeader: string | null = null; let correlationHeader: string | null = null;
  await page.route("https://api.example.test/api/v1/missions/mission_e2e", async (route) => { tenantHeader = route.request().headers()["x-tenant-id"] ?? null; correlationHeader = route.request().headers()["x-correlation-id"] ?? null; await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ data: { aggregateType: "Mission", id: "mission_e2e", tenantId: "tenant_e2e", version: 3, status: "ACTIVE", data: {} }, meta: { requestId: "request-e2e", correlationId: "correlation-e2e" } }) }); });
  await page.goto("/missions/mission_e2e"); await configure(page);
  await expect(page.getByRole("heading", { name: "mission_e2e" })).toBeVisible(); await expect(page.getByText("ACTIVE")).toBeVisible();
  expect(tenantHeader).toBe("tenant_e2e"); expect(correlationHeader).toBeTruthy();
});

test("shell supports keyboard navigation and reactive theme preference", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name === "mobile", "Desktop shell behavior");
  await page.goto("/"); await configure(page); await expect(page.getByRole("heading", { name: "AI executes. Humans govern." })).toBeVisible();
  await page.keyboard.press("Tab"); await expect(page.getByText("Pular para o conteúdo principal")).toBeFocused();
  await page.getByLabel("Tema").selectOption("dark"); await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
});

test("mobile navigation is modal and restores focus", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "mobile", "Mobile shell behavior");
  await page.goto("/"); await configure(page); const trigger = page.getByRole("button", { name: "Menu" }); await trigger.click();
  await expect(page.getByRole("dialog")).toBeVisible(); await page.keyboard.press("Escape"); await expect(trigger).toBeFocused();
});
