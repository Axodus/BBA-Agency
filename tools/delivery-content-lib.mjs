import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { parseYaml, loadProjectContent } from "./project-content-lib.mjs";
import { loadProductContent } from "./product-content-lib.mjs";

export const DELIVERY_SECTION_TITLES = ["Overview", "Business objective", "Contents", "Artifacts", "Review process", "Approval", "Revision policy", "Version history", "Traceability", "Quality gates", "Limitations", "Relationship with Projects", "Relationship with Product", "Future operational workflow", "Frequently asked questions"];
const INVENTORY = [
  ["editorial-package", "/deliveries/editorial-package", "bba-publisher", "neurons-protocol-launch", "PROTOTYPE_BACKED", "Editorial Package"],
  ["campaign-package", "/deliveries/campaign-package", "advertising-campaign", "responsible-ai-awareness-campaign", "ILLUSTRATIVE_PLANNED", "Campaign Package"],
  ["scientific-package", "/deliveries/scientific-package", "scientific-article", "ai-publishing-research-article", "ILLUSTRATIVE_PLANNED", "Scientific Package"],
  ["institutional-package", "/deliveries/institutional-package", "governance-proposal", "ai-content-governance-proposal", "ILLUSTRATIVE_PLANNED", "Institutional Package"],
  ["research-package", "/deliveries/research-package", "market-research", "enterprise-ai-publishing-market-study", "ILLUSTRATIVE_PLANNED", "Research Package"],
];
const REQUIRED_FIELDS = ["schemaVersion", "id", "name", "slug", "route", "category", "status", "operationalOnStaticSite", "productId", "productName", "productRoute", "projectId", "projectName", "projectRoute", "eyebrow", "headline", "summary", "purpose", "customerOutcome", "availability", "prototype", "seo", "navigation", "keywords", "artifacts", "reviewProcess", "approval", "revisionPolicy", "versionHistory", "traceability", "qualityGates", "limitations"];
const PLACEHOLDERS = /\b(?:TODO|TBD|Lorem ipsum|Insert copy|Placeholder|Coming later)\b/i;
const FORBIDDEN_OPERATIONAL = /(?:download(?:Url| URL)?|zip archive|storage path|upload status|export handler|apiEndpoint|submitAction|persistence):/i;

export function getDeliveryContentPaths(rootDir) {
  const contentDir = resolve(rootDir, "content/deliveries");
  return { contentDir, schemaPath: resolve(contentDir, "schema.yml"), generatedModulePath: resolve(rootDir, "src/content/deliveries/generated/delivery-content.generated.ts") };
}

function parseMarkdownSections(body) {
  const title = body.match(/^# (.+)$/m)?.[1]?.trim();
  if (!title) throw new Error("Missing Delivery Package document title");
  const headings = [...body.matchAll(/^## (.+)$/gm)]; const sections = {};
  for (let index = 0; index < headings.length; index += 1) {
    const current = headings[index]; const next = headings[index + 1]; const start = (current.index ?? 0) + current[0].length;
    sections[current[1].trim()] = { title: current[1].trim(), body: body.slice(start, next?.index ?? body.length).trim() };
  }
  const faqBody = sections["Frequently asked questions"]?.body ?? ""; const questions = [...faqBody.matchAll(/^### (.+)$/gm)];
  const faq = questions.map((question, index) => ({ question: question[1].trim(), answer: faqBody.slice((question.index ?? 0) + question[0].length, questions[index + 1]?.index ?? faqBody.length).trim() }));
  return { title, sections, faq };
}
function hasText(value) { return typeof value === "string" && value.trim().length > 0; }
function addError(errors, path, condition, message) { if (!condition) errors.push(`${path}: ${message}`); }

function validateDelivery(item, raw, errors, productMap, projectMap, allIds) {
  const path = item.sourcePath; const expectedIndex = INVENTORY.findIndex(([id]) => id === item.id); const expected = INVENTORY[expectedIndex];
  for (const field of REQUIRED_FIELDS) addError(errors, path, item[field] !== undefined && item[field] !== "", `missing ${field}`);
  addError(errors, path, item.schemaVersion === "1.0", "unsupported schemaVersion");
  addError(errors, path, item.slug === item.id, "slug must match id");
  addError(errors, path, expected && item.route === expected[1] && item.productId === expected[2] && item.projectId === expected[3] && item.status === expected[4] && item.name === expected[5], "ID, route, Product, Project, status, or Package name does not match inventory");
  addError(errors, path, item.operationalOnStaticSite === false && item.availability?.operationalOnStaticSite === false && item.approval?.operationalOnStaticSite === false, "static site must remain non-operational");
  addError(errors, path, item.availability?.code === item.status, "availability code must match status");
  addError(errors, path, item.seo?.canonicalPath === item.route, "SEO canonicalPath must match route");
  addError(errors, path, item.navigation?.previousDelivery === (expectedIndex ? INVENTORY[expectedIndex - 1]?.[0] : null) && item.navigation?.nextDelivery === (expectedIndex === INVENTORY.length - 1 ? null : INVENTORY[expectedIndex + 1]?.[0]), "navigation must follow canonical Package order");
  const product = productMap.get(item.productId); const project = projectMap.get(item.projectId);
  addError(errors, path, product, `unknown Product ${item.productId}`); addError(errors, path, project, `unknown Project ${item.projectId}`);
  if (product) addError(errors, path, item.productName === product.name && item.productRoute === product.route, "Product name or route differs from canonical Product");
  if (project) addError(errors, path, item.projectName === project.name && item.projectRoute === project.route && project.productId === item.productId && project.packageName === item.name, "Project name, route, Product relationship, or Package name differs from canonical Project");
  if (item.status === "PROTOTYPE_BACKED") addError(errors, path, item.id === "editorial-package" && item.prototype?.available === true && item.prototype?.url === "https://dev.bba.country" && /does not generate or publish/i.test(item.prototype?.disclosure ?? ""), "Publisher prototype disclosure is incomplete");
  else addError(errors, path, item.prototype?.available === false && /planned BBA Agency Product.*not represent an operational implementation/i.test(item.prototype?.disclosure ?? ""), "planned Package disclosure is incomplete");
  const artifacts = item.artifacts ?? []; const artifactIds = new Set(artifacts.map((artifact) => artifact.id));
  addError(errors, path, artifacts.length > 0 && artifactIds.size === artifacts.length, "artifacts must have unique IDs");
  addError(errors, path, artifacts.every((artifact) => artifact.id && artifact.name && artifact.description && artifact.purpose && artifact.artifactType && typeof artifact.requiresHumanApproval === "boolean" && artifact.includedInPackage === true && Array.isArray(artifact.illustrativeFormats) && artifact.illustrativeFormats.length > 0), "artifact shape is invalid");
  const reviews = item.reviewProcess ?? []; const reviewIds = new Set(reviews.map((review) => review.id));
  addError(errors, path, reviews.length > 0 && reviewIds.size === reviews.length && reviews.every((review, index) => review.order === index + 1 && review.id && review.label && review.purpose && review.reviewerRole && review.humanCheckpoint === true && review.artifactIds.every((id) => artifactIds.has(id)) && review.possibleOutcomes.length >= 2), "review process must be ordered, human, and resolve artifacts");
  addError(errors, path, item.approval?.required === true && hasText(item.approval?.responsibleRole) && hasText(item.approval?.description) && item.approval?.possibleResponses?.join(",") === "APPROVE,REQUEST_CHANGES,REJECT", "approval must be human and explanatory");
  addError(errors, path, hasText(item.revisionPolicy?.description) && item.revisionPolicy?.preserves?.length > 0 && item.revisionPolicy?.mayInvalidate?.length > 0, "revision policy is incomplete");
  addError(errors, path, item.versionHistory?.length > 0 && item.versionHistory.every((version) => version.illustrative === true && version.version && version.status && version.description && version.changedArtifactIds?.every((id) => artifactIds.has(id))), "version history must be illustrative and resolve artifacts");
  addError(errors, path, item.traceability?.length > 0 && item.traceability.every((trace) => trace.id && trace.sourceType && trace.sourceReference && artifactIds.has(trace.artifactId) && trace.artifactVersion && trace.rationale && (!trace.reviewCheckpointId || reviewIds.has(trace.reviewCheckpointId))), "traceability records must resolve artifacts and reviews");
  addError(errors, path, item.qualityGates?.length > 0 && item.qualityGates.every((gate) => gate.id && gate.name && gate.description && ["WARNING", "BLOCKING"].includes(gate.severityWhenFailed)), "quality gates are invalid");
  addError(errors, path, item.limitations?.length > 0 && item.limitations.every(hasText), "limitations are required");
  for (const title of DELIVERY_SECTION_TITLES) addError(errors, path, hasText(item.sections?.[title]?.body), `missing or empty Markdown section ${title}`);
  addError(errors, path, item.faq?.length >= 5 && item.faq.every((entry) => hasText(entry.question) && hasText(entry.answer)), "at least five complete FAQs are required");
  addError(errors, path, !PLACEHOLDERS.test(raw), "unresolved template marker"); addError(errors, path, !FORBIDDEN_OPERATIONAL.test(raw), "operational delivery metadata is not allowed");
  addError(errors, path, !/\b(?:download|export|publish|approve|request revisions?)\b/i.test(item.keywords?.join(" ") ?? ""), "active operational CTA is not allowed in keywords");
  addError(errors, path, !/\$Neurons[^\n]{0,60}(?:price|value|financial|investment|return)/i.test(raw), "financial meaning for $Neurons is prohibited");
  if (item.status === "ILLUSTRATIVE_PLANNED") addError(errors, path, /illustrative planned/i.test(item.summary) && /illustrative/i.test(item.sections?.["Version history"]?.body ?? ""), "planned Package must remain visibly illustrative");
  if (item.navigation?.previousDelivery) addError(errors, path, allIds.has(item.navigation.previousDelivery), "previousDelivery references unknown Package");
  if (item.navigation?.nextDelivery) addError(errors, path, allIds.has(item.navigation.nextDelivery), "nextDelivery references unknown Package");
}

export async function loadDeliveryContent(rootDir) {
  const { contentDir, schemaPath } = getDeliveryContentPaths(rootDir); const errors = [];
  try { parseYaml(await readFile(schemaPath, "utf8")); } catch (error) { errors.push(`schema.yml: parse failure: ${error.message}`); }
  const files = (await readdir(contentDir)).filter((file) => file.endsWith(".md") && file !== "README.md").sort();
  if (files.length !== INVENTORY.length) errors.push(`expected ${INVENTORY.length} Delivery Package files, found ${files.length}`);
  const deliveries = []; const ids = new Set(); const routes = new Set();
  for (const file of files) {
    const raw = await readFile(resolve(contentDir, file), "utf8"); const match = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
    if (!match) { errors.push(`${file}: invalid YAML frontmatter delimiters`); continue; }
    try { const data = parseYaml(match[1]); const markdown = parseMarkdownSections(match[2]); if (data.name !== markdown.title) errors.push(`${file}: document title must match frontmatter name`); if (ids.has(data.id)) errors.push(`${file}: duplicate id ${data.id}`); if (routes.has(data.route)) errors.push(`${file}: duplicate route ${data.route}`); ids.add(data.id); routes.add(data.route); deliveries.push({ ...data, sections: markdown.sections, faq: markdown.faq, sourcePath: `static/content/deliveries/${file}` }); } catch (error) { errors.push(`${file}: parse failure: ${error.message}`); }
  }
  for (const [id] of INVENTORY) if (!ids.has(id)) errors.push(`missing expected Delivery Package ${id}`);
  const [products, projects] = await Promise.all([loadProductContent(rootDir), loadProjectContent(rootDir)]);
  if (products.errors.length) errors.push(...products.errors.map((error) => `Product prerequisite: ${error}`)); if (projects.errors.length) errors.push(...projects.errors.map((error) => `Project prerequisite: ${error}`));
  const productMap = new Map(products.products.map((product) => [product.id, product])); const projectMap = new Map(projects.projects.map((project) => [project.id, project]));
  for (const delivery of deliveries) { const raw = await readFile(resolve(contentDir, delivery.sourcePath.split("/").at(-1)), "utf8"); validateDelivery(delivery, raw, errors, productMap, projectMap, ids); }
  return { errors, deliveries };
}
export function buildGeneratedModule(deliveries) { return ['import type { AgencyDeliveryPackageContent } from "../delivery-content.types.js";', "", `export const agencyDeliveryPackages = ${JSON.stringify(deliveries, null, 2)} satisfies AgencyDeliveryPackageContent[];`, ""].join("\n"); }
export async function writeGeneratedModule(rootDir, deliveries) { const { generatedModulePath } = getDeliveryContentPaths(rootDir); await mkdir(resolve(generatedModulePath, ".."), { recursive: true }); await writeFile(generatedModulePath, buildGeneratedModule(deliveries), "utf8"); }
export async function generatedModuleHasDrift(rootDir, deliveries) { const { generatedModulePath } = getDeliveryContentPaths(rootDir); try { return (await readFile(generatedModulePath, "utf8")) !== buildGeneratedModule(deliveries); } catch { return true; } }
export { INVENTORY };
