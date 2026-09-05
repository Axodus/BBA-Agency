import { Alert, Link } from "@bba/ui";

export function RouteErrorPage() { return <main className="bba-shell-state" id="main-content"><Alert title="The page could not be loaded">Try again or return to the overview.</Alert><Link to="/">Back to overview</Link></main>; }
