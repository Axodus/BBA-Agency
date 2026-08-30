import { agencyDeliveryPackages } from "./content/deliveries/index.js";
import { agencyProducts } from "./content/products/index.js";
import { agencyProjects } from "./content/projects/index.js";

type JsonSchema = Record<string, unknown>;

type WebMcpTool = {
  readonly name: string;
  readonly description: string;
  readonly inputSchema: JsonSchema;
  readonly annotations?: {
    readonly readOnlyHint?: boolean;
    readonly untrustedContentHint?: boolean;
  };
  readonly execute: (input: Record<string, unknown>) => Promise<string>;
};

type ModelContext = {
  registerTool: (tool: WebMcpTool) => Promise<unknown>;
};

type WebMcpDocument = Document & {
  modelContext?: ModelContext;
};

const FIXED_PAGES = [
  {
    route: "/",
    title: "BBA Agency home",
    description: "Overview of the informational BBA Agency reference website.",
  },
  {
    route: "/services",
    title: "Products",
    description: "BBA Agency Product catalog and scope.",
  },
  {
    route: "/projects",
    title: "Project examples",
    description: "Illustrative, non-operational Project examples.",
  },
  {
    route: "/deliveries",
    title: "Delivery Packages",
    description: "Illustrative Package contents, review, and traceability.",
  },
  {
    route: "/ai-models",
    title: "AI models and privacy",
    description: "Informational explanation of execution-model options.",
  },
] as const;

const SITE_PAGES = [
  ...FIXED_PAGES,
  ...agencyProducts.map((product) => ({
    route: product.route,
    title: product.name,
    description: product.summary,
  })),
  ...agencyProjects.map((project) => ({
    route: project.route,
    title: project.name,
    description: project.summary,
  })),
  ...agencyDeliveryPackages.map((deliveryPackage) => ({
    route: deliveryPackage.route,
    title: deliveryPackage.name,
    description: deliveryPackage.summary,
  })),
];

const PUBLIC_ROUTES = SITE_PAGES.map((page) => page.route);
const PUBLIC_ROUTE_SET = new Set(PUBLIC_ROUTES);

function getModelContext(): ModelContext | undefined {
  const modelContext = (document as WebMcpDocument).modelContext;
  return typeof modelContext?.registerTool === "function" ? modelContext : undefined;
}

function assertPublicRoute(value: unknown): asserts value is string {
  if (typeof value !== "string" || !PUBLIC_ROUTE_SET.has(value)) {
    throw new Error("Select a canonical public BBA Agency route from the tool schema.");
  }
}

export async function registerWebMcpTools() {
  const modelContext = getModelContext();
  if (!modelContext) return;

  const siteMapTool: WebMcpTool = {
    name: "get_bba_site_map",
    description:
      "Returns the canonical public pages of the BBA Agency informational reference website, including Products, illustrative Project examples, and Delivery Packages.",
    inputSchema: {
      type: "object",
      properties: {},
      additionalProperties: false,
    },
    annotations: { readOnlyHint: true },
    execute: async () =>
      JSON.stringify({
        websiteType: "informational reference website",
        currentRoute: window.location.pathname,
        limitations: [
          "This website does not create Projects, retain customer data, execute external Connectors, or publish externally.",
          "Project examples and Delivery Packages are illustrative unless explicitly described as a separately hosted prototype experience.",
        ],
        pages: SITE_PAGES,
      }),
  };

  const navigateTool: WebMcpTool = {
    name: "open_bba_information_page",
    description:
      "Navigates visibly to a canonical public BBA Agency informational page. It does not create, approve, configure, or publish anything.",
    inputSchema: {
      type: "object",
      properties: {
        route: {
          type: "string",
          enum: PUBLIC_ROUTES,
          description: "Canonical public BBA Agency route to open.",
        },
      },
      required: ["route"],
      additionalProperties: false,
    },
    annotations: { readOnlyHint: false },
    execute: async ({ route }) => {
      assertPublicRoute(route);
      window.location.assign(route);
      return `Opening ${route}.`;
    },
  };

  await Promise.all([
    modelContext.registerTool(siteMapTool),
    modelContext.registerTool(navigateTool),
  ]);
}
