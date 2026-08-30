import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { loadDeliveryContent } from "./delivery-content-lib.mjs";
import { loadProductContent } from "./product-content-lib.mjs";
import { loadProjectContent } from "./project-content-lib.mjs";

const DEFAULT_SITE_URL = "https://bba.country";
const FIXED_ROUTES = [
  "/",
  "/services",
  "/projects",
  "/deliveries",
  "/ai-models",
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

function normalizeSiteUrl(value) {
  const siteUrl = value?.trim() || DEFAULT_SITE_URL;
  return siteUrl.replace(/\/+$/, "");
}

function assertPublicRoute(route) {
  if (typeof route !== "string" || !route.startsWith("/")) {
    throw new Error(`Invalid sitemap route: ${String(route)}`);
  }

  if (route.includes("?") || route.includes("#")) {
    throw new Error(`Sitemap route must be canonical and query-free: ${route}`);
  }
}

function escapeXml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function buildUrl(siteUrl, route) {
  return route === "/" ? `${siteUrl}/` : `${siteUrl}${route}`;
}

function buildSitemapXml(routes, siteUrl) {
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...routes.map((route) => `  <url><loc>${escapeXml(buildUrl(siteUrl, route))}</loc></url>`),
    "</urlset>",
    "",
  ].join("\n");
}

const root = resolve(import.meta.dirname, "..");
const siteUrl = normalizeSiteUrl(process.env.BBA_SITE_URL ?? process.env.SITE_URL);

const [productResult, projectResult, deliveryResult] = await Promise.all([
  loadProductContent(root),
  loadProjectContent(root),
  loadDeliveryContent(root),
]);

const errors = [
  ...productResult.errors.map((error) => `Product content: ${error}`),
  ...projectResult.errors.map((error) => `Project content: ${error}`),
  ...deliveryResult.errors.map((error) => `Delivery Package content: ${error}`),
];

if (errors.length > 0) {
  console.error("Sitemap generation failed:\n" + errors.map((error) => `- ${error}`).join("\n"));
  process.exitCode = 1;
} else {
  const routeSet = new Set([
    ...FIXED_ROUTES,
    ...productResult.products.map((product) => product.seo?.canonicalPath ?? product.route),
    ...projectResult.projects.map((project) => project.seo?.canonicalPath ?? project.route),
    ...deliveryResult.deliveries.map((deliveryPackage) => deliveryPackage.seo?.canonicalPath ?? deliveryPackage.route),
  ]);

  const routes = [...routeSet];
  for (const route of routes) assertPublicRoute(route);

  const sitemapPath = resolve(root, "public/sitemap.xml");
  await mkdir(resolve(sitemapPath, ".."), { recursive: true });
  await writeFile(sitemapPath, buildSitemapXml(routes, siteUrl), "utf8");
  console.log(`Sitemap generated: ${routes.length} routes at public/sitemap.xml.`);
}
