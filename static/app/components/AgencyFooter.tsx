import Link from "next/link";

const footerLinks = {
  social: {
    github: "https://github.com/axodus",
    linkedin: "https://linkedin.com/company/axodus",
    telegram: "https://t.me/axodusfinance",
    x: "https://x.com/axodusfinance",
  },
  version: "Prototype v1",
};

const GitHubIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" style={{ width: 24, height: 24, fill: "currentColor" }}>
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
  </svg>
);

const LinkedInIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" style={{ width: 24, height: 24, fill: "currentColor" }}>
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

const XIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" style={{ width: 24, height: 24, fill: "currentColor" }}>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.261 5.636 5.903-5.636zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const TelegramIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" style={{ width: 24, height: 24, fill: "currentColor" }}>
    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
  </svg>
);

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
            <li><Link href="/">Home</Link></li>
            <li><Link href="/services">Services</Link></li>
            <li><Link href="/projects">Projects</Link></li>
            <li><Link href="/deliveries">Deliveries</Link></li>
            <li><Link href="/ai-models">AI Models</Link></li>
            <li><span aria-disabled="true">Research</span></li>
            <li><span aria-disabled="true">Campaigns</span></li>
          </ul>
        </nav>

        <nav className="agency-footer-nav" aria-label="Services">
          <h3>Services</h3>
          <ul>
            <li><Link href="/services/publisher">Publisher</Link></li>
            <li><span aria-disabled="true">Advertising <small>Coming Soon</small></span></li>
            <li><span aria-disabled="true">Scientific Writing <small>Coming Soon</small></span></li>
            <li><span aria-disabled="true">Governance <small>Coming Soon</small></span></li>
            <li><span aria-disabled="true">Research <small>Coming Soon</small></span></li>
          </ul>
        </nav>

        <nav className="agency-footer-nav" aria-label="Resources">
          <h3>Resources</h3>
          <ul>
            <li><Link href="/docs">Documentation</Link></li>
            <li><Link href="/narrative">Product Narrative</Link></li>
            <li><Link href="/architecture">Architecture</Link></li>
            <li><Link href="/changelog">Changelog</Link></li>
            <li><Link href="/help">Help Center</Link></li>
          </ul>
        </nav>

        <nav className="agency-footer-nav" aria-label="Company">
          <h3>Company</h3>
          <ul>
            <li><Link href="/about">About</Link></li>
            <li><Link href="/contact">Contact</Link></li>
            <li><Link href="/privacy">Privacy</Link></li>
            <li><Link href="/terms">Terms</Link></li>
            <li><Link href="/cookies">Cookies</Link></li>
          </ul>
        </nav>
      </div>

      <div className="agency-footer-social" aria-label="Social links">
        <a href={footerLinks.social.github} aria-label="BBA Agency on GitHub" target="_blank" rel="noopener noreferrer">
          <GitHubIcon />
        </a>
        <a href={footerLinks.social.linkedin} aria-label="BBA Agency on LinkedIn" target="_blank" rel="noopener noreferrer">
          <LinkedInIcon />
        </a>
        <a href={footerLinks.social.x} aria-label="BBA Agency on X" target="_blank" rel="noopener noreferrer">
          <XIcon />
        </a>
        <a href={footerLinks.social.telegram} aria-label="BBA Agency on Telegram" target="_blank" rel="noopener noreferrer">
          <TelegramIcon />
        </a>
      </div>

      <div className="agency-footer-bottom">
        <span>© 2026 BBA Agency. Built with coordinated AI agents.</span>
        <span>{footerLinks.version}</span>
      </div>
    </footer>
  );
}
