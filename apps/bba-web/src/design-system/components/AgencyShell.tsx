import { Button, Drawer, SkipLink } from "@bba/ui";
import { NavLink, Outlet } from "react-router-dom";
import { translate } from "../../i18n/index.js";

const primaryLinks = [
  { to: "/services", label: translate("navigation.services") },
  { to: "/projects", label: translate("navigation.projects") },
  { to: "/deliveries", label: translate("navigation.deliveries") },
  { to: "/settings/ai", label: translate("navigation.aiModels") },
] as const;

export function PrimaryNavigation() {
  return <nav aria-label="Primary navigation">{primaryLinks.map((link) => <NavLink key={link.to} to={link.to}>{link.label}</NavLink>)}</nav>;
}

export function AgencyHeader() {
  return <header className="agency-header">
    <NavLink aria-label="BBA Agency Home" className="agency-wordmark" to="/">BBA Agency</NavLink>
    <div className="agency-desktop-nav"><PrimaryNavigation /></div>
    <div className="agency-header-actions">
      <span className="agency-session" aria-label="Current session">Reference session</span>
      <NavLink className="agency-start" data-action="create-project" to="/services/publisher/new">{translate("actions.createProject")}</NavLink>
      <div className="agency-mobile-nav"><Drawer title="Navigation" description="Services, Projects, Deliveries, and AI Models" trigger={<Button variant="secondary">{translate("actions.menu")}</Button>}><PrimaryNavigation /><NavLink className="agency-technical-link" to="/platform-diagnostics">{translate("navigation.platformDiagnostics")}</NavLink></Drawer></div>
    </div>
  </header>;
}

export function AgencyFooter() {
  return <footer className="agency-footer"><strong>BBA Agency</strong><p>Communication, research, and institutional production coordinated by AI and accountable to people.</p><NavLink to="/platform-diagnostics">Technical Platform diagnostics</NavLink></footer>;
}

export function AgencyShell() {
  return <div className="agency-static"><SkipLink /><AgencyHeader /><main id="main-content" tabIndex={-1}><Outlet /></main><AgencyFooter /></div>;
}
