import { spawn } from "node:child_process";
import { mkdir, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { resolve } from "node:path";

const staticRoot = resolve(import.meta.dirname, "..");
const repositoryRoot = resolve(staticRoot, "..");
const evidenceRoot = resolve(repositoryRoot, ".rag/evidence/SPRINT-IMP-020");
const requireFromBrowserWorkspace = createRequire(resolve(repositoryRoot, "apps/bba-web/package.json"));
const { chromium } = requireFromBrowserWorkspace("@playwright/test");
const port = 4176;
const baseUrl = `http://127.0.0.1:${port}`;
const viewportName = process.env.DELIVERY_TEST_VIEWPORT ?? "desktop";
const featureMode = process.env.DELIVERY_TEST_FEATURES === "true";
const viewports = new Map([["desktop", [1440, 900]], ["laptop", [1280, 800]], ["tablet", [768, 1024]], ["mobile", [390, 844]]]);
const dimensions = viewports.get(viewportName);
const routes = [["deliveries-index", "/deliveries", "See what a completed BBA Agency Project delivers"], ["editorial-package", "/deliveries/editorial-package", "Editorial Package"], ["campaign-package", "/deliveries/campaign-package", "Campaign Package"], ["scientific-package", "/deliveries/scientific-package", "Scientific Package"], ["institutional-package", "/deliveries/institutional-package", "Institutional Package"], ["research-package", "/deliveries/research-package", "Research Package"]];
if (!dimensions) throw new Error(`Unsupported viewport ${viewportName}`);
for (const directory of [viewportName, "fallbacks", "features", "logs", "routes", "boundaries", "accessibility", "inventory"]) await mkdir(resolve(evidenceRoot, directory), { recursive: true });
const server = spawn(process.execPath, [resolve(staticRoot, "node_modules/vite/bin/vite.js"), "preview", "--host", "127.0.0.1", "--port", String(port), "--strictPort"], { cwd: staticRoot, stdio: "ignore" });
async function waitForServer() { for (let attempt = 0; attempt < 40; attempt += 1) { try { if ((await fetch(`${baseUrl}/deliveries`)).ok) return; } catch {} await new Promise((done) => setTimeout(done, 250)); } throw new Error("Vite preview did not start"); }
function yamlEntry(entry) { return `- route: ${entry.route}\n  viewport: { width: ${entry.width}, height: ${entry.height} }\n  file: ${entry.file}\n  heading: ${JSON.stringify(entry.heading)}\n  horizontalOverflow: ${entry.horizontalOverflow}\n  consoleErrors: ${entry.consoleErrors}\n  failedRequests: ${entry.failedRequests}\n  result: ${entry.result}`; }

const manifest = []; const routeResults = []; const requests = new Set();
try {
  await waitForServer(); const browser = await chromium.launch(); const context = await browser.newContext({ viewport: { width: dimensions[0], height: dimensions[1] } }); const page = await context.newPage(); const consoleErrors = []; const failedRequests = [];
  page.on("request", (request) => requests.add(request.url())); page.on("console", (message) => { if (message.type() === "error") consoleErrors.push(message.text()); }); page.on("requestfailed", (request) => failedRequests.push(`${request.method()} ${request.url()}`));
  if (!featureMode) {
    for (const [name, route, expectedHeading] of routes) {
      const response = await page.goto(`${baseUrl}${route}`, { waitUntil: "load" }); await page.reload({ waitUntil: "load" });
      const details = await page.evaluate(() => ({ h1: document.querySelectorAll("h1").length, main: document.querySelectorAll("main").length, overflow: document.documentElement.scrollWidth > window.innerWidth, overflowElements: [...document.querySelectorAll("*")].filter((element) => element.getBoundingClientRect().right > window.innerWidth + 1).slice(0, 3).map((element) => `${element.tagName}.${element.className}`) }));
      const heading = await page.locator("h1").textContent();
      if (!response?.ok() || details.h1 !== 1 || details.main !== 1 || details.overflow || heading?.trim() !== expectedHeading) throw new Error(`${route} failed route, heading, semantic, or overflow smoke: ${details.overflowElements.join(" | ")}`);
      if (route === "/deliveries") { if (await page.getByRole("link", { name: /View what this Package contains/i }).count() !== 5) throw new Error("Delivery catalog lacks five Package links"); }
      else { for (const linkName of ["Return to Delivery Packages", "View "]) { if (!await page.getByRole("link", { name: new RegExp(linkName, "i") }).first().isVisible()) throw new Error(`${route} missing expected navigation link`); } if (!await page.locator("ol.delivery-review-list").isVisible()) throw new Error(`${route} lacks visible ordered review process`); if (!await page.locator(".delivery-package-limitations").isVisible()) throw new Error(`${route} lacks visible limitations`); }
      const file = `${viewportName}/${name}.png`; await page.screenshot({ path: resolve(evidenceRoot, file), fullPage: true, animations: "disabled" }); manifest.push({ route, width: dimensions[0], height: dimensions[1], file, heading: heading?.trim() ?? "", horizontalOverflow: details.overflow, consoleErrors: consoleErrors.length, failedRequests: failedRequests.length, result: "PASS" }); routeResults.push(`${route}: direct load, refresh, heading, semantics, responsive layout PASS`);
    }
    if (viewportName === "desktop") for (const [name, route] of [["new", "/deliveries/new"], ["unknown", "/deliveries/unknown"], ["non-existent-package", "/deliveries/non-existent-package"]]) { await page.goto(`${baseUrl}${route}`, { waitUntil: "load" }); if (await page.locator("h1").count() !== 1 || !await page.getByRole("link", { name: "Return to Delivery Packages" }).isVisible() || await page.locator(".delivery-package-page").count()) throw new Error(`${route} fallback is invalid`); await page.screenshot({ path: resolve(evidenceRoot, "fallbacks", `${name}.png`), fullPage: true, animations: "disabled" }); routeResults.push(`${route}: accessible fallback PASS`); }
  } else {
    await page.goto(`${baseUrl}/deliveries/editorial-package`, { waitUntil: "load" });
    const captures = [["editorial-prototype-disclosure", ".delivery-package-disclosure"], ["artifact-grid", ".delivery-artifact-grid"], ["review-process", ".delivery-review-list"], ["approval-summary", ".delivery-approval-summary"], ["version-history", ".delivery-version-list"], ["traceability", ".delivery-traceability-list"], ["quality-gates", ".delivery-quality-grid"], ["limitations", ".delivery-package-limitations"], ["footer", "footer"]];
    for (const [name, selector] of captures) { const locator = page.locator(selector); if (!await locator.isVisible()) throw new Error(`Missing feature ${name}`); await locator.screenshot({ path: resolve(evidenceRoot, "features", `${name}.png`) }); }
    await page.locator(".app-header").getByRole("link", { name: "Services" }).hover(); const submenu = page.locator(".app-header-submenu"); if (!await submenu.isVisible()) throw new Error("Services submenu is not available on Delivery route"); await page.locator(".app-header").screenshot({ path: resolve(evidenceRoot, "features", "services-submenu.png") });
    await page.getByRole("link", { name: /View BBA Publisher/i }).focus(); const focusState = await page.evaluate(() => document.activeElement?.tagName === "A"); if (!focusState) throw new Error("keyboard focus did not reach Product link"); await page.keyboard.press("Shift+Tab"); await page.keyboard.press("Tab");
    await page.getByRole("link", { name: /View BBA Publisher/i }).click(); if (!page.url().endsWith("/services/publisher")) throw new Error("Product link navigation failed"); await page.goBack({ waitUntil: "load" }); await page.getByRole("link", { name: /Neurons Protocol Launch/i }).click(); if (!page.url().endsWith("/projects/neurons-protocol-launch")) throw new Error("Project link navigation failed"); await page.goBack({ waitUntil: "load" });
    routeResults.push("keyboard focus, Services submenu, Product link, Project link, back navigation, footer: PASS");
  }
  if (consoleErrors.length || failedRequests.length) throw new Error(`console or failed-request errors: ${[...consoleErrors, ...failedRequests].join(" | ")}`);
  await context.close(); await browser.close(); const disallowed = [...requests].filter((url) => /\/api\/|dev\.bba\.country|openai|anthropic|localhost:(?!4176)|127\.0\.0\.1:(?!4176)/i.test(url)); if (disallowed.length) throw new Error(`disallowed requests: ${disallowed.join(" | ")}`);
  const suffix = featureMode ? "features" : viewportName; await writeFile(resolve(evidenceRoot, "logs", `${suffix}.txt`), `${routeResults.join("\n")}\nconsoleErrors: 0\nfailedRequests: 0\nnetwork: PASS (${requests.size} local requests)\n`, "utf8"); if (!featureMode) await writeFile(resolve(evidenceRoot, "routes", `${viewportName}.yml`), `${manifest.map(yamlEntry).join("\n")}\n`, "utf8");
  console.log(`Delivery test evidence captured: ${featureMode ? "features" : `${routes.length} ${viewportName} routes`}.`);
} finally { server.kill("SIGTERM"); }
