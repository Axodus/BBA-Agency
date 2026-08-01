import { access, readFile } from "node:fs/promises";
import { constants } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const errors = [];
const expectedRoutes = [
  "/projects/neurons-protocol-launch",
  "/projects/responsible-ai-awareness-campaign",
  "/projects/ai-publishing-research-article",
  "/projects/ai-content-governance-proposal",
  "/projects/enterprise-ai-publishing-market-study",
];

async function source(path) {
  return readFile(resolve(root, path), "utf8");
}

async function missing(path) {
  try {
    await access(resolve(root, path), constants.F_OK);
    return false;
  } catch {
    return true;
  }
}

const [app, projectsPage, detailPage, examplePage, card, unavailable, generated] = await Promise.all([
  source("src/App.tsx"),
  source("src/pages/Projects.tsx"),
  source("src/pages/ProjectDetail.tsx"),
  source("src/components/projects/ProjectExamplePage.tsx"),
  source("src/components/projects/ProjectExampleCard.tsx"),
  source("src/pages/Unavailable.tsx"),
  source("src/content/projects/generated/project-content.generated.ts"),
]);

for (const route of expectedRoutes) {
  if (!generated.includes(`"route": "${route}"`)) errors.push(`missing generated Project route ${route}`);
}
if (!app.includes("<Projects />")) errors.push("/projects does not render the informational Projects page");
if (!app.includes("<ProjectDetail />")) errors.push("Project detail route does not render ProjectDetail");
if (!app.includes('path="/projects/new"') || !app.includes("<Unavailable />")) errors.push("/projects/new is not explicitly unavailable");
if (!app.includes('path="/projects/:projectSlug"')) errors.push("Project detail route does not use a slug");
if (!detailPage.includes("getAgencyProjectByRouteSegment") || !detailPage.includes("<Unavailable />")) errors.push("unknown Project slugs do not resolve to the fallback");
if (!unavailable.includes('"/projects"')) errors.push("Project fallback does not provide a return path to Project examples");
if (!projectsPage.includes("ProjectExampleCard") || !projectsPage.includes("agencyProjects")) errors.push("Projects catalog is not generated from canonical content");
if (!examplePage.includes("ProjectExamplePage") || !examplePage.includes("project.workflow.map") || !examplePage.includes("project.humanDecisions.map") || !examplePage.includes("project.traceability.map")) errors.push("reusable Project detail template does not render canonical execution content");
if (!examplePage.includes("<ol className=\"project-example-timeline\"")) errors.push("Project timeline is not semantic ordered-list content");

for (const [name, content] of [["Projects", projectsPage], ["Project detail", examplePage], ["Project card", card]]) {
  if (/<form\b|<input\b|<textarea\b|onClick=|fetch\(|localStorage|sessionStorage|XMLHttpRequest/.test(content)) {
    errors.push(`${name} includes prohibited operational behavior`);
  }
}

for (const legacyPage of ["src/pages/Dashboard.tsx", "src/pages/NewProject.tsx", "src/pages/Project.tsx"]) {
  if (!(await missing(legacyPage))) errors.push(`legacy operational page remains: ${legacyPage}`);
}

if (errors.length > 0) {
  console.error("Project page integration check failed:\n" + errors.map((error) => `- ${error}`).join("\n"));
  process.exitCode = 1;
} else {
  console.log(`Project page integration check passed: ${expectedRoutes.length} generated routes, informational boundary intact.`);
}
