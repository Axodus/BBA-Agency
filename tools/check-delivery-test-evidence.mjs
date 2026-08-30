import { access, readFile } from "node:fs/promises";
import { constants } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "../..");
const evidenceRoot = resolve(root, ".rag/evidence/SPRINT-IMP-020");
const errors = [];
const routes = ["deliveries-index", "editorial-package", "campaign-package", "scientific-package", "institutional-package", "research-package"];
const viewports = ["desktop", "laptop", "tablet", "mobile"];
const features = ["editorial-prototype-disclosure", "artifact-grid", "review-process", "approval-summary", "version-history", "traceability", "quality-gates", "limitations", "footer", "services-submenu"];
async function required(path) { try { await access(resolve(evidenceRoot, path), constants.F_OK); } catch { errors.push(`missing evidence ${path}`); } }
for (const viewport of viewports) for (const route of routes) await required(`${viewport}/${route}.png`);
for (const fallback of ["new", "unknown", "non-existent-package"]) await required(`fallbacks/${fallback}.png`);
for (const feature of features) await required(`features/${feature}.png`);
for (const path of ["README.md", "visual-manifest.yml", "visual-acceptance.md", "accessibility/results.txt", "boundaries/results.txt", "inventory/package-mapping.yml", "routes/acceptance-matrix.md"]) await required(path);
try { const manifest = await readFile(resolve(evidenceRoot, "visual-manifest.yml"), "utf8"); if ((manifest.match(/^- route:/gm) ?? []).length !== 24) errors.push("visual manifest does not contain 24 primary entries"); if (/horizontalOverflow: true|consoleErrors: [1-9]|failedRequests: [1-9]/.test(manifest)) errors.push("visual manifest reports an automation failure"); const acceptance = await readFile(resolve(evidenceRoot, "visual-acceptance.md"), "utf8"); if (!/automated_gates: PASS/.test(acceptance) || !/visual_acceptance: PENDING/.test(acceptance) || !/overall_status: PENDING_REVIEW/.test(acceptance) || /decision: APPROVED/.test(acceptance)) errors.push("human visual acceptance status is not correctly pending"); } catch (error) { errors.push(`evidence read failure: ${error.message}`); }
if (errors.length) { console.error("Delivery test evidence check failed:\n" + errors.map((error) => `- ${error}`).join("\n")); process.exitCode = 1; } else console.log("Delivery test evidence check passed: 24 primary screenshots, fallbacks, features, and pending human acceptance.");
