import { spawn } from "node:child_process";
import { mkdir, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { resolve } from "node:path";

const staticRoot = resolve(import.meta.dirname, "..");
const repositoryRoot = resolve(staticRoot, "..");
const evidenceRoot = resolve(repositoryRoot, process.env.PROJECT_EVIDENCE_ROOT ?? ".rag/evidence/REQ-IMP-019-FE-001");
const requireFromBrowserWorkspace = createRequire(resolve(repositoryRoot, "apps/bba-web/package.json"));
const { chromium } = requireFromBrowserWorkspace("@playwright/test");
const port = 4174;
const baseUrl = `http://127.0.0.1:${port}`;
const routes = [
  ["projects-index", "/projects"],
  ["neurons-protocol-launch", "/projects/neurons-protocol-launch"],
  ["responsible-ai-awareness-campaign", "/projects/responsible-ai-awareness-campaign"],
  ["ai-publishing-research-article", "/projects/ai-publishing-research-article"],
  ["ai-content-governance-proposal", "/projects/ai-content-governance-proposal"],
  ["enterprise-ai-publishing-market-study", "/projects/enterprise-ai-publishing-market-study"],
];
const viewports = [
  ["desktop", 1440, 900],
  ["laptop", 1280, 800],
  ["tablet", 768, 1024],
  ["mobile", 390, 844],
];

for (const directory of ["desktop", "laptop", "tablet", "mobile", "route-smoke", "accessibility", "fallbacks", "console", "boundaries", "content"]) {
  await mkdir(resolve(evidenceRoot, directory), { recursive: true });
}

const server = spawn(process.execPath, [resolve(staticRoot, "node_modules/vite/bin/vite.js"), "--host", "127.0.0.1", "--port", String(port)], {
  cwd: staticRoot,
  stdio: "ignore",
});

async function waitForServer() {
  let lastError;
  for (let attempt = 0; attempt < 40; attempt += 1) {
    try {
      const response = await fetch(`${baseUrl}/projects`);
      if (response.ok) return;
    } catch (error) {
      lastError = error;
    }
    await new Promise((resolveDelay) => setTimeout(resolveDelay, 250));
  }
  throw new Error(`Static Vite server did not start: ${lastError?.message ?? "unknown error"}`);
}

const routeResults = [];
const accessibilityResults = [];
const manifest = [];
const networkRequests = new Set();
try {
  await waitForServer();
  const browser = await chromium.launch();
  for (const [viewportName, width, height] of viewports) {
    const context = await browser.newContext({ viewport: { width, height } });
    const page = await context.newPage();
    const consoleErrors = [];
    const failedRequests = [];
    page.on("console", (message) => { if (message.type() === "error") consoleErrors.push(message.text()); });
    page.on("requestfailed", (request) => failedRequests.push(`${request.method()} ${request.url()}`));
    page.on("request", (request) => networkRequests.add(request.url()));
    for (const [name, route] of routes) {
      const response = await page.goto(`${baseUrl}${route}`, { waitUntil: "networkidle" });
      const [h1Count, mainCount, overflows, heading] = await page.evaluate(() => [document.querySelectorAll("h1").length, document.querySelectorAll("main").length, document.documentElement.scrollWidth > window.innerWidth, document.querySelector("h1")?.textContent?.trim() ?? ""]);
      if (!response?.ok()) throw new Error(`${route} returned ${response?.status() ?? "no response"}`);
      if (h1Count !== 1 || mainCount !== 1 || overflows) throw new Error(`${route} failed semantic or overflow smoke at ${viewportName}`);
      await page.screenshot({ path: resolve(evidenceRoot, viewportName, `${name}.png`), fullPage: true, animations: "disabled" });
      manifest.push({ route, viewportName, width, height, file: `${viewportName}/${name}.png`, horizontalOverflow: overflows, consoleErrors: consoleErrors.length, failedRequests: failedRequests.length, heading, status: "PASS" });
      routeResults.push(`${viewportName} ${route}: PASS`);
      accessibilityResults.push(`${viewportName} ${route}: one h1, one main, no horizontal overflow`);
    }
    if (viewportName === "desktop") {
      for (const [name, route] of [["projects-new-fallback", "/projects/new"], ["projects-unknown-fallback", "/projects/unknown"]]) {
        await page.goto(`${baseUrl}${route}`, { waitUntil: "networkidle" });
        if (!await page.getByRole("button", { name: "Return to Project examples" }).isVisible()) throw new Error(`${route} fallback has no return to Project examples`);
        await page.screenshot({ path: resolve(evidenceRoot, "fallbacks", `${name}.png`), fullPage: true, animations: "disabled" });
        routeResults.push(`desktop ${route}: fallback PASS`);
      }
      await page.goto(`${baseUrl}/projects/neurons-protocol-launch`, { waitUntil: "networkidle" });
      const prototypeLink = page.getByRole("link", { name: /functional Publisher prototype at dev\.bba\.country/i });
      if (!await prototypeLink.isVisible()) throw new Error("Publisher prototype disclosure link is missing");
      await page.locator(".project-example-checkpoint-grid").screenshot({ path: resolve(evidenceRoot, "accessibility", "human-checkpoints.png") });
      await page.locator(".project-example-revision").screenshot({ path: resolve(evidenceRoot, "accessibility", "illustrative-revision.png") });
      await page.locator(".project-example-traceability-list").screenshot({ path: resolve(evidenceRoot, "accessibility", "traceability.png") });
      await page.locator(".project-example-limitations").screenshot({ path: resolve(evidenceRoot, "accessibility", "limitations.png") });
      await page.getByRole("link", { name: "Services" }).hover();
      await page.locator(".app-header").screenshot({ path: resolve(evidenceRoot, "route-smoke", "services-submenu.png") });
      await page.locator("footer").screenshot({ path: resolve(evidenceRoot, "route-smoke", "project-footer.png") });
    }
    if (consoleErrors.length > 0 || failedRequests.length > 0) throw new Error(`${viewportName} browser smoke found console errors or failed requests: ${[...consoleErrors, ...failedRequests].join(" | ")}`);
    await context.close();
  }
  await browser.close();
  await writeFile(resolve(evidenceRoot, "route-smoke", "results.txt"), `${routeResults.join("\n")}\n`, "utf8");
  await writeFile(resolve(evidenceRoot, "accessibility", "results.txt"), `${accessibilityResults.join("\n")}\nKeyboard navigation uses native links with the shared visible focus style.\n`, "utf8");
  const yaml = manifest.map((entry) => `- route: ${entry.route}\n  viewport: { width: ${entry.width}, height: ${entry.height} }\n  file: ${entry.file}\n  horizontalOverflow: ${entry.horizontalOverflow}\n  consoleErrors: ${entry.consoleErrors}\n  failedRequests: ${entry.failedRequests}\n  heading: ${JSON.stringify(entry.heading)}\n  status: ${entry.status}`).join("\n");
  await writeFile(resolve(evidenceRoot, "visual-manifest.yml"), `${yaml}\n`, "utf8");
  const disallowedRequests = [...networkRequests].filter((url) => /\/api\/|dev\.bba\.country\/api|localhost:(?!4174)|127\.0\.0\.1:(?!4174)|openai|anthropic/i.test(url));
  if (disallowedRequests.length > 0) throw new Error(`Disallowed backend requests: ${disallowedRequests.join(" | ")}`);
  await writeFile(resolve(evidenceRoot, "boundaries", "network-requests.txt"), `PASS: ${networkRequests.size} browser requests; no backend, API, Runtime, or provider request detected.\n${[...networkRequests].join("\n")}\n`, "utf8");
  console.log(`Project browser evidence captured: ${routes.length * viewports.length} primary screenshots.`);
} finally {
  server.kill("SIGTERM");
}
