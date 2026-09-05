import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import {
  Bell, Buildings, FileText, GearSix, House, List, Package, Palette,
  ShieldCheck, Target, UserCircle,
} from "@phosphor-icons/react";
import { Button, Drawer, SkipLink } from "@bba/ui";

const primaryNavigation = [
  { to: "/", label: "Overview", icon: House, end: true },
  { to: "/missions/msn-024", label: "Missions", icon: Target, end: false },
  { to: "/institutional-assets", label: "Institutional Assets", icon: FileText, end: false },
  { to: "/distribution-packages", label: "Distribution Packages", icon: Package, end: false },
  { to: "/governance", label: "Governance", icon: ShieldCheck, end: false },
  { to: "/institution", label: "Institution", icon: Buildings, end: false },
];

const systemNavigation = [
  { to: "/account", label: "Account", icon: UserCircle },
  { to: "/settings", label: "Settings", icon: GearSix },
  { to: "/ui-kit", label: "UI Kit", icon: Palette },
];

function SideNavigation({ onNavigate }: { onNavigate?: () => void }) {
  return <>
    <nav className="foundation-nav" aria-label="Primary navigation">
      <p>Workspace</p>
      {primaryNavigation.map(({ to, label, icon: Icon, end }) => <NavLink key={to} to={to} end={end} onClick={onNavigate}>
        <Icon size={18} weight="regular" /><span>{label}</span>
      </NavLink>)}
    </nav>
    <nav className="foundation-nav foundation-nav-system" aria-label="Account and system">
      <p>System</p>
      {systemNavigation.map(({ to, label, icon: Icon }) => <NavLink key={to} to={to} onClick={onNavigate}>
        <Icon size={18} weight="regular" /><span>{label}</span>
      </NavLink>)}
    </nav>
  </>;
}

export function BbaProductShell() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return <div className="bba-foundation-app">
    <SkipLink targetId="foundation-main" label="Skip to content" />
    <header className="foundation-global-header">
      <button className="foundation-menu-button" type="button" aria-label="Open navigation" aria-expanded={mobileMenuOpen} onClick={() => setMobileMenuOpen(true)}>
        <List size={22} weight="bold" />
      </button>
      <NavLink to="/" className="foundation-brand" aria-label="BBA Agency — Overview">
        <span>BBA</span><strong>Agency</strong>
      </NavLink>
      <div className="foundation-workspace-label"><span>Mission Workspace</span><strong>Governance Lineage</strong></div>
      <div className="foundation-global-actions">
        <label className="foundation-institution-switcher"><span>Institution</span><select defaultValue="acme"><option value="acme">Acme Institute</option><option value="atlas">Atlas Foundation</option></select></label>
        <Button variant="ghost" aria-label="Notifications"><Bell size={19} /><span className="foundation-notification-dot" /></Button>
        <NavLink to="/account" className="foundation-steward-chip"><span>AL</span><div><small>Steward</small><strong>Ana Lemos</strong></div></NavLink>
      </div>
    </header>

    <aside className="foundation-sidebar">
      <SideNavigation />
      <footer><span>UI Foundation · local data</span><strong>v0.1</strong></footer>
    </aside>

    <Drawer
      open={mobileMenuOpen}
      onOpenChange={setMobileMenuOpen}
      title="Navigation"
      description="Access workspace and system surfaces."
    >
      <div className="foundation-mobile-nav-content"><SideNavigation onNavigate={() => setMobileMenuOpen(false)} /></div>
    </Drawer>

    <main id="foundation-main" className="foundation-main" tabIndex={-1}><Outlet /></main>
  </div>;
}
