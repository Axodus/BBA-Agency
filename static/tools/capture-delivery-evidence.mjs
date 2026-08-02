import { spawn } from "node:child_process";
import { mkdir, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { resolve } from "node:path";

const staticRoot = resolve(import.meta.dirname, "..");
const repositoryRoot = resolve(staticRoot, "..");
const evidenceRoot = resolve(repositoryRoot, ".rag/evidence/REQ-IMP-020-FE-001");
const requireFromBrowserWorkspace = createRequire(resolve(repositoryRoot, "apps/bba-web/package.json"));
const { chromium } = requireFromBrowserWorkspace("@playwright/test");
const port = 4175;
const baseUrl = `http://127.0.0.1:${port}`;
const routes = [["deliveries-index", "/deliveries"], ["editorial-package", "/deliveries/editorial-package"], ["campaign-package", "/deliveries/campaign-package"], ["scientific-package", "/deliveries/scientific-package"], ["institutional-package", "/deliveries/institutional-package"], ["research-package", "/deliveries/research-package"]];
const viewports = [["desktop", 1440, 900], ["laptop", 1280, 800], ["tablet", 768, 1024], ["mobile", 390, 844]];
for (const directory of ["screenshots/desktop", "screenshots/laptop", "screenshots/tablet", "screenshots/mobile", "fallbacks"]) await mkdir(resolve(evidenceRoot, directory), { recursive: true });
const externalServer = process.env.DELIVERY_EVIDENCE_EXTERNAL_SERVER === "true";
const server = externalServer ? null : spawn(process.execPath, [resolve(staticRoot, "node_modules/vite/bin/vite.js"), "preview", "--host", "127.0.0.1", "--port", String(port), "--strictPort"], { cwd: staticRoot, stdio: "ignore" });
async function waitForServer() { for (let attempt = 0; attempt < 40; attempt += 1) { try { if ((await fetch(`${baseUrl}/deliveries`)).ok) return; } catch {} await new Promise((done) => setTimeout(done, 250)); } throw new Error("Vite server did not start for Delivery evidence"); }
const results = []; const requests = new Set();
try {
  await waitForServer(); const browser = await chromium.launch();
  for (const [viewportName, width, height] of viewports) {
    const context = await browser.newContext({ viewport: { width, height } }); const page = await context.newPage(); const consoleErrors = []; const failedRequests = [];
    page.on("request", (request) => requests.add(request.url())); page.on("console", (message) => { if (message.type() === "error") consoleErrors.push(message.text()); }); page.on("requestfailed", (request) => failedRequests.push(request.url()));
    for (const [name, route] of routes) { const response = await page.goto(`${baseUrl}${route}`, { waitUntil: "load" }); const metrics = await page.evaluate(() => ({ h1: document.querySelectorAll("h1").length, main: document.querySelectorAll("main").length, overflow: document.documentElement.scrollWidth > window.innerWidth, overflowElements: [...document.querySelectorAll("*")].filter((element) => element.getBoundingClientRect().right > window.innerWidth + 1).slice(0, 4).map((element) => `${element.tagName}.${element.className}`) })); if (!response?.ok() || metrics.h1 !== 1 || metrics.main !== 1 || metrics.overflow) throw new Error(`${route} failed semantic or overflow smoke at ${viewportName}: ${metrics.overflowElements.join(" | ")}`); if (name === "deliveries-index") await page.screenshot({ path: resolve(evidenceRoot, "screenshots", viewportName, `${name}.png`), fullPage: true, animations: "disabled" }); results.push(`${viewportName} ${route}: PASS (one h1, one main, no horizontal overflow)`); }
    if (viewportName === "desktop") for (const route of ["/deliveries/new", "/deliveries/unknown"]) { await page.goto(`${baseUrl}${route}`, { waitUntil: "load" }); if (!await page.getByRole("link", { name: "Return to Delivery Packages" }).isVisible()) throw new Error(`${route} has no Delivery fallback link`); await page.screenshot({ path: resolve(evidenceRoot, "fallbacks", `${route.split("/").at(-1)}.png`), fullPage: true, animations: "disabled" }); results.push(`desktop ${route}: fallback PASS`); }
    if (consoleErrors.length || failedRequests.length) throw new Error(`${viewportName} browser errors: ${[...consoleErrors, ...failedRequests].join(" | ")}`); await context.close();
  }
  await browser.close(); const disallowed = [...requests].filter((url) => /\/api\/|dev\.bba\.country|openai|anthropic/i.test(url)); if (disallowed.length) throw new Error(`disallowed runtime request: ${disallowed.join(" | ")}`);
  await writeFile(resolve(evidenceRoot, "responsive-validation.txt"), `${results.join("\n")}\n\nNetwork boundary: PASS; ${requests.size} local asset requests and no backend, provider, or prototype requests.\n`, "utf8");
  console.log(`Delivery browser evidence captured: ${routes.length * viewports.length} route captures.`);
} finally { server?.kill("SIGTERM"); }
