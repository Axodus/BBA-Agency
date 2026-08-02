import { resolve } from "node:path";
import { loadProjectContent, writeGeneratedModule } from "./project-content-lib.mjs";

const root = resolve(import.meta.dirname, "..");
const { errors, projects } = await loadProjectContent(root);

if (errors.length > 0) {
  console.error("Project content generation failed:\n" + errors.map((error) => `- ${error}`).join("\n"));
  process.exitCode = 1;
} else {
  await writeGeneratedModule(root, projects);
  console.log(`Generated typed Project content module for ${projects.length} files.`);
}
