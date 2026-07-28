export interface NavigationItem {
  readonly label: string;
  readonly path?: string;
}

export const navigationItems: readonly NavigationItem[] = Object.freeze([
  { label: "Overview", path: "/" },
  { label: "Missions", path: "/missions" },
  { label: "Human Governance", path: "/governance" },
  { label: "AI Workforce", path: "/ai-workforce" },
  { label: "Institutional Assets", path: "/institutional-assets" },
  { label: "Knowledge / Policy", path: "/knowledge" },
  { label: "Workflow", path: "/workflows" },
  { label: "Review", path: "/reviews" },
  { label: "Publication", path: "/publications" },
  { label: "Connector", path: "/connectors" }
]);
