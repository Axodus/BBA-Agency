import { resolve } from "node:path";
import { loadProjectContent, writeGeneratedModule } from "./project-content-lib.mjs";

const root = resolve(import.meta.dirname, "..");
const { errors, projects } = await loadProjectContent(root);

if (errors.length > 0) {
  console.error("Project content validation failed:\n" + errors.map((error) => `- ${error}`).join("\n"));
  process.exitCode = 1;
} else {
  await writeGeneratedModule(root, projects);
  console.log(`Project content validation passed: ${projects.length} files, schemaVersion 1.0.`);
}
