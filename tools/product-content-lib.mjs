import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

export const PRODUCT_SECTION_MAP = new Map([
  ["Overview", "overview"],
  ["The problem it addresses", "problem"],
  ["Who it is for", "audience"],
  ["What the customer provides", "customerInputs"],
  ["What the Agency does", "agencyWork"],
  ["How the product works", "productWorkflow"],
  ["Agent team", "agentTeam"],
  ["Human review and control", "humanReview"],
  ["What the customer receives", "customerReceives"],
  ["Example project", "exampleProject"],
  ["Quality and traceability", "qualityTraceability"],
  ["What the product does not do", "limitations"],
  ["Availability", "availability"],
  ["Relationship to the BBA platform", "platformRelationship"],
  ["Frequently asked questions", "faq"],
]);

const INVENTORY = [
  ["bba-publisher", "/services/publisher", "PROTOTYPE_AVAILABLE"],
  ["advertising-campaign", "/services/advertising", "PLANNED"],
  ["scientific-article", "/services/scientific-writing", "PLANNED"],
  ["governance-proposal", "/services/governance", "PLANNED"],
  ["market-research", "/services/research", "PLANNED"],
];

const REQUIRED_FIELDS = [
  "schemaVersion",
  "id",
  "name",
  "category",
  "slug",
  "route",
  "status",
  "eyebrow",
  "headline",
  "summary",
  "customerProblem",
  "customerOutcome",
  "primaryAudience",
  "contentLanguage",
  "applicationLanguage",
  "availability",
  "seo",
  "navigation",
  "relatedProducts",
  "keywords",
  "agentTeamStatus",
  "agentTeam",
  "workflow",
  "deliverables",
];

const PLACEHOLDER_MARKERS = /\b(?:TODO|TBD|Lorem ipsum|Insert copy here|Coming later)\b/i;
const OPERATIONAL_CTA_MARKERS =
  /\b(?:start|create|launch|run|configure|try|open)\b.{0,18}\b(?:project|service|campaign|product)\b/i;
const SUPPORTED_AVAILABILITY = ["PROTOTYPE_AVAILABLE", "PLANNED", "CONCEPT_PREVIEW"];

export function getProductContentPaths(rootDir) {
  const contentDir = resolve(rootDir, "content/products");
  return {
    contentDir,
    generatedModulePath: resolve(
      rootDir,
      "src/content/products/generated/product-content.generated.ts",
    ),
    schemaPath: resolve(contentDir, "schema.yml"),
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
  const rootObject = {};
  const stack = [{ indent: -1, value: rootObject }];

  for (let index = 0; index < lines.length; index += 1) {
    const raw = lines[index];
    if (!raw.trim() || raw.trimStart().startsWith("#")) continue;
    const indent = raw.length - raw.trimStart().length;
    const line = raw.trim();

    while (stack.at(-1).indent >= indent) stack.pop();
    const parent = stack.at(-1).value;

    if (line.startsWith("- ")) {
      if (!Array.isArray(parent)) {
        throw new Error(`Unexpected list item: ${line}`);
      }
      const item = line.slice(2);
      if (!item.includes(":")) {
        parent.push(parseScalar(item));
        continue;
      }
      const object = {};
      parent.push(object);
      const [key, ...rest] = item.split(":");
      object[key] = parseScalar(rest.join(":").trim());
      stack.push({ indent, value: object });
      continue;
    }

    const colon = line.indexOf(":");
    if (colon < 1) {
      throw new Error(`Invalid mapping: ${line}`);
    }

    const key = line.slice(0, colon);
    const value = line.slice(colon + 1).trim();

    if (value) {
      parent[key] = parseScalar(value);
      continue;
    }

    const next = lines
      .slice(index + 1)
      .find((candidate) => candidate.startsWith(" ".repeat(indent + 2)) && candidate.trim());
    const container = next?.trim().startsWith("- ") ? [] : {};
    parent[key] = container;
    stack.push({ indent, value: container });
  }

  return rootObject;
}

function parseInlineMarkdown(source) {
  const tokens = [];
  const pattern = /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g;
  let cursor = 0;

  for (const match of source.matchAll(pattern)) {
    const [value] = match;
    const index = match.index ?? 0;
    if (index > cursor) {
      tokens.push({ type: "text", value: source.slice(cursor, index) });
    }

    if (value.startsWith("**")) {
      tokens.push({ type: "strong", value: value.slice(2, -2) });
    } else if (value.startsWith("*")) {
      tokens.push({ type: "emphasis", value: value.slice(1, -1) });
    } else if (value.startsWith("`")) {
      tokens.push({ type: "code", value: value.slice(1, -1) });
    } else {
      const linkMatch = value.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
      if (linkMatch) {
        tokens.push({ type: "link", value: linkMatch[1], href: linkMatch[2] });
      } else {
        tokens.push({ type: "text", value });
      }
    }

    cursor = index + value.length;
  }

  if (cursor < source.length) {
    tokens.push({ type: "text", value: source.slice(cursor) });
  }

  return tokens.filter((token) => token.value.length > 0);
}

function splitTableRow(line) {
  return line
    .trim()
    .replace(/^\||\|$/g, "")
    .split("|")
    .map((cell) => parseInlineMarkdown(cell.trim()));
}

function isTableDivider(line) {
  return /^\|(?:\s*:?-+:?\s*\|)+$/.test(line.trim());
}

function parseBlocks(sectionBody) {
  const lines = sectionBody.trim().split("\n");
  const blocks = [];
  let index = 0;

  while (index < lines.length) {
    const raw = lines[index] ?? "";
    const line = raw.trim();

    if (!line) {
      index += 1;
      continue;
    }

    if (line.startsWith("```")) {
      throw new Error("Code fences are not supported in product content");
    }
    if (/^#### /.test(line)) {
      throw new Error("Heading levels deeper than FAQ questions are not supported");
    }
    if (/<[a-z][\s\S]*>/i.test(line)) {
      throw new Error("Raw HTML is not supported in product content");
    }

    if (line.startsWith("> ")) {
      const parts = [];
      while (index < lines.length && lines[index].trim().startsWith("> ")) {
        parts.push(lines[index].trim().slice(2));
        index += 1;
      }
      blocks.push({
        type: "blockquote",
        content: parseInlineMarkdown(parts.join(" ")),
      });
      continue;
    }

    if (line.startsWith("|") && index + 1 < lines.length && isTableDivider(lines[index + 1])) {
      const headers = splitTableRow(line);
      index += 2;
      const rows = [];
      while (index < lines.length && lines[index].trim().startsWith("|")) {
        rows.push(splitTableRow(lines[index]));
        index += 1;
      }
      blocks.push({ type: "table", headers, rows });
      continue;
    }

    const orderedMatch = line.match(/^(\d+)\.\s+/);
    const unorderedMatch = line.match(/^[-*]\s+/);
    if (orderedMatch || unorderedMatch) {
      const ordered = Boolean(orderedMatch);
      const items = [];
      while (index < lines.length) {
        const candidate = lines[index].trim();
        const matcher = ordered ? /^(\d+)\.\s+/ : /^[-*]\s+/;
        if (!matcher.test(candidate)) break;
        items.push(parseInlineMarkdown(candidate.replace(matcher, "")));
        index += 1;
      }
      blocks.push({ type: "list", ordered, items });
      continue;
    }

    const paragraph = [line];
    index += 1;
    while (index < lines.length) {
      const candidate = lines[index].trim();
      if (
        !candidate ||
        candidate.startsWith("> ") ||
        candidate.startsWith("|") ||
        candidate.startsWith("```") ||
        /^[-*]\s+/.test(candidate) ||
        /^\d+\.\s+/.test(candidate) ||
        /^### /.test(candidate) ||
        /^## /.test(candidate)
      ) {
        break;
      }
      paragraph.push(candidate);
      index += 1;
    }

    blocks.push({
      type: "paragraph",
      content: parseInlineMarkdown(paragraph.join(" ")),
    });
  }

  return blocks;
}

function extractFaqBlocks(source) {
  const entries = [];
  const matches = [...source.matchAll(/^### (.+)$/gm)];

  for (let index = 0; index < matches.length; index += 1) {
    const current = matches[index];
    const next = matches[index + 1];
    const start = (current.index ?? 0) + current[0].length;
    const end = next?.index ?? source.length;
    const body = source.slice(start, end).trim();
    entries.push({
      question: current[1].trim(),
      answer: parseBlocks(body),
    });
  }

  return entries;
}

export function parseMarkdownSections(body) {
  const rootHeadingMatch = body.match(/^# (.+)$/m);
  if (!rootHeadingMatch) {
    throw new Error("Missing product document title");
  }

  const sectionMatches = [...body.matchAll(/^## (.+)$/gm)];
  const sections = {};

  for (let index = 0; index < sectionMatches.length; index += 1) {
    const current = sectionMatches[index];
    const next = sectionMatches[index + 1];
    const title = current[1].trim();
    const key = PRODUCT_SECTION_MAP.get(title);

    if (!key) {
      throw new Error(`Unsupported section heading: ${title}`);
    }

    const start = (current.index ?? 0) + current[0].length;
    const end = next?.index ?? body.length;
    const sectionBody = body.slice(start, end).trim();

    sections[key] = key === "faq"
      ? extractFaqBlocks(sectionBody)
      : { title, blocks: parseBlocks(sectionBody) };
  }

  return {
    title: rootHeadingMatch[1].trim(),
    sections,
  };
}

function normalizeProduct(data, parsedMarkdown, file) {
  return {
    ...data,
    routeSegment: data.route.replace(/^\/services\//, ""),
    sourcePath: `static/content/products/${file}`,
    sections: parsedMarkdown.sections,
  };
}

function validateSections(file, sections, errors) {
  for (const [title, key] of PRODUCT_SECTION_MAP.entries()) {
    const value = sections[key];
    if (!value || (Array.isArray(value) ? value.length === 0 : value.blocks.length === 0)) {
      errors.push(`${file}: missing section ${title}`);
    }
  }
  if ((sections.faq?.length ?? 0) < 5) {
    errors.push(`${file}: at least five FAQs required`);
  }
}

function validateProduct(product, sourceBody, errors, allIds) {
  const expected = INVENTORY.find((entry) => entry[0] === product.id);

  for (const field of REQUIRED_FIELDS) {
    if (product[field] === undefined || product[field] === "") {
      errors.push(`${product.sourcePath}: missing ${field}`);
    }
  }

  if (!expected || product.route !== expected[1] || product.status !== expected[2]) {
    errors.push(`${product.sourcePath}: ID, route, or status does not match inventory`);
  }
  if (product.schemaVersion !== "1.0") {
    errors.push(`${product.sourcePath}: unsupported schemaVersion`);
  }
  if (!SUPPORTED_AVAILABILITY.includes(product.availability?.code)) {
    errors.push(`${product.sourcePath}: invalid availability code`);
  }
  if (product.status !== product.availability?.code) {
    errors.push(`${product.sourcePath}: status and availability.code differ`);
  }
  if (product.availability?.operationalOnStaticSite !== false) {
    errors.push(`${product.sourcePath}: static site must not be operational`);
  }
  if (product.contentLanguage !== "English" || product.applicationLanguage !== "English") {
    errors.push(`${product.sourcePath}: English must be declared`);
  }
  if (!Array.isArray(product.primaryAudience) || product.primaryAudience.length === 0) {
    errors.push(`${product.sourcePath}: primaryAudience must contain at least one entry`);
  }
  if (!Array.isArray(product.workflow) || product.workflow.length === 0) {
    errors.push(`${product.sourcePath}: workflow must contain at least one stage`);
  } else {
    const hasCheckpoint = product.workflow.some((stage) => stage.checkpoint === true);
    if (!hasCheckpoint) {
      errors.push(`${product.sourcePath}: workflow needs a human checkpoint`);
    }
    if (
      product.workflow.some(
        (stage, index) =>
          stage.order !== index + 1 ||
          !stage.id ||
          !stage.label ||
          !stage.customerRole ||
          !stage.agencyRole ||
          !stage.expectedOutput,
      )
    ) {
      errors.push(`${product.sourcePath}: invalid workflow stage order or shape`);
    }
  }
  if (
    !Array.isArray(product.deliverables) ||
    product.deliverables.length === 0 ||
    product.deliverables.some(
      (item) =>
        !item.id ||
        !item.name ||
        !item.description ||
        !Array.isArray(item.format) ||
        typeof item.requiresApproval !== "boolean",
    )
  ) {
    errors.push(`${product.sourcePath}: invalid deliverable shape`);
  }
  if (
    !Array.isArray(product.agentTeam) ||
    product.agentTeam.length === 0 ||
    product.agentTeam.some((role) => !role.id || !role.name || !role.responsibility || !role.stage)
  ) {
    errors.push(`${product.sourcePath}: invalid agent role shape`);
  }
  if (PLACEHOLDER_MARKERS.test(`${JSON.stringify(product)}\n${sourceBody}`)) {
    errors.push(`${product.sourcePath}: unresolved template marker`);
  }
  if (product.status === "PLANNED" && (product.prototypeUrl || OPERATIONAL_CTA_MARKERS.test(sourceBody))) {
    errors.push(`${product.sourcePath}: planned product includes an operational CTA`);
  }
  if (
    product.id === "bba-publisher" &&
    (!product.prototypeUrl?.startsWith("https://dev.bba.country") ||
      product.agentTeamStatus !== "PROTOTYPE_IMPLEMENTED")
  ) {
    errors.push(`${product.sourcePath}: Publisher prototype metadata is incomplete`);
  }
  if (product.status === "PLANNED" && product.agentTeamStatus !== "CONCEPTUAL") {
    errors.push(`${product.sourcePath}: planned agent team must be conceptual`);
  }
  if (!allIds.has(product.id)) {
    errors.push(`${product.sourcePath}: unresolved product identifier`);
  }
  if (product.navigation.previousProduct && !allIds.has(product.navigation.previousProduct)) {
    errors.push(`${product.sourcePath}: previousProduct references an unknown product`);
  }
  if (product.navigation.nextProduct && !allIds.has(product.navigation.nextProduct)) {
    errors.push(`${product.sourcePath}: nextProduct references an unknown product`);
  }
  if (product.relatedProducts.some((relatedId) => !allIds.has(relatedId))) {
    errors.push(`${product.sourcePath}: relatedProducts contains an unknown product`);
  }
  validateSections(product.sourcePath, product.sections, errors);
}

export async function loadProductContent(rootDir) {
  const { contentDir } = getProductContentPaths(rootDir);
  const files = (await readdir(contentDir))
    .filter((file) => file.endsWith(".md") && file !== "README.md")
    .sort();

  const errors = [];
  if (files.length !== INVENTORY.length) {
    errors.push(`expected ${INVENTORY.length} product files, found ${files.length}`);
  }

  const products = [];
  const ids = new Set();
  const routes = new Set();

  for (const file of files) {
    const source = await readFile(resolve(contentDir, file), "utf8");
    const match = source.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
    if (!match) {
      errors.push(`${file}: invalid YAML frontmatter delimiters`);
      continue;
    }

    let data;
    let parsedMarkdown;
    try {
      data = parseYaml(match[1]);
    } catch (error) {
      errors.push(`${file}: frontmatter parse failure: ${error.message}`);
      continue;
    }

    try {
      parsedMarkdown = parseMarkdownSections(match[2]);
    } catch (error) {
      errors.push(`${file}: markdown parse failure: ${error.message}`);
      continue;
    }

    if (parsedMarkdown.title !== data.name) {
      errors.push(`${file}: document title must match frontmatter name`);
    }
    if (ids.has(data.id)) {
      errors.push(`${file}: duplicate id ${data.id}`);
    }
    if (routes.has(data.route)) {
      errors.push(`${file}: duplicate route ${data.route}`);
    }

    ids.add(data.id);
    routes.add(data.route);
    products.push(normalizeProduct(data, parsedMarkdown, file));
  }

  for (const [id] of INVENTORY) {
    if (!ids.has(id)) {
      errors.push(`missing expected product ${id}`);
    }
  }

  const allIds = new Set(products.map((product) => product.id));
  for (const product of products) {
    const rawSource = await readFile(resolve(contentDir, product.sourcePath.split("/").at(-1)), "utf8");
    validateProduct(product, rawSource, errors, allIds);
  }

  return { errors, products };
}

export function buildGeneratedModule(products) {
  return [
    'import type { AgencyProductContent } from "../product-content.types.js";',
    "",
    `export const agencyProducts = ${JSON.stringify(products, null, 2)} satisfies AgencyProductContent[];`,
    "",
  ].join("\n");
}

export async function writeGeneratedModule(rootDir, products) {
  const { generatedModulePath } = getProductContentPaths(rootDir);
  await mkdir(resolve(generatedModulePath, ".."), { recursive: true });
  await writeFile(generatedModulePath, buildGeneratedModule(products), "utf8");
}
