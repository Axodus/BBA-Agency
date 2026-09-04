import { Button, Drawer, SkipLink } from "@bba/ui";
import { GithubLogo, LinkedinLogo, TelegramLogo, XLogo } from "@phosphor-icons/react";
import { NavLink, Outlet } from "react-router-dom";
import { translate } from "../../i18n/index.js";
import { footerLinks } from "../../config/footer.js";

const primaryLinks = [
  { to: "/services", label: translate("navigation.services") },
  { to: "/projects", label: translate("navigation.projects") },
  { to: "/deliveries", label: translate("navigation.deliveries") },
  { to: "/settings", label: translate("navigation.aiModels") },
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
      <div className="agency-mobile-nav"><Drawer title="Navigation" description="Services, Projects, Deliveries, and Settings" trigger={<Button variant="secondary">{translate("actions.menu")}</Button>}><PrimaryNavigation /><NavLink className="agency-technical-link" to="/institution">Institution</NavLink></Drawer></div>
    </div>
  </header>;
}

export function AgencyFooter() {
  return (
    <footer className="agency-footer" aria-label="BBA Agency site footer">
      <div className="agency-footer-top">
        <div className="agency-footer-brand">
          <strong>BBA Agency</strong>
          <p>AI-powered communication and marketing services built around coordinated intelligence, human review, and trusted knowledge.</p>
        </div>

        <nav className="agency-footer-nav" aria-label="Explore">
          <h3>Explore</h3>
          <ul>
            <li><NavLink to="/">Home</NavLink></li>
            <li><NavLink to="/services">Services</NavLink></li>
            <li><NavLink to="/projects">Projects</NavLink></li>
            <li><NavLink to="/deliveries">Deliveries</NavLink></li>
            <li><NavLink to="/settings">Settings</NavLink></li>
            <li><span aria-disabled="true">Research</span></li>
            <li><span aria-disabled="true">Campaigns</span></li>
          </ul>
        </nav>

        <nav className="agency-footer-nav" aria-label="Services">
          <h3>Services</h3>
          <ul>
            <li><NavLink to="/services/publisher">Publisher</NavLink></li>
            <li><span aria-disabled="true">Advertising <small>Coming Soon</small></span></li>
            <li><span aria-disabled="true">Scientific Writing <small>Coming Soon</small></span></li>
            <li><span aria-disabled="true">Governance <small>Coming Soon</small></span></li>
            <li><span aria-disabled="true">Research <small>Coming Soon</small></span></li>
          </ul>
        </nav>

        <nav className="agency-footer-nav" aria-label="Resources">
          <h3>Resources</h3>
          <ul>
            <li><NavLink to="/docs">Documentation</NavLink></li>
            <li><NavLink to="/narrative">Product Narrative</NavLink></li>
            <li><NavLink to="/architecture">Architecture</NavLink></li>
            <li><NavLink to="/changelog">Changelog</NavLink></li>
            <li><NavLink to="/help">Help Center</NavLink></li>
          </ul>
        </nav>

        <nav className="agency-footer-nav" aria-label="Company">
          <h3>Company</h3>
          <ul>
            <li><NavLink to="/about">About</NavLink></li>
            <li><NavLink to="/contact">Contact</NavLink></li>
            <li><NavLink to="/privacy">Privacy</NavLink></li>
            <li><NavLink to="/terms">Terms</NavLink></li>
            <li><NavLink to="/cookies">Cookies</NavLink></li>
          </ul>
        </nav>
      </div>

      <div className="agency-footer-social" aria-label="Social links">
        <a href={footerLinks.social.github} aria-label="BBA Agency on GitHub" target="_blank" rel="noopener noreferrer">
          <GithubLogo aria-hidden="true" size={22} weight="fill" />
        </a>
        <a href={footerLinks.social.linkedin} aria-label="BBA Agency on LinkedIn" target="_blank" rel="noopener noreferrer">
          <LinkedinLogo aria-hidden="true" size={22} weight="fill" />
        </a>
        <a href={footerLinks.social.x} aria-label="BBA Agency on X" target="_blank" rel="noopener noreferrer">
          <XLogo aria-hidden="true" size={22} weight="fill" />
        </a>
        <a href={footerLinks.social.telegram} aria-label="BBA Agency on Telegram" target="_blank" rel="noopener noreferrer">
          <TelegramLogo aria-hidden="true" size={22} weight="fill" />
        </a>
      </div>

      <div className="agency-footer-bottom">
        <span>© 2026 BBA Agency. Built with coordinated AI agents.</span>
        <span>{footerLinks.version}</span>
      </div>
    </footer>
  );
}

export function AgencyShell() {
  return <div className="agency-static"><SkipLink /><AgencyHeader /><main id="main-content" tabIndex={-1}><Outlet /></main><AgencyFooter /></div>;
}
