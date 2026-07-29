export interface NavigationItem {
  readonly label: string;
  readonly path?: string;
}

export const navigationItems: readonly NavigationItem[] = Object.freeze([
  { label: "Como podemos ajudar?", path: "/" },
  { label: "Novo Projeto", path: "/projects/new" },
  { label: "Projetos", path: "/projects" },
  { label: "Modelos de IA", path: "/settings/ai" }
]);
