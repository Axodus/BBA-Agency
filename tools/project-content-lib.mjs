import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { loadProductContent } from "./product-content-lib.mjs";

export const PROJECT_SECTION_TITLES = [
  "Overview",
  "Customer objective",
  "Why this Project matters",
  "Context and materials",
  "Expected outcome",
  "How the Project is executed",
  "Agent team",
  "Human checkpoints",
  "Illustrative revision",
  "Deliverables and final Package",
  "Traceability",
  "Quality considerations",
  "Limitations",
  "Relationship to the functional platform",
  "Frequently asked questions",
];

const INVENTORY = [
  ["neurons-protocol-launch", "/projects/neurons-protocol-launch", "bba-publisher", "PROTOTYPE_BACKED", "Editorial Package"],
  ["responsible-ai-awareness-campaign", "/projects/responsible-ai-awareness-campaign", "advertising-campaign", "ILLUSTRATIVE_PLANNED", "Campaign Package"],
  ["ai-publishing-research-article", "/projects/ai-publishing-research-article", "scientific-article", "ILLUSTRATIVE_PLANNED", "Scientific Package"],
  ["ai-content-governance-proposal", "/projects/ai-content-governance-proposal", "governance-proposal", "ILLUSTRATIVE_PLANNED", "Institutional Package"],
  ["enterprise-ai-publishing-market-study", "/projects/enterprise-ai-publishing-market-study", "market-research", "ILLUSTRATIVE_PLANNED", "Research Package"],
];

const PROJECT_REQUIREMENTS = new Map([
  ["neurons-protocol-launch", {
    stages: ["Editorial Context received", "Context analyzed", "Editorial Core prepared", "Editorial Core approved", "Publication strategy developed", "Blog, LinkedIn, and Instagram content produced", "Semantic consistency reviewed", "Final Package reviewed", "Editorial Package delivered"],
    roles: ["Context Analyst", "Editorial Strategist", "Platform Adapter", "Semantic Consistency Reviewer", "Human Governance"],
  }],
  ["responsible-ai-awareness-campaign", {
    stages: ["Campaign Context received", "Audience and offer analyzed", "Positioning defined", "Campaign strategy prepared", "Creative concepts developed", "Channel plan composed", "Risk and consistency reviewed", "Creative direction selected", "Campaign Package delivered"],
    roles: ["Campaign Strategist", "Audience Analyst", "Positioning Analyst", "Creative Concept Developer", "Channel Planner", "Campaign Consistency Reviewer"],
  }],
  ["ai-publishing-research-article", {
    stages: ["Research Context received", "Evidence mapped", "Scope and argument confirmed", "Article structure prepared", "Manuscript drafted", "Citations and consistency reviewed", "Human scientific review performed", "Revisions incorporated", "Scientific Package delivered"],
    roles: ["Research Context Analyst", "Evidence Mapper", "Scientific Structure Editor", "Scientific Writer", "Citation Reviewer", "Consistency Reviewer"],
  }],
  ["ai-content-governance-proposal", {
    stages: ["Institutional Context received", "Problem framed", "Stakeholders analyzed", "Evidence and alternatives assessed", "Proposal composed", "Risks and impacts reviewed", "Human decision checkpoint", "Revisions incorporated", "Institutional Package delivered"],
    roles: ["Institutional Context Analyst", "Stakeholder Analyst", "Evidence Synthesizer", "Alternatives Analyst", "Proposal Writer", "Risk and Impact Reviewer"],
  }],
  ["enterprise-ai-publishing-market-study", {
    stages: ["Research Question received", "Scope and research plan defined", "Sources collected", "Market evidence analyzed", "Patterns and insights synthesized", "Recommendations reviewed", "Assumptions and limitations recorded", "Customer approval", "Research Package delivered"],
    roles: ["Research Planner", "Source Analyst", "Market Analyst", "Competitor Analyst", "Insight Synthesizer", "Recommendation Reviewer"],
  }],
]);

const REQUIRED_FIELDS = [
  "schemaVersion", "id", "name", "slug", "route", "productId", "productName", "productRoute", "category", "exampleStatus", "packageName", "eyebrow", "headline", "summary", "customerObjective", "customerOutcome", "audience", "contentLanguage", "applicationLanguage", "availability", "prototype", "seo", "navigation", "relatedProductId", "keywords", "context", "expectedOutcome", "workflow", "agentTeam", "humanDecisions", "revisionExample", "deliverables", "traceability", "limitations",
];
const PLACEHOLDER_MARKERS = /\b(?:TODO|TBD|Lorem ipsum|Insert content|Placeholder|Coming later)\b/i;
const OPERATIONAL_METADATA_MARKERS = /^(?:cta|action|endpoint|apiEndpoint|form|submitAction|persistence):/m;

export function getProjectContentPaths(rootDir) {
  const contentDir = resolve(rootDir, "content/projects");
  return {
    contentDir,
    schemaPath: resolve(contentDir, "schema.yml"),
    generatedModulePath: resolve(rootDir, "src/content/projects/generated/project-content.generated.ts"),
  };
}

function parseScalar(value) {
  if (value === "true") return true;
  if (value === "false") return false;
  if (value === "null") return null;
  if (/^\d+$/.test(value)) return Number(value);
  return value.replace(/^['"]|['"]$/g, "");
}

export function parseYaml(source) {
  const lines = source.split("\n");
  const root = {};
  const stack = [{ indent: -1, value: root }];

  for (let index = 0; index < lines.length; index += 1) {
    const raw = lines[index];
    if (!raw.trim() || raw.trimStart().startsWith("#")) continue;
    const indent = raw.length - raw.trimStart().length;
    const line = raw.trim();

    while (stack.at(-1).indent >= indent) stack.pop();
    const parent = stack.at(-1).value;

    if (line.startsWith("- ")) {
      if (!Array.isArray(parent)) throw new Error(`Unexpected list item: ${line}`);
      const item = line.slice(2);
      if (!item.includes(":")) {
        parent.push(parseScalar(item));
        continue;
      }
      const object = {};
      parent.push(object);
      const colon = item.indexOf(":");
      object[item.slice(0, colon)] = parseScalar(item.slice(colon + 1).trim());
      stack.push({ indent, value: object });
      continue;
    }

    const colon = line.indexOf(":");
    if (colon < 1) throw new Error(`Invalid mapping: ${line}`);
    const key = line.slice(0, colon);
    const value = line.slice(colon + 1).trim();
    if (value) {
      parent[key] = parseScalar(value);
      continue;
    }

    const next = lines.slice(index + 1).find((candidate) =>
      candidate.startsWith(" ".repeat(indent + 2)) && candidate.trim() && !candidate.trimStart().startsWith("#"),
    );
    const container = next?.trim().startsWith("- ") ? [] : {};
    parent[key] = container;
    stack.push({ indent, value: container });
  }

  return root;
}

function parseMarkdownSections(body) {
  const title = body.match(/^# (.+)$/m)?.[1]?.trim();
  if (!title) throw new Error("Missing Project document title");
  const matches = [...body.matchAll(/^## (.+)$/gm)];
  const sections = {};

  for (let index = 0; index < matches.length; index += 1) {
    const current = matches[index];
    const next = matches[index + 1];
    const sectionTitle = current[1].trim();
    const start = (current.index ?? 0) + current[0].length;
    const end = next?.index ?? body.length;
    sections[sectionTitle] = { title: sectionTitle, body: body.slice(start, end).trim() };
  }

  const faqBody = sections["Frequently asked questions"]?.body ?? "";
  const faqMatches = [...faqBody.matchAll(/^### (.+)$/gm)];
  const faq = faqMatches.map((current, index) => {
    const next = faqMatches[index + 1];
    const start = (current.index ?? 0) + current[0].length;
    const end = next?.index ?? faqBody.length;
    return { question: current[1].trim(), answer: faqBody.slice(start, end).trim() };
  });

  return { title, sections, faq };
}

function addError(errors, sourcePath, condition, message) {
  if (!condition) errors.push(`${sourcePath}: ${message}`);
}

function hasText(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function validateProject(project, rawSource, errors, productMap, allIds) {
  const expected = INVENTORY.find(([id]) => id === project.id);
  const expectedIndex = INVENTORY.findIndex(([id]) => id === project.id);
  const path = project.sourcePath;
  for (const field of REQUIRED_FIELDS) addError(errors, path, project[field] !== undefined && project[field] !== "", `missing ${field}`);
  addError(errors, path, project.schemaVersion === "1.0", "unsupported schemaVersion");
  addError(errors, path, project.slug === project.id, "slug must match id");
  addError(errors, path, expected && project.route === expected[1] && project.productId === expected[2] && project.exampleStatus === expected[3] && project.packageName === expected[4], "ID, route, product, status, or Package does not match inventory");
  addError(errors, path, project.availability?.code === project.exampleStatus && project.availability?.operationalOnStaticSite === false, "availability must match a non-operational example status");
  addError(errors, path, project.contentLanguage === "English" && project.applicationLanguage === "English", "English must be declared as canonical and application language");
  addError(errors, path, project.seo?.canonicalPath === project.route, "SEO canonicalPath must match route");
  addError(errors, path, project.relatedProductId === project.productId, "relatedProductId must match productId");
  if (expectedIndex >= 0) {
    const expectedPrevious = expectedIndex === 0 ? null : INVENTORY[expectedIndex - 1][0];
    const expectedNext = expectedIndex === INVENTORY.length - 1 ? null : INVENTORY[expectedIndex + 1][0];
    addError(errors, path, project.navigation?.previousProject === expectedPrevious && project.navigation?.nextProject === expectedNext, "navigation must follow the canonical Project order");
  }
  addError(errors, path, Array.isArray(project.audience) && project.audience.length > 0, "audience must contain at least one entry");
  addError(errors, path, Array.isArray(project.keywords) && project.keywords.length > 0, "keywords must contain at least one entry");

  const product = productMap.get(project.productId);
  addError(errors, path, product, `unknown canonical Product ${project.productId}`);
  if (product) {
    addError(errors, path, project.productName === product.name && project.productRoute === product.route, "Product name or route does not match canonical Product content");
  }

  if (project.exampleStatus === "PROTOTYPE_BACKED") {
    addError(errors, path, project.productId === "bba-publisher", "only BBA Publisher may be prototype-backed");
    addError(errors, path, project.prototype?.available === true && project.prototype?.url?.startsWith("https://dev.bba.country") && /functional BBA Publisher prototype/i.test(project.prototype?.disclosure ?? ""), "Publisher prototype metadata is incomplete");
    addError(errors, path, project.agentTeam?.status === "PROTOTYPE_IMPLEMENTED", "Publisher team must be prototype implemented");
  } else {
    addError(errors, path, project.prototype?.available === false && /planned BBA Agency Product\. It does not represent an operational implementation\./i.test(project.prototype?.disclosure ?? ""), "planned example disclosure is incomplete");
    addError(errors, path, project.agentTeam?.status === "CONCEPTUAL", "planned Project team must be conceptual");
  }

  const context = project.context ?? {};
  addError(errors, path, hasText(context.summary), "context summary is required");
  addError(errors, path, Array.isArray(context.materials) && context.materials.length > 0, "context needs materials");
  addError(errors, path, Array.isArray(context.trustedFacts) && context.trustedFacts.length > 0, "context needs trusted facts");
  addError(errors, path, Array.isArray(context.constraints) && context.constraints.length > 0, "context needs constraints");
  const materialIds = new Set((context.materials ?? []).map((item) => item.id));
  addError(errors, path, (context.materials ?? []).every((item) => item.id && item.name && item.type && item.description), "invalid context material");
  addError(errors, path, (context.trustedFacts ?? []).every((fact) => fact.id && fact.statement && materialIds.has(fact.sourceReference)), "trusted facts must reference declared materials");

  const stages = project.workflow ?? [];
  addError(errors, path, Array.isArray(stages) && stages.length > 0, "workflow must contain stages");
  const stageIds = new Set(stages.map((stage) => stage.id));
  addError(errors, path, stageIds.size === stages.length, "workflow stage IDs must be unique");
  addError(errors, path, stages.every((stage, index) => stage.order === index + 1 && stage.id && stage.label && stage.objective && stage.agencyActivity && stage.customerInvolvement && Array.isArray(stage.agentRoleIds) && Array.isArray(stage.artifactIds) && typeof stage.humanCheckpoint === "boolean"), "invalid workflow stage order or shape");
  const requirement = PROJECT_REQUIREMENTS.get(project.id);
  if (requirement) {
    addError(errors, path, requirement.stages.every((label, index) => stages[index]?.label === label), "workflow does not match required product-specific stage sequence");
  }

  const deliverables = project.deliverables ?? [];
  const artifactIds = new Set(deliverables.map((item) => item.id));
  addError(errors, path, Array.isArray(deliverables) && deliverables.length > 0 && artifactIds.size === deliverables.length, "deliverables must exist with unique IDs");
  addError(errors, path, deliverables.every((item) => item.id && item.name && item.description && item.purpose && Array.isArray(item.format) && item.format.length > 0 && typeof item.requiresApproval === "boolean" && typeof item.includedInFinalPackage === "boolean"), "invalid deliverable shape");

  const roles = project.agentTeam?.roles ?? [];
  const roleIds = new Set(roles.map((role) => role.id));
  addError(errors, path, Array.isArray(roles) && roles.length > 0 && roleIds.size === roles.length, "agent roles must exist with unique IDs");
  addError(errors, path, roles.every((role) => role.id && role.name && role.responsibility && role.stageIds.every((id) => stageIds.has(id)) && role.artifactIds.every((id) => artifactIds.has(id))), "agent-role references must resolve");
  if (requirement) {
    const roleNames = new Set(roles.map((role) => role.name));
    addError(errors, path, requirement.roles.every((name) => roleNames.has(name)), "required product-specific agent roles are missing");
  }
  addError(errors, path, stages.every((stage) => stage.agentRoleIds.every((id) => roleIds.has(id)) && stage.artifactIds.every((id) => artifactIds.has(id))), "workflow role or artifact references must resolve");

  const decisions = project.humanDecisions ?? [];
  const decisionIds = new Set(decisions.map((decision) => decision.id));
  addError(errors, path, Array.isArray(decisions) && decisions.length >= 2 && decisionIds.size === decisions.length, "at least two unique human decisions are required");
  addError(errors, path, decisions.every((decision) => decision.id && decision.name && stageIds.has(decision.stageId) && decision.purpose && Array.isArray(decision.availableResponses) && decision.availableResponses.length >= 2 && decision.effect), "human-decision references or shape are invalid");
  addError(errors, path, stages.filter((stage) => stage.humanCheckpoint).every((stage) => decisionIds.has(stage.decisionId)), "each human checkpoint must reference a decision");

  const outcome = project.expectedOutcome ?? {};
  addError(errors, path, hasText(outcome.description) && outcome.packageName === project.packageName, "expected outcome is incomplete or package mismatch");
  addError(errors, path, (outcome.deliverableIds ?? []).length > 0 && outcome.deliverableIds.every((id) => artifactIds.has(id)), "expected outcome deliverable references must resolve");
  addError(errors, path, (outcome.checkpointIds ?? []).length >= 2 && outcome.checkpointIds.every((id) => decisionIds.has(id)), "expected outcome checkpoint references must resolve");

  const revision = project.revisionExample ?? {};
  addError(errors, path, hasText(revision.title) && hasText(revision.request) && hasText(revision.reason) && hasText(revision.resultingVersion) && hasText(revision.traceabilityNote), "revision example is incomplete");
  addError(errors, path, (revision.affectedArtifactIds ?? []).length > 0 && revision.affectedArtifactIds.every((id) => artifactIds.has(id)) && revision.repeatedStageIds.every((id) => stageIds.has(id)) && revision.preservedArtifactIds.every((id) => artifactIds.has(id)), "revision references must resolve");

  const traceability = project.traceability ?? [];
  addError(errors, path, Array.isArray(traceability) && traceability.length > 0, "traceability records are required");
  addError(errors, path, traceability.every((record) => record.id && materialIds.has(record.sourceReference) && record.contextItem && stageIds.has(record.workflowStageId) && roleIds.has(record.agentRoleId) && artifactIds.has(record.artifactId) && record.artifactVersion && decisionIds.has(record.decisionId) && record.rationale), "traceability references must resolve");
  addError(errors, path, Array.isArray(project.limitations) && project.limitations.length > 0, "limitations are required");

  for (const title of PROJECT_SECTION_TITLES) addError(errors, path, hasText(project.sections?.[title]?.body), `missing or empty Markdown section ${title}`);
  addError(errors, path, project.faq?.length >= 5 && project.faq.every((item) => item.question && item.answer), "at least five complete FAQs are required");
  addError(errors, path, !PLACEHOLDER_MARKERS.test(rawSource), "unresolved template marker");
  addError(errors, path, !OPERATIONAL_METADATA_MARKERS.test(rawSource), "operational action metadata is not allowed in Project content");
}

export async function loadProjectContent(rootDir) {
  const { contentDir, schemaPath } = getProjectContentPaths(rootDir);
  const errors = [];
  try {
    parseYaml(await readFile(schemaPath, "utf8"));
  } catch (error) {
    errors.push(`schema.yml: parse failure: ${error.message}`);
  }

  const files = (await readdir(contentDir)).filter((file) => file.endsWith(".md") && file !== "README.md").sort();
  if (files.length !== INVENTORY.length) errors.push(`expected ${INVENTORY.length} Project files, found ${files.length}`);

  const projects = [];
  const ids = new Set();
  const routes = new Set();
  for (const file of files) {
    const source = await readFile(resolve(contentDir, file), "utf8");
    const match = source.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
    if (!match) {
      errors.push(`${file}: invalid YAML frontmatter delimiters`);
      continue;
    }
    try {
      const data = parseYaml(match[1]);
      const markdown = parseMarkdownSections(match[2]);
      if (data.name !== markdown.title) errors.push(`${file}: document title must match frontmatter name`);
      if (ids.has(data.id)) errors.push(`${file}: duplicate id ${data.id}`);
      if (routes.has(data.route)) errors.push(`${file}: duplicate route ${data.route}`);
      ids.add(data.id);
      routes.add(data.route);
      projects.push({ ...data, sections: markdown.sections, faq: markdown.faq, sourcePath: `static/content/projects/${file}` });
    } catch (error) {
      errors.push(`${file}: parse failure: ${error.message}`);
    }
  }

  for (const [id] of INVENTORY) if (!ids.has(id)) errors.push(`missing expected Project ${id}`);
  const productResult = await loadProductContent(rootDir);
  if (productResult.errors.length > 0) errors.push(...productResult.errors.map((error) => `product reference prerequisite: ${error}`));
  const productMap = new Map(productResult.products.map((product) => [product.id, product]));
  const allIds = new Set(projects.map((project) => project.id));
  for (const project of projects) {
    const rawSource = await readFile(resolve(contentDir, project.sourcePath.split("/").at(-1)), "utf8");
    validateProject(project, rawSource, errors, productMap, allIds);
    if (project.navigation?.previousProject && !allIds.has(project.navigation.previousProject)) errors.push(`${project.sourcePath}: previousProject references an unknown Project`);
    if (project.navigation?.nextProject && !allIds.has(project.navigation.nextProject)) errors.push(`${project.sourcePath}: nextProject references an unknown Project`);
  }
  return { errors, projects };
}

export function buildGeneratedModule(projects) {
  return [
    'import type { AgencyProjectContent } from "../project-content.types.js";',
    "",
    `export const agencyProjects = ${JSON.stringify(projects, null, 2)} satisfies AgencyProjectContent[];`,
    "",
  ].join("\n");
}

export async function writeGeneratedModule(rootDir, projects) {
  const { generatedModulePath } = getProjectContentPaths(rootDir);
  await mkdir(resolve(generatedModulePath, ".."), { recursive: true });
  await writeFile(generatedModulePath, buildGeneratedModule(projects), "utf8");
}

export { INVENTORY };
