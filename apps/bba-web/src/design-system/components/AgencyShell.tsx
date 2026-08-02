import { Button, Drawer, SkipLink } from "@bba/ui";
import { NavLink, Outlet } from "react-router-dom";
import { translate } from "../../i18n/index.js";
import { footerLinks } from "../../config/footer.js";

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
            <li><NavLink to="/settings/ai">AI Models</NavLink></li>
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
          <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>
        </a>
        <a href={footerLinks.social.linkedin} aria-label="BBA Agency on LinkedIn" target="_blank" rel="noopener noreferrer">
          <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
        </a>
        <a href={footerLinks.social.x} aria-label="BBA Agency on X" target="_blank" rel="noopener noreferrer">
          <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.261 5.636 5.903-5.636zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
        </a>
        <a href={footerLinks.social.telegram} aria-label="BBA Agency on Telegram" target="_blank" rel="noopener noreferrer">
          <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
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
