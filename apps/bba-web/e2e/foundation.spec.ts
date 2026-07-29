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

test("creates a Mission through the structured product form", async ({ page }) => {
  let idempotencyKey: string | undefined; let payload: unknown;
  await page.route("https://api.example.test/api/v1/missions", async (route) => { idempotencyKey = route.request().headers()["idempotency-key"]; payload = route.request().postDataJSON(); await route.fulfill({ status: 201, contentType: "application/json", body: JSON.stringify({ data: { transactionId: "transaction-e2e", resourceReferences: [{ resourceType: "Mission", resourceId: "mission_created" }] }, meta: { requestId: "request-create", correlationId: "correlation-create" } }) }); });
  await page.goto("/missions/new"); await configure(page);
  await page.getByLabel("Mission ID").fill("mission_created"); await page.getByLabel("Title").fill("Institutional Mission"); await page.getByLabel("Summary").fill("Summary"); await page.getByLabel("Description").fill("Description"); await page.getByLabel("Purpose").fill("Purpose"); await page.getByLabel("Objective").fill("Objective"); await page.getByLabel("Steward reference").fill("person:steward"); await page.getByLabel("Context").fill("Context"); await page.getByLabel("Expected outcome").fill("Outcome"); await page.getByLabel("Operational reason").fill("Create governed Mission");
  await page.getByText("Evidence and Lineage").click(); await page.getByLabel("Evidence 1 ID").fill("evidence_1"); await page.getByLabel("Evidence 1 source").fill("source"); await page.getByLabel("Evidence 1 type").fill("record"); await page.getByLabel("Lineage 1 source").fill("source_1"); await page.getByLabel("Lineage 1 target").fill("mission_created"); await page.getByLabel("Lineage 1 relationship").fill("supports"); await page.getByRole("button", { name: "Criar Mission" }).click();
  await expect(page.getByText("transaction-e2e")).toBeVisible(); expect(idempotencyKey).toBeTruthy(); expect(payload).toMatchObject({ data: { missionId: "mission_created" }, meta: { reason: "Create governed Mission" } });
});

test("provisions and reads an AI Workforce Agent through product bindings", async ({ page }) => {
  await page.route("https://api.example.test/api/v1/ai-workforce/agents", async (route) => { await route.fulfill({ status: 201, contentType: "application/json", body: JSON.stringify({ data: { transactionId: "transaction-agent-e2e", resourceReferences: [{ resourceType: "Agent", resourceId: "agent_e2e" }] }, meta: { requestId: "request-agent", correlationId: "correlation-agent" } }) }); });
  await page.route("https://api.example.test/api/v1/ai-workforce/agents/agent_e2e", async (route) => { await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ data: { agentId: "agent_e2e", tenantId: "tenant_e2e", name: "Policy analyst", purpose: "Analyze policy", definitionVersion: "1", lifecycleStatus: "ACTIVE", status: "AVAILABLE", availability: "AVAILABLE", capabilities: [], assignments: [], version: 1 }, meta: { requestId: "request-agent-query", correlationId: "correlation-agent-query" } }) }); });
  await page.goto("/ai-workforce?action=aiWorkforceProvisionAgent"); await configure(page); await page.getByLabel("Agent ID").fill("agent_e2e"); await page.getByLabel("Agent name").fill("Policy analyst"); await page.getByLabel("Purpose").fill("Analyze policy"); await page.getByLabel("Definition version").fill("1"); await page.getByLabel("Capability name").fill("analysis"); await page.getByLabel("Capability scope").fill("policy"); await page.getByLabel("Operational reason").fill("Provision governed Agent"); await page.getByText("Evidence and Lineage").click(); await page.getByLabel("Evidence 1 ID").fill("evidence_agent"); await page.getByLabel("Evidence 1 source").fill("source"); await page.getByLabel("Evidence 1 type").fill("record"); await page.getByLabel("Lineage 1 source").fill("source_1"); await page.getByLabel("Lineage 1 target").fill("agent_e2e"); await page.getByLabel("Lineage 1 relationship").fill("defines"); await page.getByRole("button", { name: "Provision Agent" }).click(); await expect(page.getByText("transaction-agent-e2e")).toBeVisible();
  await page.goto("/ai-workforce"); await configure(page); await page.getByLabel("Agent lookup").fill("agent_e2e"); await page.getByRole("button", { name: "Get Agent" }).click(); await expect(page.getByText("Policy analyst")).toBeVisible();
});

test("all bounded-context workspaces support direct product deep links", async ({ page }) => {
  await page.route("https://api.example.test/**", async (route) => { await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ data: [], meta: { requestId: "request-workspace", correlationId: "correlation-workspace" } }) }); });
  const workspaces = [["/governance", "Authority and Decision workspace"], ["/institutional-assets", "Canonical governed outputs"], ["/knowledge", "Institutional knowledge and policy"], ["/workflows", "Governed workflow definitions and executions"], ["/reviews", "Governed review lifecycle"], ["/publications", "Publication preparation and evidence"], ["/connectors", "Connector configuration and evidence"]] as const;
  for (const [path, heading] of workspaces) { await page.goto(path); await configure(page); await expect(page.getByRole("heading", { name: heading })).toBeVisible(); }
});

test("shell supports keyboard navigation and reactive theme preference", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name === "mobile", "Desktop shell behavior");
  await page.goto("/"); await configure(page); await expect(page.getByRole("heading", { name: "Como podemos ajudar?" })).toBeVisible();
  await page.keyboard.press("Tab"); await expect(page.getByText("Pular para o conteúdo principal")).toBeFocused();
  await page.getByLabel("Tema").selectOption("dark"); await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
});

test("mobile navigation is modal and restores focus", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "mobile", "Mobile shell behavior");
  await page.goto("/"); await configure(page); const trigger = page.getByRole("button", { name: "Menu" }); await trigger.click();
  await expect(page.getByRole("dialog")).toBeVisible(); await page.keyboard.press("Escape"); await expect(trigger).toBeFocused();
});
