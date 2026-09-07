import { type ReactNode, useEffect, useRef, useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { Button, Drawer, SkipLink } from "@bba/ui";

export interface ProductShellNavigationItem {
  readonly to: string;
  readonly label: string;
  readonly icon: ReactNode;
  readonly end?: boolean;
}

export interface BbaProductShellProps {
  readonly primaryNavigation: readonly ProductShellNavigationItem[];
  readonly systemNavigation: readonly ProductShellNavigationItem[];
  readonly workspaceLabel: string;
  readonly workspaceContext: string;
  readonly institution: string;
  readonly steward: { readonly initials: string; readonly name: string };
  readonly menuIcon: ReactNode;
  readonly notificationIcon: ReactNode;
}

function SideNavigation({ primaryNavigation, systemNavigation, onNavigate }: Pick<BbaProductShellProps, "primaryNavigation" | "systemNavigation"> & { readonly onNavigate?: () => void }) {
  return <>
    <nav className="foundation-nav" aria-label="Primary navigation">
      <p>Workspace</p>
      {primaryNavigation.map(({ to, label, icon, end }) => <NavLink key={to} to={to} {...(end === undefined ? {} : { end })} {...(onNavigate === undefined ? {} : { onClick: onNavigate })}>
        {icon}<span>{label}</span>
      </NavLink>)}
    </nav>
    <nav className="foundation-nav foundation-nav-system" aria-label="Account and system">
      <p>System</p>
      {systemNavigation.map(({ to, label, icon, end }) => <NavLink key={to} to={to} {...(end === undefined ? {} : { end })} {...(onNavigate === undefined ? {} : { onClick: onNavigate })}>
        {icon}<span>{label}</span>
      </NavLink>)}
    </nav>
  </>;
}

export function BbaProductShell({ primaryNavigation, systemNavigation, workspaceLabel, workspaceContext, institution, steward, menuIcon, notificationIcon }: BbaProductShellProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const main = useRef<HTMLElement>(null);
  useEffect(() => {
    const item = [...primaryNavigation, ...systemNavigation].find((item) => item.to === location.pathname || (item.to !== "/" && location.pathname.startsWith(`${item.to}/`)));
    document.title = `${item?.label ?? "BBA Agency"} · BBA Agency`;
    if (!location.hash) main.current?.focus({ preventScroll: true });
  }, [location, primaryNavigation, systemNavigation]);

  return <div className="bba-foundation-app">
    <SkipLink targetId="foundation-main" label="Skip to content" />
    <header className="foundation-global-header">
      <button className="foundation-menu-button" type="button" aria-label="Open navigation" aria-expanded={mobileMenuOpen} onClick={() => setMobileMenuOpen(true)}>
        {menuIcon}
      </button>
      <NavLink to="/" className="foundation-brand" aria-label="BBA Agency — Overview">
        <span>BBA</span><strong>Agency</strong>
      </NavLink>
      <div className="foundation-workspace-label"><span>{workspaceLabel}</span><strong>{workspaceContext}</strong></div>
      <div className="foundation-global-actions">
        <span className="foundation-institution-switcher"><span>Institution</span><strong>{institution}</strong></span>
        <Button aria-label="Notifications unavailable in local reference" disabled title="Notifications require a configured runtime." variant="ghost">{notificationIcon}</Button>
        <NavLink to="/account" className="foundation-steward-chip"><span>{steward.initials}</span><div><small>Steward</small><strong>{steward.name}</strong></div></NavLink>
      </div>
    </header>

    <aside className="foundation-sidebar">
      <SideNavigation primaryNavigation={primaryNavigation} systemNavigation={systemNavigation} />
      <footer><span>UI Foundation · local data</span><strong>v0.1</strong></footer>
    </aside>

    <Drawer open={mobileMenuOpen} onOpenChange={setMobileMenuOpen} title="Navigation" description="Access workspace and system surfaces.">
      <div className="foundation-mobile-nav-content"><SideNavigation primaryNavigation={primaryNavigation} systemNavigation={systemNavigation} onNavigate={() => setMobileMenuOpen(false)} /></div>
    </Drawer>

    <main ref={main} id="foundation-main" className="foundation-main" tabIndex={-1}><Outlet /></main>
  </div>;
}
