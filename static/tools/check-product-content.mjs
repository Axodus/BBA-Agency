import { readFile, readdir } from "node:fs/promises";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const contentDir = resolve(root, "content/products");
const expected = [
  ["bba-publisher", "/services/publisher", "PROTOTYPE_AVAILABLE"],
  ["advertising-campaign", "/services/advertising", "PLANNED"],
  ["scientific-article", "/services/scientific-writing", "PLANNED"],
  ["governance-proposal", "/services/governance", "PLANNED"],
  ["market-research", "/services/research", "PLANNED"],
];
const sections = [
  "Overview", "The problem it addresses", "Who it is for", "What the customer provides",
  "What the Agency does", "How the product works", "Agent team", "Human review and control",
  "What the customer receives", "Example project", "Quality and traceability",
  "What the product does not do", "Availability", "Relationship to the BBA platform",
  "Frequently asked questions",
];
const markers = /\b(?:TODO|TBD|Lorem ipsum|Insert copy here|Coming later)\b/i;
const errors = [];
const requireFields = ["schemaVersion", "id", "name", "category", "slug", "route", "status", "eyebrow", "headline", "summary", "customerProblem", "customerOutcome", "primaryAudience", "contentLanguage", "applicationLanguage", "availability", "seo", "navigation", "relatedProducts", "keywords", "agentTeamStatus", "agentTeam", "workflow", "deliverables"];

function parseScalar(value) {
  if (value === "true") return true;
  if (value === "false") return false;
  if (value === "null") return null;
  if (/^\d+$/.test(value)) return Number(value);
  return value.replace(/^['"]|['"]$/g, "");
}

// Purpose-built parser for the restricted frontmatter shape documented in schema.yml.
function parseYaml(source) {
  const rootObject = {};
  const stack = [{ indent: -1, value: rootObject }];
  for (const raw of source.split("\n")) {
    if (!raw.trim() || raw.trimStart().startsWith("#")) continue;
    const indent = raw.length - raw.trimStart().length;
    const line = raw.trim();
    while (stack.at(-1).indent >= indent) stack.pop();
    const parent = stack.at(-1).value;
    if (line.startsWith("- ")) {
      if (!Array.isArray(parent)) throw new Error(`Unexpected list item: ${line}`);
      const item = line.slice(2);
      if (!item.includes(":")) { parent.push(parseScalar(item)); continue; }
      const object = {};
      parent.push(object);
      const [key, ...rest] = item.split(":");
      object[key] = parseScalar(rest.join(":").trim());
      stack.push({ indent, value: object });
      continue;
    }
    const colon = line.indexOf(":");
    if (colon < 1) throw new Error(`Invalid mapping: ${line}`);
    const key = line.slice(0, colon);
    const value = line.slice(colon + 1).trim();
    if (value) parent[key] = parseScalar(value);
    else {
      const next = source.split("\n").find((candidate) => candidate.startsWith(" ".repeat(indent + 2)) && candidate.trim());
      const container = next?.trim().startsWith("- ") ? [] : {};
      parent[key] = container;
      stack.push({ indent, value: container });
    }
  }
  return rootObject;
}

function validate(data, body, file, expectedEntry) {
  for (const field of requireFields) if (data[field] === undefined || data[field] === "") errors.push(`${file}: missing ${field}`);
  if (data.schemaVersion !== "1.0") errors.push(`${file}: unsupported schemaVersion`);
  if (!expectedEntry || data.route !== expectedEntry?.[1] || data.status !== expectedEntry?.[2]) errors.push(`${file}: ID, route, or status does not match inventory`);
  if (!['PROTOTYPE_AVAILABLE', 'PLANNED', 'CONCEPT_PREVIEW'].includes(data.availability?.code)) errors.push(`${file}: invalid availability code`);
  if (data.status !== data.availability?.code) errors.push(`${file}: status and availability.code differ`);
  if (data.availability?.operationalOnStaticSite !== false) errors.push(`${file}: static site must not be operational`);
  if (data.contentLanguage !== "English" || data.applicationLanguage !== "English") errors.push(`${file}: English must be declared`);
  if (!Array.isArray(data.workflow) || !data.workflow.length || !data.workflow.some((stage) => stage.checkpoint === true)) errors.push(`${file}: workflow needs a human checkpoint`);
  if (Array.isArray(data.workflow) && data.workflow.some((stage, index) => stage.order !== index + 1 || !stage.id || !stage.label || !stage.customerRole || !stage.agencyRole || !stage.expectedOutput)) errors.push(`${file}: invalid workflow stage order or shape`);
  if (!Array.isArray(data.deliverables) || !data.deliverables.length || data.deliverables.some((item) => !item.id || !item.name || !item.description || !Array.isArray(item.format) || typeof item.requiresApproval !== "boolean")) errors.push(`${file}: invalid deliverable shape`);
  if (!Array.isArray(data.agentTeam) || !data.agentTeam.length || data.agentTeam.some((role) => !role.id || !role.name || !role.responsibility || !role.stage)) errors.push(`${file}: invalid agent role shape`);
  if (data.status === "PLANNED" && (data.prototypeUrl || /(?:start|create|run|open) (?:this )?(?:project|service|campaign)/i.test(body))) errors.push(`${file}: planned product includes an operational CTA`);
  if (data.id === "bba-publisher" && (!data.prototypeUrl?.startsWith("https://dev.bba.country") || data.agentTeamStatus !== "PROTOTYPE_IMPLEMENTED")) errors.push(`${file}: Publisher prototype metadata is incomplete`);
  if (data.status === "PLANNED" && data.agentTeamStatus !== "CONCEPTUAL") errors.push(`${file}: planned agent team must be conceptual`);
  for (const heading of sections) if (!new RegExp(`^## ${heading}$`, "m").test(body)) errors.push(`${file}: missing section ${heading}`);
  const faqCount = (body.match(/^### /gm) ?? []).length;
  if (faqCount < 5) errors.push(`${file}: at least five FAQs required`);
  if (markers.test(`${sourceForMarker(data)}\n${body}`)) errors.push(`${file}: unresolved template marker`);
}
function sourceForMarker(data) { return JSON.stringify(data); }

const files = (await readdir(contentDir)).filter((file) => file.endsWith(".md") && file !== "README.md").sort();
if (files.length !== expected.length) errors.push(`expected ${expected.length} product files, found ${files.length}`);
const ids = new Set(); const routes = new Set();
for (const file of files) {
  const source = await readFile(resolve(contentDir, file), "utf8");
  const match = source.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) { errors.push(`${file}: invalid YAML frontmatter delimiters`); continue; }
  let data;
  try { data = parseYaml(match[1]); } catch (error) { errors.push(`${file}: frontmatter parse failure: ${error.message}`); continue; }
  if (ids.has(data.id)) errors.push(`${file}: duplicate id ${data.id}`); ids.add(data.id);
  if (routes.has(data.route)) errors.push(`${file}: duplicate route ${data.route}`); routes.add(data.route);
  validate(data, match[2], file, expected.find((entry) => entry[0] === data.id));
}
for (const [id] of expected) if (!ids.has(id)) errors.push(`missing expected product ${id}`);
if (errors.length) { console.error("Product content validation failed:\n" + errors.map((error) => `- ${error}`).join("\n")); process.exitCode = 1; }
else console.log(`Product content validation passed: ${files.length} files, schemaVersion 1.0.`);
