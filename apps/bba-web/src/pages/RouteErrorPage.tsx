import { Alert, Link } from "@bba/ui";

export function RouteErrorPage() { return <main className="bba-shell-state" id="main-content"><Alert title="A página não pôde ser carregada">Tente novamente ou volte para a visão geral.</Alert><Link to="/">Voltar ao início</Link></main>; }
