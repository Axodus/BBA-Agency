export interface NavigationItem {
  readonly label: string;
  readonly path?: string;
}

export const navigationItems: readonly NavigationItem[] = Object.freeze([
  { label: "Overview", path: "/" },
  { label: "Missions", path: "/missions" },
  { label: "Human Governance" },
  { label: "AI Workforce" },
  { label: "Institutional Assets" },
  { label: "Knowledge / Policy" },
  { label: "Workflow" },
  { label: "Review" },
  { label: "Publication" },
  { label: "Connector" }
]);
