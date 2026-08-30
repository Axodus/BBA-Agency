export type InstitutionalLink = {
  readonly label: string;
  readonly href: string;
  readonly external?: boolean;
};

export type InstitutionalSection = {
  readonly title: string;
  readonly paragraphs: readonly string[];
  readonly items?: readonly string[];
};

export type InstitutionalPageContent = {
  readonly route: string;
  readonly group: "Resources" | "Company";
  readonly label: string;
  readonly title: string;
  readonly summary: string;
  readonly notice?: string;
  readonly sections: readonly InstitutionalSection[];
  readonly links?: readonly InstitutionalLink[];
};

const axodusHome: InstitutionalLink = {
  label: "Visit Axodus institutional site",
  href: "https://axodus.country",
  external: true,
};

export const institutionalPages = {
  documentation: {
    route: "/resources/documentation",
    group: "Resources",
    label: "Documentation",
    title: "Documentation for the BBA Agency reference experience",
    summary:
      "Use BBA Agency pages for a concise product-oriented explanation. Use Axodus documentation for the broader institutional record and supporting technical material.",
    sections: [
      {
        title: "What this website documents",
        paragraphs: [
          "This static reference website explains BBA Agency Products, illustrative Project examples, Delivery Packages, and the current limited BBA Publisher prototype boundary.",
          "It does not provide a production control plane, operational account management, external Connector execution, or a complete implementation record.",
        ],
      },
      {
        title: "Relationship to Axodus documentation",
        paragraphs: [
          "BBA Agency is an Axodus product. Axodus maintains the institutional context for its proposed ecosystem of governed, AI-native organizational platforms.",
          "When a claim needs governance, architecture, research, or institutional context beyond this site, prefer the Axodus record rather than inferring implementation details from a product page.",
        ],
      },
    ],
    links: [
      { label: "Open BBA Agency overview in Axodus Docs", href: "https://docs.axodus.country/bba-agency/overview", external: true },
      { label: "Open Axodus documentation", href: "https://docs.axodus.country", external: true },
      axodusHome,
    ],
  },
  productNarrative: {
    route: "/resources/product-narrative",
    group: "Resources",
    label: "Product Narrative",
    title: "A product narrative grounded in customer outcomes",
    summary:
      "BBA Agency presents a customer-facing way to understand coordinated AI-assisted work while keeping Human Governance visible and authoritative.",
    sections: [
      {
        title: "The product boundary",
        paragraphs: [
          "BBA Agency is an Axodus product concept for organizing institutional knowledge, Missions, AI Workforce execution, Human Governance, Institutional Assets, Channel Variants, Distribution Packages, and Audit Records.",
          "The customer-facing experience focuses on the requested outcome, context, review checkpoints, deliverables, and limitations. It does not expose internal model plumbing as the primary product story.",
        ],
      },
      {
        title: "Human authority remains explicit",
        paragraphs: [
          "AI assists specialized execution. Human Governance remains responsible for important direction, review, approval, and accountability decisions.",
          "The current BBA Publisher prototype is a limited reference experience. It does not establish external publication, active Connectors, multi-tenancy, or completion of the broader BBA Platform.",
        ],
      },
    ],
    links: [
      { label: "Explore BBA Agency Products", href: "/services" },
      { label: "View illustrative Project examples", href: "/projects" },
      axodusHome,
    ],
  },
  architecture: {
    route: "/resources/architecture",
    group: "Resources",
    label: "Architecture",
    title: "Architecture boundaries for the BBA Agency reference site",
    summary:
      "The website exposes an explanatory product surface, not a live implementation of the full BBA Platform architecture.",
    sections: [
      {
        title: "Conceptual model",
        paragraphs: [
          "A Mission is the central unit of work. Institutional Assets are canonical outputs, while Channel Variants derive from approved assets. Distribution Packages collect variants and related decisions.",
          "The broader concept includes deterministic policy retrieval, guarded workflow transitions, review findings, auditability, and a Connector boundary for external systems.",
        ],
      },
      {
        title: "What is implemented here",
        paragraphs: [
          "This Vite static site renders informational pages and illustrative content. It has no backend, account system, database, queue, credential storage, or external publishing Connector.",
          "The separately hosted BBA Publisher prototype demonstrates a bounded product flow. It should not be interpreted as evidence that the full platform architecture is deployed or production-ready.",
        ],
      },
    ],
    links: [
      { label: "Read BBA Agency documentation", href: "https://docs.axodus.country/bba-agency/overview", external: true },
      { label: "Read the Axodus institutional architecture context", href: "https://axodus.country/platforms/", external: true },
    ],
  },
  changelog: {
    route: "/resources/changelog",
    group: "Resources",
    label: "Changelog",
    title: "Reference site changelog",
    summary:
      "This record describes material changes to the informational BBA Agency website. It is not a product-release or production-status ledger.",
    notice: "Last updated: August 30, 2026.",
    sections: [
      {
        title: "Current reference-site updates",
        paragraphs: [
          "Canonical Product, Project example, and Delivery Package pages are represented in the static content catalog.",
          "The site now publishes an agent-readable llms.txt, generated sitemap.xml, robots.txt, and progressive WebMCP navigation and site-map tools when supported by the browser.",
        ],
      },
      {
        title: "Status boundary",
        paragraphs: [
          "These website changes improve discoverability and explanation. They do not add operational BBA Platform capabilities, external publication, billing, tenancy, or administration.",
        ],
      },
    ],
    links: [
      { label: "Open the sitemap", href: "/sitemap.xml" },
      { label: "Open the agent map", href: "/llms.txt" },
      { label: "Open the BBA Publisher prototype", href: "https://dev.bba.country", external: true },
    ],
  },
  helpCenter: {
    route: "/resources/help-center",
    group: "Resources",
    label: "Help Center",
    title: "Help using the BBA Agency reference site",
    summary:
      "Find the right explanatory page, understand the status labels, and distinguish this static reference site from the separately hosted BBA Publisher prototype.",
    sections: [
      {
        title: "Find the right information",
        paragraphs: [
          "Products explain the scope and customer outcome of each BBA Agency Product. Project examples show illustrative work context and decisions. Delivery Packages show the connected artifacts, review, and traceability a customer might receive.",
        ],
        items: [
          "Use Products to understand the intended service boundary.",
          "Use Project examples to understand an illustrative customer outcome.",
          "Use Delivery Packages to understand reviewed deliverables and their limitations.",
        ],
      },
      {
        title: "Understand availability and limits",
        paragraphs: [
          "Only BBA Publisher has a separately hosted functional prototype. Other Product, Project, and Package entries may describe planned or illustrative experiences.",
          "The reference site itself cannot start work, collect files, configure providers, store data, approve assets, or publish externally.",
        ],
      },
    ],
    links: [
      { label: "Explore Products", href: "/services" },
      { label: "Explore Project examples", href: "/projects" },
      { label: "Explore Delivery Packages", href: "/deliveries" },
    ],
  },
  about: {
    route: "/company/about",
    group: "Company",
    label: "About",
    title: "BBA Agency is an Axodus product",
    summary:
      "BBA Agency is a product-oriented reference experience within Axodus, a research-driven initiative for proposed AI-native organizational platforms and governed institutional work.",
    sections: [
      {
        title: "Direct institutional relationship",
        paragraphs: [
          "Axodus provides the institutional context. BBA Agency provides a product-facing surface for explaining how coordinated AI-assisted work can be organized around a customer outcome and Human Governance.",
          "The relationship does not mean every Axodus concept is implemented by this site. BBA Agency remains a bounded product concept and reference experience with explicit implementation limits.",
        ],
      },
      {
        title: "Current status",
        paragraphs: [
          "This website is static and informational. BBA Publisher is the only separately hosted functional prototype named here.",
          "Neither this site nor that prototype claims production readiness, active external Connectors, autonomous external publication, live multi-agent operation, or completion of the full BBA Platform.",
        ],
      },
    ],
    links: [
      axodusHome,
      { label: "What is Axodus?", href: "https://axodus.country/what-is-axodus/", external: true },
      { label: "Explore proposed Axodus platforms", href: "https://axodus.country/platforms/", external: true },
    ],
  },
  contact: {
    route: "/company/contact",
    group: "Company",
    label: "Contact",
    title: "Contact and public references",
    summary:
      "This static reference site does not collect contact messages, applications, files, or credentials. Use the public institutional references below for further context.",
    sections: [
      {
        title: "No contact form on this site",
        paragraphs: [
          "BBA Agency does not provide an account, inbox, help-desk workflow, or message-submission form on bba.country. Do not send sensitive information through links that are not explicitly identified as an Axodus-operated service.",
        ],
      },
      {
        title: "Where to continue",
        paragraphs: [
          "The Axodus institutional site explains the broader initiative. Axodus documentation provides the supporting record for BBA Agency and other public materials.",
        ],
      },
    ],
    links: [
      axodusHome,
      { label: "Open Axodus documentation", href: "https://docs.axodus.country", external: true },
      { label: "Open Axodus on GitHub", href: "https://github.com/Axodus", external: true },
    ],
  },
  privacy: {
    route: "/company/privacy",
    group: "Company",
    label: "Privacy",
    title: "Privacy notice for bba.country",
    summary:
      "This notice describes the limited data practices of the BBA Agency informational website. It is not a service agreement for an account-based product.",
    notice: "Last updated: August 30, 2026.",
    sections: [
      {
        title: "Information this site does not collect directly",
        paragraphs: [
          "bba.country does not provide user accounts, contact forms, payment collection, file uploads, Project creation, or credential submission. The site is an informational static website.",
        ],
      },
      {
        title: "Analytics measurement",
        paragraphs: [
          "The site loads a Google Analytics measurement tag to understand aggregate site use. Google services may process technical browser and visit information under their own terms and privacy practices.",
          "Do not treat this page as a representation that BBA Agency controls every data practice of Google, your browser, network provider, or a separately hosted site.",
        ],
      },
      {
        title: "Your choices",
        paragraphs: [
          "You can use browser controls and privacy tools to manage cookies and similar technologies. Separate websites, including axodus.country and dev.bba.country, maintain their own practices and notices.",
        ],
      },
    ],
    links: [
      { label: "Read Google's privacy policy", href: "https://policies.google.com/privacy", external: true },
      { label: "Read the cookie notice", href: "/company/cookies" },
      axodusHome,
    ],
  },
  terms: {
    route: "/company/terms",
    group: "Company",
    label: "Terms",
    title: "Terms for using the BBA Agency reference site",
    summary:
      "These terms govern use of the informational website at bba.country. They do not create an agreement for a future or separately hosted BBA product experience.",
    notice: "Last updated: August 30, 2026.",
    sections: [
      {
        title: "Informational use only",
        paragraphs: [
          "Content on this site is provided to explain a BBA Agency concept, Products, illustrative Project examples, and Delivery Packages. It is not an offer of a production service, legal advice, financial advice, security assurance, or a guarantee of third-party platform behavior.",
        ],
      },
      {
        title: "No operational reliance",
        paragraphs: [
          "Do not rely on this site as evidence that BBA Agency autonomously publishes, operates active external Connectors, supports multi-tenancy, stores account data, or has completed the BBA Platform.",
          "A separately hosted prototype has its own visible behavior and boundaries. It does not change the informational status of this website.",
        ],
      },
      {
        title: "External links",
        paragraphs: [
          "Links to Axodus, documentation, GitHub, Google, or the BBA Publisher prototype lead to separate services. Their availability and terms are outside the control of this static reference site.",
        ],
      },
    ],
    links: [
      { label: "Read the privacy notice", href: "/company/privacy" },
      { label: "Read the cookie notice", href: "/company/cookies" },
      axodusHome,
    ],
  },
  cookies: {
    route: "/company/cookies",
    group: "Company",
    label: "Cookies",
    title: "Cookie notice for bba.country",
    summary:
      "This notice explains the limited use of cookies and similar technologies on the BBA Agency informational website.",
    notice: "Last updated: August 30, 2026.",
    sections: [
      {
        title: "Analytics technologies",
        paragraphs: [
          "bba.country loads a Google Analytics measurement tag. Google Analytics may use cookies or similar technologies to measure site visits and browser interactions.",
          "The site does not provide a custom cookie-preference center, account login, checkout, or other first-party form workflow.",
        ],
      },
      {
        title: "Managing cookies",
        paragraphs: [
          "You can manage cookies through your browser settings and privacy tools. Blocking or deleting cookies may affect analytics measurement but should not prevent access to the informational pages of this static site.",
        ],
      },
      {
        title: "Separate services",
        paragraphs: [
          "Axodus, Google, GitHub, and the separately hosted BBA Publisher prototype are independent web services with their own technology and privacy practices.",
        ],
      },
    ],
    links: [
      { label: "Read the privacy notice", href: "/company/privacy" },
      { label: "Learn about Google Analytics safeguards", href: "https://support.google.com/analytics/answer/6004245", external: true },
    ],
  },
} as const satisfies Record<string, InstitutionalPageContent>;

export const institutionalPageList = Object.values(institutionalPages);
