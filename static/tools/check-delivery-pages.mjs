import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const errors = [];
const routes = ["/deliveries", "/deliveries/editorial-package", "/deliveries/campaign-package", "/deliveries/scientific-package", "/deliveries/institutional-package", "/deliveries/research-package"];
const source = (path) => readFile(resolve(root, path), "utf8");
const [app, indexPage, detailPage, template, unavailable, generated, styles] = await Promise.all([
  source("src/App.tsx"), source("src/pages/Deliveries.tsx"), source("src/pages/DeliveryDetail.tsx"), source("src/components/deliveries/DeliveryPackagePage.tsx"), source("src/pages/Unavailable.tsx"), source("src/content/deliveries/generated/delivery-content.generated.ts"), source("app/globals.css"),
]);

for (const route of routes.slice(1)) if (!generated.includes(`"route": "${route}"`)) errors.push(`missing generated Delivery Package route ${route}`);
if (!app.includes('<Route\n          path="/deliveries"') || !app.includes("<Deliveries />")) errors.push("/deliveries does not render the informational index");
if (!app.includes('path="/deliveries/new"') || !app.includes('path="/deliveries/:deliverySlug"')) errors.push("Delivery routes do not explicitly reserve /deliveries/new before the slug route");
if (app.indexOf('path="/deliveries/new"') > app.indexOf('path="/deliveries/:deliverySlug"')) errors.push("/deliveries/new must precede the dynamic route");
if (!app.includes("<DeliveryDetail />")) errors.push("Delivery detail route is missing");
if (!detailPage.includes("getAgencyDeliveryPackageByRouteSegment") || !detailPage.includes("<Unavailable />")) errors.push("unknown Delivery Package slugs do not use the fallback");
if (!unavailable.includes('"/deliveries"') || !unavailable.includes("Return to Delivery Packages")) errors.push("Delivery fallback does not return to /deliveries");
if (!indexPage.includes("agencyDeliveryPackages") || !indexPage.includes("deliveryPackage.artifacts")) errors.push("Delivery index does not consume generated canonical content");
if (!template.includes("DeliveryPackagePage") || !template.includes("deliveryPackage.reviewProcess.map") || !template.includes("deliveryPackage.artifacts.map") || !template.includes("deliveryPackage.traceability.map") || !template.includes("deliveryPackage.qualityGates.map") || !template.includes("deliveryPackage.limitations.map")) errors.push("shared Delivery Package template does not render required generated content");
if (!template.includes('<ol className="delivery-review-list"')) errors.push("review process is not semantic ordered content");
if (!template.includes("Illustrative version history")) errors.push("version records lack illustrative status");
if (!template.includes("This is an illustrative representation of a planned BBA Agency Delivery Package.")) errors.push("planned Package disclosure is missing");
if (!template.includes("functional BBA Publisher prototype")) errors.push("Publisher disclosure is missing");
if (!template.includes("getAgencyProductById") || !template.includes("getAgencyProjectById")) errors.push("Product and Project relationships are not resolved from canonical IDs");
for (const [name, content] of [["Delivery index", indexPage], ["Delivery detail", detailPage], ["Delivery template", template]]) {
  if (/<form\b|<input\b|<textarea\b|onClick=|fetch\(|axios|localStorage|sessionStorage|XMLHttpRequest|api-client/i.test(content)) errors.push(`${name} includes prohibited operational behavior`);
}
if (/delivery-library|package-icon|filter-row/.test(styles)) errors.push("legacy file-manager or filter styles remain");
if (!/\.delivery-artifact-|\.delivery-review-|\.delivery-approval-|\.delivery-version-|\.delivery-traceability-|\.delivery-quality-/.test(styles)) errors.push("scoped Delivery Package styles are incomplete");

if (errors.length) { console.error("Delivery page integration check failed:\n" + errors.map((error) => `- ${error}`).join("\n")); process.exitCode = 1; }
else console.log(`Delivery page integration check passed: ${routes.length} valid routes, 2 fallback scenarios, and 1 shared informational template.`);
