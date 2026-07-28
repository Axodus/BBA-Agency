import { Alert, Badge, Button, Card, Drawer, NavLink, SkipLink, Spinner, useTheme, type ThemePreference } from "@bba/ui";
import { useEffect, useRef } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { navigationItems } from "./navigation/navigation.js";
import type { SessionSummary, ShellRuntimeState } from "./session/types.js";

function Navigation() {
  return <nav aria-label="Navegação principal" className="bba-shell__navigation">{navigationItems.map((item) => item.path === undefined
    ? <span className="bba-shell__planned" key={item.label}>{item.label}<Badge>Planejado</Badge></span>
    : <NavLink end={item.path === "/"} key={item.label} to={item.path}>{item.label}</NavLink>)}</nav>;
}

function ThemeSwitcher() {
  const { preference, setPreference } = useTheme();
  return <label className="bba-shell__theme"><span>Tema</span><select value={preference} onChange={(event) => setPreference(event.target.value as ThemePreference)}><option value="system">Sistema</option><option value="light">Claro</option><option value="dark">Escuro</option></select></label>;
}

function SessionIdentity({ session }: { readonly session: SessionSummary }) {
  return <div className="bba-shell__identity"><strong>{session.displayName ?? session.subject}</strong><span>{session.actorReference}</span></div>;
}

function RuntimeBoundary({ runtime }: { readonly runtime: ShellRuntimeState }) {
  if (runtime.status === "LOADING") return <main className="bba-shell-state" id="main-content"><Spinner label="Preparando sessão" /></main>;
  if (runtime.status === "CONFIGURATION_MISSING") return <main className="bba-shell-state" id="main-content"><Card><Alert title="Configuração ausente">{runtime.message}</Alert></Card></main>;
  if (runtime.status === "SESSION_ERROR") return <main className="bba-shell-state" id="main-content"><Card><Alert title="Falha ao preparar a sessão">{runtime.message}</Alert></Card></main>;
  return null;
}

export function BbaAppShell({ runtime }: { readonly runtime: ShellRuntimeState }) {
  const location = useLocation();
  const main = useRef<HTMLElement>(null);
  useEffect(() => {
    const item = navigationItems.find((candidate) => candidate.path === location.pathname || (candidate.path === "/missions" && location.pathname.startsWith("/missions/")));
    document.title = `${item?.label ?? "BBA Agency"} · BBA Agency`;
    if (location.hash === "") main.current?.focus({ preventScroll: true });
  }, [location]);
  if (runtime.status !== "READY") return <RuntimeBoundary runtime={runtime} />;
  return <div className="bba-shell"><SkipLink /><header className="bba-shell__header"><div><span className="bba-shell__eyebrow">Axodus</span><strong>BBA Agency</strong></div><div className="bba-shell__header-actions"><Badge>{runtime.tenantId}</Badge><ThemeSwitcher /><SessionIdentity session={runtime.session} /><div className="bba-shell__mobile"><Drawer title="Navegação" description="Módulos disponíveis na BBA Agency" trigger={<Button variant="secondary">Menu</Button>}><Navigation /></Drawer></div></div></header><aside className="bba-shell__sidebar"><Navigation /></aside><main className="bba-shell__main" id="main-content" ref={main} tabIndex={-1}><Outlet /></main></div>;
}
