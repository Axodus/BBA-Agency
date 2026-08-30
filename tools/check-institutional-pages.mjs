import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const routes = [
  "/resources/documentation",
  "/resources/product-narrative",
  "/resources/architecture",
  "/resources/changelog",
  "/resources/help-center",
  "/company/about",
  "/company/contact",
  "/company/privacy",
  "/company/terms",
  "/company/cookies",
];

const [institutionalSource, appSource, footerSource, sitemapSource, llmsSource] = await Promise.all([
  readFile(resolve(root, "src/content/institutional.ts"), "utf8"),
  readFile(resolve(root, "src/App.tsx"), "utf8"),
  readFile(resolve(root, "app/components/AgencyFooter.tsx"), "utf8"),
  readFile(resolve(root, "tools/generate-sitemap.mjs"), "utf8"),
  readFile(resolve(root, "public/llms.txt"), "utf8"),
]);

const errors = [];
for (const route of routes) {
  if (!institutionalSource.includes(`route: "${route}"`)) errors.push(`institutional content is missing ${route}`);
  if (!appSource.includes(`path="${route}"`)) errors.push(`router is missing ${route}`);
  if (!footerSource.includes(`href="${route}"`)) errors.push(`footer is missing ${route}`);
  if (!sitemapSource.includes(`"${route}"`)) errors.push(`sitemap generator is missing ${route}`);
}

if (/href="\/unavailable\?destination=(?:docs|narrative|architecture|changelog|help|about|contact|privacy|terms|cookies)"/.test(footerSource)) {
  errors.push("footer still routes institutional links to unavailable");
}

if (!institutionalSource.includes("BBA Agency is an Axodus product") || !footerSource.includes("https://axodus.country")) {
  errors.push("direct Axodus relationship is incomplete");
}

if (!llmsSource.includes("https://bba.country/company/about") || !llmsSource.includes("https://bba.country/resources/documentation")) {
  errors.push("llms.txt is missing institutional canonical routes");
}

if (errors.length > 0) {
  console.error("Institutional page integration check failed:\n" + errors.map((error) => `- ${error}`).join("\n"));
  process.exitCode = 1;
} else {
  console.log(`Institutional page integration check passed: ${routes.length} canonical routes and Axodus relationship intact.`);
}
