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
