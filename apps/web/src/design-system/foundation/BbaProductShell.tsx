import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import {
  Bell, Buildings, FileText, GearSix, House, List, Palette, PaperPlaneTilt,
  ShieldCheck, Target, UserCircle, X,
} from "@phosphor-icons/react";
import { Button, SkipLink } from "@bba/ui";

const primaryNavigation = [
  { to: "/foundation", label: "Visão geral", icon: House, end: true },
  { to: "/foundation/missions/msn-024", label: "Missões", icon: Target, end: false },
  { to: "/foundation/institutional-assets", label: "Institutional Assets", icon: FileText, end: false },
  { to: "/foundation/distribution-packages", label: "Distribution Packages", icon: PaperPlaneTilt, end: false },
  { to: "/foundation/governance", label: "Governança", icon: ShieldCheck, end: false },
  { to: "/foundation/institution", label: "Instituição", icon: Buildings, end: false },
];

const systemNavigation = [
  { to: "/foundation/account", label: "Conta", icon: UserCircle },
  { to: "/foundation/settings", label: "Configurações", icon: GearSix },
  { to: "/foundation/ui-kit", label: "UI Kit", icon: Palette },
];

function SideNavigation({ onNavigate }: { onNavigate?: () => void }) {
  return <>
    <nav className="foundation-nav" aria-label="Navegação principal">
      <p>Workspace</p>
      {primaryNavigation.map(({ to, label, icon: Icon, end }) => <NavLink key={to} to={to} end={end} onClick={onNavigate}>
        <Icon size={18} weight="regular" /><span>{label}</span>
      </NavLink>)}
    </nav>
    <nav className="foundation-nav foundation-nav-system" aria-label="Conta e sistema">
      <p>Sistema</p>
      {systemNavigation.map(({ to, label, icon: Icon }) => <NavLink key={to} to={to} onClick={onNavigate}>
        <Icon size={18} weight="regular" /><span>{label}</span>
      </NavLink>)}
    </nav>
  </>;
}

export function BbaProductShell() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return <div className="bba-foundation-app">
    <SkipLink targetId="foundation-main" label="Ir para o conteúdo" />
    <header className="foundation-global-header">
      <button className="foundation-menu-button" type="button" aria-label="Abrir navegação" aria-expanded={mobileMenuOpen} onClick={() => setMobileMenuOpen(true)}>
        <List size={22} weight="bold" />
      </button>
      <NavLink to="/foundation" className="foundation-brand" aria-label="BBA Agency — Visão geral">
        <span>BBA</span><strong>Agency</strong>
      </NavLink>
      <div className="foundation-workspace-label"><span>Mission Workspace</span><strong>Governance Lineage</strong></div>
      <div className="foundation-global-actions">
        <label className="foundation-institution-switcher"><span>Instituição</span><select defaultValue="acme"><option value="acme">Instituto Acme</option><option value="atlas">Fundação Atlas</option></select></label>
        <Button variant="ghost" aria-label="Notificações"><Bell size={19} /><span className="foundation-notification-dot" /></Button>
        <NavLink to="/foundation/account" className="foundation-steward-chip"><span>AL</span><div><small>Steward</small><strong>Ana Lemos</strong></div></NavLink>
      </div>
    </header>

    <aside className="foundation-sidebar">
      <SideNavigation />
      <footer><span>Fundação UI · dados locais</span><strong>v0.1</strong></footer>
    </aside>

    {mobileMenuOpen ? <div className="foundation-mobile-nav" role="dialog" aria-modal="true" aria-label="Navegação">
      <div className="foundation-mobile-nav-head"><span>BBA Agency</span><button type="button" aria-label="Fechar navegação" onClick={() => setMobileMenuOpen(false)}><X size={21} /></button></div>
      <SideNavigation onNavigate={() => setMobileMenuOpen(false)} />
    </div> : null}

    <main id="foundation-main" className="foundation-main" tabIndex={-1}><Outlet /></main>
  </div>;
}
