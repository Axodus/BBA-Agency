import { readFileSync, readdirSync, statSync } from "node:fs";
import { extname, join, relative, resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const targets = [
  "apps/bba-web/src/app", "apps/bba-web/src/i18n", "apps/bba-web/src/routes", "apps/bba-web/src/static-publisher",
  "apps/bba-web/test/static-publisher.test.tsx", "apps/bba-web/e2e/static-publisher.spec.ts",
  "packages/app-shell/src", "packages/app-shell/test", "packages/ui/src", "packages/ui/test",
  "packages/publisher-prototype/src", "packages/publisher-prototype/test", "packages/sdk-react/src/agency", "packages/sdk-react/test/agency-client.test.ts",
  "transport/agency-runtime/src", "transport/agency-runtime/test",
  ".rag/development/REQ-IMP-016-FE-001-STATIC-MVP-REPORT.md",
  ".rag/development/REQ-IMP-016-FE-002-ENGLISH-DEFAULT-LANGUAGE-REPORT.md",
  ".rag/architecture/EPIC-IMP-016-FRONTEND-FIRST-BACKEND-CONTRACT-DISCOVERY.md",
  ".rag/evidence/REQ-IMP-016-FE-001/README.md",
];
const extensions = new Set([".ts", ".tsx", ".js", ".mjs", ".json", ".md"]);
const portuguese = /[áàâãéêíóôõúçÁÀÂÃÉÊÍÓÔÕÚÇ]|\b(?:projeto|projetos|contexto|pacote|aprovar|rejeitar|revisão|entrega|estratégia|conteúdos?|configuração|nenhuma|falha|erro|modelo|agente|equipe|planejado|disponível|voltar|continuar|idioma|público|mensagem|fatos|termos|afirmações|limitações|observações|canais|execução|confirmação|responsável)\b/iu;
const findings = [];
function scan(path) {
  if (statSync(path).isDirectory()) { for (const entry of readdirSync(path)) scan(join(path, entry)); return; }
  if (!extensions.has(extname(path))) return;
  const lines = readFileSync(path, "utf8").split(/\r?\n/u);
  lines.forEach((line, index) => { if (portuguese.test(line) || /toLocale(?:Date|Time)?String\(\s*["']pt-BR["']/u.test(line)) findings.push(`${relative(root, path)}:${index + 1}: ${line.trim()}`); });
}
for (const target of targets) scan(resolve(root, target));
if (findings.length) { console.error("Unauthorized Portuguese product language found:\n" + findings.join("\n")); process.exit(1); }
console.log("Agency language check passed: canonical English, default locale en-US, fallback locale en-US.");
