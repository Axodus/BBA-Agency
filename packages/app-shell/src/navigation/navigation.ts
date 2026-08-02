export interface NavigationItem {
  readonly label: string;
  readonly path?: string;
}

export const navigationItems: readonly NavigationItem[] = Object.freeze([
  { label: "How can we help?", path: "/" },
  { label: "New Project", path: "/projects/new" },
  { label: "Projects", path: "/projects" },
  { label: "AI Models", path: "/settings/ai" }
]);
