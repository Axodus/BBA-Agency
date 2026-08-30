import { useEffect } from "react";
import { Link } from "react-router-dom";
import type { InstitutionalLink, InstitutionalPageContent } from "../content/institutional.js";

function InstitutionalLink({ link }: { readonly link: InstitutionalLink }) {
  if (link.external) {
    return <a className="button secondary" href={link.href} target="_blank" rel="noopener noreferrer">{link.label} <span aria-hidden="true">↗</span></a>;
  }

  return <Link className="button secondary" to={link.href}>{link.label} <span aria-hidden="true">→</span></Link>;
}

export function InstitutionalPage({ page }: { readonly page: InstitutionalPageContent }) {
  useEffect(() => {
    document.title = `${page.label} | BBA Agency`;
    return () => {
      document.title = "BBA Agency";
    };
  }, [page.label]);

  return (
    <main className="institutional-page">
      <section className="page-intro institutional-page-hero container">
        <p className="section-kicker">{page.group} / BBA Agency</p>
        <h1>{page.title}</h1>
        <p>{page.summary}</p>
        {page.notice ? <p className="institutional-page-notice">{page.notice}</p> : null}
      </section>

      <section className="institutional-page-body container" aria-label={`${page.label} content`}>
        {page.sections.map((section) => (
          <article key={section.title} className="institutional-page-section">
            <h2>{section.title}</h2>
            {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            {section.items ? <ul>{section.items.map((item) => <li key={item}>{item}</li>)}</ul> : null}
          </article>
        ))}
      </section>

      {page.links?.length ? (
        <section className="institutional-page-links container" aria-label={`${page.label} related links`}>
          <h2>Related public resources</h2>
          <div>{page.links.map((link) => <InstitutionalLink key={link.href} link={link} />)}</div>
        </section>
      ) : null}
    </main>
  );
}
