# BBA Agency

Static, informational reference website for the BBA Agency standalone
experience. It explains the BBA Agency concept, Products, illustrative Project
examples, and Delivery Packages. It does not execute Projects, retain customer
data, or publish externally.

## Local development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Deploy with Vercel

1. Push this directory to the root of a Git repository.
2. Import the repository in Vercel.
3. Keep the detected framework as **Vite**.
4. Use `npm run build` as the build command.
5. No environment variables are required for this prototype.

The separately hosted BBA Publisher prototype is available at
`https://dev.bba.country`. It is a limited functional prototype, not evidence
of a completed BBA Platform or active external Connectors.

## AI agent map

The deployed website serves [`/llms.txt`](/llms.txt), a Markdown index that
describes the website's scope, limitations, and primary canonical routes for
AI agents.

## Search indexing

The build generates [`/sitemap.xml`](/sitemap.xml) from fixed public routes and
the canonical Product, Project, and Delivery Package content routes. The static
[`/robots.txt`](/robots.txt) points crawlers to the sitemap.

The fixed public routes also include the canonical Resources and Company pages
linked from the footer. The Company / About page states the direct relationship:
BBA Agency is an Axodus product; Axodus provides the broader institutional
context at `https://axodus.country`.

Run the generator manually with:

```bash
npm run generate:sitemap
```

## WebMCP

When a supporting browser exposes `document.modelContext`, the website
registers two progressive WebMCP tools: one returns the canonical public site
map and one visibly opens a selected public informational page. They use JSON
Schema inputs and do not expose Project creation, approvals, credential
configuration, external Connectors, or publication. Browsers without WebMCP
continue to use the website normally.
